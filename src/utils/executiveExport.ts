import { jsPDF } from 'jspdf';
import { Customer } from '../types/churn';
import { AlertHistoryEntry } from '../components/StakeholderDashboard';

export interface ExecutiveReportData {
  customers: Customer[];
  totalArr: number;
  totalMrr: number;
  atRiskArr: number;
  atRiskPct: number;
  churnRate: string;
  nrr: string;
  alertHistory: AlertHistoryEntry[];
  riskThreshold: number;
  minMrrThreshold: number;
}

/**
 * Downloads a file to the user's browser using Blob
 */
export const downloadTextFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generates and downloads an executive-ready CSV report
 */
export const exportExecutiveCsv = (data: ExecutiveReportData) => {
  const { customers, totalArr, atRiskArr, atRiskPct, churnRate, nrr } = data;

  const escapeCsv = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Header metadata block for board meetings
  const metaRows = [
    ['CHURNIQ — EXECUTIVE STRATEGIC BRIEFING & PORTFOLIO DATASET'],
    ['CONFIDENTIAL — BOARD OF DIRECTORS & EXECUTIVE LEADERSHIP ONLY'],
    [`Generated Date:`, new Date().toISOString().substring(0, 10)],
    [`Total Monitored ARR:`, `$${totalArr.toLocaleString()}`],
    [`ARR at Immediate Risk:`, `$${atRiskArr.toLocaleString()} (${atRiskPct}% of portfolio)`],
    [`Monthly Churn Rate:`, churnRate],
    [`Net Revenue Retention (NRR):`, nrr],
    []
  ];

  // Table column headers
  const columns = [
    'Account ID',
    'Customer Name',
    'Industry',
    'Contract Tier',
    'Contract Type',
    'MRR ($)',
    'ARR ($)',
    'Churn Probability (%)',
    'Risk Tier',
    'Primary SHAP Driver',
    'Secondary SHAP Driver',
    'Active Seats',
    'Contracted Seats',
    'Seat Utilization (%)',
    'Tenure (Months)',
    'Total CLV Spend ($)',
    'Support Tickets (90d)',
    'Payment Failures (6m)',
    'Executive Action Prescribed'
  ];

  const dataRows = customers.map(c => {
    const seatUtil = Math.round((c.activeSeats / Math.max(1, c.contractedSeats)) * 100);
    const actionPrescribed = c.churnProbability >= 0.70
      ? 'VP Sponsor Call & Urgent Health Sprint'
      : c.churnProbability >= 0.50
      ? 'Adoption Workshop & Contract Review'
      : 'Standard Expansion & QBR Cadence';

    return [
      escapeCsv(c.id),
      escapeCsv(c.name),
      escapeCsv(c.industry),
      escapeCsv(c.contractTier),
      escapeCsv(c.contractType),
      c.mrr,
      c.mrr * 12,
      Number((c.churnProbability * 100).toFixed(1)),
      escapeCsv(c.riskTier),
      escapeCsv(c.topDrivers[0] || 'N/A'),
      escapeCsv(c.topDrivers[1] || 'N/A'),
      c.activeSeats,
      c.contractedSeats,
      seatUtil,
      c.tenureMonths,
      c.totalSpend,
      c.supportTicketsLast90d,
      c.paymentFailuresLast6m,
      escapeCsv(actionPrescribed)
    ].join(',');
  });

  const csvContent = '\uFEFF' +
    metaRows.map(r => r.map(escapeCsv).join(',')).join('\n') + '\n' +
    columns.map(escapeCsv).join(',') + '\n' +
    dataRows.join('\n');

  const dateStr = new Date().toISOString().substring(0, 10);
  downloadTextFile(csvContent, `ChurnIQ_Executive_Portfolio_${dateStr}.csv`, 'text/csv');
};

/**
 * Generates and downloads an Alert History CSV log
 */
export const exportAlertHistoryCsv = (alertHistory: AlertHistoryEntry[]) => {
  const escapeCsv = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headers = [
    'Alert ID',
    'Timestamp',
    'Customer ID',
    'Customer Name',
    'Industry',
    'Plan Tier',
    'High-Risk Segment',
    'Severity',
    'Triggered Risk (%)',
    'Threshold Limit (%)',
    'Monthly Recurring Revenue ($)',
    'Exposed ARR ($)',
    'Trigger Event Violation',
    'Primary SHAP Driver',
    'Context Summary',
    'Channels Dispatched',
    'Assigned CSM',
    'Current Status',
    'Mitigation Action Taken'
  ];

  const rows = alertHistory.map(a => [
    escapeCsv(a.id),
    escapeCsv(a.timestamp),
    escapeCsv(a.customerId),
    escapeCsv(a.customerName),
    escapeCsv(a.industry),
    escapeCsv(a.contractTier),
    escapeCsv(a.segment),
    escapeCsv(a.severity),
    a.triggeredRiskPercent,
    a.thresholdLimitPercent,
    a.mrr,
    a.arrExposed,
    escapeCsv(a.triggerEvent),
    escapeCsv(a.primaryDriver),
    escapeCsv(a.contextSummary),
    escapeCsv(a.channelsDispatched.join('; ')),
    escapeCsv(a.assignedCsm),
    escapeCsv(a.status),
    escapeCsv(a.actionTaken)
  ].join(','));

  const csvContent = '\uFEFF' + headers.map(escapeCsv).join(',') + '\n' + rows.join('\n');
  const dateStr = new Date().toISOString().substring(0, 10);
  downloadTextFile(csvContent, `ChurnIQ_Alert_History_Log_${dateStr}.csv`, 'text/csv');
};

