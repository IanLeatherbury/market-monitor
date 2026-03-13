import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.MASSIVE_API_KEY;
const BASE = 'https://api.massive.com';

const WATCHLIST = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'BRK.B', 'TSM', 'UNH',
  'JNJ', 'JPM', 'XOM', 'V', 'PG', 'MA', 'HD', 'CVX', 'ABBV', 'MRK',
];

const NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.', MSFT: 'Microsoft Corp', GOOGL: 'Alphabet Inc.', AMZN: 'Amazon.com',
  NVDA: 'NVIDIA Corp', TSLA: 'Tesla Inc.', META: 'Meta Platforms', 'BRK.B': 'Berkshire Hathaway',
  TSM: 'Taiwan Semi', UNH: 'UnitedHealth', JNJ: 'Johnson & Johnson', JPM: 'JPMorgan Chase',
  XOM: 'Exxon Mobil', V: 'Visa Inc.', PG: 'Procter & Gamble', MA: 'Mastercard Inc.',
  HD: 'Home Depot', CVX: 'Chevron Corp', ABBV: 'AbbVie Inc.', MRK: 'Merck & Co.',
};

/** Return the most recent weekday as YYYY-MM-DD. */
function lastWeekday(): string {
  const d = new Date();
  // Step back from "today" until we hit a weekday
  d.setDate(d.getDate() - 1); // start from yesterday
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() - 1);
  }
  return d.toISOString().slice(0, 10);
}

let tickerCache: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'MASSIVE_API_KEY not set' }, { status: 500 });
  }

  const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';
  if (!forceRefresh && tickerCache && Date.now() - tickerCache.ts < CACHE_TTL) {
    return NextResponse.json(tickerCache.data);
  }

  const date = lastWeekday();
  const url = `${BASE}/v2/aggs/grouped/locale/us/market/stocks/${date}?adjusted=true&apiKey=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json({ error: 'Upstream API error' }, { status: res.status });
  }

  const json = await res.json();
  const results: Array<{ T: string; o: number; c: number; h: number; l: number; v: number }> =
    json.results ?? [];

  const watchSet = new Set(WATCHLIST);
  const tickers = results
    .filter((r) => watchSet.has(r.T))
    .map((r) => ({
      symbol: r.T,
      name: NAMES[r.T] ?? r.T,
      lastPrice: r.c,
      changePercent: parseFloat((((r.c - r.o) / r.o) * 100).toFixed(2)),
    }));

  // Preserve watchlist order
  tickers.sort((a, b) => WATCHLIST.indexOf(a.symbol) - WATCHLIST.indexOf(b.symbol));

  tickerCache = { data: tickers, ts: Date.now() };

  return NextResponse.json(tickers);
}
