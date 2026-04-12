# Design — LeetCode Flashcard Reviewer

## Design Principles

1. **Speed over polish** — This is a personal study tool. Every interaction should feel instant: open → review → close. No loading spinners, no unnecessary transitions.
2. **Content density** — Show as much useful info per screen as possible. No hero sections, no decorative illustrations.
3. **Bilingual readability** — Content mixes English and Mandarin naturally. Font stack must handle both well. Avoid narrow column widths that break CJK text awkwardly.

## Typography

```css
--font-sans: "Inter", "Noto Sans TC", system-ui, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", monospace;
```

- Body: 15px/1.7, weight 400
- Card title: 18px, weight 600
- Labels (KEY POINTS, COMPLEXITY, etc.): 12px, weight 500, uppercase, letter-spacing 0.5px, muted color
- List items: 14px/1.6

## Color System

Use shadcn/ui's default theme (Zinc-based neutral) as the base. Semantic colors for difficulty badges only:

| Difficulty | Badge BG | Badge Text |
|------------|----------|------------|
| Easy | `bg-emerald-100 dark:bg-emerald-950` | `text-emerald-700 dark:text-emerald-300` |
| Medium | `bg-amber-100 dark:bg-amber-950` | `text-amber-700 dark:text-amber-300` |
| Hard | `bg-red-100 dark:bg-red-950` | `text-red-700 dark:text-red-300` |

Tag badges use neutral style: `bg-zinc-100 dark:bg-zinc-800`, `text-zinc-600 dark:text-zinc-400`.

Support dark mode from the start (shadcn/ui handles this via `next-themes`).

## Pages

### Home (`/`)

```
┌─────────────────────────────────────────────────┐
│  LeetCode Flashcards              [12 cards]    │
│                                                 │
│  [All] [Easy] [Medium] [Hard]    Sort: [Recent] │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ #706     │ │ #146     │ │ #200     │        │
│  │ Design   │ │ LRU Cache│ │ Number of│        │
│  │ HashMap  │ │          │ │ Islands  │        │
│  │          │ │ [medium] │ │ [medium] │        │
│  │ [easy]   │ Reviewed   │ │ Never    │        │
│  │ 2 days   │ │ yesterday│ │ reviewed │        │
│  │ ago      │ │          │ │          │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
│  ┌──────────┐ ┌──────────┐                      │
│  │ ...      │ │ ...      │                      │
│  └──────────┘ └──────────┘                      │
└─────────────────────────────────────────────────┘
```

- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, gap-4
- Each card: shadcn `Card` component, clickable → navigates to `/review/[id]`
- Card content: problem number (muted), title (bold), difficulty badge, last reviewed (relative time)
- Cards never reviewed should have a subtle visual indicator (e.g. left border accent or "New" badge)
- Filter bar: toggle buttons for difficulty, dropdown for sort order
- Click any card → enter review mode for that card

### Review mode (`/review` or `/review/[id]`)

```
┌─────────────────────────────────────────────────┐
│  ← Back                              3 / 12     │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │                                         │    │
│  │              #706                       │    │
│  │         Design HashMap                  │    │
│  │             [easy]                      │    │
│  │                                         │    │
│  │       [hash-table] [design]             │    │
│  │                                         │    │
│  │         click to flip                   │    │
│  │                                         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│         [← Prev]          [Next →]              │
└─────────────────────────────────────────────────┘
```

After flip:

```
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────┐    │
│  │  KEY POINTS                             │    │
│  │  • 用固定大小的 array + hash function   │    │
│  │  • Collision handling 用 chaining       │    │
│  │  • Size 選質數讓分布更均勻              │    │
│  │                                         │    │
│  │  COMPLEXITY                             │    │
│  │  Average O(1), worst O(n)               │    │
│  │                                         │    │
│  │  FOLLOW-UP QUESTIONS                    │    │
│  │  • 為什麼 size 選質數？                 │    │
│  │  • 什麼是 load factor？                 │    │
│  │                                         │    │
│  │  GOTCHAS                                │    │
│  │  • 不能用 Python dict                   │    │
│  │  • get/remove 要處理 key 不存在         │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

- Card flip: CSS 3D transform (`transform-style: preserve-3d`, `rotateY(180deg)`)
- Transition: 400ms ease
- Keyboard shortcuts: `Space` or `Enter` to flip, `←` `→` to navigate, `Esc` to exit
- Touch: tap to flip, swipe left/right to navigate
- On flip → fire Server Action to update `last_reviewed`
- `/review` (no ID): review all cards in random order
- `/review/[id]`: start from that specific card, then continue sequentially

### Admin (`/admin`)

```
┌─────────────────────────────────────────────────┐
│  Admin                                          │
│                                                 │
│  ┌─ Add card ─────────────────────────────┐     │
│  │                                        │     │
│  │  Paste JSON from Claude:               │     │
│  │  ┌────────────────────────────────┐    │     │
│  │  │ {                              │    │     │
│  │  │   "num": 706,                  │    │     │
│  │  │   "title": "Design HashMap",   │    │     │
│  │  │   ...                          │    │     │
│  │  │ }                              │    │     │
│  │  └────────────────────────────────┘    │     │
│  │                                        │     │
│  │  Preview:                              │     │
│  │  #706 Design HashMap [easy]            │     │
│  │  3 key points · 2 follow-ups           │     │
│  │                                        │     │
│  │                        [Save card]     │     │
│  └────────────────────────────────────────┘     │
│                                                 │
│  ┌─ Existing cards ───────────────────────┐     │
│  │  #706  Design HashMap    [Edit] [Del]  │     │
│  │  #146  LRU Cache         [Edit] [Del]  │     │
│  │  #200  Number of Islands [Edit] [Del]  │     │
│  └────────────────────────────────────────┘     │
└─────────────────────────────────────────────────┘
```

- JSON textarea: monospace font, `min-h-[200px]`
- Live preview: as user pastes, validate with Zod and show parsed preview below the textarea. If invalid, show error message inline (red text, no modal).
- Save button disabled until JSON is valid
- Toast notification on success (sonner)
- Existing cards list: simple table or stacked list, each row has Edit (opens dialog with pre-filled form fields) and Delete (confirmation dialog)

## Interactions

| Action | Trigger | Feedback |
|--------|---------|----------|
| Flip card | Click / tap / Space / Enter | 3D rotate animation 400ms |
| Next card | Click button / → / swipe left | Slide transition |
| Prev card | Click button / ← / swipe right | Slide transition |
| Add card | Paste JSON → Save | Toast: "Card added: #706 Design HashMap" |
| Delete card | Click delete → confirm | Toast: "Card deleted" |
| Filter | Click difficulty toggle | Instant filter, no loading |

## Responsive Breakpoints

| Breakpoint | Grid | Card size | Notes |
|------------|------|-----------|-------|
| < 640px | 1 col | Full width | Review card fills screen |
| 640-1024px | 2 cols | — | — |
| > 1024px | 3 cols | — | Max container width 1080px |

## Animation

Keep it minimal. Only two animations in the entire app:

1. **Card flip**: `transition: transform 400ms ease` with `perspective: 800px`
2. **Card enter** (review navigation): subtle `opacity 0→1` + `translateX(±20px)`, 200ms

No page transitions, no skeleton loaders, no progress bars. Data loads server-side; pages render complete.

## Accessibility

- All interactive elements keyboard-navigable
- Card flip state announced via `aria-live` region
- Difficulty badges use text, not color alone
- Minimum contrast ratio 4.5:1 for all text
- Focus ring visible on all interactive elements (shadcn default handles this)
