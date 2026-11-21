import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { SECURITY_CHECKLIST } from '../lib/scoring';

export function SecurityView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Security &amp; Methodology
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Backend credential isolation, request governance, and quantitative scoring formula transparency.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Security Controls */}
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-blue-700" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-slate-950">
              Security &amp; Privacy Controls
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-slate-600">
            Engineered so sensitive API credentials and licensed market-data integrations never reach client bundles.
          </p>

          <ul className="mt-5 divide-y divide-slate-100">
            {SECURITY_CHECKLIST.map((item) => (
              <li key={item.title} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                  aria-hidden="true"
                />
                <div>
                  <div className="text-sm font-medium text-slate-900">{item.title}</div>
                  <div className="mt-0.5 text-xs leading-relaxed text-slate-600">
                    {item.detail}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Quantitative Methodology */}
        <section className="rounded-lg border border-slate-200 bg-white p-6 space-y-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-950">
              Quantitative Scoring Formula
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Each NSE/BSE equity is evaluated across four deterministic pillars, screened for downside balance-sheet and drawdown risk, and ranked descending.
            </p>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800">
            <div>Composite Score =</div>
            <div className="mt-1 pl-3">0.35 &times; Fundamental (8 metrics)</div>
            <div className="pl-3">+ 0.15 &times; Business Growth (2 metrics)</div>
            <div className="pl-3">+ 0.30 &times; Market Momentum (5 metrics)</div>
            <div className="pl-3">+ 0.20 &times; Valuation (P/E &amp; PEG)</div>
          </div>

          <div className="space-y-2.5 text-sm text-slate-600">
            <h3 className="font-display text-sm font-semibold text-slate-900">
              Risk Screening Rules
            </h3>
            <p className="text-xs leading-relaxed">
              Every equity begins at a baseline risk score of <span className="font-mono font-medium text-slate-900">50.0</span>. Additional risk penalties are added for elevated leverage (<span className="font-mono">Debt/Equity &gt; 2.0</span>: +25), sharp intermediate drawdowns (<span className="font-mono">3M Return &lt; -20%</span>: +15), or negative earnings momentum (<span className="font-mono">Profit Growth &lt; 0%</span>: +10). Equities with risk &ge; 80 are filtered out of the primary ranking.
            </p>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-4">
            <div className="font-semibold text-slate-900">
              Data Source &amp; Research Disclaimer
            </div>
            <p>
              The current universe uses the 12-stock demonstration NSE/BSE dataset. Connect a licensed market-data provider to the <code className="font-mono text-slate-800">/api/stocks</code> backend endpoint for live daily exchange feeds. Quantitative scores do not guarantee future performance.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
