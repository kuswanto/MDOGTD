# 🏠 MGTD — A GTD Vault for Obsidian

A complete **Getting Things Done** personal-organisation system built on **Obsidian Bases**. Open the vault, and the `Home.md` command center gives you a live dashboard for every part of your life — capture, clarify, organize, and review.

> This vault is a **template**. It ships with small `Example ~` notes in every space to show you how the system fits together. Keep them as a guide, edit them, or delete them and start fresh.

---

## ✨ Features

- **Home `Home.md` command center** — live Bases views for Inbox, Next Actions, Projects, Waiting, Someday Maybe, Agendas, Reference, and Completed, all on one page.
- **All GTD spaces**, numbered so they sort in the correct order in the file explorer.
- **Obsidian Bases as the data engine** — every list is a `.base` file (`_bases/`), so views are fast, filterable, and theme-agnostic.
- **Property-driven notes** — `status`, `type`, `context`, `energy`, `project`, `area`, `due`, `start`, `completed` as first-class frontmatter.
- **Per-project action lists** — embed `Project Actions.base` in any project note to see just that project's open actions.
- **Per-area live views** — every area note shows its own actions and projects automatically.
- **Daily notes + Weekly Review templates** for the GTD horizontal/vertical review.
- **Recurring actions** — schedule repeating work (`every` + `next`) and re-arm it with one command instead of re-creating it.

## 🚀 Getting started

1. Clone or download this vault. In Obsidian: **Open another vault → Open folder as vault** → select it.
2. Use the **Home page** (opens automatically via the *homepage* plugin) or press `Cmd/Ctrl + O` and open `Home.md`.
3. See the **How to use** callout on every landing note for space-specific instructions.
4. Make it yours: delete the `Example ~` notes, update the **70 Areas** to your own life domains, and capture your first item into the **Inbox**.

> 💡 **After any first open:** if QuickAdd choices (the `+ Action` / `Recurring → Re-arm` commands) don't show up, restart Obsidian or toggle the QuickAdd plugin once — QuickAdd caches its config in memory.

## 🗺️ How the system works

GTD in one sentence: **capture → clarify → organize → reflect → engage**.

| Step | Where |
|---|---|
| **Capture** everything | `10 Inbox/` (the capture landing `_Inbox.md`) |
| **Clarify** each item into one bounded place | Next Action · Project · Waiting · Someday Maybe · Agenda · Area · Reference |
| **Organize** by context & energy | `20 Next Actions/`, batchable via `context` and `energy` properties |
| **Reflect** | Daily notes + the **Weekly Review** template keep the system honest |
| **Engage** | Pick from Next Actions and Projects, do the work, then archive it |

### The spaces

| Folder                    | Purpose                                                         | Main note                       |
| ------------------------- | --------------------------------------------------------------- | ------------------------------- |
| `10 Inbox/`               | Capture everything; unprocessed                                 | `_Inbox.md`                     |
| `20 Next Actions/`        | Single next physical actions                                    | `_Next Actions.md`              |
| `30 Projects/`            | Outcomes needing >1 action                                      | `_Projects.md`                  |
| `40 Waiting/`             | Delegated / waiting on others                                   | `_Waiting.md`                   |
| `50 Someday Maybe/`       | Deferred ideas                                                  | `_Someday Maybe.md`             |
| `60 Agendas/`             | Standing people/team agendas                                    | `_Agendas.md`                   |
| `70 Areas/`               | Life/career domains — one note per area                         | `_Areas.md` + one note per area |
| `80 Reference/`           | Non-actionable material                                         | `_Reference.md`                 |
| `90 Journal/`             | Daily notes + capture surface                                   | `_Journal.md`                   |
| `100 Completed/`          | **Archive** for done items (`Actions/` and `Projects/`)         | `_Completed.md`                 |
| `_bases/`                 | Obsidian Bases source files (the engine)                        | —                               |
| `Templates/`              | Templates for the core Templates plugin                         | —                               |
| `_scripts/`               | QuickAdd user scripts (the re-arm macro)                        | —                               |

## 🏷️ Properties

`.obsidian/types.json` defines the type overrides:

```json
"due": "date", "start": "date", "created": "date", "completed": "date",
"next": "date", "last": "date",
"project": "file", "area": "file",
"context": "multitext", "energy": "multitext", "status": "multitext", "type": "multitext"
```

- `status` and `type` are stored as YAML **lists** (`status:\n  - active`). Obsidian has no native dropdown type — autocomplete pulls from previously used values.
- `project` / `area` are **file** properties pointing at the parent note (path or `[[wikilink]]`).

Full example — an **action** linked to a project and area:

```yaml
type:
  - action
status:
  - next
context:
  - "@Computer"
energy:
  - medium
project: 30 Projects/Example - Launch Personal Website.md
area: 70 Areas/Example - Work.md
due: 2026-08-22
completed:
created: 2026-08-19
tags:
  - gtd
  - type/action
```

## 📊 The Bases (`_bases/*.base`)

Each space folder's landing note embeds a `.base` that filters the vault and renders a live view. Bases use a custom expression engine — the filters always compare **list-safe**:

- `list(status).contains("next")`
- `!list(status).contains("done")`
- `list(type).contains("project")`
- `file.hasTag("type/project")` (the tag is separate from the `type` property)
- Every base ends with `file.folder != "Templates"` to exclude template notes.

