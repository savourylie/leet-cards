import { connection } from 'next/server'

import { JsonPasteForm } from '@/components/json-paste-form'
import { AdminCardManager } from '@/components/admin-card-manager'
import { createDB } from '@/db'

export default async function AdminPage() {
  await connection()

  const db = createDB()
  const { data, error } = await db.from('cards').select('*').order('num', { ascending: true })

  if (error) {
    throw new Error(`Failed to load admin cards: ${error.message}`)
  }

  const cards = data ?? []

  return (
    <div className="space-y-8 py-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
      </header>

      <section className="space-y-4 rounded-xl border p-6">
        <h2 className="text-lg font-semibold tracking-tight">Add card</h2>
        <JsonPasteForm />
      </section>
      
      <section className="space-y-4 rounded-xl border p-6">
        <h2 className="text-lg font-semibold tracking-tight">Existing cards</h2>
        <AdminCardManager cards={cards} />
      </section>
    </div>
  )
}
