import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MapPin, ArrowRight, MessageSquare } from 'lucide-react';
import type { DeveloperProfile } from '../../types';

interface DeveloperCardProps {
  developer: DeveloperProfile;
  onContactClick?: (dev: DeveloperProfile) => void;
}

export const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer, onContactClick }) => {
  const user = developer.user;

  return (
    <div className="liquid-glass rounded-3xl p-6 flex flex-col justify-between group hover:bg-slate-50/60 border border-black/[0.08] shadow-sm hover:shadow-md transition-all duration-300 h-full">
      <div>
        {/* Avatar + availability */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="relative">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-14 h-14 rounded-2xl object-cover ring-1 ring-black/10 shadow-sm" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-black/10 flex items-center justify-center font-instrument italic text-slate-900 text-2xl shadow-inner">
                {user.full_name.charAt(0)}
              </div>
            )}
            {user.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <CheckCircle2 size={16} className="text-slate-800" />
              </div>
            )}
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider liquid-glass text-slate-700 border border-black/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {developer.availability?.split(' ')[0] || 'Available'}
            </span>
            {developer.years_experience > 0 && (
              <p className="text-[10px] font-mono text-slate-400 mt-1.5">{developer.years_experience}+ yrs</p>
            )}
          </div>
        </div>

        {/* Name & title */}
        <Link to={`/developers/${user.username}`}>
          <h3 className="font-instrument italic text-slate-900 text-xl group-hover:text-black transition-colors leading-snug">
            {user.full_name}
          </h3>
        </Link>
        <p className="text-slate-400 text-xs mt-0.5 mb-2 font-mono">@{user.username}</p>
        <p className="text-slate-600 text-sm font-medium mb-3">{developer.title || 'Senior Software Architect'}</p>

        {developer.short_bio && (
          <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">{developer.short_bio}</p>
        )}

        {developer.location && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-4">
            <MapPin size={11} className="text-slate-400" />
            {developer.location}
          </div>
        )}

        {/* Skills */}
        {developer.skills && developer.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {developer.skills.slice(0, 4).map((skill) => (
              <span key={skill.id} className="px-2.5 py-0.5 rounded-full text-[10px] font-mono liquid-glass text-slate-700 border border-black/10">
                {skill.name}
              </span>
            ))}
            {developer.skills.length > 4 && (
              <span className="px-2 py-0.5 text-[10px] font-mono text-slate-400">+{developer.skills.length - 4}</span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-black/[0.06] flex items-center gap-2">
        <Link
          to={`/developers/${user.username}`}
          className="flex-1 py-2 px-3 rounded-full liquid-glass text-xs font-semibold text-slate-700 hover:text-black hover:bg-black/[0.04] border border-black/10 flex items-center justify-center gap-1.5 transition-colors"
        >
          Full Details <ArrowRight size={12} />
        </Link>
        {onContactClick ? (
          <button
            onClick={() => onContactClick(developer)}
            className="py-2 px-4 rounded-full bg-black text-white text-xs font-medium hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <MessageSquare size={12} /> Inquire
          </button>
        ) : (
          <Link
            to={`/developers/${user.username}?contact=true`}
            className="py-2 px-4 rounded-full bg-black text-white text-xs font-medium hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <MessageSquare size={12} /> Inquire
          </Link>
        )}
      </div>
    </div>
  );
};
