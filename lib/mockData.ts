import { DataProvider } from './dataProvider';
import { Ticker, PricePoint, TimeRange } from './types';

const MOCK_TICKERS: string[] = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'BRK.B', 'TSM', 'UNH',
  'JNJ', 'JPM', 'XOM', 'V', 'PG', 'MA', 'HD', 'CVX', 'ABBV', 'MRK'
];

const NAMES: Record<string, string> = {
  'AAPL': 'Apple Inc.', 'MSFT': 'Microsoft Corp', 'GOOGL': 'Alphabet Inc.', 'AMZN': 'Amazon.com',
  'NVDA': 'NVIDIA Corp', 'TSLA': 'Tesla Inc.', 'META': 'Meta Platforms', 'BRK.B': 'Berkshire Hathaway',
  'TSM': 'Taiwan Semi', 'UNH': 'UnitedHealth', 'JNJ': 'Johnson & Johnson', 'JPM': 'JPMorgan Chase',
  'XOM': 'Exxon Mobil', 'V': 'Visa Inc.', 'PG': 'Procter & Gamble', 'MA': 'Mastercard Inc.',
  'HD': 'Home Depot', 'CVX': 'Chevron Corp', 'ABBV': 'AbbVie Inc.', 'MRK': 'Merck & Co.'
};

function generateTickers(): Ticker[] {
  return MOCK_TICKERS.map(symbol => ({
    symbol,
    name: NAMES[symbol] || symbol,
    lastPrice: parseFloat((Math.random() * 500 + 50).toFixed(2)),
    changePercent: parseFloat(((Math.random() * 4) - 2).toFixed(2))
  }));
}

function generateSeries(basePrice: number): PricePoint[] {
  const points: PricePoint[] = [];
  let currentPrice = basePrice;
  const now = new Date();
  // Generate 60 points (e.g., simplistic intraday)
  for (let i = 60; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 10 * 60 * 1000); // 10 min intervals
    const change = (Math.random() - 0.5) * (basePrice * 0.005); // Small volatility
    currentPrice += change;
    points.push({
      timestamp: time.toISOString(), // Simplified, formatting will happen in UI
      value: parseFloat(currentPrice.toFixed(2))
    });
  }
  return points;
}

// Generate data once (singleton behavior for the module)
const tickers = generateTickers();

export class MockDataProvider implements DataProvider {
  async getTickers(): Promise<Ticker[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return tickers;
  }

  async getSeries(symbol: string, range: TimeRange = '1D'): Promise<PricePoint[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const ticker = tickers.find(t => t.symbol === symbol);
    const basePrice = ticker ? ticker.lastPrice : 150;
    // Generate fresh random series each time for demo effect, or could cache.
    // Spec says "smooth transitions", stable data might be better?
    // Let's generate consistent seed based on symbol?
    // For now random is fine for visual demo as long as it looks like a graph.
    return generateSeries(basePrice);
  }
}

export const mockProvider = new MockDataProvider();
