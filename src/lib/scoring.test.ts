import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_INDIAN_STOCKS,
  calculateStockScore,
  filterAndSortResults,
  getAvailableSectors,
  getRiskLabel,
  rankStocks,
  type Stock,
} from './scoring';
import { FACTOR_CATEGORIES, FACTOR_NAMES, getAllGrowthFactors } from './factors';

test('200 factors catalog contains exactly 200 factors across 11 contiguous categories', () => {
  assert.equal(FACTOR_NAMES.length, 200);
  const all = getAllGrowthFactors();
  assert.equal(all.length, 200);
  assert.equal(all[0].index, 1);
  assert.equal(all[0].categoryId, 'fundamental');
  assert.equal(all[199].index, 200);
  assert.equal(all[199].categoryId, 'catalyst');

  const totalRange = FACTOR_CATEGORIES.reduce(
    (sum, cat) => sum + (cat.endIndex - cat.startIndex + 1),
    0,
  );
  assert.equal(totalRange, 200);
});

test('ScoringEngine calculates exact weighted pillar scores for BEL', () => {
  const bel = DEMO_INDIAN_STOCKS.find((s) => s.symbol === 'BEL');
  assert.ok(bel);
  const res = calculateStockScore(bel);

  // Fundamental:
  // rev(24)=90, prof(32)=100, eps(35)=100, roe(23)=80, roce(28)=90, opm(24)=85, net(18)=75, debt(0)=100 -> avg = 90
  assert.equal(res.fundamentalScore, 90);
  // Business: orderBook(45)=100, sector(38)=100 -> avg = 100
  assert.equal(res.businessScore, 100);
  // Market: 1m(18)=80, 3m(32)=100, 6m(48)=100, vol(40)=100, inst(30)=100 -> avg = 96
  assert.equal(res.marketScore, 96);
  // Valuation: pe=38 (+0), peg=1.2 (+10) -> 60
  assert.equal(res.valuationScore, 60);
  // Final: 90*0.35 + 100*0.15 + 96*0.30 + 60*0.20 = 31.5 + 15 + 28.8 + 12 = 87.3
  assert.ok(Math.abs(res.score - 87.3) < 1e-6);
  assert.equal(res.risk, 50);
});

test('Risk engine penalizes high debt, sharp 3M drawdown, and negative profit growth', () => {
  const distressed: Stock = {
    symbol: 'TESTDIST',
    company: 'Distressed Corp',
    sector: 'Metals',
    revenueGrowth: -15,
    profitGrowth: -5,
    epsGrowth: -12,
    roe: 5,
    roce: 6,
    debtToEquity: 2.6,
    operatingMargin: 2,
    netMargin: 1,
    pe: 75,
    peg: 3.5,
    oneMonthReturn: -15,
    threeMonthReturn: -25,
    sixMonthReturn: -30,
    institutionalBuying: -12,
    volumeChange: -5,
    orderBookGrowth: -12,
    sectorGrowth: 0,
  };

  const result = calculateStockScore(distressed);
  // Risk = 50 + 25 (debt > 2) + 15 (3m < -20) + 10 (profit < 0) = 100
  assert.equal(result.risk, 100);
  assert.equal(getRiskLabel(result.risk), 'Elevated Risk');

  // Screened out by risk < 80 rule
  const ranked = rankStocks([...DEMO_INDIAN_STOCKS, distressed], { topOnly: false });
  assert.equal(ranked.some((r) => r.stock.symbol === 'TESTDIST'), false);
});

test('rankStocks screens top 10 descending by score and filterAndSortResults filters cleanly', () => {
  const top10 = rankStocks(DEMO_INDIAN_STOCKS, { topOnly: true });
  assert.equal(top10.length, 10);
  assert.equal(top10[0].stock.symbol, 'BEL');
  assert.equal(top10[1].stock.symbol, 'M&M');

  for (let i = 1; i < top10.length; i++) {
    assert.ok(top10[i - 1].score >= top10[i].score);
  }

  const all12 = rankStocks(DEMO_INDIAN_STOCKS, { topOnly: false });
  assert.equal(all12.length, 12);

  const banking = filterAndSortResults(all12, { sector: 'Banking' });
  assert.equal(banking.length, 2);
  assert.deepEqual(
    banking.map((b) => b.stock.symbol).sort(),
    ['HDFCBANK', 'ICICIBANK'],
  );

  const searchMM = filterAndSortResults(top10, { searchText: 'mahindra' });
  assert.equal(searchMM.length, 1);
  assert.equal(searchMM[0].stock.symbol, 'M&M');

  const sectors = getAvailableSectors(DEMO_INDIAN_STOCKS);
  assert.equal(sectors[0], 'All');
  assert.ok(sectors.includes('Defence'));
});
