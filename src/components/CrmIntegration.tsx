import React, { useState } from 'react';
import { Customer } from '../types/churn';
import { Share2, CheckCircle2, RefreshCw, Send, Code2, Copy, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface CrmIntegrationProps {
  customers: Customer[];
  onTriggerSync: (crmName: string) => void;
}

export const CrmIntegration: React.FC<CrmIntegrationProps> = ({
  customers,
  onTriggerSync
}) => {
  const [selectedConnector, setSelectedConnector] = useState<'salesforce' | 'hubspot' | 'klaviyo' | 'webhook'>('salesforce');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const sampleCustomer = customers.find(c => c.riskTier === 'Critical') || customers[0];

  const handleSyncNow = (crmName: string) => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onTriggerSync(crmName);
      setSyncStatus(`Successfully synchronized ${customers.length} account health scores and campaign tags to ${crmName}.`);
      setTimeout(() => setSyncStatus(null), 4000);
    }, 1200);
  };

  const samplePayload = {
    event: "churniq.score.updated",
    timestamp: "2026-09-28T07:15:00.000Z",
    account: {
      account_id: sampleCustomer.id,
      company_name: sampleCustomer.name,
      mrr_usd: sampleCustomer.mrr,
      churn_probability: sampleCustomer.churnProbability,
      risk_tier: sampleCustomer.riskTier,
      top_drivers: sampleCustomer.topDrivers,
      recommended_playbook: "Adoption & License Activation Sprint",
      crm_actions: [
        {
          target: "Salesforce",
          object: "Task",
          priority: "High",
          subject: `Urgent: ${sampleCustomer.name} Churn Risk at ${Math.round(sampleCustomer.churnProbability * 100)}%`
        },
        {
          target: "HubSpot",
          object: "ContactProperty",
          property_name: "churniq_health_status",
          property_value: "AT_RISK_CRITICAL"
        }
      ]
    }
  };

  const curlCommand = `curl -X POST https://api.churniq.io/v1/crm/sync \\
  -H "Authorization: Bearer ciq_live_9a8f273b00c4e1" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ account_id: sampleCustomer.id, auto_trigger_campaign: true })}'`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span>Enterprise Ecosystem</span>
            <span className="text-slate-600">·</span>
            <span>Bi-Directional CRM Sync & Webhooks</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
            CRM Integration & Automated Campaign Orchestration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automating personalized marketing sequences, CSM high-priority alerts, and contact property synchronization across your tech stack.
          </p>
        </div>

        <button
          disabled={isSyncing}
          onClick={() => handleSyncNow(selectedConnector.toUpperCase())}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm shadow-cyan-950"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchronizing Data...' : `Push Scores to ${selectedConnector.toUpperCase()}`}</span>
        </button>
      </div>

      {syncStatus && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatus}</span>
          </div>
          <span className="font-mono text-emerald-400 font-bold">200 OK</span>
        </div>
      )}

      {/* CRM Connectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Salesforce */}
        <div
          onClick={() => setSelectedConnector('salesforce')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedConnector === 'salesforce'
              ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-xs text-white">Salesforce Service Cloud</div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bi-directional sync with SFDC Account & Opportunity objects. Creates high-priority tasks for Account Executives.
          </p>
          <div className="mt-3 text-xs font-mono text-cyan-400 flex items-center justify-between">
            <span>Status: Connected</span>
            <span>Last Sync: 4m ago</span>
          </div>
        </div>

        {/* HubSpot */}
        <div
          onClick={() => setSelectedConnector('hubspot')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedConnector === 'hubspot'
              ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-xs text-white">HubSpot Marketing & CRM</div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Synchronizes custom properties <code className="text-cyan-300">churniq_health_score</code> and triggers automated workflows.
          </p>
          <div className="mt-3 text-xs font-mono text-cyan-400 flex items-center justify-between">
            <span>Status: Connected</span>
            <span>Last Sync: 12m ago</span>
          </div>
        </div>

        {/* Klaviyo */}
        <div
          onClick={() => setSelectedConnector('klaviyo')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedConnector === 'klaviyo'
              ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-xs text-white">Klaviyo / Braze Retention</div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enrolls at-risk users into hyper-personalized email sequences offering tailored feature webinars and discount incentives.
          </p>
          <div className="mt-3 text-xs font-mono text-cyan-400 flex items-center justify-between">
            <span>Status: Connected</span>
            <span>Last Sync: 1h ago</span>
          </div>
        </div>

        {/* Custom Webhook */}
        <div
          onClick={() => setSelectedConnector('webhook')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedConnector === 'webhook'
              ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-xs text-white">Custom HTTP Webhook</div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dispatches HMAC-SHA256 signed JSON payloads to internal microservices, Slack bots, or data lake endpoints.
          </p>
          <div className="mt-3 text-xs font-mono text-cyan-400 flex items-center justify-between">
            <span>Status: Active</span>
            <span>Endpoint: /events</span>
          </div>
        </div>
      </div>

      {/* Field Mapping Table & Webhook Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Field Mappings (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Field Schema Synchronization</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">ChurnIQ → {selectedConnector.toUpperCase()}</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-bold">churn_probability</span>
                <div className="text-xs text-slate-500 font-sans">Model risk (0.00 - 1.00)</div>
              </div>
              <span className="text-slate-400">→</span>
              <div className="text-right">
                <span className="text-emerald-400 font-bold">Health_Score__c</span>
                <div className="text-xs text-slate-500 font-sans">Decimal (2)</div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-bold">top_drivers[0]</span>
                <div className="text-xs text-slate-500 font-sans">Primary SHAP root cause</div>
              </div>
              <span className="text-slate-400">→</span>
              <div className="text-right">
                <span className="text-emerald-400 font-bold">Attrition_Factor__c</span>
                <div className="text-xs text-slate-500 font-sans">Picklist / String</div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-bold">risk_tier</span>
                <div className="text-xs text-slate-500 font-sans">Critical, High, Moderate, Low</div>
              </div>
              <span className="text-slate-400">→</span>
              <div className="text-right">
                <span className="text-emerald-400 font-bold">churniq_risk_tier</span>
                <div className="text-xs text-slate-500 font-sans">HubSpot Segment Tag</div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-bold">recommended_playbook</span>
                <div className="text-xs text-slate-500 font-sans">Prescriptive action title</div>
              </div>
              <span className="text-slate-400">→</span>
              <div className="text-right">
                <span className="text-emerald-400 font-bold">Next_Best_Action__c</span>
                <div className="text-xs text-slate-500 font-sans">Text Field (255)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Outbound JSON Payload Inspector (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Outbound Webhook JSON Inspector</h3>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(samplePayload, null, 2));
                setCopiedCurl(true);
                setTimeout(() => setCopiedCurl(false), 2000);
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedCurl ? 'Copied!' : 'Copy Payload'}</span>
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 overflow-x-auto max-h-72">
            <pre className="text-xs font-mono text-cyan-300 leading-relaxed">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>FastAPI Route: <code className="text-slate-200">POST /api/v1/crm/sync</code></span>
            <span className="text-emerald-400">HMAC-SHA256 Validated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
