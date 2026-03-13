'use client';

import { SectorRow } from '@/lib/types';

interface SummaryCardsProps {
  benchmark: SectorRow | null;
  leading: SectorRow | null;
  lagging: SectorRow | null;
}

function Card({
  label,
  row,
  accent,
}: {
  label: string;
  row: SectorRow | null;
  accent: string;
}) {
  if (!row) return null;
  const changeColor = row.change1D >= 0 ? 'text-green-500' : 'text-red-500';
  const prefix = row.change1D > 0 ? '+' : '';

  return (
    <div className={`rounded-lg border px-5 py-4 ${accent}`}>
      <p className="text-[10px] uppercase tracking-widest text-subtext mb-3">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-base font-semibold text-foreground leading-tight">{row.name}</p>
          <p className="text-[11px] text-subtext mt-0.5">{row.symbol}</p>
        </div>
        <div className="text-right">
          <p className="text-base font-mono text-foreground">${row.price.toFixed(2)}</p>
          <p className={`text-xs font-mono ${changeColor} mt-0.5`}>
            {prefix}{row.change1D.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export function SummaryCards({ benchmark, leading, lagging }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card label="Benchmark" row={benchmark} accent="border-border" />
      <Card label="Leading Sector" row={leading} accent="border-green-500/30" />
      <Card label="Lagging Sector" row={lagging} accent="border-red-500/30" />
    </div>
  );
}
