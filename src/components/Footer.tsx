import { ExternalLink, Lock, Mail, MapPin, Phone } from 'lucide-react';
import type { PageId } from '../types';
import { OFFICIAL_LOGO_URL } from '../utils/assets';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand Identity with Larger Official Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src={OFFICIAL_LOGO_URL}
                alt="Enverto Solutions Logo"
                referrerPolicy="no-referrer"
                className="h-14 w-14 object-contain rounded-xl bg-white p-1.5 shrink-0 shadow-sm"
              />
              <div>
                <p className="font-display font-extrabold text-white text-lg">
                  Enverto Solutions
                </p>
                <p className="text-xs text-slate-400">
                  Industrial &amp; Business Consultancy
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Delivering turnkey industrial manufacturing plants, electrical &amp; mechanical maintenance, PET packaging, solar EPC, and small-investor business launches since 2009.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">
              Corporate Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button type="button" onClick={() => handleNav('home')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  About Us &amp; CEO Profile
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('services')} className="hover:text-white transition-colors">
                  7 Industrial Services
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('machinery')} className="hover:text-white transition-colors">
                  Machinery &amp; Parts Portal
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('projects')} className="hover:text-white transition-colors">
                  Smart Projects (5–20 Lakh PKR)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('quote')} className="hover:text-white transition-colors">
                  Smart Inquiry &amp; Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Offices & Direct Contact */}
          <div className="space-y-3 text-sm">
            <h3 className="font-display text-sm font-semibold text-white mb-4">
              Offices &amp; Plant Locations
            </h3>
            <div className="flex items-start gap-2.5 text-slate-400">
              <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p>
                <strong className="text-slate-200 font-medium">Peshawar Office:</strong> Office 220, Block A, Pirano Market, Karkhano, Hayatabad, Peshawar.
              </p>
            </div>
            <div className="flex items-start gap-2.5 text-slate-400">
              <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p>
                <strong className="text-slate-200 font-medium">Haripur Plant:</strong> AQUALIN Mineral Water &amp; PET Plastic Industry, Haripur Industrial Zone, KP.
              </p>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300 pt-1">
              <Phone className="w-4 h-4 text-red-500 shrink-0" />
              <a href="tel:+923339278655" className="font-mono tabular-nums hover:text-white transition-colors">
                +92-333-9278655
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Mail className="w-4 h-4 text-red-500 shrink-0" />
              <a href="mailto:amir.project@gmail.com" className="hover:text-white transition-colors">
                amir.project@gmail.com
              </a>
            </div>
          </div>

          {/* Column 4: Team Webmail & Admin Portal */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold text-white">
              Staff &amp; Operations Access
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Team members can access official Enverto Roundcube Webmail or manage live machinery listings and project PDFs from the Admin Studio.
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://www.envertosolutions.pk/webmail"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4" />
                <span>Staff Email Login</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <button
                type="button"
                onClick={() => handleNav('admin')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Upload Studio</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Enverto Solutions (envertosolutions.pk). All rights reserved.
          </p>
          <p>
            KPFA · Halal Food Authority · PSQCA Licensed Operations (AQUALIN 2024)
          </p>
        </div>
      </div>
    </footer>
  );
}
