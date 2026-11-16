import React, { useState } from 'react';
import { Customer } from '../types/churn';
import { Terminal, Play, Copy, CheckCircle2, Download, FileCode, Layers, Server, Key, Shield, AlertCircle, RefreshCw } from 'lucide-react';

interface ApiExplorerProps {
  customers: Customer[];
}

export const ApiExplorer: React.FC<ApiExplorerProps> = ({ customers }) => {
  const [activeTab, setActiveTab] = useState<'api_docs' | 'keys' | 'python_pipeline' | 'fastapi_app'>('api_docs');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('predict');
  const [apiKey, setApiKey] = useState('ciq_live_9a8f273b00c4e1');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isExecutingRequest, setIsExecutingRequest] = useState(false);
  const [executionResponse, setExecutionResponse] = useState<any>(null);
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState<{ key: string; label: string; date: string }[]>([
    { key: 'ciq_live_9a8f273b00c4e1', label: 'Primary Integration Key (Admin)', date: '2026-09-28' },
    { key: 'ciq_live_dev_8812c3', label: 'Telemetry Stream Worker', date: '2026-09-27' },
    { key: 'ciq_live_crm_4491b2', label: 'Salesforce Bi-Directional Connector', date: '2026-09-26' }
  ]);

  const sampleCust = customers[0];

  // Request Payloads for different endpoints
  const [payloads, setPayloads] = useState<Record<string, string>>({
    predict: JSON.stringify({
      account_id: sampleCust.id,
      contract_type: sampleCust.contractType,
      contracted_seats: sampleCust.contractedSeats,
      active_seats: sampleCust.activeSeats,
      mrr_usd: sampleCust.mrr,
      api_calls_monthly: sampleCust.apiCallsMonthly,
      api_calls_prior_month: sampleCust.apiCallsPriorMonth,
      escalated_tickets: sampleCust.escalatedTickets,
      payment_failures_6m: sampleCust.paymentFailuresLast6m,
      leadership_change_recent: sampleCust.leadershipChangeRecent
    }, null, 2),

    ingest: JSON.stringify({
      account_id: "CUST-9901",
      company_name: "Stripe Meridian Labs",
      industry: "FinTech",
      contract_tier: "Enterprise",
      contract_type: "1-Year",
      payment_method: "ACH Transfer",
      tenure_months: 18,
      mrr_usd: 11400,
      contracted_seats: 150,
      active_seats: 82,
      api_calls_monthly: 320000,
      api_calls_prior_month: 490000,
      escalated_tickets: 2,
      support_tickets_90d: 8,
      nps_score: 7,
      payment_failures_6m: 0,
      leadership_change_recent: false
    }, null, 2),

    shap: JSON.stringify({
      account_id: sampleCust.id,
      contracted_seats: sampleCust.contractedSeats,
      active_seats: sampleCust.activeSeats,
      api_calls_monthly: sampleCust.apiCallsMonthly,
      api_calls_prior_month: sampleCust.apiCallsPriorMonth,
      escalated_tickets: sampleCust.escalatedTickets,
      payment_failures_6m: sampleCust.paymentFailuresLast6m,
      contract_type: sampleCust.contractType,
      leadership_change_recent: sampleCust.leadershipChangeRecent
    }, null, 2),

    recommendations: "", // GET request

    crm_sync: JSON.stringify({
      target_crm: "Salesforce",
      account_ids: [sampleCust.id, "CUST-4192", "CUST-1044"]
    }, null, 2),

    stakeholders: "" // GET request
  });

  const endpointsList = [
    { id: 'predict', method: 'POST', path: '/api/v1/predict', label: 'Predict Churn Probability' },
    { id: 'ingest', method: 'POST', path: '/api/v1/customers/ingest', label: 'Ingest Customer Telemetry' },
    { id: 'shap', method: 'POST', path: '/api/v1/explain/shap', label: 'SHAP Feature Attributions' },
    { id: 'recommendations', method: 'GET', path: `/api/v1/recommendations/${sampleCust.id}`, label: 'Prescriptive Playbook' },
    { id: 'crm_sync', method: 'POST', path: '/api/v1/crm/sync', label: 'Sync to Salesforce / HubSpot' },
    { id: 'stakeholders', method: 'GET', path: '/api/v1/metrics/stakeholders', label: 'Macro Stakeholder Metrics' }
  ];

  const currentEndpoint = endpointsList.find(e => e.id === selectedEndpoint) || endpointsList[0];

  const handleExecuteLiveRequest = async () => {
    setIsExecutingRequest(true);
    setExecutionResponse(null);

    const start = performance.now();
    try {
      const isGet = currentEndpoint.method === 'GET';
      const options: RequestInit = {
        method: currentEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      };

      if (!isGet && payloads[selectedEndpoint]) {
        options.body = payloads[selectedEndpoint];
      }

      const res = await fetch(currentEndpoint.path, options);
      const data = await res.json();
      const latency = Number((performance.now() - start).toFixed(2));

      setExecutionResponse({
        status: res.status,
        statusText: res.statusText,
        latency_ms: latency,
        headers: {
          'content-type': res.headers.get('content-type') || 'application/json'
        },
        body: data
      });
    } catch (err: any) {
      const latency = Number((performance.now() - start).toFixed(2));
      setExecutionResponse({
        status: 500,
        statusText: 'Internal Error',
        latency_ms: latency,
        body: { error: err.message || 'Request failed to execute' }
      });
    } finally {
      setIsExecutingRequest(false);
    }
  };

  const handleCreateNewKey = async () => {
    try {
      const res = await fetch('/api/v1/auth/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newKeyLabel || 'Custom Client' })
      });
      const data = await res.json();
      setGeneratedKeys(prev => [
        { key: data.api_key, label: data.label, date: 'Just now' },
        ...prev
      ]);
      setApiKey(data.api_key);
      setNewKeyLabel('');
    } catch (err) {
      console.error(err);
    }
  };

  const getCurlSnippet = () => {
    const isGet = currentEndpoint.method === 'GET';
    if (isGet) {
      return `curl -X GET https://api.churniq.io${currentEndpoint.path} \\
  -H "Authorization: Bearer ${apiKey}"`;
    }
    return `curl -X POST https://api.churniq.io${currentEndpoint.path} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${payloads[selectedEndpoint]?.replace(/\n/g, ' ')}'`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span>Enterprise Integration Engine</span>
            <span className="text-slate-600">·</span>
            <span>REST API v1 Specification</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Developer API Playground & Machine Learning Workbench
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test live endpoints directly on the server with secure Bearer authentication, schema validation, and real-time execution telemetry.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('api_docs')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'api_docs' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Console
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'keys' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            API Key Credentials
          </button>
          <button
            onClick={() => setActiveTab('python_pipeline')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'python_pipeline' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Python Pipeline Script
          </button>
          <button
            onClick={() => setActiveTab('fastapi_app')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'fastapi_app' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            server.ts Source
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE CONSOLE */}
      {activeTab === 'api_docs' && (
        <div className="space-y-6">
          {/* Endpoint Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-mono">
            {endpointsList.map((ep) => (
              <button
                key={ep.id}
                onClick={() => {
                  setSelectedEndpoint(ep.id);
                  setExecutionResponse(null);
                }}
                className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-2 whitespace-nowrap ${
                  selectedEndpoint === ep.id
                    ? 'bg-slate-800 border-cyan-500 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className={`font-bold ${ep.method === 'POST' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {ep.method}
                </span>
                <span>{ep.path}</span>
              </button>
            ))}
          </div>

          {/* Authentication Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1">
              <Key className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-400 font-semibold uppercase tracking-wider shrink-0">Bearer Token:</span>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-mono">Headers: Authorization: Bearer &lt;key&gt;</span>
          </div>

          {/* Request / Response Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Request Configuration (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">
                    {currentEndpoint.method} Request: <span className="text-cyan-400 font-mono">{currentEndpoint.path}</span>
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">{currentEndpoint.label}</span>
              </div>

              {currentEndpoint.method === 'POST' ? (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">JSON Request Body:</label>
                  <textarea
                    value={payloads[selectedEndpoint] || ''}
                    onChange={(e) => setPayloads({ ...payloads, [selectedEndpoint]: e.target.value })}
                    rows={12}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 text-xs text-slate-400 space-y-2">
                  <div className="font-semibold text-white">HTTP GET Request:</div>
                  <p>This endpoint does not require a request body. It returns real-time data for the requested resource.</p>
                  <div className="font-mono text-cyan-400 bg-slate-900 p-2.5 rounded border border-slate-800">
                    GET {currentEndpoint.path}
                  </div>
                </div>
              )}

              {/* Action & cURL button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(getCurlSnippet());
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode ? 'Copied cURL!' : 'Copy cURL Command'}</span>
                </button>

                <button
                  disabled={isExecutingRequest}
                  onClick={handleExecuteLiveRequest}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm shadow-cyan-950"
                >
                  <Play className={`w-3.5 h-3.5 ${isExecutingRequest ? 'animate-spin' : ''}`} />
                  <span>{isExecutingRequest ? 'Calling Endpoint...' : 'Execute Live Request'}</span>
                </button>
              </div>
            </div>

            {/* Right: Live Server Response (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Live Server Network Response</h3>
                </div>
                {executionResponse && (
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    executionResponse.status < 300
                      ? 'text-emerald-400 bg-emerald-950 border-emerald-800'
                      : 'text-rose-400 bg-rose-950 border-rose-800'
                  }`}>
                    HTTP {executionResponse.status} ({executionResponse.latency_ms}ms)
                  </span>
                )}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 h-80 overflow-y-auto">
                {executionResponse ? (
                  <pre className={`text-xs font-mono leading-relaxed ${
                    executionResponse.status < 300 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {JSON.stringify(executionResponse.body, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-4">
                    <Terminal className="w-8 h-8 text-slate-700 mb-2" />
                    <span>Click "Execute Live Request" to dispatch an HTTP request to the running server.</span>
                  </div>
                )}
              </div>

              <div className="text-xs font-mono text-slate-400 flex items-center justify-between pt-1">
                <span>Response Format: application/json</span>
                <span className="text-cyan-400">RESTful Architecture</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: API KEY CREDENTIALS */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">API Authentication Keys</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage service-to-service credentials for external CRM tools, data pipelines, and batch telemetry workers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                placeholder="Key label (e.g., Salesforce Integration Agent)..."
                value={newKeyLabel}
                onChange={(e) => setNewKeyLabel(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleCreateNewKey}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Generate New API Key</span>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {generatedKeys.map((item) => (
                <div
                  key={item.key}
                  className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                >
                  <div>
                    <div className="font-bold text-white font-sans">{item.label}</div>
                    <div className="text-cyan-400 text-xs mt-0.5">{item.key}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">{item.date}</span>
                    <button
                      onClick={() => {
                        setApiKey(item.key);
                        navigator.clipboard?.writeText(item.key);
                        alert(`Copied key ${item.key} to clipboard and set as active.`);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors text-xs"
                    >
                      Use Key
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PYTHON PIPELINE CODE */}
      {activeTab === 'python_pipeline' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCode className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-white font-mono">churniq_pipeline.py</h3>
                <p className="text-xs text-slate-400">
                  Scikit-Learn Custom Feature Transformer + KNN Imputation + RobustScaler + XGBClassifier + SHAP TreeExplainer.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Downloading churniq_pipeline.py');
              }}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Pipeline .py</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SERVER.TS SOURCE */}
      {activeTab === 'fastapi_app' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-white font-mono">server.ts (Express & Vite Full-Stack Entry Point)</h3>
                <p className="text-xs text-slate-400">
                  Production REST API service with Bearer token authentication, input validation, and Google Search Grounding.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
