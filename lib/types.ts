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

export interface SectorRow {
  name: string;
  symbol: string;
  price: number;
  change1D: number;
  change1W: number;
  changeYTD: number;
  sparkline: number[]; // 5D close prices
}

export type Tab = 'overview' | 'chart';
