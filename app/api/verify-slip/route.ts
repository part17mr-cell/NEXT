import { NextResponse } from 'next/server'

// EasySlip API — https://easyslip.com/
// Set EASYSLIP_API_KEY in Vercel environment variables
const EASYSLIP_API = 'https://developer.easyslip.com/api/v1/verify'
const EASYSLIP_KEY = process.env.EASYSLIP_API_KEY || ''

export async function POST(request: Request) {
  try {
    if (!EASYSLIP_KEY) {
      return NextResponse.json(
        { ok: false, error: 'ยังไม่ได้ตั้งค่า EASYSLIP_API_KEY ในระบบ' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { slip_data } = body as { slip_data: string }

    if (!slip_data) {
      return NextResponse.json({ ok: false, error: 'ไม่มีข้อมูลสลิป' }, { status: 400 })
    }

    // Convert base64 data URL to blob for FormData
    const base64 = slip_data.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64, 'base64')
    const mimeMatch = slip_data.match(/^data:(image\/\w+);base64,/)
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'

    const formData = new FormData()
    const blob = new Blob([buffer], { type: mime })
    formData.append('file', blob, 'slip.jpg')

    const res = await fetch(EASYSLIP_API, {
      method: 'POST',
      headers: { Authorization: `Bearer ${EASYSLIP_KEY}` },
      body: formData,
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { ok: false, error: `EasySlip API error: ${res.status}`, detail: text },
        { status: res.status }
      )
    }

    const data = await res.json()

    // Normalize EasySlip response to our format
    const result = {
      ok: true,
      verified: data.status === 200,
      transRef: data.data?.transRef || null,
      date: data.data?.date || null,
      amount: data.data?.amount?.amount || null,
      currency: data.data?.amount?.local?.currency || 'THB',
      sender: {
        name: data.data?.sender?.bank?.name || null,
        account: data.data?.sender?.account?.value || null,
        bank: data.data?.sender?.bank?.short || null,
      },
      receiver: {
        name: data.data?.receiver?.displayName || null,
        account: data.data?.receiver?.account?.value || null,
        bank: data.data?.receiver?.bank?.short || null,
      },
      raw: data,
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[verify-slip]', err)
    return NextResponse.json(
      { ok: false, error: 'เกิดข้อผิดพลาดภายในระบบ' },
      { status: 500 }
    )
  }
}
