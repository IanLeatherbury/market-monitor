import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.MASSIVE_API_KEY;
const BASE = 'https://api.massive.com';

const RANGE_CONFIG: Record<string, { multiplier: number; timespan: string; days: number }> = {
  '1D': { multiplier: 5, timespan: 'minute', days: 1 },
  '1W': { multiplier: 1, timespan: 'hour', days: 7 },
  '1M': { multiplier: 1, timespan: 'day', days: 30 },
  '3M': { multiplier: 1, timespan: 'day', days: 90 },
  '1Y': { multiplier: 1, timespan: 'week', days: 365 },
};

export async function GET(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'MASSIVE_API_KEY not set' }, { status: 500 });
  }

  const { searchParams } = request.nextUrl;
  const symbol = searchParams.get('symbol');
  const range = searchParams.get('range') ?? '1M';

  if (!symbol || !/^[A-Z.]{1,10}$/.test(symbol)) {
    return NextResponse.json({ error: 'Invalid symbol' }, { status: 400 });
  }

  const config = RANGE_CONFIG[range] ?? RANGE_CONFIG['1M'];
  const to = new Date();
  const from = new Date(to.getTime() - config.days * 24 * 60 * 60 * 1000);

  const fromStr = from.toISOString().slice(0, 10);
  const toStr = to.toISOString().slice(0, 10);

  const url =
    `${BASE}/v2/aggs/ticker/${encodeURIComponent(symbol)}/range/${config.multiplier}/${config.timespan}/${fromStr}/${toStr}` +
    `?adjusted=true&sort=asc&limit=5000&apiKey=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json({ error: 'Upstream API error' }, { status: res.status });
  }

  const json = await res.json();
  const results: Array<{ c: number; t: number }> = json.results ?? [];

  const series = results.map((r) => ({
    timestamp: new Date(r.t).toISOString(),
    value: r.c,
  }));

  return NextResponse.json(series);
}
