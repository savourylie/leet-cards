import Link from "next/link";

import type { Card } from "@/lib/types";
import {
  formatRelativeReviewTime,
  getDifficultyBadgeClass,
  getDifficultyLabel,
} from "@/lib/card-display";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card as SurfaceCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeetCodeLinkButton } from "@/components/leetcode-link-button";

type CardGridProps = {
  cards: Card[];
};

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
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>#{card.num}</span>
                      <LeetCodeLinkButton title={card.title} />
                    </div>
                    <CardTitle className="mt-1 line-clamp-2 text-[18px] font-semibold leading-snug">
                      {card.title}
                    </CardTitle>
                    {card.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {card.description}
                      </p>
                    ) : null}
                  </div>
                  <Badge className={cn("shrink-0 capitalize", getDifficultyBadgeClass(card.difficulty))}>
                    {getDifficultyLabel(card.difficulty)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>{formatRelativeReviewTime(card.last_reviewed)}</span>
                  {card.completion_count > 0 ? (
                    <span
                      aria-label={`Completed ${card.completion_count} time${card.completion_count === 1 ? "" : "s"}`}
                      className="inline-flex items-center gap-1 tabular-nums"
                    >
                      <span aria-hidden="true">✅</span>
                      <span>× {card.completion_count}</span>
                    </span>
                  ) : null}
                </div>
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
