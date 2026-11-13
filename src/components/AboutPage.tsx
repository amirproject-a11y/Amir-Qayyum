import { Award, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { PageId } from '../types';
import { ASSET_MAP } from '../utils/assets';
import { SmartImage } from './SmartImage';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

const CAREER_TIMELINE = [
  {
    year: '2006',
    role: 'Engineering Career Debut & Project Coordinator — AHI Group',
    summary:
      'Entered the industrial engineering sector as a Project Coordinator at AHI Group, overseeing multi-site technical deployments, electro-mechanical schedules, and vendor procurement.',
  },
  {
    year: '2009',
    role: 'Founder — Enverto Solutions',
    summary:
      'Established Enverto to bridge the gap between industrial machinery sourcing, electrical/mechanical maintenance contracts, and practical feasibility consultancy for regional investors.',
  },
  {
    year: '2012 – 2018',
    role: 'Managing Director — TnH Builders & Regional Telecom Deployments',
    summary:
      'Served as Managing Director (MD) at TnH Builders delivering civil and commercial infrastructure, while executing critical technical projects for Habib Gulzar Afghanistan and Batelco / Viva Bahrain.',
  },
  {
    year: '2019 – 2023',
    role: 'Project Manager — Chinese Steel & Mining Corporation (Balochistan) & KPEZDMC',
    summary:
      'Directed heavy industrial project management in Balochistan alongside Chinese steel and mining operators, plus industrial estate and plot advisory with KPEZDMC (Hattar Special Economic Zone).',
  },
  {
    year: '2024 – Present',
    role: 'Founder — AQUALIN Mineral Water & PET Plastic Industry (Haripur)',
    summary:
      'Commissioned a modern beverage bottling and PET packaging manufacturing facility in Haripur, achieving full regulatory licensing from KPFA, Halal Food Authority, and PSQCA.',
  },
];

const CLIENT_REFERENCES = [
  {
    name: 'AHI Group',
    sector: 'Industrial & Infrastructure Coordination',
  },
  {
    name: 'Habib Gulzar (Afghanistan)',
    sector: 'Cross-Border Beverage & Industrial Systems',
  },
  {
    name: 'Batelco / Viva Bahrain',
    sector: 'Telecom & Power Infrastructure Support',
  },
  {
    name: 'KPEZDMC (Hattar SEZ)',
    sector: 'Industrial Zone Development & Plot Advisory',
  },
  {
    name: 'Chinese Steel & Mining Corp.',
    sector: 'Balochistan Heavy Project Management',
  },
  {
    name: 'TnH Builders',
    sector: 'Turnkey Civil & MEP Contracting',
  },
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div>
      {/* Cohesive Executive Dark Header */}
      <section className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            <p className="text-xs font-semibold text-red-400 tracking-wide">
              Leadership &amp; Corporate Profile
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
              Two Decades of Hands-On Industrial Execution Under CEO Amir Qayyum
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Enverto Solutions is built on 20+ years of commissioning real factories, managing cross-border heavy engineering contracts, and operating our own fully licensed PET plastic and mineral water plant in Haripur.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="font-mono tabular-nums text-xl font-bold text-white">2006</p>
                <p className="text-xs text-slate-400 mt-1">Engineering career started at AHI Group</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="font-mono tabular-nums text-xl font-bold text-white">2009</p>
                <p className="text-xs text-slate-400 mt-1">Enverto founded for turnkey industrial delivery</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="font-mono tabular-nums text-xl font-bold text-amber-400">2024</p>
                <p className="text-xs text-slate-400 mt-1">AQUALIN Haripur Plant licensed &amp; active</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl min-h-[280px]">
              <SmartImage
                src={ASSET_MAP.ro_plant}
                alt="AQUALIN Mineral Water and PET Plastic Industry Haripur Plant"
                fallbackTitle="AQUALIN Haripur Manufacturing Facility"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-14">
        {/* CEO Timeline */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl mb-8">
            <h2 className="font-display text-2xl font-bold text-slate-950">
              CEO Profile: Amir Qayyum — Engineering &amp; Executive Milestones
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Verified track record spanning civil construction, Balochistan mining operations, Gulf &amp; Afghan telecom projects, and automated food-grade manufacturing.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {CAREER_TIMELINE.map((milestone) => (
              <div
                key={milestone.year}
                className="py-6 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-12 gap-4"
              >
                <div className="md:col-span-3">
                  <span className="font-mono tabular-nums text-sm font-bold text-red-700">
                    {milestone.year}
                  </span>
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <h3 className="font-display text-base font-bold text-slate-950">
                    {milestone.role}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {milestone.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AQUALIN 2024 Licensing & Major Clients */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-slate-950 text-white rounded-2xl border border-slate-800 p-8 space-y-5 shadow-lg">
            <div className="flex items-center gap-2.5 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-semibold tracking-wide">
                2024 Flagship Industrial Unit
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold">
              AQUALIN Mineral Water &amp; PET Plastic Industry (Haripur)
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our Haripur plant serves both as our flagship production center and a live demonstration hub for clients evaluating RO water purification, PET blow molding, injection caps, and contract Co-Filling &amp; Co-Packing services.
            </p>

            <ul className="space-y-3 pt-2 text-sm text-slate-200">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>KPFA Licensed (Khyber Pakhtunkhwa Food Authority)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Halal Food Authority Certified Processing</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>PSQCA Standard Compliance (Pakistan Standards &amp; Quality Control Authority)</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-8 space-y-5 shadow-xs">
            <div className="flex items-center gap-2.5 text-slate-700">
              <Award className="w-5 h-5 text-red-700" />
              <span className="text-xs font-semibold tracking-wide">
                Selected Client &amp; Partner Portfolio
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-950">
              Organizations Served Across Pakistan, Afghanistan &amp; Bahrain
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {CLIENT_REFERENCES.map((client) => (
                <div
                  key={client.name}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/90"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-red-700 shrink-0" />
                    <p className="font-display text-sm font-bold text-slate-950">
                      {client.name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{client.sector}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('quote')}
                className="px-5 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-semibold transition-colors"
              >
                Schedule Executive Consultation
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
