import type { NewsArticle, PricePoint, Quote, SymbolResult } from "../types";

const BASE_URL = "https://finnhub.io/api/v1";
const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY as string | undefined;

export class MissingApiKeyError extends Error {
  constructor() {
    super("Missing VITE_FINNHUB_API_KEY. Add it to your .env file.");
    this.name = "MissingApiKeyError";
  }
}

function requireKey() {
  if (!API_KEY) throw new MissingApiKeyError();
  return API_KEY;
}

export function hasApiKey() {
  return Boolean(API_KEY);
}

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const token = requireKey();
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  url.searchParams.set("token", token);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Finnhub request failed (${res.status}): ${path}`);
  }
  return res.json() as Promise<T>;
}

interface RawQuote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export async function getQuote(symbol: string): Promise<Quote> {
  const raw = await get<RawQuote>("/quote", { symbol });
  if (raw.c === 0 && raw.pc === 0) {
    throw new Error(`No quote data for symbol "${symbol}"`);
  }
  return {
    symbol,
    current: raw.c,
    change: raw.d,
    percentChange: raw.dp,
    high: raw.h,
    low: raw.l,
    open: raw.o,
    prevClose: raw.pc,
    timestamp: raw.t * 1000,
  };
}

interface RawSearchResult {
  count: number;
  result: { symbol: string; description: string; type: string; displaySymbol: string }[];
}

export async function searchSymbols(query: string): Promise<SymbolResult[]> {
  if (!query.trim()) return [];
  const raw = await get<RawSearchResult>("/search", { q: query });
  return raw.result
    .filter((r) => !r.symbol.includes(".")) // primary listings only
    .slice(0, 12)
    .map((r) => ({ symbol: r.symbol, description: r.description, type: r.type }));
}

interface RawCandles {
  c: number[];
  t: number[];
  s: string;
}

/**
 * Historical daily candles are gated behind Finnhub's paid plans, so this
 * fails on a free-tier key. Callers should fall back to live-tick charting.
 */
export async function getDailyCandles(symbol: string, days = 30): Promise<PricePoint[] | null> {
  const to = Math.floor(Date.now() / 1000);
  const from = to - days * 24 * 60 * 60;
  try {
    const raw = await get<RawCandles>("/stock/candle", {
      symbol,
      resolution: "D",
      from: String(from),
      to: String(to),
    });
    if (raw.s !== "ok") return null;
    return raw.t.map((t, i) => ({ time: t * 1000, price: raw.c[i] }));
  } catch {
    return null;
  }
}

interface RawNewsItem {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  related?: string;
}

function mapNews(raw: RawNewsItem[], symbol?: string): NewsArticle[] {
  return raw
    .filter((n) => n.headline && n.url)
    .map((n) => ({
      id: `${symbol ?? "general"}-${n.id}`,
      headline: n.headline,
      summary: n.summary,
      source: n.source,
      url: n.url,
      image: n.image || null,
      datetime: n.datetime * 1000,
      symbol,
    }));
}

export async function getMarketNews(): Promise<NewsArticle[]> {
  const raw = await get<RawNewsItem[]>("/news", { category: "general" });
  return mapNews(raw);
}

export async function getCompanyNews(symbol: string, days = 14): Promise<NewsArticle[]> {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  try {
    const raw = await get<RawNewsItem[]>("/company-news", {
      symbol,
      from: fmt(from),
      to: fmt(to),
    });
    return mapNews(raw, symbol);
  } catch {
    return [];
  }
}
