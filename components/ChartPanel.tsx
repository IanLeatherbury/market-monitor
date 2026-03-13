'use client';

import React, { useRef, useEffect } from 'react';
import { OHLCPoint, Ticker, TimeRange } from '@/lib/types';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries, ColorType, LineStyle } from 'lightweight-charts';

interface ChartPanelProps {
  ticker: Ticker;
  data: OHLCPoint[];
  range: TimeRange;
  onRangeChange: (r: TimeRange) => void;
}

const RANGES: TimeRange[] = ['1D', '1W', '1M', '3M', '1Y'];

// How many bars to DISPLAY for each range (null = show all, i.e. intraday)
const VISIBLE_BARS: Record<TimeRange, number | null> = {
  '1D': null,
  '1W': null,
  '1M': 22,
  '3M': 65,
  '1Y': 252,
};

const INTRADAY_RANGES = new Set<TimeRange>(['1D', '1W']);

type TimeValue = string | number;

function calcSMA(data: OHLCPoint[], period: number): { time: TimeValue; value: number }[] {
  const result: { time: TimeValue; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += data[j].close;
    result.push({ time: data[i].time, value: sum / period });
  }
  return result;
}

function calcEMA(data: OHLCPoint[], period: number): { time: TimeValue; value: number }[] {
  if (data.length < period) return [];
  const k = 2 / (period + 1);
  let sum = 0;
  for (let i = 0; i < period; i++) sum += data[i].close;
  let ema = sum / period;
  const result: { time: TimeValue; value: number }[] = [{ time: data[period - 1].time, value: ema }];
  for (let i = period; i < data.length; i++) {
    ema = data[i].close * k + ema * (1 - k);
    result.push({ time: data[i].time, value: ema });
  }
  return result;
}

const MA_CONFIG = [
  { type: 'ema', period: 10, color: '#2196F3', label: 'EMA 10' },
  { type: 'ema', period: 20, color: '#FF9800', label: 'EMA 20' },
  { type: 'sma', period: 50, color: '#E91E63', label: 'SMA 50' },
  { type: 'ema', period: 150, color: '#9C27B0', label: 'EMA 150' },
  { type: 'sma', period: 200, color: '#2962FF', label: 'SMA 200' },
];

export function ChartPanel({ ticker, data, range, onRangeChange }: ChartPanelProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const isIntraday = INTRADAY_RANGES.has(range);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container || data.length === 0) return;

    // Determine visible window
    const visibleCount = VISIBLE_BARS[range] ?? data.length;
    const visibleData = data.slice(Math.max(0, data.length - visibleCount));
    const firstVisibleTime = visibleData[0].time;

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: '#000000' },
        textColor: '#666',
        fontFamily: 'monospace',
      },
      grid: {
        vertLines: { color: '#111', style: LineStyle.Dashed },
        horzLines: { color: '#111', style: LineStyle.Dashed },
      },
      crosshair: {
        vertLine: { color: '#555', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#1e1e1e' },
        horzLine: { color: '#555', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#1e1e1e' },
      },
      rightPriceScale: {
        borderColor: '#1e1e1e',
      },
      timeScale: {
        borderColor: '#1e1e1e',
        timeVisible: isIntraday,
      },
      width: container.clientWidth,
      height: container.clientHeight,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    candleSeries.setData(visibleData.map((d) => ({
      time: d.time as any,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    })));

    // Add moving averages (only for daily ranges — computed on FULL data, trimmed to visible)
    if (!isIntraday) {
      for (const ma of MA_CONFIG) {
        // Compute on full data for proper lookback
        const fullMA = ma.type === 'ema' ? calcEMA(data, ma.period) : calcSMA(data, ma.period);
        // Trim to visible window
        const visibleMA = fullMA.filter((p) =>
          typeof p.time === 'string' && typeof firstVisibleTime === 'string'
            ? p.time >= firstVisibleTime
            : p.time >= firstVisibleTime
        );
        if (visibleMA.length > 0) {
          const maSeries = chart.addSeries(LineSeries, {
            color: ma.color,
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: false,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          maSeries.setData(visibleMA as any);
        }
      }
    }

    // Volume
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' as const },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    volumeSeries.setData(visibleData.map((d) => ({
      time: d.time as any,
      value: d.volume,
      color: d.close >= d.open ? 'rgba(38,166,154,0.25)' : 'rgba(239,83,80,0.25)',
    })));

    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data, range, isIntraday]);

  // Compute latest MA values for the legend (from full data, daily only)
  const maValues = isIntraday
    ? []
    : MA_CONFIG.map((ma) => {
        const fullMA = ma.type === 'ema' ? calcEMA(data, ma.period) : calcSMA(data, ma.period);
        const last = fullMA.length > 0 ? fullMA[fullMA.length - 1].value : null;
        return { ...ma, value: last };
      });

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{ticker.symbol}</h1>
                <span className="text-sm text-subtext">{ticker.name}</span>
              </div>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-2xl font-mono text-foreground">${ticker.lastPrice.toFixed(2)}</span>
                <span className={`text-sm font-mono ${ticker.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {ticker.changePercent > 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-border p-1">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => onRangeChange(r)}
                  className={`rounded px-3 py-1 text-xs font-mono font-medium transition-colors outline-none
                    ${range === r
                      ? 'bg-foreground text-background'
                      : 'text-subtext hover:text-foreground'
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="relative flex-1 min-h-0">
        {/* MA legend overlay — only for daily ranges */}
        {maValues.length > 0 && (
          <div className="absolute top-2 left-3 z-10 flex flex-col gap-0.5 text-[11px] font-mono">
            {maValues.map((ma) => (
              <div key={ma.label} className="flex items-center gap-1.5">
                <span className="text-subtext">{ma.label}</span>
                {ma.value !== null && (
                  <span style={{ color: ma.color }}>{ma.value.toFixed(2)}</span>
                )}
              </div>
            ))}
          </div>
        )}
        <div ref={chartContainerRef} className="h-full w-full" />
      </div>
    </div>
  );
}
