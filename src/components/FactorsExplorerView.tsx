import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { FACTOR_CATEGORIES, getAllGrowthFactors } from '../lib/factors';

export function FactorsExplorerView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [query, setQuery] = useState('');

  const allFactors = useMemo(() => getAllGrowthFactors(), []);

  const filteredFactors = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allFactors.filter((factor) => {
      const matchesCat =
        selectedCategory === 'all' || factor.categoryId === selectedCategory;
      const matchesQuery =
        q.length === 0 ||
        factor.name.toLowerCase().includes(q) ||
        factor.categoryName.toLowerCase().includes(q) ||
        String(factor.index) === q;
      return matchesCat && matchesQuery;
    });
  }, [allFactors, query, selectedCategory]);

  const activeCategoryMeta = FACTOR_CATEGORIES.find(
    (c) => c.id === selectedCategory,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          200 Growth Factors
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          11 analytical categories spanning company fundamentals, industry structure, monetary liquidity, policy, and event catalysts.
        </p>
      </div>

      {/* Category Summary Grid */}
      <section
        aria-label="Factor categories"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
      >
        {FACTOR_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                setSelectedCategory(isSelected ? 'all' : category.id)
              }
              aria-pressed={isSelected}
              className={`rounded-lg border p-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-blue-700 ${
                isSelected
                  ? 'border-blue-700 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-sm font-semibold">
                  {category.name}
                </span>
                <span
                  className={`font-mono text-xs tabular-nums ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {category.rangeLabel}
                </span>
              </div>
              <p
                className={`mt-1.5 text-xs leading-relaxed ${
                  isSelected ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {category.description}
              </p>
              <div
                className={`mt-2.5 text-[11px] font-medium ${
                  isSelected ? 'text-blue-300' : 'text-blue-700'
                }`}
              >
                {category.pillarWeight}
              </div>
            </button>
          );
        })}
      </section>

      {/* Search & Factor Index Table */}
      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-950">
              {activeCategoryMeta
                ? `${activeCategoryMeta.name} (${activeCategoryMeta.rangeLabel})`
                : 'Complete 200-Factor Index'}
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredFactors.length} of 200 factors
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="min-h-9 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 whitespace-nowrap hover:bg-slate-50"
              >
                Show all 11 categories
              </button>
            )}
            <div className="relative w-full sm:w-72">
              <label htmlFor="factor-search" className="sr-only">
                Filter 200 factors
              </label>
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="factor-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search factor name or #..."
                className="min-h-9 w-full rounded-md border border-slate-200 bg-slate-50 pr-8 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:bg-white focus:outline-none"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear factor search"
                  className="absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredFactors.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-slate-600">
              No factors match "{query}".
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 rounded-md bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFactors.map((factor) => (
              <div
                key={factor.index}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm hover:bg-slate-50/70"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 font-mono text-xs font-medium text-slate-400 tabular-nums">
                    {String(factor.index).padStart(3, '0')}
                  </span>
                  <span className="font-medium text-slate-900">{factor.name}</span>
                </div>
                <div className="text-xs text-slate-500">
                  <span>{factor.categoryName}</span>
                  <span aria-hidden="true"> · </span>
                  <span className={factor.inCoreModel ? 'font-medium text-blue-700' : 'text-slate-400'}>
                    {factor.inCoreModel ? 'Core quantified' : 'Extended research layer'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
