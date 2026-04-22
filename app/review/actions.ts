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

export async function incrementCompletion(cardId: number): Promise<number> {
  const db = createDB()
  const { data: current, error: readError } = await db
    .from('cards')
    .select('completion_count')
    .eq('id', cardId)
    .maybeSingle()
  if (readError) throw new Error(`Failed to read completion_count: ${readError.message}`)
  if (!current) throw new Error('Card not found')

  const next = current.completion_count + 1
  const { error } = await db
    .from('cards')
    .update({ completion_count: next })
    .eq('id', cardId)
  if (error) throw new Error(`Failed to update completion_count: ${error.message}`)

  revalidatePath('/')
  revalidatePath(`/review/${cardId}`)
  return next
}

export async function decrementCompletion(cardId: number): Promise<number> {
  const db = createDB()
  const { data: current, error: readError } = await db
    .from('cards')
    .select('completion_count')
    .eq('id', cardId)
    .maybeSingle()
  if (readError) throw new Error(`Failed to read completion_count: ${readError.message}`)
  if (!current) throw new Error('Card not found')

  const next = Math.max(0, current.completion_count - 1)
  if (next === current.completion_count) return next

  const { error } = await db
    .from('cards')
    .update({ completion_count: next })
    .eq('id', cardId)
  if (error) throw new Error(`Failed to update completion_count: ${error.message}`)

  revalidatePath('/')
  revalidatePath(`/review/${cardId}`)
  return next
}
