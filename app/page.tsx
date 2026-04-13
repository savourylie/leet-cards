import Link from "next/link";
import { connection } from "next/server";

import {
  getFirstSearchParam,
  normalizeCardSort,
  normalizeDifficultyFilter,
} from "@/lib/card-controls";
import { formatRelativeReviewTime } from "@/lib/card-display";
import { CardFilter } from "@/components/card-filter";
import { createDB } from "@/db";

function formatCardCount(count: number) {
  return `[${count} card${count === 1 ? "" : "s"}]`;
}

type HomeProps = {
  searchParams?: Promise<{
    difficulty?: string | string[];
    sort?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  await connection();

  const params = searchParams ? await searchParams : undefined;
  const initialDifficulty = normalizeDifficultyFilter(
    getFirstSearchParam(params?.difficulty),
  );
  const initialSort = normalizeCardSort(getFirstSearchParam(params?.sort));

  const db = createDB();
  const { data, error } = await db
    .from("cards")
    .select("*")
    .order("num", { ascending: true });

  if (error) {
    throw new Error(`Failed to load cards: ${error.message}`);
  }

  const cards = data ?? [];
  let neverReviewedCount = 0;
  let hasReviewedCards = false;
  let latestReviewedAt: string | null = null;
  let latestReviewedTimestamp = Number.NEGATIVE_INFINITY;

  for (const card of cards) {
    if (card.last_reviewed === null) {
      neverReviewedCount += 1;
      continue;
    }

    hasReviewedCards = true;

    const reviewedTimestamp = new Date(card.last_reviewed).getTime();
    if (
      !Number.isNaN(reviewedTimestamp) &&
      reviewedTimestamp > latestReviewedTimestamp
    ) {
      latestReviewedTimestamp = reviewedTimestamp;
      latestReviewedAt = card.last_reviewed;
    }
  }

  const latestReviewLabel = !hasReviewedCards
    ? "No reviews yet"
    : latestReviewedAt === null
      ? "Last reviewed date unavailable"
      : `Last reviewed ${formatRelativeReviewTime(latestReviewedAt)}`;
  const statsSummary = [
    formatCardCount(cards.length),
    `${neverReviewedCount} new`,
    latestReviewLabel,
  ].join(" · ");

  return (
    <div className="space-y-6 py-4">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            LeetCode Flashcards
          </h1>
        </div>
        <p className="text-sm text-muted-foreground sm:text-right">
          {statsSummary}
        </p>
      </header>

      {cards.length === 0 ? (
        <section className="rounded-xl border border-dashed bg-card/60 px-6 py-12 text-center">
          <h2 className="text-lg font-semibold tracking-tight">No cards yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first flashcard in{" "}
            <Link
              href="/admin"
              className="font-mono text-foreground underline underline-offset-4"
            >
              /admin
            </Link>
            .
          </p>
        </section>
      ) : (
        <CardFilter
          cards={cards}
          initialDifficulty={initialDifficulty}
          initialSort={initialSort}
        />
      )}
    </div>
  );
}
