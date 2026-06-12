import { NextResponse } from 'next/server'
import { getRedis, readStore, writeStore } from '../_store-redis'

export async function GET(request: Request) {
  const light = new URL(request.url).searchParams.get('light')
  const redis = getRedis()
  if (!redis) {
    return NextResponse.json({}, {
      headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=120' },
    })
  }
  try {
    const data = (await readStore(redis)) as Record<string, unknown> | null
    // Light response = only orders/members (tiny). Keeps the live polls from
    // re-transferring the whole image-heavy store and blowing origin bandwidth.
    if (light) {
      return NextResponse.json(
        { orders: data?.orders ?? [], members: data?.members ?? [] },
        { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=120' } },
      )
    }
    return NextResponse.json(data ?? {}, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
    })
  } catch {
    return NextResponse.json({}, {
      headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=120' },
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
    return NextResponse.json({ error: 'Redis not configured' }, { status: 503 })
  }
  try {
    const body = await request.json()
    const bytes = await writeStore(redis, body)
    return NextResponse.json({ ok: true, bytes })
  } catch (error) {
    console.error('[store API] write error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
