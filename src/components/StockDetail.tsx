import { useState } from "react";
import { PriceChart } from "./PriceChart";
import type { PricePoint, Quote } from "../types";

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtScrubTime(t: number) {
  return new Date(t).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
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
  const [scrubbed, setScrubbed] = useState<PricePoint | null>(null);

  // While scrubbing the chart, show the price/change at that exact tick
  // (still relative to the real previous close) instead of the live quote.
  const displayPrice = scrubbed ? scrubbed.price : (quote?.current ?? null);
  const change = scrubbed && quote ? scrubbed.price - quote.prevClose : (quote?.change ?? 0);
  const percentChange =
    scrubbed && quote ? (change / quote.prevClose) * 100 : (quote?.percentChange ?? 0);
  const up = change >= 0;

  return (
    <div className="card">
      <div className="detail-header">
        <div className="detail-title">
          <h2>{symbol}</h2>
          <div className="desc">
            {scrubbed ? fmtScrubTime(scrubbed.time) : "Live price, polled every 5s"}
          </div>
        </div>
        <div className="detail-price">
          {displayPrice != null ? (
            <>
              <div className="price">${fmt(displayPrice)}</div>
              <div className={`delta ${up ? "up" : "down"}`}>
                {up ? "+" : ""}
                {fmt(change)} ({up ? "+" : ""}
                {fmt(percentChange)}%)
              </div>
            </>
          ) : (
            <div className="price">…</div>
          )}
        </div>
      </div>

      {error && <div className="trade-error">{error}</div>}

      <PriceChart data={history} quote={quote} onScrub={setScrubbed} />

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
