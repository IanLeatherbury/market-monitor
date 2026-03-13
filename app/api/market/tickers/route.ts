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

/** Return the two most recent weekday dates [current, previous]. */
function tradingDates(): [string, string] {
  const d = new Date();
  // Current: today if weekday, else step back to Friday
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() - 1);
  const current = d.toISOString().slice(0, 10);
  // Previous trading day
  d.setDate(d.getDate() - 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() - 1);
  const previous = d.toISOString().slice(0, 10);
  return [current, previous];
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

  const [current, previous] = tradingDates();

  // Fetch today + previous day in parallel for change% calculation
  const [curRes, prevRes] = await Promise.all([
    fetch(`${BASE}/v2/aggs/grouped/locale/us/market/stocks/${current}?adjusted=true&apiKey=${API_KEY}`),
    fetch(`${BASE}/v2/aggs/grouped/locale/us/market/stocks/${previous}?adjusted=true&apiKey=${API_KEY}`),
  ]);

  if (!curRes.ok) {
    return NextResponse.json({ error: 'Upstream API error' }, { status: curRes.status });
  }

  const curJson = await curRes.json();
  const curResults: Array<{ T: string; o: number; c: number; h: number; l: number; v: number }> =
    curJson.results ?? [];

  // Build a map of previous day closes for change% calculation
  const prevCloseMap = new Map<string, number>();
  if (prevRes.ok) {
    const prevJson = await prevRes.json();
    const prevResults: Array<{ T: string; c: number }> = prevJson.results ?? [];
    for (const r of prevResults) prevCloseMap.set(r.T, r.c);
  }

  const watchSet = new Set(WATCHLIST);
  const tickers = curResults
    .filter((r) => watchSet.has(r.T))
    .map((r) => {
      const prevClose = prevCloseMap.get(r.T);
      // Change% = (current close - previous close) / previous close
      const changePercent = prevClose
        ? parseFloat((((r.c - prevClose) / prevClose) * 100).toFixed(2))
        : parseFloat((((r.c - r.o) / r.o) * 100).toFixed(2));
      return {
        symbol: r.T,
        name: NAMES[r.T] ?? r.T,
        lastPrice: r.c,
        changePercent,
      };
    });

  // Preserve watchlist order
  tickers.sort((a, b) => WATCHLIST.indexOf(a.symbol) - WATCHLIST.indexOf(b.symbol));

  tickerCache = { data: tickers, ts: Date.now() };

  return NextResponse.json(tickers);
}
