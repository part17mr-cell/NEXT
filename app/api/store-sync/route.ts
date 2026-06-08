import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const STORE_KEY = 'nextthon:store'

// Upstash REST rejects bodies above ~1 MB on the free tier. Base64 product
// images can push the serialized store past that, which surfaces to the admin
// as "ซิงค์ล้มเหลว". We guard the size here and return an actionable error.
const MAX_PAYLOAD_BYTES = 1_000_000

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

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

  const serialized = JSON.stringify(body)
  const byteLength = new TextEncoder().encode(serialized).length
  if (byteLength > MAX_PAYLOAD_BYTES) {
    console.error(`[store-sync] payload too large: ${byteLength} bytes`)
    return NextResponse.json(
      {
        error: 'payload_too_large',
        bytes: byteLength,
        limit: MAX_PAYLOAD_BYTES,
        message: 'ข้อมูลใหญ่เกินไป — รูปสินค้าที่อัปโหลดมีขนาดรวมเกิน 1MB ลองลดจำนวนรูปหรือใช้ลิงก์รูปแทนการอัปโหลด',
      },
      { status: 413 },
    )
  }

  try {
    // Pass the object — @upstash/redis serializes internally. Passing the
    // pre-stringified value here would double-encode it.
    await redis.set(STORE_KEY, body)
    return NextResponse.json({ ok: true, bytes: byteLength })
  } catch (error) {
    console.error('[store-sync] write error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
