import React, { useState } from 'react';
import { AuditLogEntry, UserRole } from '../types/churn';
import { INITIAL_AUDIT_LOGS } from '../data/mockCustomers';
import { Shield, Lock, FileText, CheckCircle2, AlertTriangle, Search, Filter, Download } from 'lucide-react';

interface RbacAuditProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  auditLogs: AuditLogEntry[];
}

export const RbacAudit: React.FC<RbacAuditProps> = ({
  currentRole,
  onRoleChange,
  auditLogs
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'matrix'>('audit');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const permissionsMatrix = [
    {
      capability: 'Execute ML Pipeline & Retrain Models',
      admin: true,
      ml_engineer: true,
      retention_specialist: false,
      executive: false,
      notes: 'Requires production compute allocation & hyperparameter validation'
    },
    {
      capability: 'Configure Feature Engineering & Imputation',
      admin: true,
      ml_engineer: true,
      retention_specialist: false,
      executive: false,
      notes: 'Controls preprocessing scripts and missing-value strategy'
    },
    {
      capability: 'Trigger Automated Retention Playbooks',
      admin: true,
      ml_engineer: false,
      retention_specialist: true,
      executive: false,
      notes: 'Dispatches high-touch campaigns and white-glove support SLAs'
    },
    {
      capability: 'Bi-Directional CRM Synchronization (SFDC/HubSpot)',
      admin: true,
      ml_engineer: false,
      retention_specialist: true,
      executive: false,
      notes: 'Pushes scores to external customer records'
    },
    {
      capability: 'Real-Time Telemetry Event Ingestion & Webhooks',
      admin: true,
      ml_engineer: true,
      retention_specialist: false,
      executive: false,
      notes: 'Injects live event streams for dynamic churn scoring'
    },
    {
      capability: 'View Macro Financial Exposure & ARR Heatmap',
      admin: true,
      ml_engineer: true,
      retention_specialist: true,
      executive: true,
      notes: 'Board-level financial visibility into ARR at risk'
    },
    {
      capability: 'Audit Trail Export & Compliance Logging',
      admin: true,
      ml_engineer: false,
      retention_specialist: false,
      executive: true,
      notes: 'Immutable SOC-2 & GDPR audit log access'
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesQuery = log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    return matchesQuery && matchesAction;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span>Governance & Security</span>
            <span className="text-slate-600">·</span>
            <span>Enterprise Compliance</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Role-Based Access Control (RBAC) & Audit Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            SOC-2 Type II and GDPR compliant immutable audit trail tracking model training, risk score overrides, CRM dispatches, and user permissions.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'audit' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'matrix' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            RBAC Permission Matrix
          </button>
        </div>
      </div>

      {/* Role State Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Current Authenticated Session Role:</div>
            <div className="text-sm font-bold text-white uppercase tracking-wide">
              {currentRole.replace(/_/g, ' ')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Switch Role to Test Gates:</span>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="admin">Admin / System Owner</option>
            <option value="ml_engineer">Lead ML Engineer</option>
            <option value="retention_specialist">Retention Specialist (CSM)</option>
            <option value="executive">Executive Stakeholder (VP)</option>
          </select>
        </div>
      </div>

      {/* TAB 1: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit trail by actor, entity, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="ALL">All Event Types</option>
                <option value="MODEL_RETRAINED">MODEL_RETRAINED</option>
                <option value="PLAYBOOK_TRIGGERED">PLAYBOOK_TRIGGERED</option>
                <option value="REALTIME_TELEMETRY_INGEST">REALTIME_TELEMETRY_INGEST</option>
                <option value="EXECUTIVE_REPORT_EXPORTED">EXECUTIVE_REPORT_EXPORTED</option>
                <option value="CRM_SYNC_SCHEDULED">CRM_SYNC_SCHEDULED</option>
              </select>

              <button
                onClick={() => alert('Audit logs downloaded in CSV format for compliance review.')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Timestamp (UTC)</th>
                    <th className="py-2.5 px-4 font-semibold">Actor / Role</th>
                    <th className="py-2.5 px-4 font-semibold">Action</th>
                    <th className="py-2.5 px-4 font-semibold">Target Entity</th>
                    <th className="py-2.5 px-4 font-semibold">Audit Details</th>
                    <th className="py-2.5 px-4 font-semibold">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <div className="text-white font-bold font-sans">{log.actor}</div>
                        <div className="text-xs text-slate-500 uppercase">{log.actorRole}</div>
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 font-semibold">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-200 whitespace-nowrap">{log.targetEntity}</td>
                      <td className="py-2.5 px-4 text-slate-300 font-sans max-w-xs truncate">{log.details}</td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded text-xs font-semibold">
                          {log.complianceFlag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Enterprise Role Permission Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enforcing least-privilege security boundaries across Machine Learning operations and customer retention actions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Platform Capability</th>
                  <th className="py-3 px-4 text-center font-semibold">Admin</th>
                  <th className="py-3 px-4 text-center font-semibold">Lead ML Engineer</th>
                  <th className="py-3 px-4 text-center font-semibold">Retention Specialist</th>
                  <th className="py-3 px-4 text-center font-semibold">Executive / VP</th>
                  <th className="py-3 px-4 font-semibold">Security Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {permissionsMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-white">{item.capability}</td>
                    <td className="py-3 px-4 text-center">
                      {item.admin ? <span className="text-emerald-400 font-bold">✓ Granted</span> : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.ml_engineer ? <span className="text-emerald-400 font-bold">✓ Granted</span> : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.retention_specialist ? <span className="text-emerald-400 font-bold">✓ Granted</span> : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.executive ? <span className="text-emerald-400 font-bold">✓ Granted</span> : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
