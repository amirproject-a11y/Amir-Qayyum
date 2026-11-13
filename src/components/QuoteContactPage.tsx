import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import type { InquiryCategory } from '../types';

interface QuoteContactPageProps {
  initialCategory: InquiryCategory;
  initialNote?: string;
}

interface DynamicField {
  key: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: string[];
}

const CATEGORY_QUESTIONS: Record<InquiryCategory, DynamicField[]> = {
  'Machinery Purchase': [
    {
      key: 'Machine Type',
      label: 'Target Machine / Production Line',
      type: 'select',
      options: [
        'PET Stretch Blow Molding',
        'Plastic Injection Molding',
        'RO Water & Bottling Line',
        'Printing / Shrink Labeling',
        'Spare Parts / Custom Molds',
      ],
    },
    {
      key: 'Condition Preference',
      label: 'Equipment Condition',
      type: 'select',
      options: ['Brand New', 'Refurbished / Inspected', 'Used - Verified', 'Open to Quote Both'],
    },
    {
      key: 'Target Capacity',
      label: 'Required Output Capacity (e.g., BPH / LPH)',
      type: 'text',
      placeholder: 'e.g., 2,000 Bottles/Hour or 2,000 LPH',
    },
  ],
  'Co-Packing & PET Bottles': [
    {
      key: 'Service Scope',
      label: 'Required Packaging / Co-Packing Scope',
      type: 'select',
      options: [
        'Third-Party Water Co-Filling (AQUALIN Haripur)',
        'Empty PET Bottles & Caps Supply',
        'PVC / Shrink Labels & UVDTF Printing',
        'Complete Private-Label Launch',
      ],
    },
    {
      key: 'Bottle Sizes',
      label: 'Bottle Volumes Required',
      type: 'text',
      placeholder: 'e.g., 500ml, 1500ml, 19L Jars',
    },
    {
      key: 'Monthly Volume',
      label: 'Estimated Monthly Quantity (Cartons / Units)',
      type: 'text',
      placeholder: 'e.g., 5,000 cartons/month',
    },
  ],
  'Solar System Costing': [
    {
      key: 'System Architecture',
      label: 'Solar System Type',
      type: 'select',
      options: ['Industrial On-Grid (Net Metering)', 'Off-Grid / Hybrid with Batteries', 'Solar Tube-Well / Agricultural'],
    },
    {
      key: 'System Size',
      label: 'Estimated Capacity (kW) or Monthly WAPDA Bill',
      type: 'text',
      placeholder: 'e.g., 50 kW or PKR 450,000/month bill',
    },
    {
      key: 'Site Location',
      label: 'Installation City / Industrial Estate',
      type: 'text',
      placeholder: 'e.g., Hattar SEZ, Peshawar, Haripur',
    },
  ],
  'KPEZDMC / Hattar Plot': [
    {
      key: 'Transaction Type',
      label: 'Requirement Type',
      type: 'select',
      options: ['Buy Industrial Plot', 'Lease Factory Shed / Plot', 'Sell Existing Plot / Unit'],
    },
    {
      key: 'Plot Size',
      label: 'Required Area (Kanal / Acres)',
      type: 'text',
      placeholder: 'e.g., 2 Kanal, 1 Acre, 4 Acres',
    },
    {
      key: 'Industry Sector',
      label: 'Intended Manufacturing Sector',
      type: 'text',
      placeholder: 'e.g., Beverage, Plastics, Pharmaceuticals, Cold Storage',
    },
  ],
  'Electrical & Mechanical Maintenance': [
    {
      key: 'Engagement Model',
      label: 'Maintenance Contract Type',
      type: 'select',
      options: [
        'Annual Preventive Maintenance Contract (AMC)',
        'One-Time Machine Overhaul / Troubleshooting',
        'Dedicated On-Site Technicians & Engineers',
        'Spare Parts Supply Only',
      ],
    },
    {
      key: 'Plant Type',
      label: 'Facility / Machinery Type',
      type: 'text',
      placeholder: 'e.g., Bottling line, injection molders, factory switchgear',
    },
    {
      key: 'Urgency',
      label: 'Deployment Urgency',
      type: 'select',
      options: ['Immediate Breakdown Support', 'Planned Within 2 Weeks', 'Annual Tender / Quote'],
    },
  ],
  'Smart Business Project': [
    {
      key: 'Investment Budget',
      label: 'Available Investment Capital',
      type: 'select',
      options: ['PKR 5 – 8 Lakh', 'PKR 8 – 12 Lakh', 'PKR 12 – 16 Lakh', 'PKR 16 – 20 Lakh', 'Above PKR 20 Lakh'],
    },
    {
      key: 'Preferred Sector',
      label: 'Preferred Business Model',
      type: 'select',
      options: [
        'Mineral Water & Jar Bottling',
        'UVDTF & Shrink Label Printing',
        'PET Bottle Blowing Unit',
        'Private-Label Co-Packing',
        'Plastic Cap Injection',
        'Solar EPC Franchise Kit',
      ],
    },
    {
      key: 'Target City',
      label: 'Proposed Operations City',
      type: 'text',
      placeholder: 'e.g., Peshawar, Haripur, Mardan, Rawalpindi',
    },
  ],
  'Custom Product Design': [
    {
      key: 'Deliverable Stage',
      label: 'Current Project Stage',
      type: 'select',
      options: ['Concept & 3D CAD Design', 'CNC Aluminum / Steel Mold Only', 'Full Prototyping & Manufacturing'],
    },
    {
      key: 'Primary Material',
      label: 'Target Material',
      type: 'text',
      placeholder: 'e.g., PET, HDPE, PP, Polycarbonate, Sheet Metal',
    },
    {
      key: 'Batch Quantity',
      label: 'Initial Production Volume',
      type: 'text',
      placeholder: 'e.g., 10,000 units initial batch',
    },
  ],
};

