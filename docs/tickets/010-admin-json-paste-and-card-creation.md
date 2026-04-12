# [TICKET-010] Admin — JSON Paste & Card Creation

## Status
`blocked`

## Dependencies
- Requires: #009

## Description
Build the admin page's primary workflow: pasting a JSON block from a Claude session to create a new flashcard. This is the most critical admin feature — it must be fast and friction-free. The textarea validates input with Zod in real-time, shows a live preview of the parsed card, and saves via a Server Action with toast feedback.

## Acceptance Criteria
- [ ] `/admin` page renders with a "Paste JSON from Claude:" section containing a monospace textarea (`min-h-[200px]`)
- [ ] As the user types or pastes JSON, the input is validated against `cardSchema` in real-time
- [ ] Valid JSON shows a preview below the textarea: problem number, title, difficulty badge, counts (e.g., "3 key points · 2 follow-ups")
- [ ] Invalid JSON shows an inline error message in red text (no modal, no toast — inline only)
- [ ] "Save card" button is disabled until JSON validates successfully
- [ ] Clicking "Save card" calls a Server Action that inserts the card into the database
- [ ] On successful save: toast notification "Card added: #706 Design HashMap", textarea clears, preview resets
- [ ] Duplicate check: if a card with the same `num` already exists, show a warning (not a hard block — user may want to update)

## Design Reference
- **Layout**: § Admin (`/admin`) — JSON textarea wireframe, preview section
- **Typography**: § Typography — monospace font for textarea
- **Interactions**: § Interactions — "Add card: Paste JSON → Save → Toast"

## Visual Reference
Navigating to `/admin` shows a page titled "Admin" with a bordered section "Add card". Inside: a label "Paste JSON from Claude:", a large monospace textarea. After pasting valid JSON, a preview appears below showing "#706 Design HashMap [easy] — 3 key points · 2 follow-ups · 2 gotchas". A green "Save card" button is now enabled. Clicking it shows a toast at the bottom: "Card added: #706 Design HashMap".

## Implementation Notes
- Key files: `app/admin/page.tsx`, `components/json-paste-form.tsx` (Client Component), `app/admin/actions.ts`
- `json-paste-form.tsx`: `"use client"` — manages textarea state, runs `JSON.parse` + `cardSchema.safeParse` on every change (debounce if needed for performance)
- Server Action in `actions.ts`: `createCard(data: CardInput)` — inserts into DB via Drizzle, returns success/error
- Use `sonner` toast for success feedback (already in root layout from #001)
- Preview component can be simple: extract `num`, `title`, `difficulty` from parsed data and render inline
- Error display: show `zodError.issues` as a formatted list below the textarea

## Testing
- Navigate to `/admin`
- Paste the PRD sample JSON — preview appears, Save button enables
- Paste invalid JSON (e.g., missing `title`) — error message shows inline, Save stays disabled
- Click Save — toast appears, textarea clears
- Navigate to `/` — new card appears in the grid
- Paste JSON with the same `num` as an existing card — warning appears
