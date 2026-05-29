import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()
const STORE_KEY = 'nextthon:store'

export async function GET() {
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
  try {
    const body = await request.json()
    await redis.set(STORE_KEY, body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[store API] write error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
