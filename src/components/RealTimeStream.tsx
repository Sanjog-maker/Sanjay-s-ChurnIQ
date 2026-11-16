import React, { useState, useEffect } from 'react';
import { Customer, IngestedEvent, RiskTier } from '../types/churn';
import { getRiskTier } from '../ml/churnEngine';
import { Zap, Activity, Radio, ArrowUpRight, ArrowDownRight, RefreshCw, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RealTimeStreamProps {
  customers: Customer[];
  onCustomerUpdated: (updatedCustomer: Customer, event: IngestedEvent) => void;
}

export const RealTimeStream: React.FC<RealTimeStreamProps> = ({
  customers,
  onCustomerUpdated
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedEventType, setSelectedEventType] = useState<string>('TICKET_ESCALATED_SEV1');
  const [isStreamingActive, setIsStreamingActive] = useState<boolean>(true);
  const [eventsFeed, setEventsFeed] = useState<IngestedEvent[]>([
    {
      id: 'EVT-1099',
      customerId: 'CUST-8021',
      customerName: 'Vanguard Logistics',
      timestamp: 'Just now',
      eventType: 'API_USAGE_DROP_45PCT',
      deltaImpact: +0.12,
      newProbability: 0.88,
      newRiskTier: 'Critical',
      metadata: { priorCalls: 110000, currentCalls: 42000 }
    },
    {
      id: 'EVT-1098',
      customerId: 'CUST-9320',
      customerName: 'FinPulse Banking',
      timestamp: '2m ago',
      eventType: 'BILLING_PAYMENT_FAILED_RETRY',
      deltaImpact: +0.09,
      newProbability: 0.81,
      newRiskTier: 'Critical',
      metadata: { invoiceId: 'INV-8812', gatewayCode: 'INSUFFICIENT_FUNDS' }
    },
    {
      id: 'EVT-1097',
      customerId: 'CUST-1044',
      customerName: 'Helios Health Tech',
      timestamp: '5m ago',
      eventType: 'SEAT_EXPANSION_PLUS_50',
      deltaImpact: -0.06,
      newProbability: 0.08,
      newRiskTier: 'Low',
      metadata: { seatsAdded: 50, newSeatTotal: 300 }
    }
  ]);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  const SIMULATION_EVENTS = [
    {
      id: 'TICKET_ESCALATED_SEV1',
      label: 'Sev-1 Urgent Support Escalation',
      impact: +0.14,
      desc: 'Customer opens P1 production blocking outage ticket'
    },
    {
      id: 'API_USAGE_DROP_40',
      label: 'Sudden 40% Daily API Traffic Drop',
      impact: +0.11,
      desc: 'Telemetry drops sharply over consecutive 72 hours'
    },
    {
      id: 'BILLING_RETRY_FAILED',
      label: 'Payment Gateway Auto-Retry Failed',
      impact: +0.15,
      desc: 'Invoice bounced on final retry attempt'
    },
    {
      id: 'SPONSOR_DEPARTED',
      label: 'Executive Champion Departs Company',
      impact: +0.18,
      desc: 'CRM logs primary buyer transition to competitor'
    },
    {
      id: 'SEAT_EXPANSION_HEALTHY',
      label: 'License Expansion (+25 Seats Added)',
      impact: -0.15,
      desc: 'Account actively adds more licenses and provisions users'
    },
    {
      id: 'NPS_PROMOTER_10',
      label: 'NPS Survey Promoter Received (10/10)',
      impact: -0.12,
      desc: 'Executive stakeholder submits top satisfaction score'
    }
  ];

  const handleSimulateEvent = () => {
    const preset = SIMULATION_EVENTS.find(e => e.id === selectedEventType) || SIMULATION_EVENTS[0];
    let newProb = selectedCustomer.churnProbability + preset.impact;
    newProb = Math.min(0.98, Math.max(0.02, Number(newProb.toFixed(2))));
    const newTier = getRiskTier(newProb);

    const newEvent: IngestedEvent = {
      id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      timestamp: 'Just now',
      eventType: preset.id,
      deltaImpact: preset.impact,
      newProbability: newProb,
      newRiskTier: newTier,
      metadata: { description: preset.desc }
    };

    const updatedCustomer: Customer = {
      ...selectedCustomer,
      churnProbability: newProb,
      riskTier: newTier,
      historicalEvents: [
        {
          date: '2026-09-28',
          event: `${preset.label}: churn risk adjusted to ${(newProb * 100).toFixed(0)}%`,
          type: preset.impact > 0 ? 'negative' : 'positive'
        },
        ...(selectedCustomer.historicalEvents || [])
      ]
    };

    setEventsFeed(prev => [newEvent, ...prev.slice(0, 9)]);
    onCustomerUpdated(updatedCustomer, newEvent);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span>High-Throughput Telemetry</span>
            <span className="text-slate-600">·</span>
            <span>Real-Time Scoring Pipeline</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Real-Time Event Stream Ingestion & Dynamic Churn Scoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Millisecond-latency evaluation: scoring events as they stream through Apache Kafka / WebSocket pipes, adjusting risk scores dynamically before monthly batch cycles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono">
            <Radio className={`w-3.5 h-3.5 ${isStreamingActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-slate-400">Stream Status:</span>
            <span className="text-emerald-400 font-semibold">{isStreamingActive ? 'LIVE (1,420 eps)' : 'PAUSED'}</span>
          </div>
        </div>
      </div>

      {/* Simulator Control Cockpit */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Event Simulation Generator</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Inject Synthetic Telemetry Event</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {/* Target Customer Dropdown (5 cols) */}
          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Target Customer Account:</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-medium"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Current: {Math.round(c.churnProbability * 100)}%)
                </option>
              ))}
            </select>
          </div>

          {/* Event Type (5 cols) */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Select Telemetric Event to Fire:</label>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-medium"
            >
              {SIMULATION_EVENTS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.label} ({e.impact > 0 ? `+${e.impact * 100}%` : `${e.impact * 100}%`} Risk)
                </option>
              ))}
            </select>
          </div>

          {/* Fire Button (3 cols) */}
          <div className="sm:col-span-3 flex items-end">
            <button
              onClick={handleSimulateEvent}
              className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shadow-cyan-950"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ingest & Score Live</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stream Metrics & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stream Metrics Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Pipeline Telemetry Stats
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 text-xs block">End-to-End Latency</span>
                <span className="text-lg font-bold text-cyan-400 mt-1 block">4.2 ms</span>
                <span className="text-xs text-slate-500">Ingest → Feature Eng → XGBoost</span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 text-xs block">Throughput Capacity</span>
                <span className="text-lg font-bold text-white mt-1 block">28,000 req/sec</span>
                <span className="text-xs text-slate-500">Distributed FastAPI Worker Nodes</span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 text-xs block">Message Queue Broker</span>
                <span className="text-sm font-bold text-slate-200 mt-1 block">Apache Kafka / Redpanda</span>
                <span className="text-xs text-slate-500">Topic: <code className="text-cyan-300">customer.telemetry.v1</code></span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Event Stream Terminal (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Live Ingested Telemetry Feed</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Streaming in real-time</span>
          </div>

          <div className="space-y-2.5">
            {eventsFeed.map((evt) => {
              const isRiskIncrease = evt.deltaImpact > 0;
              return (
                <div
                  key={evt.id}
                  className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isRiskIncrease ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{evt.customerName}</span>
                        <span className="text-slate-500">({evt.customerId})</span>
                        <span className="text-xs text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-sans">
                          {evt.eventType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 font-sans">
                        Event: <strong className="text-slate-300">{evt.eventType.replace(/_/g, ' ')}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center sm:flex-col sm:items-end justify-between sm:justify-center">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className={isRiskIncrease ? 'text-rose-400' : 'text-emerald-400'}>
                        {isRiskIncrease ? '+' : ''}{(evt.deltaImpact * 100).toFixed(0)}%
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="text-white">{(evt.newProbability * 100).toFixed(0)}% Risk</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{evt.timestamp}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
