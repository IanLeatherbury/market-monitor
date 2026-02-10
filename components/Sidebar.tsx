import { Ticker } from '@/lib/types';
import React from 'react';

interface SidebarProps {
  tickers: Ticker[];
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
}

export function Sidebar({ tickers, selectedSymbol, onSelect }: SidebarProps) {
  return (
    <aside className="hidden h-full w-64 flex-shrink-0 flex-col gap-2 overflow-y-auto border-r border-border bg-surface p-2 md:flex">
      <div className="mb-4 px-2 py-2 font-semibold tracking-tight text-foreground">
        Market Monitor
      </div>
      <div className="flex flex-col gap-0.5">
        {tickers.map((ticker) => {
           const isSelected = selectedSymbol === ticker.symbol;
           return (
            <button
              key={ticker.symbol}
              onClick={() => onSelect(ticker.symbol)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(ticker.symbol);
                }
              }}
              className={`flex w-full items-center justify-between rounded px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-1 focus-visible:ring-foreground
                ${
                  isSelected
                    ? 'bg-foreground font-medium text-background' 
                    : 'text-subtext hover:bg-white/5 hover:text-foreground'
                }
              `}
            >
              <span className="font-mono">{ticker.symbol}</span>
              <span 
                className={`font-mono text-xs ${
                  isSelected 
                    ? (ticker.changePercent >= 0 ? 'text-green-600' : 'text-red-600') // Darker for white bg
                    : (ticker.changePercent >= 0 ? 'text-green-400' : 'text-red-400') // Lighter for dark bg
                }`}
              >
                {ticker.changePercent > 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
              </span>
            </button>
           );
        })}
      </div>
    </aside>
  );
}
