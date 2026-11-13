import {
  ArrowRight,
  Building2,
  Check,
  Cpu,
  Factory,
  Package,
  Printer,
  Sun,
  Wrench,
} from 'lucide-react';
import type { InquiryCategory } from '../types';
import { ASSET_MAP } from '../utils/assets';
import { SmartImage } from './SmartImage';

interface ServicesPageProps {
  onSelectQuoteCategory: (category: InquiryCategory, prefillNote?: string) => void;
}

const SERVICES_CATALOG: {
  id: string;
  number: string;
  title: string;
  quoteCategory: InquiryCategory;
  overview: string;
  scopeItems: string[];
  idealFor: string;
  icon: typeof Factory;
  imageUrl?: string;
}[] = [
  {
    id: 'consultancy',
    number: '01',
    title: 'Industrial & Technical Consultancy',
    quoteCategory: 'Machinery Purchase',
    overview:
      'Comprehensive technical and financial feasibility studies for small, medium, and large-scale industrial ventures. We evaluate raw material supply chains, machinery specifications, utility loads, and realistic payback horizons before you commit capital.',
    scopeItems: [
      'Complete Plant Feasibility Reports & CAPEX/OPEX Modeling',
      'Machinery Selection, Vendor Vetting & Factory Layout CAD',
      'KPFA, PSQCA & Halal Regulatory Compliance Roadmaps',
      'End-to-End Turnkey Commissioning & Operator Training',
    ],
    idealFor: 'New Industrial Investors · SMEs · Factory Expansions',
    icon: Factory,
  },
  {
    id: 'maintenance',
    number: '02',
    title: 'Electrical & Mechanical Maintenance',
    quoteCategory: 'Electrical & Mechanical Maintenance',
    overview:
      'Reliable contract-based and project-based industrial maintenance teams. We deploy experienced mechanical technicians, industrial electricians, and electronics/PLC engineers complete with verified spare parts.',
    scopeItems: [
      'Annual Preventive Maintenance Contracts (AMC)',
      'Emergency Breakdown Recovery & Line Overhauling',
      'PLC, VFD, Servo Drive & Control Panel Troubleshooting',
      'Genuine Mechanical, Pneumatic & Electrical Spare Parts Supply',
    ],
    idealFor: 'Bottling Plants · Plastic Factories · Commercial Facilities',
    icon: Wrench,
  },
  {
    id: 'packaging',
    number: '03',
    title: 'Plastic, PET Packaging & Co-Packing Solutions',
    quoteCategory: 'Co-Packing & PET Bottles',
    overview:
      'Full-spectrum polymer processing and contract packaging—covering injection molding, stretch blow molding, custom bottle molds, PET bottles, HDPE caps, and third-party Co-Filling & Co-Packing at our Haripur facility.',
    scopeItems: [
      'PET Bottle Blowing (250ml, 500ml, 1000ml, 1500ml, 5L)',
      'Injection Molded Tamper-Evident Caps & Closures',
      'Custom Blow & Injection Mold Fabrication',
      'Licensed Third-Party Beverage & Water Co-Filling / Co-Packing',
    ],
    idealFor: 'Water & Beverage Brands · Food Oils · Agro/Chemical Packers',
    icon: Package,
    imageUrl: ASSET_MAP.injection_molding,
  },
  {
    id: 'printing',
    number: '04',
    title: 'Industrial Printing & Labeling Solutions',
    quoteCategory: 'Co-Packing & PET Bottles',
    overview:
      'Durable, high-clarity product branding and commercial industrial printing engineered to withstand moisture, refrigeration, and transit handling.',
    scopeItems: [
      'High-Gloss PVC & BOPP Roll-Fed Bottle Labels',
      '360-Degree Contoured Heat-Shrink Sleeve Labels',
      'Industrial UVDTF Transfer Printing for Rigid Surfaces',
      'Pre-Press Artwork Separation & Cylinder Coordination',
    ],
    idealFor: 'FMCG Brands · Mineral Water Bottlers · Cosmetics & Lubricants',
    icon: Printer,
  },
  {
    id: 'solar',
    number: '05',
    title: 'Solar & Renewable Energy Systems',
    quoteCategory: 'Solar System Costing',
    overview:
      'Engineered On-Grid and Off-Grid solar power systems tailored for factories, cold storages, commercial plazas, and tube wells—delivering accurate kW sizing, structural mounting, and fast tariff payback.',
    scopeItems: [
      'Industrial On-Grid Net-Metering Plants (25 kW to 1 MW+)',
      'Off-Grid & Hybrid Battery-Backed Systems for Critical Loads',
      'Complete Energy Audit, Shading Analysis & Costing Proposal',
      'Tier-1 Bi-Facial PV Modules, Inverters & DC/AC Protection',
    ],
    idealFor: 'Manufacturing Units · Commercial Buildings · Farms',
    icon: Sun,
    imageUrl: ASSET_MAP.solar_industrial,
  },
  {
    id: 'realestate',
    number: '06',
    title: 'Industrial Real Estate (KPEZDMC / Hattar SEZ)',
    quoteCategory: 'KPEZDMC / Hattar Plot',
    overview:
      'Specialized industrial brokerage and project facilitation inside KPEZDMC estates, particularly Hattar Special Economic Zone—helping investors buy, sell, or lease verified industrial land and sheds.',
    scopeItems: [
      'Verified Industrial Plot Sale, Purchase & Leasing in Hattar SEZ',
      'Pre-Built Factory Sheds & Warehouse Sourcing',
      'KPEZDMC Allotment, Transfer & Utility Connection Guidance',
      'Site Feasibility Assessment (Gas, Grid Power & Road Access)',
    ],
    idealFor: 'Industrialists · Export Manufacturers · Logistics Warehouses',
    icon: Building2,
  },
  {
    id: 'custom-design',
    number: '07',
    title: 'Custom Product Design & Contract Manufacturing',
    quoteCategory: 'Custom Product Design',
    overview:
      'From raw concept to shelf-ready commercial unit. Our engineering team handles 3D CAD prototyping, packaging ergonomics, CNC mold tooling, and pilot production runs.',
    scopeItems: [
      '3D Industrial CAD Design & Functional Prototyping',
      'Material Selection (PET, HDPE, PP, Stainless Steel Assemblies)',
      'CNC Aluminum & Steel Tooling / Mold Production',
      'Pilot Batch Validation & Commercial Scale-Up',
    ],
    idealFor: 'Product Entrepreneurs · Private Labels · OEMs',
    icon: Cpu,
  },
];

