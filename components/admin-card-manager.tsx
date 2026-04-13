'use client'

import type { FormEvent } from 'react'
import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { deleteCard, updateCard } from '@/app/admin/actions'
import type { Card, CardInput } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type AdminCardManagerProps = {
  cards: Card[]
}

type EditFormState = {
  num: string
  title: string
  difficulty: CardInput['difficulty']
  tags: string
  key_points: string
  complexity: string
  follow_ups: string
  gotchas: string
}

const difficultyOptions: CardInput['difficulty'][] = ['easy', 'medium', 'hard']

function formatList(values: string[]) {
  return values.join('\n')
}

function toEditFormState(card: Card): EditFormState {
  return {
    num: String(card.num),
    title: card.title,
    difficulty: card.difficulty as CardInput['difficulty'],
    tags: formatList(card.tags),
    key_points: formatList(card.key_points),
    complexity: card.complexity,
    follow_ups: formatList(card.follow_ups),
    gotchas: formatList(card.gotchas),
  }
}

function splitLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function toCardInput(form: EditFormState): CardInput {
  return {
    num: Number(form.num),
    title: form.title.trim(),
    difficulty: form.difficulty,
    tags: splitLines(form.tags),
    key_points: splitLines(form.key_points),
    complexity: form.complexity.trim(),
    follow_ups: splitLines(form.follow_ups),
    gotchas: splitLines(form.gotchas),
  }
}

export function AdminCardManager({ cards }: AdminCardManagerProps) {
  const router = useRouter()
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Card | null>(null)
  const [formState, setFormState] = useState<EditFormState | null>(null)
  const [isSaving, startSaveTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()

  function openEditDialog(card: Card) {
    setEditingCard(card)
    setFormState(toEditFormState(card))
  }

  function closeEditDialog() {
    setEditingCard(null)
    setFormState(null)
  }

  function updateField<Key extends keyof EditFormState>(field: Key, value: EditFormState[Key]) {
    setFormState((current) => (current ? { ...current, [field]: value } : current))
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!editingCard || !formState) {
      return
    }

    startSaveTransition(async () => {
      const result = await updateCard(editingCard.id, toCardInput(formState))

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(`Card updated: #${formState.num.trim()} ${formState.title.trim()}`)
      closeEditDialog()
      router.refresh()
    })
  }

  function handleDelete() {
    if (!deleteTarget) {
      return
    }

    startDeleteTransition(async () => {
      const result = await deleteCard(deleteTarget.id)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Card deleted')
      setDeleteTarget(null)
      router.refresh()
    })
  }

  return (
    <>
      {cards.length === 0 ? (
        <div className="rounded-lg border border-dashed px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No cards saved yet. Add one above to start editing and deleting cards.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col gap-3 border-b px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  <span className="font-mono text-muted-foreground">#{card.num}</span>{' '}
                  {card.title}
                </p>
              </div>

              <div className="flex gap-2 self-start sm:self-auto">
                <Button type="button" variant="outline" size="sm" onClick={() => openEditDialog(card)}>
                  Edit
                </Button>

                <AlertDialog
                  open={deleteTarget?.id === card.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setDeleteTarget(null)
                    } else {
                      setDeleteTarget(card)
                    }
                  }}
                >
                  <AlertDialogTrigger render={<Button type="button" variant="destructive" size="sm" />}>
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete #{card.num} {card.title}?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting && deleteTarget?.id === card.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(editingCard)}
        onOpenChange={(open) => {
          if (!open) {
            closeEditDialog()
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl" showCloseButton={!isSaving}>
          <DialogHeader>
            <DialogTitle>Edit card</DialogTitle>
            <DialogDescription>
              Update the prompt summary and review notes for this flashcard.
            </DialogDescription>
          </DialogHeader>

          {formState ? (
            <form className="grid gap-4" onSubmit={handleSave}>
              <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                <label className="grid gap-2 text-sm font-medium">
                  <span>Problem #</span>
                  <Input
                    type="number"
                    min={1}
                    value={formState.num}
                    onChange={(event) => updateField('num', event.target.value)}
                    disabled={isSaving}
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium">
                  <span>Title</span>
                  <Input
                    value={formState.title}
                    onChange={(event) => updateField('title', event.target.value)}
                    disabled={isSaving}
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium">
                <span>Difficulty</span>
                <Select
                  value={formState.difficulty}
                  onValueChange={(value) =>
                    updateField('difficulty', String(value) as CardInput['difficulty'])
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="grid gap-2 text-sm font-medium">
                <span>Tags</span>
                <Textarea
                  value={formState.tags}
                  onChange={(event) => updateField('tags', event.target.value)}
                  className="min-h-28"
                  placeholder={'hash-table\ndesign\nsliding-window'}
                  disabled={isSaving}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                <span>Key points</span>
                <Textarea
                  value={formState.key_points}
                  onChange={(event) => updateField('key_points', event.target.value)}
                  className="min-h-28"
                  disabled={isSaving}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                <span>Complexity</span>
                <Input
                  value={formState.complexity}
                  onChange={(event) => updateField('complexity', event.target.value)}
                  disabled={isSaving}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                <span>Follow-ups</span>
                <Textarea
                  value={formState.follow_ups}
                  onChange={(event) => updateField('follow_ups', event.target.value)}
                  className="min-h-28"
                  disabled={isSaving}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                <span>Gotchas</span>
                <Textarea
                  value={formState.gotchas}
                  onChange={(event) => updateField('gotchas', event.target.value)}
                  className="min-h-28"
                  disabled={isSaving}
                />
              </label>

              <DialogFooter>
                <DialogClose render={<Button variant="outline" type="button" disabled={isSaving} />}>
                  Cancel
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
