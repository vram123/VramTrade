import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authApi from "../api/auth";

interface AuthState {
  token: string | null;
  username: string | null;
}

interface AuthActions {
  register: (username: string, password: string, email?: string) => Promise<{ ok: boolean; error?: string }>;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<{ ok: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      token: null,
      username: null,

      register: async (username, password, email) => {
        try {
          const { token, username: name } = await authApi.register(username, password, email);
          set({ token, username: name });
          return { ok: true };
        } catch (err) {
          return { ok: false, error: err instanceof Error ? err.message : "Registration failed." };
        }
      },

      login: async (username, password) => {
        try {
          const { token, username: name } = await authApi.login(username, password);
          set({ token, username: name });
          return { ok: true };
        } catch (err) {
          return { ok: false, error: err instanceof Error ? err.message : "Login failed." };
        }
      },

      logout: async () => {
        const { token } = get();
        if (token) {
          try {
            await authApi.logout(token);
          } catch {
            // token may already be invalid server-side; clear local state regardless
          }
        }
        set({ token: null, username: null });
      },

      deleteAccount: async () => {
        const { token } = get();
        if (!token) return { ok: false, error: "Not logged in." };
        try {
          await authApi.deleteAccount(token);
          set({ token: null, username: null });
          return { ok: true };
        } catch (err) {
          return { ok: false, error: err instanceof Error ? err.message : "Account deletion failed." };
        }
      },
    }),
    { name: "vramtrade-auth" },
  ),
);
