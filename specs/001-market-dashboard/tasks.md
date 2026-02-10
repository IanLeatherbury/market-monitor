# Tasks: Market Dashboard

**Feature Branch**: `001-market-dashboard`
**Status**: Draft

## Phase 1: Setup
*Goal: Initialize project structure and dependencies*

- [ ] T001 Initialize Next.js app with TypeScript and App Router in `.`
- [ ] T002 Install and configure Tailwind CSS in `tailwind.config.ts` and `app/globals.css`
- [ ] T003 Clean up default `app/page.tsx` and removed unused styles

## Phase 2: Foundational
*Goal: Core data structures, theming, and shared components needed for all stories*

- [ ] T004 Define Vercel-style dark theme tokens in `tailwind.config.ts`
- [ ] T005 [P] Create UI primitives (Panel) in `components/ui/Panel.tsx`
- [ ] T006 Create data models (Ticker, PricePoint) in `lib/types.ts`
- [ ] T007 Define DataProvider interface in `lib/dataProvider.ts`
- [ ] T008 Create Mock Data Generator and MockProvider in `lib/mockData.ts`

## Phase 3: View Default Ticker Chart (US1)
*Goal: User can see a chart for a default ticker immediately upon loading*
*Priority: P1*

- [ ] T009 [US1] Create basic Sidebar component in `components/Sidebar.tsx` (renders list from provider)
- [ ] T010 [US1] Create ChartPanel component with Recharts in `components/ChartPanel.tsx`
- [ ] T011 [US1] Create LayoutShell component to structure the page in `components/LayoutShell.tsx`
- [ ] T012 [US1] Integrate components in `app/page.tsx` to load default ticker data
- [ ] T013 [US1] Manual Test: Verify page loads with a visible chart for the first ticker

## Phase 4: Select Different Ticker (US2)
*Goal: User can select a different ticker to update the chart*
*Priority: P2*

- [ ] T014 [US2] Add click interaction to `components/Sidebar.tsx` items
- [ ] T015 [US2] Implement state management for `selectedTicker` in `app/page.tsx`
- [ ] T016 [US2] Trigger chart data refresh when selection changes in `components/ChartPanel.tsx`
- [ ] T017 [P] [US2] Add visual active state to selected item in `components/Sidebar.tsx`

## Phase 5: Navigate Sidebar (US3)
*Goal: Sidebar offers clear visual feedback and navigation*
*Priority: P3*

- [ ] T018 [US3] Add hover effects and refined typography to `components/Sidebar.tsx`
- [ ] T019 [US3] Ensure scroll handling for sidebar if list exceeds viewport in `components/LayoutShell.tsx`
- [ ] T020 [US3] Optimization: Memoize sidebar list to prevent unnecessary re-renders in `components/Sidebar.tsx`

## Phase 6: Polish
*Goal: Final visual adjustments and responsive constraints*

- [ ] T021 [P] Adjust responsive layout for tablet/desktop in `components/LayoutShell.tsx`
- [ ] T022 Apply final "Vercel-esque" styling tweaks (borders, subtle shadows) in `app/globals.css`

## Dependencies
- **Foundational** blocks **US1**
- **US1** blocks **US2** (need chart to exist before switching it)
- **US2** blocks **US3** (polish comes after function)

## Implementation Strategy
- **MVP (US1)**: Just get one hardcoded ticker rendering on a named route or default state.
- **Interactive (US2)**: Wire up the click handlers.
- **Refinement (US3)**: Make it look premium.
