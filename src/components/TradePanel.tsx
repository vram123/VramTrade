import { useState } from "react";
import { usePortfolioStore } from "../store/portfolioStore";

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function TradePanel({ symbol, price }: { symbol: string; price: number | null }) {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [shares, setShares] = useState("");
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const buy = usePortfolioStore((s) => s.buy);
  const sell = usePortfolioStore((s) => s.sell);
  const cash = usePortfolioStore((s) => s.cash);
  const holdingShares = usePortfolioStore((s) => s.holdings[symbol]?.shares ?? 0);

  const sharesNum = Number(shares);
  const estimate = price && sharesNum > 0 ? sharesNum * price : 0;

  const handleSubmit = () => {
    if (!price) return;
    const action = side === "BUY" ? buy : sell;
    const result = action(symbol, sharesNum, price);
    if (result.ok) {
      setMessage({
        kind: "success",
        text: `${side === "BUY" ? "Bought" : "Sold"} ${sharesNum} share${sharesNum === 1 ? "" : "s"} of ${symbol} at $${price.toFixed(2)}.`,
      });
      setShares("");
    } else {
      setMessage({ kind: "error", text: result.error ?? "Trade failed." });
    }
  };

  return (
    <div className="trade-panel">
      <div className="side-toggle">
        <button
          className={`buy${side === "BUY" ? " active" : ""}`}
          onClick={() => {
            setSide("BUY");
            setMessage(null);
          }}
        >
          Buy
        </button>
        <button
          className={`sell${side === "SELL" ? " active" : ""}`}
          onClick={() => {
            setSide("SELL");
            setMessage(null);
          }}
        >
          Sell
        </button>
      </div>

      <div className="field">
        <label>Shares</label>
        <input
          type="number"
          min="0"
          step="1"
          value={shares}
          placeholder="0"
          onChange={(e) => {
            setShares(e.target.value);
            setMessage(null);
          }}
        />
      </div>

      <div className="trade-estimate">
        <span>Est. {side === "BUY" ? "cost" : "proceeds"}</span>
        <span>${fmt(estimate)}</span>
      </div>
      <div className="trade-estimate">
        <span>Cash available</span>
        <span>${fmt(cash)}</span>
      </div>
      {side === "SELL" && (
        <div className="trade-estimate">
          <span>Shares owned</span>
          <span>{holdingShares}</span>
        </div>
      )}

      <button
        className={`submit-trade ${side === "BUY" ? "buy" : "sell"}`}
        disabled={!price || sharesNum <= 0}
        onClick={handleSubmit}
      >
        {side === "BUY" ? "Buy" : "Sell"} {symbol}
      </button>

      {message && (
        <div className={message.kind === "error" ? "trade-error" : "trade-success"}>
          {message.text}
        </div>
      )}
    </div>
  );
}
