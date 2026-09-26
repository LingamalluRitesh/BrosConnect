import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/common/Icons';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Bro's Connect" className="w-10 h-10 rounded-full object-cover ring-1 ring-black/10 shadow-sm" />
          <p className="text-slate-400 text-xs tracking-widest uppercase font-mono">About Bro's Connect</p>
        </div>
        <h1 className="font-instrument italic text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-slate-950 mb-6 max-w-3xl">
          A technology company <em>powered by</em> verified builders.
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
          Bro's Connect was founded to eliminate the broken dynamics of traditional outsourcing and anonymous
          freelancing. We engineer real-world digital architectures where every software solution is crafted to
          production perfection and publicly attributed to its creators.
        </p>
      </div>

      {/* Leadership */}
      <div className="max-w-6xl mx-auto px-6 py-16 border-t border-black/[0.06]">
        <p className="text-slate-400 text-xs tracking-widest uppercase font-mono mb-10">Executive Leadership</p>
        <div className="grid md:grid-cols-2 gap-6">
          {/* CEO */}
          <div className="liquid-glass rounded-3xl p-8 flex flex-col justify-between border border-black/[0.08] shadow-sm bg-white/70">
            <div>
              <div className="flex items-start gap-5 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-black/[0.08] flex items-center justify-center font-instrument italic text-slate-950 text-2xl shrink-0 shadow-xs">
                  R
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-instrument italic text-slate-950 text-2xl">Ritesh Lingamallu</h3>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <p className="text-slate-600 text-xs font-semibold tracking-widest uppercase font-mono">Chief Executive Officer</p>
                  <p className="text-slate-400 text-xs mt-0.5 font-mono">@ritesh-lingamallu</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Super Admin and Principal Systems Architect. Ritesh leads Bro's Connect's core engineering roadmap,
                distributed backend systems, AI workflows, and platform standards. Spearheaded flagship projects
                including the Solar Management System and Autonomous AI Intelligence engines.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {['Python', 'FastAPI', 'React', 'TypeScript', 'System Architecture', 'AI/ML'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-full text-xs text-slate-700 liquid-glass border border-black/[0.08] bg-slate-50 font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-5 border-t border-black/[0.06] flex items-center justify-between">
              <Link to="/developers/ritesh-lingamallu" className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-black font-medium transition-colors group">
                Full Details <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <div className="flex gap-2">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-full liquid-glass text-slate-600 hover:text-black hover:bg-slate-50 border border-black/10 transition-colors"><GithubIcon size={14} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-full liquid-glass text-slate-600 hover:text-black hover:bg-slate-50 border border-black/10 transition-colors"><LinkedinIcon size={14} /></a>
              </div>
            </div>
          </div>

          {/* MD */}
          <div className="liquid-glass rounded-3xl p-8 flex flex-col justify-between border border-black/[0.08] shadow-sm bg-white/70">
            <div>
              <div className="flex items-start gap-5 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-black/[0.08] flex items-center justify-center font-instrument italic text-slate-950 text-2xl shrink-0 shadow-xs">
                  M
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-instrument italic text-slate-950 text-2xl">M. Shiva Gopi</h3>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <p className="text-slate-600 text-xs font-semibold tracking-widest uppercase font-mono">Managing Director</p>
                  <p className="text-slate-400 text-xs mt-0.5 font-mono">@m-shiva-gopi</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Managing Director overseeing client operations, enterprise digital delivery, and scalable cloud
                infrastructure. Specializes in Kubernetes orchestration, DevOps automation, and enterprise SaaS
                solutions such as the Enterprise Cloud Logistics Suite.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {['Kubernetes', 'Docker', 'AWS', 'Python', 'DevOps', 'Enterprise Architecture'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-full text-xs text-slate-700 liquid-glass border border-black/[0.08] bg-slate-50 font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-5 border-t border-black/[0.06] flex items-center justify-between">
              <Link to="/developers/m-shiva-gopi" className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-black font-medium transition-colors group">
                Full Details <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <div className="flex gap-2">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-full liquid-glass text-slate-600 hover:text-black hover:bg-slate-50 border border-black/10 transition-colors"><GithubIcon size={14} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-full liquid-glass text-slate-600 hover:text-black hover:bg-slate-50 border border-black/10 transition-colors"><LinkedinIcon size={14} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-6xl mx-auto px-6 py-16 border-t border-black/[0.06]">
        <p className="text-slate-400 text-xs tracking-widest uppercase font-mono mb-10">Core Values</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              initial: '✓',
              title: 'Verified Developer Integrity',
              desc: 'Every developer undergoes manual vetting by our technical directors. No ghost accounts, bot profiles, or unverified claims.',
            },
            {
              initial: '⟐',
              title: 'Immutable Attribution',
              desc: "Every product published on Bro's Connect permanently displays the engineers who built it. Build software, get full credit forever.",
            },
            {
              initial: '∞',
              title: 'Free Developer Access',
              desc: 'Developer registration and work details hosting are 100% free. We succeed when our developers build prestigious careers.',
            },
          ].map(({ initial, title, desc }) => (
            <div key={title} className="liquid-glass rounded-2xl p-7 border border-black/[0.08] shadow-sm bg-white/70">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-black/[0.08] flex items-center justify-center text-slate-800 text-lg mb-5 shadow-2xs font-mono">
                {initial}
              </div>
              <h3 className="font-instrument italic text-slate-950 text-xl mb-3">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-6 py-16 border-t border-black/[0.06]">
        <div className="liquid-glass rounded-3xl p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-black/[0.08] shadow-sm bg-white/70">
          <div>
            <h2 className="font-instrument italic text-slate-950 text-3xl mb-2">
              Ready to <em>build together?</em>
            </h2>
            <p className="text-slate-500 text-sm">Join the platform where elite clients meet verified developers.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/register" className="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">Get started</Link>
            <Link to="/developers" className="px-6 py-3 rounded-full liquid-glass text-slate-800 text-sm hover:bg-slate-50 border border-black/10 transition-colors shadow-sm">Meet developers</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
