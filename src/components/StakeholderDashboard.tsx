import React, { useState } from 'react';
import { Customer } from '../types/churn';
import { BENCHMARK_MODELS, GLOBAL_FEATURE_IMPORTANCE } from '../ml/churnEngine';
import { TrendingDown, TrendingUp, DollarSign, Users, ShieldAlert, Award, FileSpreadsheet, Download, CheckCircle2, HelpCircle, Layers, ArrowRight, Sparkles, Filter, ChevronRight, ChevronDown, ChevronUp, Sliders, LineChart, Calendar, Activity, Bell, BellRing, Mail, MessageSquare, Send, Radio, Check, CheckCheck, AlertTriangle, AlertCircle, Search, SlidersHorizontal, Save, RotateCcw, PieChart, Table, Clock, History, UserCheck, FileText, Printer, X } from 'lucide-react';
import { exportExecutivePdf, exportExecutiveCsv, exportAlertHistoryCsv, ExecutiveReportData } from '../utils/executiveExport';

export interface AlertHistoryEntry {
  id: string;
  timestamp: string;
  relativeTime: string;
  customerId: string;
  customerName: string;
  industry: string;
  contractTier: string;
  segment: 'High-Rollers at Risk' | 'Shelfware Traps' | 'Billing Friction' | 'Sudden Velocity Spike' | 'Enterprise Critical';
  severity: 'Critical' | 'High' | 'Warning';
  triggeredRiskPercent: number;
  thresholdLimitPercent: number;
  mrr: number;
  arrExposed: number;
  triggerEvent: string;
  primaryDriver: string;
  contextSummary: string;
  channelsDispatched: ('slack' | 'salesforce' | 'email' | 'webhook')[];
  status: 'DISPATCHED' | 'ACKNOWLEDGED' | 'PLAYBOOK_EXECUTED' | 'RESOLVED';
  assignedCsm: string;
  actionTaken: string;
}

export const INITIAL_ALERT_HISTORY: AlertHistoryEntry[] = [
  {
    id: 'ALT-9821',
    timestamp: '2026-09-28 13:42 UTC',
    relativeTime: 'Today at 13:42',
    customerId: 'CUST-8021',
    customerName: 'Vanguard Logistics Corp',
    industry: 'Supply Chain & Freight',
    contractTier: 'Enterprise Annual',
    segment: 'High-Rollers at Risk',
    severity: 'Critical',
    triggeredRiskPercent: 88,
    thresholdLimitPercent: 65,
    mrr: 9200,
    arrExposed: 110400,
    triggerEvent: 'Crossed 65% trigger limit (+23% overshoot). Risk accelerated +18% over 14 days.',
    primaryDriver: 'Seat Utilization Collapsed (-0.34 SHAP impact)',
    contextSummary: 'Active seat utilization dropped from 82% to 28% following restructuring in regional logistics ops. 4 unresolved P1 tickets aged >18 days. Contract renewal scheduled in 45 days.',
    channelsDispatched: ['slack', 'salesforce', 'email'],
    status: 'ACKNOWLEDGED',
    assignedCsm: 'Sarah Jenkins (Enterprise CSM Lead)',
    actionTaken: 'Escalated to VP Customer Success. Initiated Executive Alignment & Urgent Health Sprint playbook. Sponsor call booked for Oct 2.'
  },
  {
    id: 'ALT-9818',
    timestamp: '2026-09-27 16:15 UTC',
    relativeTime: 'Yesterday at 16:15',
    customerId: 'CUST-8024',
    customerName: 'Apex Cloud Technologies',
    industry: 'DevOps & Infrastructure',
    contractTier: 'Growth Multi-Seat',
    segment: 'Sudden Velocity Spike',
    severity: 'High',
    triggeredRiskPercent: 71,
    thresholdLimitPercent: 65,
    mrr: 7800,
    arrExposed: 93600,
    triggerEvent: 'Velocity Spike Trigger: 7-day risk surge of +22% (jumped from 49% to 71%).',
    primaryDriver: '3 Consecutive Payment Failures (-0.29 SHAP impact)',
    contextSummary: 'Corporate card bounced across three automated billing retries due to credit card expiration. System locked automated deploy queues, triggering customer frustration and ticket surge.',
    channelsDispatched: ['slack', 'email', 'webhook'],
    status: 'PLAYBOOK_EXECUTED',
    assignedCsm: 'David Miller (Technical CSM)',
    actionTaken: 'Dispatched ACH Billing Transition Bridge with automated $250 fee credit. Corporate payment method successfully updated.'
  },
  {
    id: 'ALT-9814',
    timestamp: '2026-09-26 10:30 UTC',
    relativeTime: '2 days ago',
    customerId: 'CUST-8027',
    customerName: 'Horizon Health Solutions',
    industry: 'Healthcare IT',
    contractTier: 'Enterprise Dedicated',
    segment: 'Billing Friction',
    severity: 'High',
    triggeredRiskPercent: 68,
    thresholdLimitPercent: 65,
    mrr: 8500,
    arrExposed: 102000,
    triggerEvent: 'Crossed 65% risk threshold on $8,500/mo MRR enterprise account.',
    primaryDriver: 'Billing Disputes & Gateway Timeouts (-0.26 SHAP impact)',
    contextSummary: 'Internal ERP migration at customer caused ACH direct debit timeouts. Accounts payable team requested custom consolidated monthly invoice.',
    channelsDispatched: ['slack', 'salesforce'],
    status: 'RESOLVED',
    assignedCsm: 'Elena Rostova (Senior Director CSM)',
    actionTaken: 'Assigned enterprise billing specialist to setup Net-30 invoicing with manual wire clearing. Risk recalculated to 34% (Safe Haven).'
  },
  {
    id: 'ALT-9809',
    timestamp: '2026-09-24 14:05 UTC',
    relativeTime: '4 days ago',
    customerId: 'CUST-8031',
    customerName: 'CyberShield Security Labs',
    industry: 'Cybersecurity',
    contractTier: 'Enterprise Scale',
    segment: 'Shelfware Traps',
    severity: 'High',
    triggeredRiskPercent: 72,
    thresholdLimitPercent: 65,
    mrr: 6400,
    arrExposed: 76800,
    triggerEvent: 'Threshold breached: Churn risk 72% with seat utilization under 18%.',
    primaryDriver: 'Low Seat Activation & Zero API Telemetry (-0.31 SHAP impact)',
    contextSummary: 'Contracted for 250 security analyst seats; only 45 unique logins recorded in past 30 days. Lead champion left organization during merger.',
    channelsDispatched: ['slack', 'email', 'webhook'],
    status: 'PLAYBOOK_EXECUTED',
    assignedCsm: 'Marcus Vance (Solutions Architect)',
    actionTaken: 'Conducted hands-on onboarding workshop with new SecOps team. Activated automated API integration connector.'
  },
  {
    id: 'ALT-9805',
    timestamp: '2026-09-21 11:20 UTC',
    relativeTime: '7 days ago',
    customerId: 'CUST-8033',
    customerName: 'RetailPulse Global',
    industry: 'E-Commerce Analytics',
    contractTier: 'Enterprise Platinum',
    segment: 'High-Rollers at Risk',
    severity: 'Critical',
    triggeredRiskPercent: 81,
    thresholdLimitPercent: 65,
    mrr: 10500,
    arrExposed: 126000,
    triggerEvent: 'High-Value Account breach: $10,500/mo account reached 81% churn probability.',
    primaryDriver: 'Competitor Evaluation & SSO Drop (-0.38 SHAP impact)',
    contextSummary: 'Daily active usage declined 40% over 60 days. Stakeholder survey indicated evaluation of competing BI stack before annual budget freeze.',
    channelsDispatched: ['slack', 'salesforce', 'email'],
    status: 'ACKNOWLEDGED',
    assignedCsm: 'Sarah Jenkins (Enterprise CSM Lead)',
    actionTaken: 'Presented custom 2-year renewal proposal with 15% rate lock and dedicated engineering SLA.'
  },
  {
    id: 'ALT-9799',
    timestamp: '2026-09-18 09:12 UTC',
    relativeTime: '10 days ago',
    customerId: 'CUST-8036',
    customerName: 'QuantBio Informatics',
    industry: 'Life Sciences & Biotech',
    contractTier: 'Pro Growth',
    segment: 'Sudden Velocity Spike',
    severity: 'Warning',
    triggeredRiskPercent: 54,
    thresholdLimitPercent: 50,
    mrr: 5200,
    arrExposed: 62400,
    triggerEvent: 'Velocity Spike: Churn risk increased +17% within 10 days.',
    primaryDriver: 'Support Ticket Velocity Collapse (-0.22 SHAP impact)',
    contextSummary: 'Sudden cessation of product usage following grant funding transition. Primary lab manager transitioned to new institution.',
    channelsDispatched: ['slack'],
    status: 'RESOLVED',
    assignedCsm: 'David Miller (Technical CSM)',
    actionTaken: 'Onboarded replacement principal investigator and extended pilot license terms by 30 days.'
  }
];

interface StakeholderDashboardProps {
  customers: Customer[];
  onNavigateToCustomer: (customerId: string) => void;
}

