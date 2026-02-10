# Data Provider Interface Contract

This interface defines the boundary between the UI components and the data fetching logic (Mock or Real).

```typescript
// specs/001-market-dashboard/contracts/DataProvider.ts

import { Ticker, PricePoint, TimeRange } from './types'; // Conceptual import

export interface DataProvider {
  /**
   * Fetches the list of all available tickers.
   */
  getTickers(): Promise<Ticker[]>;

  /**
   * Fetches historical price data for a specific ticker.
   * @param symbol The ticker symbol (e.g., "AAPL")
   * @param range The time range to fetch (default '1D')
   */
  getSeries(symbol: string, range?: TimeRange): Promise<PricePoint[]>;
}
```
