import React, { useState } from 'react';
import { Customer, RiskTier } from '../types/churn';
import { calculateShapValues } from '../ml/churnEngine';
import { Search, Filter, ShieldAlert, Sparkles, Building2, Calendar, CreditCard, Users, Activity, MessageSquare, ArrowUpRight, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

interface Customer360Props {
  customers: Customer[];
  onTriggerPlaybook: (customer: Customer) => void;
  onNavigateToShap: (customerId: string) => void;
}

export const Customer360: React.FC<Customer360Props> = ({
  customers,
  onTriggerPlaybook,
  onNavigateToShap
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | RiskTier>('All');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');

  // Filtered list
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskFilter === 'All' || c.riskTier === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const customerShap = calculateShapValues(selectedCustomer);

  const getRiskBadge = (tier: RiskTier) => {
    switch (tier) {
      case 'Critical':
        return <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">Critical Risk</span>;
      case 'High':
        return <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">High Risk</span>;
      case 'Moderate':
        return <span className="text-xs font-mono font-medium text-blue-400 bg-blue-950/60 border border-blue-800/80 px-2 py-0.5 rounded">Moderate</span>;
      case 'Low':
        return <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">Low Risk</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span>Customer Health & Intelligence</span>
            <span className="text-slate-600">·</span>
            <span>Real-Time Scoring</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Customer 360 Account Profiles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Holistic view of contract structure, telemetry consumption trends, support friction, and model explainability for retention managers.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {filteredCustomers.length} of {customers.length} Accounts
        </div>
      </div>

      {/* Main Split Layout: Customer Table & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filter Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search account name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
              {(['All', 'Critical', 'High', 'Moderate', 'Low'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedRiskFilter(tier)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                    selectedRiskFilter === tier
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Cards List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredCustomers.map((c) => {
              const isSelected = c.id === selectedCustomer.id;
              const probPct = Math.round(c.churnProbability * 100);

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomerId(c.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-white">{c.name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{c.id} · {c.industry}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-bold text-sm ${probPct >= 70 ? 'text-rose-400' : probPct >= 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {probPct}%
                      </div>
                      <div className="text-xs text-slate-500 font-mono">${c.mrr.toLocaleString()}/mo</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60 text-xs">
                    <span className="text-slate-400 font-mono">{c.contractTier} · {c.contractType}</span>
                    {getRiskBadge(c.riskTier)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer 360 Deep Profile (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center font-bold text-cyan-400 text-sm">
                  {selectedCustomer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{selectedCustomer.name}</h2>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Account ID: {selectedCustomer.id} · {selectedCustomer.industry} · {selectedCustomer.contractTier} Plan
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToShap(selectedCustomer.id)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Full SHAP Audit</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                onClick={() => onTriggerPlaybook(selectedCustomer)}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-950"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Retention Playbook</span>
              </button>
            </div>
          </div>

          {/* Key Metric Quadrant */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                <span>MRR</span>
              </div>
              <div className="text-base font-bold text-white font-mono mt-1">
                ${selectedCustomer.mrr.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                ${(selectedCustomer.mrr * 12).toLocaleString()} ARR
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Seat Adoption</span>
              </div>
              <div className="text-base font-bold font-mono mt-1 text-white">
                {selectedCustomer.activeSeats} / {selectedCustomer.contractedSeats}
              </div>
              <div className="text-xs font-mono mt-0.5 text-slate-400">
                {Math.round((selectedCustomer.activeSeats / selectedCustomer.contractedSeats) * 100)}% active
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                <span>MoM Usage</span>
              </div>
              <div className={`text-base font-bold font-mono mt-1 ${selectedCustomer.apiCallsMonthly < selectedCustomer.apiCallsPriorMonth ? 'text-rose-400' : 'text-emerald-400'}`}>
                {Math.round(((selectedCustomer.apiCallsMonthly - selectedCustomer.apiCallsPriorMonth) / selectedCustomer.apiCallsPriorMonth) * 100)}%
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                {(selectedCustomer.apiCallsMonthly / 1000).toFixed(0)}k calls
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                <span>Churn Risk</span>
              </div>
              <div className={`text-base font-bold font-mono mt-1 ${selectedCustomer.churnProbability >= 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {Math.round(selectedCustomer.churnProbability * 100)}%
              </div>
              <div className="text-xs mt-0.5">
                {getRiskBadge(selectedCustomer.riskTier)}
              </div>
            </div>
          </div>

          {/* Primary Churn Drivers (SHAP Top Factors) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Primary Machine Learning Risk Drivers (SHAP)
              </h3>
              <span className="text-xs font-mono text-cyan-400">XGBoost Attribution</span>
            </div>

            <div className="space-y-2">
              {customerShap.values.slice(0, 3).map((v) => {
                const isPositive = v.shapValue > 0;
                return (
                  <div
                    key={v.featureName}
                    className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{v.displayName}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{v.explanation}</div>
                    </div>
                    <div className="text-right shrink-0 ml-4 font-mono font-bold">
                      <span className={isPositive ? 'text-rose-400' : 'text-emerald-400'}>
                        {isPositive ? '+' : ''}{(v.shapValue * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Timeline Audit Events */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Recent Account Milestones & Telemetry Incidents
            </h3>

            <div className="space-y-2 text-xs">
              {selectedCustomer.historicalEvents && selectedCustomer.historicalEvents.length > 0 ? (
                selectedCustomer.historicalEvents.map((evt, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-950/40 rounded-lg border border-slate-800/60 flex items-start gap-3"
                  >
                    <span className="font-mono text-slate-500 shrink-0 text-xs mt-0.5">{evt.date}</span>
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${evt.type === 'positive' ? 'bg-emerald-400' : evt.type === 'negative' ? 'bg-rose-400' : 'bg-slate-400'}`} />
                    <span className="text-slate-300 leading-relaxed">{evt.event}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic p-3 text-center bg-slate-950/30 rounded-lg border border-slate-800">
                  No critical incidents recorded in the last 30 days.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