export const StakeholderDashboard: React.FC<StakeholderDashboardProps> = ({
  customers,
  onNavigateToCustomer
}) => {
  const [selectedSegment, setSelectedSegment] = useState<'all' | 'high_rollers' | 'shelfware' | 'billing' | 'champions'>('all');
  const [cohortViewMode, setCohortViewMode] = useState<'percent' | 'revenue'>('percent');

  // Segmentation Mode Switcher: Predefined vs Dynamic Custom Cohort Builder
  const [segmentationMode, setSegmentationMode] = useState<'preset' | 'custom_filter'>('preset');

  // Dynamic Custom Cohort Filters State (Churn Risk, Tenure, CLV)
  const [filterRiskMin, setFilterRiskMin] = useState<number>(0);
  const [filterRiskMax, setFilterRiskMax] = useState<number>(100);
  const [filterTenureMin, setFilterTenureMin] = useState<number>(0);
  const [filterTenureMax, setFilterTenureMax] = useState<number>(48);
  const [filterClvMin, setFilterClvMin] = useState<number>(0); // CLV / Total Spend
  const [filterClvMax, setFilterClvMax] = useState<number>(1200000);
  const [filterSearchQuery, setFilterSearchQuery] = useState<string>('');
  const [activeCustomPreset, setActiveCustomPreset] = useState<string | null>(null);
  const [cohortSavedNotice, setCohortSavedNotice] = useState<string | null>(null);

  // Long-Term Churn Projection & Trend Analysis Simulation State
  const [projectionHorizon, setProjectionHorizon] = useState<6 | 12 | 24>(12);
  const [growthRate, setGrowthRate] = useState<number>(8); // 8% monthly customer acquisition growth
  const [interventionCoverage, setInterventionCoverage] = useState<number>(85); // 85% playbook coverage
  const [trendScenario, setTrendScenario] = useState<'momentum' | 'headwind' | 'optimized'>('momentum');
  const [showConfidenceBands, setShowConfidenceBands] = useState<boolean>(true);
  const [showHistoricalActuals, setShowHistoricalActuals] = useState<boolean>(true);
  const [showProjectionTable, setShowProjectionTable] = useState<boolean>(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Custom Churn Risk Notification Trigger & Alert History State
  const [activeAlertTab, setActiveAlertTab] = useState<'config' | 'history'>('config');
  const [alertHistory, setAlertHistory] = useState<AlertHistoryEntry[]>(INITIAL_ALERT_HISTORY);
  const [historySearch, setHistorySearch] = useState<string>('');
  const [historySegmentFilter, setHistorySegmentFilter] = useState<string>('all');
  const [historySeverityFilter, setHistorySeverityFilter] = useState<string>('all');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('all');

  const [riskThresholdPercent, setRiskThresholdPercent] = useState<number>(65);
  const [minMrrThreshold, setMinMrrThreshold] = useState<number>(5000);
  const [enableSpikeTrigger, setEnableSpikeTrigger] = useState<boolean>(true);
  const [alertCadence, setAlertCadence] = useState<'immediate' | 'hourly' | 'daily'>('immediate');
  const [alertChannels, setAlertChannels] = useState<{
    slack: boolean;
    salesforce: boolean;
    email: boolean;
    webhook: boolean;
  }>({
    slack: true,
    salesforce: true,
    email: true,
    webhook: false
  });
  const [testAlertFeedback, setTestAlertFeedback] = useState<string | null>(null);
  const [configSavedBanner, setConfigSavedBanner] = useState<boolean>(false);

  // Executive Export State & Handlers
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const getReportData = (): ExecutiveReportData => ({
    customers,
    totalArr,
    totalMrr,
    atRiskArr,
    atRiskPct,
    churnRate: '1.82%',
    nrr: '114.8%',
    alertHistory,
    riskThreshold: riskThresholdPercent,
    minMrrThreshold
  });

  const handleExportPdf = () => {
    setIsExportMenuOpen(false);
    exportExecutivePdf(getReportData());
    setExportNotice('Executive Boardroom Briefing PDF downloaded successfully.');
    setTimeout(() => setExportNotice(null), 4500);
  };

  const handleExportCsv = () => {
    setIsExportMenuOpen(false);
    exportExecutiveCsv(getReportData());
    setExportNotice('Executive Portfolio Dataset CSV downloaded successfully.');
    setTimeout(() => setExportNotice(null), 4500);
  };

  const handleExportAlertsCsv = () => {
    setIsExportMenuOpen(false);
    exportAlertHistoryCsv(alertHistory);
    setExportNotice('Alert History Audit Log CSV downloaded successfully.');
    setTimeout(() => setExportNotice(null), 4500);
  };

  const totalMrr = customers.reduce((sum, c) => sum + c.mrr, 0);
  const totalArr = totalMrr * 12;

  const criticalCustomers = customers.filter(c => c.riskTier === 'Critical');
  const highCustomers = customers.filter(c => c.riskTier === 'High');

  const atRiskMrr = [...criticalCustomers, ...highCustomers].reduce((sum, c) => sum + c.mrr, 0);
  const atRiskArr = atRiskMrr * 12;
  const atRiskPct = Math.round((atRiskMrr / totalMrr) * 100);

  // 4 Business Segments
  const highRollersAtRisk = customers.filter(c => c.mrr >= 7000 && c.churnProbability >= 0.50);
  const shelfwareTraps = customers.filter(c => (c.activeSeats / c.contractedSeats) < 0.40);
  const billingFriction = customers.filter(c => c.paymentFailuresLast6m > 0);
  const safeHavenChampions = customers.filter(c => c.churnProbability <= 0.20);

  const getFilteredCustomers = () => {
    switch (selectedSegment) {
      case 'high_rollers': return highRollersAtRisk;
      case 'shelfware': return shelfwareTraps;
      case 'billing': return billingFriction;
      case 'champions': return safeHavenChampions;
      default: return [...criticalCustomers, ...highCustomers];
    }
  };

  const championModel = BENCHMARK_MODELS[0]; // XGBoost

  // 12-Month Cohort Retention Heatmap matrix
  const cohortMatrix = [
    { cohort: '2025 Q3', size: 140, mrrBase: 185000, m0: 100, m2: 96, m4: 93, m6: 89, m8: 86, m10: 84, m12: 82 },
    { cohort: '2025 Q4', size: 165, mrrBase: 220000, m0: 100, m2: 97, m4: 94, m6: 91, m8: 88, m10: 87, m12: 85 },
    { cohort: '2026 Q1', size: 180, mrrBase: 260000, m0: 100, m2: 98, m4: 95, m6: 93, m8: 91, m10: 90, m12: null },
    { cohort: '2026 Q2', size: 210, mrrBase: 310000, m0: 100, m2: 98, m4: 96, m6: 94, m8: null, m10: null, m12: null },
    { cohort: '2026 Q3', size: 245, mrrBase: 375000, m0: 100, m2: 99, m4: null, m6: null, m8: null, m10: null, m12: null }
  ];

  const getHeatmapColor = (pct: number | null) => {
    if (pct === null) return 'bg-slate-900/40 text-slate-600';
    if (pct >= 95) return 'bg-emerald-950/60 text-emerald-300 font-bold';
    if (pct >= 90) return 'bg-emerald-950/40 text-emerald-400';
    if (pct >= 85) return 'bg-cyan-950/40 text-cyan-300';
    if (pct >= 80) return 'bg-amber-950/40 text-amber-300';
    return 'bg-rose-950/40 text-rose-300 font-bold';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span>Executive Strategic Cockpit</span>
            <span className="text-slate-600">·</span>
            <span>Non-Technical Business Translation Layer</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            Stakeholder Dashboard: Retention, Model Trust & ARR Exposure
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Designed for executive stakeholders: Translating complex machine learning metrics into plain-English business strategy, customer segmentation, and ARR preservation playbooks.
          </p>
        </div>

        {/* Executive Export Dropdown Controls */}
        <div className="relative shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-cyan-950/50"
            >
              <Download className="w-4 h-4" />
              <span>Export Executive Report</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Export Dropdown Menu */}
          {isExportMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsExportMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                  <span className="font-bold text-slate-200 block uppercase tracking-wider">Executive Review Exports</span>
                  <span>Formatted for boardroom presentations &amp; analytics</span>
                </div>

                {/* Option 1: PDF Report */}
                <button
                  onClick={handleExportPdf}
                  className="w-full p-2.5 rounded-lg hover:bg-slate-800 text-left text-xs transition-colors flex items-start gap-3 group"
                >
                  <div className="p-1.5 bg-rose-950/80 border border-rose-800/80 rounded-md text-rose-400 group-hover:scale-105 transition-transform mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Export Boardroom PDF (.pdf)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Official 2-page boardroom briefing with KPI tiles, model trust scorecard, and high-risk accounts.
                    </div>
                  </div>
                </button>

                {/* Option 2: CSV Data Report */}
                <button
                  onClick={handleExportCsv}
                  className="w-full p-2.5 rounded-lg hover:bg-slate-800 text-left text-xs transition-colors flex items-start gap-3 group"
                >
                  <div className="p-1.5 bg-emerald-950/80 border border-emerald-800/80 rounded-md text-emerald-400 group-hover:scale-105 transition-transform mt-0.5">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Export Executive Portfolio (.csv)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Complete account dataset with ARR, churn probabilities, and SHAP drivers for Excel / BI.
                    </div>
                  </div>
                </button>

                {/* Option 3: Alert History CSV */}
                <button
                  onClick={handleExportAlertsCsv}
                  className="w-full p-2.5 rounded-lg hover:bg-slate-800 text-left text-xs transition-colors flex items-start gap-3 group"
                >
                  <div className="p-1.5 bg-amber-950/80 border border-amber-800/80 rounded-md text-amber-400 group-hover:scale-105 transition-transform mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Export Alert History Log (.csv)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Chronological audit log of all threshold violations, CSM assignments, and interventions.
                    </div>
                  </div>
                </button>

                {/* Option 4: On-Screen Preview Modal */}
                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      setIsPreviewModalOpen(true);
                    }}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 text-cyan-300 font-semibold rounded-lg text-xs transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Preview Briefing Document</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Export Notice Banner */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/80 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{exportNotice}</span>
        </div>
      )}

      {/* SECTION 1: TOP EXECUTIVE MACRO TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Churn Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-white">Monthly Churn Rate</span>
            <span className="text-emerald-400 font-mono text-xs flex items-center gap-0.5 font-bold">
              <TrendingDown className="w-3 h-3" /> -0.6% MoM
            </span>
          </div>
          <div className="text-3xl font-bold text-cyan-400 font-mono mt-2 tabular-nums">
            1.82%
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Target threshold: &lt; 2.0% monthly. Below SaaS industry median (2.4%).
          </div>
        </div>

        {/* Metric 2: Net Revenue Retention */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-white">Net Revenue Retention (NRR)</span>
            <span className="text-emerald-400 font-mono text-xs font-bold">
              Best-in-Class
            </span>
          </div>
          <div className="text-3xl font-bold text-emerald-400 font-mono mt-2 tabular-nums">
            114.8%
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Existing account expansion ($182k) outpaces gross revenue lost to churn.
          </div>
        </div>

        {/* Metric 3: Monitored ARR */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-white">Total Active Portfolio ARR</span>
            <span className="text-slate-400 font-mono text-xs">
              {customers.length} Accounts
            </span>
          </div>
          <div className="text-3xl font-bold text-white font-mono mt-2 tabular-nums">
            ${(totalArr / 1000000).toFixed(2)}M
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            ${totalMrr.toLocaleString()}/mo contracted baseline
          </div>
        </div>

        {/* Metric 4: ARR at Risk */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-white">ARR at Immediate Risk</span>
            <span className="text-rose-400 font-mono text-xs font-bold">
              {atRiskPct}% of Portfolio
            </span>
          </div>
          <div className="text-3xl font-bold text-rose-400 font-mono mt-2 tabular-nums">
            ${(atRiskArr / 1000).toFixed(0)}k
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {criticalCustomers.length + highCustomers.length} accounts flagged for intervention.
          </div>
        </div>
      </div>

      {/* SECTION 2: MODEL ACCURACY & TRUST SCORECARD (NON-TECHNICAL TRANSLATION) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">
                Machine Learning Model Trust & Accuracy Scorecard
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Production Algorithm: <strong className="text-slate-200">XGBoost v2.4.1</strong> · Decision Threshold: <strong className="text-cyan-400 font-mono">τ = 0.42</strong>
            </p>
          </div>

          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-lg flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>High Confidence Grade (91.2% Reliable)</span>
          </div>
        </div>

        {/* 4 Core Accuracy Metrics with Plain-English Explanations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ROC-AUC */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ROC-AUC Score</span>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">Grade A+</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {championModel.rocAuc.toFixed(3)}
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Non-Technical Meaning:</strong> 92.4% discrimination power to correctly separate true churners from loyal accounts across all probability cutoffs.
            </div>
          </div>

          {/* Precision */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Precision</span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">High Accuracy</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {(championModel.precision * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Business Impact:</strong> When the model flags an account as at-risk, it is correct 88.4% of the time, eliminating wasted CSM team bandwidth.
            </div>
          </div>

          {/* Recall */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recall (Sensitivity)</span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">Safety Net</span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {(championModel.recall * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Executive Meaning:</strong> Catches 87.1% of all total cancellations 30–60 days in advance, leaving fewer than 13% unflagged surprises.
            </div>
          </div>

          {/* F1-Score */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">F1-Score Balance</span>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">Optimal</span>
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {championModel.f1Score.toFixed(3)}
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Strategic Balance:</strong> Harmonizes precision and recall to maximize net revenue preserved ($850k net ARR saved at optimal τ=0.42).
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: STRATEGIC CUSTOMER SEGMENTATION & DYNAMIC COHORT BUILDER */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">
                Customer Segmentation & Dynamic Cohort Builder
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyze pre-defined executive segments or construct custom customer cohorts dynamically filtered by churn probability, contract tenure, and customer lifetime value (CLV).
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setSegmentationMode('preset')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                segmentationMode === 'preset' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-cyan-400" />
              <span>Strategic Presets</span>
            </button>
            <button
              onClick={() => setSegmentationMode('custom_filter')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                segmentationMode === 'custom_filter' ? 'bg-slate-800 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Custom Cohort Builder</span>
            </button>
          </div>
        </div>

        {cohortSavedNotice && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center justify-between transition-all animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{cohortSavedNotice}</span>
            </div>
            <span className="font-mono text-emerald-400 font-bold">200 OK</span>
          </div>
        )}

        {/* MODE A: PRE-DEFINED STRATEGIC PRESETS */}
        {segmentationMode === 'preset' && (
          <div className="space-y-4">
            {/* Segment Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium pb-1">
              <button
                onClick={() => setSelectedSegment('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  selectedSegment === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All At-Risk ({criticalCustomers.length + highCustomers.length})
              </button>
              <button
                onClick={() => setSelectedSegment('high_rollers')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  selectedSegment === 'high_rollers' ? 'bg-rose-950 text-rose-300 font-semibold border border-rose-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                High-Rollers at Risk ({highRollersAtRisk.length})
              </button>
              <button
                onClick={() => setSelectedSegment('shelfware')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  selectedSegment === 'shelfware' ? 'bg-amber-950 text-amber-300 font-semibold border border-amber-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                Shelfware Traps ({shelfwareTraps.length})
              </button>
              <button
                onClick={() => setSelectedSegment('billing')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  selectedSegment === 'billing' ? 'bg-purple-950 text-purple-300 font-semibold border border-purple-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                Billing Friction ({billingFriction.length})
              </button>
              <button
                onClick={() => setSelectedSegment('champions')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  selectedSegment === 'champions' ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                Champions ({safeHavenChampions.length})
              </button>
            </div>

            {/* 4 Segment Definition Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setSelectedSegment('high_rollers')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSegment === 'high_rollers' ? 'bg-slate-900 border-rose-500 shadow-md ring-1 ring-rose-500/50' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-400 uppercase">High-Rollers at Risk</span>
                  <span className="text-xs font-mono font-bold text-white bg-rose-950 px-2 py-0.5 rounded">
                    ${(highRollersAtRisk.reduce((s, c) => s + c.mrr, 0) * 12 / 1000).toFixed(0)}k ARR
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  High-value Enterprise accounts ($7k+/mo MRR) with churn probability &ge; 50%.
                </p>
                <div className="mt-3 text-xs font-mono text-cyan-400 flex items-center justify-between">
                  <span>{highRollersAtRisk.length} Key Accounts</span>
                  <span>Action: VP Sponsor Call</span>
                </div>
              </div>

              <div
                onClick={() => setSelectedSegment('shelfware')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSegment === 'shelfware' ? 'bg-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/50' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase">Shelfware Traps</span>
                  <span className="text-xs font-mono font-bold text-white bg-amber-950 px-2 py-0.5 rounded">
                    ${(shelfwareTraps.reduce((s, c) => s + c.mrr, 0) * 12 / 1000).toFixed(0)}k ARR
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Accounts paying for contracted licenses but utilizing under 40% of seats.
                </p>
                <div className="mt-3 text-xs font-mono text-cyan-400 flex items-center justify-between">
                  <span>{shelfwareTraps.length} Accounts</span>
                  <span>Action: Adoption Sprint</span>
                </div>
              </div>

              <div
                onClick={() => setSelectedSegment('billing')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSegment === 'billing' ? 'bg-slate-900 border-purple-500 shadow-md ring-1 ring-purple-500/50' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-400 uppercase">Billing Friction</span>
                  <span className="text-xs font-mono font-bold text-white bg-purple-950 px-2 py-0.5 rounded">
                    ${(billingFriction.reduce((s, c) => s + c.mrr, 0) * 12 / 1000).toFixed(0)}k ARR
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Accounts with repeated invoice payment bounces or expired credit cards.
                </p>
                <div className="mt-3 text-xs font-mono text-cyan-400 flex items-center justify-between">
                  <span>{billingFriction.length} Accounts</span>
                  <span>Action: ACH Payment Switch</span>
                </div>
              </div>

              <div
                onClick={() => setSelectedSegment('champions')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSegment === 'champions' ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/50' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase">Champions</span>
                  <span className="text-xs font-mono font-bold text-white bg-emerald-950 px-2 py-0.5 rounded">
                    ${(safeHavenChampions.reduce((s, c) => s + c.mrr, 0) * 12 / 1000).toFixed(0)}k ARR
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Sticky multi-year partners with 90%+ utilization and promoter NPS scores.
                </p>
                <div className="mt-3 text-xs font-mono text-cyan-400 flex items-center justify-between">
                  <span>{safeHavenChampions.length} Core Accounts</span>
                  <span>Action: Advisory Board</span>
                </div>
              </div>
            </div>

            {/* Selected Preset Accounts Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Showing Accounts in: <strong className="text-cyan-400">{selectedSegment.toUpperCase().replace(/_/g, ' ')}</strong> ({getFilteredCustomers().length} Accounts)
                </h3>
                <span className="text-xs font-mono text-slate-400">Click any row to drill down in Customer 360</span>
              </div>

              <div className="space-y-2">
                {getFilteredCustomers().map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onNavigateToCustomer(c.id)}
                    className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">{c.name}</span>
                        <span className="text-slate-500 font-mono">({c.id})</span>
                        <span className="text-slate-400 font-mono">· {c.contractTier} ({c.contractType})</span>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${c.churnProbability >= 0.7 ? 'bg-rose-950 text-rose-300 border border-rose-800' : c.churnProbability >= 0.5 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                          {Math.round(c.churnProbability * 100)}% Churn Risk
                        </span>
                      </div>
                      <div className="text-slate-400 mt-1">
                        Primary Churn Factor: <strong className="text-slate-200">{c.topDrivers[0]}</strong>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center sm:flex-col sm:items-end justify-between sm:justify-center">
                      <div className="font-mono font-bold text-white text-sm">
                        ${(c.mrr * 12).toLocaleString()} ARR (${c.mrr.toLocaleString()}/mo)
                      </div>
                      <div className="text-xs text-cyan-400 mt-0.5 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Inspect 360 Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE B: DYNAMIC CUSTOM COHORT BUILDER & FILTERS */}
        {segmentationMode === 'custom_filter' && (() => {
          // Dynamic filtering logic
          const customFilteredCustomers = customers.filter(c => {
            const riskPct = Math.round(c.churnProbability * 100);
            const matchesRisk = riskPct >= filterRiskMin && riskPct <= filterRiskMax;
            const matchesTenure = c.tenureMonths >= filterTenureMin && c.tenureMonths <= filterTenureMax;
            const matchesClv = c.totalSpend >= filterClvMin && c.totalSpend <= filterClvMax;
            const matchesSearch = !filterSearchQuery ||
              c.name.toLowerCase().includes(filterSearchQuery.toLowerCase()) ||
              c.id.toLowerCase().includes(filterSearchQuery.toLowerCase()) ||
              c.industry.toLowerCase().includes(filterSearchQuery.toLowerCase());

            return matchesRisk && matchesTenure && matchesClv && matchesSearch;
          });

          // Metrics for custom cohort
          const cohortCount = customFilteredCustomers.length;
          const cohortMrr = customFilteredCustomers.reduce((s, c) => s + c.mrr, 0);
          const cohortArr = cohortMrr * 12;
          const cohortTotalClv = customFilteredCustomers.reduce((s, c) => s + c.totalSpend, 0);
          const cohortAvgRisk = cohortCount > 0
            ? Number((customFilteredCustomers.reduce((s, c) => s + c.churnProbability, 0) / cohortCount * 100).toFixed(1))
            : 0;
          const cohortAvgTenure = cohortCount > 0
            ? Math.round(customFilteredCustomers.reduce((s, c) => s + c.tenureMonths, 0) / cohortCount)
            : 0;
          const cohortAvgSeatUtil = cohortCount > 0
            ? Math.round((customFilteredCustomers.reduce((s, c) => s + (c.activeSeats / c.contractedSeats), 0) / cohortCount) * 100)
            : 0;

          // Churn Risk breakdown within custom cohort
          const cohortCriticalCount = customFilteredCustomers.filter(c => c.riskTier === 'Critical').length;
          const cohortHighCount = customFilteredCustomers.filter(c => c.riskTier === 'High').length;
          const cohortModerateCount = customFilteredCustomers.filter(c => c.riskTier === 'Moderate').length;
          const cohortLowCount = customFilteredCustomers.filter(c => c.riskTier === 'Low').length;

          // Projected 12-Month Retention Curve for this filtered slice
          const cohortMonthlyRetentionTrend = [0, 2, 4, 6, 8, 10, 12].map(m => {
            const monthlyDecay = (cohortAvgRisk / 100) * 0.18;
            const pctRetained = Math.max(10, Math.round(100 - (m * monthlyDecay * 100)));
            return { month: m, label: m === 0 ? 'M0' : `M${m}`, pctRetained };
          });

          const applyQuickPreset = (presetName: string) => {
            setActiveCustomPreset(presetName);
            if (presetName === 'early_flight_risk') {
              setFilterRiskMin(50);
              setFilterRiskMax(100);
              setFilterTenureMin(0);
              setFilterTenureMax(12);
              setFilterClvMin(0);
              setFilterClvMax(1200000);
            } else if (presetName === 'high_clv_whales') {
              setFilterRiskMin(40);
              setFilterRiskMax(100);
              setFilterTenureMin(0);
              setFilterTenureMax(48);
              setFilterClvMin(100000);
              setFilterClvMax(1200000);
            } else if (presetName === 'mid_tenure_expansion') {
              setFilterRiskMin(0);
              setFilterRiskMax(35);
              setFilterTenureMin(12);
              setFilterTenureMax(24);
              setFilterClvMin(40000);
              setFilterClvMax(1200000);
            } else if (presetName === 'loyal_veterans') {
              setFilterRiskMin(0);
              setFilterRiskMax(20);
              setFilterTenureMin(24);
              setFilterTenureMax(48);
              setFilterClvMin(200000);
              setFilterClvMax(1200000);
            }
          };

          const resetFilters = () => {
            setActiveCustomPreset(null);
            setFilterRiskMin(0);
            setFilterRiskMax(100);
            setFilterTenureMin(0);
            setFilterTenureMax(48);
            setFilterClvMin(0);
            setFilterClvMax(1200000);
            setFilterSearchQuery('');
          };

          const handleSaveCohortToCrm = () => {
            setCohortSavedNotice(`Saved dynamic cohort of ${cohortCount} accounts (Risk ${filterRiskMin}-${filterRiskMax}%, Tenure ${filterTenureMin}-${filterTenureMax}m, CLV $${(filterClvMin/1000).toFixed(0)}k-$${(filterClvMax/1000).toFixed(0)}k) to CRM Segment Tags.`);
            setTimeout(() => setCohortSavedNotice(null), 4000);
          };

          return (
            <div className="space-y-6">
              {/* Dynamic Filter Controls Cockpit */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Multi-Dimensional Dynamic Cohort Filters
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={resetFilters}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Filters</span>
                    </button>

                    <button
                      onClick={handleSaveCohortToCrm}
                      className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-950"
                    >
                      <Save className="w-3 h-3" />
                      <span>Sync Cohort to CRM</span>
                    </button>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-500 font-mono text-xs">Strategic Presets:</span>
                  <button
                    onClick={() => applyQuickPreset('early_flight_risk')}
                    className={`px-2.5 py-1 rounded-md border transition-colors ${
                      activeCustomPreset === 'early_flight_risk'
                        ? 'bg-rose-950 border-rose-500 text-rose-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    Early Flight Risk (Tenure &lt; 12m · Risk &ge; 50%)
                  </button>
                  <button
                    onClick={() => applyQuickPreset('high_clv_whales')}
                    className={`px-2.5 py-1 rounded-md border transition-colors ${
                      activeCustomPreset === 'high_clv_whales'
                        ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    High-CLV Whales in Danger (CLV &ge; $100k · Risk &ge; 40%)
                  </button>
                  <button
                    onClick={() => applyQuickPreset('mid_tenure_expansion')}
                    className={`px-2.5 py-1 rounded-md border transition-colors ${
                      activeCustomPreset === 'mid_tenure_expansion'
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    Mid-Tenure Expansion (Tenure 12–24m · Low Risk)
                  </button>
                  <button
                    onClick={() => applyQuickPreset('loyal_veterans')}
                    className={`px-2.5 py-1 rounded-md border transition-colors ${
                      activeCustomPreset === 'loyal_veterans'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    Loyal Veterans (Tenure &gt; 24m · CLV &gt; $200k)
                  </button>
                </div>

                {/* 3 Interactive Sliders: Churn Probability, Tenure, and CLV */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
                  {/* Filter 1: Churn Risk Range */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">Churn Probability Range</span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {filterRiskMin}% — {filterRiskMax}%
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Min: {filterRiskMin}%</span>
                        <span>Max: {filterRiskMax}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="90"
                          step="5"
                          value={filterRiskMin}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setFilterRiskMin(Math.min(val, filterRiskMax - 5));
                            setActiveCustomPreset(null);
                          }}
                          className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={filterRiskMax}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setFilterRiskMax(Math.max(val, filterRiskMin + 5));
                            setActiveCustomPreset(null);
                          }}
                          className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Filters accounts by predicted attrition probability
                    </div>
                  </div>

                  {/* Filter 2: Tenure Range */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">Customer Tenure (Months)</span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {filterTenureMin}m — {filterTenureMax}m
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Min: {filterTenureMin} mo</span>
                        <span>Max: {filterTenureMax} mo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="36"
                          step="2"
                          value={filterTenureMin}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setFilterTenureMin(Math.min(val, filterTenureMax - 2));
                            setActiveCustomPreset(null);
                          }}
                          className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                        <input
                          type="range"
                          min="4"
                          max="48"
                          step="2"
                          value={filterTenureMax}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setFilterTenureMax(Math.max(val, filterTenureMin + 2));
                            setActiveCustomPreset(null);
                          }}
                          className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Accounts active between {filterTenureMin} and {filterTenureMax} months
                    </div>
                  </div>

                  {/* Filter 3: Customer Lifetime Value (CLV / Total Spend) */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">Customer Lifetime Value (CLV)</span>
                      <span className="font-mono text-cyan-400 font-bold">
                        ${(filterClvMin / 1000).toFixed(0)}k — ${(filterClvMax / 1000).toFixed(0)}k
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Min: ${(filterClvMin / 1000).toFixed(0)}k</span>
                        <span>Max: ${(filterClvMax / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="500000"
                          step="25000"
                          value={filterClvMin}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setFilterClvMin(Math.min(val, filterClvMax - 25000));
                            setActiveCustomPreset(null);
                          }}
                          className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                        <input
                          type="range"
                          min="50000"
                          max="1200000"
                          step="50000"
                          value={filterClvMax}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setFilterClvMax(Math.max(val, filterClvMin + 25000));
                            setActiveCustomPreset(null);
                          }}
                          className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Cumulative historical contract billings
                    </div>
                  </div>
                </div>

                {/* Search Bar within cohort */}
                <div className="relative pt-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search accounts in filtered cohort by company name, ID, or vertical..."
                    value={filterSearchQuery}
                    onChange={(e) => setFilterSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
              </div>

              {/* Real-Time Cohort Metrics Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-xs text-slate-400 block font-medium">Cohort Size</span>
                  <div className="text-xl font-bold font-mono text-white mt-1">
                    {cohortCount} Accounts
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {Math.round((cohortCount / Math.max(1, customers.length)) * 100)}% of client base
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-xs text-slate-400 block font-medium">Cohort ARR</span>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                    ${(cohortArr / 1000).toFixed(0)}k ARR
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    ${cohortMrr.toLocaleString()}/mo MRR
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-xs text-slate-400 block font-medium">Aggregate CLV</span>
                  <div className="text-xl font-bold font-mono text-white mt-1">
                    ${(cohortTotalClv / 1000).toFixed(0)}k
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Total historical billings
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-xs text-slate-400 block font-medium">Avg Churn Risk</span>
                  <div className={`text-xl font-bold font-mono mt-1 ${cohortAvgRisk >= 50 ? 'text-rose-400' : cohortAvgRisk >= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {cohortAvgRisk}%
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Cohort risk mean
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-xs text-slate-400 block font-medium">Avg Tenure</span>
                  <div className="text-xl font-bold font-mono text-white mt-1">
                    {cohortAvgTenure} Months
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Relationship duration
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-xs text-slate-400 block font-medium">Avg Seat Utilization</span>
                  <div className={`text-xl font-bold font-mono mt-1 ${cohortAvgSeatUtil < 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {cohortAvgSeatUtil}%
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    License deployment
                  </span>
                </div>
              </div>

              {/* Cohort Churn Risk Distribution & Projected Trend Graph */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Cohort Risk Distribution Breakdown (5 cols) */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                      <PieChart className="w-4 h-4 text-cyan-400" />
                      <span>Cohort Risk Tier Distribution</span>
                    </h3>
                    <span className="text-xs font-mono text-slate-400">{cohortCount} Accounts</span>
                  </div>

                  {/* Multi-segmented color progress bar */}
                  <div className="space-y-1.5">
                    <div className="h-4 w-full rounded-md overflow-hidden flex bg-slate-950">
                      {cohortCount > 0 ? (
                        <>
                          <div
                            style={{ width: `${(cohortCriticalCount / cohortCount) * 100}%` }}
                            className="bg-rose-500 h-full transition-all"
                            title={`Critical: ${cohortCriticalCount}`}
                          />
                          <div
                            style={{ width: `${(cohortHighCount / cohortCount) * 100}%` }}
                            className="bg-amber-500 h-full transition-all"
                            title={`High: ${cohortHighCount}`}
                          />
                          <div
                            style={{ width: `${(cohortModerateCount / cohortCount) * 100}%` }}
                            className="bg-blue-500 h-full transition-all"
                            title={`Moderate: ${cohortModerateCount}`}
                          />
                          <div
                            style={{ width: `${(cohortLowCount / cohortCount) * 100}%` }}
                            className="bg-emerald-500 h-full transition-all"
                            title={`Low: ${cohortLowCount}`}
                          />
                        </>
                      ) : (
                        <div className="w-full bg-slate-800 h-full flex items-center justify-center text-xs text-slate-500">
                          No matching accounts
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                      <span className="text-rose-400 font-bold">Critical Risk (&ge;70%)</span>
                      <span className="text-white font-bold">{cohortCriticalCount} accts</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                      <span className="text-amber-400 font-bold">High Risk (50-69%)</span>
                      <span className="text-white font-bold">{cohortHighCount} accts</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                      <span className="text-blue-400 font-bold">Moderate (25-49%)</span>
                      <span className="text-white font-bold">{cohortModerateCount} accts</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                      <span className="text-emerald-400 font-bold">Low Risk (&lt;25%)</span>
                      <span className="text-white font-bold">{cohortLowCount} accts</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {cohortAvgRisk >= 50
                      ? 'This cohort exhibits elevated churn vulnerability requiring immediate proactive CSM interventions and rate-lock incentives.'
                      : 'This cohort maintains solid engagement metrics and represents prime candidates for license expansion.'}
                  </p>
                </div>

                {/* Cohort Projected 12-Month Retention Curve (7 cols) */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                      <LineChart className="w-4 h-4 text-cyan-400" />
                      <span>Cohort Projected Retention Trend (12-Month Curve)</span>
                    </h3>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">
                      Base Retention: {cohortMonthlyRetentionTrend[cohortMonthlyRetentionTrend.length - 1].pctRetained}% at M12
                    </span>
                  </div>

                  {/* SVG Chart */}
                  <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 h-44 flex flex-col justify-between">
                    <svg viewBox="0 0 500 130" className="w-full h-full overflow-visible">
                      {/* Grid lines */}
                      {[100, 75, 50, 25].map(tick => {
                        const y = 110 - (tick / 100) * 95;
                        return (
                          <g key={tick}>
                            <line x1="35" y1={y} x2="480" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                            <text x="30" y={y + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
                              {tick}%
                            </text>
                          </g>
                        );
                      })}

                      {/* Month axis labels */}
                      {cohortMonthlyRetentionTrend.map((pt, i) => {
                        const x = 35 + (i / (cohortMonthlyRetentionTrend.length - 1)) * 445;
                        return (
                          <text key={pt.label} x={x} y="125" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                            {pt.label}
                          </text>
                        );
                      })}

                      {/* Trend Line Path */}
                      <path
                        d={cohortMonthlyRetentionTrend.map((pt, idx) => {
                          const x = 35 + (idx / (cohortMonthlyRetentionTrend.length - 1)) * 445;
                          const y = 110 - (pt.pctRetained / 100) * 95;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                      />

                      {/* Markers */}
                      {cohortMonthlyRetentionTrend.map((pt, idx) => {
                        const x = 35 + (idx / (cohortMonthlyRetentionTrend.length - 1)) * 445;
                        const y = 110 - (pt.pctRetained / 100) * 95;
                        return (
                          <circle
                            key={pt.label}
                            cx={x}
                            cy={y}
                            r="3.5"
                            fill="#06b6d4"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                        );
                      })}
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                    <span>Simulates cumulative cohort decay based on {cohortAvgRisk}% average risk</span>
                    <span className="text-emerald-400 font-bold">
                      ${Math.round(cohortArr * (cohortMonthlyRetentionTrend[cohortMonthlyRetentionTrend.length - 1].pctRetained / 100)).toLocaleString()} ARR Intact
                    </span>
                  </div>
                </div>
              </div>

              {/* Custom Cohort Account Directory */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Accounts Matching Custom Cohort Criteria ({cohortCount} Accounts)
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Showing accounts with Risk &in; [{filterRiskMin}%, {filterRiskMax}%], Tenure &in; [{filterTenureMin}m, {filterTenureMax}m], CLV &ge; ${(filterClvMin/1000).toFixed(0)}k
                  </span>
                </div>

                {customFilteredCustomers.length > 0 ? (
                  <div className="space-y-2">
                    {customFilteredCustomers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => onNavigateToCustomer(c.id)}
                        className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">{c.name}</span>
                            <span className="text-slate-500 font-mono">({c.id})</span>
                            <span className="text-slate-400 font-mono">· {c.industry}</span>
                            <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${c.churnProbability >= 0.7 ? 'bg-rose-950 text-rose-300 border border-rose-800' : c.churnProbability >= 0.5 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                              {Math.round(c.churnProbability * 100)}% Risk
                            </span>
                          </div>
                          <div className="text-slate-400 flex items-center gap-3 text-xs font-mono">
                            <span>Tenure: <strong className="text-slate-200">{c.tenureMonths} mo</strong></span>
                            <span>·</span>
                            <span>Historical CLV: <strong className="text-slate-200">${c.totalSpend.toLocaleString()}</strong></span>
                            <span>·</span>
                            <span>Plan: <strong className="text-slate-200">{c.contractTier} ({c.contractType})</strong></span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex items-center sm:flex-col sm:items-end justify-between sm:justify-center">
                          <div className="font-mono font-bold text-white text-sm">
                            ${(c.mrr * 12).toLocaleString()} ARR (${c.mrr.toLocaleString()}/mo)
                          </div>
                          <div className="text-xs text-cyan-400 mt-0.5 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>Open 360 View</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs bg-slate-950/40 rounded-lg border border-slate-800 space-y-1">
                    <Filter className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-80" />
                    <div className="font-semibold text-white">No Customers Match the Current Cohort Filter Criteria</div>
                    <p className="text-slate-500">
                      Try widening the churn probability range, tenure sliders, or resetting the lifetime value floor.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* SECTION 4: IMPORTANT CHURN DRIVERS IDENTIFIED BY SHAP (STRATEGIC VIEW) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Company-Wide Churn Drivers (SHAP Root Cause Analysis)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated feature attributions showing the exact root causes draining revenue, paired with strategic business imperatives.
          </p>
        </div>

        <div className="space-y-4">
          {GLOBAL_FEATURE_IMPORTANCE.slice(0, 5).map((item, idx) => {
            const barWidth = Math.round((item.meanShap / 0.25) * 100);
            
            // Strategic business mapping
            let businessFix = '';
            if (item.feature.includes('Seat')) {
              businessFix = 'Initiate Adoption Sprints & complimentary team onboarding to activate shelfware before renewal.';
            } else if (item.feature.includes('API') || item.feature.includes('Usage')) {
              businessFix = 'Trigger automated CSM alert when daily API calls contract >20% for 3 consecutive days.';
            } else if (item.feature.includes('Support')) {
              businessFix = 'Enforce 60-minute SLA guarantee for Tier-1 accounts with direct VP Engineering escalation.';
            } else if (item.feature.includes('Contract')) {
              businessFix = 'Offer 15% rate stabilization incentive for transitioning month-to-month accounts to 1- or 2-year lock.';
            } else {
              businessFix = 'Switch high-value accounts from credit card auto-bill to direct automated ACH with payment grace period.';
            }

            return (
              <div key={item.feature} className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">#{idx + 1}</span>
                    <span className="font-bold text-white text-sm font-sans">{item.feature}</span>
                    <span className="text-xs text-slate-400 font-sans bg-slate-800 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-cyan-400 font-bold">{item.meanShap.toFixed(3)} mean |SHAP| impact</span>
                </div>

                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                <div className="text-xs text-slate-300 font-sans pt-1 flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">Strategic Imperative:</span>
                  <span>{businessFix}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: 12-MONTH COHORT RETENTION HEATMAP */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              12-Month Cohort Retention Vintage Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Longitudinal tracking of customer cohort survival rates over elapsed billing cycles.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setCohortViewMode('percent')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                cohortViewMode === 'percent' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              % Retained
            </button>
            <button
              onClick={() => setCohortViewMode('revenue')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                cohortViewMode === 'revenue' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              $ ARR Preserved
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3 text-left font-semibold">Cohort</th>
                <th className="py-2.5 px-3 font-semibold">Size</th>
                <th className="py-2.5 px-3 font-semibold">Base MRR</th>
                <th className="py-2.5 px-3 font-semibold">M0</th>
                <th className="py-2.5 px-3 font-semibold">M2</th>
                <th className="py-2.5 px-3 font-semibold">M4</th>
                <th className="py-2.5 px-3 font-semibold">M6</th>
                <th className="py-2.5 px-3 font-semibold">M8</th>
                <th className="py-2.5 px-3 font-semibold">M10</th>
                <th className="py-2.5 px-3 font-semibold">M12</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cohortMatrix.map((row) => (
                <tr key={row.cohort} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-left font-bold text-white">{row.cohort}</td>
                  <td className="py-2.5 px-3 text-slate-400">{row.size} accts</td>
                  <td className="py-2.5 px-3 text-slate-300 font-semibold">${(row.mrrBase / 1000).toFixed(0)}k/mo</td>
                  
                  {/* Columns M0 to M12 */}
                  {[row.m0, row.m2, row.m4, row.m6, row.m8, row.m10, row.m12].map((val, colIdx) => {
                    const formatted = val === null ? '—' : cohortViewMode === 'percent' ? `${val}%` : `$${Math.round(row.mrrBase * (val / 100) / 1000)}k`;
                    return (
                      <td key={colIdx} className={`py-2 px-3 ${getHeatmapColor(val)}`}>
                        {formatted}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 6: LONG-TERM CHURN RATE PROJECTION & EMPIRICAL TREND ANALYSIS ENGINE */}
      {(() => {
        const avgCustomerMrr = totalMrr / Math.max(1, customers.length);
        const initialCount = customers.length;

        // Historical 6-month actual trend (Month -5 to Month 0 / Now)
        const historicalData = [
          { month: -5, label: 'M-5', customers: 154, churnRate: 2.18, isHistorical: true },
          { month: -4, label: 'M-4', customers: 162, churnRate: 2.10, isHistorical: true },
          { month: -3, label: 'M-3', customers: 171, churnRate: 2.02, isHistorical: true },
          { month: -2, label: 'M-2', customers: 180, churnRate: 1.94, isHistorical: true },
          { month: -1, label: 'M-1', customers: 191, churnRate: 1.87, isHistorical: true },
          { month: 0, label: 'Now (M0)', customers: initialCount, churnRate: 1.82, isHistorical: false }
        ];

        // Steps for future horizon
        const steps = projectionHorizon === 6
          ? [0, 1, 2, 3, 4, 5, 6]
          : projectionHorizon === 12
          ? [0, 2, 4, 6, 8, 10, 12]
          : [0, 4, 8, 12, 16, 20, 24];

        // Calculate future projected trend points with regression parameters and scenario sensitivity
        const projectionData = steps.map((m, idx) => {
          const g = growthRate / 100;
          const projectedCustomers = Math.round(initialCount * Math.pow(1 + g, m));
          const prevCustomers = idx === 0 ? initialCount : Math.round(initialCount * Math.pow(1 + g, steps[idx - 1]));
          const grossAdditions = idx === 0 ? 0 : Math.round(projectedCustomers - prevCustomers);

          // Baseline unmitigated churn increases as customer base grows without tooling
          const baseChurn = Number((2.65 + (m * 0.025)).toFixed(2));

          // Scenario modification
          const coverageFactor = interventionCoverage / 100;
          let scenarioAdjust = 0;
          if (trendScenario === 'headwind') {
            // Rapid growth drag without proportional CSM
            scenarioAdjust = +(m * 0.035);
          } else if (trendScenario === 'optimized') {
            // Aggressive automated playbook adoption
            scenarioAdjust = -(m * 0.045);
          }

          const churnIqSavings = (2.65 - 1.82) * coverageFactor;
          const churnIqRate = Number(Math.max(0.85, 1.82 - churnIqSavings - (m * 0.02) + scenarioAdjust).toFixed(2));
          const optRate = Number(Math.max(0.70, 1.82 - (m * 0.045)).toFixed(2));

          // 95% Confidence Interval bounds (grows with forecast horizon)
          const marginOfError = Number((0.08 + (Math.sqrt(m) * 0.05)).toFixed(2));
          const ciUpper = Number((churnIqRate + marginOfError).toFixed(2));
          const ciLower = Number(Math.max(0.5, churnIqRate - marginOfError).toFixed(2));

          const monthlyChurnedAccounts = Math.round(projectedCustomers * (churnIqRate / 100));
          const netCustomerAdditions = grossAdditions - monthlyChurnedAccounts;
          const monthlyChurnRateDelta = (baseChurn - churnIqRate) / 100;
          const monthlyArrSaved = Math.round(projectedCustomers * avgCustomerMrr * 12 * monthlyChurnRateDelta);
          const monthlyArrAtRisk = Math.round(projectedCustomers * (churnIqRate / 100) * avgCustomerMrr * 12);

          return {
            month: m,
            label: m === 0 ? 'Now' : `M+${m}`,
            projectedCustomers,
            grossAdditions,
            netCustomerAdditions,
            monthlyChurnedAccounts,
            baseChurn,
            churnIqRate,
            ciUpper,
            ciLower,
            optRate,
            monthlyArrSaved,
            monthlyArrAtRisk,
            isHistorical: false
          };
        });

        const totalCumulativeArrSaved = projectionData.reduce((sum, p) => sum + p.monthlyArrSaved, 0);

        // Chart coordinate calculations
        const minRate = 0.5;
        const maxRate = 3.6;
        const chartLeft = 55;
        const chartRight = 725;
        const chartTop = 30;
        const chartBottom = 180;
        const chartWidth = chartRight - chartLeft;
        const chartHeight = chartBottom - chartTop;

        const minMonth = showHistoricalActuals ? -5 : 0;
        const maxMonth = projectionHorizon;
        const totalMonthSpan = maxMonth - minMonth;

        const getX = (m: number) => chartLeft + ((m - minMonth) / totalMonthSpan) * chartWidth;
        const getY = (rate: number) => chartBottom - ((rate - minRate) / (maxRate - minRate)) * chartHeight;

        // Path generator for historical points
        const histPath = historicalData.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.month)} ${getY(p.churnRate)}`).join(' ');

        // Path generators for projection lines
        const basePath = projectionData.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.month)} ${getY(p.baseChurn)}`).join(' ');
        const churnIqPath = projectionData.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.month)} ${getY(p.churnIqRate)}`).join(' ');
        const optPath = projectionData.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.month)} ${getY(p.optRate)}`).join(' ');

        // 95% Confidence Band Polygon
        const upperBandPoints = projectionData.map(p => `${getX(p.month)} ${getY(p.ciUpper)}`);
        const lowerBandPoints = projectionData.slice().reverse().map(p => `${getX(p.month)} ${getY(p.ciLower)}`);
        const confidenceBandPolygon = `M ${upperBandPoints.join(' L ')} L ${lowerBandPoints.join(' L ')} Z`;

        // Area polygon between Base and ChurnIQ (Revenue savings envelope)
        const areaPolygon = `${basePath} ${projectionData.slice().reverse().map(p => `L ${getX(p.month)} ${getY(p.churnIqRate)}`).join(' ')} Z`;

        // Active node being inspected
        const activeHovered = hoveredPointIndex !== null && hoveredPointIndex < projectionData.length
          ? projectionData[hoveredPointIndex]
          : projectionData[projectionData.length - 1];

        // Overall trend velocity calculation (change in churn rate bps per month)
        const startRate = projectionData[0].churnIqRate;
        const endRate = projectionData[projectionData.length - 1].churnIqRate;
        const trendRateDeltaBps = Math.round(((endRate - startRate) / projectionHorizon) * 100);

        return (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Header with Title and Mode Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base font-bold text-white">
                    Long-Term Churn Rate Projection & Empirical Trend Analysis Engine
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                  Statistical trend forecasting across 6 to 12-month forward horizons based on current customer growth rates, cohort seasoning, empirical historical momentum, and automated ML intervention coverage.
                </p>
              </div>

              {/* Forecast Horizon Selector (6, 12, 24 Months) */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setProjectionHorizon(6)}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      projectionHorizon === 6 ? 'bg-slate-800 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    6 Months
                  </button>
                  <button
                    onClick={() => setProjectionHorizon(12)}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      projectionHorizon === 12 ? 'bg-slate-800 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    12 Months (Standard)
                  </button>
                  <button
                    onClick={() => setProjectionHorizon(24)}
                    className={`px-3 py-1.5 rounded transition-colors ${
                      projectionHorizon === 24 ? 'bg-slate-800 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    24 Months
                  </button>
                </div>

                {/* Table Toggle Button */}
                <button
                  onClick={() => setShowProjectionTable(!showProjectionTable)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    showProjectionTable ? 'bg-cyan-950 text-cyan-300 border-cyan-700' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>{showProjectionTable ? 'Hide Forecast Table' : 'Forecast Matrix'}</span>
                  {showProjectionTable ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Scenario Presets & Trend Modeling Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">Trend Scenario:</span>
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-md border border-slate-800">
                  <button
                    onClick={() => setTrendScenario('momentum')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      trendScenario === 'momentum' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Empirical Momentum (Current Course)
                  </button>
                  <button
                    onClick={() => setTrendScenario('headwind')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      trendScenario === 'headwind' ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    High Growth Drag (+Macro Headwinds)
                  </button>
                  <button
                    onClick={() => setTrendScenario('optimized')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      trendScenario === 'optimized' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Optimized ML Playbooks (Aggressive)
                  </button>
                </div>
              </div>

              {/* Visualization Toggles */}
              <div className="flex items-center gap-4 text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={showHistoricalActuals}
                    onChange={(e) => setShowHistoricalActuals(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Show 6M Historical Actuals</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={showConfidenceBands}
                    onChange={(e) => setShowConfidenceBands(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>95% Confidence Interval Band</span>
                </label>
              </div>
            </div>

            {/* Simulation Parameter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
              {/* Slider 1: Customer Inflow / Growth Rate */}
              <div className="lg:col-span-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Monthly Customer Growth Trend</span>
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">+{growthRate}% / mo</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="1"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>2% (Conservative)</span>
                  <span>8% (Current Momentum)</span>
                  <span>16% (Hypergrowth)</span>
                </div>
              </div>

              {/* Slider 2: Playbook Adoption / Intervention Coverage */}
              <div className="lg:col-span-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ML Early-Warning Coverage</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{interventionCoverage}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={interventionCoverage}
                  onChange={(e) => setInterventionCoverage(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>40% (Reactive Only)</span>
                  <span>85% (Current Operations)</span>
                  <span>100% (Universal Automation)</span>
                </div>
              </div>

              {/* Projected Preserved Value Headline */}
              <div className="lg:col-span-4 bg-cyan-950/40 p-3 rounded-lg border border-cyan-800/60 flex flex-col justify-between">
                <div className="text-xs text-cyan-300 font-medium">
                  Cumulative ARR Preserved ({projectionHorizon}M Horizon):
                </div>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                  +${(totalCumulativeArrSaved / 1000).toFixed(0)}k ARR
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>Projected churn drift:</span>
                  <span className={`font-mono font-bold ${trendRateDeltaBps <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {trendRateDeltaBps <= 0 ? `${trendRateDeltaBps} bps/mo` : `+${trendRateDeltaBps} bps/mo`}
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Trend & Projection Visualizer */}
            <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-3">
              <div className="h-72 relative">
                <svg viewBox="0 0 760 230" className="w-full h-full overflow-visible">
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[1.0, 1.5, 2.0, 2.5, 3.0, 3.5].map((rate) => {
                    const y = getY(rate);
                    return (
                      <g key={rate}>
                        <line x1={chartLeft} y1={y} x2={chartRight} y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                        <text x={chartLeft - 10} y={y + 3} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
                          {rate.toFixed(1)}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Vertical Guideline for Historical Transition at Month 0 */}
                  {showHistoricalActuals && (
                    <g>
                      <line
                        x1={getX(0)}
                        y1={chartTop - 10}
                        x2={getX(0)}
                        y2={chartBottom}
                        stroke="#06b6d4"
                        strokeDasharray="4 4"
                        strokeWidth="1.5"
                        opacity="0.8"
                      />
                      <rect
                        x={getX(0) - 48}
                        y={chartTop - 22}
                        width="96"
                        height="18"
                        rx="4"
                        fill="#083344"
                        stroke="#0e7490"
                        strokeWidth="1"
                      />
                      <text
                        x={getX(0)}
                        y={chartTop - 10}
                        textAnchor="middle"
                        fill="#38bdf8"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        TODAY (BASELINE)
                      </text>
                    </g>
                  )}

                  {/* Historical Month Labels */}
                  {showHistoricalActuals && historicalData.slice(0, -1).map((p) => {
                    const x = getX(p.month);
                    return (
                      <g key={`hist-${p.month}`}>
                        <line x1={x} y1={chartTop} x2={x} y2={chartBottom} stroke="#1e293b" strokeDasharray="2 2" opacity="0.4" />
                        <text x={x} y={chartBottom + 16} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
                          {p.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Projection Month Labels */}
                  {projectionData.map((p) => {
                    const x = getX(p.month);
                    return (
                      <g key={`proj-${p.month}`}>
                        <line x1={x} y1={chartTop} x2={x} y2={chartBottom} stroke="#1e293b" strokeDasharray="2 2" opacity="0.6" />
                        <text x={x} y={chartBottom + 16} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight={p.month === 0 ? 'bold' : 'normal'}>
                          {p.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* 95% Confidence Interval Ribbon */}
                  {showConfidenceBands && (
                    <path
                      d={confidenceBandPolygon}
                      fill="url(#confidenceGradient)"
                    />
                  )}

                  {/* Shaded Area Envelope between Baseline and ChurnIQ Model */}
                  <path
                    d={areaPolygon}
                    fill="url(#savingsGradient)"
                  />

                  {/* Historical Trend Line (Solid Slate / Teal) */}
                  {showHistoricalActuals && (
                    <path
                      d={histPath}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Path 1: Unmitigated Baseline (Rose, Dashed) */}
                  <path
                    d={basePath}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />

                  {/* Path 3: Best-Case Optimized (Emerald, Solid) */}
                  <path
                    d={optPath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    opacity="0.85"
                  />

                  {/* Path 2: ChurnIQ Model (Cyan, Solid Glow) */}
                  <path
                    d={churnIqPath}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3.5"
                  />

                  {/* Historical Node Markers */}
                  {showHistoricalActuals && historicalData.map((p) => {
                    const x = getX(p.month);
                    const y = getY(p.churnRate);
                    return (
                      <g key={`hist-node-${p.month}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r={3.5}
                          fill="#475569"
                          stroke="#cbd5e1"
                          strokeWidth={1.5}
                        />
                      </g>
                    );
                  })}

                  {/* Interactive Milestone Nodes for Projections */}
                  {projectionData.map((p, idx) => {
                    const x = getX(p.month);
                    const y = getY(p.churnIqRate);
                    const isHovered = hoveredPointIndex === idx;

                    return (
                      <g
                        key={`node-${p.month}`}
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                        className="cursor-pointer"
                      >
                        {/* Upper & Lower CI markers on hover */}
                        {showConfidenceBands && isHovered && (
                          <>
                            <circle cx={x} cy={getY(p.ciUpper)} r={3} fill="#38bdf8" />
                            <circle cx={x} cy={getY(p.ciLower)} r={3} fill="#38bdf8" />
                            <line x1={x} y1={getY(p.ciLower)} x2={x} y2={getY(p.ciUpper)} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                          </>
                        )}
                        <circle
                          cx={x}
                          cy={y}
                          r={isHovered ? 7 : 4.5}
                          fill="#06b6d4"
                          stroke="#ffffff"
                          strokeWidth={isHovered ? 2.5 : 1.5}
                          className="transition-all"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Chart Legend & Indicators */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-4">
                  {showHistoricalActuals && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-slate-400 inline-block" />
                      <span className="text-slate-400">Historical Actuals (6M)</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-rose-500 inline-block border-b border-dashed border-rose-300" />
                    <span className="text-rose-400">Unmitigated Baseline (~{projectionData[projectionData.length - 1].baseChurn}%)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-cyan-400 inline-block rounded-full" />
                    <span className="text-cyan-300 font-bold">ChurnIQ Projected Trend ({projectionData[projectionData.length - 1].churnIqRate}%)</span>
                  </span>
                  {showConfidenceBands && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-2 bg-sky-500/20 border border-sky-400/40 inline-block rounded-sm" />
                      <span className="text-sky-300">95% CI Range</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
                    <span className="text-emerald-400">Optimized Target (~{projectionData[projectionData.length - 1].optRate}%)</span>
                  </span>
                </div>

                <div className="text-slate-400">
                  Hover points to inspect milestone telemetry
                </div>
              </div>
            </div>

            {/* Selected Milestone Inspection Breakdown */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-xs block">Milestone Period</span>
                <span className="text-base font-bold text-white mt-0.5 block">{activeHovered.label} ({activeHovered.month} Months Out)</span>
                <span className="text-slate-500 text-xs">{trendScenario.toUpperCase()} Scenario</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">Projected Customer Base</span>
                <span className="text-base font-bold text-cyan-400 mt-0.5 block">{activeHovered.projectedCustomers} Accounts</span>
                <span className="text-slate-500 text-xs">+{Math.round(((activeHovered.projectedCustomers - initialCount) / initialCount) * 100)}% Portfolio Growth</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">Forecasted Monthly Churn</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">{activeHovered.churnIqRate}% / mo</span>
                <span className="text-slate-400 text-xs">95% CI: [{activeHovered.ciLower}% — {activeHovered.ciUpper}%]</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">Monthly ARR Preserved</span>
                <span className="text-base font-bold text-cyan-400 mt-0.5 block">+${activeHovered.monthlyArrSaved.toLocaleString()}</span>
                <span className="text-rose-400 text-xs">${activeHovered.monthlyArrAtRisk.toLocaleString()} ARR at Risk</span>
              </div>
            </div>

            {/* Collapsible Month-by-Month Detailed Forecast Matrix */}
            {showProjectionTable && (
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Month-by-Month Growth & Churn Projection Matrix ({projectionHorizon} Months)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Assumes +{growthRate}% monthly customer acquisition</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="text-slate-400 border-b border-slate-800 bg-slate-900/60">
                      <tr>
                        <th className="py-2.5 px-3">Horizon</th>
                        <th className="py-2.5 px-3">Customer Base</th>
                        <th className="py-2.5 px-3">Gross Additions</th>
                        <th className="py-2.5 px-3">Projected Churns</th>
                        <th className="py-2.5 px-3">Net Additions</th>
                        <th className="py-2.5 px-3">Churn Rate</th>
                        <th className="py-2.5 px-3">95% CI Band</th>
                        <th className="py-2.5 px-3">Baseline Churn</th>
                        <th className="py-2.5 px-3 text-right">Preserved ARR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {projectionData.map((row) => (
                        <tr key={row.month} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-white">{row.label}</td>
                          <td className="py-2.5 px-3 text-cyan-400 font-bold">{row.projectedCustomers.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-emerald-400">+{row.grossAdditions}</td>
                          <td className="py-2.5 px-3 text-rose-400">-{row.monthlyChurnedAccounts}</td>
                          <td className="py-2.5 px-3 text-slate-200">
                            {row.netCustomerAdditions >= 0 ? `+${row.netCustomerAdditions}` : row.netCustomerAdditions}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-emerald-300">{row.churnIqRate}%</td>
                          <td className="py-2.5 px-3 text-slate-400">[{row.ciLower}% - {row.ciUpper}%]</td>
                          <td className="py-2.5 px-3 text-rose-300">{row.baseChurn}%</td>
                          <td className="py-2.5 px-3 text-right font-bold text-cyan-400">+${row.monthlyArrSaved.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* SECTION 7: THRESHOLD CONFIGURATION & ALERT HISTORY LOG */}
      {(() => {
        const breachedAccounts = customers.filter(c =>
          (c.churnProbability * 100) >= riskThresholdPercent && c.mrr >= minMrrThreshold
        );
        const breachedArr = breachedAccounts.reduce((sum, c) => sum + c.mrr, 0) * 12;

        const handleSaveConfig = () => {
          setConfigSavedBanner(true);
          setTimeout(() => setConfigSavedBanner(false), 3500);
        };

        const handleSendTestAlert = () => {
          const targetAccount = breachedAccounts[0] || customers[0];
          const newAlert: AlertHistoryEntry = {
            id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
            relativeTime: 'Just now',
            customerId: targetAccount.id,
            customerName: targetAccount.name,
            industry: targetAccount.industry,
            contractTier: targetAccount.contractTier,
            segment: targetAccount.mrr >= 7000 ? 'High-Rollers at Risk' : (targetAccount.activeSeats / targetAccount.contractedSeats) < 0.4 ? 'Shelfware Traps' : 'Sudden Velocity Spike',
            severity: targetAccount.churnProbability >= 0.75 ? 'Critical' : 'High',
            triggeredRiskPercent: Math.round(targetAccount.churnProbability * 100),
            thresholdLimitPercent: riskThresholdPercent,
            mrr: targetAccount.mrr,
            arrExposed: targetAccount.mrr * 12,
            triggerEvent: `Manual test dispatch: Crossed ${riskThresholdPercent}% threshold trigger on $${targetAccount.mrr.toLocaleString()}/mo enterprise account.`,
            primaryDriver: `${targetAccount.topDrivers[0]} (-0.32 SHAP impact)`,
            contextSummary: `Automated test notification dispatched to ${Object.entries(alertChannels).filter(([_, v]) => v).map(([k]) => k.toUpperCase()).join(', ')}. Risk profile evaluated in real-time scoring engine.`,
            channelsDispatched: Object.entries(alertChannels).filter(([_, v]) => v).map(([k]) => k as any),
            status: 'DISPATCHED',
            assignedCsm: 'Sarah Jenkins (Enterprise CSM Lead)',
            actionTaken: 'Simulated alert successfully routed to designated communication channels and recorded in immutable history log.'
          };

          setAlertHistory(prev => [newAlert, ...prev]);
          setTestAlertFeedback(`Dispatched test notification to ${Object.entries(alertChannels).filter(([_, v]) => v).map(([k]) => k.toUpperCase()).join(' & ')}. Alert recorded in Alert History log.`);
          setTimeout(() => setTestAlertFeedback(null), 5000);
        };

        // Filter Alert History entries
        const filteredAlertHistory = alertHistory.filter(item => {
          const matchesSearch = !historySearch ||
            item.customerName.toLowerCase().includes(historySearch.toLowerCase()) ||
            item.customerId.toLowerCase().includes(historySearch.toLowerCase()) ||
            item.primaryDriver.toLowerCase().includes(historySearch.toLowerCase()) ||
            item.assignedCsm.toLowerCase().includes(historySearch.toLowerCase());

          const matchesSegment = historySegmentFilter === 'all' || item.segment === historySegmentFilter;
          const matchesSeverity = historySeverityFilter === 'all' || item.severity === historySeverityFilter;
          const matchesStatus = historyStatusFilter === 'all' || item.status === historyStatusFilter;

          return matchesSearch && matchesSegment && matchesSeverity && matchesStatus;
        });

        const totalHistoryArrExposed = alertHistory.reduce((sum, a) => sum + a.arrExposed, 0);
        const resolvedOrActioned = alertHistory.filter(a => a.status === 'RESOLVED' || a.status === 'PLAYBOOK_EXECUTED').length;
        const resolutionRate = Math.round((resolvedOrActioned / Math.max(1, alertHistory.length)) * 100);

        return (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Header & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base font-bold text-white">
                    Threshold Configuration & Manager Notification Triggers
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                  Automated alerting boundaries and audit trails: Track when high-risk customer segments violate churn probability thresholds, review contextual root causes, and monitor proactive retention workflows.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Triggers Active ({breachedAccounts.length} Live Accounts Breached)</span>
                </span>
              </div>
            </div>

            {/* Sub-Tab Navigation: Threshold Configuration vs Alert History */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveAlertTab('config')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                  activeAlertTab === 'config'
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Threshold Configuration & Live Breach Monitor</span>
                {breachedAccounts.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    {breachedAccounts.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveAlertTab('history')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                  activeAlertTab === 'history'
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5 text-cyan-400" />
                <span>Alert History (Chronological Trigger Log)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {alertHistory.length} Events
                </span>
              </button>
            </div>

            {/* Notification Feedback Banners */}
            {configSavedBanner && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center justify-between transition-all animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Threshold trigger configuration saved to enterprise policy. Daemon listening on real-time scoring queue.</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">Policy Updated</span>
              </div>
            )}

            {testAlertFeedback && (
              <div className="p-3 bg-cyan-950/90 border border-cyan-800 text-cyan-300 text-xs rounded-xl flex items-center justify-between transition-all animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{testAlertFeedback}</span>
                </div>
                <button
                  onClick={() => setActiveAlertTab('history')}
                  className="px-2 py-0.5 bg-cyan-900 hover:bg-cyan-800 text-cyan-200 text-xs font-mono font-bold rounded flex items-center gap-1 transition-colors"
                >
                  <span>View in Alert History</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* TAB 1: THRESHOLD CONFIGURATION & LIVE BREACH MONITOR */}
            {activeAlertTab === 'config' && (
              <div className="space-y-6">
                {/* Threshold Controls Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Sub-Panel: Churn Risk Limit & Revenue Thresholds (7 cols) */}
                  <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-cyan-400" />
                        <span>Risk Boundary & Account Value Rules</span>
                      </h3>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">Alert Rule #1</span>
                    </div>

                    {/* Slider 1: Churn Risk Percentage Threshold */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-semibold">
                          Trigger Alert When Churn Probability Exceeds:
                        </span>
                        <span className="font-mono text-base font-bold text-rose-400 bg-rose-950/80 border border-rose-900/60 px-2 py-0.5 rounded">
                          &ge; {riskThresholdPercent}% Risk
                        </span>
                      </div>
                      <input
                        type="range"
                        min="35"
                        max="85"
                        step="5"
                        value={riskThresholdPercent}
                        onChange={(e) => setRiskThresholdPercent(Number(e.target.value))}
                        className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-slate-500 font-mono">
                        <span>35% (Early Warning)</span>
                        <span className="text-slate-400">65% (Recommended Default)</span>
                        <span>85% (Critical Outlier Only)</span>
                      </div>
                    </div>

                    {/* Account Value Filter (MRR minimum) */}
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-semibold">
                          High-Value Customer Minimum Monthly Value (MRR):
                        </span>
                        <span className="font-mono font-bold text-cyan-400">
                          &ge; ${minMrrThreshold.toLocaleString()}/mo (${(minMrrThreshold * 12 / 1000).toFixed(0)}k ARR)
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                        {[
                          { label: '$2,500/mo', val: 2500 },
                          { label: '$5,000/mo', val: 5000 },
                          { label: '$7,500/mo', val: 7500 },
                          { label: '$10,000/mo', val: 10000 }
                        ].map(btn => (
                          <button
                            key={btn.val}
                            onClick={() => setMinMrrThreshold(btn.val)}
                            className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                              minMrrThreshold === btn.val
                                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Additional Spike Sensitivity & Cadence */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60 text-xs">
                      {/* Spike Toggle */}
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">Velocity Spike Trigger</span>
                          <button
                            onClick={() => setEnableSpikeTrigger(!enableSpikeTrigger)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${enableSpikeTrigger ? 'bg-cyan-600' : 'bg-slate-700'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enableSpikeTrigger ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Also alert if an account experiences a 7-day risk score surge &ge; +15% regardless of absolute tier.
                        </p>
                      </div>

                      {/* Cadence Selector */}
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
                        <span className="font-semibold text-slate-200 block">Alert Cadence</span>
                        <select
                          value={alertCadence}
                          onChange={(e) => setAlertCadence(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
                        >
                          <option value="immediate">Immediate Real-Time Push (&lt;15s)</option>
                          <option value="hourly">Hourly Digest (Aggregated)</option>
                          <option value="daily">Daily 09:00 AM Executive Briefing</option>
                        </select>
                        <span className="text-xs text-slate-500 block">Routes directly to on-call CSM queue.</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Sub-Panel: Notification Channels & Automated Delivery (5 cols) */}
                  <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                          <Bell className="w-4 h-4 text-cyan-400" />
                          <span>Manager Dispatch Channels</span>
                        </h3>
                        <span className="text-xs font-mono text-slate-500">Auto-Routed</span>
                      </div>

                      {/* Channel 1: Slack */}
                      <div
                        onClick={() => setAlertChannels({ ...alertChannels, slack: !alertChannels.slack })}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                          alertChannels.slack ? 'bg-slate-900 border-cyan-500/80' : 'bg-slate-900/40 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MessageSquare className={`w-4 h-4 ${alertChannels.slack ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <div>
                            <div className="text-xs font-semibold text-white">Slack Connect Channel</div>
                            <div className="text-xs text-slate-400 font-mono">#retention-urgent-alerts (@csm-oncall)</div>
                          </div>
                        </div>
                        {alertChannels.slack ? <Check className="w-4 h-4 text-cyan-400" /> : <span className="text-xs text-slate-600">Muted</span>}
                      </div>

                      {/* Channel 2: Salesforce */}
                      <div
                        onClick={() => setAlertChannels({ ...alertChannels, salesforce: !alertChannels.salesforce })}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                          alertChannels.salesforce ? 'bg-slate-900 border-cyan-500/80' : 'bg-slate-900/40 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className={`w-4 h-4 ${alertChannels.salesforce ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <div>
                            <div className="text-xs font-semibold text-white">Salesforce P1 Urgent Task</div>
                            <div className="text-xs text-slate-400 font-mono">Auto-assigned to Account Executive</div>
                          </div>
                        </div>
                        {alertChannels.salesforce ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs text-slate-600">Muted</span>}
                      </div>

                      {/* Channel 3: Email */}
                      <div
                        onClick={() => setAlertChannels({ ...alertChannels, email: !alertChannels.email })}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                          alertChannels.email ? 'bg-slate-900 border-cyan-500/80' : 'bg-slate-900/40 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Mail className={`w-4 h-4 ${alertChannels.email ? 'text-amber-400' : 'text-slate-500'}`} />
                          <div>
                            <div className="text-xs font-semibold text-white">Executive Email Digest</div>
                            <div className="text-xs text-slate-400 font-mono">VP Customer Success &amp; Account Director</div>
                          </div>
                        </div>
                        {alertChannels.email ? <Check className="w-4 h-4 text-amber-400" /> : <span className="text-xs text-slate-600">Muted</span>}
                      </div>

                      {/* Channel 4: Webhook */}
                      <div
                        onClick={() => setAlertChannels({ ...alertChannels, webhook: !alertChannels.webhook })}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                          alertChannels.webhook ? 'bg-slate-900 border-cyan-500/80' : 'bg-slate-900/40 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Send className={`w-4 h-4 ${alertChannels.webhook ? 'text-indigo-400' : 'text-slate-500'}`} />
                          <div>
                            <div className="text-xs font-semibold text-white">Custom HTTP Webhook</div>
                            <div className="text-xs text-slate-400 font-mono">POST /api/v1/crm/sync (HMAC signed)</div>
                          </div>
                        </div>
                        {alertChannels.webhook ? <Check className="w-4 h-4 text-indigo-400" /> : <span className="text-xs text-slate-600">Muted</span>}
                      </div>
                    </div>

                    {/* Configuration Action Buttons */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={handleSendTestAlert}
                        className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Send Test Alert</span>
                      </button>

                      <button
                        onClick={handleSaveConfig}
                        className="flex-1 py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-950"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Save Trigger Rules</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Breach Monitor: High-Value Accounts Currently Crossing Threshold */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${breachedAccounts.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        Live Threshold Breach Monitor: Accounts Currently Triggering Automated Manager Alerts
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/80 border border-rose-900/60 px-2.5 py-0.5 rounded">
                      {breachedAccounts.length} Accounts Violating &ge; {riskThresholdPercent}% Risk &amp; &ge; ${minMrrThreshold.toLocaleString()}/mo (${(breachedArr / 1000).toFixed(0)}k ARR Exposed)
                    </span>
                  </div>

                  {breachedAccounts.length > 0 ? (
                    <div className="space-y-2">
                      {breachedAccounts.map((account) => {
                        const probPct = Math.round(account.churnProbability * 100);
                        const deltaAbove = probPct - riskThresholdPercent;

                        return (
                          <div
                            key={account.id}
                            className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{account.name}</span>
                                <span className="text-slate-500 font-mono">({account.id})</span>
                                <span className="text-slate-400 font-mono">· {account.contractTier} Plan</span>
                                <span className="font-mono text-rose-400 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-900">
                                  {probPct}% Risk ({deltaAbove >= 0 ? `+${deltaAbove}% above trigger limit` : 'Breached'})
                                </span>
                              </div>
                              <div className="text-slate-400">
                                Root Cause Driver: <strong className="text-slate-200">{account.topDrivers[0]}</strong>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                              <div className="text-right font-mono">
                                <div className="font-bold text-white text-sm">${(account.mrr * 12).toLocaleString()} ARR</div>
                                <div className="text-slate-500 text-xs">${account.mrr.toLocaleString()}/mo MRR</div>
                              </div>

                              <button
                                onClick={() => onNavigateToCustomer(account.id)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                              >
                                <span>Open Profile</span>
                                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-400 text-xs bg-slate-900/40 rounded-lg border border-slate-800 space-y-1">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                      <div className="font-semibold text-white">All High-Value Accounts Operating Below Selected Threshold</div>
                      <p className="text-slate-500">
                        No enterprise customer with MRR &ge; ${minMrrThreshold.toLocaleString()} currently exceeds the {riskThresholdPercent}% churn risk limit.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: ALERT HISTORY (CHRONOLOGICAL TRIGGER LOG) */}
            {activeAlertTab === 'history' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Executive Summary Metrics Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Logged Breach Events</span>
                    <div className="text-xl font-bold font-mono text-white mt-1">
                      {alertHistory.length} Alerts
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Chronological trail</span>
                  </div>

                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Exposed ARR Triggered</span>
                    <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                      ${(totalHistoryArrExposed / 1000).toFixed(0)}k ARR
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Protected pipeline</span>
                  </div>

                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">High-Risk Segments</span>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                      4 Segments
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Rollers · Shelf · Billing · Spike</span>
                  </div>

                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Resolution / Action Rate</span>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                      {resolutionRate}%
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{resolvedOrActioned} of {alertHistory.length} mitigated</span>
                  </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search alert history by customer name, account ID, driver, or CSM..."
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                      />
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Segment Filter */}
                      <select
                        value={historySegmentFilter}
                        onChange={(e) => setHistorySegmentFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500 font-mono"
                      >
                        <option value="all">All Segments</option>
                        <option value="High-Rollers at Risk">High-Rollers at Risk</option>
                        <option value="Shelfware Traps">Shelfware Traps</option>
                        <option value="Billing Friction">Billing Friction</option>
                        <option value="Sudden Velocity Spike">Sudden Velocity Spike</option>
                      </select>

                      {/* Severity Filter */}
                      <select
                        value={historySeverityFilter}
                        onChange={(e) => setHistorySeverityFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500 font-mono"
                      >
                        <option value="all">All Severities</option>
                        <option value="Critical">Critical (&ge;75%)</option>
                        <option value="High">High (&ge;65%)</option>
                        <option value="Warning">Warning (&ge;50%)</option>
                      </select>

                      {/* Status Filter */}
                      <select
                        value={historyStatusFilter}
                        onChange={(e) => setHistoryStatusFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500 font-mono"
                      >
                        <option value="all">All Statuses</option>
                        <option value="DISPATCHED">Dispatched</option>
                        <option value="ACKNOWLEDGED">Acknowledged</option>
                        <option value="PLAYBOOK_EXECUTED">Playbook Executed</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>

                      {(historySearch || historySegmentFilter !== 'all' || historySeverityFilter !== 'all' || historyStatusFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setHistorySearch('');
                            setHistorySegmentFilter('all');
                            setHistorySeverityFilter('all');
                            setHistoryStatusFilter('all');
                          }}
                          className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chronological Alert Log List */}
                <div className="space-y-3">
                  {filteredAlertHistory.length > 0 ? (
                    filteredAlertHistory.map((alert) => {
                      const isCritical = alert.severity === 'Critical';
                      const isHigh = alert.severity === 'High';

                      // Segment badge styling
                      const segmentColor =
                        alert.segment === 'High-Rollers at Risk'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : alert.segment === 'Shelfware Traps'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : alert.segment === 'Billing Friction'
                          ? 'bg-purple-950 text-purple-300 border-purple-800'
                          : 'bg-cyan-950 text-cyan-300 border-cyan-800';

                      return (
                        <div
                          key={alert.id}
                          className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-all space-y-3 relative overflow-hidden"
                        >
                          {/* Severity Indicator Left Stripe */}
                          <div
                            className={`absolute left-0 top-0 bottom-0 w-1 ${
                              isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-cyan-500'
                            }`}
                          />

                          {/* Row 1: Header metadata */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 pl-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-white text-sm sm:text-base">
                                {alert.customerName}
                              </span>
                              <span className="text-slate-500 font-mono text-xs">
                                ({alert.customerId})
                              </span>
                              <span className="text-slate-400 text-xs">
                                · {alert.industry}
                              </span>
                              <span className="text-slate-500 text-xs">
                                ({alert.contractTier})
                              </span>

                              {/* Segment Tag */}
                              <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold border ${segmentColor}`}>
                                {alert.segment}
                              </span>

                              {/* Severity Badge */}
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1 ${
                                  isCritical
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                    : isHigh
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-rose-400 animate-pulse' : isHigh ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                                <span>{alert.severity.toUpperCase()}</span>
                              </span>
                            </div>

                            {/* Timestamp & Alert ID */}
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 self-start sm:self-auto shrink-0">
                              <Clock className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="font-semibold text-slate-300">{alert.relativeTime}</span>
                              <span className="text-slate-600">·</span>
                              <span className="text-slate-500">{alert.timestamp}</span>
                              <span className="text-slate-600">·</span>
                              <span className="text-slate-500">{alert.id}</span>
                            </div>
                          </div>

                          {/* Row 2: Metrics and Trigger Detail */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pl-2 text-xs">
                            {/* Metrics pill (4 cols) */}
                            <div className="md:col-span-4 bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-medium">Triggered Risk:</span>
                                <span className="font-mono text-rose-400 font-bold text-sm bg-rose-950/80 px-2 py-0.5 rounded border border-rose-900/60">
                                  {alert.triggeredRiskPercent}% Risk
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-slate-400">
                                <span>Threshold Boundary:</span>
                                <span className="font-mono text-slate-300">&ge; {alert.thresholdLimitPercent}% Limit</span>
                              </div>
                              <div className="flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                                <span className="text-slate-400">ARR at Stake:</span>
                                <span className="font-mono font-bold text-white">
                                  ${alert.arrExposed.toLocaleString()} ARR
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono">
                                <span>Monthly contracted:</span>
                                <span>${alert.mrr.toLocaleString()}/mo MRR</span>
                              </div>
                            </div>

                            {/* Root Cause & Contextual narrative (8 cols) */}
                            <div className="md:col-span-8 space-y-2 flex flex-col justify-between">
                              <div className="space-y-1">
                                <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                  <span>{alert.triggerEvent}</span>
                                </div>
                                <div className="text-slate-400 text-xs">
                                  Primary Root Cause Driver: <strong className="text-cyan-300 font-mono">{alert.primaryDriver}</strong>
                                </div>
                                <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                                  <strong className="text-slate-400 uppercase text-[10px] block mb-1">Operational Context &amp; Signals:</strong>
                                  {alert.contextSummary}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Row 3: Actions Taken, CSM, Channels & Drill-down */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60 pl-2 text-xs">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-slate-400 flex items-center gap-1">
                                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                                  <strong className="text-slate-300 font-medium">Assigned CSM:</strong> {alert.assignedCsm}
                                </span>
                                <span className="text-slate-600">·</span>
                                <span className="text-slate-400 flex items-center gap-1.5">
                                  <strong className="text-slate-300 font-medium">Dispatched Channels:</strong>
                                  {alert.channelsDispatched.map((ch) => (
                                    <span key={ch} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px] uppercase">
                                      {ch}
                                    </span>
                                  ))}
                                </span>
                              </div>
                              <div className="text-slate-400">
                                Action Taken: <span className="text-emerald-300 font-medium">{alert.actionTaken}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                              {/* Status Badge */}
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase ${
                                  alert.status === 'RESOLVED'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : alert.status === 'PLAYBOOK_EXECUTED'
                                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                    : alert.status === 'ACKNOWLEDGED'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                                }`}
                              >
                                {alert.status.replace(/_/g, ' ')}
                              </span>

                              {/* Drill-down button */}
                              <button
                                onClick={() => onNavigateToCustomer(alert.customerId)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
                              >
                                <span>Inspect 360 Profile</span>
                                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-slate-800 space-y-2">
                      <History className="w-8 h-8 text-slate-500 mx-auto opacity-70" />
                      <div className="font-semibold text-white">No Alert Trigger Events Match Current Filters</div>
                      <p className="text-slate-500">
                        Try adjusting your search query, segment, severity, or status criteria above.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* SECTION 8: ACTIONABLE EXECUTIVE STRATEGY RECOMMENDATIONS */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-950/80 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">
            Executive Action Plan: Top 3 Q4 Strategic Priorities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span>PRIORITY 1</span>
              <span className="text-emerald-400">+$62k ARR Protected</span>
            </div>
            <h3 className="font-bold text-white text-sm">Targeted License Shelfware Sprints</h3>
            <p className="text-slate-300 leading-relaxed">
              Deploy dedicated Solutions Architects to conduct hands-on workflow sessions with {shelfwareTraps.length} unactivated enterprise accounts before Q4 renewal cycles.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span>PRIORITY 2</span>
              <span className="text-emerald-400">+$54k ARR Protected</span>
            </div>
            <h3 className="font-bold text-white text-sm">Annual Contract Lock Incentives</h3>
            <p className="text-slate-300 leading-relaxed">
              Automate custom CPQ proposals offering 15% grandfathered pricing to transition at-risk month-to-month contracts to 1- or 2-year commitments.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span>PRIORITY 3</span>
              <span className="text-emerald-400">+$32k ARR Protected</span>
            </div>
            <h3 className="font-bold text-white text-sm">Automated Billing & Dunning Bridge</h3>
            <p className="text-slate-300 leading-relaxed">
              Activate automated ACH conversion flow with $250 fee rebate for customers experiencing recurring card bounces, preventing involuntary attrition.
            </p>
          </div>
        </div>
      </div>

      {/* EXECUTIVE BRIEFING DOCUMENT PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
            {/* Modal Top Bar */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-cyan-950 border border-cyan-800 rounded-lg text-cyan-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Boardroom Executive Briefing Document</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Formatted for Board of Directors &amp; Executive Committee Reviews</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPdf}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-950"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition-colors flex items-center gap-1"
                  title="Print / Save via Browser"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Body (Printable Paper Layout) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-900/60 font-sans">
              {/* Document Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider">CHURNIQ INTELLIGENCE PLATFORM</span>
                  <span className="text-rose-400 font-bold bg-rose-950/80 border border-rose-900 px-2 py-0.5 rounded">
                    STRICTLY CONFIDENTIAL · BOARD REVIEW ONLY
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Executive Strategic Briefing: Retention, Model Trust &amp; ARR Exposure
                </h1>
                <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-4 pt-1">
                  <span>Evaluation Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>·</span>
                  <span>Portfolio Size: {customers.length} Monitored Accounts</span>
                  <span>·</span>
                  <span>ML Champion: XGBoost v2.4.1 (Tau = 0.42)</span>
                </div>
              </div>

              {/* 4 Macro Scorecard Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">Monitored Portfolio ARR</span>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    ${(totalArr / 1000000).toFixed(2)}M
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">${totalMrr.toLocaleString()}/mo contracted</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">ARR at Immediate Risk</span>
                  <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                    ${(atRiskArr / 1000).toFixed(0)}k
                  </div>
                  <span className="text-[11px] text-rose-400 font-mono mt-0.5 block">{atRiskPct}% of portfolio exposed</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">Monthly Churn Rate</span>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                    1.82%
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono mt-0.5 block">-0.6% MoM (Outperforming SaaS Median)</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">Net Revenue Retention</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    114.8%
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono mt-0.5 block">Top-Quartile SaaS Expansion</span>
                </div>
              </div>

              {/* Model Reliability & Discrimination Summary */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Machine Learning Discrimination &amp; Reliability Scorecard
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">91.2% Reliable (High Confidence Grade)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
                  <div>
                    <span className="text-slate-500 block">ROC-AUC</span>
                    <span className="text-base font-bold text-white">0.924</span>
                    <span className="text-[10px] text-slate-400 block">Grade A+ Discrimination</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Precision</span>
                    <span className="text-base font-bold text-emerald-400">88.4%</span>
                    <span className="text-[10px] text-slate-400 block">88 of 100 flags true churners</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Recall</span>
                    <span className="text-base font-bold text-emerald-400">87.1%</span>
                    <span className="text-[10px] text-slate-400 block">Catches 87% cancellations</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">F1-Score</span>
                    <span className="text-base font-bold text-cyan-400">87.7%</span>
                    <span className="text-[10px] text-slate-400 block">Optimal harmonic balance</span>
                  </div>
                </div>
              </div>

              {/* High-Value Accounts at Immediate Risk Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>High-Value Accounts Requiring Executive Sponsor Intervention</span>
                  </h4>
                  <span className="text-xs font-mono text-slate-400">Sorted by Monthly Contract Value</span>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Account Name</th>
                        <th className="py-2.5 px-3">Tier</th>
                        <th className="py-2.5 px-3">Monthly MRR</th>
                        <th className="py-2.5 px-3">Annual ARR</th>
                        <th className="py-2.5 px-3">Churn Probability</th>
                        <th className="py-2.5 px-3">Primary Root Cause Driver</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {[...customers]
                        .filter(c => c.churnProbability >= 0.50)
                        .sort((a, b) => b.mrr - a.mrr)
                        .slice(0, 6)
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-slate-900/40">
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-white font-sans">{c.name}</div>
                              <div className="text-[10px] text-slate-500">{c.id} · {c.industry}</div>
                            </td>
                            <td className="py-2.5 px-3">{c.contractTier}</td>
                            <td className="py-2.5 px-3 font-bold text-white">${c.mrr.toLocaleString()}</td>
                            <td className="py-2.5 px-3 font-bold text-cyan-400">${(c.mrr * 12).toLocaleString()}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-900">
                                {Math.round(c.churnProbability * 100)}% Risk
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">
                              {c.topDrivers[0]}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top 3 Strategic Priorities */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-cyan-400 font-bold font-mono">
                    <span>PRIORITY 1</span>
                    <span className="text-emerald-400">+$62k Protected</span>
                  </div>
                  <div className="font-bold text-white text-sm">Shelfware Sprints</div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Deploy Solutions Architects to conduct hands-on workflow sessions with under-utilized accounts before renewal.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-cyan-400 font-bold font-mono">
                    <span>PRIORITY 2</span>
                    <span className="text-emerald-400">+$54k Protected</span>
                  </div>
                  <div className="font-bold text-white text-sm">Contract Locks</div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Automate custom CPQ proposals offering 15% grandfathered price locks to transition month-to-month contracts to 1- or 2-year commitments.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-cyan-400 font-bold font-mono">
                    <span>PRIORITY 3</span>
                    <span className="text-emerald-400">+$32k Protected</span>
                  </div>
                  <div className="font-bold text-white text-sm">Billing Bridge</div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Activate automated ACH conversion flow with $250 fee rebate for customers experiencing recurring card bounces.
                  </p>
                </div>
              </div>

              {/* Document Footer */}
              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>ChurnIQ Intelligence Engine v2.4.1 · SOC-2 Type II &amp; GDPR Verified</span>
                <span>Export generated on {new Date().toISOString().substring(0, 19)} UTC</span>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-400 font-mono">
                Click Download PDF for executive distribution, or Download CSV for Excel modeling.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  Close Preview
                </button>
                <button
                  onClick={handleExportPdf}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-950"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Executive PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
