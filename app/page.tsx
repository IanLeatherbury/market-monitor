'use client';

import React, { useEffect, useState } from 'react';
import { LayoutShell } from '@/components/LayoutShell';
import { Sidebar } from '@/components/Sidebar';
import { ChartPanel } from '@/components/ChartPanel';
import { mockProvider } from '@/lib/mockData';
import { Ticker, PricePoint } from '@/lib/types';

export default function Home() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [chartData, setChartData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    async function loadTickers() {
      try {
        const allTickers = await mockProvider.getTickers();
        setTickers(allTickers);
        if (allTickers.length > 0) {
          setSelectedSymbol(allTickers[0].symbol);
        }
      } catch (error) {
        console.error("Failed to load tickers", error);
      } finally {
        setLoading(false);
      }
    }
    loadTickers();
  }, []);

  // Fetch chart data when selection changes
  useEffect(() => {
    if (!selectedSymbol) return;
    
    // Simple cancellation flag or just ignore race for MVP (mock data is fast)
    let active = true;

    async function fetchData() {
       try {
         const series = await mockProvider.getSeries(selectedSymbol);
         if (active) {
           setChartData(series);
         }
       } catch (error) {
         console.error("Failed to load series", error);
       }
    }
    fetchData();

    return () => { active = false; };
  }, [selectedSymbol]);

  const selectedTicker = tickers.find(t => t.symbol === selectedSymbol);

  if (loading && tickers.length === 0) {
     return (
       <LayoutShell>
         <div className="flex h-full w-full items-center justify-center bg-background text-subtext font-mono">
           Initializing Market Monitor...
         </div>
       </LayoutShell>
     );
  }

  return (
    <LayoutShell>
       <Sidebar 
          tickers={tickers} 
          selectedSymbol={selectedSymbol} 
          onSelect={setSelectedSymbol} 
       />
       {selectedTicker ? (
         <main className="flex-1 overflow-hidden bg-background">
           <ChartPanel ticker={selectedTicker} data={chartData} />
         </main>
       ) : (
         <div className="flex flex-1 items-center justify-center text-subtext">
            Select a ticker
         </div>
       )}
    </LayoutShell>
  );
}

