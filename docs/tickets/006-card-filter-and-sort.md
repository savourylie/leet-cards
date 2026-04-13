# [TICKET-006] Card Filter & Sort Controls

## Status
`done`

## Dependencies
- Requires: #005

## Description
Add client-side filtering by difficulty and sorting by last reviewed date or problem number to the home page card grid. This is a Client Component that manages filter/sort state and re-renders the grid accordingly. Filtering and sorting happen client-side since the dataset is small (personal use, likely < 200 cards).

## Acceptance Criteria
- [x] A filter bar appears above the card grid with toggle buttons: All, Easy, Medium, Hard
- [x] Clicking a difficulty filter shows only cards of that difficulty; "All" shows everything
- [x] A sort dropdown offers at least two options: "Recently reviewed" and "Problem number"
- [x] Filtering and sorting are instant (client-side, no loading states)
- [x] Active filter button has a visually distinct selected state
- [x] Filter and sort state are reflected in the URL query params (optional but nice for shareability)

## Design Reference
- **Layout**: § Home (`/`) — `[All] [Easy] [Medium] [Hard]  Sort: [Recent]` bar
- **Components**: § Home — toggle buttons for difficulty, dropdown for sort order

## Visual Reference
Above the card grid, a row of four toggle buttons (All / Easy / Medium / Hard) appears left-aligned. To the right, a "Sort:" label with a dropdown selector. Clicking "Medium" highlights that button and the grid instantly shows only medium-difficulty cards. Switching sort to "Problem number" reorders the grid numerically.

## Implementation Notes
- Key files: `components/card-filter.tsx` (Client Component), modify `components/card-grid.tsx` or `app/page.tsx` to integrate
- The card grid needs to become a Client Component (or the filter wraps it) since filtering is client-side
- Use shadcn `Button` variants for toggle state, shadcn `Select` for sort dropdown
- Consider using `useSearchParams` from `next/navigation` to persist filter/sort in URL
- Cards passed as props from the server; filter/sort operates on the client-side array

## Testing
- Navigate to `/` with seed data containing cards of different difficulties
- Click each difficulty filter — only matching cards shown
- Click "All" — all cards shown
- Change sort order — cards reorder correctly
- Refresh page — if URL params are implemented, filter/sort state persists
