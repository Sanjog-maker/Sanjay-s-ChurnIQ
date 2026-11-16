import React, { useState } from 'react';
import { Customer } from '../types/churn';
import { calculateShapValues, GLOBAL_FEATURE_IMPORTANCE, BASELINE_CHURN_RATE } from '../ml/churnEngine';
import { Eye, BarChart3, ArrowRight, Sparkles, Sliders, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ShapExplorerProps {
  customers: Customer[];
  selectedCustomerId?: string;
  onSelectCustomer?: (id: string) => void;
}

export const ShapExplorer: React.FC<ShapExplorerProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer
}) => {
  const [activeCustomerIndex, setActiveCustomerIndex] = useState(
    selectedCustomerId ? Math.max(0, customers.findIndex(c => c.id === selectedCustomerId)) : 0
  );
  const [activeTab, setActiveTab] = useState<'waterfall' | 'global' | 'counterfactual'>('waterfall');

  // Counterfactual What-If sliders state
  const currentCustomer = customers[activeCustomerIndex] || customers[0];
  const originalShap = calculateShapValues(currentCustomer);

  // Counterfactual modified state
  const [cfActiveSeats, setCfActiveSeats] = useState(currentCustomer.activeSeats);
  const [cfEscalatedTickets, setCfEscalatedTickets] = useState(currentCustomer.escalatedTickets);
  const [cfContractType, setCfContractType] = useState(currentCustomer.contractType);
  const [cfPaymentFailures, setCfPaymentFailures] = useState(currentCustomer.paymentFailuresLast6m);

  // Sync state if customer changes
  const handleSelectCustomer = (idx: number) => {
    setActiveCustomerIndex(idx);
    const c = customers[idx];
    setCfActiveSeats(c.activeSeats);
    setCfEscalatedTickets(c.escalatedTickets);
    setCfContractType(c.contractType);
    setCfPaymentFailures(c.paymentFailuresLast6m);
    if (onSelectCustomer) onSelectCustomer(c.id);
  };

  // Recompute counterfactual customer
  const counterfactualCustomer: Customer = {
    ...currentCustomer,
    activeSeats: cfActiveSeats,
    escalatedTickets: cfEscalatedTickets,
    contractType: cfContractType,
    paymentFailuresLast6m: cfPaymentFailures
  };
  const counterfactualShap = calculateShapValues(counterfactualCustomer);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span>Explainable AI Engine</span>
            <span className="text-slate-600">·</span>
            <span>SHAP (SHapley Additive exPlanations) TreeExplainer</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Model Interpretability & Local Attribution
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Auditing exact additive feature contributions: decomposing black-box XGBoost predictions into auditable forces pushing accounts toward churn or loyalty.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('waterfall')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'waterfall' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Account Waterfall
            </button>
            <button
              onClick={() => setActiveTab('global')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'global' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Global Drivers
            </button>
            <button
              onClick={() => setActiveTab('counterfactual')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'counterfactual' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Counterfactual Simulator
            </button>
          </div>
        </div>
      </div>

      {/* Account Selector Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Account to Explain:</span>
          <select
            value={activeCustomerIndex}
            onChange={(e) => handleSelectCustomer(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
          >
            {customers.map((c, i) => (
              <option key={c.id} value={i}>
                {c.id} — {c.name} ({Math.round(c.churnProbability * 100)}% Churn Risk · {c.riskTier})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500">Base Rate E[f(x)]: </span>
            <span className="text-slate-300 font-bold">{(BASELINE_CHURN_RATE * 100).toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-slate-500">Predicted f(x): </span>
            <span className={`font-bold ${originalShap.predictedProb >= 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {(originalShap.predictedProb * 100).toFixed(0)}% ({currentCustomer.riskTier})
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: LOCAL SHAP WATERFALL PLOT */}
      {activeTab === 'waterfall' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  SHAP Waterfall Decomposition for {currentCustomer.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Beginning at global baseline E[f(x)] = 26.4%, each feature acts as a vector pushing the account towards churn (+SHAP in rose) or retention (-SHAP in cyan).
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Formula: f(x) = E[f(x)] + ∑ φᵢ
              </div>
            </div>

            {/* Waterfall List */}
            <div className="space-y-3">
              {/* Baseline Bar */}
              <div className="flex items-center gap-3 text-xs font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="w-48 text-slate-400 font-medium truncate">Global Population Base E[f(x)]</span>
                <span className="w-24 text-slate-300 text-right font-bold">26.4%</span>
                <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden flex items-center">
                  <div className="h-full bg-slate-600 rounded-full" style={{ width: '26.4%' }} />
                </div>
                <span className="w-24 text-right text-slate-500">Baseline</span>
              </div>

              {/* Individual Feature Forces */}
              {originalShap.values.map((v) => {
                const isPositive = v.shapValue > 0;
                const magnitudePct = Math.min(100, Math.round(Math.abs(v.shapValue) * 100 * 2.5));

                return (
                  <div
                    key={v.featureName}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-colors"
                  >
                    <div className="w-48 shrink-0">
                      <div className="font-semibold text-slate-200">{v.displayName}</div>
                      <div className="text-slate-500 font-mono text-xs">{v.featureValue}</div>
                    </div>

                    <div className="w-20 shrink-0 text-right font-mono font-bold">
                      <span className={isPositive ? 'text-rose-400' : 'text-emerald-400'}>
                        {isPositive ? '+' : ''}{(v.shapValue * 100).toFixed(1)}%
                      </span>
                    </div>

                    {/* Magnitude Bar */}
                    <div className="flex-1 h-3.5 bg-slate-900 rounded-full overflow-hidden flex items-center px-0.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          isPositive ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                        }`}
                        style={{ width: `${magnitudePct}%` }}
                      />
                    </div>

                    <div className="w-72 shrink-0 text-slate-400 text-xs italic sm:text-right">
                      {v.explanation}
                    </div>
                  </div>
                );
              })}

              {/* Final Prediction Output Result */}
              <div className="flex items-center gap-3 text-xs font-mono bg-cyan-950/30 p-3 rounded-lg border border-cyan-800/60 mt-4">
                <span className="w-48 text-cyan-300 font-bold">Final Model Prediction f(x)</span>
                <span className="w-24 text-right font-bold text-sm text-cyan-400">
                  {(originalShap.predictedProb * 100).toFixed(0)}% Churn
                </span>
                <div className="flex-1 h-3.5 bg-slate-900 rounded-full overflow-hidden flex items-center">
                  <div
                    className={`h-full rounded-full ${
                      originalShap.predictedProb >= 0.5 ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.round(originalShap.predictedProb * 100)}%` }}
                  />
                </div>
                <span className={`w-24 text-right font-bold ${originalShap.predictedProb >= 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {currentCustomer.riskTier} Risk
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL FEATURE IMPORTANCE */}
      {activeTab === 'global' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Global Mean |SHAP| Feature Importance (Cohort-Wide Aggregation)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Calculated across all customer accounts. Features with highest average absolute SHAP values drive the most predictive power.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {GLOBAL_FEATURE_IMPORTANCE.map((item, rank) => {
                const widthPct = Math.round((item.meanShap / 0.25) * 100);
                return (
                  <div key={item.feature} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-300 font-mono">
                      <span className="flex items-center gap-2">
                        <span className="text-slate-500 w-5">#{rank + 1}</span>
                        <span className="font-semibold text-white">{item.feature}</span>
                        <span className="text-xs text-slate-500 font-sans bg-slate-800 px-1.5 py-0.2 rounded">
                          {item.category}
                        </span>
                      </span>
                      <span className="text-cyan-400 font-bold">{item.meanShap.toFixed(3)} mean |SHAP|</span>
                    </div>

                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COUNTERFACTUAL WHAT-IF SIMULATOR */}
      {activeTab === 'counterfactual' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Sliders (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Prescriptive Counterfactual Engine for {currentCustomer.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Simulate retention interventions in real time: see how modifying customer behaviors directly impacts the model's SHAP risk score.
                </p>
              </div>

              {/* Slider 1: Active Seats */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Active Seats Deployed</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {cfActiveSeats} / {currentCustomer.contractedSeats} seats ({((cfActiveSeats / currentCustomer.contractedSeats) * 100).toFixed(0)}%)
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max={currentCustomer.contractedSeats}
                  value={cfActiveSeats}
                  onChange={(e) => setCfActiveSeats(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Escalated Support Tickets */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Escalated Support Incidents</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {cfEscalatedTickets} escalated tickets
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={cfEscalatedTickets}
                  onChange={(e) => setCfEscalatedTickets(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Selector 3: Contract Commitment */}
              <div className="space-y-2">
                <span className="text-xs text-slate-300 font-semibold">Contract Renewal Term</span>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {(['Month-to-month', '1-Year', '2-Year'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setCfContractType(type)}
                      className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                        cfContractType === type
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 4: Payment Failures */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Payment Retry Bounces</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {cfPaymentFailures} bounces
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={cfPaymentFailures}
                  onChange={(e) => setCfPaymentFailures(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setCfActiveSeats(Math.round(currentCustomer.contractedSeats * 0.9));
                    setCfEscalatedTickets(0);
                    setCfContractType('1-Year');
                    setCfPaymentFailures(0);
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Apply Ideal Retention Intervention Scenario</span>
                </button>
              </div>
            </div>

            {/* Before vs After Impact Box (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Predicted Churn Probability Delta</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center my-4">
                  <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400">Current Status</div>
                    <div className={`text-2xl font-bold font-mono mt-1 ${originalShap.predictedProb >= 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {(originalShap.predictedProb * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{currentCustomer.riskTier} Tier</div>
                  </div>

                  <div className="bg-cyan-950/30 p-3 rounded-lg border border-cyan-800/60">
                    <div className="text-xs text-cyan-300">Counterfactual Outcome</div>
                    <div className={`text-2xl font-bold font-mono mt-1 ${counterfactualShap.predictedProb >= 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {(counterfactualShap.predictedProb * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-cyan-400 mt-0.5 font-bold">
                      {counterfactualShap.predictedProb < originalShap.predictedProb
                        ? `-${Math.round((originalShap.predictedProb - counterfactualShap.predictedProb) * 100)}% Risk Drop`
                        : `+${Math.round((counterfactualShap.predictedProb - originalShap.predictedProb) * 100)}% Risk Rise`}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/90 rounded-lg p-3 border border-slate-800 text-xs space-y-2">
                  <div className="font-semibold text-slate-200">Prescriptive Insight:</div>
                  <p className="text-slate-400 leading-relaxed">
                    By resolving all {currentCustomer.escalatedTickets} escalated support incidents and deploying {cfActiveSeats} seats, this account drops risk from{' '}
                    <strong className="text-rose-400">{(originalShap.predictedProb * 100).toFixed(0)}%</strong> to{' '}
                    <strong className="text-emerald-400">{(counterfactualShap.predictedProb * 100).toFixed(0)}%</strong>, preserving ${((currentCustomer.mrr * 12)).toLocaleString()} in Annual Recurring Revenue.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  Ready to execute? Transition to Retention Engine to deploy automated playbooks.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
