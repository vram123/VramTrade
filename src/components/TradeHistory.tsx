import type { Trade } from "../types";

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function TradeHistory({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) {
    return <div className="empty-state">No trades yet.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Symbol</th>
          <th>Side</th>
          <th>Shares</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {trades.slice(0, 20).map((t) => (
          <tr key={t.id}>
            <td>{new Date(t.timestamp).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</td>
            <td>{t.symbol}</td>
            <td>
              <span className={`side-tag ${t.side}`}>{t.side}</span>
            </td>
            <td>{t.shares}</td>
            <td>${fmt(t.price)}</td>
            <td>${fmt(t.shares * t.price)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
