import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.MASSIVE_API_KEY;
const BASE = 'https://api.massive.com';

interface SectorDef {
  symbol: string;
  name: string;
}

const SECTORS: SectorDef[] = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'XLE', name: 'Energy' },
  { symbol: 'XLU', name: 'Utilities' },
  { symbol: 'XLB', name: 'Materials' },
  { symbol: 'XLP', name: 'Consumer Staples' },
  { symbol: 'XLRE', name: 'Real Estate' },
  { symbol: 'XLC', name: 'Communication Services' },
  { symbol: 'XLF', name: 'Financials' },
  { symbol: 'XLV', name: 'Health Care' },
  { symbol: 'XLK', name: 'Technology' },
  { symbol: 'XLY', name: 'Consumer Discretionary' },
  { symbol: 'XLI', name: 'Industrials' },
];

const SUB_INDUSTRIES: SectorDef[] = [
  { symbol: 'XBI', name: 'Biotech' },
  { symbol: 'XHB', name: 'Homebuilders' },
  { symbol: 'XOP', name: 'Oil & Gas E&P' },
  { symbol: 'XME', name: 'Metals & Mining' },
  { symbol: 'KRE', name: 'Regional Banks' },
  { symbol: 'XRT', name: 'Retail' },
  { symbol: 'ITB', name: 'Home Construction' },
  { symbol: 'IYT', name: 'Transportation' },
  { symbol: 'SMH', name: 'Semiconductors' },
  { symbol: 'IBB', name: 'Biotech (Broad)' },
  { symbol: 'HACK', name: 'Cybersecurity' },
  { symbol: 'TAN', name: 'Solar Energy' },
];

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function ytdStart(): string {
  const d = new Date();
  return `${d.getFullYear()}-01-02`;
}

function weekAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 8); // a bit extra to ensure we get 5 trading days
  return dateStr(d);
}

interface AggResult {
  o: number;
  c: number;
  t: number;
}

async function fetchBars(symbol: string, from: string, to: string, timespan = 'day', multiplier = 1): Promise<AggResult[]> {
  const url =
    `${BASE}/v2/aggs/ticker/${encodeURIComponent(symbol)}/range/${multiplier}/${timespan}/${from}/${to}` +
    `?adjusted=true&sort=asc&limit=500&apiKey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return json.results ?? [];
}

async function fetchPrev(symbol: string): Promise<AggResult | null> {
  const url = `${BASE}/v2/aggs/ticker/${encodeURIComponent(symbol)}/prev?apiKey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  return json.results?.[0] ?? null;
}

function pctChange(from: number, to: number): number {
  if (from === 0) return 0;
  return parseFloat((((to - from) / from) * 100).toFixed(2));
}

async function buildRow(def: SectorDef, today: string) {
  const [prev, weekBars, ytdBars] = await Promise.all([
    fetchPrev(def.symbol),
    fetchBars(def.symbol, weekAgo(), today),
    fetchBars(def.symbol, ytdStart(), today),
  ]);

  const price = prev?.c ?? 0;
  const change1D = prev ? pctChange(prev.o, prev.c) : 0;

  // 1W: from earliest bar in the week to the latest close
  const change1W =
    weekBars.length >= 2 ? pctChange(weekBars[0].o, weekBars[weekBars.length - 1].c) : 0;

  // YTD: from first trading day open to latest close
  const changeYTD =
    ytdBars.length >= 2 ? pctChange(ytdBars[0].o, ytdBars[ytdBars.length - 1].c) : 0;

  // Sparkline: last 5 daily closes from week bars
  const sparkline = weekBars.slice(-5).map((b) => b.c);

  return {
    name: def.name,
    symbol: def.symbol,
    price,
    change1D,
    change1W,
    changeYTD,
    sparkline,
  };
}

// In-memory cache: group -> { data, timestamp }
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'MASSIVE_API_KEY not set' }, { status: 500 });
  }

  const { searchParams } = request.nextUrl;
  const group = searchParams.get('group') ?? 'sectors';
  const forceRefresh = searchParams.get('refresh') === 'true';

  // Return cached data if fresh
  const cached = cache.get(group);
  if (!forceRefresh && cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const defs = group === 'sub-industries' ? SUB_INDUSTRIES : SECTORS;

  const today = dateStr(new Date());
  const rows = await Promise.all(defs.map((def) => buildRow(def, today)));

  // Sort by 1D change descending (best performing first)
  rows.sort((a, b) => b.change1D - a.change1D);

  cache.set(group, { data: rows, ts: Date.now() });

  return NextResponse.json(rows);
}
