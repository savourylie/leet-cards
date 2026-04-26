'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { JsonPasteForm } from '@/components/json-paste-form'

export function AddCardDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <Plus className="mr-1 h-4 w-4" />
        Add card
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add card</DialogTitle>
        </DialogHeader>
        <JsonPasteForm layout="dialog" onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
