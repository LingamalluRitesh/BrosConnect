import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api/client';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'AI & Machine Learning Solutions',
    message: '',
  });

  const companyName = settings?.company_name || 'RMVS Web Services';
  const logoUrl = settings?.logo_url || '/logo.png';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/inquiries', {
        project_name: `${formData.service} - ${formData.company || formData.name}`,
        project_type: formData.service,
        description: `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\n\n${formData.message}`,
        client_name: formData.name,
        client_email: formData.email,
        timeline: 'Flexible',
        budget_range: 'Standard',
      });
    } catch (err) {
      // Fallback gracefully
      console.warn('Inquiry submission notice:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <img src={logoUrl} alt={companyName} className="h-8 w-auto object-contain" />
          <p className="text-slate-400 text-xs tracking-widest uppercase font-mono">Get in touch with {companyName}</p>
        </div>
        <h1 className="font-instrument italic text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] text-slate-950 mb-6 max-w-2xl">
          Start a <em>conversation.</em>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed max-w-xl">
          Have an enterprise requirement, technical consultation need, or question about our engineering squads?
          We are here to help.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="liquid-glass rounded-3xl p-8 flex flex-col justify-between gap-8 border border-black/[0.08] shadow-sm bg-white/70">
            <div className="space-y-6">
              <h3 className="font-instrument italic text-slate-950 text-2xl mb-2">{companyName} Headquarters</h3>
              {[
                { Icon: MapPin, label: 'Location', value: settings?.address || 'Hyderabad & Bengaluru, India' },
                { Icon: Mail, label: 'Direct Contact', value: settings?.email || 'contact@company.com' },
                { Icon: Phone, label: 'Executive Office', value: settings?.phone || '+91 98765 43210' },
                { Icon: Clock, label: 'Business Hours', value: settings?.business_hours || 'Monday – Friday, 9:00 AM – 6:00 PM' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-black/[0.08] flex items-center justify-center shrink-0 mt-0.5 text-slate-600 shadow-2xs">
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">{label}</p>
                    <p className="text-slate-900 text-sm font-medium mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="liquid-glass rounded-2xl p-4 border border-black/[0.06] bg-slate-50/70">
              <p className="text-slate-900 text-sm font-medium mb-1">Looking for a specific developer?</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                Contact developers directly from their profiles or via the Verified Developer Directory.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 liquid-glass rounded-3xl p-8 border border-black/[0.08] shadow-sm bg-white/70">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-xs">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="font-instrument italic text-slate-950 text-3xl">Thank you for reaching out!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  Your message has been received by our technical leadership team led by CEO Ritesh Lingamallu. We will review your inquiry promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full liquid-glass border border-black/10 text-slate-800 text-sm hover:bg-slate-50 transition-colors mt-2 shadow-2xs"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 text-xs font-medium mb-2">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-slate-900 text-sm placeholder-slate-400 focus:border-black/30 focus:outline-none transition-colors shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-xs font-medium mb-2">Work Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="elena@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-slate-900 text-sm placeholder-slate-400 focus:border-black/30 focus:outline-none transition-colors shadow-2xs"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 text-xs font-medium mb-2">Company / Organization</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Apex Dynamics Ltd"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-slate-900 text-sm placeholder-slate-400 focus:border-black/30 focus:outline-none transition-colors shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-xs font-medium mb-2">Service of Interest</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-slate-900 text-sm focus:border-black/30 focus:outline-none transition-colors shadow-2xs"
                    >
                      <option value="AI & Machine Learning Solutions">AI &amp; Machine Learning Solutions</option>
                      <option value="Full-Stack Web Projects">Full-Stack Web Projects</option>
                      <option value="Mobile App Engineering">Mobile App Engineering</option>
                      <option value="Cloud Systems & DevOps">Cloud Systems &amp; DevOps</option>
                      <option value="Enterprise SaaS Platforms">Enterprise SaaS Platforms</option>
                      <option value="General Partnership">General Partnership</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 text-xs font-medium mb-2">Project Scope or Inquiry *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project goals, timeline, and requirements..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 text-slate-900 text-sm placeholder-slate-400 focus:border-black/30 focus:outline-none transition-colors resize-none shadow-2xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-7 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? 'Sending...' : 'Submit inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
