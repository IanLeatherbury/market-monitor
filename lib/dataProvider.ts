import { Ticker, PricePoint, TimeRange } from './types';

export interface DataProvider {
  getTickers(): Promise<Ticker[]>;
  getSeries(symbol: string, range?: TimeRange): Promise<PricePoint[]>;
}
