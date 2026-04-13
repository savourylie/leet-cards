# [TICKET-015] TEST: Final Checkpoint — End-to-End

## Status
`pending`

## Dependencies
- Requires: #013 ✅, #014 ✅

## Description
Final end-to-end verification of the complete LeetCode Flashcard Reviewer app. This checkpoint tests the full user workflow from card creation to review, verifies all features work together, checks responsive design at all breakpoints, validates dark mode, and confirms accessibility compliance. No ticket may be marked as "done" for the project until this checkpoint passes.

This is the final gate. Passing this checkpoint means the app is ready for deployment.

## Acceptance Criteria
- [ ] **Full workflow**: Create a new card via `/admin` JSON paste → verify it appears on `/` → click into `/review/[id]` → flip card → verify `last_reviewed` updates → return to `/` and confirm the relative time and stats updated
- [ ] **Edit workflow**: Edit a card on `/admin` → changes reflected on `/` and `/review/[id]`
- [ ] **Delete workflow**: Delete a card on `/admin` → removed from `/` and `/review`
- [ ] **Filter & sort**: All difficulty filters work, both sort options work, combining filter + sort works
- [ ] **Review navigation**: Navigate through all cards with Prev/Next buttons, keyboard arrows, and swipe gestures
- [ ] **Keyboard-only test**: Complete the full workflow (home → review → flip → navigate → back) using only keyboard
- [ ] **Mobile responsive**: At 375px width — grid is 1 column, review card fills screen, admin form is usable
- [ ] **Tablet responsive**: At 768px width — grid is 2 columns, all layouts correct
- [ ] **Desktop responsive**: At 1280px width — grid is 3 columns, max container 1080px centered
- [ ] **Dark mode**: Toggle dark mode — all pages render correctly, difficulty badge colors adapt, no white flashes
- [ ] **Bilingual content**: Cards with mixed English/Mandarin render correctly on all pages and at all breakpoints
- [ ] **Empty state**: With no cards, `/` shows helpful empty state directing to `/admin`
- [ ] **Stats accuracy**: Quick stats (total, never reviewed) are accurate after multiple create/edit/delete operations
- [ ] **No console errors**: Browse all pages — no errors or warnings in browser console
- [ ] **TypeScript clean**: `npx tsc --noEmit` passes with zero errors
- [ ] **Build clean**: `npm run build` completes with no errors

## Implementation Notes
This is a manual test execution ticket — no code changes unless bugs are found during testing.

Recommended test sequence:
1. Start fresh: clear all cards from DB
2. Test empty state on `/`
3. Create 3+ cards via `/admin` (use PRD sample JSON + variations with different difficulties)
4. Test home page: grid, filters, sort, stats
5. Test review mode: flip, navigate, keyboard, swipe
6. Edit one card, delete one card
7. Re-test home and review with modified data
8. Responsive tests at 375px, 768px, 1280px
9. Dark mode toggle on each page
10. Keyboard-only walkthrough
11. `npx tsc --noEmit` and `npm run build`

Common failure modes:
- Dark mode flash on load: ensure `next-themes` suppressHydrationWarning is set on `<html>`
- Build errors that don't appear in dev: Server Components importing client-only code
- Hydration mismatches: ensure date formatting is consistent between server and client

## Testing
Execute the recommended test sequence above. Record pass/fail for each of the 16 acceptance criteria. All must pass for the project to be considered complete.
