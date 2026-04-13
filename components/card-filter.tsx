"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { Card } from "@/lib/types";
import {
  cardSortOptions,
  difficultyFilters,
  normalizeCardSort,
  normalizeDifficultyFilter,
  type CardSortOption,
  type DifficultyFilter,
} from "@/lib/card-controls";
import { CardGrid } from "@/components/card-grid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";

type CardFilterProps = {
  cards: Card[];
  initialDifficulty: DifficultyFilter;
  initialSort: CardSortOption;
};

const difficultyLabels: Record<DifficultyFilter, string> = {
  all: "All",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const sortLabels: Record<CardSortOption, string> = {
  recent: "Recently reviewed",
  number: "Problem number",
};

function getReviewedTimestamp(lastReviewed: string | null) {
  if (!lastReviewed) {
    return null;
  }

  const timestamp = new Date(lastReviewed).getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
}

function sortCards(cards: Card[], sort: CardSortOption) {
  return [...cards].sort((left, right) => {
    if (sort === "number") {
      return left.num - right.num;
    }

    const leftReviewed = getReviewedTimestamp(left.last_reviewed);
    const rightReviewed = getReviewedTimestamp(right.last_reviewed);

    if (leftReviewed === null && rightReviewed === null) {
      return left.num - right.num;
    }

    if (leftReviewed === null) {
      return 1;
    }

    if (rightReviewed === null) {
      return -1;
    }

    return rightReviewed - leftReviewed || left.num - right.num;
  });
}

export function CardFilter({
  cards,
  initialDifficulty,
  initialSort,
}: CardFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const difficultyParam = searchParams.get("difficulty");
  const sortParam = searchParams.get("sort");

  const difficulty =
    difficultyParam === null
      ? initialDifficulty
      : normalizeDifficultyFilter(difficultyParam);
  const sort = sortParam === null ? initialSort : normalizeCardSort(sortParam);

  const filteredCards = cards.filter((card) =>
    difficulty === "all" ? true : card.difficulty === difficulty,
  );
  const visibleCards = sortCards(filteredCards, sort);

  function updateSearchParams(nextDifficulty: DifficultyFilter, nextSort: CardSortOption) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextDifficulty === "all") {
      params.delete("difficulty");
    } else {
      params.set("difficulty", nextDifficulty);
    }

    if (nextSort === "recent") {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter cards by difficulty"
          className="flex flex-wrap gap-2"
        >
          {difficultyFilters.map((value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={difficulty === value ? "default" : "outline"}
              aria-pressed={difficulty === value}
              onClick={() => updateSearchParams(value, sort)}
            >
              {difficultyLabels[value]}
            </Button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Sort:</span>
          <Select
            value={sort}
            onValueChange={(value) =>
              updateSearchParams(difficulty, normalizeCardSort(String(value)))
            }
          >
            <SelectTrigger
              aria-label="Sort cards"
              size="sm"
              className="min-w-44 text-foreground"
            >
              <SelectValue>
                {(value) => sortLabels[normalizeCardSort(String(value))]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {cardSortOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {sortLabels[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      {visibleCards.length === 0 ? (
        <section className="rounded-xl border border-dashed bg-card/60 px-6 py-10 text-center">
          <h2 className="text-lg font-semibold tracking-tight">
            No cards match this filter
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different difficulty or switch back to all cards.
          </p>
        </section>
      ) : (
        <CardGrid cards={visibleCards} />
      )}
    </section>
  );
}
