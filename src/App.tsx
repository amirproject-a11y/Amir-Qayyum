/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { AboutPage } from './components/AboutPage';
import { AdminPage } from './components/AdminPage';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { MachineryPage } from './components/MachineryPage';
import { Navbar } from './components/Navbar';
import { ProjectsPage } from './components/ProjectsPage';
import { QuoteContactPage } from './components/QuoteContactPage';
import { ServicesPage } from './components/ServicesPage';
import type {
  InquiryCategory,
  InquiryRecord,
  MachineryItem,
  MarketRates,
  PageId,
  ProjectLead,
  SmartProject,
} from './types';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [quoteCategory, setQuoteCategory] = useState<InquiryCategory>('Machinery Purchase');
  const [quotePrefillNote, setQuotePrefillNote] = useState<string | undefined>(undefined);

  const [rates, setRates] = useState<MarketRates | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);

  const [machinery, setMachinery] = useState<MachineryItem[]>([]);
  const [projects, setProjects] = useState<SmartProject[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [leads, setLeads] = useState<ProjectLead[]>([]);

  const loadMarketRates = useCallback(async () => {
    setRatesLoading(true);
    try {
      const res = await fetch('/api/market-rates');
      if (res.ok) {
        const data = (await res.json()) as MarketRates;
        setRates(data);
      }
    } catch {
      // Non-blocking fallback
    } finally {
      setRatesLoading(false);
    }
  }, []);

  const loadAppData = useCallback(async () => {
    try {
      const [macRes, projRes, inqRes, leadRes] = await Promise.all([
        fetch('/api/machinery'),
        fetch('/api/projects'),
        fetch('/api/inquiries'),
        fetch('/api/leads'),
      ]);

      if (macRes.ok) setMachinery((await macRes.json()) as MachineryItem[]);
      if (projRes.ok) setProjects((await projRes.json()) as SmartProject[]);
      if (inqRes.ok) setInquiries((await inqRes.json()) as InquiryRecord[]);
      if (leadRes.ok) setLeads((await leadRes.json()) as ProjectLead[]);
    } catch {
      // Preserve existing state on transient error
    }
  }, []);

  useEffect(() => {
    loadMarketRates();
    loadAppData();
  }, [loadMarketRates, loadAppData]);

  const handleSelectQuoteCategory = (category: InquiryCategory, prefillNote?: string) => {
    setQuoteCategory(category);
    setQuotePrefillNote(prefillNote);
    setActivePage('quote');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    if (page === 'admin') {
      loadAppData();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            rates={rates}
            ratesLoading={ratesLoading}
            onRefreshRates={loadMarketRates}
            machinery={machinery}
            projects={projects}
            onNavigate={handleNavigate}
            onSelectQuoteCategory={handleSelectQuoteCategory}
          />
        )}

        {activePage === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {activePage === 'services' && (
          <ServicesPage onSelectQuoteCategory={handleSelectQuoteCategory} />
        )}

        {activePage === 'machinery' && (
          <MachineryPage
            machinery={machinery}
            onSelectQuoteCategory={handleSelectQuoteCategory}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'projects' && (
          <ProjectsPage
            projects={projects}
            onNavigate={handleNavigate}
            onSelectQuoteCategory={handleSelectQuoteCategory}
          />
        )}

        {activePage === 'quote' && (
          <QuoteContactPage
            initialCategory={quoteCategory}
            initialNote={quotePrefillNote}
          />
        )}

        {activePage === 'admin' && (
          <AdminPage
            machinery={machinery}
            projects={projects}
            inquiries={inquiries}
            leads={leads}
            onDataChanged={loadAppData}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Compact Floating WhatsApp Direct Action */}
      <a
        href="https://wa.me/923339278655?text=Hello%20Enverto%20Solutions%2C%20I%20would%20like%20assistance."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Enverto Solutions on WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
      >
        <MessageSquare className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline whitespace-nowrap">WhatsApp</span>
      </a>
    </div>
  );
}
