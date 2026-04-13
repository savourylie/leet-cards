'use server'

import { revalidatePath } from 'next/cache'
import { createDB } from '@/db'
import { cardSchema, type CardInput } from '@/lib/validation'

export async function createCard(data: CardInput) {
  const parsed = cardSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Invalid card data' }
  }

  const db = createDB()
  const { error } = await db.from('cards').insert(parsed.data)

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
