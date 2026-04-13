# [TICKET-011] Admin — Edit & Delete Cards

## Status
`done`

## Dependencies
- Requires: #010 ✅

## Description
Add card management to the admin page: a list of all existing cards with edit and delete actions. Edit opens a dialog pre-filled with the card's current data as editable form fields. Delete shows a confirmation dialog before removal. Both actions use Server Actions and provide toast feedback.

## Acceptance Criteria
- [x] Below the "Add card" section, an "Existing cards" section lists all cards showing: problem number, title, and Edit / Delete buttons
- [x] Clicking "Edit" opens a shadcn Dialog with form fields pre-filled: num, title, difficulty (select), tags (comma-separated input), key_points (textarea, one per line), complexity, follow_ups (textarea), gotchas (textarea)
- [x] Saving edits calls a Server Action that updates the card in the database; toast: "Card updated: #706 Design HashMap"
- [x] Clicking "Delete" opens a confirmation dialog: "Delete #706 Design HashMap? This cannot be undone."
- [x] Confirming delete calls a Server Action that removes the card; toast: "Card deleted"
- [x] After save or delete, the card list updates to reflect the change (via `revalidatePath`)

## Design Reference
- **Layout**: § Admin (`/admin`) — existing cards list wireframe with Edit/Del buttons
- **Interactions**: § Interactions — "Delete card: Click delete → confirm → Toast"

## Visual Reference
Below the JSON paste section, a bordered "Existing cards" section shows a stacked list: "#706 Design HashMap [Edit] [Del]", "#146 LRU Cache [Edit] [Del]". Clicking Edit opens a centered dialog with form fields. Clicking Del opens a smaller confirmation dialog with Cancel/Delete buttons (Delete in red).

## Implementation Notes
- Key files: `app/admin/page.tsx` (add card list), `app/admin/actions.ts` (add `updateCard`, `deleteCard` Server Actions)
- Edit dialog: use shadcn `Dialog` with form fields — this is a Client Component section within the admin page
- For array fields (tags, key_points, etc.): use textareas where each line is one item, then split on newlines before saving
- Delete confirmation: shadcn `AlertDialog` component
- Server Actions should `revalidatePath('/admin')` and `revalidatePath('/')` after mutations to keep both pages fresh
- Card list can be fetched server-side in the admin page component alongside the "Add card" form

## Testing
- Navigate to `/admin` with existing cards — card list renders with Edit/Del buttons
- Click Edit on a card — dialog opens with correct pre-filled data
- Modify a field, save — toast appears, card list updates
- Click Delete on a card — confirmation dialog appears
- Confirm delete — toast appears, card removed from list
- Navigate to `/` — deleted card gone, edited card reflects changes
