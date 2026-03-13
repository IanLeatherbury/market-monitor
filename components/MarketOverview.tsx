'use client';

import React, { useEffect, useState } from 'react';
import { SectorRow } from '@/lib/types';
import { SummaryCards } from './SummaryCards';
import { SectorTable } from './SectorTable';

export function MarketOverview({ forceRefresh = false }: { forceRefresh?: boolean }) {
  const [sectors, setSectors] = useState<SectorRow[]>([]);
  const [subIndustries, setSubIndustries] = useState<SectorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const qs = forceRefresh ? '&refresh=true' : '';
      try {
        const [secRes, subRes] = await Promise.all([
          fetch(`/api/market/sectors?group=sectors${qs}`),
          fetch(`/api/market/sectors?group=sub-industries${qs}`),
        ]);
        if (secRes.ok) setSectors(await secRes.json());
        if (subRes.ok) setSubIndustries(await subRes.json());
      } catch (err) {
        console.error('Failed to load market overview', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-subtext font-mono text-sm">
        Loading market data...
      </div>
    );
  }

  const benchmark = sectors.find((s) => s.symbol === 'SPY') ?? null;
  const sectorOnly = sectors.filter((s) => s.symbol !== 'SPY');
  const leading = sectorOnly.length > 0 ? sectorOnly[0] : null;
  const lagging = sectorOnly.length > 0 ? sectorOnly[sectorOnly.length - 1] : null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-5xl">
          <SummaryCards benchmark={benchmark} leading={leading} lagging={lagging} />
          <SectorTable title="Sector Performance" rows={sectors} sortKey="1D" />
          <SectorTable title="Sub-Industry Performance" rows={subIndustries} sortKey="1D" />
        </div>
      </div>
      <footer className="border-t border-border px-6 py-3 text-center text-[11px] text-subtext">
        Market Monitor &middot; Powered by Massive
      </footer>
    </div>
  );
}
