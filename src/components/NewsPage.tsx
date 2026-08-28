import type { NewsArticle } from "../types";
import { NewsFeed } from "./NewsFeed";

export function NewsPage({
  articles,
  loading,
  error,
  onBack,
}: {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  onBack: () => void;
}) {
  return (
    <div className="settings-page">
      <div className="settings-page-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>Market news</h1>
      </div>
      <p className="settings-hint">
        Headlines from across the market plus your watchlist and holdings, merged into one feed and
        refreshed every couple of minutes. Read critically — a single headline is rarely the whole
        story.
      </p>
      <div className="card">
        <NewsFeed articles={articles} loading={loading} error={error} />
      </div>
    </div>
  );
}
