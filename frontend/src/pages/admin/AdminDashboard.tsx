import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, CheckCircle2, RefreshCw, UserCheck, Users,
  FolderGit2, MessageSquare, Edit3, Trash2, ExternalLink, X, Plus,
  Camera, AlertCircle, Mail, Phone, MapPin
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import type { DashboardStats, DeveloperProfile, ClientInquiry, User, Project } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user: currentUser, refreshUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [pendingDevs, setPendingDevs] = useState<DeveloperProfile[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'pending' | 'projects' | 'inquiries'>('members');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Search & filter for members
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Edit Person Modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    phone: '',
    avatar_url: '',
    role: 'developer',
    status: 'approved',
    is_verified: true,
    is_active: true,
    title: '',
    short_bio: '',
    bio: '',
    location: '',
    availability: 'Available for Projects',
    years_experience: 1,
    skills: [] as string[],
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
    resume_url: '',
    company_name: '',
    website: '',
    industry: '',
  });
  const [newSkillInput, setNewSkillInput] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [statsRes, usersRes, pendingRes, projRes, inqRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/pending-developers'),
        api.get('/admin/projects'),
        api.get('/admin/inquiries'),
      ]);
      setStats(statsRes.data);
      setAllUsers(usersRes.data);
      setPendingDevs(pendingRes.data);
      setAllProjects(projRes.data);
      setInquiries(inqRes.data);
    } catch (e) {
      console.error('Error loading admin data', e);
    }
  };

  const openEditModal = (targetUser: User) => {
    setEditingUser(targetUser);
    const devP = targetUser.developer_profile;
    const clientP = targetUser.client_profile;
    setEditFormData({
      full_name: targetUser.full_name || '',
      phone: targetUser.phone || '',
      avatar_url: targetUser.avatar_url || '',
      role: targetUser.role || 'developer',
      status: targetUser.status || 'approved',
      is_verified: targetUser.is_verified ?? true,
      is_active: targetUser.is_active ?? true,
      title: devP?.title || '',
      short_bio: devP?.short_bio || '',
      bio: devP?.bio || '',
      location: devP?.location || '',
      availability: devP?.availability || 'Available for Projects',
      years_experience: devP?.years_experience || 1,
      skills: devP?.skills ? devP.skills.map((s) => s.name) : [],
      github_url: devP?.github_url || '',
      linkedin_url: devP?.linkedin_url || '',
      portfolio_url: devP?.portfolio_url || '',
      resume_url: devP?.resume_url || '',
      company_name: clientP?.company_name || '',
      website: clientP?.website || '',
      industry: clientP?.industry || '',
    });
    setNewSkillInput('');
    setActionError(null);
  };

  const handleAddSkill = () => {
    const clean = newSkillInput.trim();
    if (clean && !editFormData.skills.includes(clean)) {
      setEditFormData({ ...editFormData, skills: [...editFormData.skills, clean] });
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditFormData({
      ...editFormData,
      skills: editFormData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSaving(true);
    setActionError(null);
    try {
      await api.put(`/admin/users/${editingUser.id}`, {
        ...editFormData,
        years_experience: Number(editFormData.years_experience),
      });

      setActionSuccess(`Updated details for ${editFormData.full_name || editingUser.username} successfully!`);
      setTimeout(() => setActionSuccess(null), 4000);
      setEditingUser(null);
      await loadAdminData();

      // If updating the currently signed-in user, refresh the global AuthContext
      if (currentUser && currentUser.id === editingUser.id) {
        await refreshUser();
      }
    } catch (err: any) {
      console.error('Error updating user', err);
      setActionError(err.response?.data?.detail || 'Failed to update user. Please verify inputs.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/admin/users/${userId}`);
      setActionSuccess(`User "${name}" has been deleted.`);
      setTimeout(() => setActionSuccess(null), 3000);
      loadAdminData();
    } catch (err: any) {
      console.error('Error deleting user', err);
      alert(err.response?.data?.detail || 'Could not delete user.');
    }
  };

  const handleApplicationAction = async (devProfileId: number, action: 'approve' | 'reject') => {
    try {
      await api.post(`/admin/developers/${devProfileId}/action`, { action });
      setActionSuccess(`Developer application ${action}d successfully!`);
      setTimeout(() => setActionSuccess(null), 3000);
      loadAdminData();
    } catch (e) {
      console.error(`Error performing ${action}`, e);
    }
  };

  if (!currentUser || !['super_admin', 'managing_director', 'admin'].includes(currentUser.role)) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-6">
        <div className="liquid-glass rounded-3xl p-10 text-center max-w-md w-full border border-black/[0.08] shadow-sm bg-white/70">
          <ShieldCheck size={48} className="mx-auto text-slate-400 mb-4" />
          <h2 className="font-instrument italic text-2xl text-slate-950 mb-2">Restricted Administration</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            This portal is reserved for CEO Ritesh Lingamallu, MD M. Shiva Gopi, and appointed administrators.
          </p>
        </div>
      </div>
    );
  }

  // Filtered members list
  const filteredUsers = allUsers.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesRole;
    const matchesName = u.full_name?.toLowerCase().includes(q);
    const matchesUser = u.username?.toLowerCase().includes(q);
    const matchesEmail = u.email?.toLowerCase().includes(q);
    const matchesTitle = u.developer_profile?.title?.toLowerCase().includes(q);
    const matchesSkills = u.developer_profile?.skills?.some((s) => s.name.toLowerCase().includes(q));
    return matchesRole && (matchesName || matchesUser || matchesEmail || matchesTitle || matchesSkills);
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo.png" alt="Bro's Connect" className="w-8 h-8 rounded-full object-cover ring-1 ring-black/10 shadow-sm" />
              <p className="text-slate-400 text-xs tracking-wider uppercase font-mono">
                Bro's Connect Executive Control Center
              </p>
            </div>
            <h1 className="font-instrument italic text-4xl text-slate-950">
              Platform Administration
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Operating as{' '}
              <span className="text-slate-900 font-semibold">{currentUser.full_name}</span>{' '}
              (
              {currentUser.role === 'super_admin'
                ? 'Chief Executive Officer'
                : currentUser.role === 'managing_director'
                ? 'Managing Director'
                : 'Administrator'}
              )
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openEditModal(currentUser)}
              className="bg-black text-white hover:bg-slate-800 rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <Edit3 size={13} />
              <span>Edit My Profile</span>
            </button>

            <button
              onClick={loadAdminData}
              className="liquid-glass text-slate-700 hover:text-black rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-2 transition-all border border-black/10 hover:bg-slate-50 shadow-2xs"
            >
              <RefreshCw size={13} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {actionSuccess && (
          <div className="liquid-glass rounded-2xl p-4 flex items-center gap-3 border border-emerald-200 bg-emerald-50/80 text-emerald-800 text-sm shadow-2xs">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-medium">{actionSuccess}</span>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="liquid-glass rounded-2xl p-5 border border-black/[0.08] shadow-sm bg-white/70">
              <span className="text-slate-400 text-[10px] tracking-wider uppercase font-mono block mb-1">
                Total Users
              </span>
              <span className="text-2xl font-bold text-slate-950 block">
                {allUsers.length}
              </span>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-black/[0.08] shadow-sm bg-white/70">
              <span className="text-slate-400 text-[10px] tracking-wider uppercase font-mono block mb-1">
                Verified Devs
              </span>
              <span className="text-2xl font-bold text-slate-950 block">
                {stats.verified_developers}
              </span>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-black/[0.08] shadow-sm bg-white/70">
              <span className="text-slate-400 text-[10px] tracking-wider uppercase font-mono block mb-1">
                Pending Apps
              </span>
              <span className="text-2xl font-bold text-slate-950 block">
                {stats.pending_applications}
              </span>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-black/[0.08] shadow-sm bg-white/70">
              <span className="text-slate-400 text-[10px] tracking-wider uppercase font-mono block mb-1">
                Projects
              </span>
              <span className="text-2xl font-bold text-slate-950 block">
                {stats.total_projects}
              </span>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-black/[0.08] shadow-sm bg-white/70">
              <span className="text-slate-400 text-[10px] tracking-wider uppercase font-mono block mb-1">
                Clients
              </span>
              <span className="text-2xl font-bold text-slate-950 block">
                {stats.total_clients}
              </span>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-black/[0.08] shadow-sm bg-white/70">
              <span className="text-slate-400 text-[10px] tracking-wider uppercase font-mono block mb-1">
                Inquiries
              </span>
              <span className="text-2xl font-bold text-slate-950 block">
                {stats.total_inquiries}
              </span>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 border-b border-black/[0.06] pb-3">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'members'
                ? 'bg-black text-white shadow-xs'
                : 'liquid-glass text-slate-600 hover:text-black border border-black/10 bg-slate-50/70'
            }`}
          >
            <Users size={13} />
            <span>Members & Profiles ({allUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-black text-white shadow-xs'
                : 'liquid-glass text-slate-600 hover:text-black border border-black/10 bg-slate-50/70'
            }`}
          >
            <UserCheck size={13} />
            <span>Approval Queue</span>
            {pendingDevs.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                  activeTab === 'pending'
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {pendingDevs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-black text-white shadow-xs'
                : 'liquid-glass text-slate-600 hover:text-black border border-black/10 bg-slate-50/70'
            }`}
          >
            <FolderGit2 size={13} />
            <span>Published Projects ({allProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'inquiries'
                ? 'bg-black text-white shadow-xs'
                : 'liquid-glass text-slate-600 hover:text-black border border-black/10 bg-slate-50/70'
            }`}
          >
            <MessageSquare size={13} />
            <span>Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* ── Tab 1: Members & Profiles (Universal Edit) ── */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member by name, username, skill, title, email..."
                className="w-full sm:max-w-md bg-white border border-black/10 rounded-xl text-slate-900 text-xs px-4 py-2.5 placeholder-slate-400 focus:outline-none focus:border-black/30 shadow-2xs"
              />

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-400 text-xs font-mono">Role:</span>
                {['all', 'developer', 'super_admin', 'client'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                      roleFilter === r
                        ? 'bg-black text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r === 'all' ? 'All' : r === 'super_admin' ? 'Admin' : r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Members Grid / Cards */}
            {filteredUsers.length === 0 ? (
              <div className="liquid-glass rounded-3xl p-16 text-center border border-black/[0.08] shadow-sm bg-white/70">
                <Users size={36} className="mx-auto text-slate-300 mb-2" />
                <h3 className="font-instrument italic text-xl text-slate-950 mb-1">No Members Match</h3>
                <p className="text-slate-500 text-xs">Try clearing the search query or role filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.map((u) => {
                  const devP = u.developer_profile;
                  const isCurrent = currentUser.id === u.id;
                  return (
                    <div
                      key={u.id}
                      className="liquid-glass rounded-2xl p-5 border border-black/[0.08] shadow-sm bg-white/80 flex flex-col justify-between gap-4 hover:border-black/20 transition-all"
                    >
                      <div className="space-y-3">
                        {/* Top row with avatar and role badges */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {u.avatar_url ? (
                              <img
                                src={u.avatar_url}
                                alt={u.full_name}
                                className="w-12 h-12 rounded-xl object-cover ring-1 ring-black/10 shadow-2xs"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-black/10 flex items-center justify-center text-slate-800 text-lg font-bold">
                                {u.full_name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-slate-950 font-semibold text-sm leading-tight">
                                  {u.full_name}
                                </h3>
                                {u.is_verified && (
                                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                                )}
                                {isCurrent && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-900 text-white font-mono">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-400 text-xs font-mono">@{u.username}</p>
                              <p className="text-slate-600 text-xs mt-0.5">
                                {devP?.title || (u.role === 'client' ? u.client_profile?.company_name || 'Client' : 'Platform Member')}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                                u.role === 'super_admin'
                                  ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                  : u.role === 'admin' || u.role === 'managing_director'
                                  ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                  : u.role === 'client'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-slate-100 text-slate-800 border border-slate-200'
                              }`}
                            >
                              {u.role.toUpperCase()}
                            </span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                                u.status === 'approved'
                                  ? 'text-emerald-700 bg-emerald-50'
                                  : u.status === 'pending'
                                  ? 'text-amber-700 bg-amber-50'
                                  : 'text-rose-700 bg-rose-50'
                              }`}
                            >
                              {u.status}
                            </span>
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="text-xs text-slate-500 space-y-0.5">
                          <p className="flex items-center gap-1.5">
                            <Mail size={12} className="text-slate-400" />
                            <span>{u.email}</span>
                          </p>
                          {u.phone && (
                            <p className="flex items-center gap-1.5">
                              <Phone size={12} className="text-slate-400" />
                              <span>{u.phone}</span>
                            </p>
                          )}
                          {devP?.location && (
                            <p className="flex items-center gap-1.5">
                              <MapPin size={12} className="text-slate-400" />
                              <span>{devP.location}</span>
                            </p>
                          )}
                        </div>

                        {/* Skills preview */}
                        {devP?.skills && devP.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {devP.skills.slice(0, 6).map((s) => (
                              <span
                                key={s.id}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono border border-black/5"
                              >
                                {s.name}
                              </span>
                            ))}
                            {devP.skills.length > 6 && (
                              <span className="text-[10px] text-slate-400 font-mono self-center">
                                +{devP.skills.length - 6} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card actions */}
                      <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {u.projects_count ?? 0} Project{u.projects_count === 1 ? '' : 's'}
                        </span>

                        <div className="flex items-center gap-2">
                          {devP && (
                            <Link
                              to={`/developers/${u.username}`}
                              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-black text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1"
                            >
                              <ExternalLink size={12} />
                              <span>View</span>
                            </Link>
                          )}

                          <button
                            onClick={() => openEditModal(u)}
                            className="bg-black text-white hover:bg-slate-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                          >
                            <Edit3 size={12} />
                            <span>Edit Details</span>
                          </button>

                          {!isCurrent && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.full_name)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: Developer Approval Queue ── */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingDevs.length === 0 ? (
              <div className="liquid-glass rounded-3xl p-16 text-center border border-black/[0.08] shadow-sm bg-white/70">
                <CheckCircle2 size={40} className="mx-auto text-slate-300 mb-3" />
                <h3 className="font-instrument italic text-2xl text-slate-950 mb-1">
                  All Applications Reviewed
                </h3>
                <p className="text-slate-500 text-sm">
                  There are no pending developer registrations waiting for approval.
                </p>
              </div>
            ) : (
              pendingDevs.map((dev) => (
                <div
                  key={dev.id}
                  className="liquid-glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-black/[0.08] shadow-sm bg-white/70"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 border border-black/[0.08] flex items-center justify-center text-slate-900 text-lg font-bold shrink-0 shadow-2xs">
                      {dev.user.full_name.charAt(0)}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-slate-950 font-semibold text-base">
                          {dev.user.full_name}
                        </h3>
                        <span className="text-slate-400 text-xs font-mono">
                          @{dev.user.username}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-amber-200 bg-amber-50 text-amber-800 font-mono">
                          Pending Review
                        </span>
                      </div>

                      <p className="text-slate-700 text-sm">
                        {dev.title || 'Software Developer'}
                      </p>

                      {dev.short_bio && (
                        <p className="text-slate-500 text-xs mt-1 max-w-xl leading-relaxed">
                          {dev.short_bio}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {dev.skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="px-2.5 py-0.5 rounded-full text-xs font-mono border border-black/10 bg-white text-slate-700 shadow-2xs"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleApplicationAction(dev.id, 'approve')}
                      className="bg-black text-white hover:bg-slate-800 px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve & Verify</span>
                    </button>

                    <button
                      onClick={() => handleApplicationAction(dev.id, 'reject')}
                      className="liquid-glass text-slate-600 hover:text-rose-600 hover:border-rose-200 px-4 py-2.5 rounded-full text-xs font-semibold transition-all border border-black/10 bg-slate-50"
                    >
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Tab 3: All Published Projects ── */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {allProjects.length === 0 ? (
              <div className="liquid-glass rounded-3xl p-16 text-center border border-black/[0.08] shadow-sm bg-white/70">
                <FolderGit2 size={40} className="mx-auto text-slate-300 mb-3" />
                <h3 className="font-instrument italic text-2xl text-slate-950 mb-1">
                  No Projects Yet
                </h3>
                <p className="text-slate-500 text-sm">
                  Verified developers and administrators can create and publish architectures.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allProjects.map((p) => (
                  <div
                    key={p.id}
                    className="liquid-glass rounded-2xl p-5 border border-black/[0.08] shadow-sm bg-white/80 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                            {p.category}
                          </span>
                          <h3 className="text-slate-950 font-semibold text-base leading-snug">
                            {p.name}
                          </h3>
                          <p className="text-slate-400 text-xs font-mono">/{p.slug}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                          {p.status}
                        </span>
                      </div>

                      {p.short_description && (
                        <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                          {p.short_description}
                        </p>
                      )}

                      {/* Tech stack */}
                      {p.technologies && p.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.technologies.map((t) => (
                            <span
                              key={t.id}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono border border-black/5"
                            >
                              {t.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {p.client_name ? `Client: ${p.client_name}` : 'Internal / Community'}
                      </span>

                      <Link
                        to={`/projects/${p.slug}`}
                        className="px-3.5 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-2xs"
                      >
                        <ExternalLink size={12} />
                        <span>View Project</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab 4: Inquiries Pipeline ── */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="liquid-glass rounded-3xl p-16 text-center border border-black/[0.08] shadow-sm bg-white/70">
                <MessageSquare size={40} className="mx-auto text-slate-300 mb-3" />
                <h3 className="font-instrument italic text-2xl text-slate-950 mb-1">
                  Inquiries Pipeline Empty
                </h3>
                <p className="text-slate-500 text-sm">
                  Client inquiries for custom engineering architectures will be logged here.
                </p>
              </div>
            ) : (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="liquid-glass rounded-2xl p-5 border border-black/[0.08] shadow-sm bg-white/70 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block mb-1">
                        Inquiry #{inq.id} · {new Date(inq.created_at).toLocaleDateString()}
                      </span>
                      <h3 className="text-slate-950 font-semibold text-lg">
                        {inq.project_name}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border border-black/10 bg-slate-50 text-slate-800 font-mono self-start sm:self-auto">
                      {inq.status}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                    {inq.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-black/[0.06]">
                    <span>
                      Client:{' '}
                      <strong className="text-slate-800">
                        {inq.client ? inq.client.full_name : 'Guest User'}
                      </strong>
                    </span>
                    <span>
                      Target Developer:{' '}
                      <strong className="text-slate-800">
                        {inq.developer && inq.developer.user
                          ? inq.developer.user.full_name
                          : 'General Team'}
                      </strong>
                    </span>
                    {inq.budget_range && (
                      <span>
                        Budget: <strong className="text-slate-800">₹{inq.budget_range}</strong>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* ── Universal Edit Member Modal ── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-black/10 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-black/[0.08] flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {editFormData.full_name ? editFormData.full_name.charAt(0) : editingUser.username.charAt(0)}
                </div>
                <div>
                  <h2 className="font-instrument italic text-xl text-slate-950">
                    Edit Member Details
                  </h2>
                  <p className="text-xs text-slate-500 font-mono">
                    @{editingUser.username} · {editingUser.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveUser} className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-900">
              {actionError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-500" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* 1. Profile Picture */}
              <div className="space-y-3 pb-4 border-b border-black/[0.06]">
                <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider font-mono">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  {editFormData.avatar_url ? (
                    <img
                      src={editFormData.avatar_url}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-black/10 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-black/10 flex items-center justify-center text-slate-400">
                      <Camera size={22} />
                    </div>
                  )}

                  <div className="flex-1 space-y-1">
                    <input
                      type="url"
                      value={editFormData.avatar_url}
                      onChange={(e) => setEditFormData({ ...editFormData, avatar_url: e.target.value })}
                      placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black/30"
                    />
                    <p className="text-[11px] text-slate-400">
                      Direct image link (JPG/PNG). Leave empty to use default initials.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Core Account Info */}
              <div className="space-y-4 pb-4 border-b border-black/[0.06]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Account Credentials & Governance
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 text-xs font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.full_name}
                      onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      placeholder="+91 9400900000"
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-medium mb-1">Platform Role</label>
                    <select
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                    >
                      <option value="developer">Developer</option>
                      <option value="super_admin">Super Admin (CEO)</option>
                      <option value="managing_director">Managing Director (MD)</option>
                      <option value="admin">Administrator</option>
                      <option value="client">Client</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-medium mb-1">Account Status</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending Review</option>
                      <option value="rejected">Rejected</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={editFormData.is_verified}
                      onChange={(e) => setEditFormData({ ...editFormData, is_verified: e.target.checked })}
                      className="rounded text-black focus:ring-black w-4 h-4"
                    />
                    <span>Verified Developer Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={editFormData.is_active}
                      onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.checked })}
                      className="rounded text-black focus:ring-black w-4 h-4"
                    />
                    <span>Account Active</span>
                  </label>
                </div>
              </div>

              {/* 3. Developer / Leadership Profile Details */}
              <div className="space-y-4 pb-4 border-b border-black/[0.06]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Profile Details & Technical Focus
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 text-xs font-medium mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      placeholder="e.g. Chief Executive Officer (CEO)"
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-medium mb-1">Location</label>
                    <input
                      type="text"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      placeholder="e.g. Hyderabad, India"
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-medium mb-1">Availability Status</label>
                    <input
                      type="text"
                      value={editFormData.availability}
                      onChange={(e) => setEditFormData({ ...editFormData, availability: e.target.value })}
                      placeholder="e.g. Available for Projects"
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-medium mb-1">Years of Experience</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={editFormData.years_experience}
                      onChange={(e) => setEditFormData({ ...editFormData, years_experience: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-medium mb-1">Short Bio</label>
                  <input
                    type="text"
                    value={editFormData.short_bio}
                    onChange={(e) => setEditFormData({ ...editFormData, short_bio: e.target.value })}
                    placeholder="Brief 1-sentence tagline..."
                    className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-medium mb-1">Full Bio / Leadership Statement</label>
                  <textarea
                    rows={3}
                    value={editFormData.bio}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    placeholder="Comprehensive description of engineering capabilities, achievements, or vision..."
                    className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black/30 resize-none"
                  />
                </div>
              </div>

              {/* 4. Skills Management */}
              <div className="space-y-3 pb-4 border-b border-black/[0.06]">
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider font-mono">
                  Skills & Technical Domains ({editFormData.skills.length})
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 border border-black/10 min-h-[48px]">
                  {editFormData.skills.length === 0 ? (
                    <span className="text-slate-400 text-xs italic">No skills listed yet. Add one below.</span>
                  ) : (
                    editFormData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-white border border-black/10 text-slate-800 text-xs font-mono flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type skill name (e.g. Next.js, AI/ML, Docker) and click Add"
                    className="flex-1 bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-black text-white hover:bg-slate-800 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1"
                  >
                    <Plus size={13} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* 5. Social & Portfolio Links */}
              <div className="space-y-4 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Online Presence & Artifact Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 text-xs font-medium mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={editFormData.github_url}
                      onChange={(e) => setEditFormData({ ...editFormData, github_url: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-medium mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={editFormData.linkedin_url}
                      onChange={(e) => setEditFormData({ ...editFormData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-medium mb-1">Portfolio / Work Details URL</label>
                    <input
                      type="url"
                      value={editFormData.portfolio_url}
                      onChange={(e) => setEditFormData({ ...editFormData, portfolio_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-medium mb-1">Resume / Document URL</label>
                    <input
                      type="url"
                      value={editFormData.resume_url}
                      onChange={(e) => setEditFormData({ ...editFormData, resume_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-black/10 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-black/30"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-black/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:text-black hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-black text-white hover:bg-slate-800 disabled:opacity-50 px-6 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                >
                  <span>{isSaving ? 'Saving Updates…' : 'Save Member Details'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
