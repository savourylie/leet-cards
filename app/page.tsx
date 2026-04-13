import { connection } from "next/server";

import {
  getFirstSearchParam,
  normalizeCardSort,
  normalizeDifficultyFilter,
} from "@/lib/card-controls";
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

  return (
    <div className="space-y-6 py-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            LeetCode Flashcards
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatCardCount(cards.length)}
        </p>
      </header>

      {cards.length === 0 ? (
        <section className="rounded-xl border border-dashed bg-card/60 px-6 py-12 text-center">
          <h2 className="text-lg font-semibold tracking-tight">No cards yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first flashcard from <span className="font-mono">/admin</span>{" "}
            once the admin flow is in place.
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
