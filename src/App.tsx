import { useCallback, useEffect, useMemo, useState } from 'react';
import { TopHeader, type ActiveTab } from './components/TopHeader';
import { SidebarSummary } from './components/SidebarSummary';
import { RankingsView } from './components/RankingsView';
import { FactorsExplorerView } from './components/FactorsExplorerView';
import { SecurityView } from './components/SecurityView';
import { StockAnalysisModal } from './components/StockAnalysisModal';
import {
  DEMO_INDIAN_STOCKS,
  filterAndSortResults,
  getAvailableSectors,
  rankStocks,
  type SortField,
  type StockResult,
} from './lib/scoring';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('rankings');
  const [scope, setScope] = useState<'top10' | 'all'>('top10');
  const [searchText, setSearchText] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [sortBy, setSortBy] = useState<SortField>('score');
  const [selectedStock, setSelectedStock] = useState<StockResult | null>(null);

  const [allUniverseResults, setAllUniverseResults] = useState<StockResult[]>(() =>
    rankStocks(DEMO_INDIAN_STOCKS, { topOnly: false }),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  );

  const refreshFromBackend = useCallback(async () => {
    setIsRefreshing(true);
    setFetchError(null);
    try {
      const response = await fetch('/api/stocks?scope=all');
      if (!response.ok) {
        const errPayload = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errPayload.error || `Backend returned ${response.status}`);
      }
      const data = (await response.json()) as {
        items?: StockResult[];
        generatedAt?: string;
      };
      if (Array.isArray(data.items) && data.items.length > 0) {
        setAllUniverseResults(data.items);
        setLastUpdatedLabel(
          new Date(data.generatedAt || Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        );
      }
    } catch (err: unknown) {
      setFetchError(
        err instanceof Error ? err.message : 'Unable to refresh rankings from backend.',
      );
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshFromBackend();
  }, [refreshFromBackend]);

  const scopedResults = useMemo(() => {
    return scope === 'top10'
      ? allUniverseResults.slice(0, 10)
      : allUniverseResults;
  }, [allUniverseResults, scope]);

  const sectors = useMemo(
    () => getAvailableSectors(allUniverseResults.map((r) => r.stock)),
    [allUniverseResults],
  );

  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of scopedResults) {
      counts[item.stock.sector] = (counts[item.stock.sector] ?? 0) + 1;
    }
    return counts;
  }, [scopedResults]);

  const visibleResults = useMemo(
    () =>
      filterAndSortResults(scopedResults, {
        searchText,
        sector: selectedSector,
        sortBy,
      }),
    [scopedResults, searchText, selectedSector, sortBy],
  );

  function handleResetFilters() {
    setSearchText('');
    setSelectedSector('All');
    setSortBy('score');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onRefresh={() => {
          void refreshFromBackend();
        }}
        isRefreshing={isRefreshing}
      />

      <main className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8">
        {fetchError && (
          <div
            role="alert"
            className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"
          >
            <span>{fetchError}</span>
            <button
              type="button"
              onClick={() => setFetchError(null)}
              className="font-semibold underline whitespace-nowrap"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="order-2 lg:order-1">
            <SidebarSummary
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              scope={scope}
              onScopeChange={setScope}
              sectors={sectors}
              selectedSector={selectedSector}
              onSelectSector={setSelectedSector}
              sectorCounts={sectorCounts}
              totalUniverseCount={allUniverseResults.length}
            />
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            {activeTab === 'rankings' && (
              <RankingsView
                results={visibleResults}
                allResultsCount={scopedResults.length}
                scope={scope}
                searchText={searchText}
                onSearchChange={setSearchText}
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedSector={selectedSector}
                onResetFilters={handleResetFilters}
                onSelectStock={setSelectedStock}
                isLoading={isRefreshing && allUniverseResults.length === 0}
                lastUpdatedLabel={lastUpdatedLabel}
              />
            )}

            {activeTab === 'factors' && <FactorsExplorerView />}

            {activeTab === 'security' && <SecurityView />}
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>Stock Growth 200 · Quantitative Research Workbench</span>
          <span>Demonstration NSE/BSE metrics · Not investment advice or guaranteed returns</span>
        </div>
      </footer>

      {selectedStock && (
        <StockAnalysisModal
          result={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
}
