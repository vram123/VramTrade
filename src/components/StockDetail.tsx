import { PriceChart } from "./PriceChart";
import type { PricePoint, Quote } from "../types";

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function StockDetail({
  symbol,
  quote,
  history,
  error,
}: {
  symbol: string;
  quote: Quote | null;
  history: PricePoint[];
  error: string | null;
}) {
  const up = (quote?.change ?? 0) >= 0;

  return (
    <div className="card">
      <div className="detail-header">
        <div className="detail-title">
          <h2>{symbol}</h2>
          <div className="desc">Live price, polled every 5s</div>
        </div>
        <div className="detail-price">
          {quote ? (
            <>
              <div className="price">${fmt(quote.current)}</div>
              <div className={`delta ${up ? "up" : "down"}`}>
                {up ? "+" : ""}
                {fmt(quote.change)} ({up ? "+" : ""}
                {fmt(quote.percentChange)}%)
              </div>
            </>
          ) : (
            <div className="price">…</div>
          )}
        </div>
      </div>

      {error && <div className="trade-error">{error}</div>}

      <PriceChart data={history} />

      {quote && (
        <div className="quote-stats">
          <div className="stat-tile">
            <div className="label">Open</div>
            <div className="value">${fmt(quote.open)}</div>
          </div>
          <div className="stat-tile">
            <div className="label">High</div>
            <div className="value">${fmt(quote.high)}</div>
          </div>
          <div className="stat-tile">
            <div className="label">Low</div>
            <div className="value">${fmt(quote.low)}</div>
          </div>
          <div className="stat-tile">
            <div className="label">Prev close</div>
            <div className="value">${fmt(quote.prevClose)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
