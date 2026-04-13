export const difficultyFilters = ["all", "easy", "medium", "hard"] as const;

export type DifficultyFilter = (typeof difficultyFilters)[number];

export const cardSortOptions = ["recent", "number"] as const;

export type CardSortOption = (typeof cardSortOptions)[number];

export function normalizeDifficultyFilter(
  value: string | null | undefined,
): DifficultyFilter {
  if (value === "easy" || value === "medium" || value === "hard") {
    return value;
  }

  return "all";
}

export function normalizeCardSort(
  value: string | null | undefined,
): CardSortOption {
  if (value === "number") {
    return value;
  }

  return "recent";
}

export function getFirstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
