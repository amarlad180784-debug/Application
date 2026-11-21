import { useEffect, useState } from 'react';
import { BrainCircuit, Send, X, AlertCircle } from 'lucide-react';
import { getRiskLabel, type StockResult } from '../lib/scoring';

interface StockAnalysisModalProps {
  result: StockResult;
  onClose: () => void;
}

const PRESET_QUERIES = [
  'Stress-test valuation multiples (P/E & PEG) against earnings growth durability.',
  'Identify top 200-factor macro, policy, and catalyst exposures for this equity.',
  'Evaluate balance sheet resilience and institutional momentum sustainability.',
] as const;

export function StockAnalysisModal({ result, onClose }: StockAnalysisModalProps) {
  const s = result.stock;
  const [question, setQuestion] = useState<string>(PRESET_QUERIES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisOutput, setAnalysisOutput] = useState<string | null>(null);
  const [analysisModel, setAnalysisModel] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setAnalysisOutput(null);
    setErrorMsg(null);
    setAnalysisModel(null);
    setQuestion(PRESET_QUERIES[0]);
  }, [s.symbol]);

  async function handleRunAnalysis(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = question.trim();
    if (trimmed.length < 5) {
      setErrorMsg('Please enter a research question of at least 5 characters.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: s.symbol,
          question: trimmed,
        }),
      });

      const payload = (await response.json()) as {
        analysis?: string;
        model?: string;
        error?: string;
      };

      if (!response.ok) {
        setErrorMsg(
          payload.error || `Deep research request failed (${response.status}).`,
        );
        return;
      }

      setAnalysisOutput(payload.analysis ?? null);
      setAnalysisModel(payload.model ?? 'gemini-4-carbon');
    } catch {
      setErrorMsg(
        'Network error reaching the research backend. Please verify the server is running.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  const riskLabel = getRiskLabel(result.risk);
  const riskColor =
    result.risk <= 50
      ? 'text-emerald-700'
      : result.risk < 75
        ? 'text-amber-700'
        : 'text-red-700';

  const metrics: readonly { label: string; value: string }[] = [
    { label: 'Revenue Growth', value: `${s.revenueGrowth}%` },
    { label: 'Profit Growth', value: `${s.profitGrowth}%` },
    { label: 'EPS Growth', value: `${s.epsGrowth}%` },
    { label: 'ROE', value: `${s.roe}%` },
    { label: 'ROCE', value: `${s.roce}%` },
    { label: 'Debt / Equity', value: s.debtToEquity.toFixed(2) },
    { label: 'Operating Margin', value: `${s.operatingMargin}%` },
    { label: 'Net Margin', value: `${s.netMargin}%` },
    { label: 'P/E Ratio', value: `${s.pe.toFixed(1)}x` },
    { label: 'PEG Ratio', value: s.peg.toFixed(2) },
    { label: '1M Return', value: `${s.oneMonthReturn}%` },
    { label: '3M Return', value: `${s.threeMonthReturn}%` },
    { label: '6M Return', value: `${s.sixMonthReturn}%` },
    { label: 'Inst. Buying', value: `${s.institutionalBuying}%` },
    { label: 'Volume Change', value: `${s.volumeChange}%` },
    { label: 'Order Book Growth', value: `${s.orderBookGrowth}%` },
    { label: 'Sector Growth', value: `${s.sectorGrowth}%` },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-dialog-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2
              id="stock-dialog-title"
              className="font-display text-xl font-bold text-slate-950"
            >
              {s.symbol} Analysis
            </h2>
            <p className="mt-0.5 text-sm text-slate-600">
              {s.company} · {s.sector}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${s.symbol} analysis`}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-700"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="divide-y divide-slate-200 px-6 py-4">
          {/* Top Quantitative Summary */}
          <div className="grid grid-cols-2 gap-4 pb-5 sm:grid-cols-6">
            <div className="col-span-2 pr-2">
              <div className="text-xs font-medium text-slate-500">Overall Score</div>
              <div className="mt-1 font-mono text-3xl font-bold text-slate-950 tabular-nums">
                {result.score.toFixed(1)}
              </div>
              <div className={`mt-1 text-xs font-medium ${riskColor}`}>
                Risk {result.risk.toFixed(1)} / 100 · {riskLabel}
              </div>
            </div>

            {[
              ['Fundamental', '35%', result.fundamentalScore],
              ['Business', '15%', result.businessScore],
              ['Market', '30%', result.marketScore],
              ['Valuation', '20%', result.valuationScore],
            ].map(([name, weight, value]) => (
              <div key={String(name)} className="border-l border-slate-100 pl-3">
                <div className="text-xs font-medium text-slate-500">{name}</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {Number(value).toFixed(1)}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-400">Weight {weight}</div>
              </div>
            ))}
          </div>

          {/* 17 Underlying Financial & Market Metrics */}
          <section className="py-5">
            <h3 className="font-display text-sm font-semibold text-slate-900">
              Underlying Financial &amp; Market Telemetry
            </h3>
            <dl className="mt-2.5 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="flex items-baseline justify-between gap-2">
                  <dt className="text-xs text-slate-500">{metric.label}</dt>
                  <dd className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Deep Thinking Research Synthesis */}
          <section className="py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-blue-700" aria-hidden="true" />
                <h3 className="font-display text-sm font-semibold text-slate-950">
                  Deep Research Synthesis (High Thinking)
                </h3>
              </div>
              <span className="font-mono text-[11px] text-slate-500">
                gemini-4-carbon · HIGH
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Ask complex multi-factor questions combining {s.symbol}&apos;s quantitative scores with the 200-factor macro and catalyst framework.
            </p>

            {/* Quick Prompt Buttons */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {PRESET_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuestion(preset)}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-left text-xs text-slate-700 transition-colors hover:border-blue-700 hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-blue-700"
                >
                  {preset}
                </button>
              ))}
            </div>

            <form onSubmit={handleRunAnalysis} className="mt-3 space-y-2.5">
              <div>
                <label htmlFor="deep-research-query" className="sr-only">
                  Quantitative research question for {s.symbol}
                </label>
                <textarea
                  id="deep-research-query"
                  rows={2}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={`Ask a deep quantitative research question about ${s.symbol}...`}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500">
                  Executed server-side via Gemini API
                </span>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isAnalyzing ? 'Reasoning (High Thinking)...' : 'Run Deep Analysis'}</span>
                </button>
              </div>
            </form>

            {errorMsg && (
              <div
                role="alert"
                className="mt-3 flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                <div>
                  <div className="font-semibold">Deep Thinking unavailable</div>
                  <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            {analysisOutput && (
              <div
                data-testid="analysis-output"
                className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">
                    {s.symbol} Deep Quantitative Brief
                  </span>
                  <span className="font-mono">{analysisModel}</span>
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {analysisOutput}
                </div>
              </div>
            )}
          </section>

          <p className="pt-4 text-xs text-slate-500">
            This is a quantitative research score, not a guarantee of future stock performance.
          </p>
        </div>
      </div>
    </div>
  );
}
