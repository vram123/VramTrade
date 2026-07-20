export interface Quote {
  symbol: string;
  current: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  timestamp: number;
}

export interface SymbolResult {
  symbol: string;
  description: string;
  type: string;
}

export interface PricePoint {
  time: number;
  price: number;
}

export type TradeSide = "BUY" | "SELL";

export interface Trade {
  id: string;
  symbol: string;
  side: TradeSide;
  shares: number;
  price: number;
  timestamp: number;
}

export interface Holding {
  symbol: string;
  shares: number;
  avgCost: number;
}

export interface PortfolioState {
  cash: number;
  holdings: Record<string, Holding>;
  trades: Trade[];
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string | null;
  datetime: number;
  symbol?: string;
}
