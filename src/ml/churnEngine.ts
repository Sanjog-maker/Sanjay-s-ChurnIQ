import { Customer, EngineeredFeatures, ModelMetrics, RiskTier, ShapValue } from '../types/churn';

export const BASELINE_CHURN_RATE = 0.264; // E[f(x)] global base probability

export interface PreprocessingConfig {
  imputationStrategy: 'median' | 'knn' | 'iterative_mice' | 'flag_indicator';
  encodingStrategy: 'one_hot' | 'target_encoding' | 'weight_of_evidence';
  splitRatio: '70_15_15' | '80_10_10' | '60_20_20';
  scalingMethod: 'robust_scaler' | 'standard_scaler' | 'min_max';
}

export function engineerFeatures(c: Customer): EngineeredFeatures {
  const seatUtilizationRate = Math.min(1.0, Math.max(0, c.activeSeats / Math.max(1, c.contractedSeats)));
  const prior = Math.max(100, c.apiCallsPriorMonth);
  const usageVelocityMoM = (c.apiCallsMonthly - prior) / prior;
  const supportFrictionIndex = (c.escalatedTickets * 2.5) + (c.supportTicketsLast90d * 0.5);
  const paymentDistressScore = (c.paymentFailuresLast6m * 2.0);
  const npsNormalized = c.npsScore !== null ? c.npsScore / 10 : 0.6; // default median
  const mrrDensity = c.mrr / Math.max(1, c.activeSeats);
  const expectedSpend = c.tenureMonths * c.mrr;
  const tenureDiscountFactor = expectedSpend > 0 ? c.totalSpend / expectedSpend : 1.0;
  const executiveInstability = c.leadershipChangeRecent ? 1.0 : 0.0;

  return {
    seatUtilizationRate,
    usageVelocityMoM,
    supportFrictionIndex,
    paymentDistressScore,
    npsNormalized,
    mrrDensity,
    tenureDiscountFactor,
    executiveInstability
  };
}

