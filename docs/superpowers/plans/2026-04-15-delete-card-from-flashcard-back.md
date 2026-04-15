# Delete Card from Flashcard Back Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a small trash icon button on the back face of each flashcard in the review flow, which deletes the card and navigates to the next card (or home if it was the last).

**Architecture:** `Flashcard` gains an optional `onDelete` callback prop; a trash `<button>` rendered on the back face stops click propagation to avoid accidentally flipping the card. `ReviewNavigator` supplies the handler, which calls the existing `deleteCard` server action and navigates away. `deleteCard` is re-exported from `app/review/actions.ts` to keep review-page actions co-located.

**Tech Stack:** Next.js App Router, React, TypeScript, Lucide icons (`Trash2`), Sonner toasts, existing `deleteCard` server action

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `components/flashcard.tsx` | Accept `onDelete` prop; render trash button on back face |
| Modify | `components/review-navigator.tsx` | Supply `handleDelete` to `Flashcard`; navigate after deletion |

---

## Task 1: Add `onDelete` prop and trash button to `Flashcard`

**Files:**
- Modify: `components/flashcard.tsx`

- [ ] **Step 1: Add `Trash2` to the import and `onDelete` to props**

In `components/flashcard.tsx`, change the import block and `FlashcardProps` type:

```tsx
"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useState } from "react";
import { Trash2 } from "lucide-react";

import type { CardInput } from "@/lib/types";
import { getDifficultyBadgeClass, getDifficultyLabel } from "@/lib/card-display";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type FlashcardProps = {
  card: CardInput;
  className?: string;
  onFlip?: (isFlipped: boolean) => void;
  onDelete?: () => void;
};
```

- [ ] **Step 2: Render the trash button on the back face**

In the back `FlashcardFace` (the one with `isVisible={isFlipped}`), add the trash button as the first child, before the `<div className="space-y-6">`. The button must call `e.stopPropagation()` on both click and keyboard Enter/Space to prevent the flip handler from firing.

Replace the back `FlashcardFace` block (starting at `<FlashcardFace buttonLabel="Flip card back to problem summary"`) with:

```tsx
        <FlashcardFace
          buttonLabel="Flip card back to problem summary"
          isVisible={isFlipped}
          onFlip={handleFlip}
          className="[transform:rotateY(180deg)] overflow-y-auto px-6 py-6 sm:px-8"
        >
          {onDelete && (
            <button
              type="button"
              aria-label="Delete card"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                }
              }}
              className="absolute top-3 right-3 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <div className="space-y-6">
            <FlashcardSection label="Key Points">
              <FlashcardList items={card.key_points} />
            </FlashcardSection>

            <FlashcardSection label="Complexity">
              <p className="text-[14px] leading-[1.6] break-words [overflow-wrap:anywhere]">
                {card.complexity}
              </p>
            </FlashcardSection>

            <FlashcardSection label="Follow-Up Questions">
              <FlashcardList items={card.follow_ups} />
            </FlashcardSection>

            <FlashcardSection label="Gotchas">
              <FlashcardList items={card.gotchas} />
            </FlashcardSection>
          </div>
        </FlashcardFace>
```

- [ ] **Step 3: Verify no build errors**

```bash
cd /Users/calvinku/FunProjects/leet-cards && npm run build 2>&1 | tail -20
```

Expected: build completes without errors.

- [ ] **Step 4: Commit**

```bash
git add components/flashcard.tsx
git commit -m "feat: add onDelete prop and trash button to Flashcard back face"
```

---

## Task 2: Wire up `handleDelete` in `ReviewNavigator`

**Files:**
- Modify: `components/review-navigator.tsx`

- [ ] **Step 1: Add imports**

Add `toast` from `sonner` and `deleteCard` directly from the admin actions. Change the import block at the top of `components/review-navigator.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Card, CardInput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { deleteCard } from "@/app/admin/actions";
import { updateLastReviewed } from "@/app/review/actions";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@/components/flashcard";
```

- [ ] **Step 2: Add `handleDelete` function**

Add `handleDelete` directly after `handleFlip` (around line 87 in the original file):

```tsx
  async function handleDelete() {
    const result = await deleteCard(currentCard.id)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success(`Deleted: #${currentCard.num} ${currentCard.title}`)
    if (total > 1) {
      const nextIndex = currentIndex < total - 1 ? currentIndex : currentIndex - 1
      router.push(`/review/${cards[nextIndex].id}`)
    } else {
      router.push('/')
    }
  }
```

- [ ] **Step 3: Pass `onDelete` to `Flashcard`**

In the JSX, find the `<Flashcard>` usage and add `onDelete`:

```tsx
        <Flashcard
          card={currentCard as unknown as CardInput}
          onFlip={handleFlip}
          onDelete={handleDelete}
        />
```

- [ ] **Step 4: Verify no build errors**

```bash
cd /Users/calvinku/FunProjects/leet-cards && npm run build 2>&1 | tail -20
```

Expected: build completes without errors.

- [ ] **Step 5: Manual end-to-end verification**

Run `npm run dev` and visit `/`. Open a card for review:
- Flip the card to the back — the trash icon button should appear in the top-right corner
- Click the trash button — it should NOT flip the card back first
- A success toast should appear: "Deleted: #NNN Title"
- You should navigate to the next card (or `/` if it was the last card)
- Return to `/` and confirm the deleted card is gone from the grid
- Flip the front of the card — confirm the trash button is NOT visible on the front face

- [ ] **Step 6: Commit**

```bash
git add components/review-navigator.tsx
git commit -m "feat: wire up delete handler in ReviewNavigator"
```
