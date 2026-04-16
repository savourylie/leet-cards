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

type ReviewNavigatorProps = {
  cards: Card[];
};

export function ReviewNavigator({ cards }: ReviewNavigatorProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [reviewedIds, setReviewedIds] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const total = cards.length;
  const currentCard = cards[currentIndex];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      switch (event.key) {
        case " ":
        case "Enter": {
          event.preventDefault();
          containerRef.current
            ?.querySelector<HTMLElement>(
              '[role="button"]:not([aria-hidden="true"])',
            )
            ?.click();
          break;
        }
        case "ArrowLeft":
          event.preventDefault();
          if (currentIndex > 0) {
            setDirection("backward");
            setCurrentIndex(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          if (currentIndex < total - 1) {
            setDirection("forward");
            setCurrentIndex(currentIndex + 1);
          }
          break;
        case "Escape":
          router.push("/");
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, total, router]);

  if (total === 0) {
    return (
      <div className="space-y-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>
        <p className="text-sm text-muted-foreground">No cards to review.</p>
      </div>
    );
  }

  async function handleFlip(isFlipped: boolean) {
    if (isFlipped && !reviewedIds.has(currentCard.id)) {
      setReviewedIds((prev) => new Set(prev).add(currentCard.id));
      await updateLastReviewed(currentCard.id);
    }
  }

  async function handleDelete() {
    const result = await deleteCard(currentCard.id)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success(`Deleted: #${currentCard.num} ${currentCard.title}`)
    if (total > 1) {
      const nextIndex = currentIndex < total - 1 ? currentIndex + 1 : currentIndex - 1
      router.push(`/review/${cards[nextIndex].id}`)
    } else {
      router.push('/')
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (deltaX > 50 && currentIndex < total - 1) {
      // Swipe left (next card)
      setDirection("forward");
      setCurrentIndex((i) => i + 1);
    } else if (deltaX < -50 && currentIndex > 0) {
      // Swipe right (prev card)
      setDirection("backward");
      setCurrentIndex((i) => i - 1);
    }
    
    touchStartX.current = null;
  }

  return (
    <div className="space-y-6 py-4">
      <div aria-live="polite" className="sr-only">
        Card {currentIndex + 1} of {total}: {currentCard.title}
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back
        </Link>
        <span className="text-sm tabular-nums text-muted-foreground">
          {currentIndex + 1} / {total}
        </span>
      </div>

      <div
        ref={containerRef}
        key={currentIndex}
        className={cn(
          "animate-in fade-in fill-mode-both animation-duration-200",
          direction === "forward"
            ? "slide-in-from-right-5"
            : "slide-in-from-left-5",
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Flashcard
          card={currentCard as unknown as CardInput}
          onFlip={handleFlip}
          onDelete={handleDelete}
        />
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => {
            setDirection("backward");
            setCurrentIndex((i) => i - 1);
          }}
        >
          ← Prev
        </Button>
        <Button
          variant="outline"
          disabled={currentIndex === total - 1}
          onClick={() => {
            setDirection("forward");
            setCurrentIndex((i) => i + 1);
          }}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
