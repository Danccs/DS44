import React, { useState, useEffect, useCallback } from 'react';
import { api } from './lib/api';
import {
  Company,
  User,
  ComplianceScoreSummary,
  ComplianceInboxItem,
  TenantComplianceRequirement,
  PreventiveAction,
  RiskMatrix,
  RiskAssessment,
  Inspection,
  Incident,
  Worker,
  WorkCenter,
  ComplianceDocument,
  Evidence,
  AuditLog,
  IndustryTemplate,
  NotificationItem,
} from './types';
import { Header } from './components/layout/Header';
import { Sidebar, NavView } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ComplianceInboxView } from './components/inbox/ComplianceInboxView';
import { ChecklistView } from './components/compliance/ChecklistView';
import { AuditModeView } from './components/compliance/AuditModeView';
import { MiperView } from './components/miper/MiperView';
import { ActionCenterView } from './components/actions/ActionCenterView';
import { EvidenceVaultView } from './components/evidence/EvidenceVaultView';
import { TrainingsView } from './components/trainings/TrainingsView';
import { InspectionsView } from './components/inspections/InspectionsView';
import { IncidentsView } from './components/incidents/IncidentsView';
import { WorkersView } from './components/workers/WorkersView';
import { WorkCentersView } from './components/organization/WorkCentersView';
import { DocumentsView } from './components/documents/DocumentsView';
import { ReportsView } from './components/reports/ReportsView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { IndustryTemplatesView } from './components/templates/IndustryTemplatesView';
import { CompanySettingsView } from './components/company/CompanySettingsView';
import { OnboardingWizardModal } from './components/onboarding/OnboardingWizardModal';
import { CommandPalette } from './components/common/CommandPalette';
import { PdfGenerator } from './lib/pdfGenerator';
import { ZipExporter } from './lib/zipExporter';
import { Loader2 } from 'lucide-react';

