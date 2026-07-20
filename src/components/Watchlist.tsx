import type { Quote } from "../types";

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function Watchlist({
  symbols,
  quotes,
  selected,
  onSelect,
}: {
  symbols: string[];
  quotes: Record<string, Quote>;
  selected: string | null;
  onSelect: (symbol: string) => void;
}) {
  return (
    <div>
      {symbols.map((symbol) => {
        const q = quotes[symbol];
        const up = (q?.change ?? 0) >= 0;
        return (
          <div
            key={symbol}
            className={`watchlist-row${symbol === selected ? " active" : ""}`}
            onClick={() => onSelect(symbol)}
          >
            <span className="symbol">{symbol}</span>
            <span className="price-col">
              {q ? (
                <>
                  <div className="price">{fmt(q.current)}</div>
                  <div className={`pct delta ${up ? "up" : "down"}`}>
                    {up ? "+" : ""}
                    {fmt(q.percentChange)}%
                  </div>
                </>
              ) : (
                <div className="price">…</div>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
