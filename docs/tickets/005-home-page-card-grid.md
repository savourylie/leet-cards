# [TICKET-005] Home Page Card Grid

## Status
`blocked`

## Dependencies
- Requires: #004

## Description
Build the landing page that displays all flashcards in a responsive grid. This is the primary entry point — users land here, scan their cards, and click one to enter review mode. The page is a Server Component that fetches cards from the database and renders them with difficulty badges, relative review timestamps, and a "New" indicator for never-reviewed cards.

## Acceptance Criteria
- [ ] `app/page.tsx` fetches all cards from the database and renders a responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- [ ] Each card displays: problem number (muted), title (bold 18px weight 600), difficulty badge with correct semantic colors, and relative time since last review
- [ ] Cards never reviewed show a distinct visual indicator (e.g., "New" badge or left border accent)
- [ ] Clicking a card navigates to `/review/[id]`
- [ ] Grid uses `gap-4` spacing and the page respects the `max-w-[1080px]` container
- [ ] Page header shows "LeetCode Flashcards" and total card count (e.g., "[12 cards]")

## Design Reference
- **Layout**: § Home (`/`) — grid layout wireframe, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **Components**: § Home — card content (problem number, title, difficulty badge, last reviewed)
- **Color System**: § Color System — difficulty badge colors (emerald/amber/red), tag badge neutral style
- **Typography**: § Typography — card title 18px/600, labels 12px/500 uppercase

## Visual Reference
Navigating to `/` shows a page titled "LeetCode Flashcards" with a count like "[3 cards]". Below is a grid of shadcn Card components. Each card shows a muted problem number (e.g., "#706"), a bold title, a colored difficulty badge (green for easy, amber for medium, red for hard), and relative review time ("2 days ago" or "Never reviewed" with a "New" indicator). Cards are clickable and show a hover state.

## Implementation Notes
- Key files: `app/page.tsx`, `components/card-grid.tsx`
- `app/page.tsx` is a Server Component — fetch cards with Drizzle directly (no API route needed)
- Use shadcn `Card`, `Badge` components
- For relative time: use a lightweight formatter (e.g., `Intl.RelativeTimeFormat` or a small helper function) — no need for `date-fns` just for this
- The filter/sort controls are in the next ticket (#006) — this ticket renders the full unfiltered grid
- If no cards exist, show an empty state message directing to `/admin`

## Testing
- Run `npm run dev`, navigate to `/`
- With seed data: verify cards render in grid with correct info and badges
- With no data: verify empty state message appears
- Resize browser: verify grid goes from 3 → 2 → 1 column
- Click a card: verify navigation to `/review/[id]`
