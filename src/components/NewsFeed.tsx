import { useEffect, useRef, useState } from "react";
import type { NewsArticle } from "../types";

const PAGE_SIZE = 12;

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export function NewsFeed({
  articles,
  loading,
  error,
}: {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const visible = articles.slice(0, visibleCount);
  const hasArticles = articles.length > 0;

  useEffect(() => {
    const root = scrollRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      { root, rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // The sentinel node only exists once articles arrive, so re-run when
    // that flips to attach the observer to the real element.
  }, [hasArticles]);

  return (
    <div className="news-feed" ref={scrollRef}>
      {!hasArticles && loading && <div className="empty-state">Loading news…</div>}
      {!hasArticles && !loading && error && <div className="trade-error">{error}</div>}
      {!hasArticles && !loading && !error && (
        <div className="empty-state">No news available right now.</div>
      )}

      {visible.map((a) => (
        <a key={a.id} className="news-row" href={a.url} target="_blank" rel="noopener noreferrer">
          {a.image ? (
            <img className="news-thumb" src={a.image} alt="" loading="lazy" />
          ) : (
            <div className="news-thumb news-thumb-empty" aria-hidden="true" />
          )}
          <div className="news-body">
            <div className="news-headline">{a.headline}</div>
            {a.summary && <div className="news-summary">{a.summary}</div>}
            <div className="news-meta">
              <span>{a.source}</span>
              <span>·</span>
              <span>{timeAgo(a.datetime)}</span>
              {a.symbol && (
                <>
                  <span>·</span>
                  <span className="news-symbol">{a.symbol}</span>
                </>
              )}
            </div>
          </div>
        </a>
      ))}

      {hasArticles && (
        <div ref={sentinelRef} className="news-sentinel">
          {visibleCount < articles.length ? "Loading more…" : "You're all caught up."}
        </div>
      )}
    </div>
  );
}
