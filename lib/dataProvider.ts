import { Ticker, PricePoint, OHLCPoint, TimeRange } from './types';

export interface DataProvider {
  getTickers(): Promise<Ticker[]>;
  getSeries(symbol: string, range?: TimeRange): Promise<PricePoint[]>;
  getOHLC(symbol: string, range?: TimeRange): Promise<OHLCPoint[]>;
}
