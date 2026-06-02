import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// ── Tabscanner ────────────────────────────────────────────────
const TABSCANNER_PROCESS = 'https://api.tabscanner.com/api/2/process'
const TABSCANNER_RESULT  = 'https://api.tabscanner.com/api/result'

// ── EasySlip ──────────────────────────────────────────────────
const EASYSLIP_API = 'https://developer.easyslip.com/api/v1/verify'

// ── Resolve API keys: env vars first, then Redis settings as fallback ─────
async function resolveKeys(): Promise<{ tabscannerKey: string; easyslipKey: string }> {
  const envTabscanner = process.env.TABSCANNER_API_KEY || ''
  const envEasyslip   = process.env.EASYSLIP_API_KEY   || ''
  if (envTabscanner || envEasyslip) {
    return { tabscannerKey: envTabscanner, easyslipKey: envEasyslip }
  }
  // Fallback: read from Redis store settings
  try {
    const redis = Redis.fromEnv()
    const data = await redis.get('nextthon:store') as Record<string, unknown> | null
    const slipApi = (data?.settings as Record<string, unknown> | undefined)?.slipApi as Record<string, string> | undefined
    return {
      tabscannerKey: slipApi?.tabscannerKey || '',
      easyslipKey:   slipApi?.easyslipKey   || '',
    }
  } catch {
    return { tabscannerKey: '', easyslipKey: '' }
  }
}

// Shared result type
interface SlipResult {
  ok: boolean
  verified: boolean
  provider: 'tabscanner' | 'easyslip' | 'qr'
  transRef?: string | null
  date?: string | null
  amount?: number | null
  sendingBank?: string | null
  receivingBank?: string | null
  sender?: string | null
  receiver?: string | null
  error?: string
  raw?: unknown
}

