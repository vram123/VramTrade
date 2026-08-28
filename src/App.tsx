import { useEffect, useMemo, useState } from "react";
import { hasApiKey } from "./api/finnhub";
import { useLiveQuote } from "./hooks/useLiveQuote";
import { useWatchlistQuotes } from "./hooks/useWatchlistQuotes";
import { useNewsFeed } from "./hooks/useNewsFeed";
import { usePortfolioStore, STARTING_CASH_VALUE } from "./store/portfolioStore";
import { SymbolSearch } from "./components/SymbolSearch";
import { SP500Browser } from "./components/SP500Browser";
import { Watchlist } from "./components/Watchlist";
import { StockDetail } from "./components/StockDetail";
import { TradePanel } from "./components/TradePanel";
import { HoldingsTable } from "./components/HoldingsTable";
import { TradeHistory } from "./components/TradeHistory";
import { SettingsPage } from "./components/SettingsPage";
import { Sidebar, type SidebarView } from "./components/Sidebar";
import { NewsPage } from "./components/NewsPage";
import { GuidesPage } from "./components/GuidesPage";

const DEFAULT_WATCHLIST = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"];
const WATCHLIST_KEY = "vramtrade-watchlist";

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function App() {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  });
  const [selected, setSelected] = useState<string>(watchlist[0] ?? "AAPL");
  const [browserOpen, setBrowserOpen] = useState(false);
  const [view, setView] = useState<SidebarView>("dashboard");

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const cash = usePortfolioStore((s) => s.cash);
  const holdings = usePortfolioStore((s) => s.holdings);
  const trades = usePortfolioStore((s) => s.trades);
  const holdingsList = useMemo(() => Object.values(holdings), [holdings]);

  const trackedSymbols = useMemo(() => {
    const set = new Set(watchlist);
    holdingsList.forEach((h) => set.add(h.symbol));
    return Array.from(set);
  }, [watchlist, holdingsList]);

  const quotes = useWatchlistQuotes(hasApiKey() ? trackedSymbols : []);
  const { quote: selectedQuote, history, error } = useLiveQuote(hasApiKey() ? selected : null);
  const { articles, loading: newsLoading, error: newsError } = useNewsFeed(
    hasApiKey() ? trackedSymbols : [],
  );

  const holdingsValue = holdingsList.reduce((sum, h) => {
    const price = quotes[h.symbol]?.current ?? h.avgCost;
    return sum + price * h.shares;
  }, 0);
  const equity = cash + holdingsValue;
  const totalPnl = equity - STARTING_CASH_VALUE;
  const totalPnlPct = (totalPnl / STARTING_CASH_VALUE) * 100;
  const equityUp = totalPnl >= 0;

  const addSymbol = (symbol: string) => {
    setWatchlist((prev) => (prev.includes(symbol) ? prev : [symbol, ...prev]));
    setSelected(symbol);
  };

  return (
    <div className="app-shell">
      <Sidebar active={view} onNavigate={setView} />

      <div className="app">
        <div className="header">
          <div className="brand">
            <h1>VramTrade</h1>
            <span className="tag">paper trading · live market data</span>
          </div>
          <div className="equity-summary">
            <div className="stat-tile">
              <div className="label">Cash</div>
              <div className="value">${fmt(cash)}</div>
            </div>
            <div className="stat-tile">
              <div className="label">Total equity</div>
              <div className="value">${fmt(equity)}</div>
            </div>
            <div className="stat-tile">
              <div className="label">Total P&amp;L</div>
              <div className={`value delta ${equityUp ? "up" : "down"}`}>
                {equityUp ? "+" : ""}
                ${fmt(totalPnl)} ({equityUp ? "+" : ""}
                {fmt(totalPnlPct)}%)
              </div>
            </div>
          </div>
        </div>

        {view === "settings" && <SettingsPage onBack={() => setView("dashboard")} />}

        {view === "news" && (
          <NewsPage
            articles={articles}
            loading={newsLoading}
            error={newsError}
            onBack={() => setView("dashboard")}
          />
        )}

        {view === "guides" && <GuidesPage onBack={() => setView("dashboard")} />}

        {view === "dashboard" && (
          <>
            {!hasApiKey() && (
              <div className="api-key-banner">
                <strong>No Finnhub API key configured.</strong> Live quotes won't load until you set
                one. Grab a free key at <code>finnhub.io</code>, then create a <code>.env</code> file
                in the project root with <code>VITE_FINNHUB_API_KEY=your_key_here</code> and restart
                the dev server.
              </div>
            )}

            <div className="layout">
              <div className="card">
                <h2>Watchlist</h2>
                <SymbolSearch onSelect={addSymbol} />
                <button className="browse-sp500-btn" onClick={() => setBrowserOpen(true)}>
                  Browse S&amp;P 500
                </button>
                <Watchlist
                  symbols={watchlist}
                  quotes={quotes}
                  selected={selected}
                  onSelect={setSelected}
                />
              </div>

              <div className="detail-trade-row">
                <StockDetail
                  symbol={selected}
                  quote={selectedQuote}
                  history={history}
                  error={error}
                />
                <div className="card">
                  <h2>Trade</h2>
                  <TradePanel symbol={selected} price={selectedQuote?.current ?? null} />
                </div>
              </div>
            </div>

            <div className="bottom-row">
              <div className="card">
                <h2>Holdings</h2>
                <HoldingsTable holdings={holdingsList} quotes={quotes} onSelect={setSelected} />
              </div>
              <div className="card">
                <h2>Trade history</h2>
                <TradeHistory trades={trades} />
              </div>
            </div>

            {browserOpen && (
              <SP500Browser
                watchlist={watchlist}
                onSelect={addSymbol}
                onClose={() => setBrowserOpen(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
