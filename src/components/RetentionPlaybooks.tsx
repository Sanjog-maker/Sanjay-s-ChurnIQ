import React, { useState } from 'react';
import { Customer, RetentionPlaybook } from '../types/churn';
import { RETENTION_PLAYBOOKS } from '../data/mockCustomers';
import { Sparkles, DollarSign, CheckCircle2, Send, ArrowRight, ShieldCheck, Zap, RefreshCw, AlertCircle } from 'lucide-react';

interface RetentionPlaybooksProps {
  customers: Customer[];
  selectedCustomer?: Customer | null;
  onExecutePlaybook: (playbook: RetentionPlaybook, customer: Customer) => void;
  userRole: string;
}

export const RetentionPlaybooks: React.FC<RetentionPlaybooksProps> = ({
  customers,
  selectedCustomer,
  onExecutePlaybook,
  userRole
}) => {
  const atRiskCustomers = customers.filter(c => c.riskTier === 'Critical' || c.riskTier === 'High');
  const [activeCustomer, setActiveCustomer] = useState<Customer>(
    selectedCustomer || atRiskCustomers[0] || customers[0]
  );
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLaunch = (pb: RetentionPlaybook) => {
    setExecutingId(pb.id);
    setTimeout(() => {
      onExecutePlaybook(pb, activeCustomer);
      setExecutingId(null);
      setSuccessMessage(`Successfully deployed "${pb.title}" for ${activeCustomer.name}. Synced to CRM.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span>Prescriptive Operations</span>
            <span className="text-slate-600">·</span>
            <span>Automated Action Engine</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Retention Recommendation & Playbook Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven intervention strategies dynamically paired with customer SHAP root causes to maximize net saved revenue and mitigate attrition.
          </p>
        </div>

        {/* Selected Customer Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Target Account:</span>
          <select
            value={activeCustomer.id}
            onChange={(e) => {
              const found = customers.find(c => c.id === e.target.value);
              if (found) setActiveCustomer(found);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {Math.round(c.churnProbability * 100)}% ({c.riskTier})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <span className="font-mono text-emerald-400 font-bold">CRM Webhook 200 OK</span>
        </div>
      )}

      {/* Active Account Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{activeCustomer.name}</span>
            <span className="text-xs font-mono text-slate-400">({activeCustomer.id})</span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${activeCustomer.riskTier === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
              {activeCustomer.riskTier} Risk ({Math.round(activeCustomer.churnProbability * 100)}%)
            </span>
          </div>
          <div className="text-xs text-slate-400">
            Primary Churn Factor: <strong className="text-slate-200">{activeCustomer.topDrivers[0]}</strong> · Monthly Value: <strong className="text-cyan-400 font-mono">${activeCustomer.mrr.toLocaleString()}</strong>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <div className="text-slate-500">Annual LTV at Risk</div>
            <div className="text-base font-bold text-rose-400">${(activeCustomer.mrr * 12).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Playbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RETENTION_PLAYBOOKS.map((pb) => {
          const isPrimaryMatch = activeCustomer.topDrivers.some(d => d.toLowerCase().includes(pb.triggerDriver.toLowerCase()));
          const isExecuting = executingId === pb.id;
          const netBenefit = pb.averageLtvSaved - pb.estimatedCost;

          return (
            <div
              key={pb.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                isPrimaryMatch
                  ? 'bg-slate-900 border-cyan-500/80 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    Driver: {pb.triggerDriver}
                  </span>
                  {isPrimaryMatch && (
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      RECOMMENDED MATCH
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-2">{pb.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {pb.description}
                </p>

                {/* ROI / Financial Details */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-xs font-mono mb-4">
                  <div>
                    <span className="text-slate-500 block text-xs">Cost</span>
                    <span className="font-bold text-white">${pb.estimatedCost}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Rescue Rate</span>
                    <span className="font-bold text-emerald-400">{pb.successRate}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Net Saved ARR</span>
                    <span className="font-bold text-cyan-400">+${netBenefit.toLocaleString()}</span>
                  </div>
                </div>

                {/* CRM Action preview */}
                <div className="text-xs text-slate-400 space-y-1 mb-4">
                  <div className="font-semibold text-slate-300">Automated CRM Workflow:</div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-xs text-slate-400 font-mono">
                    {pb.crmAction}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={isExecuting}
                onClick={() => handleLaunch(pb)}
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  isPrimaryMatch
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-950'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synchronizing CRM & Dispatching Playbook...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Execute Playbook for {activeCustomer.name.split(' ')[0]}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
