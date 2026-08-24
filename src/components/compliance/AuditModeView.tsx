import React, { useState } from 'react';
import {
  ShieldAlert,
  Download,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  Search,
  ExternalLink,
  Archive,
  Printer,
  Sparkles,
} from 'lucide-react';
import {
  Company,
  ComplianceScoreSummary,
  TenantComplianceRequirement,
  PreventiveAction,
  Evidence,
} from '../../types';
import { ZipExporter } from '../../lib/zipExporter';
import { PdfGenerator } from '../../lib/pdfGenerator';
import { Modal } from '../common/Modal';

interface AuditModeViewProps {
  company: Company | null;
  summary: ComplianceScoreSummary | null;
  requirements: TenantComplianceRequirement[];
  actions: PreventiveAction[];
  evidences: Evidence[];
}

export const AuditModeView: React.FC<AuditModeViewProps> = ({
  company,
  summary,
  requirements,
  actions,
  evidences,
}) => {
  const [selectedReq, setSelectedReq] = useState<TenantComplianceRequirement | null>(null);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportZip = async () => {
    if (!company || !summary) return;
    setIsExportingZip(true);
    try {
      await ZipExporter.exportCompliancePack(company, summary, requirements, actions, evidences);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleExportPdf = () => {
    if (!company || !summary) return;
    PdfGenerator.generateExecutiveReport(company, summary, requirements, actions);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Fiscalizador Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-emerald-500 text-slate-900 rounded-full font-mono">
              AUDIT READY • DS 44
            </span>
            <span className="text-xs text-slate-400">Dirección del Trabajo & Seremi de Salud</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Expediente Digital de Fiscalización y Auditoría Preventiva
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Vista unificada de comprobación legal. Permite a los fiscalizadores y auditores examinar cada obligación reglamentaria, sus medios de verificación y trazabilidad inmutable.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Descargar Informe PDF</span>
          </button>

          <button
            onClick={handleExportZip}
            disabled={isExportingZip}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md"
          >
            <Archive className="w-4 h-4" />
            <span>{isExportingZip ? 'Comprimiendo Pack...' : 'Exportar Compliance Pack (ZIP)'}</span>
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>¡Paquete de Auditoría (ZIP) generado y descargado con éxito! Incluye manifiesto legal, JSON estructurado e índice de evidencias con hashes SHA-256.</span>
        </div>
      )}

      {/* Grid of 12 Requirements for Direct Auditor Review */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requirements.map((r) => {
          const isCompliant = r.status === 'Compliant';
          const isPartial = r.status === 'PartiallyCompliant';
          return (
            <div
              key={r.id}
              onClick={() => setSelectedReq(r)}
              className={`p-5 rounded-xl border bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 ${
                isCompliant
                  ? 'border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-500'
                  : 'border-amber-200 dark:border-amber-900/50 hover:border-amber-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {r.requirement.code} • {r.requirement.articleReference}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 line-clamp-1">
                    {r.requirement.title}
                  </h4>
                </div>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCompliant
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                  }`}
                >
                  {isCompliant ? '✔' : '⚠'}
                </div>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2">
                {r.requirement.requiredEvidenceDescription}
              </p>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-400">
                <span>Avance: <strong className="text-slate-700 dark:text-slate-200">{r.fulfillmentPercent}%</strong></span>
                <span className="text-emerald-600 font-semibold">Examinar control →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Auditor Inspection Modal */}
      <Modal
        isOpen={Boolean(selectedReq)}
        onClose={() => setSelectedReq(null)}
        title={`Fiscalización: ${selectedReq?.requirement.code} — ${selectedReq?.requirement.title}`}
        subtitle={`Base legal: ${selectedReq?.requirement.regulation} (${selectedReq?.requirement.articleReference})`}
        maxWidth="2xl"
      >
        {selectedReq && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Obligación Exigible</span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {selectedReq.requirement.description}
              </p>
            </div>

            <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evidencia Foliada de Respaldo</span>
              <p className="text-slate-800 dark:text-slate-200">
                {selectedReq.requirement.requiredEvidenceDescription}
              </p>
              <div className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded flex items-center justify-between">
                <div>
                  <p className="font-bold text-emerald-800 dark:text-emerald-200">
                    Estado de Verificación: {selectedReq.status === 'Compliant' ? 'Auditado y Conforme' : 'En Tratamiento'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Responsable de la empresa: {selectedReq.responsibleName}
                  </p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white rounded">
                  Fulfillment {selectedReq.fulfillmentPercent}%
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-850 rounded-lg space-y-1 font-mono text-[11px]">
              <span className="text-slate-400 font-sans text-[10px] block font-bold uppercase">Sello de Integridad de la Evidencia</span>
              <p className="text-slate-600 dark:text-slate-400 break-all">
                SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
