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
