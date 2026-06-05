import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret')
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const db = supabaseAdmin()
  const { action, symbol, tf, entry, sl, tp1, tp2, zone, candle } = body as Record<string, string | number>

  if (action === 'buy' || action === 'sell') {
    const { error } = await db.from('signals').insert({
      action,
      symbol,
      tf: String(tf),
      entry: Number(entry),
      sl: Number(sl),
      tp1: Number(tp1),
      tp2: Number(tp2),
      zone: zone ?? null,
      candle: candle ?? null,
      result: null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'tp1' || action === 'sl_hit') {
    const result = action === 'tp1' ? 'Win TP1' : 'Loss SL'
    const direction = action === 'tp1' ? ['buy', 'sell'] : ['buy', 'sell']
    const { data: open } = await db
      .from('signals')
      .select('id')
      .eq('symbol', symbol)
      .in('action', direction)
      .is('result', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (open) {
      await db.from('signals').update({ result }).eq('id', open.id)
    }
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: true })
}
