export interface QuizQuestion {
  id: string;
  chapterId: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- 1. Foundations of the stock market ---
  {
    id: "q01",
    chapterId: "foundations",
    question: "What does owning a share of common stock actually represent?",
    choices: [
      "A loan to the company that must be repaid with fixed interest",
      "A legal claim on a slice of the company's assets and future earnings",
      "A guaranteed dividend payment every quarter",
      "A subscription to the company's products at a discount",
    ],
    correctIndex: 1,
    explanation:
      "A share is a part-ownership claim on the business, not a loan — its value depends on the company's performance, unlike a bond's fixed payment.",
  },
  {
    id: "q02",
    chapterId: "foundations",
    question: "If a company goes bankrupt and is liquidated, in what order are stakeholders typically paid?",
    choices: [
      "Common shareholders first, then creditors",
      "Everyone is paid equally and simultaneously",
      "Creditors and bondholders first, common shareholders last (often nothing)",
      "Preferred shareholders are paid before any creditors",
    ],
    correctIndex: 2,
    explanation:
      "Creditors and bondholders have priority claims; common shareholders are paid last and often receive nothing in a liquidation.",
  },
  {
    id: "q03",
    chapterId: "foundations",
    question: "What is the primary role of a market maker on an exchange?",
    choices: [
      "To set the official closing price for every stock",
      "To continuously quote buy and sell prices, providing liquidity",
      "To audit a company's financial statements before it can list",
      "To approve which retail investors are allowed to trade a stock",
    ],
    correctIndex: 1,
    explanation:
      "Market makers continuously offer both a buy and sell price, profiting from the spread, which lets other traders execute quickly.",
  },
  {
    id: "q04",
    chapterId: "foundations",
    question: "Which of these best describes the S&P 500?",
    choices: [
      "Exactly 500 technology companies weighted equally",
      "Roughly 500 large U.S. companies weighted by market value",
      "The 30 largest industrial companies in the U.S., weighted by price",
      "Every stock listed on the Nasdaq exchange",
    ],
    correctIndex: 1,
    explanation:
      "The S&P 500 tracks about 500 large-cap U.S. companies weighted by market capitalization, making it the most common market benchmark.",
  },
  {
    id: "q05",
    chapterId: "foundations",
    question: "Why can the Dow Jones Industrial Average move differently than the S&P 500 on the same day?",
    choices: [
      "The Dow only includes companies that pay dividends",
      "The Dow tracks only 30 companies and is price-weighted rather than value-weighted",
      "The Dow excludes all technology companies",
      "The Dow is updated only once per week",
    ],
    correctIndex: 1,
    explanation:
      "The Dow's small size (30 stocks) and outdated price-weighting method mean a single high-priced stock's move can sway it disproportionately compared to the S&P 500.",
  },
  {
    id: "q06",
    chapterId: "foundations",
    question: "A sharp, unexplained price move in a stock with no company-specific news is most often caused by:",
    choices: [
      "A change in the company's logo",
      "Institutional or algorithmic trading activity unrelated to a single headline",
      "The stock exchange manually adjusting the price",
      "A typo in the ticker symbol",
    ],
    correctIndex: 1,
    explanation:
      "Large institutional and algorithmic flows can move prices meaningfully without any single piece of retail-visible news.",
  },

