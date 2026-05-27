import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// Upstash Redis — requires env vars:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
const redis = Redis.fromEnv()
const STORE_KEY = 'nextthon:store'

export async function GET() {
  try {
    const data = await redis.get(STORE_KEY)
    return NextResponse.json(data ?? {}, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return NextResponse.json({}, { headers: { 'Cache-Control': 'no-store' } })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await redis.set(STORE_KEY, body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[store API] write error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
