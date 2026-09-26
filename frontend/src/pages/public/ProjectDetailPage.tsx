import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, CheckCircle2,
  Layers, ShieldCheck, Building, MessageSquare,
  Edit3, Trash2, X, AlertCircle
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import type { Project } from '../../types';
import { ContactDeveloperModal } from '../../components/inquiries/ContactDeveloperModal';
import { GithubIcon } from '../../components/common/Icons';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Edit states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Websites');
  const [editShortDescription, setEditShortDescription] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDemoUrl, setEditDemoUrl] = useState('');
  const [editRepoUrl, setEditRepoUrl] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editClientName, setEditClientName] = useState('');
  const [editStatus, setEditStatus] = useState('Published');
  const [editTechnologies, setEditTechnologies] = useState<string[]>([]);
  const [editNewTech, setEditNewTech] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProject(slug);
    }
  }, [slug]);

  const loadProject = async (s: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get(`/projects/${s}`);
      setProject(res.data);
    } catch (e: any) {
      console.error('Error loading project', e);
      setError('Project not found or unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = () => {
    if (!project) return;
    setEditName(project.name);
    setEditCategory(project.category || 'Websites');
    setEditShortDescription(project.short_description || '');
    setEditDescription(project.description || '');
    setEditDemoUrl(project.demo_url || '');
    setEditRepoUrl(project.repo_url || '');
    setEditImageUrl(project.image_url || '');
    setEditClientName(project.client_name || '');
    setEditStatus(project.status || 'Published');
    setEditTechnologies(project.technologies?.map((t) => t.name) || []);
    setEditError(null);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setIsUpdating(true);
    setEditError(null);

    try {
      const res = await api.put(`/projects/${project.id}`, {
        name: editName,
        category: editCategory,
        short_description: editShortDescription,
        description: editDescription,
        demo_url: editDemoUrl || null,
        repo_url: editRepoUrl || null,
        image_url: editImageUrl || null,
        client_name: editClientName || null,
        status: editStatus,
        technologies: editTechnologies,
      });

      setProject(res.data);
      setEditModalOpen(false);
    } catch (err: any) {
      console.error('Failed to update project', err);
      setEditError(err.response?.data?.detail || 'Failed to update project.');
    } finally {
      setIsUpdating(false);
    }
  };

  const addEditTech = () => {
    if (editNewTech.trim() && !editTechnologies.includes(editNewTech.trim())) {
      setEditTechnologies([...editTechnologies, editNewTech.trim()]);
      setEditNewTech('');
    }
  };

  const removeEditTech = (tech: string) => {
    setEditTechnologies(editTechnologies.filter((t) => t !== tech));
  };

  const handleDelete = async () => {
    if (!project) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${project.name}"?`)) return;

    try {
      await api.delete(`/projects/${project.id}`);
      navigate('/projects');
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Failed to delete project.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-slate-100/70 rounded-3xl h-96 animate-pulse mb-8 border border-black/[0.05]" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-100/70 rounded-2xl h-48 animate-pulse border border-black/[0.05]" />
              <div className="bg-slate-100/70 rounded-2xl h-32 animate-pulse border border-black/[0.05]" />
            </div>
            <div className="space-y-6">
              <div className="bg-slate-100/70 rounded-2xl h-64 animate-pulse border border-black/[0.05]" />
              <div className="bg-slate-100/70 rounded-2xl h-40 animate-pulse border border-black/[0.05]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-slate-400 text-xs tracking-widest uppercase mb-4 font-mono">Error</p>
          <h2 className="font-instrument italic text-3xl text-slate-900 mb-3">Architecture Not Found</h2>
          <p className="text-slate-600 text-sm mb-8">{error || 'This architecture may have been moved or removed.'}</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 liquid-glass rounded-full text-slate-900 text-xs font-semibold border border-black/10 hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Back to Architectures</span>
          </Link>
        </div>
      </div>
    );
  }

  const isAuthorized =
    user &&
    (['super_admin', 'managing_director', 'admin'].includes(user.role) ||
      project.developer_associations.some((a) => a.developer.user?.id === user.id));

  const leadDeveloper =
    project.developer_associations.find((d) => d.is_lead)?.developer ||
    project.developer_associations[0]?.developer;

  const inputCls =
    'w-full bg-white border border-black/10 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:border-black/30 focus:outline-none px-4 py-3 shadow-xs';

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Back and Authorized Controls */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Architectures Showcase</span>
          </Link>

          {isAuthorized && (
            <div className="flex items-center gap-2">
              <button
                onClick={openEditModal}
                className="px-4 py-2 rounded-full liquid-glass text-xs font-medium text-slate-700 hover:text-black border border-black/10 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 size={13} />
                <span>Modify Architecture</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-full liquid-glass text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Hero Banner with Image */}
        <div className="relative rounded-3xl overflow-hidden mb-10 border border-black/[0.08] shadow-md">
          <div className="h-64 sm:h-[420px] w-full relative">
            <img
              src={project.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80'}
              alt={project.name}
              className="w-full h-full object-cover"
            />
            {/* High contrast gradient overlay for legible text on photos */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent" />
          </div>

          {/* Floating overlay card */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <span className="liquid-glass text-white/90 text-xs tracking-widest uppercase rounded-full px-3 py-1 inline-block mb-3 border border-white/20">
                  {project.category}
                </span>
                <h1 className="font-instrument italic text-4xl sm:text-5xl text-white tracking-tight leading-tight">
                  {project.name}
                </h1>
                {project.client_name && (
                  <p className="text-white/80 text-sm flex items-center gap-1.5 mt-2">
                    <Building size={14} className="text-white/60" />
                    <span>
                      Engineered for{' '}
                      <strong className="text-white font-semibold">{project.client_name}</strong>
                    </span>
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-white text-slate-900 font-semibold text-xs flex items-center gap-2 hover:bg-slate-100 transition-all shadow-md"
                  >
                    <ExternalLink size={14} />
                    <span>Live Demo</span>
                  </a>
                )}
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full liquid-glass text-white font-semibold text-xs flex items-center gap-2 hover:bg-white/10 border border-white/20 transition-all"
                  >
                    <GithubIcon size={14} />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid: Details & Team Attribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Details (2 cols) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Overview */}
            <div className="liquid-glass rounded-2xl p-6 sm:p-8 border border-black/[0.08] shadow-sm bg-white/70">
              <h2 className="font-instrument italic text-2xl text-slate-900 mb-4">
                Architecture &amp; Project Overview
              </h2>
              <div className="border-t border-black/[0.06] pt-4">
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {project.description || project.short_description}
                </p>
              </div>
            </div>

            {/* Technologies Used */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="liquid-glass rounded-2xl p-6 sm:p-8 border border-black/[0.08] shadow-sm bg-white/70">
                <h2 className="font-instrument italic text-2xl text-slate-900 mb-4 flex items-center gap-2">
                  <Layers size={18} className="text-slate-400" />
                  <span>Technologies Applied</span>
                </h2>
                <div className="border-t border-black/[0.06] pt-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <span
                        key={t.id}
                        className="liquid-glass text-xs text-slate-700 rounded-full px-3 py-1.5 font-mono border border-black/[0.08] bg-slate-50/60"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Team Attribution Card */}
            <div className="liquid-glass rounded-2xl p-6 border border-black/[0.08] shadow-sm bg-white/70">
              <div className="flex items-center gap-1.5 mb-4">
                <ShieldCheck size={13} className="text-slate-400" />
                <p className="text-slate-400 text-xs tracking-widest uppercase font-mono">
                  Project Creators
                </p>
              </div>

              <div className="space-y-3">
                {project.developer_associations.map((assoc) => (
                  <Link
                    key={assoc.id}
                    to={`/developers/${assoc.developer.user.username}`}
                    className="liquid-glass rounded-2xl p-4 flex items-center gap-3.5 group block hover:bg-slate-50/80 transition-all border border-black/[0.06]"
                  >
                    {assoc.developer.user.avatar_url ? (
                      <img
                        src={assoc.developer.user.avatar_url}
                        alt={assoc.developer.user.full_name}
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-black/[0.08] shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-black/[0.08] flex items-center justify-center text-slate-800 font-bold text-sm shrink-0">
                        {assoc.developer.user.full_name.charAt(0)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-black transition-colors truncate">
                          {assoc.developer.user.full_name}
                        </span>
                        {assoc.developer.user.is_verified && (
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-slate-500 block">
                        {assoc.role_in_project}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        @{assoc.developer.user.username}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Inquire CTA */}
              {leadDeveloper && (
                <div className="mt-5 pt-5 border-t border-black/[0.06]">
                  <button
                    onClick={() => setContactModalOpen(true)}
                    className="w-full py-3 rounded-full bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md"
                  >
                    <MessageSquare size={14} />
                    <span>Inquire Similar System</span>
                  </button>
                </div>
              )}
            </div>

            {/* Project Metadata */}
            <div className="liquid-glass rounded-2xl p-6 border border-black/[0.08] shadow-sm bg-white/70">
              <h3 className="font-instrument italic text-lg text-slate-900 mb-4">Metadata</h3>
              <div className="space-y-0 text-xs">
                <div className="flex justify-between py-2.5 border-b border-black/[0.06]">
                  <span className="text-slate-400">Category</span>
                  <span className="text-slate-900 font-semibold">{project.category}</span>
                </div>
                {project.start_date && (
                  <div className="flex justify-between py-2.5 border-b border-black/[0.06]">
                    <span className="text-slate-400">Start Date</span>
                    <span className="text-slate-600 font-mono">{project.start_date}</span>
                  </div>
                )}
                {project.completion_date && (
                  <div className="flex justify-between py-2.5 border-b border-black/[0.06]">
                    <span className="text-slate-400">Delivered</span>
                    <span className="text-slate-600 font-mono">{project.completion_date}</span>
                  </div>
                )}
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-400">Status</span>
                  <span className="text-slate-900 font-semibold">{project.status}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Inquiry Modal */}
        {contactModalOpen && leadDeveloper && (
          <ContactDeveloperModal
            developer={leadDeveloper as any}
            isOpen={contactModalOpen}
            onClose={() => setContactModalOpen(false)}
          />
        )}

        {/* Edit Architecture Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto liquid-glass rounded-3xl border border-black/[0.08] p-6 sm:p-8 shadow-2xl bg-white/95">
              <button
                onClick={() => setEditModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 rounded-full liquid-glass border border-black/10 transition-colors"
              >
                <X size={18} />
              </button>

              <h2 className="font-instrument italic text-2xl text-slate-900 mb-1">Modify Published Architecture</h2>
              <p className="text-slate-500 text-xs mb-6">
                Update technical specifications, live endpoints, or descriptions for <span className="text-slate-900 font-medium">{project.name}</span>.
              </p>

              {editError && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-500" />
                  <span>{editError}</span>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 text-xs tracking-widest uppercase mb-1.5 font-mono">Project Name *</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-xs tracking-widest uppercase mb-1.5 font-mono">Category *</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className={inputCls}
                    >
                      <option value="Websites">Websites</option>
                      <option value="Apps">Mobile Apps</option>
                      <option value="Software">Software Architecture</option>
                      <option value="AI/ML">AI / Machine Learning</option>
                      <option value="SaaS">Enterprise SaaS</option>
                      <option value="Automation">Automation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 text-xs tracking-widest uppercase mb-1.5 font-mono">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className={inputCls}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 text-xs tracking-widest uppercase mb-1.5 font-mono">Client / Sponsor</label>
                    <input
                      type="text"
                      value={editClientName}
                      onChange={(e) => setEditClientName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-xs tracking-widest uppercase mb-1.5 font-mono">Short Summary</label>
                  <input
                    type="text"
                    value={editShortDescription}
                    onChange={(e) => setEditShortDescription(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-xs tracking-widest uppercase mb-1.5 font-mono">Full Architectural Overview</label>
                  <textarea
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 text-xs tracking-widest uppercase mb-1.5 font-mono">Live Demo URL</label>
                    <input
                      type="url"
                      value={editDemoUrl}
                      onChange={(e) => setEditDemoUrl(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-xs tracking-widest uppercase mb-1.5 font-mono">Source Repository URL</label>
                    <input
                      type="url"
                      value={editRepoUrl}
                      onChange={(e) => setEditRepoUrl(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-xs tracking-widest uppercase mb-1.5 font-mono">Cover Image URL</label>
                  <input
                    type="url"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className={inputCls}
                  />
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-slate-500 text-xs tracking-widest uppercase mb-1.5 font-mono">Technologies</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editTechnologies.map((t) => (
                      <span key={t} className="liquid-glass text-xs text-slate-700 px-3 py-1 rounded-full flex items-center gap-1.5 border border-black/10 bg-slate-50">
                        {t}
                        <button type="button" onClick={() => removeEditTech(t)} className="text-slate-400 hover:text-black">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editNewTech}
                      onChange={(e) => setEditNewTech(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEditTech(); } }}
                      placeholder="Add technology (e.g. Next.js, Rust)"
                      className={inputCls}
                    />
                    <button type="button" onClick={addEditTech} className="px-5 py-3 rounded-xl bg-black text-white text-xs font-semibold hover:bg-slate-800 shrink-0">
                      Add
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/[0.06] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-full liquid-glass text-xs font-medium text-slate-600 hover:text-black border border-black/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-7 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 shadow-sm"
                  >
                    {isUpdating ? 'Saving Changes…' : 'Save Modifications'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
