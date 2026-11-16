import React, { useState } from 'react';
import { Customer, IngestedEvent } from '../types/churn';
import { getRiskTier } from '../ml/churnEngine';
import { X, Zap, Send, Sparkles } from 'lucide-react';

interface QuickIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onCustomerUpdated: (updatedCustomer: Customer, event: IngestedEvent) => void;
}

export const QuickIngestModal: React.FC<QuickIngestModalProps> = ({
  isOpen,
  onClose,
  customers,
  onCustomerUpdated
}) => {
  if (!isOpen) return null;

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [eventType, setEventType] = useState<string>('TICKET_ESCALATED_SEV1');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  const SIMULATION_EVENTS = [
    { id: 'TICKET_ESCALATED_SEV1', label: 'Sev-1 Urgent Support Outage Escalated', impact: +0.15 },
    { id: 'USAGE_DROP_MOM_50', label: 'Steep 50% Drop in API Calls', impact: +0.14 },
    { id: 'PAYMENT_FAILED_RETRY_3', label: 'Final Billing Invoice Payment Failed', impact: +0.12 },
    { id: 'SPONSOR_RESIGNED', label: 'Primary Executive Sponsor Left Company', impact: +0.18 },
    { id: 'SEAT_EXPANSION_PLUS_50', label: 'License Expansion (+50 Active Seats)', impact: -0.16 },
    { id: 'NPS_PROMOTER_10', label: 'Executive Promoter NPS Survey (10/10)', impact: -0.12 }
  ];

  const handleFire = () => {
    const preset = SIMULATION_EVENTS.find(e => e.id === eventType) || SIMULATION_EVENTS[0];
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
      metadata: { label: preset.label }
    };

    const updatedCustomer: Customer = {
      ...selectedCustomer,
      churnProbability: newProb,
      riskTier: newTier,
      historicalEvents: [
        {
          date: '2026-09-28',
          event: `${preset.label} (Score adjusted to ${(newProb * 100).toFixed(0)}%)`,
          type: preset.impact > 0 ? 'negative' : 'positive'
        },
        ...(selectedCustomer.historicalEvents || [])
      ]
    };

    onCustomerUpdated(updatedCustomer, newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Simulate Telemetry Ingestion</h3>
            <p className="text-xs text-slate-400">Dynamically update churn probability in real time</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Select Customer Account:</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-cyan-500 font-medium"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — Current: {Math.round(c.churnProbability * 100)}% ({c.riskTier})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Telemetry Event to Trigger:</label>
            <div className="space-y-2">
              {SIMULATION_EVENTS.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setEventType(e.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    eventType === e.id
                      ? 'bg-slate-800 border-cyan-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-medium text-xs">{e.label}</span>
                  <span className={`font-mono font-bold text-xs ${e.impact > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {e.impact > 0 ? '+' : ''}{(e.impact * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleFire}
            className="flex-1 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shadow-cyan-950"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Inject Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};
