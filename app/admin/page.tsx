import { JsonPasteForm } from '@/components/json-paste-form'

export default function AdminPage() {
  return (
    <div className="space-y-8 py-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
      </header>

      <section className="space-y-4 rounded-xl border p-6">
        <h2 className="text-lg font-semibold tracking-tight">Add card</h2>
        <JsonPasteForm />
      </section>
      
      <section className="space-y-4 rounded-xl border p-6 opacity-50">
        <h2 className="text-lg font-semibold tracking-tight">Existing cards</h2>
        <p className="text-sm text-muted-foreground">
          List of existing cards will be implemented in the next ticket.
        </p>
      </section>
    </div>
  )
}