  // --- 2. Order types & trade mechanics ---
  {
    id: "q07",
    chapterId: "order-mechanics",
    question: "What does a market order guarantee?",
    choices: [
      "A specific execution price",
      "That the trade will only fill during regular market hours",
      "Execution (a fill), but not a specific price",
      "That you will not pay any spread",
    ],
    correctIndex: 2,
    explanation:
      "A market order prioritizes speed of execution over price — you're guaranteed a fill (given liquidity) but not the exact price, especially in fast-moving or illiquid stocks.",
  },
  {
    id: "q08",
    chapterId: "order-mechanics",
    question: "A limit buy order for a stock at $40 will:",
    choices: [
      "Execute immediately regardless of the current price",
      "Only execute at $40 or lower",
      "Only execute at $40 or higher",
      "Never execute under any circumstances",
    ],
    correctIndex: 1,
    explanation:
      "A buy limit order sets a ceiling — it will only fill at your specified price or better (lower).",
  },
  {
    id: "q09",
    chapterId: "order-mechanics",
    question: "What is the main risk of a plain stop-loss order during a fast market crash?",
    choices: [
      "It cannot be cancelled once placed",
      "Once triggered, it becomes a market order and can fill well below the trigger price",
      "It automatically doubles your position size",
      "It is only valid on Mondays",
    ],
    correctIndex: 1,
    explanation:
      "A triggered stop order behaves like a market order, so in a fast decline it can execute significantly below the intended trigger price.",
  },
  {
    id: "q10",
    chapterId: "order-mechanics",
    question: "The bid-ask spread represents:",
    choices: [
      "A government-imposed trading tax",
      "The broker's monthly account fee",
      "The gap between the highest buy offer and lowest sell offer, an implicit trading cost",
      "The difference between a stock's high and low price for the year",
    ],
    correctIndex: 2,
    explanation:
      "The spread is the difference between the best bid and best ask; buying at the ask and selling at the bid loses that spread even with no price movement.",
  },
  {
    id: "q11",
    chapterId: "order-mechanics",
    question: "Why does liquidity matter when choosing a position size?",
    choices: [
      "Illiquid stocks pay higher dividends automatically",
      "In illiquid stocks, entering or exiting a large position can move the price significantly against you",
      "Liquidity determines how many votes your shares carry",
      "It doesn't matter once you've placed a limit order",
    ],
    correctIndex: 1,
    explanation:
      "Thinly traded stocks can have wide spreads and limited depth, so larger orders can move the price unfavorably, especially when exiting quickly.",
  },
  {
    id: "q12",
    chapterId: "order-mechanics",
    question: "Under the current U.S. settlement cycle, when does a stock trade officially settle?",
    choices: [
      "Instantly, the moment you click 'buy'",
      "One business day after the trade date (T+1)",
      "Exactly 30 calendar days later",
      "Only at the end of the calendar quarter",
    ],
    correctIndex: 1,
    explanation:
      "U.S. equity trades settle on a T+1 basis — the trade executes on day T, and ownership/cash officially transfer one business day later.",
  },

  // --- 3. Reading financial statements ---
  {
    id: "q13",
    chapterId: "fundamental-analysis",
    question: "On the income statement, what is 'net income' commonly referred to as?",
    choices: [
      "The top line",
      "The bottom line",
      "Free cash flow",
      "Book value",
    ],
    correctIndex: 1,
    explanation:
      "Net income is the final ('bottom line') figure after subtracting all costs, interest, and taxes from revenue.",
  },
  {
    id: "q14",
    chapterId: "fundamental-analysis",
    question: "Revenue growing while net income shrinks can be a warning sign because it may indicate:",
    choices: [
      "The company is paying off all its debt",
      "The company is buying market share via heavy discounting or spending, cutting into profit",
      "The stock has just split",
      "The company has stopped filing financial reports",
    ],
    correctIndex: 1,
    explanation:
      "Rising revenue with falling profit often means margins are being sacrificed for growth or market share, which isn't automatically bad but changes the investment thesis.",
  },
  {
    id: "q15",
    chapterId: "fundamental-analysis",
    question: "The balance sheet is built on which fundamental identity?",
    choices: [
      "Revenue = Expenses + Profit",
      "Assets = Liabilities + Shareholders' Equity",
      "Cash In = Cash Out",
      "Market Cap = Price ÷ Earnings",
    ],
    correctIndex: 1,
    explanation:
      "The balance sheet always balances: everything a company owns (assets) equals what it owes (liabilities) plus what belongs to shareholders (equity).",
  },
  {
    id: "q16",
    chapterId: "fundamental-analysis",
    question: "Why is the cash flow statement useful even when a company reports a net profit?",
    choices: [
      "It shows whether actual cash came in or out, stripping out non-cash accounting items",
      "It replaces the need for a balance sheet entirely",
      "It only matters for companies that pay no taxes",
      "It shows the company's stock price history",
    ],
    correctIndex: 0,
    explanation:
      "Net income can include non-cash items and accounting judgment calls; the cash flow statement shows the real cash movement behind the numbers.",
  },
  {
    id: "q17",
    chapterId: "fundamental-analysis",
    question: "Free cash flow is best described as:",
    choices: [
      "Total revenue minus taxes only",
      "Operating cash flow minus capital expenditures",
      "The company's total market capitalization",
      "Dividends paid divided by shares outstanding",
    ],
    correctIndex: 1,
    explanation:
      "Free cash flow is the cash left over after a company covers its operating costs and reinvestment in equipment/assets — a key measure of financial flexibility.",
  },
  {
    id: "q18",
    chapterId: "fundamental-analysis",
    question: "A very high dividend yield can sometimes actually signal:",
    choices: [
      "Guaranteed future profit growth",
      "That the market expects the dividend may be cut, since a falling price raises the yield",
      "That the company has no debt",
      "That the stock cannot be sold short",
    ],
    correctIndex: 1,
    explanation:
      "Since yield = dividend ÷ price, a falling stock price mechanically pushes yield higher even with an unchanged dividend — often a sign the market doubts the dividend is sustainable.",
  },
  {
    id: "q19",
    chapterId: "fundamental-analysis",
    question: "The P/E ratio roughly answers which question?",
    choices: [
      "How much debt does the company carry relative to its assets?",
      "How many years of current earnings would it take to 'pay back' the stock price?",
      "What percentage of shares are owned by insiders?",
      "How volatile is the stock compared to the market?",
    ],
    correctIndex: 1,
    explanation:
      "P/E (price divided by earnings per share) is a shorthand for how expensive a stock is relative to its current profit.",
  },

