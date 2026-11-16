export type RiskTier = 'Critical' | 'High' | 'Moderate' | 'Low';

export type UserRole = 'admin' | 'ml_engineer' | 'retention_specialist' | 'executive';

export interface Customer {
  id: string;
  name: string;
  industry: string;
  contractTier: 'Enterprise' | 'Growth' | 'Starter';
  contractType: 'Month-to-month' | '1-Year' | '2-Year';
  paymentMethod: 'Credit Card' | 'ACH Transfer' | 'Manual Invoice';
  tenureMonths: number;
  mrr: number; // Monthly Recurring Revenue
  totalSpend: number;
  contractedSeats: number;
  activeSeats: number; // ratio computed
  apiCallsMonthly: number;
  apiCallsPriorMonth: number; // velocity computed
  supportTicketsLast90d: number;
  escalatedTickets: number; // friction computed
  npsScore: number | null; // may be missing
  paymentFailuresLast6m: number;
  daysSinceLastLogin: number;
  integrationsActive: number;
  leadershipChangeRecent: boolean;
  churnProbability: number; // 0.00 to 1.00
  riskTier: RiskTier;
  topDrivers: string[];
  historicalEvents?: {
    date: string;
    event: string;
    type: 'positive' | 'negative' | 'neutral';
  }[];
}

export interface EngineeredFeatures {
  seatUtilizationRate: number; // active / contracted
  usageVelocityMoM: number; // (current - prior) / prior
  supportFrictionIndex: number; // escalated * 2.5 + supportTickets
  paymentDistressScore: number; // failures * 2.0
  npsNormalized: number; // 0 to 1
  mrrDensity: number; // mrr / activeSeats
  tenureDiscountFactor: number;
  executiveInstability: number; // 1 if recent leadership change else 0
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  prAuc: number;
  logLoss: number;
  trainingTimeMs: number;
  inferenceLatencyMs: number;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
}

export interface ShapValue {
  featureName: string;
  displayName: string;
  featureValue: string | number;
  shapValue: number; // contribution to log-odds or probability delta
  direction: 'increases_churn' | 'decreases_churn';
  explanation: string;
}

export interface RetentionPlaybook {
  id: string;
  title: string;
  triggerDriver: string;
  description: string;
  targetRiskTiers: RiskTier[];
  recommendedAction: string;
  estimatedCost: number; // $
  successRate: number; // percentage
  averageLtvSaved: number; // $
  crmAction: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  targetEntity: string;
  details: string;
  complianceFlag: 'SOC2_VERIFIED' | 'GDPR_COMPLIANT' | 'HIPAA_ALIGNED';
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface IngestedEvent {
  id: string;
  customerId: string;
  customerName: string;
  timestamp: string;
  eventType: string;
  deltaImpact: number; // change in probability
  newProbability: number;
  newRiskTier: RiskTier;
  metadata: Record<string, any>;
}
