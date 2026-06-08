import { Redis } from '@upstash/redis'

/**
 * Generation-based chunked store persistence.
 *
 * Upstash's REST endpoint caps a single request at ~1 MB on the free tier, so a
 * store blob that embeds base64 images/GIFs cannot be written as one value.
 * We split the serialized blob into sub-1 MB chunks written under a per-write
 * "generation" id, then flip a small meta pointer once every chunk is in place.
 * Readers always resolve a complete generation — never a half-written mix — and
 * the previous generation is cleaned up afterwards.
 */

const META_KEY = 'nextthon:store:meta'
const LEGACY_KEY = 'nextthon:store'
const CHUNK_CHARS = 500_000 // ~500 KB/chunk → request stays well under the 1 MB cap

type Meta = { n: number; gen: string }

export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

const chunkKey = (gen: string, i: number) => `nextthon:store:${gen}:${i}`

export async function readStore(redis: Redis): Promise<unknown> {
  const meta = await redis.get<Meta>(META_KEY)
  // Legacy single-key store (pre-chunking) or empty.
  if (!meta?.n || !meta.gen) {
    return (await redis.get(LEGACY_KEY)) ?? {}
  }
  let serialized = ''
  for (let i = 0; i < meta.n; i++) {
    const part = await redis.get<string>(chunkKey(meta.gen, i))
    if (part == null) {
      // generation incomplete (mid-write race or cleanup) — fall back safely
      return (await redis.get(LEGACY_KEY)) ?? {}
    }
    serialized += part
  }
  try {
    return JSON.parse(serialized)
  } catch {
    return {}
  }
}

export async function writeStore(redis: Redis, data: unknown): Promise<number> {
  const serialized = JSON.stringify(data ?? {})
  const chunks: string[] = []
  for (let i = 0; i < serialized.length; i += CHUNK_CHARS) {
    chunks.push(serialized.slice(i, i + CHUNK_CHARS))
  }
  if (chunks.length === 0) chunks.push('{}')

  const gen = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  const prev = await redis.get<Meta>(META_KEY)

  // Write every chunk first (each its own sub-1MB request)…
  for (let i = 0; i < chunks.length; i++) {
    await redis.set(chunkKey(gen, i), chunks[i])
  }
  // …then atomically flip the pointer to the new, fully-written generation.
  await redis.set(META_KEY, { n: chunks.length, gen } satisfies Meta)

  // Clean up the previous generation's chunks.
  if (prev?.gen && prev.gen !== gen) {
    for (let i = 0; i < prev.n; i++) await redis.del(chunkKey(prev.gen, i))
  }
  return serialized.length
}
