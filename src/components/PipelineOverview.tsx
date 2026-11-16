import React from 'react';
import { Customer } from '../types/churn';
import { Database, Filter, Sliders, Cpu, Eye, Sparkles, ArrowRight, CheckCircle2, TrendingDown, ShieldAlert, BarChart3, Zap } from 'lucide-react';

interface PipelineOverviewProps {
  customers: Customer[];
  onSelectStage: (tabName: string) => void;
  onOpenQuickIngest: () => void;
}

export const PipelineOverview: React.FC<PipelineOverviewProps> = ({
  customers,
  onSelectStage,
  onOpenQuickIngest
}) => {
  const criticalCount = customers.filter(c => c.riskTier === 'Critical').length;
  const highCount = customers.filter(c => c.riskTier === 'High').length;
  const totalMrrAtRisk = customers
    .filter(c => c.riskTier === 'Critical' || c.riskTier === 'High')
    .reduce((sum, c) => sum + c.mrr, 0);

  const stages = [
    {
      id: 'stage-1',
      targetTab: 'preprocessing',
      stepNum: '01',
      title: 'Raw Customer Telemetry',
      subtitle: 'Ingestion & Schema Normalization',
      icon: Database,
      badge: '50+ Enterprise Accounts',
      metrics: '42 Telemetry Attributes',
      description: 'Continuous ingestion of CRM records, usage logs, billing transactions, support tickets, and NPS surveys.',
      highlight: 'Handles sparse NPS feedback & asynchronous payment webhooks.'
    },
    {
      id: 'stage-2',
      targetTab: 'preprocessing',
      stepNum: '02',
      title: 'Missing Values & Encoding',
      subtitle: 'Preprocessing Pipeline',
      icon: Filter,
      badge: 'KNN / Median Imputer',
      metrics: '3 Imputation Strategies',
      description: 'Systematic imputation of un-surveyed NPS scores, target encoding for high-cardinality verticals, and robust scaling.',
      highlight: 'Zero data leakage across 80/10/10 stratified split.'
    },
    {
      id: 'stage-3',
      targetTab: 'preprocessing',
      stepNum: '03',
      title: 'Feature Engineering',
      subtitle: 'Derived Behavioral Signals',
      icon: Sliders,
      badge: '8 Engineered Features',
      metrics: '+18.4% ROC-AUC Uplift',
      description: 'Derives domain-specific behavioral velocity signals including Seat Utilization Rate, MoM API Velocity, and Support Friction Index.',
      highlight: 'Captures silent disengagement before contract expiration.'
    },
    {
      id: 'stage-4',
      targetTab: 'models',
      stepNum: '04',
      title: 'ML Model Benchmarking',
      subtitle: 'Logistic vs RF vs XGBoost',
      icon: Cpu,
      badge: 'XGBoost ROC-AUC 0.924',
      metrics: '91.2% Accuracy · 87.7% F1',
      description: 'Rigorous benchmark comparing Logistic Regression baseline against Random Forest ensemble and fine-tuned XGBoost.',
      highlight: 'Calibrated cost matrix: saves $850k ARR at optimal 0.42 threshold.'
    },
    {
      id: 'stage-5',
      targetTab: 'shap',
      stepNum: '05',
      title: 'Explainable AI (SHAP)',
      subtitle: 'TreeExplainer Feature Attribution',
      icon: Eye,
      badge: 'Local & Global SHAP',
      metrics: 'Waterfall & Beeswarm',
      description: 'Exact additive feature attribution decomposing every prediction into interpretable risk factors pushing towards churn or retention.',
      highlight: 'No black-box decisions: clear audited explanations for every account.'
    },
    {
      id: 'stage-6',
      targetTab: 'retention',
      stepNum: '06',
      title: 'Prescriptive Retention Engine',
      subtitle: 'Actionable Playbooks & CRM Sync',
      icon: Sparkles,
      badge: '76% Avg Rescue Rate',
      metrics: '5 Enterprise Playbooks',
      description: 'Prescriptive recommendation engine mapping top SHAP drivers to automated interventions, white-glove escalations, and CRM sync.',
      highlight: 'Direct integration with Salesforce, HubSpot, and Slack.'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Top Banner & Value Proposition */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-cyan-950/30 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <span>Production ML Architecture</span>
              <span className="text-slate-600">·</span>
              <span>Python / Scikit-Learn / XGBoost / SHAP / FastAPI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              End-to-End Customer Churn Prediction & Explainable AI Pipeline
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Moving beyond basic churn flags: ChurnIQ transforms raw enterprise telemetries into engineered behavioral velocity signals, benchmarks competitive ML algorithms, reveals exact SHAP feature attributions, and triggers proactive CRM retention campaigns.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectStage('customer360')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Explore Customer 360</span>
            </button>
            <button
              onClick={onOpenQuickIngest}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shadow-cyan-950"
            >
              <Zap className="w-4 h-4" />
              <span>Simulate Real-Time Telemetry</span>
            </button>
          </div>
        </div>

        {/* Quick Macro Pulse Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div>
            <div className="text-xs text-slate-400">Total Accounts Monitored</div>
            <div className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">{customers.length} Accounts</div>
            <div className="text-xs text-slate-400 mt-0.5">Enterprise & Growth tiers</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">ARR at Immediate Risk</div>
            <div className="text-xl font-bold text-rose-400 font-mono tabular-nums mt-0.5">${(totalMrrAtRisk * 12).toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono tabular-nums">${totalMrrAtRisk.toLocaleString()} MRR (Critical + High)</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">High & Critical Risk Accounts</div>
            <div className="text-xl font-bold text-amber-400 font-mono tabular-nums mt-0.5">{criticalCount + highCount} Accounts</div>
            <div className="text-xs text-slate-400 mt-0.5">{criticalCount} critical · {highCount} elevated risk</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Production Champion Model</div>
            <div className="text-xl font-bold text-cyan-400 font-mono tabular-nums mt-0.5">XGBoost v2.4</div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono tabular-nums">ROC-AUC 0.924 · 1.4ms Latency</div>
          </div>
        </div>
      </div>

      {/* 6-Stage Interactive Architecture Flow */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">System Workflow Architecture</h2>
            <p className="text-xs text-slate-400">Click any stage to dive into interactive parameters, data views, and code benchmarks.</p>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <span>Pipeline Status:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Online & Synchronized
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.id}
                onClick={() => onSelectStage(stage.targetTab)}
                className="group p-5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-semibold text-cyan-400 tracking-wider">
                      STAGE {stage.stepNum}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                      {stage.metrics}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 group-hover:bg-cyan-950/60 border border-slate-700/60 group-hover:border-cyan-500/40 flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {stage.title}
                      </h3>
                      <div className="text-xs text-slate-400">{stage.subtitle}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <span className="truncate pr-2 italic">{stage.highlight}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High-Impact Engineering Contrast: Why Basic Churn Models Fail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Traditional Churn Model Pitfalls</span>
          </div>
          <h3 className="text-base font-bold text-white">Why Conventional Kaggle-Style Pipelines Fall Short</h3>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
              <span><strong>Static Static Features Only:</strong> Relying on static snapshot variables (tenure, contract, plan) misses rapid behavioral drops happening 14–30 days prior to cancellation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
              <span><strong>Black Box Predictions:</strong> Showing CSMs a bare probability percentage (e.g., "78% risk") without SHAP explanation creates zero trust and actionable next steps.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
              <span><strong>Batch-Only Latency:</strong> Scoring once a month misses emergency events like executive sponsor departures or sudden payment gateway declines.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>The ChurnIQ Advantage</span>
          </div>
          <h3 className="text-base font-bold text-white">Engineered Behavioral Dynamics + Explainable AI</h3>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
              <span><strong>Velocity & Friction Ratios:</strong> Dynamically calculates Seat Utilization Ratio, MoM Usage Velocity, and Support Escalation Friction indices for high-signal prediction.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
              <span><strong>Actionable SHAP Attribution:</strong> Every customer profile features exact additive feature attributions telling retention teams exactly what is causing risk.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
              <span><strong>Real-Time Dynamic Scoring:</strong> Event streaming ingestion re-evaluates risk in milliseconds and pushes targeted playbooks straight to Salesforce & HubSpot.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
