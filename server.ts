import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

interface StoredMachinery {
  id: string;
  title: string;
  category: string;
  listingType: 'For Sale' | 'Wanted';
  condition: string;
  pricePkr: number;
  location: string;
  capacitySpec: string;
  powerSpec: string;
  description: string;
  imageKey?: string;
  imageDataUrl?: string;
  createdAt: string;
}

interface StoredProject {
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
  pdfDataUrl?: string;
  pdfFileName?: string;
  imageKey?: string;
  createdAt: string;
}

interface StoredInquiry {
  id: string;
  referenceCode: string;
  fullName: string;
  phone: string;
  email: string;
  companyOrCity: string;
  category: string;
  details: Record<string, string>;
  message: string;
  status: 'New' | 'In Review' | 'Quoted' | 'Closed';
  createdAt: string;
}

interface StoredLead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  projectId: string;
  projectTitle: string;
  createdAt: string;
}

interface DataStore {
  machinery: StoredMachinery[];
  projects: StoredProject[];
  inquiries: StoredInquiry[];
  leads: StoredLead[];
}

const DEFAULT_STORE: DataStore = {
  machinery: [
    {
      id: 'mac-01',
      title: 'Semi-Automatic 2-Cavity PET Stretch Blow Molding Line',
      category: 'Blow Molding',
      listingType: 'For Sale',
      condition: 'Brand New',
      pricePkr: 1850000,
      location: 'Haripur / Hattar Industrial Zone',
      capacitySpec: '1,800 – 2,200 Bottles / Hour (250ml to 2000ml)',
      powerSpec: '18 kW · 3-Phase 400V',
      description:
        'Complete high-efficiency PET stretch blow molding unit with infrared preform oven, high-pressure air compressor interface, and chiller compatibility. Tested on AQUALIN production standards.',
      imageKey: 'blow_molding',
      createdAt: '2026-10-12T09:00:00.000Z',
    },
    {
      id: 'mac-02',
      title: '180-Ton Precision Plastic Injection Molding Press (Caps & Preforms)',
      category: 'Injection Molding',
      listingType: 'For Sale',
      condition: 'Refurbished',
      pricePkr: 4650000,
      location: 'Hayatabad / Karkhano Yard, Peshawar',
      capacitySpec: '16-Cavity PCO 1881 Cap / Preform Ready',
      powerSpec: '22 kW Servo Hydraulic',
      description:
        'Servo-driven hydraulic injection molding system tuned for food-grade 28mm/30mm mineral water caps, closures, and precision industrial plastic components.',
      imageKey: 'injection_molding',
      createdAt: '2026-10-18T11:30:00.000Z',
    },
    {
      id: 'mac-03',
      title: '2,000 LPH Stainless Steel 304 Reverse Osmosis (RO) Water Plant',
      category: 'RO & Water Plants',
      listingType: 'For Sale',
      condition: 'Brand New',
      pricePkr: 1450000,
      location: 'Haripur Plant Assembly',
      capacitySpec: '2,000 Liters / Hour · TDS Reduction > 98%',
      powerSpec: '7.5 kW · SS-304 Skid',
      description:
        'Turnkey food-grade SS-304 RO plant with multimedia sand/carbon filtration, micron cartridge housing, UV sterilizer, ozone dosing, and PLC TDS monitoring compliant with PSQCA & KPFA.',
      imageKey: 'ro_plant',
      createdAt: '2026-10-25T14:15:00.000Z',
    },
    {
      id: 'mac-04',
      title: '3-in-1 Automatic Monoblock Bottle Rinsing, Filling & Capping Machine',
      category: 'RO & Water Plants',
      listingType: 'For Sale',
      condition: 'Brand New',
      pricePkr: 3250000,
      location: 'Hattar SEZ / Haripur',
      capacitySpec: '3,000 BPH (500ml / 1500ml PET)',
      powerSpec: '4.5 kW · Air Conveyor Included',
      description:
        'Rotary stainless steel monoblock filling unit with pneumatic cap elevator, torque capping heads, and PLC touch HMI for commercial mineral water and beverage lines.',
      imageKey: 'hero_plant',
      createdAt: '2026-11-01T08:45:00.000Z',
    },
    {
      id: 'mac-05',
      title: 'High-Speed Heat Shrink Sleeve Tunnel & UVDTF Industrial Labeler',
      category: 'Packaging & Printing',
      listingType: 'For Sale',
      condition: 'Brand New',
      pricePkr: 680000,
      location: 'Peshawar Office / Warehouse',
      capacitySpec: 'Up to 4,000 Bottles / Hour · PVC & OPS Sleeves',
      powerSpec: '9 kW Regulated Thermal Chamber',
      description:
        'Precision hot-air / steam shrink labeling tunnel engineered for zero-wrinkle PVC and PETG shrink labels on contoured beverage and chemical bottles.',
      imageKey: 'blow_molding',
      createdAt: '2026-11-04T10:20:00.000Z',
    },
    {
      id: 'mac-06',
      title: 'Custom Multi-Cavity Aluminum Blow Molds & PCO Neck Spare Kits',
      category: 'Spare Parts & Molds',
      listingType: 'For Sale',
      condition: 'Brand New',
      pricePkr: 340000,
      location: 'Haripur Tooling Division',
      capacitySpec: '500ml · 1000ml · 1500ml · 5L Custom Geometry',
      powerSpec: '7075 Aerospace Aluminum · CNC Machined',
      description:
        'Custom-engineered bottle molds, PLC relays, pneumatic valves, infrared heating lamps, and seals stocked for rapid maintenance turnaround.',
      imageKey: 'injection_molding',
      createdAt: '2026-11-07T16:00:00.000Z',
    },
  ],
  projects: [
    {
      id: 'proj-01',
      title: 'Micro Mineral Water & 19-Liter Jar Bottling Startup',
      sector: 'Food & Beverage',
      investmentPkr: 850000,
      investmentLabel: 'PKR 850,000',
      estimatedMonthlyProfitPkr: 'PKR 165,000 – 240,000',
      paybackMonths: '5 – 7 Months',
      spaceRequired: '600 – 800 sq. ft.',
      powerLoad: '5 kW Single / Three Phase',
      summary:
        'Complete turnkey 1,000 LPH Reverse Osmosis purification unit with stainless steel filling station, 19L jar washing rack, TDS/pH lab kit, and KPFA/PSQCA licensing roadmap.',
      deliverables: [
        '1,000 LPH Food-Grade RO System with UV & Ozone',
        'Semi-Automatic 19L Jar Washer & Twin-Nozzle Filler',
        'Starter Inventory of 200 Polycarbonate Jars & Shrink Caps',
        'Water Testing Lab Kit & Regulatory Registration Guidance',
      ],
      imageKey: 'ro_plant',
      createdAt: '2026-10-15T10:00:00.000Z',
    },
    {
      id: 'proj-02',
      title: 'UVDTF & PVC Shrink Label Commercial Printing Studio',
      sector: 'Printing & Packaging',
      investmentPkr: 1150000,
      investmentLabel: 'PKR 1,150,000',
      estimatedMonthlyProfitPkr: 'PKR 220,000 – 310,000',
      paybackMonths: '6 – 8 Months',
      spaceRequired: '350 – 500 sq. ft.',
      powerLoad: '3.5 kW + UPS Backup',
      summary:
        'High-margin B2B branding unit serving local water bottlers, cosmetics, oils, and corporate merchandise with waterproof UVDTF transfers and shrink sleeve labels.',
      deliverables: [
        'Industrial A3+ Roll-to-Roll UVDTF Printer & Laminator',
        'Rotary Bottle Heat-Shrink Applicator Gun & Sample Tunnel',
        'Initial Roll Stock (A/B Film, UV Inks, PVC Shrink Film)',
        'Direct B2B Client Onboarding Templates & Costing Sheet',
      ],
      imageKey: 'blow_molding',
      createdAt: '2026-10-22T12:00:00.000Z',
    },
    {
      id: 'proj-03',
      title: 'Small-Batch PET Bottle Preform Blowing & Supply Unit',
      sector: 'Plastics & Packaging',
      investmentPkr: 1950000,
      investmentLabel: 'PKR 1,950,000',
      estimatedMonthlyProfitPkr: 'PKR 340,000 – 480,000',
      paybackMonths: '7 – 9 Months',
      spaceRequired: '1,000 – 1,200 sq. ft.',
      powerLoad: '18 kW Three Phase',
      summary:
        'Entry-level industrial PET bottle blowing operation supplying 500ml and 1.5L empty bottles to regional water brands, dairy farms, and edible oil packers.',
      deliverables: [
        'Semi-Automatic 2-Cavity PET Stretch Blow Molder',
        'High-Pressure Air Compressor & Air Dryer Assembly',
        '2 Custom Bottle Molds (500ml & 1,500ml PCO-1881)',
        'Operator Training & Preform Sourcing Linkages',
      ],
      imageKey: 'hero_plant',
      createdAt: '2026-10-29T09:30:00.000Z',
    },
    {
      id: 'proj-04',
      title: 'Private-Label Beverage & Water Co-Packing Brand Launch',
      sector: 'Third-Party Manufacturing',
      investmentPkr: 550000,
      investmentLabel: 'PKR 550,000',
      estimatedMonthlyProfitPkr: 'PKR 140,000 – 210,000',
      paybackMonths: '3 – 5 Months',
      spaceRequired: '200 sq. ft. Distribution Store Only',
      powerLoad: 'Zero Factory Load (Co-Packed at AQUALIN)',
      summary:
        'Launch your own certified mineral water or beverage brand without buying factory machinery. Production, filling, and labeling handled under contract at Enverto/AQUALIN Haripur.',
      deliverables: [
        'Custom Bottle Shape Selection & Brand Label Artwork',
        'First Production Batch of 3,000 Cartons (500ml / 1500ml)',
        'KPFA & PSQCA Compliant Bottling Under Contract',
        'Distribution Margin Model & Wholesale Pitch Deck',
      ],
      imageKey: 'ro_plant',
      createdAt: '2026-11-02T11:15:00.000Z',
    },
    {
      id: 'proj-05',
      title: 'Plastic Cap & Closure Compression / Micro-Injection Unit',
      sector: 'Plastics & Packaging',
      investmentPkr: 1650000,
      investmentLabel: 'PKR 1,650,000',
      estimatedMonthlyProfitPkr: 'PKR 275,000 – 360,000',
      paybackMonths: '7 – 9 Months',
      spaceRequired: '750 sq. ft.',
      powerLoad: '14 kW Three Phase',
      summary:
        'Compact vertical/horizontal micro-injection molding line producing tamper-evident HDPE water caps, oil spouts, or pharmaceutical closures with steady local demand.',
      deliverables: [
        'Compact 90-Ton Servo Injection Molding Machine',
        '8-Cavity Tamper-Evident Cap Mold + Chiller Unit',
        'HDPE Virgin Resin & Masterbatch Color Mixing Guide',
        'Installation, Trial Run & Preventive Maintenance Manual',
      ],
      imageKey: 'injection_molding',
      createdAt: '2026-11-05T15:00:00.000Z',
    },
    {
      id: 'proj-06',
      title: 'Commercial Solar EPC & Electrical Maintenance Franchise Kit',
      sector: 'Renewable Energy & Services',
      investmentPkr: 1350000,
      investmentLabel: 'PKR 1,350,000',
      estimatedMonthlyProfitPkr: 'PKR 250,000 – 390,000',
      paybackMonths: '5 – 6 Months',
      spaceRequired: '300 sq. ft. Office / Tool Store',
      powerLoad: 'Field Service Operations',
      summary:
        'Start an industrial & commercial solar installation and preventive electrical maintenance contracting team backed by Enverto engineering supervision and Tier-1 hardware procurement.',
      deliverables: [
        'Complete Diagnostic Kit (Thermal Camera, Clamp Meters, Megger)',
        '10 kW Demo Hybrid Inverter & Panel Mounting Rig',
        'On-Grid / Off-Grid Solar Costing & ROI Software Templates',
        'Engineering Bid Support & Safety Compliance SOPs',
      ],
      imageKey: 'solar_industrial',
      createdAt: '2026-11-08T13:45:00.000Z',
    },
  ],
  inquiries: [],
  leads: [],
};

