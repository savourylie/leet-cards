# [TICKET-009] TEST: Checkpoint 1 — Card Display & Review

## Status
`pending`

## Dependencies
- Requires: #006 ✅, #008 ✅

## Description
Verify the complete card display and review experience before building the admin CRUD interface. This checkpoint tests the home page grid with filtering/sorting, the flashcard flip animation, review mode navigation, keyboard shortcuts, and the `last_reviewed` update mechanism. All user-facing read paths must work end-to-end.

This is a gate — Phase 3 (Admin) tickets cannot begin until all checks pass.

## Acceptance Criteria
- [ ] Home page (`/`) renders a responsive card grid with seed data — 3 cols on desktop, 2 on tablet, 1 on mobile
- [ ] Difficulty badges show correct colors: green (easy), amber (medium), red (hard)
- [ ] Never-reviewed cards display a "New" indicator
- [ ] Difficulty filter buttons work: clicking "Easy" shows only easy cards, "All" resets
- [ ] Sort dropdown works: "Problem number" sorts ascending by `num`, "Recently reviewed" sorts by `last_reviewed` descending
- [ ] Clicking a card from the grid navigates to `/review/[id]`
- [ ] Flashcard flip animation is smooth (400ms 3D rotate, no mirrored text)
- [ ] Back face displays all four sections (KEY POINTS, COMPLEXITY, FOLLOW-UPS, GOTCHAS) with correct label styling
- [ ] Keyboard shortcuts work in review mode: Space/Enter flip, ←/→ navigate, Esc exits
- [ ] Prev/Next buttons navigate with slide transition
- [ ] Progress indicator ("3 / 12") updates correctly
- [ ] Flipping a card updates `last_reviewed` in the database
- [ ] `/review` (no ID) presents cards in random order
- [ ] Bilingual content (English + Mandarin) renders without layout issues

## Implementation Notes
This is a manual test execution ticket — no code changes unless bugs are found during testing.

Common failure modes:
- Filter state lost on navigation: ensure filter is client-side state or URL param
- Flip animation glitch: check `backface-visibility`, `transform-style`, and `perspective` are all set
- Keyboard shortcuts firing on wrong page: ensure `useEffect` cleanup removes listeners
- `last_reviewed` not updating: check Server Action is called on flip, not on page load
- CJK text overflow: verify card has sufficient width and `overflow-wrap: break-word`

Test environment: ensure at least 3 seed cards exist with different difficulties and mixed English/Mandarin content.

## Testing
Run through each acceptance criterion in order. Use browser DevTools responsive mode for breakpoint tests. Check the database after flipping cards to confirm `last_reviewed` timestamps. All 14 criteria must pass to unblock Phase 3.
