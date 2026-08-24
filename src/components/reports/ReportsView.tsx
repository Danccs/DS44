import React from 'react';
import {
  FileSignature,
  Download,
  FileCheck,
  FileSpreadsheet,
  CalendarCheck,
  SearchCheck,
  AlertOctagon,
  Shield,
  Printer,
  Sparkles,
} from 'lucide-react';
import {
  Company,
  ComplianceScoreSummary,
  TenantComplianceRequirement,
  PreventiveAction,
  RiskMatrix,
  Inspection,
  Incident,
} from '../../types';
import { PdfGenerator } from '../../lib/pdfGenerator';

interface ReportsViewProps {
  company: Company | null;
  summary: ComplianceScoreSummary | null;
  requirements: TenantComplianceRequirement[];
  actions: PreventiveAction[];
  matrix: RiskMatrix | null;
  inspections: Inspection[];
  incidents: Incident[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  company,
  summary,
  requirements,
  actions,
  matrix,
  inspections,
  incidents,
}) => {
  if (!company || !summary) return null;

  const handleDownloadExecutive = () => {
    PdfGenerator.generateExecutiveReport(company, summary, requirements, actions);
  };

  const handleDownloadMiper = () => {
    if (!matrix) return;
    PdfGenerator.generateMiperReport(company, matrix);
  };

  const handleDownloadInspection = () => {
    if (inspections.length > 0) {
      PdfGenerator.generateInspectionReport(company, inspections[0]);
    }
  };

  const handleDownloadIncident = () => {
    if (incidents.length > 0) {
      PdfGenerator.generateIncidentReport(company, incidents[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Centro de Emisión de Informes Oficiales DS 44
          </h2>
          <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full font-mono">
            PDF / AutoTable
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Generación instantánea de reportes ejecutivos, matrices de riesgo, actas de fiscalización y fichas de investigación formal con firma de prevencionista y gerencia.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Report 1: Executive Compliance Report */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Informe Ejecutivo de Cumplimiento DS 44
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Documento integral con el Compliance Score ({summary.overallScore}%), estado de los 12 requisitos reglamentarios, brechas detectadas, prioridades críticas y plan de medidas preventivas para Gerencia y Mutualidad.
            </p>
          </div>
          <button
            onClick={handleDownloadExecutive}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Generar Informe Ejecutivo PDF</span>
          </button>
        </div>

        {/* Report 2: MIPER Matrix */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Matriz MIPER Oficial en Formato Apaisado (Landscape)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Sábana oficial de peligros y evaluación 5x5 con desglose de puestos de trabajo, factores de riesgo, controles existentes y medidas de control jerarquizadas v{matrix?.currentVersion || 2}.
            </p>
          </div>
          <button
            onClick={handleDownloadMiper}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Matriz MIPER Oficial PDF</span>
          </button>
        </div>

        {/* Report 3: Inspection Report */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <SearchCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Acta de Inspección Preventiva en Terreno
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pauta técnica con registro de respuestas de checklist, condiciones subestándar y medidas correctivas generadas para el supervisor.
            </p>
          </div>
          <button
            onClick={handleDownloadInspection}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Última Inspección PDF</span>
          </button>
        </div>

        {/* Report 4: Incident Investigation */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-rose-500 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Informe de Investigación de Accidente / Incidente
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Expediente causal con número DIAT, análisis de causas inmediatas/básicas y vinculación a reevaluación de la matriz de riesgos.
            </p>
          </div>
          <button
            onClick={handleDownloadIncident}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Informe de Accidente PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
