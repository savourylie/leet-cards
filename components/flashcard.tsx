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

type FlashcardFaceProps = {
  className?: string;
  buttonLabel: string;
  isVisible: boolean;
  onFlip: () => void;
  children: ReactNode;
};

type FlashcardSectionProps = {
  label: string;
  children: ReactNode;
};

function FlashcardFace({
  className,
  buttonLabel,
  isVisible,
  onFlip,
  children,
}: FlashcardFaceProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onFlip();
    }
  }

  return (
    <div
      role="button"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      aria-label={buttonLabel}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      className={cn(
        "absolute inset-0 flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 [backface-visibility:hidden] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !isVisible && "pointer-events-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

function FlashcardSection({ label, children }: FlashcardSectionProps) {
  return (
    <section className="space-y-2">
      <h3 className="text-[12px] font-medium uppercase tracking-[0.5px] text-muted-foreground">
        {label}
      </h3>
      {children}
    </section>
  );
}

function FlashcardList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-5 text-[14px] leading-[1.6]">
      {items.map((item, index) => (
        <li
          key={index}
          className="break-words [overflow-wrap:anywhere]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Flashcard({ card, className, onFlip, onDelete }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipStateAnnouncement, setFlipStateAnnouncement] = useState("");

  function handleFlip() {
    const nextValue = !isFlipped;
    setIsFlipped(nextValue);
    onFlip?.(nextValue);
    setFlipStateAnnouncement(
      nextValue
        ? "Card flipped to back — showing key points, complexity, follow-ups, gotchas"
        : "Card flipped to front — showing problem summary"
    );
  }

  return (
    <div className={cn("w-full [perspective:800px]", className)}>
      <div className="sr-only" aria-live="polite">
        {flipStateAnnouncement}
      </div>
      <div
        className={cn(
          "relative min-h-[30rem] transition-transform duration-[400ms] ease-[ease] [transform-style:preserve-3d] sm:min-h-[32rem] lg:min-h-[34rem]",
          isFlipped && "[transform:rotateY(180deg)]",
        )}
      >
        <FlashcardFace
          buttonLabel="Flip card to study content"
          isVisible={!isFlipped}
          onFlip={handleFlip}
          className="justify-center px-6 py-8 text-center sm:px-8"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">#{card.num}</p>
              <h2 className="text-[18px] font-semibold leading-snug break-words [overflow-wrap:anywhere]">
                {card.title}
              </h2>
              <div className="flex justify-center">
                <Badge
                  className={cn(
                    "shrink-0 capitalize",
                    getDifficultyBadgeClass(card.difficulty),
                  )}
                >
                  {getDifficultyLabel(card.difficulty)}
                </Badge>
              </div>
            </div>
            {card.tags.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2">
                {card.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}

            <p className="text-sm text-muted-foreground">Click to flip</p>
          </div>
        </FlashcardFace>

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
      </div>
    </div>
  );
}
