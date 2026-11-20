# TaskFlow — UI/UX Style Guide (Dreamy Lavender)

## Screen flow
`/login` → `/user/dashboard` (Add Task dialog, task list)
`/admin-login` → `/admin/dashboard` (charts, users, all tasks)
`/register` → back to `/login`. Dashboards need a logged-in session with the right role.

## Colours
| Role | Hex |
|---|---|
| Primary violet | #7054C8 (hover #5A41A8) |
| Soft periwinkle | #A5A0F5 |
| Pastel lavender | #EDE7FF |
| Soft pink | #FCE7F3 |
| Cream cards | #FFF9F2 |
| Plum text | #332747 |
| Muted text | #6E6384 |
| Border | #E4DBF5 |
| Completed | #2F8F5B on #DFF3E8 |
| Medium priority | #A8620A on #FFF0D6 |
| High priority | #B8326B on #FCE7F3 |

## Type and shape
Sora for headings (28px / 18px), Source Sans 3 for body (16px). Cards 18px radius, inputs and buttons 10px, soft violet shadow. Buttons at least 44px tall.

## Screens
- **Login / Admin login / Register:** split layout, brand panel and form card. Register checks that both passwords match.
- **User dashboard:** 4 KPI cards (Total, Pending, Completed, Completion rate with bar), filter chips, search, task rows with checkbox, priority badge and Delete (confirm). "Add task" opens a dialog.
- **Admin dashboard:** 4 KPI cards, status doughnut, priority bars, searchable users table (admins show "Protected"), all-tasks table.

## Tailwind 4 tokens (paste into your global CSS)
```css
@theme {
  --color-primary: #7054C8;
  --color-periwinkle: #A5A0F5;
  --color-lavender: #EDE7FF;
  --color-blush: #FCE7F3;
  --color-cream: #FFF9F2;
  --color-plum: #332747;
  --font-heading: 'Sora', system-ui, sans-serif;
}
```

## Login in the prototype
Accounts are checked against PBKDF2-SHA256 hashes, so no plain-text passwords are in the file. This is a demo gate only. Real authentication must happen in the Fastify backend (hashed passwords, tokens, role checks).
