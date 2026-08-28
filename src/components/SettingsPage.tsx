import { useState, type FormEvent } from "react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore, type Theme } from "../store/themeStore";
import { usePortfolioStore } from "../store/portfolioStore";

const DAY_MS = 24 * 60 * 60 * 1000;

const THEME_LABELS: Record<Theme, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

export function SettingsPage({ onBack }: { onBack: () => void }) {
  const username = useAuthStore((s) => s.username);
  const token = useAuthStore((s) => s.token);
  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);

  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const reset = usePortfolioStore((s) => s.reset);
  const msUntilResetAllowed = usePortfolioStore((s) => s.msUntilResetAllowed());

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [resetMessage, setResetMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  const isLoggedIn = Boolean(token && username);
  const canReset = msUntilResetAllowed === 0;
  const daysUntilReset = Math.ceil(msUntilResetAllowed / DAY_MS);

  const switchAuthMode = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthError(null);
  };

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthBusy(true);
    const result =
      authMode === "login"
        ? await login(formUsername, formPassword)
        : await register(formUsername, formPassword, formEmail || undefined);
    setAuthBusy(false);
    if (result.ok) {
      setFormUsername("");
      setFormEmail("");
      setFormPassword("");
    } else {
      setAuthError(result.error ?? "Something went wrong.");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    const result = await deleteAccount();
    if (!result.ok) setDeleteError(result.error ?? "Couldn't delete account.");
  };

  const handleReset = () => {
    const result = reset();
    setResetMessage(
      result.ok
        ? { kind: "success", text: "Portfolio reset to $10,000 cash." }
        : { kind: "error", text: result.error ?? "Reset failed." },
    );
  };

  return (
    <div className="settings-page">
      <div className="settings-page-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>Settings</h1>
      </div>

      <div className="card">
        <h2>Account</h2>
        {isLoggedIn ? (
          <div className="account-info">
            <p className="settings-hint">
              Signed in as <strong>{username}</strong>
            </p>
            <div className="account-actions">
              <button className="cancel-btn" onClick={() => logout()}>
                Log out
              </button>
              {!confirmingDelete && (
                <button className="delete-account-btn" onClick={() => setConfirmingDelete(true)}>
                  Delete account
                </button>
              )}
            </div>

            {confirmingDelete && (
              <div className="delete-confirm">
                <p>This permanently deletes your account. This can't be undone.</p>
                <div className="account-actions">
                  <button className="delete-account-btn" onClick={handleDeleteAccount}>
                    Yes, delete my account
                  </button>
                  <button className="cancel-btn" onClick={() => setConfirmingDelete(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {deleteError && <div className="trade-error">{deleteError}</div>}
          </div>
        ) : (
          <>
            <div className="auth-tabs">
              <button
                className={authMode === "login" ? "active" : ""}
                onClick={() => switchAuthMode("login")}
              >
                Log in
              </button>
              <button
                className={authMode === "register" ? "active" : ""}
                onClick={() => switchAuthMode("register")}
              >
                Register
              </button>
            </div>
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              <div className="field">
                <label>Username</label>
                <input
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              {authMode === "register" && (
                <div className="field">
                  <label>Email (optional)</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              )}
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  autoComplete={authMode === "login" ? "current-password" : "new-password"}
                  required
                />
              </div>
              <button className="submit-trade buy" type="submit" disabled={authBusy}>
                {authBusy ? "Please wait…" : authMode === "login" ? "Log in" : "Create account"}
              </button>
              {authError && <div className="trade-error">{authError}</div>}
            </form>
          </>
        )}
      </div>

      <div className="card">
        <h2>Appearance</h2>
        <div className="theme-toggle">
          {(Object.keys(THEME_LABELS) as Theme[]).map((t) => (
            <button key={t} className={theme === t ? "active" : ""} onClick={() => setTheme(t)}>
              {THEME_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Portfolio</h2>
        <p className="settings-hint">
          Reset your cash, holdings, and trade history back to $10,000. Limited to once every 7
          days.
        </p>
        <button className="reset-btn" disabled={!canReset} onClick={handleReset}>
          {canReset ? "Reset portfolio" : `Available in ${daysUntilReset} day${daysUntilReset === 1 ? "" : "s"}`}
        </button>
        {resetMessage && (
          <div className={resetMessage.kind === "error" ? "trade-error" : "trade-success"}>
            {resetMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}
