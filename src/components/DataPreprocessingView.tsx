import React, { useState } from 'react';
import { Customer } from '../types/churn';
import { engineerFeatures, PreprocessingConfig } from '../ml/churnEngine';
import { Filter, Sliders, Split, Database, CheckCircle2, ArrowRight, Code2, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';

interface DataPreprocessingViewProps {
  customers: Customer[];
  userRole: string;
}

export const DataPreprocessingView: React.FC<DataPreprocessingViewProps> = ({ customers, userRole }) => {
  const [config, setConfig] = useState<PreprocessingConfig>({
    imputationStrategy: 'knn',
    encodingStrategy: 'target_encoding',
    splitRatio: '80_10_10',
    scalingMethod: 'robust_scaler'
  });

  const [activeTab, setActiveTab] = useState<'features' | 'missing_values' | 'encoding' | 'split'>('features');
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(0);
  const [hasAppliedChanges, setHasAppliedChanges] = useState(false);

  const sampleCustomer = customers[selectedCustomerIndex] || customers[0];
  const engineered = engineerFeatures(sampleCustomer);

  // Missing value stats
  const missingNpsCount = customers.filter(c => c.npsScore === null).length;
  const missingNpsPct = Math.round((missingNpsCount / customers.length) * 100);

  const handleApplyPreprocessing = () => {
    setHasAppliedChanges(true);
    setTimeout(() => setHasAppliedChanges(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Data Preprocessing & Feature Engineering</h1>
          <p className="text-xs text-slate-400 mt-1">
            Transform raw telemetry into high-signal behavioral vectors: handling missing survey feedback, encoding categoricals, and generating derived velocity metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleApplyPreprocessing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm shadow-cyan-900/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${hasAppliedChanges ? 'animate-spin' : ''}`} />
            <span>{hasAppliedChanges ? 'Pipeline Calibrated!' : 'Re-run Preprocessing Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('features')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'features'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Derived Feature Engineering</span>
        </button>
        <button
          onClick={() => setActiveTab('missing_values')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'missing_values'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Missing-Value Strategy</span>
          {missingNpsCount > 0 && (
            <span className="text-xs bg-amber-950 text-amber-300 border border-amber-800/60 px-1.5 py-0.2 rounded font-mono">
              {missingNpsCount} nulls
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('encoding')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'encoding'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Categorical Encoding</span>
        </button>
        <button
          onClick={() => setActiveTab('split')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'split'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Split className="w-3.5 h-3.5 text-indigo-400" />
          <span>Train / Val / Test Split</span>
        </button>
      </div>

      {/* TAB 1: DERIVED FEATURE ENGINEERING WORKBENCH */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          {/* Customer Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inspect Account Transformation:</span>
              <select
                value={selectedCustomerIndex}
                onChange={(e) => setSelectedCustomerIndex(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
              >
                {customers.map((c, i) => (
                  <option key={c.id} value={i}>
                    {c.id} — {c.name} ({c.contractTier}, {c.riskTier} Risk)
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Raw Attributes: <span className="text-slate-200 font-semibold">14 inputs</span> → Engineered Signals: <span className="text-cyan-400 font-semibold">8 velocity vectors</span>
            </div>
          </div>

          {/* Side-by-side Raw vs Engineered Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Raw Telemetry Features */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-bold text-white">Raw Ingested Attributes</h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">Unscaled Raw Schema</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Monthly Contract Value (MRR)</span>
                  <span className="font-mono text-white font-medium">${sampleCustomer.mrr.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Contracted vs Active Seats</span>
                  <span className="font-mono text-white font-medium">{sampleCustomer.contractedSeats} contracted / {sampleCustomer.activeSeats} active</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Monthly API Operations</span>
                  <span className="font-mono text-white font-medium">{sampleCustomer.apiCallsMonthly.toLocaleString()} calls (Prior: {sampleCustomer.apiCallsPriorMonth.toLocaleString()})</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Support Tickets (Last 90d)</span>
                  <span className="font-mono text-white font-medium">{sampleCustomer.supportTicketsLast90d} tickets ({sampleCustomer.escalatedTickets} escalated)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Payment Failures (Last 6m)</span>
                  <span className={`font-mono font-medium ${sampleCustomer.paymentFailuresLast6m > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {sampleCustomer.paymentFailuresLast6m} retry bounces
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Executive Sponsor Change</span>
                  <span className={`font-mono font-medium ${sampleCustomer.leadershipChangeRecent ? 'text-rose-400' : 'text-slate-300'}`}>
                    {sampleCustomer.leadershipChangeRecent ? 'Yes (Recent Departure)' : 'No (Stable)'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Reported NPS Feedback</span>
                  <span className="font-mono text-white font-medium">
                    {sampleCustomer.npsScore !== null ? `${sampleCustomer.npsScore}/10` : 'NULL (Un-surveyed)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Engineered Features */}
            <div className="bg-slate-900 border border-cyan-950/60 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Engineered Behavioral Vectors</h3>
                </div>
                <span className="text-xs text-cyan-400 font-mono font-semibold">+18.4% Signal Gain</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Seat Utilization */}
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Seat Utilization Rate</div>
                    <div className="text-slate-400 text-xs mt-0.5">Ratio: activeSeats / contractedSeats</div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold text-sm ${engineered.seatUtilizationRate < 0.4 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {(engineered.seatUtilizationRate * 100).toFixed(1)}%
                    </span>
                    <div className="text-xs text-slate-400">{engineered.seatUtilizationRate < 0.4 ? 'Shelfware Risk' : 'Healthy Adoption'}</div>
                  </div>
                </div>

                {/* Usage Velocity MoM */}
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Usage Velocity (MoM %)</div>
                    <div className="text-slate-400 text-xs mt-0.5">Rate: (apiMonthly - prior) / prior</div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold text-sm ${engineered.usageVelocityMoM < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {engineered.usageVelocityMoM >= 0 ? '+' : ''}{(engineered.usageVelocityMoM * 100).toFixed(1)}%
                    </span>
                    <div className="text-xs text-slate-400">{engineered.usageVelocityMoM < -0.2 ? 'Critical Contraction' : 'Steady Growth'}</div>
                  </div>
                </div>

                {/* Support Friction Index */}
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Support Friction Index</div>
                    <div className="text-slate-400 text-xs mt-0.5">Weighted formula: escalated * 2.5 + normal * 0.5</div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold text-sm ${engineered.supportFrictionIndex > 4 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {engineered.supportFrictionIndex.toFixed(1)}
                    </span>
                    <div className="text-xs text-slate-400">{engineered.supportFrictionIndex > 4 ? 'High Friction' : 'Normal Operations'}</div>
                  </div>
                </div>

                {/* Payment Distress Score */}
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Payment Distress Factor</div>
                    <div className="text-slate-400 text-xs mt-0.5">Involuntary churn indicator (failures * 2.0)</div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold text-sm ${engineered.paymentDistressScore > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {engineered.paymentDistressScore.toFixed(1)}
                    </span>
                    <div className="text-xs text-slate-400">{engineered.paymentDistressScore > 0 ? 'Billing Risk' : 'Clear'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Pipeline Definition Code Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2 text-cyan-400">
                <Code2 className="w-4 h-4" />
                Python Scikit-Learn Custom Feature Transformer
              </span>
              <span className="text-slate-400">sklearn.base.BaseEstimator, TransformerMixin</span>
            </div>
            <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`class SaaSFeatureEngineer(BaseEstimator, TransformerMixin):
    """Computes high-signal behavioral velocity and friction ratios."""
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X_out = X.copy()
        # 1. License shelfware ratio
        X_out['seat_utilization'] = X_out['active_seats'] / np.maximum(X_out['contracted_seats'], 1)
        # 2. Month-over-Month consumption velocity
        prior_safe = np.maximum(X_out['api_calls_prior_month'], 100)
        X_out['usage_velocity_mom'] = (X_out['api_calls_monthly'] - prior_safe) / prior_safe
        # 3. Customer friction metric
        X_out['support_friction_index'] = (X_out['escalated_tickets'] * 2.5) + (X_out['support_tickets_90d'] * 0.5)
        # 4. Involuntary billing distress indicator
        X_out['payment_distress'] = X_out['payment_failures_6m'] * 2.0
        return X_out`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: MISSING-VALUE STRATEGY */}
      {activeTab === 'missing_values' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Missing-Value Strategy Selector</h3>
                <p className="text-xs text-slate-400 mt-1">
                  In SaaS telemetry, {missingNpsPct}% of accounts lack voluntary NPS survey feedback. Dropping null rows biases the model against silent churners.
                </p>
              </div>
              <span className="text-xs text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded font-mono">
                {missingNpsCount} Missing NPS Records ({missingNpsPct}% of cohort)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div
                onClick={() => setConfig({ ...config, imputationStrategy: 'knn' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.imputationStrategy === 'knn'
                    ? 'bg-slate-800 border-cyan-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-cyan-400">KNN Imputer (k=5)</div>
                  {config.imputationStrategy === 'knn' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Imputes missing NPS by finding nearest neighbor accounts with identical usage velocity and contract size. Preserves covariance matrix.
                </p>
                <div className="mt-3 text-xs font-mono text-emerald-400">Recommended for High-Fidelity ML</div>
              </div>

              <div
                onClick={() => setConfig({ ...config, imputationStrategy: 'iterative_mice' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.imputationStrategy === 'iterative_mice'
                    ? 'bg-slate-800 border-cyan-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-cyan-400">Iterative / MICE</div>
                  {config.imputationStrategy === 'iterative_mice' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Multiple Imputation by Chained Equations: models each missing feature as a function of all remaining features in iterative round-robin steps.
                </p>
                <div className="mt-3 text-xs font-mono text-slate-400">High Statistical Rigor</div>
              </div>

              <div
                onClick={() => setConfig({ ...config, imputationStrategy: 'median' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.imputationStrategy === 'median'
                    ? 'bg-slate-800 border-cyan-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-cyan-400">Median + Missing Flag</div>
                  {config.imputationStrategy === 'median' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Replaces NaN with median value (6.0) and adds binary column <code className="text-cyan-300 font-mono">is_nps_missing</code> to preserve non-response signal.
                </p>
                <div className="mt-3 text-xs font-mono text-slate-400">Fast & Resilient Baseline</div>
              </div>
            </div>

            {/* Imputation Verification Table */}
            <div className="border border-slate-800 rounded-lg overflow-hidden mt-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Customer Account</th>
                    <th className="py-2.5 px-4 font-semibold">Raw NPS Value</th>
                    <th className="py-2.5 px-4 font-semibold">Imputed NPS Result</th>
                    <th className="py-2.5 px-4 font-semibold">Neighboring Context</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2 px-4 text-slate-200">CUST-9320 (FinPulse Banking)</td>
                    <td className="py-2 px-4 text-amber-400 font-bold">NULL</td>
                    <td className="py-2 px-4 text-cyan-300 font-bold">4.2 (Imputed)</td>
                    <td className="py-2 px-4 text-slate-400 font-sans">Matched CUST-8021 on support friction (6 tickets)</td>
                    <td className="py-2 px-4 text-emerald-400 font-sans">✓ Imputed</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2 px-4 text-slate-200">CUST-6102 (Terra Nova Energy)</td>
                    <td className="py-2 px-4 text-amber-400 font-bold">NULL</td>
                    <td className="py-2 px-4 text-cyan-300 font-bold">3.8 (Imputed)</td>
                    <td className="py-2 px-4 text-slate-400 font-sans">Matched on -59% usage drop MoM</td>
                    <td className="py-2 px-4 text-emerald-400 font-sans">✓ Imputed</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2 px-4 text-slate-200">CUST-1193 (Lumina Learning)</td>
                    <td className="py-2 px-4 text-amber-400 font-bold">NULL</td>
                    <td className="py-2 px-4 text-cyan-300 font-bold">5.6 (Imputed)</td>
                    <td className="py-2 px-4 text-slate-400 font-sans">Matched on 26 active seats & growth tier</td>
                    <td className="py-2 px-4 text-emerald-400 font-sans">✓ Imputed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORICAL ENCODING */}
      {activeTab === 'encoding' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Categorical Encoding Architecture</h3>
              <p className="text-xs text-slate-400 mt-1">
                Encoding categorical dimensions (Contract Type, Payment Method, Industry Vertical) without expanding sparsity or inducing target leakage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setConfig({ ...config, encodingStrategy: 'target_encoding' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.encodingStrategy === 'target_encoding'
                    ? 'bg-slate-800 border-cyan-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-cyan-400">Target Encoding with Smoothing</div>
                  {config.encodingStrategy === 'target_encoding' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Replaces categorical levels with Bayesian smoothed churn conditional probability: <code className="text-cyan-300 font-mono">P(churn | category)</code>. Prevents high-cardinality explosion.
                </p>
              </div>

              <div
                onClick={() => setConfig({ ...config, encodingStrategy: 'one_hot' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.encodingStrategy === 'one_hot'
                    ? 'bg-slate-800 border-cyan-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-cyan-400">One-Hot Encoding (drop='first')</div>
                  {config.encodingStrategy === 'one_hot' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Standard binary indicator columns. Drops first level to prevent collinearity in linear models. Expands feature dimension by +9 columns.
                </p>
              </div>

              <div
                onClick={() => setConfig({ ...config, encodingStrategy: 'weight_of_evidence' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  config.encodingStrategy === 'weight_of_evidence'
                    ? 'bg-slate-800 border-cyan-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-cyan-400">Weight of Evidence (WoE)</div>
                  {config.encodingStrategy === 'weight_of_evidence' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Computes <code className="text-cyan-300 font-mono">ln(% Non-Churn / % Churn)</code> per bin. Optimal monotonic linear relationship for Logistic Regression.
                </p>
              </div>
            </div>

            {/* Encoding Matrix Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs">
              <div className="text-slate-400 mb-2">Live Target Encoding Map (Laplace Smoothing Factor m=10):</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div className="text-slate-500 text-xs">Contract: Month-to-month</div>
                  <div className="text-rose-400 font-bold text-sm mt-1">0.684 (High Risk)</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div className="text-slate-500 text-xs">Contract: 1-Year Annual</div>
                  <div className="text-amber-400 font-bold text-sm mt-1">0.241 (Baseline)</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div className="text-slate-500 text-xs">Contract: 2-Year Lock</div>
                  <div className="text-emerald-400 font-bold text-sm mt-1">0.052 (Ultra Low)</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div className="text-slate-500 text-xs">Payment: Manual Invoice</div>
                  <div className="text-amber-400 font-bold text-sm mt-1">0.412 (Elevated)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRAIN / VAL / TEST SPLIT */}
      {activeTab === 'split' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Stratified Dataset Partitioning</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Stratified split preserves exact class balance (26.4% churn rate) across train, validation, and out-of-time test sets.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Split Ratio:</span>
                <select
                  value={config.splitRatio}
                  onChange={(e) => setConfig({ ...config, splitRatio: e.target.value as any })}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="80_10_10">80% Train · 10% Val · 10% Test</option>
                  <option value="70_15_15">70% Train · 15% Val · 15% Test</option>
                  <option value="60_20_20">60% Train · 20% Val · 20% Test</option>
                </select>
              </div>
            </div>

            {/* Split Visualization Bar */}
            <div className="space-y-2">
              <div className="h-6 w-full rounded-lg overflow-hidden flex font-mono text-xs font-bold text-slate-950">
                <div className="bg-cyan-500 flex items-center justify-center transition-all" style={{ width: config.splitRatio === '80_10_10' ? '80%' : config.splitRatio === '70_15_15' ? '70%' : '60%' }}>
                  Train (80%)
                </div>
                <div className="bg-amber-400 flex items-center justify-center transition-all" style={{ width: config.splitRatio === '80_10_10' ? '10%' : config.splitRatio === '70_15_15' ? '15%' : '20%' }}>
                  Val
                </div>
                <div className="bg-indigo-400 flex items-center justify-center transition-all" style={{ width: config.splitRatio === '80_10_10' ? '10%' : config.splitRatio === '70_15_15' ? '15%' : '20%' }}>
                  Test
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-cyan-400 font-mono font-semibold">Training Set (N = 2,400)</div>
                  <div className="text-slate-300 mt-1">Used to fit model weights & tree splits.</div>
                  <div className="text-slate-500 text-xs mt-1 font-mono">Churned: 634 (26.4%) · Retained: 1,766</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-mono font-semibold">Validation Set (N = 300)</div>
                  <div className="text-slate-300 mt-1">Used for hyperparameter tuning & early stopping.</div>
                  <div className="text-slate-500 text-xs mt-1 font-mono">Churned: 79 (26.3%) · Retained: 221</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-indigo-400 font-mono font-semibold">Holdout Test Set (N = 300)</div>
                  <div className="text-slate-300 mt-1">Strict out-of-sample evaluation & SHAP audit.</div>
                  <div className="text-slate-500 text-xs mt-1 font-mono">Churned: 79 (26.3%) · Retained: 221</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
