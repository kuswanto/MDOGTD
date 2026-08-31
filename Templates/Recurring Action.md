---
type:
  - recurring
status:
  - next
every: 7d
next:
context:
  - "@Computer"
energy:
  - medium
project:
area:
created: {{DATE:YYYY-MM-DD}}
tags:
  - gtd
  - type/recurring
---

# {{title}}

## Outcome

(One line: what one completed cycle looks like — e.g. "Weekly report sent".)

## Notes

(Support material, links, reference.)

> **Recurring action** — instead of marking this `done` and archiving it, run the QuickAdd macro **"Recurring → Re-arm"** (`Cmd/Ctrl + P` → QuickAdd). It bumps `next` by `every` days and keeps the note active, so it reappears in the [[90 Journal/_Journal|Journal]] → Recurring view on its next cycle. When you want to stop this recurring action permanently, mark it `done` and move it to `100 Completed/Actions/`.