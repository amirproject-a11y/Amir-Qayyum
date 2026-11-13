import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Cpu,
  Factory,
  MessageSquare,
  Package,
  Printer,
  ShieldCheck,
  Sun,
  Wrench,
} from 'lucide-react';
import { motion } from 'motion/react';
import type {
  InquiryCategory,
  MachineryItem,
  MarketRates,
  PageId,
  SmartProject,
} from '../types';
import { ASSET_MAP, OFFICIAL_LOGO_URL, resolveAssetUrl } from '../utils/assets';
import { MarketTicker } from './MarketTicker';
import { MechanicalGears } from './MechanicalGears';
import { SmartImage } from './SmartImage';

interface HomePageProps {
  rates: MarketRates | null;
  ratesLoading: boolean;
  onRefreshRates: () => void;
  machinery: MachineryItem[];
  projects: SmartProject[];
  onNavigate: (page: PageId) => void;
  onSelectQuoteCategory: (category: InquiryCategory, prefillNote?: string) => void;
}

const CORE_DIVISIONS: {
  number: string;
  title: string;
  category: InquiryCategory;
  summary: string;
  deliverables: string[];
  icon: typeof Factory;
  featured?: boolean;
  imageUrl?: string;
  span?: string;
}[] = [
  {
    number: '01',
    title: 'Industrial & Technical Consultancy',
    category: 'Machinery Purchase',
    summary:
      'Complete financial feasibility studies, plant layout CAD, utility sizing, and machinery procurement for small, medium, and large-scale manufacturing facilities.',
    deliverables: ['Feasibility & ROI Modeling', 'Factory Layout Engineering', 'Vendor Audits'],
    icon: Factory,
    featured: true,
    span: 'lg:col-span-2',
  },
  {
    number: '02',
    title: 'Electrical & Mechanical Maintenance',
    category: 'Electrical & Mechanical Maintenance',
    summary:
      'Contract and project-based industrial maintenance deploying certified technicians, electrical, and electronics engineers with genuine spare parts.',
    deliverables: ['Annual AMC Contracts', 'PLC & VFD Diagnostics', 'OEM Spare Parts'],
    icon: Wrench,
  },
  {
    number: '03',
    title: 'Plastic, PET Packaging & Co-Packing',
    category: 'Co-Packing & PET Bottles',
    summary:
      'Injection molding, stretch blow molding, precision molds, PET bottles, closures, and licensed third-party Co-Filling & Co-Packing.',
    deliverables: ['PET Bottles & Caps', 'Custom CNC Molds', 'Contract Co-Filling'],
    icon: Package,
    imageUrl: ASSET_MAP.injection_molding,
  },
  {
    number: '04',
    title: 'Industrial Printing & Labeling',
    category: 'Co-Packing & PET Bottles',
    summary:
      'High-definition PVC labels, heat-shrink sleeve labels, and commercial UVDTF industrial transfer printing.',
    deliverables: ['Heat-Shrink Sleeves', 'PVC Roll Labels', 'UVDTF Printing'],
    icon: Printer,
  },
  {
    number: '05',
    title: 'Solar & Renewable Energy EPC',
    category: 'Solar System Costing',
    summary:
      'Commercial and industrial On-Grid & Off-Grid solar installations with full kW load costing and net-metering engineering.',
    deliverables: ['Industrial On-Grid', 'Off-Grid & Hybrid', 'Load Costing & ROI'],
    icon: Sun,
    imageUrl: ASSET_MAP.solar_industrial,
  },
  {
    number: '06',
    title: 'Industrial Real Estate (KPEZDMC)',
    category: 'KPEZDMC / Hattar Plot',
    summary:
      'Acquisition, sale, and leasing of verified industrial plots inside Hattar Special Economic Zone and regional industrial estates.',
    deliverables: ['Hattar SEZ Plots', 'Factory Shed Leases', 'Allotment Advisory'],
    icon: Building2,
  },
  {
    number: '07',
    title: 'Custom Product Design & Tooling',
    category: 'Custom Product Design',
    summary:
      '3D CAD product engineering, CNC aluminum mold fabrication, functional prototyping, and commercial manufacturing ramp-up.',
    deliverables: ['3D CAD Prototyping', 'CNC Aluminum Tooling', 'Pilot Batch Runs'],
    icon: Cpu,
    span: 'lg:col-span-2',
  },
];

