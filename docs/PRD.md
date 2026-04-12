# PRD — LeetCode Flashcard Reviewer

## Overview

A personal flashcard web app for reviewing LeetCode problems during Google interview prep. Cards are created after each practice session with Claude, capturing key concepts, complexity analysis, follow-up questions, and common mistakes.

## Problem

Practicing LeetCode problems without a structured review system leads to forgetting. The gap between "I solved it" and "I can explain it in an interview" requires spaced repetition and quick-reference summaries — not re-reading full solutions.

## User

Just you (Calvin). Single-user app with a lightweight admin flow. No auth needed unless you want to gate the admin page later.

## Core Workflows

### 1. Review cards

- Landing page shows all cards in a grid
- Click a card to enter review mode: see the problem name + difficulty, tap to flip and reveal key points, complexity, follow-ups, gotchas
- Navigate between cards with prev/next or swipe
- Cards can be filtered by difficulty (easy / medium / hard) and tag
- Cards can be sorted by last reviewed date or problem number

### 2. Add a card (from Claude session)

This is the critical workflow to streamline:

1. After practicing a problem with Claude, Claude outputs a JSON block with the card data
2. You copy the JSON
3. Go to `/admin` → paste JSON into a single text field → hit submit
4. Card is saved to DB and immediately visible on the main page

The JSON schema Claude will output:

```json
{
  "num": 706,
  "title": "Design HashMap",
  "difficulty": "easy",
  "tags": ["hash-table", "design"],
  "key_points": [
    "用固定大小的 array + hash function（key % size）",
    "Collision handling 用 chaining：每個 bucket 存 list of (key, value) tuples"
  ],
  "complexity": "Average O(1), worst O(n)",
  "follow_ups": [
    "為什麼 size 選質數？— 減少 mod 碰撞",
    "什麼是 load factor？— 元素數 / bucket 數"
  ],
  "gotchas": [
    "不能用 Python dict — 那就是 hashmap 本身",
    "get / remove 要處理 key 不存在的 edge case"
  ]
}
```

### 3. Edit / delete a card

- On `/admin`, list all existing cards with edit and delete buttons
- Edit opens pre-filled form
- Delete requires confirmation

### 4. Quick stats

- Total cards count
- Cards never reviewed count
- Last reviewed date per card
- Optional: streak tracker (days in a row you reviewed)

## Card Data Model

| Field | Type | Description |
|-------|------|-------------|
| id | auto-increment | Primary key |
| num | integer | LeetCode problem number |
| title | string | Problem name |
| difficulty | enum | easy, medium, hard |
| tags | string[] | e.g. hash-table, linked-list, dp |
| key_points | string[] | Core concepts to remember |
| complexity | string | Time/space complexity summary |
| follow_ups | string[] | Interview follow-up questions with answers |
| gotchas | string[] | Common mistakes and pitfalls |
| created_at | timestamp | Auto-set |
| last_reviewed | timestamp | Updated when card is flipped in review |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Card grid + filter/sort → click to review |
| `/review` | Full-screen flashcard review mode |
| `/review/[id]` | Deep link to a specific card |
| `/admin` | Add (JSON paste), edit, delete cards |

## Non-Goals

- No auth / multi-user
- No spaced repetition algorithm (just manual review for now; can add SM-2 later)
- No solution code storage (that stays in your LeetCode / GitHub)
- No mobile app (responsive web is enough)
