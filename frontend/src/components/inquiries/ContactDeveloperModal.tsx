import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import type { DeveloperProfile } from '../../types';

interface ContactDeveloperModalProps {
  developer: DeveloperProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactDeveloperModal: React.FC<ContactDeveloperModalProps> = ({
  developer,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const companyName = settings?.company_name || 'RMVS Web Services';
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Web Application');
  const [budgetRange, setBudgetRange] = useState('₹50,000 - ₹1,50,000');
  const [timeline, setTimeline] = useState('1-2 Months');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage('Please login or register as a client to submit a project inquiry.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await api.post('/inquiries', {
        developer_id: developer.id,
        project_name: projectName,
        project_type: projectType,
        budget_range: budgetRange,
        timeline: timeline,
        description: description,
      });

      setSuccessMessage(`Inquiry sent directly to ${developer.user.full_name}! They have been notified and will review your requirements.`);
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
        setProjectName('');
        setDescription('');
      }, 2500);
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      setErrorMessage(err.response?.data?.detail || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl liquid-glass border border-black/[0.08] p-6 sm:p-8 shadow-2xl bg-white/95 text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-black rounded-full liquid-glass border border-black/10 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3.5 mb-2.5">
            {developer.user.avatar_url ? (
              <img
                src={developer.user.avatar_url}
                alt={developer.user.full_name}
                className="w-12 h-12 rounded-2xl object-cover ring-1 ring-black/10 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-black/[0.08] flex items-center justify-center font-instrument italic text-slate-900 text-xl shadow-2xs">
                {developer.user.full_name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="font-instrument italic text-2xl text-slate-950">Inquire with {developer.user.full_name}</h2>
              <p className="text-xs text-slate-500 font-medium">{developer.title || 'Verified Developer'}</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Submit your requirements for {companyName} review. Requests are dispatched directly to {developer.user.full_name} and our technical delivery team.
          </p>
        </div>

        {successMessage ? (
          <div className="p-8 rounded-2xl liquid-glass border border-emerald-200 bg-emerald-50/70 text-center flex flex-col items-center gap-3 shadow-2xs">
            <CheckCircle2 size={36} className="text-emerald-600" />
            <p className="text-sm text-emerald-900 font-medium leading-relaxed">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-600 text-xs mb-1.5 font-medium">Project Name *</label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. NextGen Telemetry Dashboard"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/10 text-slate-900 text-sm placeholder-slate-400 focus:border-black/30 focus:outline-none transition-colors shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 text-xs mb-1.5 font-medium">Project Type</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/10 text-slate-900 text-sm focus:border-black/30 focus:outline-none transition-colors shadow-2xs"
                >
                  <option value="Web Application">Web Application</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="AI / ML System">AI / ML System</option>
                  <option value="SaaS Platform">SaaS Platform</option>
                  <option value="Cloud / DevOps">Cloud / DevOps</option>
                  <option value="Custom Software">Custom Software</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 text-xs mb-1.5 font-medium">Budget Range (INR)</label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/10 text-slate-900 text-sm focus:border-black/30 focus:outline-none transition-colors shadow-2xs"
                >
                  <option value="< ₹50,000">&lt; ₹50,000</option>
                  <option value="₹50,000 - ₹1,50,000">₹50,000 - ₹1,50,000</option>
                  <option value="₹1,50,000 - ₹5,00,000">₹1,50,000 - ₹5,00,000</option>
                  <option value="₹5,00,000 - ₹15,00,000">₹5,00,000 - ₹15,00,000</option>
                  <option value="₹15,00,000+">₹15,00,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 text-xs mb-1.5 font-medium">Estimated Timeline</label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/10 text-slate-900 text-sm focus:border-black/30 focus:outline-none transition-colors shadow-2xs"
              >
                <option value="< 1 Month">&lt; 1 Month</option>
                <option value="1-2 Months">1-2 Months</option>
                <option value="3-6 Months">3-6 Months</option>
                <option value="6+ Months">6+ Months</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 text-xs mb-1.5 font-medium">Project Details &amp; Objectives *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your goals, tech expectations, and scope..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/10 text-slate-900 text-sm placeholder-slate-400 focus:border-black/30 focus:outline-none transition-colors resize-none shadow-2xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full liquid-glass text-xs font-medium text-slate-600 hover:text-black border border-black/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 transition-all shadow-sm"
              >
                <Send size={13} />
                <span>{isSubmitting ? 'Sending Request...' : 'Send Inquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
