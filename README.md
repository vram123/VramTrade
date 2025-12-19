# VramTrade (Paper Trading Simulator)

A **paper trading** app: users sign up / log in, start with **$100,000 virtual cash**, and can simulate buying/selling stocks and crypto using **mock market prices** (easy to swap for real APIs later).

## Quick start

1) Install deps
```bash
npm install
```

2) Create `.env` from example
```bash
cp .env.example .env
# then set JWT_SECRET to a long random string
```

3) Setup database
```bash
npm run prisma:generate
npm run prisma:migrate
```

4) Run
```bash
npm run dev
```

Open http://localhost:3000

## Notes
- **This is not real trading**. All funds are virtual.
- Next.js requires route files named `page.tsx` and API handlers named `route.ts`.
  The *actual UI content* lives in descriptive components under `src/ui-pages/`.
# VramTrade
