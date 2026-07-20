import { useMemo, useState } from "react";
import { SP500_COMPANIES } from "../data/sp500";

export function SP500Browser({
  watchlist,
  onSelect,
  onClose,
}: {
  watchlist: string[];
  onSelect: (symbol: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SP500_COMPANIES;
    return SP500_COMPANIES.filter(
      (c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
  }, [query]);

  const watchlistSet = useMemo(() => new Set(watchlist), [watchlist]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal sp500-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Browse S&amp;P 500</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <input
          className="sp500-filter"
          placeholder="Filter by symbol or company…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="sp500-count">
          {filtered.length} of {SP500_COMPANIES.length} companies
        </div>
        <div className="sp500-list">
          {filtered.map((c) => {
            const added = watchlistSet.has(c.symbol);
            return (
              <div key={c.symbol} className="sp500-row">
                <span className="symbol">{c.symbol}</span>
                <span className="desc">{c.name}</span>
                <button
                  className="sp500-add-btn"
                  disabled={added}
                  onClick={() => onSelect(c.symbol)}
                >
                  {added ? "Added" : "Add"}
                </button>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="empty-state">No matches.</div>}
        </div>
      </div>
    </div>
  );
}
