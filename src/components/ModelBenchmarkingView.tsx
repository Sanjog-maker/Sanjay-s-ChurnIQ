import React, { useState } from 'react';
import { BENCHMARK_MODELS, computeThresholdMetrics } from '../ml/churnEngine';
import { Cpu, Award, Zap, Sliders, DollarSign, TrendingUp, BarChart2, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export const ModelBenchmarkingView: React.FC = () => {
  const [selectedModelIndex, setSelectedModelIndex] = useState(0); // 0 = XGBoost
  const [threshold, setThreshold] = useState(0.42); // Optimal threshold
  const [activeCurveTab, setActiveCurveTab] = useState<'roc' | 'pr'>('roc');

  const selectedModel = BENCHMARK_MODELS[selectedModelIndex];
  const thresholdMetrics = computeThresholdMetrics(threshold, selectedModel);

  // Generate synthetic smooth curve points for ROC and PR curves
  // ROC: False Positive Rate (x) vs True Positive Rate (y)
  const rocPointsXGBoost = [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.02, tpr: 0.35 },
    { fpr: 0.05, tpr: 0.62 },
    { fpr: 0.09, tpr: 0.81 },
    { fpr: 0.14, tpr: 0.89 },
    { fpr: 0.22, tpr: 0.94 },
    { fpr: 0.35, tpr: 0.97 },
    { fpr: 0.55, tpr: 0.99 },
    { fpr: 1.0, tpr: 1.0 }
  ];

  const rocPointsRandomForest = [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.04, tpr: 0.28 },
    { fpr: 0.08, tpr: 0.52 },
    { fpr: 0.15, tpr: 0.74 },
    { fpr: 0.24, tpr: 0.84 },
    { fpr: 0.38, tpr: 0.91 },
    { fpr: 0.60, tpr: 0.96 },
    { fpr: 1.0, tpr: 1.0 }
  ];

  const rocPointsLogistic = [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.08, tpr: 0.22 },
    { fpr: 0.18, tpr: 0.45 },
    { fpr: 0.28, tpr: 0.64 },
    { fpr: 0.42, tpr: 0.76 },
    { fpr: 0.60, tpr: 0.86 },
    { fpr: 1.0, tpr: 1.0 }
  ];

  const currentFpr = Number((thresholdMetrics.confusionMatrix.falsePositive / 470).toFixed(2));
  const currentTpr = Number((thresholdMetrics.confusionMatrix.truePositive / 155).toFixed(2));

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span>Model Evaluation & Diagnostics</span>
            <span className="text-slate-600">·</span>
            <span>Holdout Test Set (N=625)</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
            ML Model Benchmarking: Logistic Regression vs Random Forest vs XGBoost
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluating discrimination capacity, precision/recall trade-offs, and cost-benefit optimization under varying decision boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-400 font-mono">Champion Algorithm:</div>
          <span className="text-xs font-bold font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            XGBoost (AUC 0.924)
          </span>
        </div>
      </div>

      {/* Model Benchmark Comparison Table Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BENCHMARK_MODELS.map((model, idx) => {
          const isSelected = selectedModelIndex === idx;
          const isChampion = idx === 0;

          return (
            <div
              key={model.name}
              onClick={() => setSelectedModelIndex(idx)}
              className={`p-5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                      {idx === 0 ? 'Production Model' : idx === 1 ? 'Ensemble' : 'Baseline'}
                    </span>
                  </div>
                  {isChampion && (
                    <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded font-semibold">
                      CHAMPION
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-4">{model.name}</h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 block">ROC-AUC</span>
                    <span className="font-mono text-base font-bold text-cyan-400 tabular-nums">{model.rocAuc.toFixed(3)}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 block">PR-AUC</span>
                    <span className="font-mono text-base font-bold text-white tabular-nums">{model.prAuc.toFixed(3)}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 block">F1-Score</span>
                    <span className="font-mono text-sm font-semibold text-slate-200 tabular-nums">{model.f1Score.toFixed(3)}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 block">Recall</span>
                    <span className="font-mono text-sm font-semibold text-slate-200 tabular-nums">{(model.recall * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Inference: {model.inferenceLatencyMs}ms</span>
                <span>Train: {model.trainingTimeMs}ms</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive ROC / PR Curve & Decision Threshold Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Curve Chart (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                {activeCurveTab === 'roc' ? 'Receiver Operating Characteristic (ROC)' : 'Precision-Recall (PR) Curve'}
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveCurveTab('roc')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeCurveTab === 'roc' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ROC Curve
              </button>
              <button
                onClick={() => setActiveCurveTab('pr')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeCurveTab === 'pr' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PR Curve
              </button>
            </div>
          </div>

          {/* SVG ROC Curve Visualizer */}
          <div className="relative bg-slate-950 border border-slate-800/80 rounded-lg p-4 h-72 flex flex-col justify-between">
            {/* SVG Graph */}
            <svg viewBox="0 0 400 240" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="380" y2="70" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="380" y2="120" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="170" x2="380" y2="170" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="210" x2="380" y2="210" stroke="#334155" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="210" stroke="#334155" strokeWidth="1.5" />

              {/* Diagonal Random Guess Baseline (AUC = 0.50) */}
              <line x1="40" y1="210" x2="380" y2="20" stroke="#475569" strokeDasharray="4 4" strokeWidth="1" />

              {/* Logistic Regression Curve (dimmed gray/indigo) */}
              <path
                d="M 40 210 Q 90 140 180 90 T 380 20"
                fill="none"
                stroke="#6366f1"
                strokeWidth={selectedModelIndex === 2 ? 3 : 1.5}
                opacity={selectedModelIndex === 2 ? 1 : 0.4}
              />

              {/* Random Forest Curve */}
              <path
                d="M 40 210 Q 75 110 160 55 T 380 20"
                fill="none"
                stroke="#f59e0b"
                strokeWidth={selectedModelIndex === 1 ? 3 : 1.5}
                opacity={selectedModelIndex === 1 ? 1 : 0.4}
              />

              {/* XGBoost Curve (Cyan) */}
              <path
                d="M 40 210 Q 60 80 140 38 T 380 20"
                fill="none"
                stroke="#06b6d4"
                strokeWidth={selectedModelIndex === 0 ? 3.5 : 1.5}
                opacity={selectedModelIndex === 0 ? 1 : 0.4}
              />

              {/* Operating Threshold Marker on current curve */}
              {selectedModelIndex === 0 && (
                <g>
                  {/* Marker Circle */}
                  <circle
                    cx={40 + currentFpr * 340}
                    cy={210 - currentTpr * 190}
                    r="6"
                    fill="#06b6d4"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <text
                    x={40 + currentFpr * 340 + 10}
                    y={210 - currentTpr * 190 - 5}
                    fill="#38bdf8"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    Threshold {threshold.toFixed(2)} (TPR: {currentTpr}, FPR: {currentFpr})
                  </text>
                </g>
              )}

              {/* Axis labels */}
              <text x="210" y="235" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
                False Positive Rate (1 - Specificity)
              </text>
              <text x="15" y="115" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" transform="rotate(-90 15 115)">
                True Positive Rate (Recall)
              </text>
            </svg>
          </div>

          {/* Curve Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
                <span>XGBoost (0.924)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-400 inline-block" />
                <span>Random Forest (0.886)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-indigo-400 inline-block" />
                <span>Logistic Reg (0.812)</span>
              </span>
            </div>
            <span className="text-slate-500">Dashed = Random Guess (0.500)</span>
          </div>
        </div>

        {/* Right Column: Threshold Slider & Confusion Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Decision Threshold Tuning</h3>
              </div>
              <span className="text-sm font-bold font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
                τ = {threshold.toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Adjust classification cut-off. Lower threshold prioritizes recall (saving more at-risk accounts); higher threshold preserves CSM team bandwidth.
            </p>

            <div className="pt-2">
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.02"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
                <span>0.10 (High Recall)</span>
                <span className="text-cyan-400 font-semibold">0.42 (Optimal ROI)</span>
                <span>0.90 (High Precision)</span>
              </div>
            </div>
          </div>

          {/* Dynamic Confusion Matrix */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">Confusion Matrix (Holdout Test N=625)</div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {/* True Positive */}
              <div className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-lg">
                <div className="text-emerald-400 font-semibold text-xs">True Positive (TP)</div>
                <div className="text-xl font-bold text-white mt-1 tabular-nums">
                  {thresholdMetrics.confusionMatrix.truePositive}
                </div>
                <div className="text-slate-400 text-xs mt-0.5">Correctly flagged churners saved</div>
              </div>

              {/* False Positive */}
              <div className="bg-amber-950/40 border border-amber-800/50 p-3 rounded-lg">
                <div className="text-amber-400 font-semibold text-xs">False Positive (FP)</div>
                <div className="text-xl font-bold text-white mt-1 tabular-nums">
                  {thresholdMetrics.confusionMatrix.falsePositive}
                </div>
                <div className="text-slate-400 text-xs mt-0.5">Retained accounts contacted</div>
              </div>

              {/* False Negative */}
              <div className="bg-rose-950/40 border border-rose-800/50 p-3 rounded-lg">
                <div className="text-rose-400 font-semibold text-xs">False Negative (FN)</div>
                <div className="text-xl font-bold text-white mt-1 tabular-nums">
                  {thresholdMetrics.confusionMatrix.falseNegative}
                </div>
                <div className="text-slate-400 text-xs mt-0.5">Missed churners (lost revenue)</div>
              </div>

              {/* True Negative */}
              <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg">
                <div className="text-slate-400 font-semibold text-xs">True Negative (TN)</div>
                <div className="text-xl font-bold text-white mt-1 tabular-nums">
                  {thresholdMetrics.confusionMatrix.trueNegative}
                </div>
                <div className="text-slate-400 text-xs mt-0.5">Correctly predicted loyal</div>
              </div>
            </div>
          </div>

          {/* Business ROI & Financial Impact Calculator */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <DollarSign className="w-4 h-4" />
                Financial Impact at τ = {threshold.toFixed(2)}
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {thresholdMetrics.financial.roiMultiplier}x Net ROI
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Gross ARR Preserved:</span>
                <span className="text-emerald-400 font-semibold">
                  +${thresholdMetrics.financial.grossRevenuePreserved.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Retention Outreach Cost:</span>
                <span className="text-rose-400">
                  -${thresholdMetrics.financial.totalInterventionCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40 font-bold">
                <span className="text-white">Net Business Value Created:</span>
                <span className="text-cyan-400">
                  +${thresholdMetrics.financial.netFinancialValue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-500">
                <span>Missed Revenue Exposure (FN):</span>
                <span>${thresholdMetrics.financial.missedRevenueLoss.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
