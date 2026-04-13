import { notFound } from "next/navigation";
import { connection } from "next/server";

import { createDB } from "@/db";
import { ReviewNavigator } from "@/components/review-navigator";

type ReviewCardPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReviewCardPage({
  params,
}: ReviewCardPageProps) {
  await connection();

  const { id } = await params;
  const cardId = parseInt(id, 10);

  if (isNaN(cardId)) {
    notFound();
  }

  const db = createDB();
  const { data, error } = await db
    .from("cards")
    .select("*")
    .order("num", { ascending: true });

  if (error) {
    throw new Error(`Failed to load cards: ${error.message}`);
  }

  const cards = data ?? [];
  const startIndex = cards.findIndex((c) => c.id === cardId);

  if (startIndex === -1) {
    notFound();
  }

  const orderedCards = [
    ...cards.slice(startIndex),
    ...cards.slice(0, startIndex),
  ];

  return <ReviewNavigator cards={orderedCards} />;
}
