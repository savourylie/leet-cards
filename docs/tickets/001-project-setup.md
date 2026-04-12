# [TICKET-001] Project Setup & Layout Shell

## Status
`done`

## Dependencies
- Requires: None

## Description
Bootstrap the Next.js 14+ App Router project with all required dependencies, configure Tailwind CSS v4 with shadcn/ui, set up the font stack (Inter, Noto Sans TC, JetBrains Mono), and create the root layout with a responsive container. This is the foundational scaffold that every other ticket builds on.

## Acceptance Criteria
- [x] Next.js 14+ project initialised with App Router and TypeScript
- [x] All production dependencies installed: `next`, `react`, `react-dom`, `@vercel/postgres`, `drizzle-orm`, `zod`, `sonner`, `next-themes`
- [x] All dev dependencies installed: `drizzle-kit`, `tailwindcss` v4, `typescript`, `@types/react`
- [x] shadcn/ui initialised with Zinc-based neutral theme; components installed: `card`, `badge`, `button`, `dialog`, `textarea`, `select`, `separator`
- [x] Root layout (`app/layout.tsx`) renders with the correct font stack (`Inter`, `Noto Sans TC`, `system-ui` for sans; `JetBrains Mono`, `Fira Code` for mono)
- [x] `next-themes` ThemeProvider wraps the app with system/dark/light support
- [x] A centered responsive container with `max-w-[1080px]` is applied in the layout
- [x] `npm run dev` starts without errors and renders a placeholder home page

## Design Reference
- **Typography**: § Typography — font families, body size 15px/1.7
- **Color System**: § Color System — shadcn/ui Zinc-based neutral base
- **Responsive**: § Responsive Breakpoints — max container width 1080px

## Visual Reference
Running `npm run dev` and navigating to `localhost:3000` shows a blank page with the correct fonts loaded (visible in DevTools), dark mode toggle functional, and a centered content container.

## Implementation Notes
- Key files: `app/layout.tsx`, `tailwind.config.ts`, `components.json` (shadcn), `package.json`
- Use `next/font/google` for Inter and Noto Sans TC; JetBrains Mono can be loaded the same way or via CSS `@import`
- Tailwind v4 config differs from v3 — follow the v4 setup guide
- sonner's `<Toaster />` component should be added to the root layout

## Testing
- Run `npm run dev` — page loads at `localhost:3000` with no console errors
- Inspect fonts in DevTools: body text uses Inter, CJK characters fall back to Noto Sans TC
- Toggle dark mode (if ThemeProvider is working, `<html>` class toggles between `light` and `dark`)