const CORPORATE_CLIENTS = [
  { name: 'AHI Group', scope: 'Project Coordination (2006)' },
  { name: 'Habib Gulzar Afghanistan', scope: 'Regional Industrial Systems' },
  { name: 'Batelco / Viva Bahrain', scope: 'Telecom & Power Infrastructure' },
  { name: 'KPEZDMC Hattar SEZ', scope: 'Industrial Estate & Plots' },
  { name: 'Chinese Steel & Mining', scope: 'Balochistan Heavy Projects' },
  { name: 'AQUALIN Haripur (2024)', scope: 'KPFA · Halal · PSQCA Plant' },
];

export function HomePage({
  rates,
  ratesLoading,
  onRefreshRates,
  machinery,
  projects,
  onNavigate,
  onSelectQuoteCategory,
}: HomePageProps) {
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickCategory, setQuickCategory] = useState<InquiryCategory>('Machinery Purchase');
  const [quickMessage, setQuickMessage] = useState('');
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickResult, setQuickResult] = useState<{ ref: string } | null>(null);
  const [quickError, setQuickError] = useState<string | null>(null);

  const handleQuickSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setQuickError(null);
    if (!quickName.trim() || !quickPhone.trim()) {
      setQuickError('Please enter your full name and phone or WhatsApp number.');
      return;
    }
    setQuickSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: quickName,
          phone: quickPhone,
          category: quickCategory,
          message: quickMessage || 'Quick callback request from Home Page.',
          details: { Source: 'Home Quick Inquiry' },
        }),
      });
      if (!res.ok) {
        throw new Error('Could not submit inquiry.');
      }
      const created = (await res.json()) as { referenceCode: string };
      setQuickResult({ ref: created.referenceCode });
      setQuickName('');
      setQuickPhone('');
      setQuickMessage('');
    } catch {
      setQuickError('Unable to reach server. Please contact us directly on WhatsApp.');
    } finally {
      setQuickSubmitting(false);
    }
  };

  return (
    <div>
      {/* 1. Corporate Hero Showcase with Large Official Brand Plate & Engineering Gears */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        {/* Blueprint Architectural Grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-red-700/15 blur-3xl pointer-events-none"
        />

        {/* Interlocking Mechanical Gears Schematic */}
        <div className="hidden xl:block absolute right-8 bottom-8 opacity-75">
          <MechanicalGears variant="schematic" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-14 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Copy Column with Prominent Logo Lockup */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-center space-y-6"
            >
              {/* Large Corporate Logo Emblem */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white p-2 shadow-xl border border-slate-700 flex items-center justify-center shrink-0">
                  <img
                    src={OFFICIAL_LOGO_URL}
                    alt="Enverto Solutions Official Corporate Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-white">
                    ENVERTO SOLUTIONS
                  </p>
                  <p className="text-xs sm:text-sm text-amber-400 font-semibold">
                    Established 2009 · Engineering Since 2006
                  </p>
                  <p className="text-xs text-slate-400">
                    Peshawar Head Office · Haripur Manufacturing Plant
                  </p>
                </div>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.08] [text-wrap:balance]">
                Industrial Engineering, Turnkey Plants &amp; Smart Business Consultancy
              </h1>

              <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                Led by CEO Amir Qayyum, we engineer, supply, and maintain complete PET packaging lines, mineral water bottling plants, commercial solar arrays, industrial machinery, and 5–20 Lakh PKR turnkey investor projects.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectQuoteCategory('Machinery Purchase')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-sm font-semibold shadow-lg shadow-red-950/50 transition-colors whitespace-nowrap"
                >
                  <span>Request Turnkey Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('machinery')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-100 text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <MechanicalGears variant="inline" />
                  <span>Explore Machinery Portal</span>
                </button>
              </div>
            </motion.div>

            {/* Right Dominant 16:9 Industrial Plant Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex"
            >
              <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl min-h-[300px] lg:min-h-[440px]">
                <SmartImage
                  src={ASSET_MAP.hero_plant}
                  alt="Automated mineral water and PET bottling production line engineered by Enverto Solutions"
                  fallbackTitle="Enverto Turnkey PET & Bottling Plant"
                  className="w-full h-full object-cover lg:h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/25 to-transparent flex flex-col justify-end p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-amber-400">
                        Haripur Plant Flagship · KPFA · Halal · PSQCA Licensed (2024)
                      </p>
                      <p className="font-display text-lg sm:text-xl font-bold text-white mt-1">
                        AQUALIN Mineral Water &amp; PET Plastic Industry
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 4-Column Corporate KPI Strip */}
          <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <p className="font-mono tabular-nums text-2xl font-bold text-white">20+ Years</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">Engineering Leadership</p>
              <p className="text-xs text-slate-400 mt-1">
                Active since 2006 across plants, mining &amp; telecom infrastructure
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <p className="font-mono tabular-nums text-2xl font-bold text-amber-400">
                5 – 20 Lakh PKR
              </p>
              <p className="text-sm font-semibold text-slate-200 mt-1">Smart Business Ventures</p>
              <p className="text-xs text-slate-400 mt-1">
                Ready-to-launch micro-industrial feasibilities with PDF plans
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <p className="font-display text-lg font-bold text-white">
                AHI · Habib Gulzar · Batelco
              </p>
              <p className="text-sm font-semibold text-slate-200 mt-1">Enterprise Track Record</p>
              <p className="text-xs text-slate-400 mt-1">
                Plus Viva Bahrain, KPEZDMC &amp; Balochistan Steel/Mining
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <p className="font-display text-lg font-bold text-white">
                KPFA · Halal · PSQCA
              </p>
              <p className="text-sm font-semibold text-slate-200 mt-1">Certified Turnkey Plants</p>
              <p className="text-xs text-slate-400 mt-1">
                Third-party Co-Filling, Co-Packing &amp; Hattar SEZ advisory
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Currency & Gold Market Desk */}
      <MarketTicker rates={rates} loading={ratesLoading} onRefresh={onRefreshRates} />

      {/* 3. Industrial Machinery & Equipment Showcase (With Precision Gears & Spec Tables) */}
      <section className="bg-white border-b border-slate-200 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <MechanicalGears variant="inline" />
                <span className="text-xs font-semibold text-red-700 tracking-wide">
                  Equipment &amp; Parts Engineering Desk
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
                Industrial Machinery Ready for Commissioning
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('machinery')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-950 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              <span>Browse Full Machinery Portal ({machinery.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {machinery.slice(0, 3).map((item) => {
              const waText = encodeURIComponent(
                `Hello Enverto Solutions, I am inquiring about: ${item.title} (PKR ${item.pricePkr.toLocaleString('en-US')}).`
              );
              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200"
                >
                  <div>
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                      <SmartImage
                        src={resolveAssetUrl(item.imageKey, item.imageDataUrl)}
                        alt={item.title}
                        fallbackTitle={item.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-slate-500">
                          {item.category} · {item.condition}
                        </span>
                        <MechanicalGears variant="inline" />
                      </div>

                      <h3 className="font-display text-lg font-bold text-slate-950 leading-snug line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Structured Technical Specification Table */}
                      <dl className="grid grid-cols-1 gap-2 pt-3 border-t border-slate-100 text-xs">
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-500">Output Capacity</dt>
                          <dd className="text-slate-900 font-semibold text-right">{item.capacitySpec}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-500">Power Load</dt>
                          <dd className="text-slate-900 font-semibold text-right">{item.powerSpec}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-500">Yard / Plant</dt>
                          <dd className="text-slate-900 font-medium text-right">{item.location}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500">Unit Price</span>
                      <span className="font-mono tabular-nums text-base font-bold text-slate-950">
                        PKR {item.pricePkr.toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectQuoteCategory(
                            'Machinery Purchase',
                            `Machine Inquiry: ${item.title} (PKR ${item.pricePkr.toLocaleString('en-US')})`
                          )
                        }
                        className="px-3 py-2 rounded-lg bg-slate-950 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                      >
                        Inquire Now
                      </button>
                      <a
                        href={`https://wa.me/923339278655?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
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
        </div>
      </section>

      {/* 4. Seven Integrated Corporate Service Divisions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold text-red-700 tracking-wide">
              Turnkey Engineering Scope
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight mt-1 [text-wrap:balance]">
              Seven Core Industrial &amp; Consultancy Divisions
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-red-700 transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <span>Detailed technical specifications</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_DIVISIONS.map((service) => {
            const Icon = service.icon;
            const isDarkFeatured = Boolean(service.featured);
            return (
              <div
                key={service.number}
                className={`rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                  isDarkFeatured
                    ? 'bg-slate-950 text-white border border-slate-800 shadow-xl'
                    : 'bg-white text-slate-900 border border-slate-200 hover:border-slate-300 hover:shadow-md'
                } ${service.span ?? ''}`}
              >
                {service.imageUrl && (
                  <div className="h-40 bg-slate-100 overflow-hidden border-b border-slate-200">
                    <SmartImage
                      src={service.imageUrl}
                      alt={service.title}
                      fallbackTitle={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span
                        className={`font-mono tabular-nums text-xs font-bold ${
                          isDarkFeatured ? 'text-amber-400' : 'text-slate-500'
                        }`}
                      >
                        Division {service.number}
                      </span>
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isDarkFeatured
                            ? 'bg-red-700/20 text-red-400 border border-red-700/30'
                            : 'bg-red-50 text-red-700 border border-red-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3
                      className={`font-display text-xl font-bold ${
                        isDarkFeatured ? 'text-white' : 'text-slate-950'
                      }`}
                    >
                      {service.title}
                    </h3>

                    <p
                      className={`text-sm leading-relaxed mt-2.5 ${
                        isDarkFeatured ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {service.summary}
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-1.5">
                      {service.deliverables.map((d) => (
                        <div
                          key={d}
                          className={`text-xs font-medium flex items-center gap-2 ${
                            isDarkFeatured ? 'text-slate-200' : 'text-slate-700'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isDarkFeatured ? 'text-amber-400' : 'text-red-700'
                            }`}
                          />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`mt-6 pt-4 border-t flex items-center justify-between gap-4 ${
                      isDarkFeatured ? 'border-slate-800' : 'border-slate-100'
                    }`}
                  >
                    <span
                      className={`text-xs ${
                        isDarkFeatured ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Turnkey Delivery
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onSelectQuoteCategory(service.category, `Interested in ${service.title}`)
                      }
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                        isDarkFeatured
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-red-700 hover:text-red-800'
                      }`}
                    >
                      <span>Request Quote</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Smart Business Projects Showcase (5 - 20 Lakh PKR) */}
      <section className="bg-slate-100/90 border-y border-slate-200 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-red-700 tracking-wide">
                Small-Investor Turnkey Blueprints
              </p>
              <h2 className="font-display text-3xl font-bold text-slate-950 tracking-tight mt-1">
                Smart Business Projects (5 – 20 Lakh PKR)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 hover:text-red-700 transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              <span>View all {projects.length} investment plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((proj) => (
              <article
                key={proj.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="h-36 bg-slate-900 overflow-hidden relative">
                    <SmartImage
                      src={resolveAssetUrl(proj.imageKey)}
                      alt={proj.title}
                      fallbackTitle={proj.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end justify-between p-4">
                      <span className="text-xs font-medium text-slate-200">{proj.sector}</span>
                      <span className="font-mono tabular-nums text-sm font-bold text-amber-300">
                        {proj.investmentLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-display text-lg font-bold text-slate-950">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {proj.summary}
                    </p>
                    <dl className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <dt className="text-slate-500">Est. Monthly Net</dt>
                        <dd className="font-mono tabular-nums font-bold text-slate-900 mt-0.5">
                          {proj.estimatedMonthlyProfitPkr}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Payback Period</dt>
                        <dd className="font-semibold text-slate-900 mt-0.5">{proj.paybackMonths}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-600 font-medium">{proj.spaceRequired}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('projects')}
                    className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold whitespace-nowrap transition-colors"
                  >
                    Download PDF Plan
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Corporate Clients & Leadership Provenance */}
      <section className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-red-700">
              <Award className="w-5 h-5" />
              <span className="text-xs font-semibold tracking-wide">
                Corporate Credibility Since 2006
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-slate-950 tracking-tight [text-wrap:balance]">
              Executive Engineering Track Record Across Pakistan, Afghanistan &amp; Bahrain
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Directed by CEO Amir Qayyum—spanning AHI Group project coordination (2006), Enverto founding (2009), Managing Director at TnH Builders, Chinese Steel &amp; Mining project management in Balochistan, and AQUALIN Mineral Water &amp; PET Plastic Industry (Haripur, 2024).
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
              >
                <span>View Full CEO &amp; Company Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CORPORATE_CLIENTS.map((client) => (
              <div
                key={client.name}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-700 shrink-0" />
                  <p className="font-display text-sm font-bold text-slate-950">{client.name}</p>
                </div>
                <p className="text-xs text-slate-600">{client.scope}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Quick Inquiry & Direct WhatsApp Conversion Band */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start shadow-xl">
          <div className="lg:col-span-5 space-y-5">
            <p className="text-xs font-semibold text-red-400 tracking-wide">
              Direct Engineering Desk
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight [text-wrap:balance]">
              Start Your Plant Feasibility, Solar Costing, or Machinery Quote
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Submit your brief here for a same-day engineering callback, or speak directly with our Peshawar and Haripur project desk via WhatsApp.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-300">
              <p>
                <strong className="text-white">Peshawar Office:</strong> Office 220, Block A, Pirano Market, Karkhano, Hayatabad, Peshawar.
              </p>
              <p>
                <strong className="text-white">Haripur Plant:</strong> AQUALIN Mineral Water &amp; PET Plastic Industry, Haripur.
              </p>
              <p className="font-mono tabular-nums">
                <strong className="text-white font-sans">Direct Line:</strong> +92-333-9278655 · amir.project@gmail.com
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://wa.me/923339278655?text=Hello%20Enverto%20Solutions%2C%20I%20would%20like%20to%20discuss%20an%20industrial%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Engineering Desk</span>
              </a>

              <button
                type="button"
                onClick={() => onNavigate('quote')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <span>Open Detailed Smart Form</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-display text-lg font-bold text-slate-950 mb-1">
              Quick Inquiry Request
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Need a detailed category questionnaire? Use the Request Quote button in the top bar.
            </p>

            {quickResult ? (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Inquiry Recorded — Reference {quickResult.ref}</span>
                </div>
                <p className="text-xs text-emerald-700">
                  Our engineering team has received your callback request and will contact you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setQuickResult(null)}
                  className="text-xs font-semibold text-emerald-900 underline mt-1"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="space-y-4">
                {quickError && (
                  <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {quickError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quick-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="quick-name"
                      type="text"
                      required
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      placeholder="e.g., Tariq Mehmood"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="quick-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      id="quick-phone"
                      type="tel"
                      required
                      value={quickPhone}
                      onChange={(e) => setQuickPhone(e.target.value)}
                      placeholder="+92-3XX-XXXXXXX"
                      className="w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quick-category" className="block text-xs font-semibold text-slate-700 mb-1">
                    Service or Requirement Category
                  </label>
                  <select
                    id="quick-category"
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value as InquiryCategory)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-700"
                  >
                    <option value="Machinery Purchase">Machinery Purchase</option>
                    <option value="Co-Packing & PET Bottles">Co-Packing &amp; PET Bottles</option>
                    <option value="Solar System Costing">Solar System Costing</option>
                    <option value="KPEZDMC / Hattar Plot">KPEZDMC / Hattar Plot</option>
                    <option value="Electrical & Mechanical Maintenance">Electrical &amp; Mechanical Maintenance</option>
                    <option value="Smart Business Project">Smart Business Project (5–20 Lakh)</option>
                    <option value="Custom Product Design">Custom Product Design</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quick-msg" className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Scope or Machine Requirement
                  </label>
                  <textarea
                    id="quick-msg"
                    rows={3}
                    value={quickMessage}
                    onChange={(e) => setQuickMessage(e.target.value)}
                    placeholder="Briefly describe your target capacity, city, or budget..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={quickSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {quickSubmitting ? 'Submitting...' : 'Send Quick Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
