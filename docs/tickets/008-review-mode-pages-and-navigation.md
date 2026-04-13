# [TICKET-008] Review Mode Pages & Navigation

## Status
`done`

## Dependencies
- Requires: #005, #007

## Description
Build the review mode routes (`/review` and `/review/[id]`) with card navigation (prev/next), keyboard shortcuts, and automatic `last_reviewed` timestamp updates. This brings together the flashcard component from #007 with the card data layer to create the full review experience. `/review` shows all cards in random order; `/review/[id]` starts from a specific card and continues sequentially.

## Acceptance Criteria
- [x] `/review` loads all cards and presents them in random order, starting with the first
- [x] `/review/[id]` loads the specific card first, then allows navigating to adjacent cards sequentially
- [x] Prev/Next buttons navigate between cards with a subtle slide transition (`opacity 0→1` + `translateX(±20px)`, 200ms)
- [x] Keyboard shortcuts work: `Space` or `Enter` to flip, `←` / `→` to navigate, `Esc` to go back to home
- [x] A "Back" link in the top-left navigates to `/`
- [x] A progress indicator (e.g., "3 / 12") shows current position and total cards
- [x] Flipping a card triggers a Server Action that updates the card's `last_reviewed` timestamp
- [x] Navigating to a new card resets the flip state (always shows front first)

## Design Reference
- **Layout**: § Review mode — wireframe for front and flipped states, nav buttons, progress indicator
- **Animation**: § Animation — card enter: `opacity 0→1` + `translateX(±20px)`, 200ms
- **Interactions**: § Interactions — flip (Space/Enter), next (→/swipe left), prev (←/swipe right), exit (Esc)

## Visual Reference
Navigating to `/review` shows a full-screen layout: "← Back" link top-left, "3 / 12" top-right, a large centered flashcard (front face), and [← Prev] [Next →] buttons below. Pressing → slides the current card out and the next card in with a subtle transition. Pressing Space flips the card. The progress counter updates as you navigate.

## Implementation Notes
- Key files: `app/review/page.tsx`, `app/review/[id]/page.tsx`, `app/admin/actions.ts` (add `updateLastReviewed` Server Action)
- `/review/page.tsx` can be a Server Component that fetches cards and passes them to a Client Component wrapper that handles navigation state
- Navigation state: `const [currentIndex, setCurrentIndex] = useState(0)` — the card array is passed as props
- Keyboard handler: `useEffect` with `keydown` listener on `document` — clean up on unmount
- Server Action for `last_reviewed`: call on flip, use `revalidatePath` to keep home page fresh
- Slide transition: use CSS transitions on a wrapper div, keyed by `currentIndex` or use `framer-motion`'s `AnimatePresence` if it's already available — but per design spec, keep it minimal (CSS only preferred)

## Testing
- Navigate to `/review` — first card appears, progress shows "1 / N"
- Click Next → card slides, progress updates, new card shows front face
- Press Space — card flips, `last_reviewed` updates in DB (verify via Drizzle Studio)
- Press ← — previous card appears, front face shown
- Press Esc — navigates back to `/`
- Navigate to `/review/[id]` with a specific card ID — that card appears first
