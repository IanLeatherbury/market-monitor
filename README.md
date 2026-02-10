# Market Monitor

A modern, single-page investment research dashboard built with Next.js, designed as a clean product demo with a sleek, dark aesthetic inspired by Vercel's design system.

## Features

- **Interactive Dashboard**: Real-time chart visualization for selected stock tickers.
- **Stock Ticker Sidebar**: Browse 20 mocked stock tickers with visual performance indicators.
- **Dynamic Charting**: Smooth transitions and interactivity using Recharts.
- **Dark Mode First**: A polished, "developer-grade" dark theme using Tailwind CSS variables.
- **Responsive Layout**: Optimized for desktop and tablet viewing.
- **Keyboard Navigation**: Fully accessible sidebar navigation.

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data**: In-memory mocked data generator (simulating async fetching).

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/market-monitor.git
   cd market-monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

```text
market-monitor/
├── app/
│   ├── components/         # React components
│   │   ├── Sidebar.tsx     # Ticker list navigation
│   │   ├── ChartPanel.tsx  # Main visualization area
│   │   └── LayoutShell.tsx # Main application wrapper
│   ├── globals.css         # Global styles & Tailwind theme
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Application entry point
├── lib/
│   ├── mockData.ts         # Mock data generator (Simulated API)
│   ├── types.ts            # TypeScript interfaces (Ticker, PricePoint)
│   └── dataProvider.ts     # Data fetching abstraction
├── specs/                  # Project specifications & plans
└── public/                 # Static assets
```

## Development

This project uses a standard Next.js workflow.

- **Linting**: `npm run lint`
- **Building**: `npm run build`
- **Starting Production**: `npm start`

## Future Phases

- **Phase 2**: Integration with real market data APIs (Massive/TradingView).
- **Phase 3**: Enhanced charting capabilities using TradingView libraries.

## License

MIT