  // --- 4. Technical analysis basics ---
  {
    id: "q20",
    chapterId: "technical-analysis",
    question: "On a standard candlestick chart, a green (or hollow) candle indicates:",
    choices: [
      "The stock hit a new 52-week high",
      "The closing price was higher than the opening price for that period",
      "Trading volume was above average",
      "The company just reported earnings",
    ],
    correctIndex: 1,
    explanation:
      "A green/hollow candle means the period closed higher than it opened; red/filled means the opposite.",
  },
  {
    id: "q21",
    chapterId: "technical-analysis",
    question: "What do support and resistance levels represent?",
    choices: [
      "Prices set by government regulators",
      "Historical price levels where buying or selling pressure has previously reversed the trend",
      "The exact price a stock will always bounce off in the future",
      "The company's official valuation range",
    ],
    correctIndex: 1,
    explanation:
      "Support and resistance are historical patterns, not guarantees — they matter partly because many traders watch the same levels, but they do eventually break.",
  },
  {
    id: "q22",
    chapterId: "technical-analysis",
    question: "A 'golden cross' refers to:",
    choices: [
      "A short-term moving average crossing above a longer-term moving average",
      "A stock splitting 2-for-1",
      "The moment a stock's RSI hits exactly 50",
      "A company announcing a dividend increase",
    ],
    correctIndex: 0,
    explanation:
      "A golden cross (short MA crossing above long MA) is popularly read as bullish, though it's a lagging signal confirming a move already underway.",
  },
  {
    id: "q23",
    chapterId: "technical-analysis",
    question: "Why does volume matter when interpreting a price move?",
    choices: [
      "It doesn't — only price matters",
      "A move on high volume suggests broader conviction than the same move on thin volume",
      "High volume always means the stock will reverse the next day",
      "Volume determines the company's market capitalization",
    ],
    correctIndex: 1,
    explanation:
      "Volume reflects how much participation is behind a price move — higher volume generally implies more conviction and reliability behind the move.",
  },
  {
    id: "q24",
    chapterId: "technical-analysis",
    question: "An RSI reading above 70 is conventionally interpreted as:",
    choices: [
      "Oversold",
      "Overbought",
      "A guaranteed sell signal",
      "A sign the company is about to go bankrupt",
    ],
    correctIndex: 1,
    explanation:
      "RSI above 70 is conventionally labeled 'overbought,' though in a strong trend it can stay elevated for a long time without an immediate reversal.",
  },
  {
    id: "q25",
    chapterId: "technical-analysis",
    question: "What is a key limitation shared by all technical indicators derived from price and volume?",
    choices: [
      "They are illegal to use in the U.S.",
      "They only work on Fridays",
      "They don't contain fundamentally new information beyond what's already in the price and volume data",
      "They require a paid Finnhub subscription",
    ],
    correctIndex: 2,
    explanation:
      "All technical indicators are re-derivations of the same underlying price/volume data, presented differently — they don't introduce new information, just different lenses on it.",
  },

