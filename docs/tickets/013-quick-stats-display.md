# [TICKET-013] Quick Stats Display

## Status
`done`

## Dependencies
- Requires: #012

## Description
Add a quick stats summary to the home page header showing total card count, cards never reviewed, and the latest review info. The PRD calls for lightweight stats that give a sense of progress without requiring a separate analytics page. These stats are computed server-side and rendered as part of the home page Server Component.

## Acceptance Criteria
- [x] Home page header displays total card count (already partially done in #005 — this ticket ensures it's accurate and styled)
- [x] A "never reviewed" count is visible (e.g., "4 cards never reviewed" or "4 new")
- [x] Last reviewed date per card is already shown in the grid from #005 — verify accuracy after CRUD operations
- [x] Stats update immediately after adding, editing, or deleting cards (server-side render, no stale cache)

## Design Reference
- **Layout**: § Home (`/`) — header area with card count

## Visual Reference
The home page header shows: "LeetCode Flashcards" on the left. On the right (or below on mobile), stats like "12 cards · 4 new · Last reviewed: 2 hours ago". The stats are in muted text, smaller than the title.

## Implementation Notes
- Key files: modify `app/page.tsx` (add stats query), optionally create `components/stats-bar.tsx`
- Query stats with Drizzle: `SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE last_reviewed IS NULL) as never_reviewed FROM cards`
- Keep it as a single DB query alongside the card fetch — no need for a separate round trip
- "Last reviewed" could show the most recent `last_reviewed` across all cards as a global indicator
- These are server-rendered; no client state needed

## Testing
- Navigate to `/` — stats display with correct counts
- Add a card via `/admin` — return to `/` and verify total count increases, "never reviewed" count increases
- Review a card (flip it) — return to `/` and verify "never reviewed" count decreases
- Delete a card — verify counts update
