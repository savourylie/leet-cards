'use server'

import { revalidatePath } from 'next/cache'

import { createDB } from '@/db'

export async function updateLastReviewed(cardId: number): Promise<void> {
  const db = createDB()
  const { error } = await db
    .from('cards')
    .update({ last_reviewed: new Date().toISOString() })
    .eq('id', cardId)
  if (error) throw new Error(`Failed to update last_reviewed: ${error.message}`)
  revalidatePath('/')
}
