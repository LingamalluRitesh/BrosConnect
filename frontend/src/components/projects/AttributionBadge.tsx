import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, User } from 'lucide-react';
import type { ProjectDeveloper } from '../../types';

interface AttributionBadgeProps {
  developers: ProjectDeveloper[];
  size?: 'sm' | 'md' | 'lg';
  showRole?: boolean;
}

export const AttributionBadge: React.FC<AttributionBadgeProps> = ({
  developers,
  showRole = true,
}) => {
  if (!developers || developers.length === 0) {
    return null;
  }

  // Find lead developer or first developer
  const lead = developers.find((d) => d.is_lead) || developers[0];
  const others = developers.filter((d) => d !== lead);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Built by</span>
      
      {/* Lead Developer */}
      <Link
        to={`/developers/${lead.developer.user.username}`}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 hover:border-brand-500/60 hover:bg-slate-800 transition-all group"
      >
        {lead.developer.user.avatar_url ? (
          <img
            src={lead.developer.user.avatar_url}
            alt={lead.developer.user.full_name}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-brand-500/40"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-brand-900/60 flex items-center justify-center text-brand-400">
            <User size={12} />
          </div>
        )}
        <span className="text-sm font-semibold text-slate-200 group-hover:text-brand-400 transition-colors">
          {lead.developer.user.full_name}
        </span>
        {lead.developer.user.is_verified && (
          <CheckCircle2 size={14} className="text-cyan-400 fill-cyan-950/40" />
        )}
        {showRole && lead.role_in_project && (
          <span className="text-xs text-slate-400 hidden sm:inline border-l border-slate-700 pl-2">
            {lead.role_in_project}
          </span>
        )}
      </Link>

      {/* Additional Team Contributors */}
      {others.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium">&</span>
          {others.map((contrib) => (
            <Link
              key={contrib.id}
              to={`/developers/${contrib.developer.user.username}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-800 hover:border-slate-600 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              title={`${contrib.developer.user.full_name} (${contrib.role_in_project})`}
            >
              <span>{contrib.developer.user.full_name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
