import { connection } from "next/server";

import { CardGrid } from "@/components/card-grid";
import { createDB } from "@/db";

function formatCardCount(count: number) {
  return `[${count} card${count === 1 ? "" : "s"}]`;
}

export default async function Home() {
  await connection();

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
        <CardGrid cards={cards} />
      )}
    </div>
  );
}
