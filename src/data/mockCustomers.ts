import { Customer, RetentionPlaybook } from '../types/churn';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-8021',
    name: 'Vanguard Logistics Corp',
    industry: 'Supply Chain',
    contractTier: 'Enterprise',
    contractType: 'Month-to-month',
    paymentMethod: 'Manual Invoice',
    tenureMonths: 14,
    mrr: 7800,
    totalSpend: 109200,
    contractedSeats: 120,
    activeSeats: 34, // low utilization: 28%
    apiCallsMonthly: 42000,
    apiCallsPriorMonth: 110000, // -61% drop MoM
    supportTicketsLast90d: 14,
    escalatedTickets: 5,
    npsScore: 3,
    paymentFailuresLast6m: 2,
    daysSinceLastLogin: 19,
    integrationsActive: 2,
    leadershipChangeRecent: true,
    churnProbability: 0.88,
    riskTier: 'Critical',
    topDrivers: ['Usage drop -61% MoM', 'Low seat utilization (28%)', '5 escalated support tickets', 'Month-to-month contract'],
    historicalEvents: [
      { date: '2026-09-14', event: 'VP of Operations replaced by interim director', type: 'negative' },
      { date: '2026-09-02', event: 'API rate-limit incident ticket escalated to Tier 3', type: 'negative' },
      { date: '2026-08-20', event: 'Invoice overdue reminder sent (14 days past due)', type: 'negative' }
    ]
  },
  {
    id: 'CUST-4192',
    name: 'Aether Cloud Infrastructure',
    industry: 'DevTools',
    contractTier: 'Enterprise',
    contractType: '1-Year',
    paymentMethod: 'ACH Transfer',
    tenureMonths: 28,
    mrr: 12500,
    totalSpend: 350000,
    contractedSeats: 250,
    activeSeats: 142, // 56% utilization
    apiCallsMonthly: 520000,
    apiCallsPriorMonth: 780000, // -33%
    supportTicketsLast90d: 9,
    escalatedTickets: 3,
    npsScore: 5,
    paymentFailuresLast6m: 0,
    daysSinceLastLogin: 3,
    integrationsActive: 5,
    leadershipChangeRecent: false,
    churnProbability: 0.64,
    riskTier: 'High',
    topDrivers: ['API volume drop -33%', 'Renewal upcoming in 45 days', '3 unresolved Sev-2 tickets'],
    historicalEvents: [
      { date: '2026-09-18', event: 'Requested security audit report ahead of renewal', type: 'neutral' },
      { date: '2026-08-11', event: 'Database migration query performance issue logged', type: 'negative' }
    ]
  },
  {
    id: 'CUST-1044',
    name: 'Helios Health Technologies',
    industry: 'Healthcare',
    contractTier: 'Enterprise',
    contractType: '2-Year',
    paymentMethod: 'ACH Transfer',
    tenureMonths: 36,
    mrr: 18400,
    totalSpend: 662400,
    contractedSeats: 300,
    activeSeats: 288, // 96% utilization
    apiCallsMonthly: 1200000,
    apiCallsPriorMonth: 1150000,
    supportTicketsLast90d: 4,
    escalatedTickets: 0,
    npsScore: 9,
    paymentFailuresLast6m: 0,
    daysSinceLastLogin: 1,
    integrationsActive: 8,
    leadershipChangeRecent: false,
    churnProbability: 0.08,
    riskTier: 'Low',
    topDrivers: ['High seat utilization (96%)', 'Multi-year locked agreement', 'Consistent positive API growth'],
    historicalEvents: [
      { date: '2026-09-10', event: 'Expanded seat count by +50 licenses', type: 'positive' },
      { date: '2026-07-15', event: 'Provided public G2 case study quote', type: 'positive' }
    ]
  },
  {
    id: 'CUST-9320',
    name: 'FinPulse Banking Systems',
    industry: 'FinTech',
    contractTier: 'Enterprise',
    contractType: '1-Year',
    paymentMethod: 'Manual Invoice',
    tenureMonths: 8,
    mrr: 9200,
    totalSpend: 73600,
    contractedSeats: 80,
    activeSeats: 38, // 47%
    apiCallsMonthly: 180000,
    apiCallsPriorMonth: 290000, // -38%
    supportTicketsLast90d: 18,
    escalatedTickets: 6,
    npsScore: null, // missing NPS
    paymentFailuresLast6m: 3,
    daysSinceLastLogin: 12,
    integrationsActive: 3,
    leadershipChangeRecent: true,
    churnProbability: 0.81,
    riskTier: 'Critical',
    topDrivers: ['Repeated billing failures (3x)', 'High ticket escalation rate (6)', '38% MoM API decrease'],
    historicalEvents: [
      { date: '2026-09-22', event: 'CFO inquiry regarding early termination penalty', type: 'negative' },
      { date: '2026-08-30', event: 'Payment retry bounced; wire transfer requested', type: 'negative' }
    ]
  },
  {
    id: 'CUST-5512',
    name: 'Kite Commerce Omnichannel',
    industry: 'E-Commerce',
    contractTier: 'Growth',
    contractType: 'Month-to-month',
    paymentMethod: 'Credit Card',
    tenureMonths: 6,
    mrr: 3400,
    totalSpend: 20400,
    contractedSeats: 40,
    activeSeats: 22,
    apiCallsMonthly: 64000,
    apiCallsPriorMonth: 82000,
    supportTicketsLast90d: 7,
    escalatedTickets: 2,
    npsScore: 6,
    paymentFailuresLast6m: 1,
    daysSinceLastLogin: 8,
    integrationsActive: 4,
    leadershipChangeRecent: false,
    churnProbability: 0.58,
    riskTier: 'High',
    topDrivers: ['Month-to-month plan structure', 'Tenure < 12 months', 'Plateaued feature adoption'],
    historicalEvents: [
      { date: '2026-09-05', event: 'Downgraded from Enterprise trial to Growth tier', type: 'negative' }
    ]
  },
  {
    id: 'CUST-7741',
    name: 'Synthetix Bio Analytics',
    industry: 'BioTech',
    contractTier: 'Enterprise',
    contractType: '2-Year',
    paymentMethod: 'ACH Transfer',
    tenureMonths: 22,
    mrr: 15600,
    totalSpend: 343200,
    contractedSeats: 160,
    activeSeats: 152, // 95%
    apiCallsMonthly: 890000,
    apiCallsPriorMonth: 860000,
    supportTicketsLast90d: 3,
    escalatedTickets: 0,
    npsScore: 10,
    paymentFailuresLast6m: 0,
    daysSinceLastLogin: 1,
    integrationsActive: 7,
    leadershipChangeRecent: false,
    churnProbability: 0.05,
    riskTier: 'Low',
    topDrivers: ['NPS Promoter (10)', 'Zero payment friction', 'Deep integration footprint (7 apps)'],
    historicalEvents: [
      { date: '2026-09-12', event: 'Signed multi-year renewal extension with 12% expansion', type: 'positive' }
    ]
  },
  {
    id: 'CUST-3389',
    name: 'Apex Cyber Defenses',
    industry: 'CyberSecurity',
    contractTier: 'Enterprise',
    contractType: '1-Year',
    paymentMethod: 'Manual Invoice',
    tenureMonths: 19,
    mrr: 11200,
    totalSpend: 212800,
    contractedSeats: 150,
    activeSeats: 110,
    apiCallsMonthly: 410000,
    apiCallsPriorMonth: 440000,
    supportTicketsLast90d: 6,
    escalatedTickets: 1,
    npsScore: 7,
    paymentFailuresLast6m: 0,
    daysSinceLastLogin: 4,
    integrationsActive: 6,
    leadershipChangeRecent: false,
    churnProbability: 0.28,
    riskTier: 'Moderate',
    topDrivers: ['Moderate seat gap (27% unassigned)', 'Minor usage contraction', 'Single ticket escalation'],
    historicalEvents: [
      { date: '2026-08-19', event: 'SOC-2 Type II report compliance review passed', type: 'positive' }
    ]
  },
  {
    id: 'CUST-6102',
    name: 'Terra Nova Renewable Energy',
    industry: 'CleanTech',
    contractTier: 'Growth',
    contractType: 'Month-to-month',
    paymentMethod: 'Credit Card',
    tenureMonths: 4,
    mrr: 2900,
    totalSpend: 11600,
    contractedSeats: 30,
    activeSeats: 11, // 36%
    apiCallsMonthly: 18000,
    apiCallsPriorMonth: 44000, // -59%
    supportTicketsLast90d: 8,
    escalatedTickets: 4,
    npsScore: null,
    paymentFailuresLast6m: 1,
    daysSinceLastLogin: 16,
    integrationsActive: 1,
    leadershipChangeRecent: true,
    churnProbability: 0.85,
    riskTier: 'Critical',
    topDrivers: ['59% steep usage decline', 'Only 1 integration installed', '4 critical support escalations'],
    historicalEvents: [
      { date: '2026-09-17', event: 'Primary champion departed organization', type: 'negative' }
    ]
  },
  {
    id: 'CUST-2415',
    name: 'Stratum Media Group',
    industry: 'Media',
    contractTier: 'Growth',
    contractType: '1-Year',
    paymentMethod: 'Credit Card',
    tenureMonths: 15,
    mrr: 4500,
    totalSpend: 67500,
    contractedSeats: 50,
    activeSeats: 39,
    apiCallsMonthly: 125000,
    apiCallsPriorMonth: 130000,
    supportTicketsLast90d: 5,
    escalatedTickets: 1,
    npsScore: 8,
    paymentFailuresLast6m: 0,
    daysSinceLastLogin: 2,
    integrationsActive: 4,
    leadershipChangeRecent: false,
    churnProbability: 0.22,
    riskTier: 'Low',
    topDrivers: ['Stable daily active team', 'Promoter NPS score', 'Solid contract duration'],
    historicalEvents: [
      { date: '2026-08-01', event: 'Onboarded marketing analytics department', type: 'positive' }
    ]
  },
  {
    id: 'CUST-9850',
    name: 'Cobalt Robotics Automation',
    industry: 'Hardware & IoT',
    contractTier: 'Enterprise',
    contractType: '1-Year',
    paymentMethod: 'Manual Invoice',
    tenureMonths: 11,
    mrr: 8900,
    totalSpend: 97900,
    contractedSeats: 90,
    activeSeats: 52,
    apiCallsMonthly: 310000,
    apiCallsPriorMonth: 390000, // -20%
    supportTicketsLast90d: 11,
    escalatedTickets: 3,
    npsScore: 4,
    paymentFailuresLast6m: 1,
    daysSinceLastLogin: 7,
    integrationsActive: 3,
    leadershipChangeRecent: false,
    churnProbability: 0.69,
    riskTier: 'High',
    topDrivers: ['Contract renewal in 30 days', 'Sub-50% NPS rating', 'Declining monthly telemetries'],
    historicalEvents: [
      { date: '2026-09-24', event: 'Exported historical telemetry data archives', type: 'negative' }
    ]
  },
  {
    id: 'CUST-1193',
    name: 'Lumina Learning Technologies',
    industry: 'EdTech',
    contractTier: 'Growth',
    contractType: 'Month-to-month',
    paymentMethod: 'Credit Card',
    tenureMonths: 7,
    mrr: 3100,
    totalSpend: 21700,
    contractedSeats: 45,
    activeSeats: 26,
    apiCallsMonthly: 48000,
    apiCallsPriorMonth: 59000,
    supportTicketsLast90d: 6,
    escalatedTickets: 2,
    npsScore: null,
    paymentFailuresLast6m: 0,
    daysSinceLastLogin: 9,
    integrationsActive: 2,
    leadershipChangeRecent: false,
    churnProbability: 0.44,
    riskTier: 'Moderate',
    topDrivers: ['Month-to-month vulnerability', 'Moderate login lapses', 'Missing executive feedback'],
    historicalEvents: [
      { date: '2026-09-02', event: 'Webinar integration connected', type: 'positive' }
    ]
  },
  {
    id: 'CUST-6629',
    name: 'OmniPay Global Settlements',
    industry: 'FinTech',
    contractTier: 'Enterprise',
    contractType: '2-Year',
    paymentMethod: 'ACH Transfer',
    tenureMonths: 42,
    mrr: 24500,
    totalSpend: 1029000,
    contractedSeats: 450,
    activeSeats: 440,
    apiCallsMonthly: 3100000,
    apiCallsPriorMonth: 2950000,
    supportTicketsLast90d: 6,
    escalatedTickets: 0,
    npsScore: 10,
    paymentFailuresLast6m: 0,
    daysSinceLastLogin: 1,
    integrationsActive: 9,
    leadershipChangeRecent: false,
    churnProbability: 0.04,
    riskTier: 'Low',
    topDrivers: ['Super-high ARR account ($294k)', '42-month sticky partnership', '9 integrations deep'],
    historicalEvents: [
      { date: '2026-09-20', event: 'Annual executive review completed with 10/10 rating', type: 'positive' }
    ]
  }
];

