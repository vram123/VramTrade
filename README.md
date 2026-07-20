# VramTrade

A paper trading app. Every user starts with **$10,000** in virtual cash and
trades real stocks against **live market data** from Finnhub. Portfolio,
holdings, and trade history are saved to your browser's `localStorage` — no
backend, no database, no login.

## Quick start

1. Install dependencies
   ```bash
   npm install
   ```

2. Get a free Finnhub API key at [finnhub.io](https://finnhub.io/register)
   (instant signup, no credit card).

3. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   and set your key:
   ```
   VITE_FINNHUB_API_KEY=your_key_here
   ```

4. Run the dev server
   ```bash
   npm run dev
   ```

   Open the printed local URL (usually http://localhost:5173).

## How it works

- **Live quotes.** The selected stock's price is polled every 5 seconds via
  Finnhub's `/quote` endpoint, and each tick is plotted on the live chart.
  Watchlist rows poll every 10 seconds.
- **Search.** Look up any symbol or company name to add it to your watchlist.
- **Trading.** Buy or sell shares at the current live price. Trades are
  rejected if you don't have enough cash (buy) or shares (sell).
- **Portfolio.** Cash, holdings (with average cost and live P&L), and trade
  history persist in `localStorage` under the key `vramtrade-portfolio`.
  "Reset portfolio" wipes it back to $10,000 cash.
- Finnhub's free tier does not include historical OHLC candles for stocks, so
  the chart is built live from polled quote ticks rather than a canned
  history — it fills in as you watch.

## Notes

- This is not real trading. All funds and trades are virtual.
- Free-tier Finnhub allows ~60 API calls/minute — plenty for a watchlist of a
  handful of symbols at these poll intervals.
