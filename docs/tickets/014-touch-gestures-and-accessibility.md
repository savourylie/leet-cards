# [TICKET-014] Touch Gestures & Accessibility

## Status
`done`

## Dependencies
- Requires: #012

## Description
Add touch/swipe support for mobile review navigation and ensure the app meets accessibility requirements: `aria-live` announcements for card flips, visible focus rings, keyboard navigability for all interactive elements, and sufficient color contrast. These are finishing touches that make the app usable on mobile and accessible to all users.

## Acceptance Criteria
- [x] Swiping left on the flashcard in review mode navigates to the next card
- [x] Swiping right on the flashcard navigates to the previous card
- [x] Tapping the flashcard flips it (already works from #007 click handler — verify on touch devices)
- [x] Card flip state change is announced via an `aria-live="polite"` region (e.g., "Card flipped to back" / "Card flipped to front")
- [x] All interactive elements (buttons, cards, links, filter toggles) are reachable via Tab key and show visible focus rings
- [x] Difficulty badges convey information via text, not color alone (already the case — verify)
- [x] All text meets WCAG 4.5:1 minimum contrast ratio (check with DevTools or axe)

## Design Reference
- **Interactions**: § Interactions — swipe left/right for navigation, tap to flip
- **Accessibility**: § Accessibility — keyboard navigation, aria-live, contrast, focus rings

## Visual Reference
On a mobile device (or touch-simulated in DevTools), swiping left on the review card slides to the next card. A screen reader announces "Card flipped to back — showing key points, complexity, follow-ups, gotchas" when the card is flipped. All buttons show a visible ring when focused via keyboard.

## Implementation Notes
- Key files: modify `components/flashcard.tsx` (add swipe + aria-live), modify `app/review/` components (integrate swipe)
- Swipe detection: use `touchstart` / `touchend` event listeners to detect horizontal swipe direction. Calculate `deltaX` — if > 50px threshold, trigger navigation. No library needed for this.
- `aria-live` region: add a visually hidden `<div aria-live="polite">` that updates its text content when the card flips
- Focus management: shadcn/ui handles most focus ring styles by default — verify and add custom styles only if needed
- Contrast check: use Chrome DevTools Accessibility panel or axe browser extension
- Do NOT add excessive ARIA if the HTML semantics are already correct (buttons are `<button>`, links are `<a>`, etc.)

## Testing
- Mobile test (or DevTools touch simulation): swipe left/right in review mode — cards navigate
- Screen reader test (VoiceOver on Mac): flip a card — announcement reads the state change
- Keyboard test: Tab through home page and admin page — all interactive elements focusable with visible focus ring
- Run axe or Lighthouse accessibility audit — no critical or serious issues
