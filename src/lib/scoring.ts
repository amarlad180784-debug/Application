export interface Stock {
  symbol: string;
  company: string;
  sector: string;
  revenueGrowth: number;
  profitGrowth: number;
  epsGrowth: number;
  roe: number;
  roce: number;
  debtToEquity: number;
  operatingMargin: number;
  netMargin: number;
  pe: number;
  peg: number;
  oneMonthReturn: number;
  threeMonthReturn: number;
  sixMonthReturn: number;
  institutionalBuying: number;
  volumeChange: number;
  orderBookGrowth: number;
  sectorGrowth: number;
}

export interface StockResult {
  stock: Stock;
  score: number;
  risk: number;
  fundamentalScore: number;
  businessScore: number;
  marketScore: number;
  valuationScore: number;
}

export type SortField =
  | 'score'
  | 'fundamentalScore'
  | 'businessScore'
  | 'marketScore'
  | 'valuationScore'
  | 'riskAsc';

export const SECURITY_CONFIG = {
  httpsOnly: true,
  storeSecretsOnServer: true,
  enableRateLimiting: true,
  enableInputValidation: true,
  enableEncryptedStorage: true,
  enableServerIntegrity: true,
  enableDebugLoggingInRelease: false,
} as const;

export const SECURITY_CHECKLIST: readonly { title: string; detail: string }[] = [
  {
    title: 'HTTPS-only production communication',
    detail: 'All market-data and AI synthesis requests traverse encrypted transport in production.',
  },
  {
    title: 'Server-side API credential isolation',
    detail: 'GEMINI_API_KEY and licensed data tokens remain exclusively in server-side environment memory.',
  },
  {
    title: 'Backend rate limiting',
    detail: 'Per-client request throttling protects upstream quantitative research endpoints from abuse.',
  },
  {
    title: 'Strict input validation',
    detail: 'Ticker symbols, numeric bounds, and research prompts are validated before execution.',
  },
  {
    title: 'Zero unnecessary device permissions',
    detail: 'No microphone, camera, geolocation, or contact access is requested or required.',
  },
  {
    title: 'No hidden tracking or telemetry',
    detail: 'User research queries and watchlists are not monetized or routed to third-party ad networks.',
  },
  {
    title: 'No guaranteed-return claims',
    detail: 'All rankings represent deterministic quantitative research scores, never investment advice.',
  },
];

