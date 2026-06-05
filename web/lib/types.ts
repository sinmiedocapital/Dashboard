export type Signal = {
  id: string
  created_at: string
  action: 'buy' | 'sell' | 'tp1' | 'sl_hit'
  symbol: string
  tf: string
  entry: number
  sl: number
  tp1: number
  tp2: number
  zone: string
  candle: string
  result: 'Win TP1' | 'Loss SL' | null
}
