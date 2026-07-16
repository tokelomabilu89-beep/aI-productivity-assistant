# AI Workplace Productivity Assistant

A session-only SaaS dashboard with three AI-powered tools (Email Generator, Task Planner, Research Assistant), sidebar navigation, and editable/copyable/downloadable outputs. No auth, no database — all state lives in memory for the current session.

## Architecture

- **Stack**: TanStack Start (existing template) + Tailwind v4 + shadcn/ui + sonner toasts.
- **AI**: Lovable AI Gateway via a single `createServerFn` (`src/lib/ai.functions.ts`) that streams/returns text. Model: `google/gemini-3.5-flash` (fast, cheap, great for these tasks). `LOVABLE_API_KEY` stays server-side.
- **No DB, no auth, no localStorage persistence** — outputs live in React state only, cleared on refresh.

## Routes

```
src/routes/
  __root.tsx           → sidebar layout shell (SidebarProvider + AppSidebar + <Outlet/>)
  index.tsx            → Dashboard (feature cards linking to each tool)
  email.tsx            → Smart Email Generator
  planner.tsx          → AI Task Planner
  research.tsx         → AI Research Assistant
  help.tsx             → Help / usage guide + Responsible AI info
```

Each route sets its own `head()` with unique title/description/OG tags.

## Components

- `src/components/app-sidebar.tsx` — shadcn sidebar with 5 nav items + icons (Mail, CalendarClock, BookOpen, LayoutDashboard, HelpCircle).
- `src/components/tool-shell.tsx` — reusable panel: title, description, input form slot, Generate button, editable `<Textarea>` output, action bar (Regenerate, Copy, Download `.txt`, Clear), loading spinner, Responsible AI disclaimer footer.
- `src/components/responsible-ai-notice.tsx` — small alert component shown on every tool.
- `src/components/feature-card.tsx` — dashboard cards.

## AI server function

`src/lib/ai.functions.ts` — one `generateContent` server fn taking `{ tool: 'email'|'planner'|'research', input: {...} }`. Per-tool system prompts:

- **Email**: fields = prompt, tone (Formal/Friendly/Persuasive), mode (Generate / Rewrite / Improve grammar), optional existing email. Returns subject + body.
- **Planner**: fields = tasks list (textarea), range (Daily/Weekly), notes. Returns prioritized, time-blocked schedule in markdown.
- **Research**: fields = topic or pasted text, depth (Short/Detailed). Returns summary + key points + insights.

All outputs are plain text/markdown so the editable textarea is straightforward.

## UI/UX

- Design: clean, professional SaaS — neutral surfaces, one blue accent, generous spacing, rounded-xl cards, subtle shadows. Fonts already in template.
- Responsive: sidebar collapses to icon rail on tablet, offcanvas on mobile (shadcn built-in).
- `fade-in` / `scale-in` animations on cards and output panels.
- Loading: spinner + disabled button; sonner `toast.success` on copy/download, `toast.error` on failures (rate limit 429, credits 402).
- Copy: `navigator.clipboard.writeText`. Download: `Blob` + `<a download>`.

## Responsible AI

Persistent disclaimer inside each tool: "AI output may contain inaccuracies — review before use. Do not enter confidential or sensitive workplace information."

## Technical details

- Enable Lovable AI (provision `LOVABLE_API_KEY`) as the first build step.
- Provider helper in `src/lib/ai-gateway.server.ts` per Lovable AI Gateway conventions.
- `src/routes/index.tsx` placeholder is replaced with the Dashboard.
- Root `head()` gets real title/description; leaf routes override.
- No `og:image` unless we generate one — omitted per guidance.

## Out of scope

- Authentication, database, user accounts, saved history — explicitly excluded.
- Streaming responses (can add later; simple `generateText` is enough).
