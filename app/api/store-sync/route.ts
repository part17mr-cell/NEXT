import { NextResponse } from 'next/server'
import { getRedis, writeStore } from '../_store-redis'

// Generous safety ceiling only to reject obviously broken/abusive payloads.
// Normal stores (even with several GIFs) sync fine via chunking.
const MAX_PAYLOAD_BYTES = 30_000_000

export async function POST(request: Request) {
  const redis = getRedis()
  if (!redis) {
    return NextResponse.json(
      { error: 'Redis not configured — set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN' },
      { status: 503 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const byteLength = new TextEncoder().encode(JSON.stringify(body ?? {})).length
  if (byteLength > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: 'payload_too_large', bytes: byteLength, limit: MAX_PAYLOAD_BYTES },
      { status: 413 },
    )
  }

  try {
    const bytes = await writeStore(redis, body)
    return NextResponse.json({ ok: true, bytes })
  } catch (error) {
    console.error('[store-sync] write error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