  // --- 5. Portfolio construction & diversification ---
  {
    id: "q26",
    chapterId: "portfolio-construction",
    question: "Why doesn't owning ten different technology stocks count as strong diversification?",
    choices: [
      "Technology stocks cannot be bought in a single account",
      "They are likely correlated, all exposed to the same sector-wide risks",
      "The SEC limits investors to five tech stocks",
      "Technology stocks never pay dividends",
    ],
    correctIndex: 1,
    explanation:
      "Real diversification requires low correlation between holdings — ten stocks in one sector tend to move together during sector-specific downturns.",
  },
  {
    id: "q27",
    chapterId: "portfolio-construction",
    question: "Asset allocation refers to:",
    choices: [
      "Choosing which individual stock to buy",
      "The split of a portfolio across broad categories like stocks, bonds, and cash",
      "The order in which trades are executed each day",
      "The tax bracket an investor falls into",
    ],
    correctIndex: 1,
    explanation:
      "Asset allocation is the high-level mix of asset classes in a portfolio, and research consistently shows it drives long-term risk/return more than individual stock selection.",
  },
  {
    id: "q28",
    chapterId: "portfolio-construction",
    question: "Rebalancing a portfolio means:",
    choices: [
      "Selling all holdings and starting over",
      "Trading back toward your target allocation after market moves shift it out of line",
      "Increasing leverage after a winning streak",
      "Switching your entire portfolio to cash once a year",
    ],
    correctIndex: 1,
    explanation:
      "Rebalancing restores your intended mix — for example, trimming stocks and adding bonds after a stock rally pushes your allocation off target.",
  },
  {
    id: "q29",
    chapterId: "portfolio-construction",
    question: "The main behavioral benefit of dollar-cost averaging is that it:",
    choices: [
      "Always outperforms investing a lump sum immediately",
      "Removes the psychologically difficult decision of timing a single large entry point",
      "Guarantees a profit within one year",
      "Eliminates all market risk",
    ],
    correctIndex: 1,
    explanation:
      "DCA doesn't reliably beat lump-sum investing in a rising market, but it lowers the emotional stakes of any single entry, making consistent investing easier to sustain.",
  },
  {
    id: "q30",
    chapterId: "portfolio-construction",
    question: "What is a key structural difference between an ETF and a traditional mutual fund?",
    choices: [
      "ETFs can only hold bonds",
      "ETFs trade throughout the day on an exchange; mutual funds are priced once per day after close",
      "Mutual funds have no fees at all",
      "ETFs are only available to institutional investors",
    ],
    correctIndex: 1,
    explanation:
      "ETFs trade like stocks with intraday pricing, while mutual funds are bought and sold at a single end-of-day price.",
  },
  {
    id: "q31",
    chapterId: "portfolio-construction",
    question: "What does the evidence on actively managed funds generally show?",
    choices: [
      "Most actively managed funds reliably beat their benchmark index after fees over long periods",
      "Most actively managed funds fail to beat a simple low-cost index fund after fees over long periods",
      "Actively managed funds are illegal in the U.S.",
      "Index funds always have higher fees than actively managed funds",
    ],
    correctIndex: 1,
    explanation:
      "Decades of data show most actively managed funds underperform their benchmark index after fees over long time horizons.",
  },