export default function App() {
  // Navigation & User State
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-camila',
    email: 'c.soto@transportesandes.cl',
    name: 'Camila Soto Valenzuela',
    role: 'prevencionista',
    tenantId: 'tenant-andes-spa',
    jobTitle: 'Experto en Prevención de Riesgos',
    active: true,
    createdAt: '2025-01-01',
  });

  // App Data State
  const [company, setCompany] = useState<Company | null>(null);
  const [summary, setSummary] = useState<ComplianceScoreSummary | null>(null);
  const [inboxItems, setInboxItems] = useState<ComplianceInboxItem[]>([]);
  const [requirements, setRequirements] = useState<TenantComplianceRequirement[]>([]);
  const [actions, setActions] = useState<PreventiveAction[]>([]);
  const [matrix, setMatrix] = useState<RiskMatrix | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [templates, setTemplates] = useState<IndustryTemplate[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // UI Modals State
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Initial Data Fetching
  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        companyRes,
        summaryRes,
        inboxRes,
        reqsRes,
        actionsRes,
        matrixRes,
        inspectionsRes,
        incidentsRes,
        workersRes,
        centersRes,
        docsRes,
        evidencesRes,
        logsRes,
        templatesRes,
      ] = await Promise.all([
        api.getCompany(),
        api.getComplianceScore(),
        api.getInbox(),
        api.getRequirements(),
        api.getActions(),
        api.getMiperMatrix(),
        api.getInspections(),
        api.getIncidents(),
        api.getWorkers(),
        api.getWorkCenters(),
        api.getDocuments(),
        api.getEvidences(),
        api.getAuditLogs(),
        api.getIndustryTemplates(),
      ]);

      if (companyRes) setCompany(companyRes);
      if (summaryRes) setSummary(summaryRes);
      if (inboxRes) setInboxItems(inboxRes);
      if (reqsRes) setRequirements(reqsRes);
      if (actionsRes) setActions(actionsRes);
      if (matrixRes) setMatrix(matrixRes);
      if (inspectionsRes) setInspections(inspectionsRes);
      if (incidentsRes) setIncidents(incidentsRes);
      if (workersRes) setWorkers(workersRes);
      if (centersRes) setWorkCenters(centersRes);
      if (docsRes) setDocuments(docsRes);
      if (evidencesRes) setEvidences(evidencesRes);
      if (logsRes) setAuditLogs(logsRes);
      if (templatesRes) setTemplates(templatesRes);

      // Setup initial notifications
      setNotifications([
        {
          id: 'notif-1',
          tenantId: 'tenant-andes-spa',
          userId: 'usr-camila',
          type: 'alert',
          title: '3 Medidas Preventivas Vencidas',
          message: 'Tablero Taller Rancagua requiere regularización inmediata.',
          createdAt: 'Hace 10 min',
          read: false,
        },
        {
          id: 'notif-2',
          tenantId: 'tenant-andes-spa',
          userId: 'usr-camila',
          type: 'warning',
          title: '7 Capacitaciones por Vencer',
          message: 'Conductores requieren renovación de curso de manejo a la defensiva.',
          createdAt: 'Hace 1 hora',
          read: false,
        },
        {
          id: 'notif-3',
          tenantId: 'tenant-andes-spa',
          userId: 'usr-camila',
          type: 'info',
          title: 'Auditoría Automática DS 44 Ejecutada',
          message: 'Score global de cumplimiento calculado en 81%.',
          createdAt: 'Hoy 08:00',
          read: true,
        },
      ]);
    } catch (err) {
      console.error('Error loading DS44 Compliance OS data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme Toggle
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Role Switcher Handler
  const handleSwitchRole = (role: string) => {
    const names: Record<string, string> = {
      prevencionista: 'Camila Soto Valenzuela',
      admin: 'Rodrigo Fuentes Morales',
      supervisor: 'Jorge Alarcón Riquelme',
      responsable: 'Carlos Navarro Pino',
      auditor: 'Inspector DT Valparaíso',
    };
    setCurrentUser({
      id: `usr-${role}`,
      name: names[role] || 'Usuario DS44',
      email: `${role}@transportesandes.cl`,
      role: role as any,
      tenantId: 'tenant-andes-spa',
      jobTitle: role === 'prevencionista' ? 'Prevencionista de Riesgos' : 'Usuario Operacional',
      active: true,
      createdAt: '2025-01-01',
    });
  };

  // Action Handlers
  const handleResolveInboxItem = async (itemId: string) => {
    await api.resolveInboxItem(itemId, 'Resuelto desde Compliance Inbox.');
    setInboxItems((prev) => prev.filter((i) => i.id !== itemId));
    // refresh score
    const res = await api.getComplianceScore();
    if (res) setSummary(res);
  };

  const handleCreateAction = async (data: Partial<PreventiveAction>) => {
    const res = await api.createAction(data);
    if (res) {
      setActions((prev) => [res, ...prev]);
      const summaryRes = await api.getComplianceScore();
      if (summaryRes) setSummary(summaryRes);
    }
  };

  const handleUpdateAction = async (id: string, data: Partial<PreventiveAction>) => {
    const res = await api.updateAction(id, data);
    if (res) {
      setActions((prev) => prev.map((a) => (a.id === id ? res : a)));
      const summaryRes = await api.getComplianceScore();
      if (summaryRes) setSummary(summaryRes);
    }
  };

  const handleVerifyAction = async (id: string, notes: string, status: 'Verified' | 'Rejected') => {
    const res = await api.verifyAction(id, currentUser.name, notes, status);
    if (res) {
      setActions((prev) => prev.map((a) => (a.id === id ? res : a)));
      const summaryRes = await api.getComplianceScore();
      if (summaryRes) setSummary(summaryRes);
    }
  };

  const handleAddMiperAssessment = async (data: any) => {
    const res = await api.addMiperAssessment(data);
    if (res) {
      setMatrix(res);
    }
  };

  const handleCreateMiperVersion = async (versionName: string, changelog: string) => {
    const res = await api.createMiperVersion(versionName, changelog);
    if (res) {
      setMatrix(res);
    }
  };

  const handleCreateInspection = async (data: any) => {
    const res = await api.createInspection(data);
    if (res) {
      setInspections((prev) => [res, ...prev]);
    }
  };

  const handleCreateIncident = async (data: any) => {
    const res = await api.createIncident(data);
    if (res) {
      setIncidents((prev) => [res, ...prev]);
      // refresh inbox and matrix triggers
      const inboxRes = await api.getInbox();
      if (inboxRes) setInboxItems(inboxRes);
    }
  };

  const handleUploadEvidence = async (data: Partial<Evidence>) => {
    const res = await api.uploadEvidence(data);
    if (res) {
      setEvidences((prev) => [res, ...prev]);
    }
  };

  const handleVerifyEvidence = async (id: string) => {
    const res = await api.verifyEvidence(id, currentUser.name);
    if (res) {
      setEvidences((prev) => prev.map((e) => (e.id === id ? res : e)));
    }
  };

  const handleCreateWorker = async (data: any) => {
    const res = await api.createWorker(data);
    if (res) {
      setWorkers((prev) => [res, ...prev]);
    }
  };

  const handleCreateWorkCenter = async (data: any) => {
    const res = await api.createWorkCenter(data);
    if (res) {
      setWorkCenters((prev) => [...prev, res]);
    }
  };

  const handleCreateDocument = async (data: any) => {
    const res = await api.createDocument(data);
    if (res) {
      setDocuments((prev) => [res, ...prev]);
    }
  };

  const handleUpdateCompany = async (data: Partial<Company>) => {
    const res = await api.updateCompany(data);
    if (res) {
      setCompany(res);
    }
  };

  const handleApplyTemplate = async (templateId: string) => {
    await api.applyIndustryTemplate(templateId);
    await loadAllData();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 space-y-4">
        <Loader2 className="w-9 h-9 text-emerald-600 animate-spin" />
        <div className="text-center">
          <p className="font-semibold text-sm text-slate-900">Cargando DS44 Compliance Suite...</p>
          <p className="text-xs text-slate-500 mt-1">
            Calculando matriz de cumplimiento y verificando integridad de evidencias.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 font-sans antialiased">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        notifications={notifications}
        onOpenAuditMode={() => setCurrentView('audit-mode')}
        onOpenQuickAction={() => setCurrentView('actions')}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        onOpenOnboarding={() => setShowOnboarding(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          inboxCount={inboxItems.length}
          overdueCount={actions.filter((a) => a.status === 'Overdue').length}
          criticalRisksCount={
            matrix?.assessments.filter((a) => a.riskLevel === 'Crítico').length || 0
          }
        />

        {/* Dynamic Center Stage Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto pb-6">
            {currentView === 'dashboard' && (
              <DashboardView
                summary={summary}
                inboxItems={inboxItems}
                actions={actions}
                assessments={matrix?.assessments || []}
                company={company}
                onNavigate={setCurrentView}
                onOpenActionModal={() => setCurrentView('actions')}
                onOpenScoreModal={() => {}}
              />
            )}

            {currentView === 'inbox' && (
              <ComplianceInboxView
                items={inboxItems}
                actions={actions}
                onResolveItem={handleResolveInboxItem}
                onUploadEvidenceForAction={() => {
                  setCurrentView('evidence');
                }}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'checklist' && (
              <ChecklistView
                requirements={requirements}
                onOpenEvidenceVault={() => {
                  setCurrentView('evidence');
                }}
              />
            )}

            {currentView === 'audit-mode' && (
              <AuditModeView
                company={company}
                summary={summary}
                requirements={requirements}
                actions={actions}
                evidences={evidences}
              />
            )}

            {currentView === 'miper' && (
              <MiperView
                matrix={matrix}
                company={company}
                workCenters={workCenters}
                onAddAssessment={handleAddMiperAssessment}
                onCreateNewVersion={handleCreateMiperVersion}
              />
            )}

            {currentView === 'actions' && (
              <ActionCenterView
                actions={actions}
                workCenters={workCenters}
                onCreateAction={handleCreateAction}
                onUpdateAction={handleUpdateAction}
                onVerifyAction={handleVerifyAction}
                onOpenEvidenceForAction={() => setCurrentView('evidence')}
              />
            )}

            {currentView === 'evidence' && (
              <EvidenceVaultView
                evidences={evidences}
                requirements={requirements}
                actions={actions}
                onUploadEvidence={handleUploadEvidence}
                onVerifyEvidence={handleVerifyEvidence}
              />
            )}

            {currentView === 'trainings' && (
              <TrainingsView
                trainings={[]}
                workers={workers}
                onCreateTraining={async () => {}}
              />
            )}

            {currentView === 'inspections' && (
              <InspectionsView
                inspections={inspections}
                company={company}
                workCenters={workCenters}
                onCreateInspection={handleCreateInspection}
              />
            )}

            {currentView === 'incidents' && (
              <IncidentsView
                incidents={incidents}
                company={company}
                workCenters={workCenters}
                onCreateIncident={handleCreateIncident}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'workers' && (
              <WorkersView
                workers={workers}
                workCenters={workCenters}
                onCreateWorker={handleCreateWorker}
              />
            )}

            {currentView === 'work-centers' && (
              <WorkCentersView
                workCenters={workCenters}
                onCreateWorkCenter={handleCreateWorkCenter}
              />
            )}

            {currentView === 'documents' && (
              <DocumentsView
                documents={documents}
                onCreateDocument={handleCreateDocument}
              />
            )}

            {currentView === 'reports' && (
              <ReportsView
                company={company}
                summary={summary}
                requirements={requirements}
                actions={actions}
                matrix={matrix}
                inspections={inspections}
                incidents={incidents}
              />
            )}

            {currentView === 'audit-logs' && (
              <AuditLogsView logs={auditLogs} />
            )}

            {currentView === 'templates' && (
              <IndustryTemplatesView
                templates={templates}
                onApplyTemplate={handleApplyTemplate}
              />
            )}

            {currentView === 'company-settings' && (
              <CompanySettingsView
                company={company}
                onUpdateCompany={handleUpdateCompany}
              />
            )}
          </div>
        </main>
      </div>

      {/* Clean Status Bar */}
      <footer className="h-9 border-t border-slate-200 bg-white px-6 flex items-center justify-between text-xs text-slate-500 select-none z-20 shrink-0">
        <div className="flex items-center gap-5 text-[11px]">
          <span className="text-slate-800 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            DS 44 / 2025 • Chile DT
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-500">Modo Auditoría Disponible</span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-500">Bóveda de Evidencias Segura</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Mutual de Seguridad Conectada</span>
        </div>
      </footer>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelectView={setCurrentView}
        onNewAction={() => setCurrentView('actions')}
        onNewEvidence={() => setCurrentView('evidence')}
        onExportPdf={() => {
          if (company && summary) {
            PdfGenerator.generateExecutiveReport(company, summary, requirements, actions);
          }
        }}
        onExportZip={() => {
          if (company && summary) {
            ZipExporter.exportCompliancePack(company, summary, requirements, actions, evidences);
          }
        }}
      />

      {/* Onboarding Diagnostic Wizard */}
      <OnboardingWizardModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => setShowOnboarding(false)}
      />
    </div>
  );
}