export const RETENTION_PLAYBOOKS: RetentionPlaybook[] = [
  {
    id: 'pb-adoption-expand',
    title: 'Adoption & License Activation Sprint',
    triggerDriver: 'Low seat utilization',
    targetRiskTiers: ['Critical', 'High'],
    description: 'Deploys a dedicated Solutions Architect to conduct tailored workflow sessions with unactivated teams and deploys targeted in-app onboarding.',
    recommendedAction: 'Trigger automated CSM workshop invite + provision 30-day complimentary advanced analytics module.',
    estimatedCost: 850,
    successRate: 74,
    averageLtvSaved: 38400,
    crmAction: 'Create High-Priority Task in Salesforce + enroll team leads in Marketo adoption series'
  },
  {
    id: 'pb-white-glove-support',
    title: 'Executive White-Glove Support Escalation',
    triggerDriver: 'High ticket escalation rate',
    targetRiskTiers: ['Critical', 'High'],
    description: 'Pairs account with Senior VP of Engineering, spins up dedicated shared Slack/Teams Connect channel, and offers 15-minute SLA guarantee.',
    recommendedAction: 'Issue formal SLA credit on next billing cycle and schedule root-cause technical review within 48 hours.',
    estimatedCost: 1200,
    successRate: 82,
    averageLtvSaved: 72000,
    crmAction: 'Escalate Zendesk priority to P1 Critical + notify VP of Success on Slack'
  },
  {
    id: 'pb-contract-renewal-incentive',
    title: 'Annual Commitment & Multi-Year Incentive',
    triggerDriver: 'Month-to-month contract',
    targetRiskTiers: ['Critical', 'High', 'Moderate'],
    description: 'Transitions at-risk monthly contracts to 1- or 2-year lock-in by offering 15% rate stabilization or custom tier features.',
    recommendedAction: 'Send automated customized proposal with grandfathered pricing and flexible payment terms.',
    estimatedCost: 450,
    successRate: 68,
    averageLtvSaved: 28000,
    crmAction: 'Generate customized DocuSign renewal order via HubSpot CPQ integration'
  },
  {
    id: 'pb-smart-dunning-billing',
    title: 'Frictionless Payment Restructuring',
    triggerDriver: 'Repeated billing failures',
    targetRiskTiers: ['Critical', 'High'],
    description: 'Automates payment recovery with intelligent retry logic, switches failing cards to direct ACH, and pauses account suspension.',
    recommendedAction: 'Grant 14-day billing extension and offer ACH switch with $250 fee rebate.',
    estimatedCost: 200,
    successRate: 89,
    averageLtvSaved: 42000,
    crmAction: 'Send Stripe Smart Dunning email + alert Finance team via webhook'
  },
  {
    id: 'pb-qbr-executive-alignment',
    title: 'Executive Sponsor & QBR Realignment',
    triggerDriver: 'Usage drop MoM',
    targetRiskTiers: ['Critical', 'High', 'Moderate'],
    description: 'Re-establishes strategic value with newly appointed executives and realigns software utility with corporate OKRs.',
    recommendedAction: 'Schedule 30-minute Quarterly Strategic Value Review featuring customized ROI dashboard presentation.',
    estimatedCost: 950,
    successRate: 71,
    averageLtvSaved: 54000,
    crmAction: 'Log Executive Meeting Request in Salesforce & assign Account Executive'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-9014',
    timestamp: '2026-09-28 06:45:12 UTC',
    actor: 'Dr. Elena Rostova',
    actorRole: 'ml_engineer' as const,
    action: 'MODEL_RETRAINED',
    targetEntity: 'XGBoost v2.4.1 (production)',
    details: 'Hyperparameter tuning: max_depth=4, colsample=0.8. Test ROC-AUC improved from 0.891 to 0.924.',
    complianceFlag: 'SOC2_VERIFIED' as const,
    status: 'SUCCESS' as const
  },
  {
    id: 'AUD-9013',
    timestamp: '2026-09-28 05:22:40 UTC',
    actor: 'Marcus Vance',
    actorRole: 'retention_specialist' as const,
    action: 'PLAYBOOK_TRIGGERED',
    targetEntity: 'CUST-8021 (Vanguard Logistics)',
    details: 'Executed "Adoption & License Activation Sprint". Assigned SA and synchronized campaign with Salesforce.',
    complianceFlag: 'SOC2_VERIFIED' as const,
    status: 'SUCCESS' as const
  },
  {
    id: 'AUD-9012',
    timestamp: '2026-09-28 04:10:05 UTC',
    actor: 'System Ingestion Agent',
    actorRole: 'admin' as const,
    action: 'REALTIME_TELEMETRY_INGEST',
    targetEntity: 'CUST-9320 (FinPulse Banking)',
    details: 'Webhook event "BILLING_PAYMENT_FAILED_RETRY_3" ingested. Churn risk updated 0.72 -> 0.81.',
    complianceFlag: 'GDPR_COMPLIANT' as const,
    status: 'WARNING' as const
  },
  {
    id: 'AUD-9011',
    timestamp: '2026-09-27 21:55:18 UTC',
    actor: 'Sarah Chen, VP Success',
    actorRole: 'executive' as const,
    action: 'EXECUTIVE_REPORT_EXPORTED',
    targetEntity: 'Q3 Enterprise Churn Risk Report',
    details: 'Generated board-level PDF overview of $84,200 MRR at risk and cohort retention matrix.',
    complianceFlag: 'HIPAA_ALIGNED' as const,
    status: 'SUCCESS' as const
  },
  {
    id: 'AUD-9010',
    timestamp: '2026-09-27 18:30:00 UTC',
    actor: 'System Admin',
    actorRole: 'admin' as const,
    action: 'CRM_SYNC_SCHEDULED',
    targetEntity: 'HubSpot Connector',
    details: 'Synchronized 12 customer risk tier tags and priority metrics to CRM contact properties.',
    complianceFlag: 'SOC2_VERIFIED' as const,
    status: 'SUCCESS' as const
  }
];
