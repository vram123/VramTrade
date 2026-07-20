import { useEffect, useRef, useState } from "react";
import { getCompanyNews, getMarketNews } from "../api/finnhub";
import type { NewsArticle } from "../types";

const REFRESH_MS = 120_000;

function mergeSorted(existing: NewsArticle[], incoming: NewsArticle[]) {
  const byId = new Map(existing.map((a) => [a.id, a]));
  incoming.forEach((a) => byId.set(a.id, a));
  return Array.from(byId.values()).sort((a, b) => b.datetime - a.datetime);
}

export function useNewsFeed(symbols: string[]) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const symbolsRef = useRef(symbols);
  symbolsRef.current = symbols;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const symbolBatch = symbolsRef.current.slice(0, 8);
        const results = await Promise.allSettled([
          getMarketNews(),
          ...symbolBatch.map((s) => getCompanyNews(s)),
        ]);
        if (cancelled) return;

        const fresh = results
          .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === "fulfilled")
          .flatMap((r) => r.value);

        if (fresh.length === 0 && results.every((r) => r.status === "rejected")) {
          setError("Couldn't load news right now.");
        } else {
          setError(null);
          setArticles((prev) => mergeSorted(prev, fresh));
        }
      } catch {
        if (!cancelled) setError("Couldn't load news right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const id = window.setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
    // Re-run when the tracked symbol set changes; polling stays on one timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.join(",")]);

  return { articles, loading, error };
}
