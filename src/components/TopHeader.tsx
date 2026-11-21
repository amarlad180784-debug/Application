import { RefreshCw } from 'lucide-react';

export type ActiveTab = 'rankings' | 'factors' | 'security';

interface TopHeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const NAV_ITEMS: readonly { id: ActiveTab; label: string }[] = [
  { id: 'rankings', label: 'Rankings' },
  { id: 'factors', label: '200 Factors' },
  { id: 'security', label: 'Security' },
];

export function TopHeader({
  activeTab,
  onSelectTab,
  onRefresh,
  isRefreshing,
}: TopHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-3.5 sm:px-6 lg:flex-nowrap lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#rankings"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('rankings');
          }}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          Stock Growth 200
        </a>

        {/* Zone 3 on mobile right, Zone 2 on desktop middle */}
        <div className="order-2 shrink-0 lg:order-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Rankings'}</span>
          </button>
        </div>

        {/* Zone 2: Concise single-line text navigation */}
        <nav
          aria-label="Primary navigation"
          className="order-3 flex w-full items-center gap-6 border-t border-slate-100 pt-2.5 lg:order-2 lg:w-auto lg:border-t-0 lg:pt-0"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
                  isActive
                    ? 'text-slate-950'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[11px] h-0.5 bg-blue-700 lg:-bottom-[15px]"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
