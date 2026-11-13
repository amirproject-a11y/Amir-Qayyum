import { RefreshCw, TrendingUp } from 'lucide-react';
import type { MarketRates } from '../types';

interface MarketTickerProps {
  rates: MarketRates | null;
  loading: boolean;
  onRefresh: () => void;
}

export function MarketTicker({ rates, loading, onRefresh }: MarketTickerProps) {
  const formattedTime = rates?.updatedAt
    ? new Date(rates.updatedAt).toLocaleTimeString('en-PK', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--';

  return (
    <section
      aria-label="Live Currency and Gold Market Rates"
      className="bg-slate-900 text-slate-100 border-y border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-amber-400 font-display font-semibold">
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>Live FX &amp; Bullion Desk</span>
          </div>

          <div className="flex items-center gap-2 font-mono tabular-nums">
            <span className="text-slate-400">USD / PKR</span>
            <span className="font-semibold text-white">
              {rates ? rates.usdPkr.toFixed(2) : '---'}
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>

          <div className="flex items-center gap-2 font-mono tabular-nums">
            <span className="text-slate-400">AED / PKR</span>
            <span className="font-semibold text-white">
              {rates ? rates.aedPkr.toFixed(2) : '---'}
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>

          <div className="flex items-center gap-2 font-mono tabular-nums">
            <span className="text-slate-400">SAR / PKR</span>
            <span className="font-semibold text-white">
              {rates ? rates.sarPkr.toFixed(2) : '---'}
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>

          <div className="flex items-center gap-2 font-mono tabular-nums">
            <span className="text-amber-400">Gold 24K / Tola</span>
            <span className="font-semibold text-amber-300">
              {rates ? `PKR ${rates.gold24kTolaPkr.toLocaleString('en-US')}` : '---'}
            </span>
          </div>

          <span className="text-slate-700 hidden lg:inline" aria-hidden="true">|</span>

          <div className="hidden lg:flex items-center gap-2 font-mono tabular-nums">
            <span className="text-slate-400">Gold 10g</span>
            <span className="font-semibold text-slate-200">
              {rates ? `PKR ${rates.gold24kTenGramPkr.toLocaleString('en-US')}` : '---'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-mono tabular-nums">
            {rates?.source === 'live' ? 'Live Rate' : 'Market Desk'} · {formattedTime}
          </span>
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Refresh market rates"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 bg-slate-800/70 text-slate-200 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </section>
  );
}
