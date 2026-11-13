import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import type { PageId } from '../types';
import { OFFICIAL_LOGO_URL } from '../utils/assets';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'machinery', label: 'Machinery' },
  { id: 'projects', label: 'Smart Projects' },
];

export function Navbar({ activePage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Prominent Official Logo + Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="flex items-center gap-3.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 rounded-lg py-1"
        >
          <img
            src={OFFICIAL_LOGO_URL}
            alt="Enverto Solutions Official Logo"
            referrerPolicy="no-referrer"
            className="h-12 w-12 sm:h-13 sm:w-13 object-contain rounded-lg bg-white border border-slate-200 p-1 shadow-xs shrink-0"
          />
          <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 whitespace-nowrap shrink-0">
            Enverto Solutions
          </span>
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 rounded ${
                  isActive
                    ? 'text-red-700'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-red-700 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('quote')}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-xs transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-700"
          >
            <span>Request Quote</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1 shadow-lg">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-3.5 min-h-[44px] rounded-lg text-sm font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-red-50 text-red-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="text-xs text-red-700 font-semibold">Active</span>}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleNav('quote')}
              className="w-full min-h-[44px] px-4 py-2.5 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors"
            >
              Request Quote &amp; Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
