import { connection } from "next/server";

import { createDB } from "@/db";
import { ReviewNavigator } from "@/components/review-navigator";

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default async function ReviewPage() {
  await connection();

  const db = createDB();
  const { data, error } = await db.from("cards").select("*");

  if (error) {
    throw new Error(`Failed to load cards: ${error.message}`);
  }

  return <ReviewNavigator cards={shuffleArray(data ?? [])} />;
}
