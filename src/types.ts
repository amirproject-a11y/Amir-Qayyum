export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'machinery'
  | 'projects'
  | 'quote'
  | 'admin';

export type InquiryCategory =
  | 'Machinery Purchase'
  | 'Co-Packing & PET Bottles'
  | 'Solar System Costing'
  | 'KPEZDMC / Hattar Plot'
  | 'Electrical & Mechanical Maintenance'
  | 'Smart Business Project'
  | 'Custom Product Design';

export interface MarketRates {
  usdPkr: number;
  aedPkr: number;
  sarPkr: number;
  goldUsdOz: number;
  gold24kTolaPkr: number;
  gold24kTenGramPkr: number;
  updatedAt: string;
  source: 'live' | 'cached' | 'reference';
}

export type MachineryCategory =
  | 'Blow Molding'
  | 'Injection Molding'
  | 'RO & Water Plants'
  | 'Packaging & Printing'
  | 'Spare Parts & Molds';

export interface MachineryItem {
  id: string;
  title: string;
  category: MachineryCategory;
  listingType: 'For Sale' | 'Wanted';
  condition: 'Brand New' | 'Refurbished' | 'Used - Verified';
  pricePkr: number;
  location: string;
  capacitySpec: string;
  powerSpec: string;
  description: string;
  imageKey?: string;
  imageDataUrl?: string;
  createdAt: string;
}

export interface SmartProject {
  id: string;
  title: string;
  sector: string;
  investmentPkr: number;
  investmentLabel: string;
  estimatedMonthlyProfitPkr: string;
  paybackMonths: string;
  spaceRequired: string;
  powerLoad: string;
  summary: string;
  deliverables: string[];
  hasCustomPdf: boolean;
  pdfFileName?: string;
  imageKey?: string;
  createdAt: string;
}

export interface InquiryRecord {
  id: string;
  referenceCode: string;
  fullName: string;
  phone: string;
  email: string;
  companyOrCity: string;
  category: InquiryCategory;
  details: Record<string, string>;
  message: string;
  status: 'New' | 'In Review' | 'Quoted' | 'Closed';
  createdAt: string;
}

export interface ProjectLead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  projectId: string;
  projectTitle: string;
  createdAt: string;
}
