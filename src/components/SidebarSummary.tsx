import type { ActiveTab } from './TopHeader';

interface SidebarSummaryProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  scope: 'top10' | 'all';
  onScopeChange: (scope: 'top10' | 'all') => void;
  sectors: string[];
  selectedSector: string;
  onSelectSector: (sector: string) => void;
  sectorCounts: Record<string, number>;
  totalUniverseCount: number;
}

const PILLAR_WEIGHTS = [
  { name: 'Fundamental', weight: '35%', factors: 'Growth, ROE/ROCE, Margins, Debt' },
  { name: 'Market', weight: '30%', factors: '1M/3M/6M Return, Volume, Inst. Flow' },
  { name: 'Valuation', weight: '20%', factors: 'P/E & PEG Multiples' },
  { name: 'Business', weight: '15%', factors: 'Order Book & Sector Growth' },
] as const;

export function SidebarSummary({
  activeTab,
  onSelectTab,
  scope,
  onScopeChange,
  sectors,
  selectedSector,
  onSelectSector,
  sectorCounts,
  totalUniverseCount,
}: SidebarSummaryProps) {
  return (
    <aside className="space-y-6">
      {/* Scope Switcher */}
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-display text-xs font-semibold tracking-wide text-slate-500">
          Universe Scope
        </h2>
        <div
          role="group"
          aria-label="Universe screening scope"
          className="mt-3 grid grid-cols-2 gap-1 rounded-md bg-slate-100 p-1"
        >
          <button
            type="button"
            onClick={() => {
              onScopeChange('top10');
              if (activeTab !== 'rankings') onSelectTab('rankings');
            }}
            aria-pressed={scope === 'top10'}
            className={`min-h-9 rounded px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-blue-700 ${
              scope === 'top10'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Top 10
          </button>
          <button
            type="button"
            onClick={() => {
              onScopeChange('all');
              if (activeTab !== 'rankings') onSelectTab('rankings');
            }}
            aria-pressed={scope === 'all'}
            className={`min-h-9 rounded px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-blue-700 ${
              scope === 'all'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All {totalUniverseCount}
          </button>
        </div>
        <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
          Equities with risk score &ge; 80 are automatically excluded from rankings.
        </p>
      </section>

      {/* Sector Filter */}
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xs font-semibold tracking-wide text-slate-500">
            Sector Filter
          </h2>
          {selectedSector !== 'All' && (
            <button
              type="button"
              onClick={() => onSelectSector('All')}
              className="text-xs font-medium text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              Reset
            </button>
          )}
        </div>
        <div className="mt-2.5 space-y-0.5">
          {sectors.map((sector) => {
            const isSelected = selectedSector === sector;
            const count = sector === 'All' ? totalUniverseCount : (sectorCounts[sector] ?? 0);
            return (
              <button
                key={sector}
                type="button"
                onClick={() => {
                  onSelectSector(sector);
                  if (activeTab !== 'rankings') onSelectTab('rankings');
                }}
                aria-pressed={isSelected}
                className={`flex min-h-9 w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-blue-700 ${
                  isSelected
                    ? 'bg-slate-900 font-medium text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <span className="truncate">{sector}</span>
                <span
                  className={`font-mono text-xs tabular-nums ${
                    isSelected ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Model Weights */}
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-display text-xs font-semibold tracking-wide text-slate-500">
          Scoring Weights
        </h2>
        <dl className="mt-3 divide-y divide-slate-100">
          {PILLAR_WEIGHTS.map((pillar) => (
            <div key={pillar.name} className="py-2 first:pt-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-xs font-medium text-slate-800">{pillar.name}</dt>
                <dd className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
                  {pillar.weight}
                </dd>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">{pillar.factors}</p>
            </div>
          ))}
        </dl>
      </section>
    </aside>
  );
}
