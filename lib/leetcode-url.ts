export function getLeetCodeUrl(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  return `https://leetcode.com/problems/${slug}/`
}
