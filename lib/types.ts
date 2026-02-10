export interface Ticker {
  symbol: string;
  name: string;
  lastPrice: number;
  changePercent: number;
}

export interface PricePoint {
  timestamp: string;
  value: number;
}

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y';
