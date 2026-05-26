# LeetCode Flashcard Reviewer (`leet-cards`)

A personal flashcard web app for reviewing LeetCode problems during interview prep. Each card
captures a problem's key points, complexity analysis, follow-up questions, and the mistakes you
tend to make — closing the gap between "I solved it" and "I can explain it in an interview."

Single-user, no auth. Built with Next.js (App Router) and a local Supabase Postgres database.

## What it does

- **Review** — the landing page shows every card in a grid you can filter (difficulty, tag) and
  sort (problem number, last reviewed). Click a card to flip through key points, complexity,
  follow-ups, and gotchas.
- **Add cards from a Claude session** — after practicing a problem, paste the JSON Claude produces
  into `/admin`; the card is saved and immediately visible on the main page.
- **Track progress** — each card keeps a completion count and a last-reviewed timestamp.

## Prerequisites

- **Node.js 20+** and **npm** (the repo uses `package-lock.json`).
- **Docker** — required for the local Supabase stack (Postgres + PostgREST + Studio). Docker
  Desktop, OrbStack, Colima, Podman, or Rancher Desktop all work.
- **Supabase CLI** — `brew install supabase/tap/supabase` (macOS) or see the
  [Supabase CLI docs](https://supabase.com/docs/guides/local-development) for other platforms.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local (gitignored) pointing at the local stack
cat > .env.local <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<the sb_publishable_... key from `supabase status`>
EOF

# 3. Start the local Supabase stack (first run pulls Docker images;
#    migrations + seed data are applied automatically on first start)
npm run db:start

# 4. Run the app
npm run dev
```

Open <http://localhost:3000> (Next.js uses the next free port if 3000 is taken).

`npm run db:start` prints the local API URL and keys; run `supabase status` any time to reprint
them. These are the shared local-dev defaults — fine for local use, but not secrets to rely on in
production.

## Environment variables

The app reads two variables from `.env.local`:

| Variable | Description | Local value |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | `http://127.0.0.1:54321` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable (anon) key | the `sb_publishable_…` key from `supabase status` |

## Development

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server (Turbopack, hot reload) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:start` | Start the local Supabase stack (Docker) |
| `npm run db:stop` | Stop the local Supabase stack |
| `npm run db:reset` | Recreate the local DB from migrations + seed |

The schema lives in `supabase/migrations/` and the seed data (your cards) in `supabase/seed.sql`.
To change the schema, add a migration with `supabase migration new <name>`, then `npm run db:reset`
to rebuild from scratch. Supabase Studio is at <http://localhost:54323> while the stack runs.

## Architecture

- `app/` — Next.js App Router. `page.tsx` (card grid), `review/` (flip-through review),
  `admin/` (add / edit / delete cards). The `*/actions.ts` files are Server Actions used for writes.
- `db/` — `index.ts` builds the typed Supabase client (`createDB()`); `types.ts` holds the
  `Card` / `Database` types.
- `components/` — UI: `flashcard`, `card-grid`, `card-filter`, `add-card-dialog`,
  `admin-card-manager`, `review-navigator`, theme controls, plus `ui/` primitives.
- `lib/` — helpers for card display/controls, LeetCode URL building, and Zod validation.
- `supabase/` — `config.toml`, `migrations/` (schema), `seed.sql` (data). `backups/` holds raw
  dumps and is gitignored.
- `docs/` — PRD and design notes. (Note: `docs/TECH_STACK.md` predates the move to Supabase and
  is out of date.)

Data is a single `cards` table served through Supabase's auto-generated REST API (PostgREST).
Row-Level Security is enabled with a permissive policy, since this is a single-user app.
