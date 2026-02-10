# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

A single-page investment research dashboard built with Next.js App Router and TypeScript, featuring a sidebar of 20 stock tickers and a main chart panel driven by mocked data. The design replicates Vercel's sleek, dark aesthetic.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Framework**: Next.js 14+ (App Router)  
**Styling**: Tailwind CSS (Dark Mode first)  
**Components**: React Server Components (where possible) + Client Components (for interactivity)  
**State Management**: React `useState` for ticker selection (lifted state or URL params not strictly needed for single view, but selection state required)  
**Data Source**: Internal Mock Data (Phase 1) -> External API (Phase 2)  
**Charts**: Recharts (for MVP customizability) or TradingView Lightweight Charts (financial standard)  

## Constitution Check

**[I. TypeScript First]**: Enforced via `tsconfig.json` and strict mode.  
**[II. Component-Based Architecture]**: Modular design (`Sidebar`, `ChartPanel`, `LayoutShell`).  
**[III. File-Based Routing]**: `app/page.tsx` as the single entry point.  
**[IV. Performance & Core Web Vitals]**: minimal client-side JS for static parts, optimized chart rendering.  
**[V. Accessibility & Standards]**: Semantic HTML for lists and interactive elements.  

**Violation Checks**:  
- None detected. The plan strictly aligns with the constitution.

## Gates

- [x] **Gate 1**: Technical Context populated (Dependencies, versions, constraints)
- [x] **Gate 2**: Constitution Check passed (No principle violations)
- [ ] **Gate 3**: Research Complete (All [NEEDS CLARIFICATION] resolved) - *Pending Phase 0*
- [ ] **Gate 4**: Design & Contracts Complete (Data model, API spec, quickstart) - *Pending Phase 1*
  
**Primary Dependencies**: React 18, Recharts, Lucide React (icons)
**Storage**: N/A (In-memory mock data)
**Testing**: Manual verification per User Stories
**Target Platform**: Modern Web Browsers
**Project Type**: Single Page Web App
**Performance Goals**: <500ms chart update
**Constraints**: No external APIs (Phase 1), No Persistence
**Scale/Scope**: 20 Mocked Tickers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**[I. TypeScript First]**: Enforced via `tsconfig.json` and strict mode.  
**[II. Component-Based Architecture]**: Modular design (`Sidebar`, `ChartPanel`, `LayoutShell`).  
**[III. File-Based Routing]**: `app/page.tsx` as the single entry point.  
**[IV. Performance & Core Web Vitals]**: minimal client-side JS for static parts, optimized chart rendering.  
**[V. Accessibility & Standards]**: Semantic HTML for lists and interactive elements.

## Project Structure

### Documentation (this feature)

```text
specs/001-market-dashboard/
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Type definitions
├── quickstart.md        # Run instructions
└── contracts/           # Interface definitions
```

### Source Code

```text
app/
├── globals.css          # Tailwind & Theme variables
├── layout.tsx           # Root layout
├── page.tsx             # Main dashboard page
└── components/
    ├── Sidebar.tsx      # Ticker list
    ├── ChartPanel.tsx   # Visualizer
    └── ui/              # Reusable primitives (Card, Button)
lib/
├── mockData.ts          # Generated static data
└── types.ts             # Shared interfaces
```

## Proposed Steps

### Phase 1: MVP & Foundation

#### 1. Scaffold & Baseline
- [ ] Initialize Next.js app with TypeScript and App Router
- [ ] Install Tailwind CSS and configure `tailwind.config.ts`
- [ ] Clean up default `page.tsx` and `globals.css`
- [ ] **Verification**: `npm run dev` shows a clean blank page with dark background.

#### 2. Design System Basics
- [ ] Define dark theme standard colors (background, surface, border, primary text, secondary text) in `globals.css`/`tailwind.config.ts`
- [ ] Create `ui/Panel` component (border, background, rounded corners)
- [ ] **Verification**: Render a sample Panel with correct colors.

#### 3. Mock Data Layer
- [ ] Create `lib/types.ts` (Ticker, PricePoint)
- [ ] Create `lib/mockData.ts` generator functions
- [ ] Generate 20 tickers with realistic-looking random walking price series
- [ ] **Verification**: Console log generated data to verify structure.

#### 4. Sidebar Component
- [ ] Create `components/Sidebar.tsx`
- [ ] Implement `TickerItem` sub-component with hover states
- [ ] Render list of 20 tickers from mock data
- [ ] specific active state styling for selected ticker
- [ ] **Verification**: List renders, hover works, "selected" style works visually.

#### 5. Chart Panel (MVP)
- [ ] Install `recharts`
- [ ] Create `components/ChartPanel.tsx`
- [ ] Implement basic LineChart using Recharts and mock data
- [ ] Style axes and tooltip to match "Vercel dark" aesthetic (minimalist)
- [ ] **Verification**: Chart renders data for a hardcoded ticker.

#### 6. Integration & Polish
- [ ] Integrate Sidebar and ChartPanel in `app/page.tsx`
- [ ] Implement state management (`useState<Ticker>`) to link selection
- [ ] Add smooth transitions (if possible with ease) or instant snappy updates
- [ ] Ensure responsive layout (Sidebar collapses or stacks on mobile?) -> Spec says "Single page", keep side-by-side for desktop.
- [ ] **Verification**: Clicking sidebar updates chart instantly.

### Phase 2: Data Access Seam (Preparation for Real Data)

#### 7. Data Provider Pattern
- [ ] Define `DataProvider` interface in `lib/dataProvider.ts`
- [ ] Create `MockProvider` implementing the interface using `mockData.ts`
- [ ] Refactor `page.tsx` to use `MockProvider` instead of direct import
- [ ] **Verification**: App behaves exactly the same, but data fetching is async-ready.
