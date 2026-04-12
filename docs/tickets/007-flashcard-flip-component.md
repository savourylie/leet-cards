# [TICKET-007] Flashcard Flip Component

## Status
`blocked`

## Dependencies
- Requires: #004

## Description
Build the core flashcard component with CSS 3D flip animation. This is the centrepiece of the review experience — a card with a front face (problem info) and back face (study content) that flips with a smooth 3D rotation. The component is a reusable Client Component that receives card data as props.

## Acceptance Criteria
- [ ] `components/flashcard.tsx` renders a card with two faces: front and back
- [ ] Front face displays: problem number, title, difficulty badge, and tag badges
- [ ] Back face displays: KEY POINTS (bulleted list), COMPLEXITY, FOLLOW-UP QUESTIONS (bulleted list), GOTCHAS (bulleted list) — each with uppercase section labels
- [ ] Clicking or tapping the card triggers a 3D flip animation (`rotateY(180deg)`) with `perspective: 800px` and `transition: 400ms ease`
- [ ] The back face text is not mirrored (correctly uses `backface-visibility: hidden` on both faces)
- [ ] Section labels on back face: 12px, weight 500, uppercase, letter-spacing 0.5px, muted color
- [ ] Bilingual content (English + Mandarin) renders correctly without layout breakage

## Design Reference
- **Animation**: § Animation — card flip: `transition: transform 400ms ease` with `perspective: 800px`
- **Typography**: § Typography — labels 12px/500 uppercase letter-spacing 0.5px, list items 14px/1.6
- **Color System**: § Color System — difficulty badges, tag badges neutral style
- **Layout**: § Review mode — front face and back face wireframes

## Visual Reference
A large card centered on screen. Front face shows "#706" in muted text, "Design HashMap" in bold, a green "easy" badge, and gray "hash-table" / "design" tag badges, with "click to flip" hint text. Clicking triggers a smooth 3D rotation revealing the back face with labeled sections: KEY POINTS with bullet items (including Mandarin text), COMPLEXITY as a single line, FOLLOW-UP QUESTIONS as bullets, and GOTCHAS as bullets.

## Implementation Notes
- Key file: `components/flashcard.tsx` (Client Component with `"use client"`)
- CSS approach: wrapper div with `perspective: 800px`, inner div with `transform-style: preserve-3d` and `transition: transform 400ms ease`. Two child divs (front/back) each with `backface-visibility: hidden`; back face also has `rotateY(180deg)` by default
- State: `const [isFlipped, setIsFlipped] = useState(false)` — toggle on click
- The component should expose an `onFlip` callback prop so the parent (review page) can trigger side effects (e.g., updating `last_reviewed`)
- Ensure the card has a reasonable `min-height` so both faces have consistent dimensions
- Test with mixed English/Mandarin content to ensure CJK characters don't overflow

## Testing
- Render the flashcard with sample card data (PRD example)
- Click to flip — smooth 3D animation plays, back face content is readable (not mirrored)
- Click again — flips back to front
- Verify section labels are uppercase and muted
- Verify bilingual content renders without overflow or clipping
