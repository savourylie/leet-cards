import { z } from 'zod'

export const cardSchema = z.object({
  num: z.number().int().min(1),
  title: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).default([]),
  key_points: z.array(z.string()).default([]),
  complexity: z.string().default(''),
  follow_ups: z.array(z.string()).default([]),
  gotchas: z.array(z.string()).default([]),
})

export type CardInput = z.infer<typeof cardSchema>
