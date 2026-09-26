import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const services = [
    {
      num: '01',
      title: 'AI & Machine Learning Solutions',
      tagline: 'Autonomous reasoning, predictive models, and agent workflows',
      deliverables: [
        'Fine-tuned LLMs & Private Enterprise Agent Frameworks',
        'Retrieval-Augmented Generation (RAG) over internal databases',
        'Real-time Computer Vision & Edge Video Analytics',
        'Predictive Maintenance & Degradation Modeling',
      ],
    },
    {
      num: '02',
      title: 'Full-Stack Web Architectures',
      tagline: 'Lightning-fast, highly concurrent web systems',
      deliverables: [
        'FastAPI & Python high-throughput microservices',
        'Modern React & TypeScript responsive single-page applications',
        'Real-time WebSocket streaming architectures',
        'PostgreSQL schema optimization & asynchronous ORM layers',
      ],
    },
    {
      num: '03',
      title: 'Mobile App Engineering',
      tagline: 'Native performance on iOS & Android platforms',
      deliverables: [
        'Cross-platform Flutter & React Native applications',
        'Offline-first synchronization with SQLite and local caching',
        'Biometric authentication & secure cryptographic key stores',
        'Push notifications & background telemetry sync',
      ],
    },
    {
      num: '04',
      title: 'Cloud Infrastructure & DevOps',
      tagline: 'Resilient multi-region cloud deployments',
      deliverables: [
        'Docker containerization and Kubernetes cluster management',
        'Automated GitHub Actions CI/CD pipelines',
        'Infrastructure-as-Code (Terraform / CloudFormation)',
        'Prometheus & Grafana centralized observability',
      ],
    },
    {
      num: '05',
      title: 'Enterprise SaaS Platforms',
      tagline: 'Scalable multi-tenant products built for enterprise scale',
      deliverables: [
        'Multi-tenant database isolation & tenant routing',
        'Role-Based Access Control (RBAC) & granular permissions',
        'Automated subscription lifecycle & audit logging',
        'Customer self-service admin portals',
      ],
    },
    {
      num: '06',
      title: 'CRM & Workflow Automation',
      tagline: 'Connecting distributed business pipelines',
      deliverables: [
        'End-to-end client inquiry & sales pipeline systems',
        'Automated email, SMS, and WhatsApp notification dispatch',
        'Third-party ERP and payment gateway integrations',
        'Comprehensive audit trails & compliance monitoring',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Bro's Connect" className="w-10 h-10 rounded-full object-cover ring-1 ring-black/10 shadow-sm" />
          <p className="text-slate-400 text-xs tracking-widest uppercase font-mono">Bro's Connect Digital Solutions</p>
        </div>
        <h1 className="font-instrument italic text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-slate-950 mb-6 max-w-3xl">
          Services engineered <em>for scale.</em>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
          From early-stage MVPs to complex distributed enterprise platforms, Bro's Connect verified developer network
          delivers clean, maintainable software with transparent pricing in Indian Rupees (₹).
        </p>
      </div>

      {/* Service grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((svc) => (
            <div
              key={svc.num}
              className="liquid-glass rounded-3xl p-8 flex flex-col justify-between group hover:bg-slate-50/80 transition-all border border-black/[0.08] shadow-sm bg-white/70"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <span className="font-instrument italic text-slate-300 text-3xl font-light">{svc.num}</span>
                </div>
                <h2 className="font-instrument italic text-slate-900 text-2xl mb-2">{svc.title}</h2>
                <p className="text-slate-500 text-sm mb-6">{svc.tagline}</p>
                <ul className="space-y-2.5">
                  {svc.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600 shadow-2xs">
                        <Check size={10} />
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6 border-t border-black/[0.06] flex items-center justify-between mt-6">
                <Link
                  to="/developers"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-black transition-colors"
                >
                  Find engineers <ArrowRight size={11} />
                </Link>
                <Link
                  to="/contact"
                  className="px-4 py-1.5 rounded-full liquid-glass text-xs text-slate-700 hover:text-black hover:bg-slate-100 border border-black/10 transition-colors shadow-2xs"
                >
                  Get quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="liquid-glass rounded-3xl p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-black/[0.08] shadow-sm bg-white/70">
          <div>
            <h2 className="font-instrument italic text-slate-950 text-3xl mb-2">
              <em>Ready to commission</em> your project?
            </h2>
            <p className="text-slate-500 text-sm">Talk to our technical leadership directly.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              Contact us
            </Link>
            <Link
              to="/projects"
              className="px-6 py-3 rounded-full liquid-glass text-slate-800 text-sm hover:bg-slate-50 border border-black/10 transition-colors shadow-sm"
            >
              See projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
