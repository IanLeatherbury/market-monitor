import { DataProvider } from './dataProvider';
import { Ticker, PricePoint, TimeRange } from './types';

export class MassiveDataProvider implements DataProvider {
  async getTickers(): Promise<Ticker[]> {
    const res = await fetch('/api/market/tickers');
    if (!res.ok) throw new Error('Failed to fetch tickers');
    return res.json();
  }

  async getSeries(symbol: string, range: TimeRange = '1M'): Promise<PricePoint[]> {
    const params = new URLSearchParams({ symbol, range });
    const res = await fetch(`/api/market/series?${params}`);
    if (!res.ok) throw new Error('Failed to fetch series');
    return res.json();
  }
}

export const massiveProvider = new MassiveDataProvider();
