export interface CourseTopic {
  id: string;
  title: string;
  minutes: number;
  body: string[];
}

export interface CourseChapter {
  id: string;
  title: string;
  intro: string;
  topics: CourseTopic[];
}

export const COURSE_CHAPTERS: CourseChapter[] = [
  {
    id: "foundations",
    title: "1. Foundations of the stock market",
    intro:
      "Before any of the mechanics make sense, you need the vocabulary and the mental model underneath it: what a share actually is, where trades happen, and who you're trading against.",
    topics: [
      {
        id: "what-is-a-stock",
        title: "What is a stock, really?",
        minutes: 7,
        body: [
          "A share of stock is a legal claim on a slice of a company — its assets, its future earnings, and (usually) a vote on major decisions. When a company \"goes public,\" it sells shares to raise cash, and in exchange, shareholders become part-owners instead of lenders. That distinction matters: a bondholder is owed a fixed payment no matter how the company performs, but a shareholder's return depends entirely on how well the business does. Own stock in a company that doubles its profits, and your shares are usually worth more. Own stock in one that goes bankrupt, and shareholders are paid last, after every creditor — often getting nothing.",
          "This is why stock prices move constantly: the market is repricing that claim every time new information arrives, whether it's an earnings report, a product launch, a lawsuit, or a shift in interest rates that changes how investors value future profits. No central authority sets the \"correct\" price — it's simply whatever a willing buyer and a willing seller agree to trade at, right now.",
          "Two share classes are worth knowing early: common stock (the standard kind, with voting rights and variable dividends) and preferred stock (fixed dividends and priority over common holders if the company is liquidated, but usually no vote). Almost everything in this course, and everything in this app, refers to common stock.",
        ],
      },
      {
        id: "exchanges-and-market-makers",
        title: "How exchanges and market makers work",
        minutes: 8,
        body: [
          "A stock exchange is a regulated marketplace — the New York Stock Exchange (NYSE) and the Nasdaq are the two largest in the U.S. — where buyers and sellers are matched electronically. When you place an order through a broker, it's routed to an exchange (or an alternative venue) where a matching engine pairs it against opposite orders. The NYSE still uses human \"designated market makers\" alongside its electronics; the Nasdaq is fully electronic and was built from the start as a dealer market.",
          "Market makers are firms (increasingly, high-frequency trading firms) that continuously quote both a price they'll buy at and a price they'll sell at, profiting from the small gap between the two. Their role is to provide liquidity — someone willing to take the other side of your trade at almost any moment — which is why you can usually buy or sell a large-cap stock instantly, even if no other individual investor happens to want the opposite trade at that exact second.",
          "Exchanges also enforce listing requirements (minimum market value, financial reporting, governance standards) and can halt trading in a stock if there's a pending news event or extreme volatility, to give the market time to absorb information before trading resumes.",
        ],
      },
      {
        id: "reading-a-quote-and-indices",
        title: "Reading a quote & the major indices",
        minutes: 7,
        body: [
          "A quote is a snapshot, not a story: the current price, the day's dollar and percentage change, the day's high and low, and the previous close it's measured against. On its own, a quote tells you where a stock is — not why it got there. That context comes from news, earnings, or the broader market's mood, which is why this app pairs every quote with a live news feed.",
          "Indices are baskets of stocks used to track \"the market\" as a whole, or a slice of it. The S&P 500 tracks roughly 500 of the largest U.S. companies weighted by market value, and is the most common benchmark for \"how did the market do today.\" The Dow Jones Industrial Average tracks just 30 companies and is price-weighted (an outdated but historically sticky method), so it can move differently than the S&P 500 on the same day. The Nasdaq Composite tracks every stock listed on the Nasdaq exchange and skews heavily toward technology companies, which is why it's often more volatile than the other two.",
          "When a financial headline says \"the market fell today,\" it almost always means one of these three indices — check which one, because they don't always move together.",
        ],
      },
      {
        id: "market-participants",
        title: "Who you're actually trading against",
        minutes: 8,
        body: [
          "Retail investors — individuals trading through a brokerage app — are one part of the market, but they're a minority of daily trading volume. Institutional investors (mutual funds, pension funds, hedge funds, insurance companies) manage far larger pools of money and often move markets more than any single headline. When a stock jumps or drops sharply with no obvious news, it's frequently institutional buying or selling, sometimes automated and triggered by algorithms reacting to price levels rather than a human decision.",
          "It helps to internalize that on the other side of nearly every trade you make is someone (or something) with a different information set, time horizon, or goal than you. The person selling you a stock isn't necessarily wrong and you aren't necessarily right — they might be rebalancing a fund, harvesting a tax loss, or exiting a position for reasons that have nothing to do with the company's prospects.",
          "This is also why \"the market is rigged\" and \"anyone can beat the market easily\" are both oversimplifications. Prices reflect the collective judgment of enormously well-resourced participants, which is part of why consistently outperforming the broad market over long periods is genuinely difficult — a fact borne out by decades of data showing most professional fund managers fail to beat a simple index fund after fees.",
        ],
      },
    ],
  },
  {
    id: "order-mechanics",
    title: "2. Order types & trade mechanics",
    intro:
      "Knowing what a stock is doesn't help if you don't know how to actually get in and out of a position on your own terms. This chapter covers the order types that control price, timing, and risk.",
    topics: [
      {
        id: "market-vs-limit-orders",
        title: "Market orders vs. limit orders",
        minutes: 7,
        body: [
          "A market order says \"execute immediately, at whatever the best available price is.\" It guarantees you a fill (assuming there's any liquidity at all) but not a price — in a fast-moving or thinly traded stock, the price you actually get can differ meaningfully from the last quoted price you saw. This gap is called slippage.",
          "A limit order says \"execute only at this price or better.\" A buy limit only fills at your price or lower; a sell limit only fills at your price or higher. This guarantees your price but not your fill — if the stock never reaches your limit, the order simply expires unfilled (depending on its time-in-force setting). Limit orders are the standard choice for anything except the most liquid, large-cap stocks, precisely because they protect you from slippage.",
          "This app fills every trade instantly at the live quoted price, which is effectively always a market order — there's no limit-order book to model here, but understanding the distinction matters the moment you trade with a real broker.",
        ],
      },
      {
        id: "stop-orders",
        title: "Stop-loss and stop-limit orders",
        minutes: 8,
        body: [
          "A stop order (stop-loss) sits dormant until the stock trades at or through a trigger price, at which point it becomes a market order. Traders use these to cap downside automatically — for example, buying a stock at $50 and placing a stop at $45 to limit the loss to 10% without having to watch the screen constantly.",
          "The catch: once triggered, a plain stop order behaves exactly like a market order, so in a fast crash it can fill well below your trigger price. A stop-limit order fixes the price problem by converting into a limit order instead of a market order once triggered — but that reintroduces the risk that it doesn't fill at all if the price gaps straight through your limit.",
          "Neither is free insurance. Stops can also be triggered by brief, meaningless price spikes (\"stop hunts\") in illiquid stocks, taking you out of a position moments before it recovers. Where you place a stop is a real decision — too tight, and normal volatility knocks you out; too loose, and it doesn't protect you at all.",
        ],
      },
      {
        id: "bid-ask-and-liquidity",
        title: "The bid-ask spread & liquidity",
        minutes: 7,
        body: [
          "At any moment, a stock has a bid (the highest price a buyer is currently offering) and an ask (the lowest price a seller will accept). The gap between them is the spread, and it's effectively a transaction cost — if you buy at the ask and immediately sell at the bid, you lose the spread even with no price movement at all.",
          "Liquidity describes how easily a stock can be bought or sold without moving its price. Large, popular stocks (Apple, Microsoft) typically have penny-wide spreads and can absorb large orders with barely a ripple. Small, thinly traded stocks can have spreads of several percent, and a single sizable order can move the price significantly against the trader placing it.",
          "This matters for position sizing, too: it's easy to buy into an illiquid stock and then find that selling — especially in a hurry — costs far more in spread and price impact than you expected. Checking a stock's average daily trading volume before entering a position is a habit worth building early.",
        ],
      },
      {
        id: "settlement-and-brokers",
        title: "How trades actually settle",
        minutes: 8,
        body: [
          "Clicking \"buy\" doesn't instantly and finally transfer ownership. In the U.S., stock trades settle on a T+1 basis (as of 2024, shortened from the previous T+2) — the trade executes on day T, but ownership and cash officially change hands one business day later. Your broker fronts the coordination so it feels instant, but the plumbing underneath involves clearinghouses that guarantee both sides of every trade.",
          "Your broker is a legally regulated intermediary, not the counterparty to your trade in the way it might feel — under SEC and FINRA rules, your cash and securities must be kept segregated from the broker's own operating funds, which is part of why a broker's bankruptcy doesn't (in principle) wipe out your holdings.",
          "\"Payment for order flow\" is worth knowing about: many commission-free brokers route your order to a market maker who pays the broker for the right to fill it, rather than sending it straight to an exchange. This is legal and regulated, and market makers are required to give you a price at least as good as the public best bid/ask — but it's part of how \"free\" trading is actually monetized, and it's why price improvement and execution quality vary between brokers.",
        ],
      },
    ],
  },
  {
    id: "fundamental-analysis",
    title: "3. Reading financial statements",
    intro:
      "Fundamental analysis is the practice of valuing a company based on its actual business — revenue, profit, debt, and cash — rather than its chart. You don't need to be an accountant, but a few core statements and ratios go a long way.",
    topics: [
      {
        id: "income-statement",
        title: "The income statement",
        minutes: 8,
        body: [
          "The income statement (or profit & loss statement) shows a company's revenue, expenses, and profit over a period — typically a quarter or a year. Revenue (or \"top line\") is total sales before any costs are subtracted. Working down the statement, you subtract cost of goods sold to get gross profit, then operating expenses (R&D, marketing, salaries) to get operating income, then interest and taxes to arrive at net income — the famous \"bottom line.\"",
          "Growth in revenue without growth in profit is a common red flag: it can mean a company is buying market share by cutting prices or spending heavily on marketing, which isn't necessarily bad, but it changes what you're betting on. Conversely, profit growing faster than revenue often signals improving efficiency or pricing power.",
          "One useful habit: don't just look at a single quarter's net income in isolation. Compare it to the same quarter a year earlier (to account for seasonality) and to analyst expectations, since a stock's reaction to earnings is driven far more by \"beat or miss versus expectations\" than by the absolute numbers.",
        ],
      },
      {
        id: "balance-sheet",
        title: "The balance sheet",
        minutes: 7,
        body: [
          "The balance sheet is a snapshot at a single point in time, built on one identity that always balances: Assets = Liabilities + Shareholders' Equity. Assets are everything the company owns or is owed (cash, inventory, buildings, patents). Liabilities are everything it owes (debt, accounts payable). Equity is what's left over for shareholders if every liability were paid off today.",
          "A few things worth checking: cash and cash equivalents (can the company survive a rough patch?), total debt relative to equity (a highly leveraged company is riskier in a downturn), and whether current assets comfortably exceed current liabilities (a rough test of short-term solvency called the current ratio).",
          "The balance sheet is where you catch problems the income statement can hide — a company can report a profit while its debt load quietly grows to dangerous levels, or while it's burning through cash reserves it will eventually need to refill by issuing more debt or more shares (diluting existing holders).",
        ],
      },
      {
        id: "cash-flow-statement",
        title: "The cash flow statement",
        minutes: 7,
        body: [
          "Net income on the income statement includes non-cash items (like depreciation) and can be affected by accounting choices. The cash flow statement strips that away and answers a blunter question: did actual cash come in or go out, and from where? It's split into three sections: operating activities (cash from the core business), investing activities (buying/selling long-term assets, acquisitions), and financing activities (debt, dividends, stock buybacks or issuance).",
          "Free cash flow — operating cash flow minus capital expenditures — is one of the most-watched numbers in serious fundamental analysis, because it represents cash the company can actually return to shareholders or reinvest, after keeping the lights on and maintaining its equipment.",
          "A profitable company on paper with consistently negative operating cash flow is worth a second look: it can mean revenue is being recognized before cash is actually collected, which is sustainable for a while but not indefinitely.",
        ],
      },
      {
        id: "key-ratios",
        title: "Key ratios: P/E, EPS, P/B, and dividend yield",
        minutes: 8,
        body: [
          "Earnings per share (EPS) is net income divided by the number of outstanding shares — it turns a company-wide profit number into a per-share figure you can compare to the stock price. The price-to-earnings ratio (P/E) — price divided by EPS — is the most common valuation shorthand, roughly answering \"how many years of current earnings would it take to 'pay back' this stock price?\" A high P/E can mean a stock is expensive, or it can mean the market expects fast future growth; a low P/E can mean a bargain, or it can mean the market expects trouble ahead. P/E means little without comparing it to the company's own history and to similar companies in its industry.",
          "Price-to-book (P/B) compares the stock price to the company's book value (assets minus liabilities) per share — more relevant for asset-heavy businesses like banks than for asset-light software companies.",
          "Dividend yield is the annual dividend per share divided by the stock price, expressed as a percentage. A very high yield can be a genuine income opportunity, or it can be a warning sign that the market expects the dividend to be cut (since yield rises automatically when a falling stock price is divided into a still-unchanged dividend). None of these ratios work as a standalone \"buy\" or \"sell\" signal — they're inputs to a judgment call, not a verdict.",
        ],
      },
    ],
  },
  {
    id: "technical-analysis",
    title: "4. Technical analysis basics",
    intro:
      "Where fundamental analysis asks \"what is this business worth,\" technical analysis asks \"what is the price action telling us about supply, demand, and sentiment.\" Skeptics and believers both have a point — treat this as one more lens, not gospel.",
    topics: [
      {
        id: "candlesticks",
        title: "Candlestick charts & price action",
        minutes: 7,
        body: [
          "A candlestick summarizes a period of trading (a day, an hour, a minute — whatever the chart's timeframe is) in one shape: a body showing the range between the open and close, and thin \"wicks\" showing the full high-low range. A green (or hollow) candle means the close was higher than the open; a red (or filled) candle means the opposite. Reading a sequence of candles gives a feel for momentum and indecision that a single closing-price line chart can't show — for instance, a long wick with a small body can indicate a sharp intraday reversal that a daily close alone would hide.",
          "Individual candlestick patterns (\"hammer,\" \"doji,\" \"engulfing\") get a lot of attention in beginner content, but their predictive power is weak in isolation and much of the research on them is inconclusive at best. They're more useful as one small piece of context — read alongside the broader trend and volume — than as standalone signals.",
          "This app's live chart is built from polled price ticks rather than canned historical candles (a limitation of the free market-data tier it uses), so you'll see it accumulate in real time rather than showing a pre-built candlestick history.",
        ],
      },
      {
        id: "trends-support-resistance",
        title: "Trends, support, and resistance",
        minutes: 8,
        body: [
          "A trend is simply the general direction price has been moving — up, down, or sideways — over some timeframe you choose. \"The trend is your friend\" is a cliché precisely because it's easy to say and hard to follow: trends feel scariest to join right when they're about to reverse, and safest to fight right before they resume.",
          "Support is a price level where a stock has historically stopped falling and bounced, presumably because enough buyers stepped in there. Resistance is the mirror image — a level where selling has repeatedly capped a rally. Neither is a law of physics; they're just historical patterns of where buying or selling pressure previously showed up, and both eventually break when there's a good enough reason (major news, a shift in trend, enough forced buying or selling).",
          "A useful mental model: support and resistance matter because many traders are watching the same obvious levels and placing orders around them, which becomes a bit self-fulfilling — not because the level has some inherent power of its own.",
        ],
      },
      {
        id: "moving-averages",
        title: "Moving averages",
        minutes: 7,
        body: [
          "A moving average smooths out day-to-day noise by plotting the average closing price over a rolling window — commonly 20, 50, or 200 days. A simple moving average (SMA) weights every day in the window equally; an exponential moving average (EMA) weights recent days more heavily, so it reacts faster to new price action.",
          "Two common uses: gauging trend direction (price consistently above a rising 200-day average is often read as a long-term uptrend) and spotting \"crossovers,\" where a shorter average crosses above or below a longer one — a \"golden cross\" (short above long) is popularly read as bullish, and a \"death cross\" is read as bearish, though both are lagging indicators that confirm a move well after it has already started, not a reliable way to catch the start of one.",
          "Moving averages are backward-looking by construction — they describe where price has been, smoothed out, not where it's going. Treat crossovers and trend reads as context, not predictions.",
        ],
      },
      {
        id: "volume-and-momentum",
        title: "Volume and momentum indicators",
        minutes: 8,
        body: [
          "Volume — the number of shares traded in a period — is the most underrated chart element for beginners. A price move on unusually high volume suggests broad conviction behind it; the same move on thin volume is easier to dismiss or reverse. Volume spikes often accompany news, earnings, or the moment a widely watched support/resistance level breaks.",
          "The Relative Strength Index (RSI) is a common momentum indicator, scaled 0–100, meant to flag when a stock has moved unusually far, unusually fast. Readings above 70 are conventionally called \"overbought\" and below 30 \"oversold\" — but in a strong trend, RSI can stay in \"overbought\" territory for a long stretch while price keeps climbing, so treating it as an automatic reversal signal is a common and costly beginner mistake.",
          "The broader lesson with any technical indicator: they're all derived from price and volume, meaning none of them contain fundamentally new information — they just re-present the same data in a way that's sometimes easier for a human to read patterns into. That's a legitimate use, but it's worth staying skeptical of anything that claims a mechanical indicator is a reliable, standalone predictor.",
        ],
      },
    ],
  },
  {
    id: "portfolio-construction",
    title: "5. Portfolio construction & diversification",
    intro:
      "Picking good individual stocks matters less than most beginners think; how you combine them into a portfolio often matters more. This chapter is about the structure around your positions, not the positions themselves.",
    topics: [
      {
        id: "diversification-deep",
        title: "Diversification, properly understood",
        minutes: 7,
        body: [
          "Diversification means spreading exposure across enough uncorrelated positions that no single bad outcome can sink your entire portfolio. The key word is uncorrelated — owning ten different tech stocks isn't real diversification if they all move together during a tech-sector downturn, because they're all exposed to the same underlying risk factor.",
          "True diversification usually spans asset classes (stocks, bonds, cash, sometimes real estate or commodities), sectors (technology, healthcare, energy, financials), and geographies (domestic vs. international). Each of these tends to respond differently to the same economic event — rising interest rates, for instance, typically hurt long-duration bonds and highly-valued growth stocks more than they hurt short-term cash or value stocks.",
          "Diversification doesn't eliminate risk or guarantee a smoother ride every single year — it manages a specific kind of risk (concentration risk) at the cost of capping how much any one great pick can help you. That trade-off is the point, not a flaw.",
        ],
      },
      {
        id: "asset-allocation-rebalancing",
        title: "Asset allocation & rebalancing",
        minutes: 8,
        body: [
          "Asset allocation is the decision of how to split a portfolio across broad categories — for example, 70% stocks and 30% bonds. It's consistently shown to be the single biggest driver of a portfolio's long-term risk and return, more than which individual stocks you pick within each category. A common (if oversimplified) heuristic ties stock allocation to age or time horizon: the longer you have before you'll need the money, the more risk (and stock exposure) you can typically afford to carry.",
          "Rebalancing means periodically trading back to your target allocation as market moves push it out of line — for example, selling some stock and buying bonds after a strong stock rally pushed your 70/30 split to 80/20. This forces a disciplined form of \"buy low, sell high\" and controls risk, though it does have tax and transaction-cost consequences worth weighing (which is one reason many investors rebalance no more than once or twice a year).",
          "There's no universally \"correct\" allocation — it depends on your time horizon, how much volatility you can tolerate without making panicked decisions, and what the money is actually for.",
        ],
      },
      {
        id: "dollar-cost-averaging",
        title: "Dollar-cost averaging",
        minutes: 7,
        body: [
          "Dollar-cost averaging (DCA) means investing a fixed dollar amount at regular intervals — say, $500 every month — rather than trying to time a single lump-sum entry. Because the fixed amount buys more shares when prices are low and fewer when prices are high, it automatically averages your entry price over time and removes the psychologically difficult decision of \"is right now a good time to buy?\"",
          "DCA doesn't produce a better result than investing a lump sum immediately in every scenario — in a market that trends upward over the investing period (historically the more common case), lump-sum investing tends to outperform, simply because more money spends more time invested. DCA's real value is behavioral: it lowers the emotional stakes of any single entry point and makes consistent investing easier to actually stick with, which matters more in practice than a small edge in expected return.",
          "It's a strategy suited to building a position gradually over months or years — for example, contributing to a retirement account from every paycheck — rather than a technique for actively trading around short-term price swings.",
        ],
      },
      {
        id: "etfs-and-funds",
        title: "ETFs, mutual funds & index investing",
        minutes: 8,
        body: [
          "An exchange-traded fund (ETF) holds a basket of securities (stocks, bonds, or both) and trades on an exchange just like an individual stock, with a price that updates throughout the day. A mutual fund also holds a basket of securities, but it's only priced and traded once per day, after markets close, and often carries higher fees.",
          "An index fund — which can be structured as either an ETF or a mutual fund — simply aims to match the performance of a benchmark index like the S&P 500, rather than trying to beat it through active stock-picking. Because there's no highly-paid team trying to outguess the market, index funds typically charge a fraction of what actively managed funds do, and decades of data show most actively managed funds fail to beat their benchmark index after fees over long periods.",
          "For a beginner without the time or inclination to research individual companies deeply, a small number of low-cost, broadly diversified index ETFs is a well-evidenced starting point — and even experienced individual stock-pickers often use them as the diversified \"core\" of a portfolio, built around a smaller set of individual positions they've researched more deeply.",
        ],
      },
    ],
  },
  {
    id: "risk-management",
    title: "6. Risk management",
    intro:
      "Every strategy in this course fails eventually without disciplined risk management sitting underneath it. This chapter is about surviving your losses so you're still in the game when your winners show up.",
    topics: [
      {
        id: "position-sizing-deep",
        title: "Position sizing",
        minutes: 8,
        body: [
          "Position sizing — how much of your capital goes into any single trade — often matters more to long-run outcomes than which stock you pick. A common rule of thumb among disciplined traders is risking no more than 1–2% of total capital on the amount you could lose in any single trade (not the full position size, but the loss if your stop is hit). At that risk level, a string of ten consecutive losing trades — which will happen to nearly everyone eventually — costs meaningfully less than 20% of the account, keeping you in a position to recover.",
          "The math of drawdowns is brutal and non-intuitive: a 50% loss requires a 100% gain just to get back to even, not a 50% gain. That asymmetry is exactly why avoiding large single-trade losses matters so much more than chasing large single-trade wins.",
          "Position sizing should scale with conviction and with a stock's volatility — a highly volatile stock warrants a smaller position for the same dollar risk, because its normal day-to-day swings are larger relative to any given stop-loss distance.",
        ],
      },
      {
        id: "stop-losses-and-risk-reward",
        title: "Stop-losses & risk/reward ratios",
        minutes: 7,
        body: [
          "A risk/reward ratio compares how much you stand to lose if a trade goes wrong to how much you stand to gain if it goes right — for example, risking $1 to potentially make $3 is a 1:3 ratio. Favorable risk/reward ratios matter because they mean you don't need to be right most of the time to come out ahead: at 1:3, being right just 30–35% of the time can still be profitable over many trades, once costs are accounted for.",
          "Deciding your stop-loss level and profit target before entering a trade — not after watching it move — is one of the clearest lines between a plan and a hope. In the moment, a losing position naturally tempts you to move the stop further away \"to give it room,\" which is usually the exact mistake that turns a small, planned loss into a large, unplanned one.",
          "There's no universally \"correct\" stop distance; it depends on the stock's typical volatility, your timeframe, and how the risk fits into your overall position sizing. What matters is having a rule, deciding it in advance, and actually following it.",
        ],
      },
      {
        id: "volatility-and-beta",
        title: "Volatility and beta",
        minutes: 7,
        body: [
          "Volatility measures how much a stock's price fluctuates over time, regardless of direction — a stock that swings wildly both up and down is \"high volatility\" even if it ends up flat over the year. Higher volatility generally means higher potential reward and higher potential loss in any given period, which is why it should directly inform position sizing, not be ignored.",
          "Beta measures a stock's volatility relative to the overall market (usually the S&P 500), which is assigned a beta of 1.0. A stock with a beta of 1.5 has historically moved about 50% more than the market in each direction; a beta of 0.5 means about half as much. Utility companies and consumer staples tend to have low betas (people keep buying electricity and toothpaste in a recession); speculative growth stocks tend to have high betas.",
          "Beta is calculated from historical data and isn't a guarantee of future behavior, especially during unprecedented market events — but it's a reasonable starting estimate of how much a given stock might amplify or dampen a broad market move.",
        ],
      },
      {
        id: "leverage-and-margin",
        title: "Leverage and margin risk",
        minutes: 8,
        body: [
          "Trading on margin means borrowing money from your broker to buy more stock than your cash alone would allow, using your existing holdings as collateral. It amplifies gains — and losses — in direct proportion to how much you borrow. A stock bought with 2:1 leverage that falls 25% wipes out 50% of your actual capital, not 25%.",
          "Margin also introduces a risk that isn't present in an all-cash account: the margin call. If your positions fall enough that your equity drops below the broker's required maintenance margin, the broker can force-sell your holdings — often at the worst possible time, right after a sharp decline — to bring your account back into compliance, regardless of whether you think the stock will recover.",
          "Leverage isn't inherently reckless in the hands of an experienced trader with a clear plan and strict risk controls, but for anyone still building foundational skills, it multiplies the cost of every mistake at exactly the stage when mistakes are most likely. This app never uses leverage or margin by design — every trade is fully funded by your virtual cash balance.",
        ],
      },
    ],
  },
  {
    id: "psychology-and-strategy",
    title: "7. Trading psychology & strategy styles",
    intro:
      "Two people can look at the exact same chart, the exact same fundamentals, and make opposite — and equally defensible — decisions, because their timeframe and temperament differ. This chapter is about knowing which trader you actually are.",
    topics: [
      {
        id: "trading-styles",
        title: "Day trading vs. swing trading vs. long-term investing",
        minutes: 8,
        body: [
          "Day trading means opening and closing positions within the same trading day, aiming to profit from short-term price movement and never holding a position overnight. It demands constant attention, fast decision-making, and typically higher trading costs and taxes (short-term capital gains are taxed as ordinary income in the U.S.). Most rigorous studies of retail day traders find that the large majority lose money net of costs over time — it's a demanding, competitive activity, not a reliable side income.",
          "Swing trading holds positions for days to weeks, aiming to capture a specific price move (a trend, a post-earnings drift, a technical setup) without the minute-by-minute attention day trading requires. It sits in a middle ground: more active than long-term investing, less frantic than day trading.",
          "Long-term investing holds positions for months to years (or decades), betting on a company's or the market's fundamentals rather than short-term price swings. It benefits from lower trading costs, favorable long-term capital gains tax rates, and — importantly — far less time spent staring at a screen making decisions under pressure. None of these styles is objectively \"better\"; they suit different amounts of available time, risk tolerance, and temperament.",
        ],
      },
      {
        id: "cognitive-biases",
        title: "Common biases that distort trading decisions",
        minutes: 8,
        body: [
          "Loss aversion is the well-documented tendency to feel the pain of a loss roughly twice as intensely as the pleasure of an equivalent gain. In trading, this shows up as holding losing positions too long (hoping to \"get back to even\" before admitting the loss) while selling winners too early (locking in a smaller, certain gain rather than risking it).",
          "FOMO (fear of missing out) drives buying after a stock has already spiked, chasing a move that's statistically more likely to be near its end than its beginning — precisely because a large price jump is what attracted your attention in the first place, and attention arrives late.",
          "Confirmation bias means seeking out information that supports a position you already hold (or want to hold) while dismissing information that contradicts it — dangerously easy to do when you can curate your own news feed and social media follows. Overconfidence, especially after a string of wins, leads to larger, less disciplined position sizing right when a reversion to normal is statistically due. None of these biases are a sign of low intelligence — they're default settings in ordinary human cognition, which is exactly why a written plan and firm rules matter more than willpower alone.",
        ],
      },
      {
        id: "trading-plan",
        title: "Building and following a trading plan",
        minutes: 7,
        body: [
          "A trading plan written down before you're in a position — your entry criteria, position size, stop-loss, profit target, and the specific conditions that would make you exit early — turns a stressful in-the-moment decision into simply following a rule you already agreed to. It doesn't guarantee good outcomes, but it removes the layer of emotional decision-making that turns a manageable loss into a devastating one, or a good gain into a round trip back to zero.",
          "A plan should also define what you'll do differently after a loss versus after a win, since both extremes tend to distort behavior — a losing streak often triggers revenge trading (chasing losses with bigger, less disciplined bets), while a winning streak often triggers overconfidence.",
          "Reviewing your trade history against your plan periodically — not just watching your live P&L — is how you notice these patterns before they compound into serious damage. This app's trade history exists for exactly that kind of review.",
        ],
      },
      {
        id: "common-mistakes-deep",
        title: "Common beginner mistakes, and how to catch them early",
        minutes: 7,
        body: [
          "Averaging down without a plan — buying more of a losing position simply because it's now \"cheaper\" — can be a sound, deliberate strategy when it's part of a predetermined plan, but as an emotional reaction to a loss, it often means adding to a mistake rather than correcting one. The key distinction is whether you decided this in advance or you're deciding it now, under the influence of an existing loss.",
          "Overtrading — taking far more trades than your edge or research can support, often out of boredom or a need for action — quietly erodes returns through transaction costs and the sheer statistical drag of more decisions made with less analysis behind each one.",
          "Checking a portfolio so frequently that ordinary daily noise starts to feel like a crisis is a subtler mistake: it's not a trading error in the traditional sense, but it reliably produces worse decisions by making short-term volatility feel far more significant than it usually is relative to a longer time horizon.",
        ],
      },
    ],
  },
  {
    id: "macro-and-practice",
    title: "8. Macro context & staying informed",
    intro:
      "Individual stocks don't move in a vacuum. This closing chapter zooms out to the economic forces that move entire markets, and ties everything back to how to actually practice what you've learned.",
    topics: [
      {
        id: "economic-indicators",
        title: "Economic indicators worth knowing",
        minutes: 8,
        body: [
          "Gross Domestic Product (GDP) measures the total value of goods and services an economy produces, and its growth rate is the broadest single gauge of economic health — two consecutive quarters of GDP decline is one common informal definition of a recession. The unemployment rate and monthly jobs reports are closely watched because employment drives consumer spending, which drives roughly two-thirds of U.S. economic activity.",
          "Inflation, typically measured by the Consumer Price Index (CPI), tracks how fast prices for goods and services are rising. Moderate, stable inflation is normal and healthy; high or rapidly accelerating inflation erodes purchasing power and often triggers central bank action that ripples through every asset class, stocks included.",
          "None of these indicators predict short-term stock moves reliably on their own — markets are forward-looking and often react more to whether a number beat or missed expectations than to the number itself — but understanding the broad economic backdrop helps explain why entire sectors move together even when no single company has released any company-specific news.",
        ],
      },
      {
        id: "fed-and-interest-rates",
        title: "The Federal Reserve & interest rates",
        minutes: 8,
        body: [
          "The Federal Reserve (the Fed) sets short-term U.S. interest rates, primarily to manage inflation and employment. When the Fed raises rates, borrowing becomes more expensive for companies and consumers alike, which tends to slow economic growth and cool inflation — but it also makes bonds and cash more attractive relative to stocks, and it specifically hurts the valuations of growth stocks whose profits are expected mostly in the distant future (because those future profits are now discounted at a higher rate).",
          "When the Fed cuts rates, the opposite tends to happen: cheaper borrowing supports growth and can boost stock valuations, though cutting rates aggressively is often a response to an economy that's already struggling, which is why rate cuts don't always translate into an immediate stock rally.",
          "Fed announcements are among the most closely watched, market-moving events on the calendar, and markets often react as much to the tone of the accompanying statement (hints about future policy) as to the rate decision itself, since prices already reflect what was widely expected going in.",
        ],
      },
      {
        id: "earnings-and-corporate-events",
        title: "Earnings season & corporate events",
        minutes: 7,
        body: [
          "Publicly traded companies report earnings quarterly, and these reports — especially compared against analyst expectations — are some of the single biggest drivers of individual stock price moves, often causing double-digit swings in a single session. A company can report record profits and still see its stock fall if guidance for the next quarter disappoints, because markets are pricing in the future, not just the past.",
          "A stock split (dividing each existing share into multiple shares, proportionally lowering the price) doesn't change the underlying value of your holding at all — you own more shares at a proportionally lower price — but it's often read as a signal of management's confidence, and it can make shares more accessible to smaller investors.",
          "A buyback (the company repurchasing its own shares) reduces the number of shares outstanding, which mechanically increases earnings per share even with unchanged total profit, and returns cash to remaining shareholders. An IPO (initial public offering) is a private company's first sale of stock to the public — often volatile in its early days of trading due to limited price history and a lack of the usual base of long-term institutional holders.",
        ],
      },
      {
        id: "practice-and-critical-reading",
        title: "Reading news critically, and practicing safely",
        minutes: 7,
        body: [
          "A headline is a starting point, not a conclusion. Check the source, the date, and whether the article actually explains cause and effect or simply describes a price move after the fact (\"shares fell amid uncertainty\" often means the writer isn't confident about the reason either). Financial media has a structural incentive to make every move sound urgent and significant, since attention is the business model — most day-to-day price noise is exactly that: noise.",
          "A watchlist isn't just a shortlist of things to buy — it's a low-pressure way to track how companies you're curious about actually behave over weeks and months, building intuition before committing real capital to them.",
          "This app uses real, live market prices with entirely virtual money — the safest way to build the muscle memory of buying, selling, and watching a portfolio swing, before any of it involves capital you can't afford to lose. Treat every loss here as a free lesson: that's the entire purpose of paper trading, and it's why the exam and certificate at the end of this course exist — to check that the concepts actually stuck, not just that you scrolled through them.",
        ],
      },
    ],
  },
];

export const TOTAL_COURSE_MINUTES = COURSE_CHAPTERS.reduce(
  (sum, chapter) => sum + chapter.topics.reduce((s, t) => s + t.minutes, 0),
  0,
);

export const ALL_TOPIC_IDS = COURSE_CHAPTERS.flatMap((c) => c.topics.map((t) => t.id));
