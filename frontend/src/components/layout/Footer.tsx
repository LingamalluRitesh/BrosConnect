import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  const companyName = settings?.company_name || 'RMVS Web Services';
  const tagline = settings?.tagline || 'BUILD • CONNECT • GROW';
  const logoUrl = settings?.logo_url || '/logo.png';
  const copyright = settings?.footer_copyright || `© ${year} ${companyName}. All rights reserved.`;

  return (
    <footer className="bg-slate-50/90 border-t border-black/[0.08] mt-24 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoUrl}
                alt={companyName}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-black/10 shadow-sm"
              />
              <div>
                <span className="font-instrument italic text-slate-900 text-2xl leading-tight">
                  {companyName}
                </span>
                <p className="text-[8.5px] font-mono tracking-widest uppercase text-slate-400">
                  {tagline}
                </p>
              </div>
            </Link>
            <p className="text-slate-600 text-xs leading-relaxed">
              {settings?.description || 'Verified software engineering and enterprise digital delivery platform.'}
            </p>
            {settings?.address && (
              <p className="text-slate-500 text-[11px] flex items-center gap-1.5">
                <MapPin size={12} className="shrink-0 text-slate-400" />
                <span>{settings.address}</span>
              </p>
            )}
            {settings?.email && (
              <p className="text-slate-500 text-[11px] flex items-center gap-1.5">
                <Mail size={12} className="shrink-0 text-slate-400" />
                <a href={`mailto:${settings.email}`} className="hover:text-black transition-colors">{settings.email}</a>
              </p>
            )}
          </div>

          {/* Platform Columns */}
          <div>
            <p className="text-slate-900 text-xs font-semibold tracking-widest uppercase mb-4 font-mono">Platform</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Featured Projects', to: '/projects' },
                { label: 'Verified Developers', to: '/developers' },
                { label: 'Engineering Team', to: '/team' },
                { label: 'Developer Community', to: '/community' },
                { label: 'Services & Solutions', to: '/services' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-slate-500 hover:text-black transition-colors text-xs font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Offerings */}
          <div>
            <p className="text-slate-900 text-xs font-semibold tracking-widest uppercase mb-4 font-mono">Core Solutions</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Websites & Web Apps', to: '/services' },
                { label: 'Mobile Applications', to: '/services' },
                { label: 'Enterprise Software', to: '/services' },
                { label: 'Digital & AI Solutions', to: '/services' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-slate-500 hover:text-black transition-colors text-xs font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Access */}
          <div>
            <p className="text-slate-900 text-xs font-semibold tracking-widest uppercase mb-4 font-mono">Company &amp; Access</p>
            <ul className="space-y-2.5">
              {[
                { label: 'About Leadership', to: '/about' },
                { label: 'Engineering Team', to: '/team' },
                { label: 'Direct Consultation', to: '/contact' },
                { label: 'Developer & Client Login', to: '/login' },
                { label: 'Register New Account', to: '/register' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-slate-500 hover:text-black transition-colors text-xs font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 text-xs text-slate-800 hover:text-black transition-colors group font-semibold"
              >
                Join Platform <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>{copyright}</span>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
            <span>Leadership: CEO Ritesh Lingamallu</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Verified Software Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
