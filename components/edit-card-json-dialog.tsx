"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ZodError } from "zod";

import type { Card } from "@/lib/types";
import { cardSchema, type CardInput } from "@/lib/validation";
import { updateCard } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type EditCardJsonDialogProps = {
  card: Card | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function cardToJsonString(card: Card): string {
  const input: CardInput = {
    num: card.num,
    title: card.title,
    difficulty: card.difficulty as CardInput["difficulty"],
    tags: card.tags ?? [],
    description: card.description ?? "",
    example: card.example ?? "",
    key_points: card.key_points ?? [],
    complexity: card.complexity ?? "",
    follow_ups: card.follow_ups ?? [],
    gotchas: card.gotchas ?? [],
    stumbles: card.stumbles ?? [],
  };
  return JSON.stringify(input, null, 2);
}

type EditCardJsonFormProps = {
  card: Card;
  onOpenChange: (open: boolean) => void;
};

function EditCardJsonForm({ card, onOpenChange }: EditCardJsonFormProps) {
  const router = useRouter();
  const initialJson = useMemo(() => cardToJsonString(card), [card]);
  const [jsonStr, setJsonStr] = useState(initialJson);
  const [isSaving, startSaving] = useTransition();

  const { parsed, error } = useMemo((): {
    parsed: CardInput | null;
    error: string | null;
  } => {
    if (!jsonStr.trim()) return { parsed: null, error: null };
    try {
      const raw = JSON.parse(jsonStr);
      const validated = cardSchema.parse(raw);
      return { parsed: validated, error: null };
    } catch (e) {
      if (e instanceof ZodError) {
        return {
          parsed: null,
          error: e.issues
            .map((issue) => `${issue.path.join(".") || "card"}: ${issue.message}`)
            .join(", "),
        };
      }
      if (e instanceof Error) return { parsed: null, error: e.message };
      return { parsed: null, error: "Invalid JSON" };
    }
  }, [jsonStr]);

  const isDirty = jsonStr !== initialJson;

  function handleSave() {
    if (!parsed) return;
    startSaving(async () => {
      const result = await updateCard(card.id, parsed);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`Card updated: #${parsed.num} ${parsed.title}`);
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit card JSON</DialogTitle>
        <DialogDescription>
          Modify the JSON below or paste a replacement. Saves the same schema used by the add-card flow.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Textarea
          value={jsonStr}
          onChange={(event) => setJsonStr(event.target.value)}
          className="min-h-[320px] font-mono text-sm"
          spellCheck={false}
          disabled={isSaving}
        />
        {error ? (
          <p className="text-sm font-medium text-destructive">{error}</p>
        ) : null}
      </div>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" type="button" disabled={isSaving} />}>
          Cancel
        </DialogClose>
        <Button
          type="button"
          onClick={handleSave}
          disabled={!parsed || !!error || !isDirty || isSaving}
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save changes
        </Button>
      </DialogFooter>
    </>
  );
}

export function EditCardJsonDialog({ card, open, onOpenChange }: EditCardJsonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        {card ? (
          <EditCardJsonForm key={card.id} card={card} onOpenChange={onOpenChange} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