  // --- 6. Risk management ---
  {
    id: "q32",
    chapterId: "risk-management",
    question: "A common risk-management rule of thumb caps the risk on any single trade at roughly:",
    choices: [
      "50% of total capital",
      "1–2% of total capital",
      "100% of total capital",
      "There is no meaningful limit if you're confident",
    ],
    correctIndex: 1,
    explanation:
      "Risking only 1–2% per trade means even a long losing streak leaves most of the account intact, keeping you in a position to recover.",
  },
  {
    id: "q33",
    chapterId: "risk-management",
    question: "If a portfolio loses 50% of its value, what gain is required just to return to breakeven?",
    choices: [
      "50%",
      "75%",
      "100%",
      "25%",
    ],
    correctIndex: 2,
    explanation:
      "Losses and gains aren't symmetric — recovering from a 50% loss requires a 100% gain on the remaining capital.",
  },
  {
    id: "q34",
    chapterId: "risk-management",
    question: "A risk/reward ratio of 1:3 means:",
    choices: [
      "You must win 3 out of every 4 trades to profit",
      "You are risking $1 to potentially gain $3, so even a lower win rate can be profitable overall",
      "The stock is 3 times more volatile than the S&P 500",
      "You will always make exactly 3 times your investment",
    ],
    correctIndex: 1,
    explanation:
      "A favorable risk/reward ratio means you don't need to win most trades — at 1:3, a win rate of roughly 30–35% can still be profitable over time.",
  },
  {
    id: "q35",
    chapterId: "risk-management",
    question: "Why is moving a stop-loss further away after a trade starts losing usually a mistake?",
    choices: [
      "It's illegal to modify a stop-loss order",
      "It typically turns a small, planned loss into a larger, unplanned one",
      "Brokers charge a fee every time a stop is adjusted",
      "It automatically increases the position size",
    ],
    correctIndex: 1,
    explanation:
      "Stops should be decided before entering a trade; moving them further away under emotional pressure defeats their purpose and often magnifies losses.",
  },
  {
    id: "q36",
    chapterId: "risk-management",
    question: "A stock with a beta of 1.5 has historically:",
    choices: [
      "Moved in the opposite direction of the market",
      "Moved about 50% more than the market in each direction",
      "Never moved at all",
      "Paid a fixed 1.5% dividend yield",
    ],
    correctIndex: 1,
    explanation:
      "Beta measures relative volatility to the market (beta of 1.0) — a beta of 1.5 implies roughly 50% larger moves than the market, in both directions.",
  },
  {
    id: "q37",
    chapterId: "risk-management",
    question: "What is a margin call?",
    choices: [
      "A phone call from your broker congratulating you on a profit",
      "A broker's demand to add funds or force-sell holdings after equity falls below the required maintenance level",
      "A scheduled quarterly review of your account",
      "A type of dividend payment",
    ],
    correctIndex: 1,
    explanation:
      "A margin call happens when leveraged losses push account equity below the broker's maintenance requirement, often forcing sales at the worst possible time.",
  },
  {
    id: "q38",
    chapterId: "risk-management",
    question: "Buying stock with 2:1 leverage means a 25% decline in the stock's price results in approximately what loss to your actual capital?",
    choices: [
      "12.5%",
      "25%",
      "50%",
      "100%",
    ],
    correctIndex: 2,
    explanation:
      "Leverage amplifies both gains and losses proportionally — at 2:1 leverage, a 25% price move translates to roughly a 50% swing in your equity.",
  },

  // --- 7. Trading psychology & strategy styles ---
  {
    id: "q39",
    chapterId: "psychology-and-strategy",
    question: "What does research on retail day traders generally find?",
    choices: [
      "The large majority consistently profit and outperform the market",
      "The large majority lose money net of costs over time",
      "Day trading has zero transaction costs",
      "Day trading guarantees lower taxes than long-term investing",
    ],
    correctIndex: 1,
    explanation:
      "Rigorous studies of retail day traders consistently find most lose money net of costs — it's a demanding, competitive activity, not a reliable income source.",
  },
  {
    id: "q40",
    chapterId: "psychology-and-strategy",
    question: "Loss aversion typically causes traders to:",
    choices: [
      "Sell winning positions too early and hold losing positions too long",
      "Hold all positions forever regardless of performance",
      "Only trade stocks that pay dividends",
      "Avoid the stock market entirely",
    ],
    correctIndex: 0,
    explanation:
      "Because losses feel more painful than equivalent gains feel good, traders often lock in small wins quickly while holding losers, hoping to avoid realizing the loss.",
  },
  {
    id: "q41",
    chapterId: "psychology-and-strategy",
    question: "FOMO-driven buying typically happens:",
    choices: [
      "Before a stock has moved at all",
      "After a stock has already spiked, often near the end rather than the start of the move",
      "Only in bear markets",
      "Only among institutional investors",
    ],
    correctIndex: 1,
    explanation:
      "A large price jump is what attracts attention in the first place, meaning FOMO-driven buyers frequently arrive after much of the move has already happened.",
  },
  {
    id: "q42",
    chapterId: "psychology-and-strategy",
    question: "The main purpose of writing a trading plan before entering a position is to:",
    choices: [
      "Guarantee a profitable outcome",
      "Remove emotional, in-the-moment decision-making by committing to rules in advance",
      "Satisfy a legal requirement",
      "Avoid paying any taxes on gains",
    ],
    correctIndex: 1,
    explanation:
      "A plan turns stressful in-the-moment decisions into simply following rules you already agreed to before emotions were involved.",
  },
  {
    id: "q43",
    chapterId: "psychology-and-strategy",
    question: "Which trading style typically involves holding positions for days to weeks, without minute-by-minute monitoring?",
    choices: [
      "Day trading",
      "Swing trading",
      "High-frequency trading",
      "Market making",
    ],
    correctIndex: 1,
    explanation:
      "Swing trading targets a specific price move over days to weeks, sitting between the intensity of day trading and the patience of long-term investing.",
  },
  {
    id: "q44",
    chapterId: "psychology-and-strategy",
    question: "Overtrading tends to erode returns primarily through:",
    choices: [
      "Higher dividend taxes",
      "Transaction costs and lower-quality analysis behind a larger number of decisions",
      "Mandatory broker penalties for frequent trading",
      "Automatic position size increases",
    ],
    correctIndex: 1,
    explanation:
      "Taking far more trades than a strategy or research base can support adds cost and dilutes the quality of analysis behind each decision.",
  },

