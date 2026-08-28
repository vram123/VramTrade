import { useEffect, useRef, useState } from "react";
import { getQuote } from "../api/finnhub";
import type { PricePoint, Quote } from "../types";

const POLL_MS = 5000;
const MAX_POINTS = 180;

export function useLiveQuote(symbol: string | null) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const symbolRef = useRef(symbol);
  symbolRef.current = symbol;

  useEffect(() => {
    if (!symbol) return;
    setQuote(null);
    setHistory([]);
    setError(null);

    let cancelled = false;

    const tick = async () => {
      try {
        const q = await getQuote(symbol);
        if (cancelled || symbolRef.current !== symbol) return;
        setQuote(q);
        setError(null);
        setHistory((prev) => {
          // Use local receive time, not Finnhub's trade timestamp (q.timestamp):
          // on the free tier it can repeat across polls (stale last-trade time),
          // which collapses the chart's x-axis domain to a single instant.
          const next = [...prev, { time: Date.now(), price: q.current }];
          return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
        });
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to fetch quote.");
      }
    };

    tick();
    const id = window.setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [symbol]);

  return { quote, history, error };
}
