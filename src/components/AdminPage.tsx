import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  CheckCircle2,
  Download,
  FileText,
  Image as ImageIcon,
  Plus,
  Trash2,
} from 'lucide-react';
import type {
  InquiryRecord,
  MachineryCategory,
  MachineryItem,
  ProjectLead,
  SmartProject,
} from '../types';
import { resolveAssetUrl } from '../utils/assets';
import { SmartImage } from './SmartImage';

interface AdminPageProps {
  machinery: MachineryItem[];
  projects: SmartProject[];
  inquiries: InquiryRecord[];
  leads: ProjectLead[];
  onDataChanged: () => void;
}

type AdminTab = 'machinery' | 'projects' | 'inbox';

export function AdminPage({
  machinery,
  projects,
  inquiries,
  leads,
  onDataChanged,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('machinery');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Add Machinery Form State
  const [macTitle, setMacTitle] = useState('');
  const [macCategory, setMacCategory] = useState<MachineryCategory>('Blow Molding');
  const [macListingType, setMacListingType] = useState<'For Sale' | 'Wanted'>('For Sale');
  const [macCondition, setMacCondition] = useState<'Brand New' | 'Refurbished' | 'Used - Verified'>('Brand New');
  const [macPrice, setMacPrice] = useState('');
  const [macLocation, setMacLocation] = useState('Haripur / Hattar Industrial Zone');
  const [macCapacity, setMacCapacity] = useState('');
  const [macPower, setMacPower] = useState('');
  const [macDesc, setMacDesc] = useState('');
  const [macImageKey, setMacImageKey] = useState('blow_molding');
  const [macImageDataUrl, setMacImageDataUrl] = useState<string>('');
  const [macSaving, setMacSaving] = useState(false);

  // Add Smart Project Form State
  const [projTitle, setProjTitle] = useState('');
  const [projSector, setProjSector] = useState('Plastics & Packaging');
  const [projInvestment, setProjInvestment] = useState('950000');
  const [projProfit, setProjProfit] = useState('PKR 180,000 – 250,000');
  const [projPayback, setProjPayback] = useState('6 – 8 Months');
  const [projSpace, setProjSpace] = useState('500 sq. ft.');
  const [projPower, setProjPower] = useState('5 kW');
  const [projSummary, setProjSummary] = useState('');
  const [projDeliverables, setProjDeliverables] = useState('');
  const [projPdfDataUrl, setProjPdfDataUrl] = useState('');
  const [projPdfName, setProjPdfName] = useState('');
  const [projSaving, setProjSaving] = useState(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError('Please select an image smaller than 4 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMacImageDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF (.pdf) file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Please keep custom PDF files under 8 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProjPdfDataUrl(reader.result);
        setProjPdfName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateMachinery = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const numericPrice = Number(macPrice);
    if (!macTitle.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError('Please provide a valid machine title and PKR price.');
      return;
    }

    setMacSaving(true);
    try {
      const res = await fetch('/api/machinery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: macTitle,
          category: macCategory,
          listingType: macListingType,
          condition: macCondition,
          pricePkr: numericPrice,
          location: macLocation,
          capacitySpec: macCapacity || 'Industrial Grade Output',
          powerSpec: macPower || '3-Phase Industrial',
          description: macDesc || 'Verified industrial equipment listed by Enverto Solutions.',
          imageKey: macImageKey,
          imageDataUrl: macImageDataUrl || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to publish machinery');

      setNotice(`Published "${macTitle}" to the live Machinery Portal.`);
      setMacTitle('');
      setMacPrice('');
      setMacCapacity('');
      setMacPower('');
      setMacDesc('');
      setMacImageDataUrl('');
      onDataChanged();
    } catch {
      setError('Could not save machinery listing.');
    } finally {
      setMacSaving(false);
    }
  };

  const handleDeleteMachinery = async (id: string) => {
    setError(null);
    const res = await fetch(`/api/machinery/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setNotice('Machinery listing removed.');
      onDataChanged();
    }
  };

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const numericInv = Number(projInvestment);
    if (!projTitle.trim() || !projSummary.trim() || !Number.isFinite(numericInv) || numericInv <= 0) {
      setError('Please enter project title, summary, and valid investment PKR amount.');
      return;
    }

    setProjSaving(true);
    try {
      const deliverablesList = projDeliverables
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projTitle,
          sector: projSector,
          investmentPkr: numericInv,
          estimatedMonthlyProfitPkr: projProfit,
          paybackMonths: projPayback,
          spaceRequired: projSpace,
          powerLoad: projPower,
          summary: projSummary,
          deliverables: deliverablesList,
          pdfDataUrl: projPdfDataUrl || undefined,
          pdfFileName: projPdfName || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to publish project');

      setNotice(`Published Smart Project "${projTitle}" to the investor catalog.`);
      setProjTitle('');
      setProjSummary('');
      setProjDeliverables('');
      setProjPdfDataUrl('');
      setProjPdfName('');
      onDataChanged();
    } catch {
      setError('Could not save Smart Project.');
    } finally {
      setProjSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setError(null);
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setNotice('Smart project removed.');
      onDataChanged();
    }
  };

  const handleUpdateInquiryStatus = async (
    id: string,
    status: InquiryRecord['status']
  ) => {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      onDataChanged();
    }
  };

  const exportLeadsCsv = () => {
    const rows = [
      ['Type', 'Name', 'Phone', 'Email', 'Category / Project', 'Date'],
      ...leads.map((l) => ['PDF Lead', l.fullName, l.phone, l.email, l.projectTitle, l.createdAt]),
      ...inquiries.map((i) => [
        `Inquiry (${i.referenceCode})`,
        i.fullName,
        i.phone,
        i.email,
        i.category,
        i.createdAt,
      ]),
    ];
    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enverto-leads-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-red-700 tracking-wide">
            No-Code Content Publishing
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Admin Upload &amp; Operations Studio
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Add new machinery listings with photos, publish Smart Business Projects with custom PDF files, and track customer inquiries or PDF download leads without touching code.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start md:self-auto">
          {(
            [
              { id: 'machinery', label: `Machinery (${machinery.length})` },
              { id: 'projects', label: `Smart Projects (${projects.length})` },
              { id: 'inbox', label: `Inquiries & Leads (${inquiries.length + leads.length})` },
            ] as { id: AdminTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-3 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* TAB 1: ADD & MANAGE MACHINERY */}
      {activeTab === 'machinery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleCreateMachinery}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
          >
            <h2 className="font-display text-lg font-bold text-slate-900">
              Add New Machinery / Spare Part
            </h2>

            <div>
              <label htmlFor="mac-title" className="block text-xs font-semibold text-slate-700 mb-1">
                Machine / Part Name *
              </label>
              <input
                id="mac-title"
                type="text"
                required
                value={macTitle}
                onChange={(e) => setMacTitle(e.target.value)}
                placeholder="e.g., 4-Cavity Automatic PET Blow Molder"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="mac-cat" className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  id="mac-cat"
                  value={macCategory}
                  onChange={(e) => setMacCategory(e.target.value as MachineryCategory)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Blow Molding">Blow Molding</option>
                  <option value="Injection Molding">Injection Molding</option>
                  <option value="RO & Water Plants">RO &amp; Water Plants</option>
                  <option value="Packaging & Printing">Packaging &amp; Printing</option>
                  <option value="Spare Parts & Molds">Spare Parts &amp; Molds</option>
                </select>
              </div>
              <div>
                <label htmlFor="mac-type" className="block text-xs font-semibold text-slate-700 mb-1">
                  Listing Type
                </label>
                <select
                  id="mac-type"
                  value={macListingType}
                  onChange={(e) => setMacListingType(e.target.value as 'For Sale' | 'Wanted')}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                >
                  <option value="For Sale">For Sale</option>
                  <option value="Wanted">Wanted / Buy Request</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="mac-cond" className="block text-xs font-semibold text-slate-700 mb-1">
                  Condition
                </label>
                <select
                  id="mac-cond"
                  value={macCondition}
                  onChange={(e) =>
                    setMacCondition(
                      e.target.value as 'Brand New' | 'Refurbished' | 'Used - Verified'
                    )
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Refurbished">Refurbished</option>
                  <option value="Used - Verified">Used - Verified</option>
                </select>
              </div>
              <div>
                <label htmlFor="mac-price" className="block text-xs font-semibold text-slate-700 mb-1">
                  Price (PKR) *
                </label>
                <input
                  id="mac-price"
                  type="number"
                  required
                  min={1000}
                  value={macPrice}
                  onChange={(e) => setMacPrice(e.target.value)}
                  placeholder="1850000"
                  className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="mac-cap" className="block text-xs font-semibold text-slate-700 mb-1">
                  Output Capacity
                </label>
                <input
                  id="mac-cap"
                  type="text"
                  value={macCapacity}
                  onChange={(e) => setMacCapacity(e.target.value)}
                  placeholder="2,500 BPH"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label htmlFor="mac-pwr" className="block text-xs font-semibold text-slate-700 mb-1">
                  Power Spec
                </label>
                <input
                  id="mac-pwr"
                  type="text"
                  value={macPower}
                  onChange={(e) => setMacPower(e.target.value)}
                  placeholder="18 kW · 3-Phase"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mac-loc" className="block text-xs font-semibold text-slate-700 mb-1">
                Location
              </label>
              <input
                id="mac-loc"
                type="text"
                value={macLocation}
                onChange={(e) => setMacLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label htmlFor="mac-desc" className="block text-xs font-semibold text-slate-700 mb-1">
                Technical Description
              </label>
              <textarea
                id="mac-desc"
                rows={3}
                value={macDesc}
                onChange={(e) => setMacDesc(e.target.value)}
                placeholder="Key features, controller brand, warranty, inspection status..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-700">
                Upload Equipment Photo (or choose preset)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold cursor-pointer">
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                  <span>{macImageDataUrl ? 'Photo Attached' : 'Choose Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <select
                  value={macImageKey}
                  onChange={(e) => setMacImageKey(e.target.value)}
                  aria-label="Fallback preset equipment image"
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="blow_molding">Preset: Blow Molder</option>
                  <option value="injection_molding">Preset: Injection Press</option>
                  <option value="ro_plant">Preset: RO Water Plant</option>
                  <option value="hero_plant">Preset: Bottling Line</option>
                  <option value="solar_industrial">Preset: Solar Array</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={macSaving}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-semibold transition-colors disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              <span>{macSaving ? 'Publishing...' : 'Publish Machinery Listing'}</span>
            </button>
          </form>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Active Machinery Catalog
            </h2>
            <div className="divide-y divide-slate-200">
              {machinery.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <SmartImage
                        src={resolveAssetUrl(item.imageKey, item.imageDataUrl)}
                        alt={item.title}
                        fallbackTitle={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-bold text-slate-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 font-mono tabular-nums">
                        {item.category} · PKR {item.pricePkr.toLocaleString('en-US')} · {item.listingType}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteMachinery(item.id)}
                    aria-label={`Delete ${item.title}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADD & MANAGE SMART PROJECTS */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleCreateProject}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
          >
            <h2 className="font-display text-lg font-bold text-slate-900">
              Add Smart Business Project (5–20 Lakh)
            </h2>

            <div>
              <label htmlFor="proj-title" className="block text-xs font-semibold text-slate-700 mb-1">
                Project Title *
              </label>
              <input
                id="proj-title"
                type="text"
                required
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
                placeholder="e.g., Mini Juice & Pouch Packing Unit"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="proj-sec" className="block text-xs font-semibold text-slate-700 mb-1">
                  Industry Sector
                </label>
                <input
                  id="proj-sec"
                  type="text"
                  value={projSector}
                  onChange={(e) => setProjSector(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label htmlFor="proj-inv" className="block text-xs font-semibold text-slate-700 mb-1">
                  Investment (PKR) *
                </label>
                <input
                  id="proj-inv"
                  type="number"
                  required
                  value={projInvestment}
                  onChange={(e) => setProjInvestment(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="proj-profit" className="block text-xs font-semibold text-slate-700 mb-1">
                  Est. Monthly Return
                </label>
                <input
                  id="proj-profit"
                  type="text"
                  value={projProfit}
                  onChange={(e) => setProjProfit(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label htmlFor="proj-payback" className="block text-xs font-semibold text-slate-700 mb-1">
                  Payback Horizon
                </label>
                <input
                  id="proj-payback"
                  type="text"
                  value={projPayback}
                  onChange={(e) => setProjPayback(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="proj-space" className="block text-xs font-semibold text-slate-700 mb-1">
                  Floor Space Needed
                </label>
                <input
                  id="proj-space"
                  type="text"
                  value={projSpace}
                  onChange={(e) => setProjSpace(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label htmlFor="proj-power" className="block text-xs font-semibold text-slate-700 mb-1">
                  Power Load
                </label>
                <input
                  id="proj-power"
                  type="text"
                  value={projPower}
                  onChange={(e) => setProjPower(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label htmlFor="proj-sum" className="block text-xs font-semibold text-slate-700 mb-1">
                Executive Summary *
              </label>
              <textarea
                id="proj-sum"
                rows={3}
                required
                value={projSummary}
                onChange={(e) => setProjSummary(e.target.value)}
                placeholder="Describe machine setup, market demand, and turnkey scope..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label htmlFor="proj-deliv" className="block text-xs font-semibold text-slate-700 mb-1">
                Turnkey Deliverables (one per line)
              </label>
              <textarea
                id="proj-deliv"
                rows={3}
                value={projDeliverables}
                onChange={(e) => setProjDeliverables(e.target.value)}
                placeholder={'Semi-Auto Packing Machine\nInitial Film Roll Stock\nOperator Training'}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Upload Custom PDF Brochure (Optional — auto-generated if empty)
              </label>
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold cursor-pointer">
                <FileText className="w-4 h-4 text-red-700" />
                <span>{projPdfName ? `PDF Attached: ${projPdfName}` : 'Upload .PDF Business Plan'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={projSaving}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-semibold transition-colors disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              <span>{projSaving ? 'Publishing...' : 'Publish Smart Project'}</span>
            </button>
          </form>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Published Smart Projects
            </h2>
            <div className="divide-y divide-slate-200">
              {projects.map((proj) => (
                <div key={proj.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-slate-900 truncate">
                      {proj.title}
                    </p>
                    <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                      {proj.investmentLabel} · {proj.sector} · {proj.hasCustomPdf ? 'Custom PDF' : 'Auto Feasibility PDF'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(proj.id)}
                    aria-label={`Delete ${proj.title}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INQUIRIES & PDF LEADS */}
      {activeTab === 'inbox' && (
        <div className="space-y-8">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={exportLeadsCsv}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export All Inquiries &amp; Leads CSV</span>
            </button>
          </div>

          {/* Inquiries Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Smart Category Inquiries ({inquiries.length})
            </h2>
            {inquiries.length === 0 ? (
              <p className="text-sm text-slate-500">
                No inquiries submitted yet. Test the Request Quote form to see records appear here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 pr-4 font-semibold">Ref</th>
                      <th className="py-2.5 pr-4 font-semibold">Client</th>
                      <th className="py-2.5 pr-4 font-semibold">Category &amp; Specs</th>
                      <th className="py-2.5 pr-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="align-top">
                        <td className="py-3.5 pr-4 font-mono tabular-nums text-xs text-slate-600 whitespace-nowrap">
                          {inq.referenceCode}
                        </td>
                        <td className="py-3.5 pr-4">
                          <p className="font-semibold text-slate-900">{inq.fullName}</p>
                          <p className="font-mono text-xs text-slate-600">{inq.phone}</p>
                          {inq.email && <p className="text-xs text-slate-500">{inq.email}</p>}
                        </td>
                        <td className="py-3.5 pr-4">
                          <p className="font-semibold text-red-700 text-xs">{inq.category}</p>
                          {Object.entries(inq.details).map(([k, v]) => (
                            <p key={k} className="text-xs text-slate-600">
                              <span className="font-medium text-slate-800">{k}:</span> {v}
                            </p>
                          ))}
                          {inq.message && (
                            <p className="text-xs text-slate-500 mt-1">{inq.message}</p>
                          )}
                        </td>
                        <td className="py-3.5">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              handleUpdateInquiryStatus(
                                inq.id,
                                e.target.value as InquiryRecord['status']
                              )
                            }
                            aria-label={`Status for ${inq.referenceCode}`}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded border border-slate-300 bg-white"
                          >
                            <option value="New">New</option>
                            <option value="In Review">In Review</option>
                            <option value="Quoted">Quoted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* PDF Download Leads Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Smart Project PDF Download Leads ({leads.length})
            </h2>
            {leads.length === 0 ? (
              <p className="text-sm text-slate-500">
                No PDF download leads captured yet. Download a Smart Business Project plan to verify lead logging.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 pr-4 font-semibold">Investor Name</th>
                      <th className="py-2.5 pr-4 font-semibold">Phone</th>
                      <th className="py-2.5 pr-4 font-semibold">Email</th>
                      <th className="py-2.5 pr-4 font-semibold">Downloaded Project</th>
                      <th className="py-2.5 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="py-3 pr-4 font-semibold text-slate-900">{lead.fullName}</td>
                        <td className="py-3 pr-4 font-mono tabular-nums text-slate-700">{lead.phone}</td>
                        <td className="py-3 pr-4 text-slate-600">{lead.email}</td>
                        <td className="py-3 pr-4 text-slate-800">{lead.projectTitle}</td>
                        <td className="py-3 font-mono tabular-nums text-xs text-slate-500">
                          {new Date(lead.createdAt).toLocaleDateString('en-PK')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
