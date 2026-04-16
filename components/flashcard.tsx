"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useState } from "react";
import { Trash2 } from "lucide-react";

import type { CardInput } from "@/lib/types";
import { getDifficultyEyebrowClass, getDifficultyLabel } from "@/lib/card-display";
import { cn } from "@/lib/utils";
import { LeetCodeLinkButton } from "@/components/leetcode-link-button";

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
    <div className="flex flex-col gap-3">
      <h3 className="text-[11px] font-normal lowercase tracking-[0.01em] text-muted-foreground">
        {label}
      </h3>
      {children}
    </div>
  );
}

function FlashcardList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5 pl-4 text-[15px] leading-[1.7] text-foreground [list-style:disc] marker:text-muted-foreground/50">
      {items.map((item, index) => (
        <li
          key={index}
          className="break-words [overflow-wrap:anywhere] pl-1"
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
          className="overflow-y-auto px-8 py-10 sm:px-10 sm:py-12"
        >
          <div className="mx-auto flex min-h-full w-full max-w-[52ch] flex-col justify-center">
            <div className="flex flex-col gap-7">
              <header className="flex flex-col gap-3">
                <div className="flex items-center gap-1.5 text-[12px] font-medium tracking-[0.02em] text-muted-foreground">
                  <span className="tabular-nums">#{card.num}</span>
                  <LeetCodeLinkButton title={card.title} />
                </div>
                <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground break-words [overflow-wrap:anywhere]">
                  {card.title}
                </h2>
                <div
                  className={cn(
                    "text-[11px] font-medium uppercase tracking-[0.08em]",
                    getDifficultyEyebrowClass(card.difficulty),
                  )}
                >
                  {getDifficultyLabel(card.difficulty)}
                </div>
              </header>

              {card.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-muted/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {card.description ? (
                <p className="text-[15px] leading-[1.65] text-foreground/80 break-words [overflow-wrap:anywhere]">
                  {card.description}
                </p>
              ) : null}

              {card.example ? (
                <pre className="rounded-lg border border-border/60 bg-muted/40 px-5 py-4 text-left font-mono text-[13px] leading-[1.7] text-foreground/90 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                  {card.example}
                </pre>
              ) : null}

              <p className="pt-2 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70">
                Click to flip
              </p>
            </div>
          </div>
        </FlashcardFace>

        <FlashcardFace
          buttonLabel="Flip card back to problem summary"
          isVisible={isFlipped}
          onFlip={handleFlip}
          className="[transform:rotateY(180deg)] overflow-y-auto px-8 py-10 sm:px-10 sm:py-12"
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
          <div className="mx-auto w-full max-w-[60ch]">
            <div className="flex flex-col divide-y divide-border/50">
              {card.key_points.length > 0 && (
                <section className="py-7 first:pt-0 last:pb-0">
                  <FlashcardSection label="key points">
                    <FlashcardList items={card.key_points} />
                  </FlashcardSection>
                </section>
              )}
              {card.complexity && (
                <section className="py-7 first:pt-0 last:pb-0">
                  <FlashcardSection label="complexity">
                    <div className="rounded-md border border-border/50 bg-muted/30 px-4 py-3 font-mono text-[14px] leading-[1.65] text-foreground tabular-nums break-words [overflow-wrap:anywhere]">
                      {card.complexity}
                    </div>
                  </FlashcardSection>
                </section>
              )}
              {card.follow_ups.length > 0 && (
                <section className="py-7 first:pt-0 last:pb-0">
                  <FlashcardSection label="follow-ups">
                    <FlashcardList items={card.follow_ups} />
                  </FlashcardSection>
                </section>
              )}
              {card.gotchas.length > 0 && (
                <section className="py-7 first:pt-0 last:pb-0">
                  <FlashcardSection label="gotchas">
                    <FlashcardList items={card.gotchas} />
                  </FlashcardSection>
                </section>
              )}
            </div>
          </div>
        </FlashcardFace>
      </div>
    </div>
  );
}
