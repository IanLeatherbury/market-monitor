# Data Model: Market Dashboard

## Entities

### Ticker
Represents a tradeable asset displayed in the sidebar.

```typescript
interface Ticker {
  symbol: string;      // e.g., "AAPL"
  name: string;        // e.g., "Apple Inc."
  lastPrice: number;   // e.g., 150.25
  changePercent: number; // e.g., 1.25 (for +1.25%)
}
```

### PricePoint
A single data point for the chart.

```typescript
interface PricePoint {
  timestamp: string;   // ISO date string or lightweight time label
  value: number;       // Closing price
}
```

### TimeRange (Future Use)
Supported ranges for data fetching.

```typescript
type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y';
```
