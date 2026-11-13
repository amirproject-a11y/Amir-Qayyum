import { useMemo, useState } from 'react';
import { MessageSquare, Plus, Search } from 'lucide-react';
import type { InquiryCategory, MachineryCategory, MachineryItem, PageId } from '../types';
import { resolveAssetUrl } from '../utils/assets';
import { MechanicalGears } from './MechanicalGears';
import { SmartImage } from './SmartImage';

interface MachineryPageProps {
  machinery: MachineryItem[];
  onSelectQuoteCategory: (category: InquiryCategory, prefillNote?: string) => void;
  onNavigate: (page: PageId) => void;
}

const CATEGORIES: ('All' | MachineryCategory)[] = [
  'All',
  'Blow Molding',
  'Injection Molding',
  'RO & Water Plants',
  'Packaging & Printing',
  'Spare Parts & Molds',
];

export function MachineryPage({
  machinery,
  onSelectQuoteCategory,
  onNavigate,
}: MachineryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | MachineryCategory>('All');
  const [listingType, setListingType] = useState<'All' | 'For Sale' | 'Wanted'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return machinery.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (listingType !== 'All' && item.listingType !== listingType) return false;
      if (q) {
        const hay = `${item.title} ${item.description} ${item.location} ${item.capacitySpec}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [machinery, selectedCategory, listingType, searchQuery]);

  return (
    <div>
      {/* Executive Dark Header with Precision Engineering Gears */}
      <section className="relative bg-slate-950 text-white border-b border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2.5">
              <MechanicalGears variant="inline" />
              <p className="text-xs font-semibold text-red-400 tracking-wide">
                Buy &amp; Sell Equipment Portal
              </p>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
              Industrial Machinery, Bottling Lines &amp; Verified Spare Parts
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Browse inspected machinery available for immediate commissioning or submit a sourcing requirement. Authorized staff can upload new equipment directly from the Admin Studio.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="hidden lg:block">
              <MechanicalGears variant="schematic" />
            </div>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Machinery</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 space-y-8">
        {/* Filter Toolbar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search machines, capacity, molds, location..."
                aria-label="Search machinery"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start lg:self-auto">
              {(['All', 'For Sale', 'Wanted'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setListingType(type)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    listingType === type
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono tabular-nums">
            Showing {filtered.length} of {machinery.length} listings
          </span>
          {(selectedCategory !== 'All' || listingType !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setListingType('All');
                setSearchQuery('');
              }}
              className="text-red-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Machinery Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <p className="font-display text-lg font-bold text-slate-950">
              No matching machinery found
            </p>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Try clearing your filters or submit a custom sourcing request for specific industrial lines.
            </p>
            <button
              type="button"
              onClick={() => onSelectQuoteCategory('Machinery Purchase', 'Custom machine sourcing request')}
              className="px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-semibold transition-colors"
            >
              Request Custom Sourcing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const waText = encodeURIComponent(
                `Hello Enverto Solutions, I am inquiring about: ${item.title} (Listed Price: PKR ${item.pricePkr.toLocaleString('en-US')}).`
              );
              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200"
                >
                  <div>
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                      <SmartImage
                        src={resolveAssetUrl(item.imageKey, item.imageDataUrl)}
                        alt={item.title}
                        fallbackTitle={item.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-slate-500">
                          {item.category} · {item.condition} · {item.listingType}
                        </p>
                        <MechanicalGears variant="inline" />
                      </div>

                      <h2 className="font-display text-lg font-bold text-slate-950 leading-snug">
                        {item.title}
                      </h2>

                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>

                      <dl className="pt-3 space-y-1.5 text-xs border-t border-slate-100">
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-500">Capacity</dt>
                          <dd className="text-slate-900 font-semibold text-right">{item.capacitySpec}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-500">Power / Spec</dt>
                          <dd className="text-slate-900 font-semibold text-right">{item.powerSpec}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-500">Location</dt>
                          <dd className="text-slate-900 font-medium text-right">{item.location}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-200 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500">
                        {item.listingType === 'Wanted' ? 'Target Budget' : 'Asking Price'}
                      </span>
                      <span className="font-mono tabular-nums text-base font-bold text-slate-950">
                        PKR {item.pricePkr.toLocaleString('en-US')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectQuoteCategory(
                            'Machinery Purchase',
                            `Machine Inquiry: ${item.title} (PKR ${item.pricePkr.toLocaleString('en-US')})`
                          )
                        }
                        className="px-3 py-2.5 rounded-lg bg-slate-950 hover:bg-red-700 text-white text-xs font-semibold transition-colors whitespace-nowrap"
                      >
                        Inquire Now
                      </button>

                      <a
                        href={`https://wa.me/923339278655?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors whitespace-nowrap"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
