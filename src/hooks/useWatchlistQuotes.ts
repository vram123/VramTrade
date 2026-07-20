import { useEffect, useState } from "react";
import { getQuote } from "../api/finnhub";
import type { Quote } from "../types";

const POLL_MS = 10000;

export function useWatchlistQuotes(symbols: string[]) {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});

  useEffect(() => {
    if (symbols.length === 0) return;
    let cancelled = false;

    const tick = async () => {
      const results = await Promise.allSettled(symbols.map((s) => getQuote(s)));
      if (cancelled) return;
      setQuotes((prev) => {
        const next = { ...prev };
        results.forEach((r, i) => {
          if (r.status === "fulfilled") next[symbols[i]] = r.value;
        });
        return next;
      });
    };

    tick();
    const id = window.setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.join(",")]);

  return quotes;
}
