/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Customer, UserRole, RetentionPlaybook, AuditLogEntry, IngestedEvent } from './types/churn';
import { INITIAL_CUSTOMERS, INITIAL_AUDIT_LOGS } from './data/mockCustomers';
import { Navbar } from './components/Navbar';
import { PipelineOverview } from './components/PipelineOverview';
import { DataPreprocessingView } from './components/DataPreprocessingView';
import { ModelBenchmarkingView } from './components/ModelBenchmarkingView';
import { ShapExplorer } from './components/ShapExplorer';
import { Customer360 } from './components/Customer360';
import { RetentionPlaybooks } from './components/RetentionPlaybooks';
import { RealTimeStream } from './components/RealTimeStream';
import { CrmIntegration } from './components/CrmIntegration';
import { StakeholderDashboard } from './components/StakeholderDashboard';
import { RbacAudit } from './components/RbacAudit';
import { ApiExplorer } from './components/ApiExplorer';
import { MarketIntelligence } from './components/MarketIntelligence';
import { QuickIngestModal } from './components/QuickIngestModal';
import { getRiskTier } from './ml/churnEngine';
import { ShieldCheck, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(INITIAL_CUSTOMERS[0].id);
  const [isQuickIngestOpen, setIsQuickIngestOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleCustomerUpdated = (updatedCust: Customer, event: IngestedEvent) => {
    setCustomers(prev => prev.map(c => c.id === updatedCust.id ? updatedCust : c));

    const newAuditLog: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: currentRole === 'admin' ? 'System Administrator' : 'Lead ML Engineer',
      actorRole: currentRole,
      action: 'REALTIME_TELEMETRY_INGEST',
      targetEntity: `${updatedCust.id} (${updatedCust.name})`,
      details: `Ingested ${event.eventType}. Churn probability updated to ${(updatedCust.churnProbability * 100).toFixed(0)}% (${updatedCust.riskTier}).`,
      complianceFlag: 'SOC2_VERIFIED',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);
    showToast(`Real-time event processed: ${updatedCust.name} risk updated to ${(updatedCust.churnProbability * 100).toFixed(0)}%`);
  };

  const handleExecutePlaybook = (playbook: RetentionPlaybook, customer: Customer) => {
    const newAuditLog: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: currentRole === 'retention_specialist' ? 'Marcus Vance (CSM)' : 'System Administrator',
      actorRole: currentRole,
      action: 'PLAYBOOK_TRIGGERED',
      targetEntity: `${customer.id} (${customer.name})`,
      details: `Launched "${playbook.title}". Synced task to Salesforce and notified Account Executive.`,
      complianceFlag: 'SOC2_VERIFIED',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);
    showToast(`Retention Playbook "${playbook.title}" dispatched for ${customer.name}`);
  };

  const handleTriggerCrmSync = (crmName: string) => {
    const newAuditLog: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: 'CRM Synchronization Service',
      actorRole: 'admin',
      action: 'CRM_SYNC_SCHEDULED',
      targetEntity: `${crmName} Integration Hub`,
      details: `Synchronized health scores and top risk drivers for all ${customers.length} monitored accounts.`,
      complianceFlag: 'GDPR_COMPLIANT',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);
    showToast(`Synchronized ${customers.length} customer risk profiles with ${crmName}`);
  };

  const handleApplyMarketModifier = (customerId: string, modifier: number, reason: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newProb = Math.min(0.98, Math.max(0.02, Number((c.churnProbability + modifier).toFixed(2))));
        const newTier = getRiskTier(newProb);
        return {
          ...c,
          churnProbability: newProb,
          riskTier: newTier,
          historicalEvents: [
            {
              date: '2026-09-28',
              event: `${reason} (Risk adjusted to ${(newProb * 100).toFixed(0)}%)`,
              type: modifier > 0 ? 'negative' : 'positive'
            },
            ...(c.historicalEvents || [])
          ]
        };
      }
      return c;
    }));

    const newAuditLog: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: 'Market Intelligence Agent',
      actorRole: 'admin',
      action: 'SCORE_OVERRIDE',
      targetEntity: customerId,
      details: reason,
      complianceFlag: 'SOC2_VERIFIED',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);
    showToast(`External market risk factor applied to ${customerId}`);
  };

  const handleNavigateToCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveTab('customer360');
  };

  const handleNavigateToShap = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveTab('shap');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Bar (Complies with 3-Zone Top Bar Contract) */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenQuickIngest={() => setIsQuickIngestOpen(true)}
      />

      {/* Floating System Toast */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/80 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Quick Ingestion Event Modal */}
      <QuickIngestModal
        isOpen={isQuickIngestOpen}
        onClose={() => setIsQuickIngestOpen(false)}
        customers={customers}
        onCustomerUpdated={handleCustomerUpdated}
      />

      {/* Main Workspace Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {activeTab === 'overview' && (
          <PipelineOverview
            customers={customers}
            onSelectStage={setActiveTab}
            onOpenQuickIngest={() => setIsQuickIngestOpen(true)}
          />
        )}

        {activeTab === 'preprocessing' && (
          <DataPreprocessingView
            customers={customers}
            userRole={currentRole}
          />
        )}

        {activeTab === 'models' && (
          <ModelBenchmarkingView />
        )}

        {activeTab === 'shap' && (
          <ShapExplorer
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={setSelectedCustomerId}
          />
        )}

        {activeTab === 'customer360' && (
          <Customer360
            customers={customers}
            onTriggerPlaybook={(c) => {
              setSelectedCustomerId(c.id);
              setActiveTab('retention');
            }}
            onNavigateToShap={handleNavigateToShap}
          />
        )}

        {activeTab === 'retention' && (
          <RetentionPlaybooks
            customers={customers}
            selectedCustomer={customers.find(c => c.id === selectedCustomerId)}
            onExecutePlaybook={handleExecutePlaybook}
            userRole={currentRole}
          />
        )}

        {activeTab === 'realtime' && (
          <RealTimeStream
            customers={customers}
            onCustomerUpdated={handleCustomerUpdated}
          />
        )}

        {activeTab === 'crm' && (
          <CrmIntegration
            customers={customers}
            onTriggerSync={handleTriggerCrmSync}
          />
        )}

        {activeTab === 'market' && (
          <MarketIntelligence
            customers={customers}
            onApplyMarketModifier={handleApplyMarketModifier}
            onNavigateToCrm={() => setActiveTab('crm')}
          />
        )}

        {activeTab === 'dashboard' && (
          <StakeholderDashboard
            customers={customers}
            onNavigateToCustomer={handleNavigateToCustomer}
          />
        )}

        {activeTab === 'audit' && (
          <RbacAudit
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            auditLogs={auditLogs}
          />
        )}

        {activeTab === 'api' && (
          <ApiExplorer customers={customers} />
        )}
      </main>

      {/* Subtle, uncluttered footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-400">ChurnIQ</span>
          <span>·</span>
          <span>Customer Churn Prediction & Explainable AI</span>
          <span>·</span>
          <span className="font-mono">Python / Scikit-Learn / XGBoost / SHAP / FastAPI</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SOC-2 Type II Certified</span>
          </span>
          <span>·</span>
          <button
            onClick={() => setActiveTab('api')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive API Docs</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
