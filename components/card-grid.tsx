import Link from "next/link";

import type { Card } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card as SurfaceCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CardGridProps = {
  cards: Card[];
};

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

const relativeTimeUnits = [
  { unit: "year", seconds: 60 * 60 * 24 * 365 },
  { unit: "month", seconds: 60 * 60 * 24 * 30 },
  { unit: "week", seconds: 60 * 60 * 24 * 7 },
  { unit: "day", seconds: 60 * 60 * 24 },
  { unit: "hour", seconds: 60 * 60 },
  { unit: "minute", seconds: 60 },
] satisfies Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }>;

function formatRelativeReviewTime(lastReviewed: string | null) {
  if (!lastReviewed) {
    return "Never reviewed";
  }

  const timestamp = new Date(lastReviewed).getTime();

  if (Number.isNaN(timestamp)) {
    return "Review date unavailable";
  }

  const diffSeconds = Math.round((timestamp - Date.now()) / 1000);

  if (Math.abs(diffSeconds) < 60) {
    return "Just now";
  }

  for (const { unit, seconds } of relativeTimeUnits) {
    if (Math.abs(diffSeconds) >= seconds || unit === "minute") {
      return relativeTimeFormatter.format(Math.round(diffSeconds / seconds), unit);
    }
  }

  return "Just now";
}

function getDifficultyLabel(difficulty: string) {
  if (!difficulty) {
    return "Unknown";
  }

  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

function getDifficultyBadgeClass(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    case "medium":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    case "hard":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    default:
      return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
  }
}

export function CardGrid({ cards }: CardGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const isNew = card.last_reviewed === null;

        return (
          <Link
            key={card.id}
            href={`/review/${card.id}`}
            className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <SurfaceCard className="h-full transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader className="gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">#{card.num}</p>
                    <CardTitle className="mt-1 line-clamp-2 text-[18px] font-semibold leading-snug">
                      {card.title}
                    </CardTitle>
                  </div>
                  <Badge className={cn("shrink-0 capitalize", getDifficultyBadgeClass(card.difficulty))}>
                    {getDifficultyLabel(card.difficulty)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <span>{formatRelativeReviewTime(card.last_reviewed)}</span>
                {isNew ? (
                  <Badge className="shrink-0 bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    New
                  </Badge>
                ) : null}
              </CardContent>
            </SurfaceCard>
          </Link>
        );
      })}
    </section>
  );
}
