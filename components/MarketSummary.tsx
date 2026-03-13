'use client';

import React from 'react';

interface MarketSummaryProps {
  summary: string | null;
  loading: boolean;
  date: string;
}

export function MarketSummary({ summary, loading, date }: MarketSummaryProps) {
  const bullets = summary
    ? summary
        .split('\n')
        .map((l) => l.replace(/^[\s•\-\*·]+/, '').trim())
        .filter((l) => l.length > 0)
    : [];

  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3 mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-subtext">
          AI Market Summary
        </h2>
        <span className="text-[11px] text-subtext">{date}</span>
      </div>
      <div className="rounded-lg border border-border px-6 py-5">
        {loading ? (
          <p className="text-sm text-subtext animate-pulse">Generating market summary...</p>
        ) : bullets.length > 0 ? (
          <ul className="space-y-3">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-sm text-subtext leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-subtext/50" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-subtext">No summary available.</p>
        )}
      </div>
    </div>
  );
}
