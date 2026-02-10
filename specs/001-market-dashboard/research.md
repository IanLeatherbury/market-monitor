# Research: Market Dashboard

## Technology Choices

### Charting Library
**Decision**: Recharts
**Rationale**:
- **Customizability**: Fully declarative React components using SVG, allowing complete control over styling to match the specific "Vercel dark mode" aesthetic.
- **Simplicity**: Easier to integrate and style than canvas-based financial libraries (like TradingView Lightweight) for a "demo/visual" use case.
- **Dependencies**: Well-maintained, standard React ecosystem choice.
**Alternatives considered**:
- *TradingView Lightweight Charts*: Excellent for financial data, but canvas-based rendering is harder to style perfectly to a custom design system without effort. Better for Phase 3.
- *Custom SVG*: Too low-level for axes and competitive rendering; unnecessary rework.

### Styling & Design System
**Decision**: Tailwind CSS with Custom "Vercel-esque" Tokens
**Rationale**:
- **Speed**: Utility classes allow rapid iteration on spacing and typography.
- **Consistency**: Defining colors in `tailwind.config.ts` ensures global strictness.
**Tokens**:
- `bg-background`: `#0a0a0a` (Main dark bg)
- `bg-surface`: `#111111` (Sidebar/Panels)
- `border-border`: `#333333` (Subtle borders)
- `text-primary`: `#ededed` (High contrast text)
- `text-secondary`: `#888888` (Muted metadata)
- `accent`: `#ffffff` or `#333333` (Restrained monochrome)

## Unknowns Resolved

- **"Simple Chart"**: Defined as Recharts for Phase 1 MVP.
- **"Mock Data Structure"**: Will use a simple JSON-like structure in TypeScript files (`lib/mockData.ts`) rather than a local database or complex generator.
- **"Data Provider Interface"**: Defined as a Promise-based interface to simulate async fetching, even for sync mock data, to prepare for Phase 2.
