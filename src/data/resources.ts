export interface ExternalResource {
  title: string;
  publisher: string;
  url?: string;
  note: string;
}

export interface ResourceGroup {
  category: string;
  items: ExternalResource[];
}

export const EXTERNAL_RESOURCES: ResourceGroup[] = [
  {
    category: "Official & regulatory",
    items: [
      {
        title: "Investor.gov",
        publisher: "U.S. Securities and Exchange Commission",
        url: "https://www.investor.gov",
        note: "The SEC's own investor-education site — plain-language guides, calculators, and how to check if a broker or investment is actually registered.",
      },
      {
        title: "SEC EDGAR",
        publisher: "U.S. Securities and Exchange Commission",
        url: "https://www.sec.gov",
        note: "The primary source for real company filings (10-Ks, 10-Qs, 8-Ks) — the actual income statements, balance sheets, and cash flow statements behind Chapter 3 of this course.",
      },
      {
        title: "Investor education & alerts",
        publisher: "FINRA (Financial Industry Regulatory Authority)",
        url: "https://www.finra.org",
        note: "The self-regulatory body that oversees brokers, with investor alerts on common scams and a tool to check a broker's disciplinary history.",
      },
    ],
  },
  {
    category: "Free structured courses",
    items: [
      {
        title: "Economics & Finance courses",
        publisher: "Khan Academy",
        url: "https://www.khanacademy.org",
        note: "Free video courses on stocks, bonds, and macroeconomics that go deeper into the math behind valuation than this course does.",
      },
    ],
  },
  {
    category: "Reference & data",
    items: [
      {
        title: "Financial term dictionary",
        publisher: "Investopedia",
        url: "https://www.investopedia.com",
        note: "The standard quick-reference for looking up any term from this course in more depth, with worked examples.",
      },
      {
        title: "Economic data (FRED)",
        publisher: "Federal Reserve Bank of St. Louis",
        url: "https://fred.stlouisfed.org",
        note: "Free, official U.S. economic data series — GDP, inflation, unemployment — for anyone who wants to look at the raw numbers behind Chapter 8.",
      },
    ],
  },
  {
    category: "Books worth reading next",
    items: [
      {
        title: "A Random Walk Down Wall Street",
        publisher: "Burton G. Malkiel",
        note: "The classic case for market efficiency and low-cost index investing — a natural next read after Chapter 5's ETF section.",
      },
      {
        title: "The Intelligent Investor",
        publisher: "Benjamin Graham",
        note: "The foundational text on value investing and margin of safety; dense in places, but the source of ideas that still shape fundamental analysis today.",
      },
      {
        title: "Thinking, Fast and Slow",
        publisher: "Daniel Kahneman",
        note: "Not a finance book, but the research behind loss aversion and overconfidence covered in Chapter 7 — useful for understanding your own decisions, not just the market's.",
      },
    ],
  },
];
