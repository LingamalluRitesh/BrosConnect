import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email_or_username: identifier.trim(), password });
      login(res.data.access_token, res.data.user);
      if (['super_admin', 'managing_director', 'admin'].includes(res.data.user.role)) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-2">
            <img src="/logo.png" alt="Bro's Connect" className="w-12 h-12 rounded-full object-cover ring-1 ring-black/10 shadow-sm" />
            <span className="font-instrument italic text-slate-950 text-3xl">Bro's Connect</span>
          </Link>
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400 mb-3">BUILD • CONNECT • GROW</p>
          <h2 className="font-instrument italic text-slate-800 text-xl">Sign in to your workspace</h2>
          <p className="text-slate-500 text-xs mt-1">Access developer projects, community channels, and client inquiries.</p>
        </div>

        {/* Card */}
        <div className="liquid-glass rounded-3xl p-8 space-y-6 border border-black/[0.08] shadow-sm bg-white/70">
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-600 text-xs font-medium mb-2">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your registered email or username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-black/10 text-slate-900 text-sm placeholder-slate-400 focus:border-black/30 focus:outline-none transition-colors shadow-2xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-600 text-xs font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-black/10 text-slate-900 text-sm placeholder-slate-400 focus:border-black/30 focus:outline-none transition-colors shadow-2xs"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-all mt-2 shadow-sm"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="pt-4 border-t border-black/[0.06] text-center space-y-2">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-slate-900 hover:underline underline-offset-2 font-semibold transition-colors">
                Register as Developer, Client, or Admin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