export function calculateShapValues(customer: Customer): { baseValue: number; values: ShapValue[]; predictedProb: number } {
  const feats = engineerFeatures(customer);
  const values: ShapValue[] = [];

  // 1. Seat Utilization
  if (feats.seatUtilizationRate < 0.40) {
    values.push({
      featureName: 'seat_utilization',
      displayName: 'Seat Utilization',
      featureValue: `${(feats.seatUtilizationRate * 100).toFixed(0)}% (${customer.activeSeats}/${customer.contractedSeats})`,
      shapValue: +0.22,
      direction: 'increases_churn',
      explanation: 'Critical shelfware risk: under 40% contracted licenses deployed.'
    });
  } else if (feats.seatUtilizationRate > 0.85) {
    values.push({
      featureName: 'seat_utilization',
      displayName: 'Seat Utilization',
      featureValue: `${(feats.seatUtilizationRate * 100).toFixed(0)}%`,
      shapValue: -0.16,
      direction: 'decreases_churn',
      explanation: 'High organic adoption: account is actively using contracted seats.'
    });
  } else {
    values.push({
      featureName: 'seat_utilization',
      displayName: 'Seat Utilization',
      featureValue: `${(feats.seatUtilizationRate * 100).toFixed(0)}%`,
      shapValue: +0.03,
      direction: 'increases_churn',
      explanation: 'Moderate license adoption.'
    });
  }

  // 2. Usage Velocity MoM
  if (feats.usageVelocityMoM < -0.25) {
    const dropPct = Math.abs(Math.round(feats.usageVelocityMoM * 100));
    values.push({
      featureName: 'usage_velocity_mom',
      displayName: 'API / Usage Velocity MoM',
      featureValue: `-${dropPct}% MoM`,
      shapValue: +0.19,
      direction: 'increases_churn',
      explanation: `Steep telemetric traffic decline (${dropPct}% drop compared to prior month).`
    });
  } else if (feats.usageVelocityMoM > 0.05) {
    values.push({
      featureName: 'usage_velocity_mom',
      displayName: 'API / Usage Velocity MoM',
      featureValue: `+${Math.round(feats.usageVelocityMoM * 100)}% MoM`,
      shapValue: -0.14,
      direction: 'decreases_churn',
      explanation: 'Healthy growth in monthly platform operations and API calls.'
    });
  } else {
    values.push({
      featureName: 'usage_velocity_mom',
      displayName: 'API / Usage Velocity MoM',
      featureValue: `${Math.round(feats.usageVelocityMoM * 100)}% MoM`,
      shapValue: -0.02,
      direction: 'decreases_churn',
      explanation: 'Stable baseline usage volume.'
    });
  }

  // 3. Support Friction
  if (feats.supportFrictionIndex >= 5.0) {
    values.push({
      featureName: 'support_friction',
      displayName: 'Support Ticket Friction',
      featureValue: `${customer.escalatedTickets} escalated / ${customer.supportTicketsLast90d} total`,
      shapValue: +0.18,
      direction: 'increases_churn',
      explanation: 'Severe friction: multiple Tier-3 escalations signal user frustration.'
    });
  } else if (customer.escalatedTickets === 0 && customer.supportTicketsLast90d <= 4) {
    values.push({
      featureName: 'support_friction',
      displayName: 'Support Ticket Friction',
      featureValue: `${customer.supportTicketsLast90d} normal tickets (0 escalations)`,
      shapValue: -0.09,
      direction: 'decreases_churn',
      explanation: 'Smooth operations with zero critical escalations.'
    });
  } else {
    values.push({
      featureName: 'support_friction',
      displayName: 'Support Ticket Friction',
      featureValue: `${customer.escalatedTickets} escalations`,
      shapValue: +0.05,
      direction: 'increases_churn',
      explanation: 'Moderate support load requiring CSM attention.'
    });
  }

  // 4. Contract Commitment
  if (customer.contractType === 'Month-to-month') {
    values.push({
      featureName: 'contract_type',
      displayName: 'Contract Commitment',
      featureValue: 'Month-to-month',
      shapValue: +0.15,
      direction: 'increases_churn',
      explanation: 'No lock-in barrier: customer can cancel at end of billing cycle.'
    });
  } else if (customer.contractType === '2-Year') {
    values.push({
      featureName: 'contract_type',
      displayName: 'Contract Commitment',
      featureValue: '2-Year Multi-Year Lock',
      shapValue: -0.15,
      direction: 'decreases_churn',
      explanation: 'High structural switching barrier with multi-year agreement.'
    });
  } else {
    values.push({
      featureName: 'contract_type',
      displayName: 'Contract Commitment',
      featureValue: '1-Year Annual',
      shapValue: -0.06,
      direction: 'decreases_churn',
      explanation: 'Standard annual contract term.'
    });
  }

  // 5. Payment Failures / Distress
  if (customer.paymentFailuresLast6m > 0) {
    values.push({
      featureName: 'payment_distress',
      displayName: 'Billing & Payment Friction',
      featureValue: `${customer.paymentFailuresLast6m} retry bounces`,
      shapValue: +0.12,
      direction: 'increases_churn',
      explanation: 'Involuntary churn precursor: repeated invoice payment retries.'
    });
  } else {
    values.push({
      featureName: 'payment_distress',
      displayName: 'Billing & Payment Friction',
      featureValue: 'Zero bounces (100% on-time)',
      shapValue: -0.05,
      direction: 'decreases_churn',
      explanation: 'Pristine payment reliability.'
    });
  }

  // 6. Leadership Change / Executive Sponsor
  if (customer.leadershipChangeRecent) {
    values.push({
      featureName: 'leadership_change',
      displayName: 'Executive Sponsor Instability',
      featureValue: 'Recent Sponsor Departure',
      shapValue: +0.11,
      direction: 'increases_churn',
      explanation: 'Champion loss: incoming leadership frequently reviews SaaS tooling stack.'
    });
  }

  // 7. Days Since Last Login
  if (customer.daysSinceLastLogin > 14) {
    values.push({
      featureName: 'days_inactive',
      displayName: 'Inactivity Window',
      featureValue: `${customer.daysSinceLastLogin} days inactive`,
      shapValue: +0.09,
      direction: 'increases_churn',
      explanation: 'Stagnant engagement: primary admins have not logged in over two weeks.'
    });
  } else if (customer.daysSinceLastLogin <= 2) {
    values.push({
      featureName: 'days_inactive',
      displayName: 'Inactivity Window',
      featureValue: `${customer.daysSinceLastLogin}d ago (Daily Active)`,
      shapValue: -0.06,
      direction: 'decreases_churn',
      explanation: 'Daily sticky usage pattern.'
    });
  }

  // Sum up SHAP values + baseline
  const totalShapSum = values.reduce((sum, v) => sum + v.shapValue, 0);
  let predictedProb = BASELINE_CHURN_RATE + totalShapSum;
  predictedProb = Math.min(0.98, Math.max(0.02, predictedProb));

  // Sort values by magnitude
  values.sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue));

  return {
    baseValue: BASELINE_CHURN_RATE,
    values,
    predictedProb: Number(predictedProb.toFixed(2))
  };
}

export function getRiskTier(probability: number): RiskTier {
  if (probability >= 0.70) return 'Critical';
  if (probability >= 0.50) return 'High';
  if (probability >= 0.25) return 'Moderate';
  return 'Low';
}

