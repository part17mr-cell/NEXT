import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const STORE_KEY = 'nextthon:store'

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

export async function GET() {
  const redis = getRedis()
  if (!redis) {
    return NextResponse.json({}, {
      headers: { 'Cache-Control': 's-maxage=20, stale-while-revalidate=30' },
    })
  }
  try {
    const data = await redis.get(STORE_KEY)
    return NextResponse.json(data ?? {}, {
      headers: {
        'Cache-Control': 's-maxage=20, stale-while-revalidate=30',
      },
    })
  } catch {
    return NextResponse.json({}, {
      headers: { 'Cache-Control': 's-maxage=20, stale-while-revalidate=30' },
    })
  }
}

export async function POST(request: Request) {
  const token = request.headers.get('x-store-token')
  const secret = process.env.STORE_API_SECRET
  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const redis = getRedis()
  if (!redis) {
    return NextResponse.json(
      { error: 'Redis not configured' },
      { status: 503 },
    )
  }
  try {
    const body = await request.json()
    await redis.set(STORE_KEY, body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[store API] write error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
