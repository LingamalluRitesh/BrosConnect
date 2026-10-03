import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Users } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/common/Icons';
import api from '../../api/client';
import { useSettings } from '../../context/SettingsContext';
import type { DeveloperProfile } from '../../types';

export const TeamPage: React.FC = () => {
  const { settings } = useSettings();
  const [developers, setDevelopers] = useState<DeveloperProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const companyName = settings?.company_name || 'RMVS Web Services';

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const res = await api.get('/developers');
        setDevelopers(res.data);
      } catch (err) {
        console.error('Failed to load team developers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-12 border-b border-black/[0.06]">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider liquid-glass border border-black/10 text-slate-600">
            Organizational Structure
          </span>
        </div>
        <h1 className="font-instrument italic text-[clamp(2.5rem,5vw,4.5rem)] leading-tight text-slate-950 mb-4">
          Engineering &amp; Executive Team
        </h1>
        <p className="text-slate-600 text-base max-w-2xl leading-relaxed">
          The verified engineering core behind {companyName}. Transparent roles, verifiable code contributions, and direct project leadership.
        </p>
      </div>

      {/* CEO Spotlight */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Chief Executive &amp; Architecture</p>
          <span className="text-[11px] font-mono text-slate-400">Tier 1 · Governance</span>
        </div>

        <div className="liquid-glass rounded-3xl p-8 sm:p-10 border border-black/[0.08] shadow-sm bg-white/70">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950 text-white flex items-center justify-center font-instrument italic text-4xl shadow-inner shrink-0 ring-4 ring-black/5">
              R
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-instrument italic text-3xl sm:text-4xl text-slate-950">Ritesh Lingamallu</h2>
                    <CheckCircle2 size={20} className="text-emerald-600" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black text-white">
                      Chief Executive Officer
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Super Admin · Lead Systems Architect
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full liquid-glass border border-black/10 text-slate-600 hover:text-black hover:bg-slate-50 transition-colors"
                  >
                    <GithubIcon size={16} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full liquid-glass border border-black/10 text-slate-600 hover:text-black hover:bg-slate-50 transition-colors"
                  >
                    <LinkedinIcon size={16} />
                  </a>
                </div>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
                Super Admin and Lead Systems Engineer. Sets the engineering roadmap, technology stack governance, and enterprise delivery standards for {companyName}. Oversees project verification, security compliance, and direct customer alignment.
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                {['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'AI/ML', 'System Architecture', 'Cloud Infrastructure'].map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-xs font-mono liquid-glass text-slate-700 border border-black/[0.08] bg-slate-50">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Engineering Developers (Tier 2) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-center justify-between border-t border-black/[0.06] pt-10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Core Engineering Developers</p>
            <h3 className="font-instrument italic text-2xl text-slate-900 mt-1">Verified Technical Builders</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Tier 2 · Engineering Squad</span>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-100" />
            ))}
          </div>
        ) : developers.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {developers.map((dev) => (
              <div
                key={dev.id}
                className="liquid-glass rounded-3xl p-6 border border-black/[0.08] flex flex-col justify-between hover:border-black/20 hover:shadow-md transition-all bg-white/70"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    {dev.user.avatar_url ? (
                      <img
                        src={dev.user.avatar_url}
                        alt={dev.user.full_name}
                        className="w-14 h-14 rounded-2xl object-cover ring-1 ring-black/10"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-black/10 flex items-center justify-center font-instrument italic text-xl text-slate-900">
                        {dev.user.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-instrument italic text-xl text-slate-950">{dev.user.full_name}</h4>
                        {dev.user.is_verified && <CheckCircle2 size={14} className="text-emerald-600" />}
                      </div>
                      <p className="text-xs font-mono text-slate-600 font-semibold">{dev.title || 'Software Engineer'}</p>
                      {dev.department && <p className="text-[11px] font-mono text-slate-400">{dev.department}</p>}
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed mb-4">
                    {dev.bio || dev.short_bio || 'Verified core developer contributing to production application architecture and delivery.'}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(dev.skills || []).slice(0, 4).map((s) => (
                      <span key={s.id} className="px-2 py-0.5 rounded-full text-[10px] font-mono liquid-glass text-slate-700 border border-black/10">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                  <Link
                    to={`/developers/${dev.user.username}`}
                    className="text-xs font-semibold text-slate-900 hover:text-black flex items-center gap-1 group"
                  >
                    <span>View Profile</span> <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <span className="text-[10px] font-mono text-slate-400">
                    {dev.years_experience > 0 ? `${dev.years_experience} yrs exp` : 'Verified'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="liquid-glass rounded-3xl p-10 border border-black/[0.08] text-center bg-white/70 max-w-xl mx-auto space-y-4">
            <Users size={32} className="mx-auto text-slate-400" />
            <h4 className="font-instrument italic text-2xl text-slate-900">Engineering Squad Configuration</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Core developer positions are managed directly by the CEO in the CEO Control Center. Verified engineers will be listed here with full attribution.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-medium hover:bg-black transition-colors"
            >
              <span>Learn About Our Platform</span> <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>

      {/* Projects & Deliverables (Tier 3) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="liquid-glass rounded-3xl p-8 border border-black/[0.08] bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Tier 3 · Project Execution</span>
            <h3 className="font-instrument italic text-2xl text-slate-950">Looking to review our production deliverables?</h3>
            <p className="text-slate-600 text-xs">Explore all live projects built by our engineering squad with verified source code links.</p>
          </div>
          <Link
            to="/projects"
            className="px-6 py-3 rounded-full bg-black text-white text-xs font-semibold hover:bg-slate-800 transition-colors shrink-0 shadow-sm flex items-center gap-2"
          >
            <span>Explore Projects</span> <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