export function ServicesPage({ onSelectQuoteCategory }: ServicesPageProps) {
  return (
    <div>
      {/* Cohesive Dark Header */}
      <section className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold text-red-400 tracking-wide">
              Capabilities &amp; Technical Divisions
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
              Industrial Services Engineered for Measurable Operational Reliability
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Select any division below to open a pre-configured engineering inquiry with technical parameters tailored to your requirement.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-6">
        {SERVICES_CATALOG.map((service) => {
          const Icon = service.icon;
          return (
            <article
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xs hover:shadow-md transition-shadow duration-200"
            >
              <div
                className={`p-6 sm:p-8 flex flex-col justify-between ${
                  service.imageUrl ? 'lg:col-span-8' : 'lg:col-span-12'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums text-sm font-bold text-red-700">
                        {service.number}.
                      </span>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950">
                        {service.title}
                      </h2>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-red-700" />
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
                    {service.overview}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {service.scopeItems.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-red-700 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-slate-500">
                    Ideal For: {service.idealFor}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectQuoteCategory(
                        service.quoteCategory,
                        `Service Inquiry: ${service.title}`
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-950 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    <span>Request Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {service.imageUrl && (
                <div className="lg:col-span-4 bg-slate-100 border-t lg:border-t-0 lg:border-l border-slate-200 min-h-[220px]">
                  <SmartImage
                    src={service.imageUrl}
                    alt={service.title}
                    fallbackTitle={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
