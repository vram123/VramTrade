# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

VramTrade is a paper-trading web app. Users get $10,000 in virtual cash and trade real stocks against live market data from Finnhub. Portfolio state, holdings, trade history, watchlist, and theme all live in browser `localStorage` — there is no backend for any of that. A separate Django REST API (`backend/`) exists solely for account login/registration/deletion.

## Commands

Frontend (project root):
```bash
npm install       # install dependencies
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build     # tsc -b (project-references type check) then vite build
npm run preview   # preview the production build
npm run lint      # oxlint
```

Backend (`backend/`), a Django + DRF API used only for auth:
```bash
python3 -m venv .venv                          # first-time setup
.venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py runserver 8000      # http://localhost:8000
```

There is no test suite/framework configured for either the frontend or the backend.

Requires a Finnhub API key: copy `.env.example` to `.env` and set `VITE_FINNHUB_API_KEY`. Without it, `hasApiKey()` returns false and the app renders with a warning banner instead of fetching data (see `src/api/finnhub.ts` and the banner in `src/App.tsx`). `.env.example` also sets `VITE_API_BASE_URL` (default `http://localhost:8000/api`), which points the frontend at the Django backend above.

## Architecture

**Two independent runtimes, joined only by the auth API.** The React/Vite frontend owns all trading logic and state; the Django backend (`backend/`) only issues DRF auth tokens and knows nothing about portfolios, watchlists, or trades. `src/App.tsx` is a single-page component that owns top-level UI state (selected symbol, watchlist array, S&P 500 browser modal, active sidebar view) and wires together hooks/store/components. There is no client-side router — a `SidebarView` (`"dashboard" | "news" | "guides" | "settings"`, defined in `src/components/Sidebar.tsx`) held in `App.tsx` state swaps which top-level page renders; `Sidebar` is the persistent left-hand nav for switching between them.

**Data flow is poll-based, not push-based.** Finnhub's free tier has no websocket/streaming and no historical OHLC candles for stocks. All "live" data is produced by hooks that poll on `setInterval` and accumulate results client-side:
- `useLiveQuote` (src/hooks/useLiveQuote.ts) — polls the selected symbol's quote every 5s and appends to an in-memory `history: PricePoint[]` array (capped at 180 points) that becomes the chart data, since Finnhub free tier has no historical candles.
- `useWatchlistQuotes` (src/hooks/useWatchlistQuotes.ts) — polls all watchlist + held symbols every 10s via `Promise.allSettled`.
- `useNewsFeed` (src/hooks/useNewsFeed.ts) — polls market + per-symbol news every 120s and merges/dedupes into existing state by article id rather than replacing it.

When touching these hooks, preserve the cancellation guards (`cancelled` flag + ref checks) — they exist to prevent races when the selected symbol or watchlist changes mid-flight.

**API layer** (`src/api/finnhub.ts`) is the only place that talks to Finnhub. It normalizes Finnhub's terse raw field names (`c`, `d`, `dp`, etc.) into the app's `Quote`/`NewsArticle`/`PricePoint` types (`src/types/index.ts`). `getDailyCandles` exists but is expected to fail/return null on free-tier keys — callers must treat it as best-effort, not a guaranteed data source.