Dates use `date(...)` + `today()` (e.g. `if(due, date(due) <= today(), false)`).

The "open" predicate is effectively `!list(status).contains("done")` + `!list(status).contains("archived")`.

### Embed a project's actions anywhere

In any project note:

```markdown
## Next actions

![[../_bases/Project Actions.base]]
```

The base filters on `list(project).contains(this)` — i.e. "show actions whose `project` property points at this note."

### Embed an area's live view

In any area note:

```markdown
## Live view

![[../_bases/Area Actions.base]]
```

## ✅ Completing something (manual)

1. Set `status: done` (list form) and `completed: YYYY-MM-DD` in the frontmatter.
2. Move the note into `100 Completed/` — `Actions/` for actions, `Projects/` for projects.
3. Done items automatically leave the active bases and appear in `Completed.base`.

## 🔁 Recurring actions

Things you do **on a repeating schedule** — weekly reports, monthly check-ins, daily backups — are `type: recurring` notes (template `Templates/Recurring Action.md`; example: `20 Next Actions/Example - Weekly status update.md`). They work like actions but instead of being archived they **re-arm themselves**:

```yaml
type:
  - recurring
status:
  - next
every: 7d      # d | w | m | y  — or daily / weekly / monthly / yearly
next: 2026-08-26   # when it's due next
```

**Using a recurring action:**

1. Create one with **QuickAdd → Recurring Action** (a command-palette template choice) or copy the template; set `every` and `next`.
2. It appears in the **Recurring view** (`_bases/Recurring.base`) embedded on the Journal page and in every daily note — with a "due today / overdue / next 7 days" breakdown and a ⏱ countdown.
3. After you finish each cycle, run the QuickAdd macro **"Recurring → Re-arm"** from the command palette. It reads `every`, bumps `next` by the right amount, and keeps the note active.
4. To stop it permanently: mark `status: done` + `completed`, and move the note to `100 Completed/Actions/` like a normal action.

The re-arm logic lives in a plain user script at `_scripts/rearm-recurring.js`, wired as a QuickAdd **Macro** choice (`.obsidian/plugins/quickadd/data.json`). Both new QuickAdd choices — **Recurring Action** and **Recurring → Re-arm** — are already configured in the vault. Remember: QuickAdd caches its config in memory, so **restart Obsidian or toggle the QuickAdd plugin** once after first open for them to appear.

## 📝 Daily notes & weekly review

- Daily notes land in `90 Journal/` (`YYYY-MM-DD`) using `Templates/Daily.md`.
- Weekly review uses `Templates/Weekly Review.md` (`Cmd/Ctrl + P` → "Templates: Insert Weekly Review").

## 🔌 Plugins used

**Required — vault won't work as intended without these:**

| Plugin | Why |
|---|---|
| `obsidian-icon-folder` (Iconize) | Folder icons & colors in the explorer |
| `homepage` | Opens `Home.md` on startup (`Home.md:5-6`, `.obsidian/plugins/homepage/data.json:5`) |
| `quickadd` | Templates for every space (`+ Action`, `+ Project`, `+ Inbox`, `+ Waiting`, `+ Someday`, `+ Agenda`, `+ Area`, `+ Reference`, `+ Recurring Action`) + the `Recurring → Re-arm` macro (`.obsidian/plugins/quickadd/data.json:3-320`) |
| `obsidian-style-settings` | Theme palette & layout tweaks (moonstone / baseline) |

**Removed in latest update — no longer shipped (reinstall manually if you want them):**

| Plugin | Why it was there | Why removed |
|---|---|---|
| `auto-note-mover` | Auto-move `status: done` notes to `100 Completed/` | **Never configured** — no `data.json` existed and `README.md:131-135` now documents the manual flow (`status: done` → `completed` → manual move). With **Bases** as the data engine (`_bases/*.base` filter on `!list(status).contains("done")`) the move is archival only. |
| `slash-complete` | Notion-style `/` autocomplete — replacement for disabled core `slash-command` (`.obsidian/core-plugins.json:17` → `"slash-command": false`) | GTD flow uses **QuickAdd** + core **Templates**, not `/` triggers. Re-enable the core Slash Commands or reinstall `slash-complete` if you prefer `/` block insertion. |
| `nldates-obsidian` | Natural-language date parsing via `@` (`autocompleteTriggerPhrase: "@"`) | Dates are now entered via the **Properties** date picker and `{{DATE:YYYY-MM-DD}}` in `Templates/*.md` (`.obsidian/templates.json:2`). Reinstall for `@tomorrow` shorthand. |

Core plugins in use: **Bases**, Daily notes, Templates, Properties, Workspaces, File recovery.

## 🛠️ Extending / editing tips

- Landing notes are named `_<Space>.md` (underscore sorts to the top). Real items use a descriptive name in the space folder.
- Instructions live in collapsed callouts `> [!tip]- How to use …` — don't use `<details>` HTML (Obsidian won't render markdown inside it).
- After structural changes, verify: all `[[wikilink]]`s resolve, `.base` files parse as YAML, `.obsidian/**/data.json` files are valid JSON.
- `Templates/` uses `{{date}}` / `{{title}}` placeholders — the core Templates plugin substitutes them.

## ⚖️ License

MIT — see [LICENSE](LICENSE).