function ensureStore(): DataStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
    return structuredClone(DEFAULT_STORE);
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DataStore>;
    return {
      machinery: Array.isArray(parsed.machinery) ? parsed.machinery : DEFAULT_STORE.machinery,
      projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_STORE.projects,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
    };
  } catch {
    return structuredClone(DEFAULT_STORE);
  }
}

function saveStore(store: DataStore): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

// Market Rates Cache (15 min TTL)
interface CachedMarketRates {
  usdPkr: number;
  aedPkr: number;
  sarPkr: number;
  goldUsdOz: number;
  gold24kTolaPkr: number;
  gold24kTenGramPkr: number;
  updatedAt: string;
  source: 'live' | 'cached' | 'reference';
  fetchedAtMs: number;
}

let ratesCache: CachedMarketRates | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000;

async function fetchLiveMarketRates(): Promise<CachedMarketRates> {
  const now = Date.now();
  if (ratesCache && now - ratesCache.fetchedAtMs < CACHE_TTL_MS) {
    return { ...ratesCache, source: 'cached' };
  }

  let usdPkr = 278.4;
  let aedPkr = 75.8;
  let sarPkr = 74.22;
  let goldUsdOz = 2645.0;
  let liveFxOk = false;

  try {
    const fxRes = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: AbortSignal.timeout(4500),
    });
    if (fxRes.ok) {
      const fxData = (await fxRes.json()) as {
        rates?: Record<string, number>;
      };
      if (fxData.rates?.PKR && fxData.rates?.AED && fxData.rates?.SAR) {
        usdPkr = Number(fxData.rates.PKR.toFixed(2));
        aedPkr = Number((fxData.rates.PKR / fxData.rates.AED).toFixed(2));
        sarPkr = Number((fxData.rates.PKR / fxData.rates.SAR).toFixed(2));
        liveFxOk = true;
      }
    }
  } catch {
    // Graceful fallback below
  }

  try {
    const goldRes = await fetch('https://api.gold-api.com/price/XAU', {
      signal: AbortSignal.timeout(4500),
    });
    if (goldRes.ok) {
      const goldData = (await goldRes.json()) as { price?: number };
      if (typeof goldData.price === 'number' && goldData.price > 1000) {
        goldUsdOz = Number(goldData.price.toFixed(2));
      }
    }
  } catch {
    // Keep reference gold spot if upstream is unreachable
  }

  // Convert Troy Oz (31.1035g) to 10g and 1 Tola (11.6638g) in PKR
  const perGramPkr = (goldUsdOz * usdPkr) / 31.1034768;
  const gold24kTenGramPkr = Math.round(perGramPkr * 10);
  const gold24kTolaPkr = Math.round(perGramPkr * 11.6638038);

  const payload: CachedMarketRates = {
    usdPkr,
    aedPkr,
    sarPkr,
    goldUsdOz,
    gold24kTolaPkr,
    gold24kTenGramPkr,
    updatedAt: new Date().toISOString(),
    source: liveFxOk ? 'live' : 'reference',
    fetchedAtMs: now,
  };

  ratesCache = payload;
  return payload;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  // Live Currency & Gold Rates
  app.get('/api/market-rates', async (_req, res) => {
    const data = await fetchLiveMarketRates();
    const { fetchedAtMs: _ignore, ...publicData } = data;
    res.json(publicData);
  });

  // Machinery CRUD
  app.get('/api/machinery', (req, res) => {
    const store = ensureStore();
    const category = typeof req.query.category === 'string' ? req.query.category : '';
    const listingType = typeof req.query.listingType === 'string' ? req.query.listingType : '';
    const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase().trim() : '';

    let items = store.machinery;
    if (category && category !== 'All') {
      items = items.filter((item) => item.category === category);
    }
    if (listingType && listingType !== 'All') {
      items = items.filter((item) => item.listingType === listingType);
    }
    if (q) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.capacitySpec.toLowerCase().includes(q)
      );
    }
    res.json(items);
  });

  app.post('/api/machinery', (req, res) => {
    const body = req.body as Partial<StoredMachinery>;
    if (!body.title || !body.category || typeof body.pricePkr !== 'number') {
      res.status(400).json({ error: 'Title, category, and numeric pricePkr are required.' });
      return;
    }
    const store = ensureStore();
    const newItem: StoredMachinery = {
      id: `mac-${Date.now()}`,
      title: body.title.trim(),
      category: body.category,
      listingType: body.listingType === 'Wanted' ? 'Wanted' : 'For Sale',
      condition: body.condition || 'Brand New',
      pricePkr: Math.max(0, Math.round(body.pricePkr)),
      location: body.location?.trim() || 'Peshawar / Haripur',
      capacitySpec: body.capacitySpec?.trim() || 'Industrial Specification',
      powerSpec: body.powerSpec?.trim() || '3-Phase Industrial',
      description: body.description?.trim() || '',
      imageKey: body.imageKey || 'blow_molding',
      imageDataUrl: body.imageDataUrl,
      createdAt: new Date().toISOString(),
    };
    store.machinery.unshift(newItem);
    saveStore(store);
    res.status(201).json(newItem);
  });

  app.delete('/api/machinery/:id', (req, res) => {
    const store = ensureStore();
    const before = store.machinery.length;
    store.machinery = store.machinery.filter((item) => item.id !== req.params.id);
    if (store.machinery.length === before) {
      res.status(404).json({ error: 'Machinery item not found.' });
      return;
    }
    saveStore(store);
    res.json({ ok: true });
  });

  // Smart Business Projects CRUD + PDF Download
  app.get('/api/projects', (_req, res) => {
    const store = ensureStore();
    const sanitized = store.projects.map(({ pdfDataUrl, ...rest }) => ({
      ...rest,
      hasCustomPdf: Boolean(pdfDataUrl && pdfDataUrl.length > 0),
    }));
    res.json(sanitized);
  });

  app.post('/api/projects', (req, res) => {
    const body = req.body as Partial<StoredProject>;
    if (!body.title || typeof body.investmentPkr !== 'number' || !body.summary) {
      res.status(400).json({ error: 'Title, investmentPkr, and summary are required.' });
      return;
    }
    const store = ensureStore();
    const formattedPrice = `PKR ${Math.round(body.investmentPkr).toLocaleString('en-US')}`;
    const newProject: StoredProject = {
      id: `proj-${Date.now()}`,
      title: body.title.trim(),
      sector: body.sector?.trim() || 'Small Industry',
      investmentPkr: Math.round(body.investmentPkr),
      investmentLabel: body.investmentLabel?.trim() || formattedPrice,
      estimatedMonthlyProfitPkr: body.estimatedMonthlyProfitPkr?.trim() || 'PKR 150,000 – 250,000',
      paybackMonths: body.paybackMonths?.trim() || '6 – 8 Months',
      spaceRequired: body.spaceRequired?.trim() || '500 sq. ft.',
      powerLoad: body.powerLoad?.trim() || '5 kW',
      summary: body.summary.trim(),
      deliverables: Array.isArray(body.deliverables) && body.deliverables.length > 0
        ? body.deliverables
        : ['Turnkey Machinery & Commissioning', 'Feasibility & Raw Material Sourcing', 'Operator Training'],
      pdfDataUrl: body.pdfDataUrl,
      pdfFileName: body.pdfFileName,
      imageKey: body.imageKey || 'ro_plant',
      createdAt: new Date().toISOString(),
    };
    store.projects.unshift(newProject);
    saveStore(store);
    const { pdfDataUrl: _omit, ...publicProj } = newProject;
    res.status(201).json({
      ...publicProj,
      hasCustomPdf: Boolean(newProject.pdfDataUrl),
    });
  });

  app.get('/api/projects/:id/pdf', (req, res) => {
    const store = ensureStore();
    const proj = store.projects.find((p) => p.id === req.params.id);
    if (!proj || !proj.pdfDataUrl) {
      res.status(404).json({ error: 'Custom PDF not found for this project.' });
      return;
    }
    const base64Match = proj.pdfDataUrl.match(/^data:application\/pdf;base64,(.+)$/);
    if (!base64Match) {
      res.status(400).json({ error: 'Invalid stored PDF encoding.' });
      return;
    }
    const buffer = Buffer.from(base64Match[1], 'base64');
    const filename = proj.pdfFileName || `${proj.id}-feasibility.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  });

  app.delete('/api/projects/:id', (req, res) => {
    const store = ensureStore();
    const before = store.projects.length;
    store.projects = store.projects.filter((p) => p.id !== req.params.id);
    if (store.projects.length === before) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }
    saveStore(store);
    res.json({ ok: true });
  });

  // PDF Download Leads
  app.get('/api/leads', (_req, res) => {
    const store = ensureStore();
    res.json(store.leads);
  });

  app.post('/api/leads', (req, res) => {
    const body = req.body as Partial<StoredLead>;
    if (!body.fullName || !body.phone || !body.email || !body.projectId) {
      res.status(400).json({ error: 'Full name, phone, email, and projectId are required.' });
      return;
    }
    const store = ensureStore();
    const lead: StoredLead = {
      id: `lead-${Date.now()}`,
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      email: body.email.trim(),
      projectId: body.projectId,
      projectTitle: body.projectTitle?.trim() || 'Smart Business Project',
      createdAt: new Date().toISOString(),
    };
    store.leads.unshift(lead);
    saveStore(store);
    res.status(201).json(lead);
  });

  // Smart Category Inquiries
  app.get('/api/inquiries', (_req, res) => {
    const store = ensureStore();
    res.json(store.inquiries);
  });

  app.post('/api/inquiries', (req, res) => {
    const body = req.body as Partial<StoredInquiry>;
    if (!body.fullName || !body.phone || !body.category) {
      res.status(400).json({ error: 'Full name, phone, and inquiry category are required.' });
      return;
    }
    const store = ensureStore();
    const code = `ENV-${new Date().getFullYear()}-${String(1000 + store.inquiries.length + 1)}`;
    const inquiry: StoredInquiry = {
      id: `inq-${Date.now()}`,
      referenceCode: code,
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || '',
      companyOrCity: body.companyOrCity?.trim() || '',
      category: body.category,
      details: body.details && typeof body.details === 'object' ? body.details : {},
      message: body.message?.trim() || '',
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    store.inquiries.unshift(inquiry);
    saveStore(store);
    res.status(201).json(inquiry);
  });

  app.patch('/api/inquiries/:id', (req, res) => {
    const body = req.body as { status?: StoredInquiry['status'] };
    const allowed = ['New', 'In Review', 'Quoted', 'Closed'];
    if (!body.status || !allowed.includes(body.status)) {
      res.status(400).json({ error: 'Valid status is required.' });
      return;
    }
    const store = ensureStore();
    const item = store.inquiries.find((i) => i.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }
    item.status = body.status;
    saveStore(store);
    res.json(item);
  });

  // Health check for Cloud Run / Shared Preview probes
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'enverto-solutions' });
  });

  // Vite Dev Middleware or Static Production Serve
  const distPath = path.join(__dirname, 'dist');
  const publicPath = path.join(__dirname, 'public');
  const isProd =
    process.env.NODE_ENV === 'production' ||
    process.env.npm_lifecycle_event === 'start';

  if (isProd && fs.existsSync(path.join(distPath, 'index.html'))) {
    app.use(express.static(distPath));
    app.use(express.static(publicPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        next();
        return;
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enverto Solutions server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
