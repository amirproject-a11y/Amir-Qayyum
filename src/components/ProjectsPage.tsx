import { useMemo, useState, type FormEvent } from 'react';
import { Check, CheckCircle2, FileDown, Lock, Plus, X } from 'lucide-react';
import type { InquiryCategory, PageId, SmartProject } from '../types';
import { resolveAssetUrl } from '../utils/assets';
import { generateProjectFeasibilityPdf } from '../utils/pdfGenerator';
import { MechanicalGears } from './MechanicalGears';
import { SmartImage } from './SmartImage';

interface ProjectsPageProps {
  projects: SmartProject[];
  onNavigate: (page: PageId) => void;
  onSelectQuoteCategory: (category: InquiryCategory, prefillNote?: string) => void;
}

type BudgetBand = 'all' | '5-10' | '10-15' | '15-20';

export function ProjectsPage({
  projects,
  onNavigate,
  onSelectQuoteCategory,
}: ProjectsPageProps) {
  const [budgetBand, setBudgetBand] = useState<BudgetBand>('all');
  const [selectedProject, setSelectedProject] = useState<SmartProject | null>(null);

  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [leadError, setLeadError] = useState<string | null>(null);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return projects.filter((proj) => {
      if (budgetBand === '5-10') return proj.investmentPkr <= 1000000;
      if (budgetBand === '10-15') return proj.investmentPkr > 1000000 && proj.investmentPkr <= 1500000;
      if (budgetBand === '15-20') return proj.investmentPkr > 1500000;
      return true;
    });
  }, [projects, budgetBand]);

  const openPdfModal = (project: SmartProject) => {
    setSelectedProject(project);
    setLeadError(null);
    setDownloadSuccess(null);
  };

  const closePdfModal = () => {
    setSelectedProject(null);
    setLeadError(null);
  };

  const handleLeadAndDownload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setLeadError(null);

    const emailTrim = visitorEmail.trim();
    const phoneTrim = visitorPhone.trim();
    const nameTrim = visitorName.trim();

    if (!nameTrim || phoneTrim.length < 7 || !emailTrim.includes('@')) {
      setLeadError('Please enter a valid full name, phone number, and email address.');
      return;
    }

    setSubmittingLead(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: nameTrim,
          phone: phoneTrim,
          email: emailTrim,
          projectId: selectedProject.id,
          projectTitle: selectedProject.title,
        }),
      });
      if (!res.ok) {
        throw new Error('Could not register download request.');
      }

      if (selectedProject.hasCustomPdf) {
        const anchor = document.createElement('a');
        anchor.href = `/api/projects/${selectedProject.id}/pdf`;
        anchor.download = selectedProject.pdfFileName || `${selectedProject.id}-feasibility.pdf`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      } else {
        generateProjectFeasibilityPdf(selectedProject, nameTrim);
      }

      setDownloadSuccess(
        `Your PDF feasibility plan for "${selectedProject.title}" has been downloaded.`
      );
      setVisitorName('');
      setVisitorPhone('');
      setVisitorEmail('');
    } catch {
      setLeadError('Unable to save lead record. Please try again.');
    } finally {
      setSubmittingLead(false);
    }
  };

  return (
    <div>
      {/* Executive Dark Header */}
      <section className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2.5">
              <MechanicalGears variant="inline" />
              <p className="text-xs font-semibold text-amber-400 tracking-wide">
                Small &amp; Mid-Tier Investor Ventures
              </p>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
              Smart Business Projects (PKR 5 Lakh to 20 Lakh)
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Turnkey micro-industrial and commercial business models vetted for Pakistani utilities, raw materials, and margins. Verify your contact details to download any complete PDF feasibility plan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Smart Project &amp; PDF</span>
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 space-y-8">
        {/* Budget Range Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 rounded-xl p-2 w-fit shadow-xs">
          {(
            [
              { id: 'all', label: 'All Budgets (5 – 20 Lakh)' },
              { id: '5-10', label: 'PKR 500K – 1.0M' },
              { id: '10-15', label: 'PKR 1.0M – 1.5M' },
              { id: '15-20', label: 'PKR 1.5M – 2.0M' },
            ] as { id: BudgetBand; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setBudgetBand(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                budgetBand === tab.id
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid with Visual Headers & Financial Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((proj) => (
            <article
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              <div>
                <div className="h-44 bg-slate-900 overflow-hidden relative">
                  <SmartImage
                    src={resolveAssetUrl(proj.imageKey)}
                    alt={proj.title}
                    fallbackTitle={proj.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end justify-between p-5">
                    <span className="text-xs font-semibold text-slate-200">
                      {proj.sector} · Payback {proj.paybackMonths}
                    </span>
                    <span className="font-mono tabular-nums text-base font-bold text-amber-300">
                      {proj.investmentLabel}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <h2 className="font-display text-xl font-bold text-slate-950">
                    {proj.title}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {proj.summary}
                  </p>

                  {/* Key Operational Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200/90 rounded-xl p-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Est. Monthly Net</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-950 mt-0.5 block">
                        {proj.estimatedMonthlyProfitPkr}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Floor Space</span>
                      <span className="font-semibold text-slate-950 mt-0.5 block">
                        {proj.spaceRequired}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Power Load</span>
                      <span className="font-semibold text-slate-950 mt-0.5 block">
                        {proj.powerLoad}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-800 mb-2">
                      Included Turnkey Deliverables
                    </h3>
                    <ul className="space-y-1.5">
                      {proj.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                          <Check className="w-4 h-4 text-red-700 mt-0.5 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-7 py-4 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => openPdfModal(proj)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Business Plan PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onSelectQuoteCategory(
                      'Smart Business Project',
                      `Interested in launching: ${proj.title} (${proj.investmentLabel})`
                    )
                  }
                  className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  Book Feasibility Call
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lead Capture Modal for PDF Download */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdf-modal-title"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-red-700">
                  Investor Feasibility Download
                </p>
                <h2 id="pdf-modal-title" className="font-display text-lg font-bold text-slate-950 mt-1">
                  {selectedProject.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closePdfModal}
                aria-label="Close download modal"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {downloadSuccess ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-emerald-900">
                      Download Started
                    </p>
                    <p className="text-xs text-emerald-800">{downloadSuccess}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closePdfModal}
                  className="w-full py-2.5 rounded-lg bg-slate-950 text-white text-sm font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadAndDownload} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    Enter your name, phone number, and email to unlock instant download of the complete machinery &amp; ROI PDF document.
                  </span>
                </p>

                {leadError && (
                  <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {leadError}
                  </p>
                )}

                <div>
                  <label htmlFor="lead-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="e.g., Bilal Khan"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                </div>

                <div>
                  <label htmlFor="lead-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    required
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="+92-3XX-XXXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                </div>

                <div>
                  <label htmlFor="lead-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    required
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    placeholder="investor@company.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                </div>

                <div className="pt-1 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closePdfModal}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold transition-colors disabled:opacity-60"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>{submittingLead ? 'Preparing PDF...' : 'Unlock & Download PDF'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
