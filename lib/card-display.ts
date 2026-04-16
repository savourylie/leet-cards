export function getDifficultyLabel(difficulty: string) {
  if (!difficulty) {
    return "Unknown";
  }

  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export function getDifficultyBadgeClass(difficulty: string) {
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

export function getDifficultyEyebrowClass(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-emerald-600 dark:text-emerald-400";
    case "medium":
      return "text-amber-600 dark:text-amber-400";
    case "hard":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-muted-foreground";
  }
}

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

export function formatRelativeReviewTime(
  lastReviewed: string | null,
  options?: {
    emptyLabel?: string;
  },
) {
  if (!lastReviewed) {
    return options?.emptyLabel ?? "Never reviewed";
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