export const BENCHMARK_MODELS: ModelMetrics[] = [
  {
    name: 'XGBoost (Extreme Gradient Boosting)',
    accuracy: 0.912,
    precision: 0.884,
    recall: 0.871,
    f1Score: 0.877,
    rocAuc: 0.924,
    prAuc: 0.892,
    logLoss: 0.241,
    trainingTimeMs: 1420,
    inferenceLatencyMs: 1.4,
    confusionMatrix: {
      truePositive: 135,
      falsePositive: 18,
      trueNegative: 452,
      falseNegative: 20
    }
  },
  {
    name: 'Random Forest (100 Estimators)',
    accuracy: 0.879,
    precision: 0.835,
    recall: 0.819,
    f1Score: 0.827,
    rocAuc: 0.886,
    prAuc: 0.841,
    logLoss: 0.312,
    trainingTimeMs: 2840,
    inferenceLatencyMs: 3.2,
    confusionMatrix: {
      truePositive: 127,
      falsePositive: 25,
      trueNegative: 445,
      falseNegative: 28
    }
  },
  {
    name: 'Logistic Regression (L2 Regularized Baseline)',
    accuracy: 0.804,
    precision: 0.732,
    recall: 0.710,
    f1Score: 0.721,
    rocAuc: 0.812,
    prAuc: 0.753,
    logLoss: 0.448,
    trainingTimeMs: 320,
    inferenceLatencyMs: 0.3,
    confusionMatrix: {
      truePositive: 110,
      falsePositive: 40,
      trueNegative: 430,
      falseNegative: 45
    }
  }
];

// Helper to compute confusion matrix and ROI under different classification thresholds
export function computeThresholdMetrics(threshold: number, baseModel: ModelMetrics) {
  // Sensitivity shift as threshold changes
  // Lower threshold => higher recall (more flagged as churn), lower precision (more false alarms)
  // Higher threshold => lower recall, higher precision
  const t = Math.max(0.05, Math.min(0.95, threshold));
  const factor = (0.5 - t) * 1.4;

  const totalPositive = 155;
  const totalNegative = 470;

  const tp = Math.round(Math.min(totalPositive, Math.max(10, baseModel.confusionMatrix.truePositive + factor * 25)));
  const fn = totalPositive - tp;
  const fp = Math.round(Math.min(totalNegative, Math.max(5, baseModel.confusionMatrix.falsePositive + factor * 35)));
  const tn = totalNegative - fp;

  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  const f1 = (2 * precision * recall) / (precision + recall || 1);
  const accuracy = (tp + tn) / (tp + tn + fp + fn);

  // Financial ROI Matrix
  // Average LTV at risk: $42,000
  // Cost per proactive retention intervention: $850
  // Probability of saving a flagged churner: 70%
  const avgCustomerLtv = 42000;
  const costPerIntervention = 850;
  const retentionSaveSuccessRate = 0.68;

  const totalInterventions = tp + fp;
  const totalInterventionCost = totalInterventions * costPerIntervention;
  const savedCustomers = tp * retentionSaveSuccessRate;
  const grossRevenuePreserved = savedCustomers * avgCustomerLtv;
  const netFinancialValue = grossRevenuePreserved - totalInterventionCost;
  const missedRevenueLoss = fn * avgCustomerLtv;

  return {
    threshold: t,
    precision: Number(precision.toFixed(3)),
    recall: Number(recall.toFixed(3)),
    f1Score: Number(f1.toFixed(3)),
    accuracy: Number(accuracy.toFixed(3)),
    confusionMatrix: {
      truePositive: tp,
      falsePositive: fp,
      trueNegative: tn,
      falseNegative: fn
    },
    financial: {
      totalInterventions,
      totalInterventionCost,
      grossRevenuePreserved,
      netFinancialValue,
      missedRevenueLoss,
      roiMultiplier: Number((netFinancialValue / (totalInterventionCost || 1)).toFixed(1))
    }
  };
}

// Global SHAP feature importance data (Mean |SHAP value| across 1,000 customers)
export const GLOBAL_FEATURE_IMPORTANCE = [
  { feature: 'Seat Utilization Rate', meanShap: 0.245, category: 'Product Engagement' },
  { feature: 'API Usage Velocity (MoM %)', meanShap: 0.218, category: 'Product Engagement' },
  { feature: 'Support Ticket Escalation Friction', meanShap: 0.184, category: 'Customer Support' },
  { feature: 'Contract Duration Commitment', meanShap: 0.152, category: 'Billing & Commercials' },
  { feature: 'Payment Failure Retries', meanShap: 0.129, category: 'Billing & Commercials' },
  { feature: 'Recent Executive Sponsor Change', meanShap: 0.114, category: 'Organizational' },
  { feature: 'Days Since Last Admin Login', meanShap: 0.098, category: 'Product Engagement' },
  { feature: 'Active Integrations Count', meanShap: 0.082, category: 'Platform Stickiness' },
  { feature: 'MRR Density per Active User', meanShap: 0.064, category: 'Billing & Commercials' },
  { feature: 'Normalized NPS Feedback', meanShap: 0.057, category: 'Customer Sentiment' }
];
