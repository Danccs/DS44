import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FolderLock,
  GraduationCap,
  Sparkles,
  Info,
  Calendar,
  ExternalLink,
  Activity,
  Radio,
  Crosshair,
  Terminal,
} from 'lucide-react';
import {
  ComplianceScoreSummary,
  ComplianceInboxItem,
  PreventiveAction,
  RiskAssessment,
  Company,
} from '../../types';
import { ActionStatusBadge, PriorityBadge, RiskBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface DashboardViewProps {
  summary: ComplianceScoreSummary | null;
  inboxItems: ComplianceInboxItem[];
  actions: PreventiveAction[];
  assessments: RiskAssessment[];
  company: Company | null;
  onNavigate: (view: any) => void;
  onOpenActionModal: (action: PreventiveAction) => void;
  onOpenScoreModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  inboxItems,
  actions,
  assessments,
  company,
  onNavigate,
  onOpenActionModal,
  onOpenScoreModal,
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const score = summary?.overallScore ?? 81;
  const overdueActions = actions.filter((a) => a.status === 'Overdue');
  const criticalAssessments = assessments.filter((a) => a.riskLevel === 'Crítico');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Status & Legal Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200/80">
              Decreto Supremo N.º 44 / 2025
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Vigencia Plena • Fiscalización DT y Seremi de Salud
            </span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Panel de Mando Preventivo — <span>{company?.legalName || 'Transportes Andes SpA'}</span>
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Supervisión integral de la matriz de riesgos MIPER, programa preventivo anual y evidencias documentales con valor legal vinculante.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => onNavigate('inbox')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-98"
          >
            <span>Compliance Inbox</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-white/20 text-white rounded font-bold">
              {inboxItems.length}
            </span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Compliance Score */}
        <div
          onClick={() => setShowFormulaModal(true)}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Cumplimiento DS 44
              </p>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-3xl font-bold tracking-tight text-slate-900">
                  {score}%
                </span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +4%
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 flex items-center justify-between">
            <span>{summary?.compliantCount || 8} de {summary?.totalApplicableRequirements || 12} obligaciones OK</span>
            <span className="text-emerald-700 font-semibold group-hover:underline">Ver fórmula →</span>
          </p>
        </div>

        {/* Metric 2: Overdue Actions */}
        <div
          onClick={() => onNavigate('actions')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                Medidas Vencidas
              </p>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-3xl font-bold tracking-tight text-rose-600">
                  {summary?.overdueActionsCount ?? overdueActions.length}
                </span>
                <span className="text-xs text-rose-700 font-bold bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                  Atención Inmediata
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center font-bold shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-2.5 group-hover:underline flex items-center justify-between">
            <span>Riesgo en faenas activas</span>
            <span>Resolver →</span>
          </p>
        </div>

        {/* Metric 3: Expiring Trainings */}
        <div
          onClick={() => onNavigate('trainings')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Capacitaciones & ODI
              </p>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-3xl font-bold tracking-tight text-slate-900">
                  {summary?.expiringTrainingsCount ?? 7}
                </span>
                <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                  Próx. 30 días
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold shadow-2xs">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }} />
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-2.5 group-hover:underline flex items-center justify-between">
            <span>Conducción y Salud</span>
            <span>Programar →</span>
          </p>
        </div>

        {/* Metric 4: MIPER Status */}
        <div
          onClick={() => onNavigate('miper')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Matriz MIPER (5x5)
              </p>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  v2 Vigente
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold">
                  Aprobada
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold shadow-2xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2.5 group-hover:underline flex items-center justify-between">
            <span>{criticalAssessments.length} riesgos críticos identificados</span>
            <span>Ver matriz →</span>
          </p>
        </div>
      </div>

      {/* Critical Alert Callout */}
      <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
              Atención Preventiva: 3 Medidas Vencidas + 1 Trigger de Accidente
            </h4>
            <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
              Un score de 81% no exime de sanción en riesgos críticos. Regularice las protecciones eléctricas de Taller Rancagua y la reevaluación MIPER por accidente en Puerto Valparaíso.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('inbox')}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shrink-0 transition-all shadow-xs"
        >
          Resolver en Inbox
        </button>
      </div>

      {/* 2-Column Split: Prioridades de Hoy & Category Fulfillment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Prioridades de Hoy */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Prioridades de Hoy (Compliance Inbox)</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                  {inboxItems.length} pendientes
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ordenado por criticidad regulatoria, fecha de vencimiento y falta de evidencia verificada.
              </p>
            </div>
            <button
              onClick={() => onNavigate('inbox')}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {inboxItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${
                        item.severity === 'critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.severity === 'critical' ? '🔴 Crítica' : '🟡 Atención'}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                    <span>Responsable: <strong className="text-slate-800 font-medium">{item.responsible}</strong></span>
                    <span>Vencimiento: <strong className="text-rose-600 font-medium">{item.dueDate}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('actions')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg shrink-0 transition-all"
                >
                  {item.quickActionLabel}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Score by DS44 Category Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Cumplimiento por Materia
            </h3>
            <button
              onClick={() => onNavigate('checklist')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Ver Checklist →
            </button>
          </div>

          <div className="p-4.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3.5">
            {[
              { label: 'MIPER & Identificación de Peligros', score: 100, status: 'Conforme' },
              { label: 'Programa de Trabajo Preventivo', score: 85, status: 'En Ejecución' },
              { label: 'Obligación de Informar (ODI)', score: 90, status: '1 Pendiente' },
              { label: 'Plan de Capacitación DS44', score: 75, status: '7 por vencer' },
              { label: 'Comité Paritario (CPHS > 25 trab.)', score: 100, status: 'Constituido' },
              { label: 'Inspecciones y Observaciones', score: 75, status: '2 Hallazgos' },
              { label: 'Investigación de Accidentes', score: 80, status: '1 Cerrado' },
              { label: 'Salud Ocupacional & Vigilancia', score: 60, status: 'Exámenes Pend.' },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium truncate max-w-[190px]">
                    {cat.label}
                  </span>
                  <span className="font-bold text-slate-900">{cat.score}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cat.score >= 85
                        ? 'bg-emerald-500'
                        : cat.score >= 70
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formula Transparency Modal */}
      <Modal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
        title="Algoritmo de Compliance Score DS 44"
        subtitle="Cálculo transparente y auditable conforme al Decreto Supremo N.º 44"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <p className="leading-relaxed">
            El porcentaje de cumplimiento se calcula ponderando cada una de las 12 obligaciones aplicables de la empresa según su peso normativo y estado de evidencias verificadas:
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs leading-relaxed text-slate-800 text-center font-semibold">
            ComplianceScore = ( Σ [ Peso_i × NivelCumplimiento_i ] / Σ [ Peso_i ] ) × 100
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-900">Criterios de Valoración:</h5>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
              <li><strong className="text-slate-900">Conforme (100%):</strong> Requisito vigente con evidencia documental o fotográfica formalmente verificada por el prevencionista.</li>
              <li><strong className="text-slate-900">Parcial (50% - 90%):</strong> Acciones en ejecución con avance comprobable, pero con tareas o evidencias pendientes de cierre.</li>
              <li><strong className="text-slate-900">No Conforme (0%):</strong> Requisito exigible sin acciones iniciadas o con medidas preventivas vencidas.</li>
            </ul>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
            <strong>Principio de Rigor:</strong> El sistema advierte y bloquea la aprobación de auditoría si existen medidas de prioridad crítica vencidas, aun cuando el promedio general sea alto.
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setShowFormulaModal(false)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
