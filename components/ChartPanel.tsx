'use client';

import { PricePoint, Ticker } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartPanelProps {
  ticker: Ticker;
  data: PricePoint[];
}

export function ChartPanel({ ticker, data }: ChartPanelProps) {
  // Protect against empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full flex-1 items-center justify-center p-6 text-subtext">
        No data available
      </div>
    );
  }

  const minVal = Math.min(...data.map(d => d.value));
  const maxVal = Math.max(...data.map(d => d.value));
  const padding = (maxVal - minVal) * 0.1 || 1; // prevent 0 range

  // Vercel style: often uses specific brand colors, but green/red financial convention is better here
  const color = ticker.changePercent >= 0 ? '#22c55e' : '#ef4444'; 

  return (
    <div className="flex h-full flex-1 flex-col p-6 lg:p-10">
       <header className="mb-8 border-b border-border pb-6">
         <div className="flex items-baseline gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{ticker.symbol}</h1>
            <span className="text-lg text-subtext">{ticker.name}</span>
         </div>
         <div className="mt-2 flex items-baseline gap-4">
            <span className="text-4xl font-mono text-foreground">${ticker.lastPrice.toFixed(2)}</span>
            <span className={`text-lg font-mono ${ticker.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {ticker.changePercent > 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
            </span>
         </div>
       </header>
       
       <div className="flex-1 w-full min-h-0">
         <ResponsiveContainer width="100%" height="100%">
           <LineChart data={data}>
             <XAxis 
                dataKey="timestamp" 
                hide 
             />
             <YAxis 
                domain={[minVal - padding, maxVal + padding]} 
                hide 
             />
             <Tooltip
               content={({ active, payload, label }) => {
                 if (active && payload && payload.length && label !== undefined) {
                   return (
                     <div className="rounded border border-border bg-surface p-2 shadow-lg">
                       <p className="font-mono text-xs text-subtext">
                        {new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </p>
                       <p className="font-mono text-sm font-bold text-foreground">
                         ${Number(payload[0].value).toFixed(2)}
                       </p>
                     </div>
                   );
                 }
                 return null;
               }}
               cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }}
             />
             <Line
               type="monotone"
               dataKey="value"
               stroke={color} 
               strokeWidth={2}
               dot={false}
               activeDot={{ r: 4, fill: color, stroke: '#0a0a0a', strokeWidth: 2 }}
               animationDuration={500}
             />
           </LineChart>
         </ResponsiveContainer>
       </div>
    </div>
  );
}