export const DEMO_INDIAN_STOCKS: readonly Stock[] = [
  {
    symbol: 'RELIANCE',
    company: 'Reliance Industries',
    sector: 'Energy',
    revenueGrowth: 18,
    profitGrowth: 22,
    epsGrowth: 20,
    roe: 14,
    roce: 16,
    debtToEquity: 0.45,
    operatingMargin: 18,
    netMargin: 12,
    pe: 24,
    peg: 1.5,
    oneMonthReturn: 8,
    threeMonthReturn: 16,
    sixMonthReturn: 25,
    institutionalBuying: 15,
    volumeChange: 20,
    orderBookGrowth: 28,
    sectorGrowth: 18,
  },
  {
    symbol: 'TCS',
    company: 'Tata Consultancy Services',
    sector: 'IT',
    revenueGrowth: 12,
    profitGrowth: 15,
    epsGrowth: 14,
    roe: 48,
    roce: 52,
    debtToEquity: 0.08,
    operatingMargin: 26,
    netMargin: 20,
    pe: 28,
    peg: 1.9,
    oneMonthReturn: 5,
    threeMonthReturn: 12,
    sixMonthReturn: 18,
    institutionalBuying: 10,
    volumeChange: 14,
    orderBookGrowth: 12,
    sectorGrowth: 15,
  },
  {
    symbol: 'HDFCBANK',
    company: 'HDFC Bank',
    sector: 'Banking',
    revenueGrowth: 15,
    profitGrowth: 18,
    epsGrowth: 17,
    roe: 17,
    roce: 18,
    debtToEquity: 0.2,
    operatingMargin: 0,
    netMargin: 0,
    pe: 20,
    peg: 1.2,
    oneMonthReturn: 4,
    threeMonthReturn: 10,
    sixMonthReturn: 16,
    institutionalBuying: 18,
    volumeChange: 12,
    orderBookGrowth: 15,
    sectorGrowth: 20,
  },
  {
    symbol: 'BHARTIARTL',
    company: 'Bharti Airtel',
    sector: 'Telecom',
    revenueGrowth: 20,
    profitGrowth: 25,
    epsGrowth: 27,
    roe: 14,
    roce: 17,
    debtToEquity: 1.1,
    operatingMargin: 25,
    netMargin: 10,
    pe: 35,
    peg: 1.6,
    oneMonthReturn: 12,
    threeMonthReturn: 22,
    sixMonthReturn: 31,
    institutionalBuying: 20,
    volumeChange: 30,
    orderBookGrowth: 32,
    sectorGrowth: 25,
  },
  {
    symbol: 'SUNPHARMA',
    company: 'Sun Pharmaceutical',
    sector: 'Pharma',
    revenueGrowth: 16,
    profitGrowth: 20,
    epsGrowth: 22,
    roe: 16,
    roce: 18,
    debtToEquity: 0.2,
    operatingMargin: 30,
    netMargin: 20,
    pe: 32,
    peg: 1.5,
    oneMonthReturn: 9,
    threeMonthReturn: 17,
    sixMonthReturn: 24,
    institutionalBuying: 17,
    volumeChange: 18,
    orderBookGrowth: 20,
    sectorGrowth: 22,
  },
  {
    symbol: 'LT',
    company: 'Larsen & Toubro',
    sector: 'Infrastructure',
    revenueGrowth: 19,
    profitGrowth: 24,
    epsGrowth: 26,
    roe: 15,
    roce: 18,
    debtToEquity: 1.2,
    operatingMargin: 12,
    netMargin: 8,
    pe: 30,
    peg: 1.4,
    oneMonthReturn: 14,
    threeMonthReturn: 25,
    sixMonthReturn: 35,
    institutionalBuying: 22,
    volumeChange: 28,
    orderBookGrowth: 35,
    sectorGrowth: 30,
  },
  {
    symbol: 'ICICIBANK',
    company: 'ICICI Bank',
    sector: 'Banking',
    revenueGrowth: 17,
    profitGrowth: 20,
    epsGrowth: 21,
    roe: 18,
    roce: 19,
    debtToEquity: 0.15,
    operatingMargin: 0,
    netMargin: 0,
    pe: 19,
    peg: 1.1,
    oneMonthReturn: 7,
    threeMonthReturn: 14,
    sixMonthReturn: 21,
    institutionalBuying: 19,
    volumeChange: 16,
    orderBookGrowth: 18,
    sectorGrowth: 21,
  },
  {
    symbol: 'MARUTI',
    company: 'Maruti Suzuki India',
    sector: 'Automobile',
    revenueGrowth: 13,
    profitGrowth: 17,
    epsGrowth: 19,
    roe: 14,
    roce: 16,
    debtToEquity: 0.1,
    operatingMargin: 12,
    netMargin: 9,
    pe: 30,
    peg: 1.6,
    oneMonthReturn: 5,
    threeMonthReturn: 15,
    sixMonthReturn: 23,
    institutionalBuying: 14,
    volumeChange: 17,
    orderBookGrowth: 19,
    sectorGrowth: 20,
  },
  {
    symbol: 'INFY',
    company: 'Infosys',
    sector: 'IT',
    revenueGrowth: 9,
    profitGrowth: 12,
    epsGrowth: 13,
    roe: 30,
    roce: 32,
    debtToEquity: 0.05,
    operatingMargin: 25,
    netMargin: 19,
    pe: 27,
    peg: 2.0,
    oneMonthReturn: 4,
    threeMonthReturn: 10,
    sixMonthReturn: 17,
    institutionalBuying: 9,
    volumeChange: 11,
    orderBookGrowth: 10,
    sectorGrowth: 13,
  },
  {
    symbol: 'TITAN',
    company: 'Titan Company',
    sector: 'Consumer',
    revenueGrowth: 22,
    profitGrowth: 27,
    epsGrowth: 30,
    roe: 25,
    roce: 28,
    debtToEquity: 0.35,
    operatingMargin: 13,
    netMargin: 9,
    pe: 60,
    peg: 2.4,
    oneMonthReturn: 10,
    threeMonthReturn: 19,
    sixMonthReturn: 29,
    institutionalBuying: 16,
    volumeChange: 21,
    orderBookGrowth: 24,
    sectorGrowth: 25,
  },
  {
    symbol: 'M&M',
    company: 'Mahindra & Mahindra',
    sector: 'Automobile',
    revenueGrowth: 21,
    profitGrowth: 30,
    epsGrowth: 32,
    roe: 18,
    roce: 21,
    debtToEquity: 1.0,
    operatingMargin: 14,
    netMargin: 10,
    pe: 27,
    peg: 1.0,
    oneMonthReturn: 16,
    threeMonthReturn: 28,
    sixMonthReturn: 42,
    institutionalBuying: 25,
    volumeChange: 35,
    orderBookGrowth: 40,
    sectorGrowth: 32,
  },
  {
    symbol: 'BEL',
    company: 'Bharat Electronics',
    sector: 'Defence',
    revenueGrowth: 24,
    profitGrowth: 32,
    epsGrowth: 35,
    roe: 23,
    roce: 28,
    debtToEquity: 0.0,
    operatingMargin: 24,
    netMargin: 18,
    pe: 38,
    peg: 1.2,
    oneMonthReturn: 18,
    threeMonthReturn: 32,
    sixMonthReturn: 48,
    institutionalBuying: 30,
    volumeChange: 40,
    orderBookGrowth: 45,
    sectorGrowth: 38,
  },
];

