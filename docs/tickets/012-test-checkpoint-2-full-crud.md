# [TICKET-012] TEST: Checkpoint 2 — Full CRUD Operations

## Status
`done`

## Dependencies
- Requires: #011

## Description
Verify the complete create-read-update-delete cycle works end-to-end. This checkpoint tests the admin page's JSON paste workflow, card editing, card deletion, and confirms that all mutations are immediately reflected on the home page and in review mode. This is a gate — Phase 4 (Polish) tickets cannot begin until all checks pass.

## Acceptance Criteria
- [x] **Create**: Paste valid JSON on `/admin` → preview shows → Save → toast appears → card visible on `/` grid and in `/review`
- [x] **Create validation**: Paste invalid JSON → inline error, Save disabled. Fix JSON → error clears, Save enables
- [x] **Read**: All cards on `/admin` list match what's on `/` grid (same count, same data)
- [x] **Update**: Edit a card's title on `/admin` → Save → title updated on `/admin` list, `/` grid, and `/review/[id]`
- [x] **Update fields**: Edit array fields (tags, key_points) by modifying textarea lines → verify changes persist correctly
- [x] **Delete**: Delete a card → confirmation dialog → confirm → card removed from `/admin`, `/`, and not accessible at `/review/[id]`
- [x] **Delete canceled**: Click Delete → Cancel in confirmation dialog → card remains
- [x] **Toast feedback**: Every mutation (create, update, delete) shows the correct toast message
- [x] **No stale data**: After any mutation, refreshing `/` and `/admin` shows consistent, up-to-date data

## Implementation Notes
This is a manual test execution ticket — no code changes unless bugs are found during testing.

Common failure modes:
- Stale data after mutation: check `revalidatePath` calls in Server Actions cover both `/` and `/admin`
- Array fields corrupted: check textarea → array splitting handles empty lines and whitespace correctly
- Edit dialog not closing after save: ensure the dialog state resets on successful mutation
- Toast not appearing: verify `<Toaster />` is in root layout and `sonner` toast calls are correct

Test with at least 2 different cards. Test with the PRD sample JSON as one of the create inputs.

## Testing
Execute each acceptance criterion as a discrete test case. Record pass/fail for each. If any fail, fix the underlying issue and re-test. All 9 criteria must pass to unblock Phase 4.

Completed with a browser-driven checkpoint on 2026-04-13 against the live dev server and Supabase data. One bug was found and fixed during validation: the admin edit dialog now edits `tags` as one-item-per-line textarea content so array-field updates persist correctly.
