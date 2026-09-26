import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-50/90 border-t border-black/[0.08] mt-24 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Bro's Connect"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-black/10 shadow-sm"
              />
              <div>
                <span className="font-instrument italic text-slate-900 text-2xl leading-tight">Bro's Connect</span>
                <p className="text-[8.5px] font-mono tracking-widest uppercase text-slate-400">BUILD • CONNECT • GROW</p>
              </div>
            </Link>
            <p className="text-slate-600 text-xs leading-relaxed">
              India's premier digital projects and verified talent network. Transparent creator attribution, direct collaboration, and production-grade engineering.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider liquid-glass text-slate-700 border border-black/10">
                <span>Transactions in INR (₹)</span>
              </span>
            </div>
          </div>

          {/* Platform Columns */}
          <div>
            <p className="text-slate-900 text-xs font-semibold tracking-widest uppercase mb-4 font-mono">Platform</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Featured Projects', to: '/projects' },
                { label: 'Verified Developers', to: '/developers' },
                { label: 'Developer Community', to: '/community' },
                { label: 'Commission Project', to: '/register' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-slate-500 hover:text-black transition-colors text-xs font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offerings (from Logo) */}
          <div>
            <p className="text-slate-900 text-xs font-semibold tracking-widest uppercase mb-4 font-mono">Core Pillars</p>
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

          {/* Executive & Company */}
          <div>
            <p className="text-slate-900 text-xs font-semibold tracking-widest uppercase mb-4 font-mono">Company &amp; Access</p>
            <ul className="space-y-2.5">
              {[
                { label: 'About Leadership', to: '/about' },
                { label: 'Direct Consultation', to: '/contact' },
                { label: 'Architect & Client Login', to: '/login' },
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
                Join Bro's Connect <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {year} Bro's Connect. All rights reserved.</span>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
            <span>CEO: Ritesh Lingamallu</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>MD: M. Shiva Gopi</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Hyderabad, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
