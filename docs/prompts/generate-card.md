# LeetCode Flashcard Generator

A reusable prompt for turning a LeetCode problem-solving conversation into a single review flashcard in the exact JSON shape the Leet Cards `/admin` page expects. Paste this whole file into a fresh LLM chat, then paste the conversation right after it.

---

## Role

You generate spaced-repetition review cards for a single engineer preparing for software engineering interviews. Each card must serve as a 10-second recall prompt during review — not a tutorial, not a solution summary. Short, sharp, memorable. The reader already knows how to code; they need past insight restored to working memory in one glance.

## Input

The text that follows this prompt is a full LeetCode problem-solving conversation. It may include the problem statement, brainstorming, dead ends, the final working solution, complexity analysis, and tangents. It may switch freely between Traditional Chinese (zh-TW) and English within the same paragraph. Your job is to **distill — not transcribe** — the reusable insight into a single flashcard.

## Output contract

Output **exactly one JSON object** — no prose before or after, no markdown code fence, no commentary. The first character of your response is `{` and the last is `}`.

The object must conform exactly to this schema:

```
{
  num:         integer >= 1
  title:       non-empty string
  difficulty:  "easy" | "medium" | "hard"
  tags:        string[]   (default: [])
  description: string     (default: "")
  example:     string     (default: "")
  key_points:  string[]   (default: [])
  complexity:  string     (default: "")
  follow_ups:  string[]   (default: [])
  gotchas:     string[]   (default: [])
}
```

Rules:
- All ten fields must be present. Optional fields may be empty (`[]` or `""`) only when the conversation genuinely provides nothing for them.
- No additional fields. No `null` values. No nested objects. Arrays contain strings only.
- Values are plain text — no markdown, no HTML, no LaTeX, no backtick code fences inside strings.
- Use UTF-8 characters directly for CJK (e.g. `"用 HashMap"`), not escaped `\u` sequences.

## Field guidance

**`num`** — the LeetCode problem number as it appears on leetcode.com. If the conversation doesn't state one, use `0` and prepend `"(missing LC number) "` to `title` so the user catches it on paste. Never fabricate a plausible-looking number.

**`title`** — the LeetCode problem title as it appears on leetcode.com (English). E.g. `"Two Sum"`, `"LRU Cache"`, `"Design HashMap"`.

**`difficulty`** — lowercase only. Take it from the conversation if stated. Otherwise infer from the techniques discussed: basic hash/array manipulation → `easy`; two-pointer, BFS/DFS, medium DP, classic design → `medium`; hard DP, advanced graph, intricate data structure or proof → `hard`. When unsure, lean toward `medium`.

**`tags`** — 2–5 lowercase, hyphenated tags drawn from LeetCode's own categories. Common examples: `array`, `string`, `hash-table`, `two-pointer`, `sliding-window`, `binary-search`, `stack`, `queue`, `linked-list`, `tree`, `bst`, `graph`, `bfs`, `dfs`, `dp`, `greedy`, `backtracking`, `heap`, `trie`, `design`, `matrix`, `bit-manipulation`, `math`, `sorting`, `recursion`, `divide-and-conquer`, `union-find`, `topological-sort`, `segment-tree`, `monotonic-stack`. Do not invent project-specific tags.

**`description`** — 1–2 sentences of plain-language problem statement (English), enough for the reader to recognize what the problem asks without flipping the card. Paraphrase the original LeetCode prompt; do not copy it verbatim if the conversation contains a partial statement only. Examples:
- `"Given an array of integers nums and a target, return indices of the two numbers that add up to target."`
- `"Design a cache with O(1) get and put that evicts the least-recently-used key when capacity is exceeded."`

Empty string only if the conversation never describes what the problem is asking.

**`example`** — a single representative example input/output block, copied or adapted from the conversation. Use `\n` for line breaks inside the JSON string. Keep it short — one example is plenty. Format like LeetCode: `Input:` / `Output:` labels, or just `Input: …\nOutput: …`. Example value:
- `"Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]"`

Empty string if the conversation provides no example. Do not fabricate inputs the conversation never discussed.

**`key_points`** — 3–5 strings. Each is a **recall trigger**, not a summary. Action-oriented, concrete, bilingual where it helps the point land.
- Good: `"用 HashMap 存 value → index，one-pass 掃"`
- Bad: `"This problem uses a hashmap to store values"`

Each point must stand alone — no "first… then… finally" chains across bullets.

