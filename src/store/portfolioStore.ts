import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Holding, PortfolioState, Trade } from "../types";

const STARTING_CASH = 10_000;
const RESET_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

interface PortfolioActions {
  buy: (symbol: string, shares: number, price: number) => { ok: boolean; error?: string };
  sell: (symbol: string, shares: number, price: number) => { ok: boolean; error?: string };
  reset: () => { ok: boolean; error?: string };
  msUntilResetAllowed: () => number;
}

const initialState: PortfolioState = {
  cash: STARTING_CASH,
  holdings: {},
  trades: [],
  lastResetAt: null,
};

export const usePortfolioStore = create<PortfolioState & PortfolioActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      buy: (symbol, shares, price) => {
        if (shares <= 0) return { ok: false, error: "Enter a positive number of shares." };
        const cost = shares * price;
        const { cash, holdings, trades } = get();
        if (cost > cash) return { ok: false, error: "Not enough cash for this trade." };

        const existing = holdings[symbol];
        const newShares = (existing?.shares ?? 0) + shares;
        const newAvgCost = existing
          ? (existing.avgCost * existing.shares + cost) / newShares
          : price;

        const trade: Trade = {
          id: crypto.randomUUID(),
          symbol,
          side: "BUY",
          shares,
          price,
          timestamp: Date.now(),
        };

        set({
          cash: cash - cost,
          holdings: {
            ...holdings,
            [symbol]: { symbol, shares: newShares, avgCost: newAvgCost },
          },
          trades: [trade, ...trades],
        });
        return { ok: true };
      },

      sell: (symbol, shares, price) => {
        if (shares <= 0) return { ok: false, error: "Enter a positive number of shares." };
        const { cash, holdings, trades } = get();
        const existing = holdings[symbol];
        if (!existing || existing.shares < shares) {
          return { ok: false, error: "Not enough shares to sell." };
        }

        const proceeds = shares * price;
        const remainingShares = existing.shares - shares;
        const remainingHoldings: Record<string, Holding> = { ...holdings };
        if (remainingShares === 0) {
          delete remainingHoldings[symbol];
        } else {
          remainingHoldings[symbol] = { ...existing, shares: remainingShares };
        }

        const trade: Trade = {
          id: crypto.randomUUID(),
          symbol,
          side: "SELL",
          shares,
          price,
          timestamp: Date.now(),
        };

        set({
          cash: cash + proceeds,
          holdings: remainingHoldings,
          trades: [trade, ...trades],
        });
        return { ok: true };
      },

      reset: () => {
        const { lastResetAt } = get();
        const elapsed = lastResetAt ? Date.now() - lastResetAt : Infinity;
        if (elapsed < RESET_COOLDOWN_MS) {
          const daysLeft = Math.ceil((RESET_COOLDOWN_MS - elapsed) / (24 * 60 * 60 * 1000));
          return {
            ok: false,
            error: `You can reset your portfolio again in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`,
          };
        }
        set({ ...initialState, lastResetAt: Date.now() });
        return { ok: true };
      },

      msUntilResetAllowed: () => {
        const { lastResetAt } = get();
        if (!lastResetAt) return 0;
        return Math.max(0, RESET_COOLDOWN_MS - (Date.now() - lastResetAt));
      },
    }),
    { name: "vramtrade-portfolio" },
  ),
);

export const STARTING_CASH_VALUE = STARTING_CASH;
