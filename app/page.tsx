'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChartPanel } from '@/components/ChartPanel';
import { MarketOverview } from '@/components/MarketOverview';
import { massiveProvider } from '@/lib/massiveProvider';
import { Ticker, OHLCPoint, Tab, TimeRange } from '@/lib/types';
import { RefreshCw } from 'lucide-react';

function TopNav({ activeTab, onTabChange, onRefresh }: { activeTab: Tab; onTabChange: (t: Tab) => void; onRefresh: () => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Market' },
    { key: 'chart', label: 'Charts' },
  ];

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
      <div className="flex-shrink-0">
        <h1 className="text-base font-bold text-foreground">Market Monitor</h1>
        <p className="text-[11px] text-subtext">Market Dashboard</p>
      </div>

      <nav className="flex items-center gap-1 rounded-full border border-border bg-background px-1 py-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors outline-none
              ${activeTab === t.key
                ? 'bg-foreground text-background'
                : 'text-subtext hover:text-foreground'
              }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="text-xs text-subtext hidden sm:block">{dateStr}, {timeStr}</span>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-subtext transition-colors hover:text-foreground hover:border-foreground/30"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>
    </header>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [chartData, setChartData] = useState<OHLCPoint[]>([]);
  const [chartRange, setChartRange] = useState<TimeRange>('1M');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load tickers for the chart tab
  useEffect(() => {
    async function loadTickers() {
      try {
        const allTickers = await massiveProvider.getTickers();
        setTickers(allTickers);
        if (allTickers.length > 0 && !selectedSymbol) {
          setSelectedSymbol(allTickers[0].symbol);
        }
      } catch (error) {
        console.error("Failed to load tickers", error);
      } finally {
        setLoading(false);
      }
    }
    loadTickers();
  }, [refreshKey]);

  // Fetch chart data when selection or range changes
  useEffect(() => {
    if (!selectedSymbol) return;
    let active = true;

    async function fetchData() {
       try {
         const series = await massiveProvider.getOHLC(selectedSymbol, chartRange);
         if (active) {
           setChartData(series);
         }
       } catch (error) {
         console.error("Failed to load series", error);
       }
    }
    fetchData();

    return () => { active = false; };
  }, [selectedSymbol, chartRange]);

  const selectedTicker = tickers.find(t => t.symbol === selectedSymbol);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  if (loading) {
     return (
       <div className="flex h-screen w-full flex-col bg-background text-foreground">
         <TopNav activeTab={activeTab} onTabChange={setActiveTab} onRefresh={handleRefresh} />
         <div className="flex flex-1 items-center justify-center text-subtext font-mono text-sm">
           Initializing Market Monitor...
         </div>
       </div>
     );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden font-sans">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} onRefresh={handleRefresh} />

      {activeTab === 'overview' && (
        <main className="flex-1 overflow-hidden bg-background">
          <MarketOverview key={refreshKey} forceRefresh={refreshKey > 0} />
        </main>
      )}

      {activeTab === 'chart' && (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            tickers={tickers}
            selectedSymbol={selectedSymbol}
            onSelect={setSelectedSymbol}
          />
          {selectedTicker ? (
            <main className="flex-1 overflow-hidden bg-background">
              <div className="mx-auto max-w-7xl h-full">
                <ChartPanel ticker={selectedTicker} data={chartData} range={chartRange} onRangeChange={setChartRange} />
              </div>
            </main>
          ) : (
            <div className="flex flex-1 items-center justify-center text-subtext">
              Select a ticker
            </div>
          )}
        </div>
      )}
    </div>
  );
}