// ── Helpers ───────────────────────────────────────────────────
function base64ToBlob(slip_data: string): { blob: Blob; ext: string } {
  const base64 = slip_data.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')
  const mimeMatch = slip_data.match(/^data:(image\/\w+);base64,/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const ext  = mime.split('/')[1] || 'jpg'
  return { blob: new Blob([buffer], { type: mime }), ext }
}

async function tabscannerPoll(token: string, apiKey: string, attempts = 18, delay = 800): Promise<Record<string, unknown> | null> {
  for (let i = 0; i < attempts; i++) {
    await new Promise(r => setTimeout(r, i === 0 ? 1000 : delay))
    const res = await fetch(`${TABSCANNER_RESULT}/${token}`, {
      headers: { Authorization: apiKey },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json() as Record<string, unknown>
    if (data.status !== 'pending') return data
  }
  return null
}

// ── Provider: Tabscanner ──────────────────────────────────────
async function verifyWithTabscanner(slip_data: string, apiKey: string): Promise<SlipResult> {
  const { blob, ext } = base64ToBlob(slip_data)
  const form = new FormData()
  form.append('file', blob, `slip.${ext}`)
  form.append('document_type', 'receipt')  // hint: Thai bank slip / receipt

  const submitRes = await fetch(TABSCANNER_PROCESS, {
    method: 'POST',
    headers: { Authorization: apiKey },
    body: form,
  })

  if (!submitRes.ok) {
    throw new Error(`Tabscanner submit HTTP ${submitRes.status}`)
  }

  const submitData = await submitRes.json() as Record<string, unknown>
  if (submitData.status !== 'success' || !submitData.token) {
    throw new Error('Tabscanner: ไม่ได้รับ token')
  }

  const result = await tabscannerPoll(submitData.token as string, apiKey)
  if (!result || result.status !== 'success') {
    throw new Error('Tabscanner: อ่านสลิปไม่สำเร็จ หรือหมดเวลา')
  }

  const d = (result.data || {}) as Record<string, unknown>
  return {
    ok: true,
    verified: true,
    provider: 'tabscanner',
    transRef:      (d.transRef      as string) || null,
    date:          (d.date          as string) || null,
    amount:        (d.amount        as number) || null,
    sendingBank:   (d.sendingBank   as string) || null,
    receivingBank: (d.receivingBank as string) || null,
    sender:        (d.sender        as string) || null,
    receiver:      (d.receiver      as string) || null,
    raw: result,
  }
}

// ── Provider: EasySlip ────────────────────────────────────────
async function verifyWithEasySlip(slip_data: string, apiKey: string): Promise<SlipResult> {
  const { blob, ext } = base64ToBlob(slip_data)
  const form = new FormData()
  form.append('file', blob, `slip.${ext}`)

  const res = await fetch(EASYSLIP_API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  })

  if (!res.ok) throw new Error(`EasySlip HTTP ${res.status}`)

  const data = await res.json() as Record<string, unknown>
  if ((data.status as number) !== 200) {
    throw new Error(`EasySlip: ${data.message || 'ไม่สำเร็จ'}`)
  }

  const d = (data.data || {}) as Record<string, unknown>
  const amount = (d.amount as Record<string, unknown> | undefined)
  const sender = (d.sender as Record<string, unknown> | undefined)
  const receiver = (d.receiver as Record<string, unknown> | undefined)
  const senderBank = (sender?.bank as Record<string, unknown> | undefined)
  const receiverBank = (receiver?.bank as Record<string, unknown> | undefined)

  return {
    ok: true,
    verified: true,
    provider: 'easyslip',
    transRef:      (d.transRef as string) || null,
    date:          (d.date     as string) || null,
    amount:        (amount?.amount as number) || null,
    sendingBank:   (senderBank?.short   as string) || null,
    receivingBank: (receiverBank?.short  as string) || null,
    sender:        (sender?.displayName as string) || (senderBank?.name as string) || null,
    receiver:      (receiver?.displayName as string) || null,
    raw: data,
  }
}

// ── QR-based Thai slip parser (free, no API key) ─────────────────────────────
// Thai bank slips embed EMV QR / PromptPay payload with transaction data
function parseThaiSlipQR(qr: string): SlipResult | null {
  try {
    // Thai slip QR typically contains: amount, ref, date, sender/receiver
    // Format varies per bank but common patterns:
    // - Contains numeric amount like "3000.00" or "3000"
    // - Contains transaction reference (8-15 digit number)
    const amountMatch = qr.match(/(\d{1,7}(?:\.\d{2})?)/)
    const refMatch    = qr.match(/[0-9]{8,15}/)
    const dateMatch   = qr.match(/(\d{4}[-/]\d{2}[-/]\d{2})|(\d{2}[-/]\d{2}[-/]\d{4})/)

    if (!amountMatch) return null  // no amount → can't verify

    const amount = parseFloat(amountMatch[1])
    if (isNaN(amount) || amount <= 0) return null

    return {
      ok: true,
      verified: true,
      provider: 'qr',
      transRef: refMatch ? refMatch[0] : null,
      date: dateMatch ? dateMatch[0] : null,
      amount,
      sendingBank: null,
      receivingBank: null,
      sender: null,
      receiver: null,
      raw: { qr_raw: qr },
    }
  } catch {
    return null
  }
}

// ── Main handler ──────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json() as { slip_data?: string; qr_data?: string }
    const { slip_data, qr_data } = body

    if (!slip_data) {
      return NextResponse.json({ ok: false, error: 'ไม่มีข้อมูลสลิป' }, { status: 400 })
    }

    // ① Try QR code parse first (free, instant — no API needed)
    if (qr_data) {
      const qrResult = parseThaiSlipQR(qr_data)
      if (qrResult) {
        console.log('[verify-slip] QR scan success:', qrResult.amount, qrResult.transRef)
        return NextResponse.json(qrResult)
      }
    }

    const { tabscannerKey, easyslipKey } = await resolveKeys()
    const hasTabscanner = !!tabscannerKey
    const hasEasySlip   = !!easyslipKey

    if (!hasTabscanner && !hasEasySlip) {
      return NextResponse.json(
        { ok: false, error: 'ยังไม่ได้ตั้งค่า API Key (ตั้งใน Admin → ตั้งค่า → API สลิป)' },
        { status: 503 }
      )
    }

    const errors: string[] = []

    // ① Try Tabscanner first (if key available)
    if (hasTabscanner) {
      try {
        const result = await verifyWithTabscanner(slip_data, tabscannerKey)
        return NextResponse.json(result)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        console.warn('[verify-slip] Tabscanner failed:', msg)
        errors.push(`Tabscanner: ${msg}`)
      }
    }

    // ② Fallback to EasySlip
    if (hasEasySlip) {
      try {
        const result = await verifyWithEasySlip(slip_data, easyslipKey)
        return NextResponse.json(result)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        console.warn('[verify-slip] EasySlip failed:', msg)
        errors.push(`EasySlip: ${msg}`)
      }
    }

    // Both failed
    return NextResponse.json(
      { ok: false, error: 'ตรวจสลิปไม่สำเร็จ', detail: errors },
      { status: 422 }
    )
  } catch (err) {
    console.error('[verify-slip]', err)
    return NextResponse.json({ ok: false, error: 'เกิดข้อผิดพลาดภายในระบบ' }, { status: 500 })
  }
}