  // --- 8. Macro context & staying informed ---
  {
    id: "q45",
    chapterId: "macro-and-practice",
    question: "What does GDP measure?",
    choices: [
      "The total value of goods and services an economy produces",
      "The average price of a company's stock",
      "The number of companies listed on an exchange",
      "The unemployment rate",
    ],
    correctIndex: 0,
    explanation:
      "Gross Domestic Product (GDP) is the broadest measure of total economic output, and its growth rate signals overall economic health.",
  },
  {
    id: "q46",
    chapterId: "macro-and-practice",
    question: "When the Federal Reserve raises interest rates, it generally tends to:",
    choices: [
      "Make borrowing cheaper and boost growth-stock valuations",
      "Make borrowing more expensive, which can slow growth and pressure growth-stock valuations",
      "Have no effect on the stock market whatsoever",
      "Automatically increase every company's earnings",
    ],
    correctIndex: 1,
    explanation:
      "Higher rates raise borrowing costs and discount future profits more heavily, typically pressuring growth-stock valuations and cooling economic activity.",
  },
  {
    id: "q47",
    chapterId: "macro-and-practice",
    question: "Why can a stock fall even after reporting record quarterly profits?",
    choices: [
      "Record profits are always illegal to report",
      "If forward guidance disappoints, markets (which price in future expectations) can react negatively despite strong past results",
      "The stock exchange caps how high a stock can rise after earnings",
      "Record profits automatically trigger a mandatory sell-off",
    ],
    correctIndex: 1,
    explanation:
      "Markets price in expectations about the future — weak guidance for upcoming quarters can outweigh strong historical results already reported.",
  },
  {
    id: "q48",
    chapterId: "macro-and-practice",
    question: "A stock split (e.g., 2-for-1) does what to the underlying value of your holding?",
    choices: [
      "Doubles it instantly",
      "Cuts it in half",
      "Leaves it unchanged — you hold more shares at a proportionally lower price",
      "Converts it into cash automatically",
    ],
    correctIndex: 2,
    explanation:
      "A split proportionally increases share count and decreases price per share, leaving the total value of your position unchanged.",
  },
  {
    id: "q49",
    chapterId: "macro-and-practice",
    question: "What is a healthier habit when reading financial news headlines?",
    choices: [
      "Trust every headline immediately and trade on it within seconds",
      "Check the source and date, and see whether the article explains real cause and effect or just describes a price move after the fact",
      "Only read headlines, never the full article",
      "Assume every headline is intentionally false",
    ],
    correctIndex: 1,
    explanation:
      "Financial media has an incentive to make every move sound urgent — checking sourcing and looking for genuine explanation (versus after-the-fact description) helps filter noise from signal.",
  },
  {
    id: "q50",
    chapterId: "macro-and-practice",
    question: "What is the main purpose of paper trading with virtual money, as in this app?",
    choices: [
      "To guarantee future real-money profits",
      "To build the practical experience of buying, selling, and handling portfolio swings before risking real capital",
      "To avoid ever having to learn about risk management",
      "To replace the need for understanding financial statements",
    ],
    correctIndex: 1,
    explanation:
      "Paper trading lets you build real decision-making experience against live prices without financial risk — the entire point of practicing before committing real capital.",
  },
];
