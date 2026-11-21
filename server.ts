import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  DEMO_INDIAN_STOCKS,
  rankStocks,
  type Stock,
  type StockResult,
} from './src/lib/scoring.ts';
import { FACTOR_CATEGORIES } from './src/lib/factors.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 25;

const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(clientKey: string): boolean {
  const now = Date.now();
  const bucket = requestBuckets.get(clientKey);
  if (!bucket || now > bucket.resetAt) {
    requestBuckets.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  bucket.count += 1;
  return true;
}

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function formatStockContext(result: StockResult, peers: StockResult[]): string {
  const s = result.stock;
  const peerSummary = peers
    .slice(0, 5)
    .map(
      (p) =>
        `${p.stock.symbol} (${p.stock.sector}): Score ${p.score.toFixed(1)}, F:${p.fundamentalScore.toFixed(1)}, B:${p.businessScore.toFixed(1)}, M:${p.marketScore.toFixed(1)}, V:${p.valuationScore.toFixed(1)}, Risk:${p.risk.toFixed(0)}`,
    )
    .join('\n');

  return [
    `Selected Equity: ${s.symbol} — ${s.company} (Sector: ${s.sector})`,
    `Overall Quantitative Score: ${result.score.toFixed(1)} / 100 | Risk Score: ${result.risk.toFixed(1)} / 100`,
    `Pillar Scores -> Fundamental (35%): ${result.fundamentalScore.toFixed(1)}, Business (15%): ${result.businessScore.toFixed(1)}, Market (30%): ${result.marketScore.toFixed(1)}, Valuation (20%): ${result.valuationScore.toFixed(1)}`,
    `Financial & Market Metrics:`,
    `- Revenue Growth: ${s.revenueGrowth}%, Profit Growth: ${s.profitGrowth}%, EPS Growth: ${s.epsGrowth}%`,
    `- ROE: ${s.roe}%, ROCE: ${s.roce}%, Debt/Equity: ${s.debtToEquity}`,
    `- Operating Margin: ${s.operatingMargin}%, Net Margin: ${s.netMargin}%`,
    `- P/E: ${s.pe}, PEG: ${s.peg}`,
    `- Returns -> 1M: ${s.oneMonthReturn}%, 3M: ${s.threeMonthReturn}%, 6M: ${s.sixMonthReturn}%`,
    `- Institutional Buying: ${s.institutionalBuying}%, Volume Change: ${s.volumeChange}%, Order Book Growth: ${s.orderBookGrowth}%, Sector Growth: ${s.sectorGrowth}%`,
    `Factor Architecture (11 Categories covering 200 Factors):`,
    FACTOR_CATEGORIES.map((c) => `${c.rangeLabel} ${c.name} (${c.pillarWeight})`).join('; '),
    `Top Ranked Universe Peers for Context:`,
    peerSummary,
  ].join('\n');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'stock-growth-200' });
  });

  app.get('/api/stocks', (req, res) => {
    const clientIp = req.ip || 'local';
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        error: 'Rate limit exceeded. Please wait a minute before refreshing rankings.',
      });
      return;
    }

    const scope = req.query.scope === 'all' ? 'all' : 'top10';
    const ranked = rankStocks(DEMO_INDIAN_STOCKS, {
      topOnly: scope !== 'all',
    });

    res.json({
      source: 'demonstration-nse-bse-dataset',
      generatedAt: new Date().toISOString(),
      totalUniverse: DEMO_INDIAN_STOCKS.length,
      items: ranked,
    });
  });

  app.post('/api/analyze', async (req, res) => {
    const clientIp = req.ip || 'local';
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        error: 'Too many research synthesis requests. Please pause briefly and try again.',
      });
      return;
    }

    const body = req.body as { symbol?: unknown; question?: unknown } | undefined;
    const rawSymbol = typeof body?.symbol === 'string' ? body.symbol.trim().toUpperCase() : '';
    const rawQuestion = typeof body?.question === 'string' ? body.question.trim() : '';

    if (!rawSymbol || rawSymbol.length > 20 || !/^[A-Z0-9&.\-]+$/.test(rawSymbol)) {
      res.status(400).json({
        error: 'Please provide a valid NSE/BSE ticker symbol.',
      });
      return;
    }

    if (!rawQuestion || rawQuestion.length < 5 || rawQuestion.length > 1000) {
      res.status(400).json({
        error: 'Research question must be between 5 and 1000 characters.',
      });
      return;
    }

    const allRanked = rankStocks(DEMO_INDIAN_STOCKS, { topOnly: false });
    const targetResult = allRanked.find((r) => r.stock.symbol === rawSymbol);
    if (!targetResult) {
      res.status(404).json({
        error: `Ticker "${rawSymbol}" was not found in the active Stock Growth 200 universe.`,
      });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.status(403).json({
        error:
          'Deep Thinking mode requires a configured Gemini API key. Open Settings > Secrets in AI Studio to attach a billing-enabled key for gemini-4-carbon.',
      });
      return;
    }

    const contextBlock = formatStockContext(targetResult, allRanked);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-carbon',
        contents: [
          `Quantitative Research Context:\n${contextBlock}`,
          `Analyst Query:\n${rawQuestion}`,
        ].join('\n\n'),
        config: {
          systemInstruction:
            'You are an institutional quantitative equity research analyst for Indian NSE/BSE equities using the Stock Growth 200 framework. Analyze the provided deterministic scores, ratios, and 200-factor architecture objectively. Keep your response concise (under 350 words), organized into clear plain-text sections: Thesis Summary, Key Pillar Drivers, 200-Factor Blindspots & Macro Catalysts, and Risk Constraints. Explicitly note that the quantitative dataset is for research purposes and does not guarantee future returns. Do not invent financial numbers that contradict the provided context.',
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });

      const analysisText = response.text?.trim();
      if (!analysisText) {
        res.status(502).json({
          error: 'The quantitative reasoning model returned an empty synthesis. Please retry.',
        });
        return;
      }

      res.json({
        symbol: targetResult.stock.symbol,
        model: 'gemini-4-carbon',
        thinkingLevel: 'HIGH',
        analysis: analysisText,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      const status =
        typeof (err as { status?: unknown })?.status === 'number'
          ? (err as { status: number }).status
          : 500;

      if (status === 403 || status === 400 || /API_KEY|PERMISSION_DENIED/i.test(message)) {
        res.status(status === 400 ? 400 : 403).json({
          error:
            'Unable to authenticate with Gemini API for gemini-4-carbon. Please check or select a billing-enabled API key in Settings > Secrets.',
        });
        return;
      }

      if (status === 429 || /RESOURCE_EXHAUSTED|quota/i.test(message)) {
        res.status(429).json({
          error:
            'Gemini API quota exceeded for gemini-4-carbon. Select a billing-enabled API key in Settings > Secrets to unlock high-thinking deep research.',
        });
        return;
      }

      console.error('Gemini analysis error:', message);
      res.status(502).json({
        error: `Deep research synthesis failed: ${message}`,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Stock Growth 200 server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
