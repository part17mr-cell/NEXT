import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()
const STORE_KEY = 'nextthon:store'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await redis.set(STORE_KEY, body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[store-sync] write error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