**Portfolio state** (`src/store/portfolioStore.ts`) is a Zustand store with `persist` middleware, keyed as `vramtrade-portfolio` in localStorage. `buy`/`sell`/`reset` actions validate funds/shares/cooldown and return `{ ok, error? }` rather than throwing — callers (e.g. `TradePanel`, `SettingsPage`) surface `error` directly in the UI. Average cost basis is recalculated on each buy; holdings are deleted from the map (not zeroed) when fully sold. `reset` is gated by `lastResetAt` to once per 7 days (`msUntilResetAllowed()` tells the UI how long until it's allowed again) — this cooldown is enforced client-side only and can be bypassed by clearing localStorage.

The watchlist itself (as opposed to portfolio) is separate, plain `localStorage` state managed directly in `App.tsx` under the key `vramtrade-watchlist` — it is not part of the Zustand store.

**Auth** (`src/store/authStore.ts` + `src/api/auth.ts`) is a Zustand store persisted under `vramtrade-auth`, holding just `{ token, username }`. It calls the Django backend's `/api/auth/{register,login,logout,delete}/` endpoints (`backend/accounts/views.py`) using DRF token auth (`Authorization: Token <token>` header). Login/registration/account-deletion is the *only* thing that talks to the backend — trading, portfolio, and watchlist state never touch it, by design (see the "Portfolio storage" decision below).

**Theme** (`src/store/themeStore.ts`) is a Zustand store persisted under `vramtrade-theme` holding `theme: "system" | "light" | "dark"`. Setting it writes/deletes `document.documentElement.dataset.theme`; `src/index.css` already defines the light/dark CSS variables for both the explicit `[data-theme]` attribute and the `prefers-color-scheme` media query, so new UI should use the existing CSS custom properties (`--surface-1`, `--text-primary`, etc.) rather than hardcoded colors to stay theme-aware.

**Components are presentational**, receiving data/callbacks from `App.tsx` rather than fetching their own data (the fetching lives in the hooks above, except where noted). `SP500Browser` is a modal for adding symbols from the full S&P 500 list in `src/data/sp500.ts`. `SettingsPage` bundles account (login/register/delete), appearance (theme), and portfolio-reset sections. `NewsPage` wraps the existing `NewsFeed` with page chrome.

**The trading course** (`GuidesPage.tsx`) is a gated, lesson-by-lesson learning path styled after IBM's course-player UI (see the reference screenshot this was built from: a dark header/footer "player" chrome, a persistent left module rail with per-lesson checkmarks, an "X% COMPLETE" badge). It has five internal stages (`overview` | `reading` | `quiz` | `result` | `certificate`), all living behind the single "Trading Guides" sidebar entry (not separate `SidebarView`s):
- Content lives in `src/data/courseContent.ts` as `COURSE_CHAPTERS` (8 chapters × 4 topics, each topic tagged with a `minutes` estimate). `TOTAL_COURSE_MINUTES` is derived from that array, not hand-maintained — the "~4 hour course" figure is computed. Each chapter is one "section" in the gated path; `reading` shows its topics **one lesson per screen** (not the whole chapter stacked), with Previous/Next controls in the dark footer bar — the last lesson's "Next" becomes "Start section quiz →".
- **Immersive "course player" mode**: `reading`/`quiz`/`result` render `.course-player`, a `position: fixed; inset: 0` overlay that covers the entire app chrome (the outer `Sidebar`, the cash/equity header) — implemented as a plain CSS overlay from inside `GuidesPage`, not a portal or router, since nothing in the ancestor tree sets `transform`/`filter` to break `position: fixed`'s viewport-relative behavior. `overview` and `certificate` render as normal pages inside `.app` alongside the regular `Sidebar`, so entering/exiting a lesson is what toggles between the two chromes.
- `CourseSidebar.tsx` is the persistent left rail inside player mode: an "X% COMPLETE" badge + thin progress bar, then each chapter as a collapsible group (`expanded` state in `GuidesPage`, force-opened on the active chapter) listing its 4 topics plus a "Section quiz" row, each with a status icon (done / current / todo / locked). On mobile it's an off-canvas drawer (`.course-rail-wrap`, toggled by `railOpen` + the header's `☰` button) rather than a static column — the `min-width: 861px` query is what turns it into a static sidebar, per the mobile-first convention below.
- Progress tracking is per-**topic**, not just per-chapter: `ChapterProgress` (`src/components/CourseSidebar.tsx`) holds `{ passed, bestScore, bestTotal, viewedTopicIds }`, persisted to `vramtrade-course-progress` keyed by chapter `id` (topic `id`s inside `viewedTopicIds` — changing either resets that piece of progress for existing users). A topic is marked viewed the moment its lesson screen is opened (matching the reference UI, which checks off a lesson on visit, not on scrolling to its end) — see the `useEffect` keyed on `[stage, activeChapterIndex, activeTopicIndex]` in `GuidesPage.tsx`. The header's overall "X% COMPLETE" is computed from `viewedTopicIds.length` (capped at 4) + `passed` across all 8 chapters, out of 40 total units — it ticks up per lesson, not just per passed quiz.
- `ReadingProgressRing.tsx` is the small SVG donut on each lesson screen showing how far the *current page* has been scrolled (0–100%), computed from `scrollTop`/`scrollHeight` of the `.course-content` pane. It's measured via `requestAnimationFrame` after the topic/stage changes (not hardcoded to 0) so a lesson short enough to need no scrolling correctly reads 100% instead of a stale 0%.
- The question bank lives in `src/data/quizQuestions.ts` (`QUIZ_QUESTIONS`, 50 questions tagged with `chapterId`). `GuidesPage`'s `sectionQuestions(chapterId)` takes the first 5 questions tagged to that chapter for its quiz — the remaining 1–2 per chapter are unused headroom, not dead content to delete. `CertificationQuiz.tsx` is embeddable content only (no header/chrome of its own — the course-player shell supplies that), taking a `questions` prop and an `onFinish` callback; it requires every question answered before submission. `PASS_RATIO` (0.7) is exported from there — with 5 questions that means 4/5 is the minimum passing score, not 3/5.
- Section N+1 is locked until section N's quiz is passed (`isChapterUnlocked` in `GuidesPage.tsx`). Failing a section's quiz does not lose progress on earlier sections or on lessons already read in the current one; it only blocks the next section until retaken. Reading itself is not gated — all lessons in an unlocked chapter, and the chapter's own quiz, are freely navigable via the rail.
- Once every chapter is passed, a certificate record is minted exactly once (`vramtrade-course-certificate`, so its date reflects actual completion, not whenever the page is revisited) and `Certificate.tsx` renders with the aggregate score across all 8 section quizzes (out of 40) — using `useAuthStore`'s `username` when logged in or a free-text name field otherwise. The certificate has print-only CSS (`.no-print`, `@media print` in `index.css`) so "Print / save as PDF" produces just the certificate, not the app chrome — this is entirely client-side with no backend involvement or server-issued certificate.
- `src/data/resources.ts` (`EXTERNAL_RESOURCES`) holds a small, hand-curated set of outside links (SEC, FINRA, Investopedia, etc.) rendered on the course overview page, ungated — it's supplementary, not part of the pass/fail path.

**CSS is mobile-first** (`src/index.css`): unprefixed rules target small screens (single-column grids, the sidebar as a wrapping top bar), and `@media (min-width: …)` queries layer on wider-screen enhancements (the 300px sidebar becomes sticky, `.layout`/`.bottom-row`/`.detail-trade-row` switch from a single column to their multi-column grids). When adding responsive behavior, write the mobile rule as the plain selector and the desktop rule inside a `min-width` query — not the reverse — to stay consistent with the rest of the file. `HoldingsTable` and `TradeHistory` wrap their `<table>` in a `.table-scroll` div (`overflow-x: auto`) since their tables have a `min-width` floor and would otherwise force page-wide horizontal scroll on narrow screens.

**Backend** (`backend/`) is a minimal Django project: `vramtrade_api/` holds settings/urls, `accounts/` holds the auth views/serializers/urls. Uses Django's built-in `User` model (no custom user model or profile), DRF `TokenAuthentication`, and `django-cors-headers` restricted to the Vite dev origins. SQLite (`db.sqlite3`, gitignored) is the only datastore and holds nothing but users and tokens.