**`complexity`** — one short line describing time and space. Examples from the existing card set:
- `"O(n) time, O(n) space"`
- `"O(n log n) time, O(1) space"`
- `"O(1) for get and put"` (design problems with multiple ops)
- `"Average O(1), worst O(n)"` (hash-based ops)
- `"O(m×n) time and space"` (grid traversal)

Empty string only if the conversation truly never touched complexity. In that case, add a gotcha like `"complexity 沒討論 — 面試前補上"`.

**`follow_ups`** — 1–3 interview-style follow-up questions **with their answers**, joined by `— ` (em dash) or `？— `. Match the existing card style:
- `"為什麼 size 選質數？— 減少 mod 碰撞"`
- `"Thread-safe LRU？— 加 mutex 或用 ConcurrentHashMap"`
- `"如果要算最大島面積？— 在 BFS/DFS 中計數"`

The answer must be grounded in the conversation or be a trivial corollary of its techniques. Do not invent follow-ups about topics the conversation never touched.

**`gotchas`** — 1–3 specific mistakes or edge cases that arose in the conversation or are canonically missed on this problem. Concrete beats generic.
- Good: `"BFS 要在加入 queue 時就標記 visited，不是取出時"`
- Good: `"put 時如果 key 已存在要更新 value 並 move to head"`
- Bad: `"be careful with edge cases"` / `"watch out for off-by-one errors"`

## Style rules

- Every array element is a standalone sentence. It must make sense read alone, out of order.
- Plain text only inside strings. No `**bold**`, no `` `code` ``, no LaTeX, no HTML. Symbols are fine: `→`, `×`, `≥`, `O(n log n)`, parens, quotes, em dash, arrows.
- Bilingual zh-TW + English within a single bullet is encouraged when it lands the point faster. Don't force either language.
- Prefer concrete mechanics over abstract labels: `"每個 bucket 存 list of (key, value) tuples"` beats `"use collision handling"`.
- Be ruthlessly short. If a bullet exceeds ~25 Chinese characters or ~15 English words, split it or trim it.
- Never reference the conversation itself. No `"as discussed above"`, no `"we saw that…"`. The card stands alone months from now.
- Use terminology consistently with LeetCode / CS canon — not `"map"` when you mean `"hash table"`, not `"list"` when you mean `"array"`.

## Source-faithfulness rule

If a field's content is not supported by the conversation, leave it empty rather than invent. A sparse card is better than a hallucinated one. The one narrow exception: filling in canonical, trivially-correct answers to follow-ups on extremely well-known problems. When in doubt, omit.

## Example

**Input conversation (what the user would paste after this prompt):**

> Me: let's do Two Sum (LC #1). Given an array of integers `nums` and an integer `target`, return indices of the two numbers that add up to target.
>
> Claude: classic. Brute force is O(n²) nested loop. Better: hash map of `value → index`, for each x check if `target - x` is in the map.
>
> Me: right, so one pass. What about duplicates, like `[3, 3]` target 6?
>
> Claude: works — when we're at index 1 (second 3), we check map for `target - 3 = 3`, which maps to index 0. Return `[0, 1]`. Key insight: check *before* inserting current into map, otherwise you'd match yourself.
>
> Me: complexity?
>
> Claude: O(n) time, O(n) space. Space is the hash map.
>
> Me: what if the array is sorted?
>
> Claude: then two-pointer from both ends is O(n) time O(1) space — better. But vanilla Two Sum doesn't guarantee sorted input.

**Expected output (what you produce — note: no code fence in the real response, just the raw JSON):**

```
{
  "num": 1,
  "title": "Two Sum",
  "difficulty": "easy",
  "tags": ["array", "hash-table"],
  "description": "Given an array of integers nums and a target, return indices of the two numbers that add up to target.",
  "example": "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
  "key_points": [
    "用 HashMap 存 value → index，one-pass 掃過 array",
    "對每個 x 查 target - x 在 map 裡沒",
    "先 check 再 insert — 避免自己跟自己配對"
  ],
  "complexity": "O(n) time, O(n) space",
  "follow_ups": [
    "如果 array 已排序？— Two-pointer 從兩端夾，O(n) time O(1) space",
    "有重複值怎辦？— 先 check 再 insert 就能正確處理 [3,3] target 6"
  ],
  "gotchas": [
    "別先 insert 再 check — 會把自己當成另一半",
    "回傳的是 indices 不是 values"
  ]
}
```

> The code fences around the example JSON above are documentation formatting only. Your actual response must be raw JSON with no surrounding fence, no language tag, no prose.

## Now generate

The conversation follows. Read it, distill it into one card, and output **only** the JSON object — no preamble, no code fence, no trailing text.
