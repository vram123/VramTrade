import type { Holding, Quote } from "../types";

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function HoldingsTable({
  holdings,
  quotes,
  onSelect,
}: {
  holdings: Holding[];
  quotes: Record<string, Quote>;
  onSelect: (symbol: string) => void;
}) {
  if (holdings.length === 0) {
    return <div className="empty-state">No positions yet — buy a stock to get started.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Shares</th>
          <th>Avg cost</th>
          <th>Price</th>
          <th>Value</th>
          <th>P&amp;L</th>
        </tr>
      </thead>
      <tbody>
        {holdings.map((h) => {
          const price = quotes[h.symbol]?.current;
          const value = price != null ? price * h.shares : null;
          const cost = h.avgCost * h.shares;
          const pnl = value != null ? value - cost : null;
          const pnlPct = pnl != null && cost > 0 ? (pnl / cost) * 100 : null;
          const up = (pnl ?? 0) >= 0;
          return (
            <tr key={h.symbol} onClick={() => onSelect(h.symbol)} style={{ cursor: "pointer" }}>
              <td>{h.symbol}</td>
              <td>{h.shares}</td>
              <td>${fmt(h.avgCost)}</td>
              <td>{price != null ? `$${fmt(price)}` : "…"}</td>
              <td>{value != null ? `$${fmt(value)}` : "…"}</td>
              <td className={pnl != null ? `delta ${up ? "up" : "down"}` : undefined}>
                {pnl != null ? `${up ? "+" : ""}$${fmt(pnl)} (${up ? "+" : ""}${fmt(pnlPct ?? 0)}%)` : "…"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
