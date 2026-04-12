# [TICKET-002] Database Schema & Drizzle Setup

## Status
`done`

## Dependencies
- Requires: #001 ✅

## Description
Set up the Drizzle ORM schema for the `cards` table, configure the database connection to Vercel Postgres (Neon), and create the initial migration. This ticket establishes the data layer that all card CRUD operations depend on.

## Acceptance Criteria
- [x] `db/schema.ts` defines the `cards` table matching the PRD data model (id, num, title, difficulty, tags, key_points, complexity, follow_ups, gotchas, created_at, last_reviewed)
- [x] `db/index.ts` exports a configured Drizzle client connected to Vercel Postgres via `POSTGRES_URL` env var
- [x] `drizzle.config.ts` is configured for Vercel Postgres with the correct schema path
- [x] Running `npx drizzle-kit generate` produces a valid SQL migration file
- [x] Running `npx drizzle-kit push` (or migrate script) applies the schema to the database without errors
- [x] Indexes exist on `num` and `difficulty` columns

## Implementation Notes
- Key files: `db/schema.ts`, `db/index.ts`, `drizzle.config.ts`
- Use `@vercel/postgres` for the connection pool; Drizzle wraps it
- `tags` field: use `text('tags').array()` in Drizzle
- `key_points`, `follow_ups`, `gotchas`: use `jsonb` type — they store string arrays as JSON
- `difficulty` field: use `varchar` with a length of 10; enforce enum constraint at the Zod level (ticket #003), not DB level, for simplicity
- Create a `.env.local` with `POSTGRES_URL` placeholder — do NOT commit actual credentials
- Consider adding a `db/seed.ts` script with 2-3 sample cards for development

## Testing
- Run `npx drizzle-kit push` — migration applies with no errors
- Connect to the database (e.g., via `psql` or Drizzle Studio `npx drizzle-kit studio`) and verify the `cards` table exists with correct columns and indexes
- If seed script exists, run it and verify rows appear in the table
