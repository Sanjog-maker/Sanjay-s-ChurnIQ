import React from 'react';
import { UserRole } from '../types/churn';
import { Shield, Sparkles, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenQuickIngest: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenQuickIngest
}) => {
  const roleLabels: Record<UserRole, { label: string; desc: string }> = {
    admin: { label: 'Admin', desc: 'Full System Access & Retraining' },
    ml_engineer: { label: 'ML Engineer', desc: 'Pipelines & Model Tuning' },
    retention_specialist: { label: 'Retention Specialist', desc: 'Customer 360 & Playbooks' },
    executive: { label: 'Executive Stakeholder', desc: 'Macro KPIs & ARR at Risk' }
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-6">
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('overview');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors cursor-pointer select-none"
        >
          ChurnIQ
        </a>

        {/* Zone 2: Navigation Links (Single line, subtle active indicator) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-400">
          <button
            onClick={() => onTabChange('overview')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-white bg-slate-800 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Pipeline Architecture
          </button>
          <button
            onClick={() => onTabChange('preprocessing')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'preprocessing'
                ? 'text-white bg-slate-800 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Feature Engineering
          </button>
          <button
            onClick={() => onTabChange('models')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'models'
                ? 'text-white bg-slate-800 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Model Benchmarks
          </button>
          <button
            onClick={() => onTabChange('shap')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'shap'
                ? 'text-white bg-slate-800 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            SHAP Explainability
          </button>
          <button
            onClick={() => onTabChange('customer360')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'customer360'
                ? 'text-white bg-slate-800 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Customer 360
          </button>
          <button
            onClick={() => onTabChange('retention')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'retention'
                ? 'text-white bg-slate-800 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Retention Engine
          </button>
          <button
            onClick={() => onTabChange('realtime')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'realtime'
                ? 'text-white bg-slate-800 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Real-Time Stream
          </button>
          <button
            onClick={() => onTabChange('crm')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'crm'
                ? 'text-white bg-slate-800 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            CRM Sync
          </button>
          <button
            onClick={() => onTabChange('api')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'api'
                ? 'text-white bg-slate-800 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            API & Code
          </button>
          <button
            onClick={() => onTabChange('market')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'market'
                ? 'text-white bg-slate-800 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Market Intelligence
          </button>
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'text-white bg-slate-800 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Stakeholders
          </button>
          <button
            onClick={() => onTabChange('audit')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'text-white bg-slate-800 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Audit & RBAC
          </button>
        </nav>
      </div>

      {/* Zone 3: Primary Actions (Role Switcher + Event Ingestion Trigger) */}
      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
          <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-400 hidden sm:inline">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="admin" className="bg-slate-900 text-slate-100">Admin</option>
            <option value="ml_engineer" className="bg-slate-900 text-slate-100">Lead ML Engineer</option>
            <option value="retention_specialist" className="bg-slate-900 text-slate-100">Retention Specialist</option>
            <option value="executive" className="bg-slate-900 text-slate-100">Executive / VP</option>
          </select>
        </div>

        {/* Quick Ingestion Event Button */}
        <button
          onClick={onOpenQuickIngest}
          className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-900/40"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate Event</span>
        </button>
      </div>
    </header>
  );
};
