# Tech Stack — LeetCode Flashcard Reviewer

## Framework

**Next.js 14+ (App Router)**

- Server Components by default, Client Components only where interactivity is needed (card flip, filters)
- Server Actions for form submissions (add / edit / delete cards)
- No separate API layer needed — Server Actions replace traditional REST endpoints

## Database

**Vercel Postgres (Neon)**

- Free tier: 256 MB storage, 60 compute hours/month — more than enough for a single-user flashcard app
- Setup: `npx vercel env pull` to get connection string, use `@vercel/postgres` SDK
- Single table `cards` (see PRD for schema)

### Schema (SQL)

```sql
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  num INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  difficulty VARCHAR(10) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT[] DEFAULT '{}',
  key_points JSONB DEFAULT '[]',
  complexity VARCHAR(255) DEFAULT '',
  follow_ups JSONB DEFAULT '[]',
  gotchas JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reviewed TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_cards_num ON cards(num);
CREATE INDEX idx_cards_difficulty ON cards(difficulty);
```

### Why not SQLite?

Vercel serverless functions are stateless — no persistent filesystem. Vercel Postgres is the path of least resistance for deployment on Vercel. If you ever self-host, switching to SQLite + Drizzle is trivial.

## ORM

**Drizzle ORM**

- Type-safe, lightweight, SQL-like syntax
- Drizzle Kit for migrations
- Works well with Vercel Postgres and Next.js Server Components

```ts
// Example schema definition
export const cards = pgTable('cards', {
  id: serial('id').primaryKey(),
  num: integer('num').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  difficulty: varchar('difficulty', { length: 10 }).default('medium'),
  tags: text('tags').array().default([]),
  keyPoints: jsonb('key_points').default([]),
  complexity: varchar('complexity', { length: 255 }).default(''),
  followUps: jsonb('follow_ups').default([]),
  gotchas: jsonb('gotchas').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  lastReviewed: timestamp('last_reviewed'),
});
```

## UI

**shadcn/ui + Tailwind CSS v4**

- Not a component library — copy-paste components you own and can modify
- Key components to install: `card`, `badge`, `button`, `dialog`, `textarea`, `select`, `separator`, `sonner` (toast)
- Tailwind v4 for utility-first styling

## Validation

**Zod**

- Validate the JSON blob pasted in the admin page before DB insert
- Share schema between client validation and server action

```ts
export const cardSchema = z.object({
  num: z.number().int().min(1),
  title: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).default([]),
  key_points: z.array(z.string()).default([]),
  complexity: z.string().default(''),
  follow_ups: z.array(z.string()).default([]),
  gotchas: z.array(z.string()).default([]),
});
```

## Deployment

**Vercel**

- Connect GitHub repo → auto-deploy on push to main
- Environment variables: `POSTGRES_URL` (auto-set when linking Vercel Postgres)
- Preview deployments for branches

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout, fonts, global styles
│   ├── page.tsx                # Card grid (Server Component)
│   ├── review/
│   │   ├── page.tsx            # Full-screen review mode
│   │   └── [id]/page.tsx       # Single card deep link
│   └── admin/
│       ├── page.tsx            # Admin: list + add/edit/delete
│       └── actions.ts          # Server Actions for CRUD
├── components/
│   ├── ui/                     # shadcn components
│   ├── card-grid.tsx           # Card grid with filters
│   ├── flashcard.tsx           # Flip card component (Client)
│   ├── card-filter.tsx         # Difficulty + tag filter (Client)
│   └── json-paste-form.tsx     # Admin JSON paste form (Client)
├── db/
│   ├── schema.ts               # Drizzle schema
│   ├── index.ts                # DB connection
│   └── migrate.ts              # Migration runner
├── lib/
│   ├── types.ts                # Shared TypeScript types
│   └── validation.ts           # Zod schemas
├── drizzle.config.ts
├── tailwind.config.ts
└── package.json
```

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.2",
    "react": "^18.3",
    "@vercel/postgres": "^0.10",
    "drizzle-orm": "^0.36",
    "zod": "^3.23",
    "sonner": "^1.7"
  },
  "devDependencies": {
    "drizzle-kit": "^0.28",
    "tailwindcss": "^4.0",
    "typescript": "^5.5",
    "@types/react": "^18.3"
  }
}
```

## Future Considerations (Not Now)

- **Auth**: Add a simple password gate or Vercel Auth if you share the URL
- **SM-2 algorithm**: Spaced repetition scheduling based on self-rated difficulty
- **Export**: JSON export for backup
- **LeetCode API**: Auto-fetch problem metadata by number
