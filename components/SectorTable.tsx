'use client';

import { SectorRow } from '@/lib/types';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return <div className="h-7 w-16" />;
  const points = data.map((v, i) => ({ v, i }));
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pad = (max - min) * 0.1 || 0.5;

  return (
    <div className="ml-auto h-7 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <YAxis domain={[min - pad, max + pad]} hide />
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChangeCell({ value }: { value: number }) {
  const color = value >= 0 ? 'text-green-500' : 'text-red-500';
  const prefix = value > 0 ? '+' : '';
  return (
    <td className={`px-4 py-3.5 text-right font-mono text-xs ${color}`}>
      {prefix}{value.toFixed(2)}%
    </td>
  );
}

interface SectorTableProps {
  title: string;
  rows: SectorRow[];
  sortKey: string;
}

export function SectorTable({ title, rows, sortKey }: SectorTableProps) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-subtext">{title}</h2>
        <span className="text-[11px] text-subtext">Sorted by {sortKey}</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-widest text-subtext">
              <th className="px-4 py-2.5 text-left font-medium">Sector</th>
              <th className="px-4 py-2.5 text-right font-medium">Price</th>
              <th className="px-4 py-2.5 text-right font-medium">1D</th>
              <th className="px-4 py-2.5 text-right font-medium">1W</th>
              <th className="px-4 py-2.5 text-right font-medium">YTD</th>
              <th className="px-4 py-2.5 text-right font-medium">5D</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const sparkColor = row.sparkline.length >= 2
                ? (row.sparkline[row.sparkline.length - 1] >= row.sparkline[0] ? '#22c55e' : '#ef4444')
                : '#888';
              return (
                <tr key={row.symbol} className="border-b border-border last:border-b-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-foreground text-sm">{row.name}</span>
                    <span className="ml-2 text-[11px] text-subtext">{row.symbol}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-sm text-foreground">
                    ${row.price.toFixed(2)}
                  </td>
                  <ChangeCell value={row.change1D} />
                  <ChangeCell value={row.change1W} />
                  <ChangeCell value={row.changeYTD} />
                  <td className="px-4 py-3.5">
                    <Sparkline data={row.sparkline} color={sparkColor} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
