import { NextRequest, NextResponse } from 'next/server';

const OPENAI_KEY = process.env.OPEN_AI_API_KEY;

interface SectorInput {
  name: string;
  symbol: string;
  price: number;
  change1D: number;
  change1W: number;
  changeYTD: number;
}

// In-memory cache
let cache: { data: string; ts: number } | null = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  if (!OPENAI_KEY) {
    return NextResponse.json({ error: 'OPEN_AI_API_KEY not set' }, { status: 500 });
  }

  const { sectors, subIndustries, forceRefresh } = await request.json() as {
    sectors: SectorInput[];
    subIndustries: SectorInput[];
    forceRefresh?: boolean;
  };

  if (!forceRefresh && cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json({ summary: cache.data });
  }

  const today = new Date().toISOString().slice(0, 10);

  const sectorLines = sectors
    .map((s) => `${s.name} (${s.symbol}): $${s.price.toFixed(2)}, 1D ${s.change1D > 0 ? '+' : ''}${s.change1D}%, 1W ${s.change1W > 0 ? '+' : ''}${s.change1W}%, YTD ${s.changeYTD > 0 ? '+' : ''}${s.changeYTD}%`)
    .join('\n');

  const subLines = subIndustries
    .map((s) => `${s.name} (${s.symbol}): $${s.price.toFixed(2)}, 1D ${s.change1D > 0 ? '+' : ''}${s.change1D}%, 1W ${s.change1W > 0 ? '+' : ''}${s.change1W}%, YTD ${s.changeYTD > 0 ? '+' : ''}${s.changeYTD}%`)
    .join('\n');

  const prompt = `You are a concise market analyst. Given today's sector and sub-industry ETF performance data (${today}), write 4-5 short bullet points summarizing the key market themes, notable rotations, and what traders should pay attention to. Be specific about which sectors are leading/lagging and why it matters. Keep each bullet to 1-2 sentences max. Do not use markdown formatting — just plain text bullets.

SECTOR ETFS:
${sectorLines}

SUB-INDUSTRY ETFS:
${subLines}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('OpenAI error:', err);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 502 });
  }

  const json = await res.json();
  const summary: string = json.choices?.[0]?.message?.content ?? '';

  cache = { data: summary, ts: Date.now() };

  return NextResponse.json({ summary });
}
