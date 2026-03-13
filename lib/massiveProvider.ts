import { DataProvider } from './dataProvider';
import { Ticker, PricePoint, OHLCPoint, TimeRange } from './types';

export class MassiveDataProvider implements DataProvider {
  async getTickers(): Promise<Ticker[]> {
    const res = await fetch('/api/market/tickers');
    if (!res.ok) throw new Error('Failed to fetch tickers');
    return res.json();
  }

  async getSeries(symbol: string, range: TimeRange = '1M'): Promise<PricePoint[]> {
    const ohlc = await this.getOHLC(symbol, range);
    return ohlc.map((p) => ({ timestamp: String(p.time), value: p.close }));
  }

  async getOHLC(symbol: string, range: TimeRange = '1M'): Promise<OHLCPoint[]> {
    const params = new URLSearchParams({ symbol, range });
    const res = await fetch(`/api/market/series?${params}`);
    if (!res.ok) throw new Error('Failed to fetch series');
    return res.json();
  }
}

export const massiveProvider = new MassiveDataProvider();
