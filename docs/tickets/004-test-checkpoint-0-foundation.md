# [TICKET-004] TEST: Checkpoint 0 — Foundation Scaffold

## Status
`blocked`

## Dependencies
- Requires: #002 ✅, #003

## Description
Verify that the full foundation layer is solid before building any UI. This checkpoint tests that the project runs, the database is connected and migrated, the Zod validation works, fonts load correctly, and dark mode toggles. This is a gate — Phase 2 tickets cannot begin until all checks pass.

## Acceptance Criteria
- [ ] `npm run dev` starts with no errors; `localhost:3000` renders the layout
- [ ] Browser DevTools confirm Inter and Noto Sans TC fonts are loaded
- [ ] Dark mode: toggling the theme switches the `<html>` class and background/text colors change
- [ ] Database: the `cards` table exists with correct columns (verify via Drizzle Studio or `psql`)
- [ ] Database: inserting a sample card row via Drizzle Studio or seed script succeeds
- [ ] Validation: importing `cardSchema` and parsing the PRD sample JSON returns a valid result
- [ ] Validation: parsing `{ "num": "not-a-number" }` returns a ZodError
- [ ] No TypeScript errors: `npx tsc --noEmit` completes with zero errors
- [ ] No lint errors: `npm run lint` passes (if configured)

## Implementation Notes
This is a manual test execution ticket — no code changes unless bugs are found during testing.

Common failure modes:
- Font not loading: check `next/font/google` import and CSS variable assignment in layout
- DB connection error: verify `POSTGRES_URL` in `.env.local` is correct and the Neon database is provisioned
- Drizzle push failed: check `drizzle.config.ts` points to correct schema file
- TypeScript errors: ensure Drizzle schema types align with Zod inferred types

## Testing
Run through each acceptance criterion sequentially. If any fail, fix the issue in the relevant ticket's files before proceeding. All 9 criteria must pass to unblock Phase 2.
