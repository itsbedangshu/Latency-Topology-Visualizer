export type Provider = 'AWS' | 'GCP' | 'Azure'
export type Exchange = 'Binance' | 'Bybit' | 'OKX' | 'Deribit' | 'Coinbase' | 'Kraken'

export interface ServerNode {
  id: string
  exchange: Exchange
  provider: Provider
  region: string
  lat: number
  lon: number
}

export interface CloudRegion {
  id: string
  provider: Provider
  region: string
  lat: number
  lon: number
}

export interface LatencySample {
  fromId: string
  toId: string
  latencyMs: number
  timestamp: number
}

export interface HistoricalSeriesPoint {
  t: number
  min: number
  max: number
  avg: number
}
