# [TICKET-003] Shared Types & Zod Validation

## Status
`pending`

## Dependencies
- Requires: #001 ✅

## Description
Create the shared TypeScript types and Zod validation schemas used across the app. The Zod schema validates the JSON blob pasted in the admin page and is shared between client-side preview validation and server-side actions. This must be defined early so that both UI and data layer tickets can import from a single source of truth.

## Acceptance Criteria
- [ ] `lib/validation.ts` exports a `cardSchema` Zod object matching the PRD JSON format (num, title, difficulty, tags, key_points, complexity, follow_ups, gotchas)
- [ ] `cardSchema` correctly validates a well-formed card JSON and rejects malformed input (missing required fields, wrong types)
- [ ] `lib/types.ts` exports a `Card` TypeScript type derived from the Drizzle schema or Zod schema (single source of truth, no manual duplication)
- [ ] The sample JSON from the PRD passes validation without errors

## Implementation Notes
- Key files: `lib/validation.ts`, `lib/types.ts`
- Use `z.infer<typeof cardSchema>` to derive the TypeScript type from Zod, or export the Drizzle `$inferSelect` type — pick one approach and use it consistently
- `num`: `z.number().int().min(1)`
- `difficulty`: `z.enum(['easy', 'medium', 'hard'])`
- `tags`, `key_points`, `follow_ups`, `gotchas`: `z.array(z.string()).default([])`
- `complexity`: `z.string().default('')`
- The Zod schema validates the **input** format (what Claude outputs); the DB schema may differ slightly (e.g., auto-generated fields like `id`, `created_at`)

## Testing
- Import `cardSchema` in a test file or Node REPL and validate the sample JSON from the PRD — it should parse successfully
- Validate malformed input (e.g., missing `title`, `num` as string) — it should throw ZodError with descriptive messages