export function QuoteContactPage({ initialCategory, initialNote }: QuoteContactPageProps) {
  const [category, setCategory] = useState<InquiryCategory>(initialCategory);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyOrCity, setCompanyOrCity] = useState('');
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState(initialNote || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<{
    referenceCode: string;
    whatsappUrl: string;
    mailtoUrl: string;
  } | null>(null);

  useEffect(() => {
    setCategory(initialCategory);
    if (initialNote) setMessage(initialNote);
    setDynamicValues({});
  }, [initialCategory, initialNote]);

  const activeFields = CATEGORY_QUESTIONS[category];

  const handleFieldChange = (key: string, value: string) => {
    setDynamicValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || phone.trim().length < 7) {
      setError('Please enter your full name and valid phone / WhatsApp number.');
      return;
    }

    const compiledDetails: Record<string, string> = {};
    activeFields.forEach((field) => {
      compiledDetails[field.key] =
        dynamicValues[field.key] || (field.options ? field.options[0] : 'Not specified');
    });

    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          companyOrCity,
          category,
          details: compiledDetails,
          message,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      const created = (await res.json()) as { referenceCode: string };

      const summaryText = [
        `Enverto Solutions Inquiry (${created.referenceCode})`,
        `Name: ${fullName}`,
        `Phone: ${phone}`,
        `Category: ${category}`,
        ...Object.entries(compiledDetails).map(([k, v]) => `${k}: ${v}`),
        message ? `Notes: ${message}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      setSubmittedRef({
        referenceCode: created.referenceCode,
        whatsappUrl: `https://wa.me/923339278655?text=${encodeURIComponent(summaryText)}`,
        mailtoUrl: `mailto:amir.project@gmail.com?subject=${encodeURIComponent(
          `[${created.referenceCode}] ${category} Inquiry - ${fullName}`
        )}&body=${encodeURIComponent(summaryText)}`,
      });
    } catch {
      setError('Could not save your inquiry. Please contact +92-333-9278655 directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Executive Dark Header */}
      <section className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold text-red-400 tracking-wide">
              Smart Engineering Inquiry &amp; Offices
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
              Request a Tailored Industrial Quote or Visit Our Offices
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Select your requirement category below—relevant technical questions will automatically adapt so our engineering desk can prepare an accurate quotation.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Smart Category Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {submittedRef ? (
              <div className="space-y-5 py-4">
                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-display text-lg font-bold text-emerald-950">
                      Inquiry Logged — Reference {submittedRef.referenceCode}
                    </h2>
                    <p className="text-sm text-emerald-800 mt-1">
                      Your inquiry is saved in the Enverto operations queue. For immediate response, send this formatted brief directly to CEO Amir Qayyum via WhatsApp or Email:
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={submittedRef.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Brief on WhatsApp</span>
                  </a>

                  <a
                    href={submittedRef.mailtoUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-900 text-sm font-semibold transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Open Email Draft</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      setMessage('');
                      setDynamicValues({});
                    }}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    New Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                    {error}
                  </p>
                )}

                <div>
                  <label htmlFor="smart-cat" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    1. Select Requirement Category
                  </label>
                  <select
                    id="smart-cat"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value as InquiryCategory);
                      setDynamicValues({});
                    }}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-950 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-700"
                  >
                    <option value="Machinery Purchase">Machinery Purchase</option>
                    <option value="Co-Packing & PET Bottles">Co-Packing &amp; PET Bottles</option>
                    <option value="Solar System Costing">Solar System Costing</option>
                    <option value="KPEZDMC / Hattar Plot">KPEZDMC / Hattar Plot</option>
                    <option value="Electrical & Mechanical Maintenance">Electrical &amp; Mechanical Maintenance</option>
                    <option value="Smart Business Project">Smart Business Project (5–20 Lakh PKR)</option>
                    <option value="Custom Product Design">Custom Product Design</option>
                  </select>
                </div>

                {/* Dynamic Category Questions */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <p className="text-xs font-semibold text-slate-700">
                    2. Technical Parameters for {category}
                  </p>
                  {activeFields.map((field) => (
                    <div key={field.key}>
                      <label
                        htmlFor={`dyn-${field.key}`}
                        className="block text-xs font-medium text-slate-700 mb-1"
                      >
                        {field.label}
                      </label>
                      {field.type === 'select' && field.options ? (
                        <select
                          id={`dyn-${field.key}`}
                          value={dynamicValues[field.key] || field.options[0]}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-700"
                        >
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={`dyn-${field.key}`}
                          type="text"
                          value={dynamicValues[field.key] || ''}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-700"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-slate-700">
                    3. Your Contact Information
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="inq-name" className="block text-xs font-medium text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        id="inq-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
                      />
                    </div>
                    <div>
                      <label htmlFor="inq-phone" className="block text-xs font-medium text-slate-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="inq-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92-3XX-XXXXXXX"
                        className="w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="inq-email" className="block text-xs font-medium text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="inq-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
                      />
                    </div>
                    <div>
                      <label htmlFor="inq-city" className="block text-xs font-medium text-slate-700 mb-1">
                        Company Name / City
                      </label>
                      <input
                        id="inq-city"
                        type="text"
                        value={companyOrCity}
                        onChange={(e) => setCompanyOrCity(e.target.value)}
                        placeholder="e.g., Peshawar / Islamabad"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inq-msg" className="block text-xs font-medium text-slate-700 mb-1">
                      Additional Project Specifications
                    </label>
                    <textarea
                      id="inq-msg"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Any timeline, utility availability, or special requirements..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Submitting Engineering Inquiry...' : 'Submit Smart Inquiry & Get Reference'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Details Sidebar */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-lg">
              <h2 className="font-display text-xl font-bold">
                Official Offices &amp; Plant Locations
              </h2>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Peshawar Head Office</p>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">
                      Office 220, Block A, Pirano Market, Karkhano, Hayatabad, Peshawar, Khyber Pakhtunkhwa, Pakistan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Haripur Manufacturing Plant &amp; Office</p>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">
                      AQUALIN Mineral Water &amp; PET Plastic Industry, Haripur / Hattar Industrial Corridor, KP.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-800 space-y-3 text-sm">
                <a
                  href="tel:+923339278655"
                  className="flex items-center gap-3 text-slate-200 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-mono tabular-nums font-medium">+92-333-9278655</span>
                </a>

                <a
                  href="mailto:amir.project@gmail.com"
                  className="flex items-center gap-3 text-slate-200 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-red-500 shrink-0" />
                  <span>amir.project@gmail.com</span>
                </a>
              </div>

              <a
                href="https://wa.me/923339278655?text=Hello%20Enverto%20Solutions%2C%20I%20would%20like%20to%20request%20a%20quote."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <h3 className="font-display text-base font-bold text-slate-950">
                Office Visiting Hours
              </h3>
              <dl className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <dt>Monday – Saturday</dt>
                  <dd className="font-mono tabular-nums font-semibold text-slate-950">09:00 AM – 06:00 PM</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Plant Inspections (Haripur)</dt>
                  <dd className="font-semibold text-slate-950">By Prior Appointment</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
