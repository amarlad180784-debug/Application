import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getRiskLabel, type SortField, type StockResult } from '../lib/scoring';

interface RankingsViewProps {
  results: StockResult[];
  allResultsCount: number;
  scope: 'top10' | 'all';
  searchText: string;
  onSearchChange: (value: string) => void;
  sortBy: SortField;
  onSortChange: (value: SortField) => void;
  selectedSector: string;
  onResetFilters: () => void;
  onSelectStock: (result: StockResult) => void;
  isLoading: boolean;
  lastUpdatedLabel: string;
}

function ScoreTrack({ value, compact = false }: { value: number; compact?: boolean }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full overflow-hidden rounded-full bg-slate-100 ${compact ? 'h-1.5' : 'h-2'}`}>
      <div
        className="h-full rounded-full bg-blue-700 transition-all duration-200"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function RiskLabel({ risk }: { risk: number }) {
  const label = getRiskLabel(risk);
  const colorClass =
    risk <= 50
      ? 'text-emerald-700'
      : risk < 75
        ? 'text-amber-700'
        : 'text-red-700';

  return (
    <div className="text-right whitespace-nowrap">
      <div className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
        {risk.toFixed(1)}
      </div>
      <div className={`text-[11px] font-medium ${colorClass}`}>{label}</div>
    </div>
  );
}

export function RankingsView({
  results,
  allResultsCount,
  scope,
  searchText,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedSector,
  onResetFilters,
  onSelectStock,
  isLoading,
  lastUpdatedLabel,
}: RankingsViewProps) {
  const topLeader = results[0];
  const meanScore =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.score, 0) / results.length
      : 0;
  const avgRisk =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.risk, 0) / results.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {scope === 'top10' ? "Today's Top 10" : 'Screened Equity Universe'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Quantitative NSE/BSE research ranking · Demonstration dataset · Not guaranteed returns
          </p>
        </div>
        <div className="font-mono text-xs text-slate-500 tabular-nums">
          Updated {lastUpdatedLabel}
        </div>
      </div>

      {/* 4-column Summary Metric Strip */}
      <section
        aria-label="Universe summary metrics"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Top Ranked</div>
          <div className="mt-1.5 flex items-baseline justify-between gap-2">
            <span className="font-display text-lg font-bold text-slate-950 truncate">
              {topLeader ? topLeader.stock.symbol : '—'}
            </span>
            <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
              {topLeader ? topLeader.score.toFixed(1) : '—'}
            </span>
          </div>
          <div className="mt-0.5 text-xs text-slate-500 truncate">
            {topLeader ? topLeader.stock.sector : 'No match'}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Mean Composite</div>
          <div className="mt-1.5 font-mono text-lg font-bold text-slate-950 tabular-nums">
            {results.length > 0 ? meanScore.toFixed(1) : '—'}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">Out of 100.0</div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Showing Equities</div>
          <div className="mt-1.5 font-mono text-lg font-bold text-slate-950 tabular-nums">
            {results.length} / {allResultsCount}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">
            {selectedSector === 'All' ? 'All sectors' : selectedSector}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Mean Risk Score</div>
          <div className="mt-1.5 font-mono text-lg font-bold text-slate-950 tabular-nums">
            {results.length > 0 ? avgRisk.toFixed(1) : '—'}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">Screened below 80.0</div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <label htmlFor="stock-search" className="sr-only">
            Search NSE/BSE stock
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="stock-search"
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search NSE/BSE stock by symbol, company, or sector..."
            className="min-h-10 w-full rounded-md border border-slate-200 bg-slate-50 pr-9 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:bg-white focus:outline-none"
          />
          {searchText.length > 0 && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <label htmlFor="sort-select" className="text-xs font-medium text-slate-600 whitespace-nowrap">
            Sort by
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortField)}
            className="min-h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 focus:border-blue-700 focus:bg-white focus:outline-none"
          >
            <option value="score">Overall Score</option>
            <option value="fundamentalScore">Fundamental (35%)</option>
            <option value="marketScore">Market Momentum (30%)</option>
            <option value="valuationScore">Valuation (20%)</option>
            <option value="businessScore">Business Growth (15%)</option>
            <option value="riskAsc">Lowest Risk</option>
          </select>
        </div>
      </section>

      {/* Main Data Grid / Empty / Loading States */}
      {isLoading ? (
        <div
          aria-label="Loading stock rankings"
          className="overflow-hidden rounded-lg border border-slate-200 bg-white divide-y divide-slate-100"
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-5 w-7 rounded bg-slate-100" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 rounded bg-slate-100" />
                  <div className="h-3 w-44 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-5 w-16 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
          <h2 className="font-display text-base font-semibold text-slate-900">
            No matching NSE/BSE equities found
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Adjust your search query or sector filter to inspect the screened ranking universe.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-blue-700"
          >
            Reset search &amp; filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold tracking-wide text-slate-500">
                  <th scope="col" className="py-3 pl-4 pr-3">Rank</th>
                  <th scope="col" className="py-3 px-3">Equity</th>
                  <th scope="col" className="py-3 px-3 text-right">Overall</th>
                  <th scope="col" className="py-3 px-3 w-28">Fundamental</th>
                  <th scope="col" className="py-3 px-3 w-24">Business</th>
                  <th scope="col" className="py-3 px-3 w-24">Market</th>
                  <th scope="col" className="py-3 px-3 w-24">Valuation</th>
                  <th scope="col" className="py-3 px-3 text-right">P/E · PEG</th>
                  <th scope="col" className="py-3 px-3 text-right">Risk</th>
                  <th scope="col" className="py-3 pl-3 pr-4 text-right">Research</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {results.map((result, index) => {
                  const s = result.stock;
                  return (
                    <tr
                      key={s.symbol}
                      className="transition-colors duration-100 hover:bg-slate-50/90"
                    >
                      <td className="py-3.5 pl-4 pr-3 font-mono text-xs font-semibold text-slate-500 tabular-nums">
                        #{index + 1}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-display font-semibold text-slate-950">
                          {s.symbol}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          <span>{s.company}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{s.sector}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="font-mono text-base font-bold text-slate-950 tabular-nums">
                          {result.score.toFixed(1)}
                        </div>
                        <div className="mt-1 w-16 ml-auto">
                          <ScoreTrack value={result.score} compact />
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-medium text-slate-800 tabular-nums">
                            {result.fundamentalScore.toFixed(0)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <ScoreTrack value={result.fundamentalScore} compact />
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-xs font-medium text-slate-800 tabular-nums">
                          {result.businessScore.toFixed(0)}
                        </div>
                        <div className="mt-1">
                          <ScoreTrack value={result.businessScore} compact />
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-xs font-medium text-slate-800 tabular-nums">
                          {result.marketScore.toFixed(0)}
                        </div>
                        <div className="mt-1">
                          <ScoreTrack value={result.marketScore} compact />
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-xs font-medium text-slate-800 tabular-nums">
                          {result.valuationScore.toFixed(0)}
                        </div>
                        <div className="mt-1">
                          <ScoreTrack value={result.valuationScore} compact />
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                        {s.pe.toFixed(0)}x · {s.peg.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3">
                        <RiskLabel risk={result.risk} />
                      </td>
                      <td className="py-3.5 pl-3 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectStock(result)}
                          aria-label={`Analyze ${s.symbol}`}
                          className="inline-flex min-h-9 items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 whitespace-nowrap transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-700"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="space-y-3 md:hidden">
            {results.map((result, index) => {
              const s = result.stock;
              return (
                <article
                  key={s.symbol}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-base font-bold text-slate-950">
                        #{index + 1} {s.symbol}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {s.company} · {s.sector}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xl font-bold text-slate-950 tabular-nums">
                        {result.score.toFixed(1)}
                      </div>
                      <div className="text-[11px] text-slate-500">Score</div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {[
                      ['Fundamental', result.fundamentalScore],
                      ['Business', result.businessScore],
                      ['Market', result.marketScore],
                      ['Valuation', result.valuationScore],
                    ].map(([label, val]) => (
                      <div key={String(label)}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">{label}</span>
                          <span className="font-mono font-semibold text-slate-900 tabular-nums">
                            {Number(val).toFixed(0)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <ScoreTrack value={Number(val)} compact />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="text-xs text-slate-600">
                      <span className="font-mono tabular-nums">
                        Risk {result.risk.toFixed(1)}/100
                      </span>
                      <span aria-hidden="true"> · </span>
                      <span>{getRiskLabel(result.risk)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectStock(result)}
                      aria-label={`Analyze ${s.symbol}`}
                      className="inline-flex min-h-10 items-center rounded-md bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white whitespace-nowrap"
                    >
                      Analyze
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