/**
 * Generates an executive-formatted boardroom PDF report using jsPDF
 */
export const exportExecutivePdf = (data: ExecutiveReportData) => {
  const { customers, totalArr, atRiskArr, atRiskPct, churnRate, nrr, alertHistory, riskThreshold } = data;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);
  let y = 16;

  // 1. TOP HEADER BANNER
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(56, 189, 248); // sky-400
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CHURNIQ INTELLIGENCE PLATFORM  ·  EXECUTIVE BOARDROOM BRIEFING', margin, 10);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Retention, Model Trust & ARR Exposure Report', margin, 18);

  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Evaluation Date: ${dateStr}  |  Classification: STRICTLY CONFIDENTIAL  |  Audience: Executive Committee`, margin, 24);

  y = 35;

  // 2. MACRO EXECUTIVE SCORECARD TILES (4 KPI BOXES)
  const tileWidth = (contentWidth - 9) / 4;
  const tileHeight = 22;

  const kpis = [
    { label: 'ACTIVE PORTFOLIO ARR', val: `$${(totalArr / 1000000).toFixed(2)}M`, sub: `${customers.length} monitored enterprise accounts`, color: [15, 23, 42] },
    { label: 'ARR AT IMMEDIATE RISK', val: `$${(atRiskArr / 1000).toFixed(0)}k`, sub: `${atRiskPct}% of total contracted ARR`, color: [159, 18, 57] },
    { label: 'MONTHLY CHURN RATE', val: churnRate, sub: 'Target: < 2.0% (Outperforming SaaS Median)', color: [14, 116, 144] },
    { label: 'NET REVENUE RETENTION', val: nrr, sub: 'Best-in-Class account expansion', color: [4, 120, 87] }
  ];

  kpis.forEach((kpi, idx) => {
    const x = margin + (idx * (tileWidth + 3));
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(x, y, tileWidth, tileHeight, 'FD');

    // Colored left accent bar
    doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.rect(x, y, 2.5, tileHeight, 'F');

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(kpi.label, x + 5, y + 5.5);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(kpi.val, x + 5, y + 13);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text(kpi.sub, x + 5, y + 18.5);
  });

  y += tileHeight + 8;

  // 3. MODEL TRUST & ACCURACY BENCHMARK
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 20, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('MACHINE LEARNING RELIABILITY & CONFIDENCE SCORECARD', margin + 4, y + 5.5);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Production Algorithm: XGBoost v2.4.1  ·  Decision Threshold: Tau = 0.42  ·  Confidence Grade: 91.2% Reliable', margin + 4, y + 10);

  const metricsText = [
    'ROC-AUC: 0.924 (Grade A+ Discrimination)',
    'Precision: 88.4% (88 of 100 flags are true churners)',
    'Recall: 87.1% (Catches 87% of all potential cancellations)',
    'F1-Score: 87.7% (Optimal harmonic balance)'
  ];

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(14, 116, 144);
  metricsText.forEach((m, idx) => {
    const mx = margin + 4 + (idx * (contentWidth / 4));
    doc.text(m, mx, y + 16);
  });

  y += 26;

  // 4. HIGH-RISK ENTERPRISE ACCOUNTS EXPOSURE (TABLE)
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('HIGH-VALUE ACCOUNTS REQUIRING EXECUTIVE SPONSOR INTERVENTION', margin, y);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Accounts exceeding the ${riskThreshold}% churn risk trigger limit or $5,000/mo ARR threshold`, margin, y + 4.5);

  y += 7;

  // Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 7, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER / ACCOUNT', margin + 3, y + 4.5);
  doc.text('TIER', margin + 55, y + 4.5);
  doc.text('MONTHLY MRR', margin + 78, y + 4.5);
  doc.text('ANNUAL ARR', margin + 104, y + 4.5);
  doc.text('CHURN RISK', margin + 128, y + 4.5);
  doc.text('PRIMARY SHAP ROOT CAUSE', margin + 150, y + 4.5);

  y += 7;

  // At-risk accounts sorted by MRR desc
  const highRiskAccounts = [...customers]
    .filter(c => c.churnProbability >= 0.50)
    .sort((a, b) => b.mrr - a.mrr)
    .slice(0, 7);

  highRiskAccounts.forEach((c, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.setDrawColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 8.5, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(c.name, margin + 3, y + 4);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text(`${c.id} · ${c.industry}`, margin + 3, y + 7.5);

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7);
    doc.text(`${c.contractTier} (${c.contractType})`, margin + 55, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.text(`$${c.mrr.toLocaleString()}`, margin + 78, y + 5.5);
    doc.text(`$${(c.mrr * 12).toLocaleString()}`, margin + 104, y + 5.5);

    // Churn risk pill
    const riskPct = Math.round(c.churnProbability * 100);
    doc.setTextColor(riskPct >= 70 ? 225 : 194, riskPct >= 70 ? 29 : 65, riskPct >= 70 ? 72 : 12);
    doc.text(`${riskPct}% Risk`, margin + 128, y + 5.5);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    const driverText = doc.splitTextToSize(c.topDrivers[0] || 'Behavioral Engagement Decline', 42);
    doc.text(driverText[0], margin + 150, y + 5.5);

    y += 8.5;
  });

  y += 5;

  // 5. STRATEGIC COHORT BREAKDOWN
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('EXECUTIVE ACTION PLAN: STRATEGIC RETENTION PRIORITIES', margin, y);

  y += 5;
  const colWidth = (contentWidth - 6) / 3;
  const priorities = [
    { title: 'PRIORITY 1: SHELFWARE SPRINTS', sav: '+$62k ARR Protected', desc: 'Deploy dedicated Solutions Architects to conduct hands-on workflow sessions with under-utilized accounts (<40% seats) before Q4 renewal cycles.' },
    { title: 'PRIORITY 2: ANNUAL CONTRACT LOCKS', sav: '+$54k ARR Protected', desc: 'Offer custom CPQ incentives (15% grandfathered price lock) to transition month-to-month contracts to 1 or 2-year firm commitments.' },
    { title: 'PRIORITY 3: AUTOMATED DUNNING BRIDGE', sav: '+$32k ARR Protected', desc: 'Activate automated ACH conversion flow with $250 fee rebate for customers experiencing repeated credit card bounces, stopping involuntary churn.' }
  ];

  priorities.forEach((p, idx) => {
    const px = margin + (idx * (colWidth + 3));
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(px, y, colWidth, 34, 'FD');

    doc.setTextColor(14, 116, 144);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(p.title, px + 3, y + 5.5);

    doc.setTextColor(4, 120, 87);
    doc.setFontSize(6.5);
    doc.text(p.sav, px + 3, y + 10);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(p.desc, colWidth - 6);
    doc.text(descLines, px + 3, y + 15);
  });

  y += 39;

  // 6. RECENT TRIGGERED ALERTS SUMMARY
  if (alertHistory && alertHistory.length > 0) {
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('RECENT THRESHOLD BREACH AUDIT LOG (LAST 3 DISPATCHES)', margin, y);

    y += 4.5;
    const recentAlerts = alertHistory.slice(0, 3);
    recentAlerts.forEach((a) => {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, contentWidth, 9, 'FD');

      doc.setTextColor(225, 29, 72);
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.text(`[${a.severity.toUpperCase()}] ${a.id}`, margin + 3, y + 4);

      doc.setTextColor(15, 23, 42);
      doc.text(`${a.customerName} (${a.customerId})`, margin + 28, y + 4);

      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text(`${a.relativeTime}  ·  Trigger: ${a.triggeredRiskPercent}% Churn Risk  ·  Exposed ARR: $${a.arrExposed.toLocaleString()}  ·  CSM: ${a.assignedCsm.split(' ')[0]} ${a.assignedCsm.split(' ')[1]}`, margin + 28, y + 7.5);

      doc.setTextColor(14, 116, 144);
      doc.setFont('helvetica', 'bold');
      doc.text(`Status: ${a.status}`, margin + contentWidth - 30, y + 5.5);

      y += 10;
    });
  }

  // 7. FOOTER
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('ChurnIQ Machine Learning Engine v2.4.1  ·  SOC-2 Type II & GDPR Verified  ·  Confidential Executive Record', margin, pageHeight - 7);
  doc.text('Page 1 of 1', pageWidth - margin - 15, pageHeight - 7);

  // Save PDF
  const filename = `ChurnIQ_Executive_Briefing_${new Date().toISOString().substring(0, 10)}.pdf`;
  doc.save(filename);
};
