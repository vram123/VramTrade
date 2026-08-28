export type SidebarView = "dashboard" | "news" | "guides" | "settings";

const NAV_ITEMS: { id: SidebarView; label: string; hint: string }[] = [
  { id: "dashboard", label: "Dashboard", hint: "Watchlist, holdings & trading" },
  { id: "news", label: "Market News", hint: "What's moving right now" },
  { id: "guides", label: "Trading Guides", hint: "Learn the fundamentals" },
  { id: "settings", label: "Settings", hint: "Account, theme & reset" },
];

export function Sidebar({
  active,
  onNavigate,
}: {
  active: SidebarView;
  onNavigate: (view: SidebarView) => void;
}) {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-name">VramTrade</span>
        <span className="sidebar-brand-tag">paper trading</span>
      </div>
      <div className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-link ${active === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-link-label">{item.label}</span>
            <span className="sidebar-link-hint">{item.hint}</span>
          </button>
        ))}
      </div>
      <p className="sidebar-footnote">
        Real market prices, fake money — practice safely before risking real capital.
      </p>
    </nav>
  );
}
