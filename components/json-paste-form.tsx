'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { ZodError } from 'zod'

import { cardSchema, type CardInput } from '@/lib/validation'
import { createCard, checkCardExists } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function JsonPasteForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const router = useRouter()
  const [jsonStr, setJsonStr] = useState('')
  const [parsedData, setParsedData] = useState<CardInput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDuplicate, setIsDuplicate] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!jsonStr.trim()) {
      setParsedData(null)
      setError(null)
      setIsDuplicate(false)
      return
    }

    try {
      const parsed = JSON.parse(jsonStr)
      const validated = cardSchema.parse(parsed)
      setParsedData(validated)
      setError(null)
      
      // Check for duplicate
      checkCardExists(validated.num).then(exists => {
        setIsDuplicate(exists)
      })
    } catch (e) {
      setParsedData(null)
      setIsDuplicate(false)
      if (e instanceof ZodError) {
        setError(e.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', '))
      } else if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Invalid JSON')
      }
    }
  }, [jsonStr])

  const handleSave = async () => {
    if (!parsedData) return
    setIsSaving(true)
    
    try {
      const result = await createCard(parsedData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Card added: #${parsedData.num} ${parsedData.title}`)
        setJsonStr('')
        setParsedData(null)
        router.refresh()
        onSuccess?.()
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Paste JSON from Claude:
        </label>
        <Textarea
          value={jsonStr}
          onChange={(e) => setJsonStr(e.target.value)}
          placeholder={'{\n  "num": 706,\n  "title": "Design HashMap",\n  "difficulty": "easy",\n  ...\n}'}
          className="min-h-[200px] font-mono text-sm"
        />
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        {isDuplicate && !error && (
          <p className="text-sm font-medium text-amber-500 dark:text-amber-400">
            Warning: A card with problem #{parsedData?.num} already exists. Saving will create a duplicate.
          </p>
        )}
      </div>

      {parsedData && !error && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-muted-foreground font-mono">#{parsedData.num}</span>
              <span className="font-semibold">{parsedData.title}</span>
              <Badge
                variant="secondary"
                className={cn(
                  parsedData.difficulty === 'easy' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
                  parsedData.difficulty === 'medium' && 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                  parsedData.difficulty === 'hard' && 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
                )}
              >
                {parsedData.difficulty}
              </Badge>
            </div>
            {parsedData.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {parsedData.description}
              </p>
            )}
            <div className="text-sm text-muted-foreground">
              {parsedData.key_points.length} key points &middot; {parsedData.follow_ups.length} follow-ups &middot; {parsedData.gotchas.length} gotchas
              {parsedData.example && <> &middot; has example</>}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={!parsedData || !!error || isSaving}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save card
        </Button>
      </div>
    </div>
  )
}