function clamp(x: number): number {
  return Math.max(0, Math.min(100, x));
}

function growth(x: number): number {
  if (x >= 30) return 100;
  if (x >= 20) return 90;
  if (x >= 15) return 80;
  if (x >= 10) return 70;
  if (x >= 5) return 55;
  if (x >= 0) return 40;
  if (x >= -10) return 20;
  return 0;
}

function quality(x: number): number {
  if (x >= 30) return 100;
  if (x >= 25) return 90;
  if (x >= 20) return 80;
  if (x >= 15) return 70;
  if (x >= 10) return 55;
  return 30;
}

function margin(x: number): number {
  if (x >= 30) return 100;
  if (x >= 20) return 85;
  if (x >= 15) return 75;
  if (x >= 10) return 60;
  if (x >= 5) return 45;
  return 25;
}

function debt(x: number): number {
  if (x <= 0.2) return 100;
  if (x <= 0.5) return 85;
  if (x <= 1.0) return 70;
  if (x <= 2.0) return 45;
  return 15;
}

function momentum(x: number): number {
  if (x >= 30) return 100;
  if (x >= 20) return 90;
  if (x >= 10) return 80;
  if (x >= 5) return 65;
  if (x >= 0) return 50;
  if (x >= -10) return 30;
  return 10;
}

function valuation(pe: number, peg: number): number {
  let score = 50;
  if (pe >= 0 && pe <= 20) score += 20;
  else if (pe > 20 && pe <= 30) score += 10;
  else if (pe > 60) score -= 20;

  if (peg >= 0 && peg <= 1.0) score += 25;
  else if (peg > 1.0 && peg <= 2.0) score += 10;
  else if (peg > 3) score -= 15;

  return clamp(score);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

export function calculateStockScore(stock: Stock): StockResult {
  const fundamentalScore = average([
    growth(stock.revenueGrowth),
    growth(stock.profitGrowth),
    growth(stock.epsGrowth),
    quality(stock.roe),
    quality(stock.roce),
    margin(stock.operatingMargin),
    margin(stock.netMargin),
    debt(stock.debtToEquity),
  ]);

  const businessScore = average([
    growth(stock.orderBookGrowth),
    growth(stock.sectorGrowth),
  ]);

  const marketScore = average([
    momentum(stock.oneMonthReturn),
    momentum(stock.threeMonthReturn),
    momentum(stock.sixMonthReturn),
    momentum(stock.volumeChange),
    momentum(stock.institutionalBuying),
  ]);

  const valuationScore = valuation(stock.pe, stock.peg);

  const finalScore =
    fundamentalScore * 0.35 +
    businessScore * 0.15 +
    marketScore * 0.30 +
    valuationScore * 0.20;

  let risk = 50;
  if (stock.debtToEquity > 2) risk += 25;
  if (stock.threeMonthReturn < -20) risk += 15;
  if (stock.profitGrowth < 0) risk += 10;

  return {
    stock,
    score: clamp(finalScore),
    risk: clamp(risk),
    fundamentalScore,
    businessScore,
    marketScore,
    valuationScore,
  };
}

export function rankStocks(
  stocks: readonly Stock[],
  options: { topOnly?: boolean; maxRisk?: number } = {},
): StockResult[] {
  const { topOnly = true, maxRisk = 80 } = options;
  const screened = stocks
    .map(calculateStockScore)
    .filter((item) => item.risk < maxRisk)
    .sort((a, b) => b.score - a.score);

  return topOnly ? screened.slice(0, 10) : screened;
}

export function filterAndSortResults(
  results: readonly StockResult[],
  options: {
    searchText?: string;
    sector?: string;
    sortBy?: SortField;
  } = {},
): StockResult[] {
  const { searchText = '', sector = 'All', sortBy = 'score' } = options;
  const query = searchText.trim().toLowerCase();

  const filtered = results.filter((item) => {
    const matchesSector = sector === 'All' || item.stock.sector === sector;
    const matchesQuery =
      query.length === 0 ||
      item.stock.symbol.toLowerCase().includes(query) ||
      item.stock.company.toLowerCase().includes(query) ||
      item.stock.sector.toLowerCase().includes(query);

    return matchesSector && matchesQuery;
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'riskAsc') {
      if (a.risk !== b.risk) return a.risk - b.risk;
      return b.score - a.score;
    }
    return b[sortBy] - a[sortBy];
  });
}

export function getAvailableSectors(stocks: readonly Stock[]): string[] {
  const unique = new Set(stocks.map((s) => s.sector));
  return ['All', ...Array.from(unique).sort()];
}

export function getRiskLabel(risk: number): 'Low Risk' | 'Moderate Risk' | 'Elevated Risk' {
  if (risk <= 50) return 'Low Risk';
  if (risk < 75) return 'Moderate Risk';
  return 'Elevated Risk';
}
