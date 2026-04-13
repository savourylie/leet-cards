'use server'

import { revalidatePath } from 'next/cache'
import { createDB } from '@/db'
import { cardSchema, type CardInput } from '@/lib/validation'

function getValidationError(data: CardInput) {
  const parsed = cardSchema.safeParse(data)

  if (parsed.success) {
    return null
  }

  return parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'card'}: ${issue.message}`)
    .join(', ')
}

export async function createCard(data: CardInput) {
  const validationError = getValidationError(data)
  if (validationError) {
    return { error: validationError }
  }

  const db = createDB()
  const { error } = await db.from('cards').insert(data)

  if (error) {
    return { error: `Failed to create card: ${error.message}` }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function checkCardExists(num: number) {
  const db = createDB()
  const { data, error } = await db.from('cards').select('num').eq('num', num).limit(1)
  if (error || !data) return false
  return data.length > 0
}

export async function updateCard(id: number, data: CardInput) {
  const validationError = getValidationError(data)
  if (validationError) {
    return { error: validationError }
  }

  const db = createDB()
  const { data: updatedCard, error } = await db
    .from('cards')
    .update(data)
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) {
    return { error: `Failed to update card: ${error.message}` }
  }

  if (!updatedCard) {
    return { error: 'Card not found' }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteCard(id: number) {
  const db = createDB()
  const { data: deletedCard, error } = await db
    .from('cards')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) {
    return { error: `Failed to delete card: ${error.message}` }
  }

  if (!deletedCard) {
    return { error: 'Card not found' }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}
