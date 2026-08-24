import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  History,
  Download,
  Filter,
  Search,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Shield,
  Layers,
} from 'lucide-react';
import { RiskMatrix, RiskAssessment, Company, WorkCenter } from '../../types';
import { RiskBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { PdfGenerator } from '../../lib/pdfGenerator';

interface MiperViewProps {
  matrix: RiskMatrix | null;
  company: Company | null;
  workCenters: WorkCenter[];
  onAddAssessment: (data: any) => Promise<void>;
  onCreateNewVersion: (versionName: string, changelog: string) => Promise<void>;
}

export const MiperView: React.FC<MiperViewProps> = ({
  matrix,
  company,
  workCenters,
  onAddAssessment,
  onCreateNewVersion,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<number>(matrix?.currentVersion || 2);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [centerFilter, setCenterFilter] = useState<string>('ALL');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  // Form State
  const [formCenter, setFormCenter] = useState(workCenters[0]?.id || 'wc-santiago');
  const [formProcess, setFormProcess] = useState('');
  const [formActivity, setFormActivity] = useState('');
  const [formJobPosition, setFormJobPosition] = useState('');
  const [formHazard, setFormHazard] = useState('');
  const [formCategory, setFormCategory] = useState<'Físico' | 'Químico' | 'Biológico' | 'Ergonómico' | 'Psicosocial' | 'Mecánico' | 'Eléctrico' | 'Locativo' | 'Tránsito'>('Tránsito');
  const [formRiskDesc, setFormRiskDesc] = useState('');
  const [formExposed, setFormExposed] = useState('1');
  const [formProb, setFormProb] = useState('3');
  const [formCons, setFormCons] = useState('3');
  const [formControls, setFormControls] = useState('');
  const [formAdditional, setFormAdditional] = useState('');
  const [formResponsible, setFormResponsible] = useState('Camila Soto Valenzuela');
  const [formTargetDate, setFormTargetDate] = useState('2025-04-30');

  // New Version Form
  const [verName, setVerName] = useState('');
  const [verChangelog, setVerChangelog] = useState('');

  const assessments = matrix?.assessments || [];

  const filtered = assessments.filter((a) => {
    const s = (search || '').toLowerCase();
    const matchesSearch =
      (a.hazardName || '').toLowerCase().includes(s) ||
      (a.process || '').toLowerCase().includes(s) ||
      (a.jobPosition || '').toLowerCase().includes(s) ||
      (a.riskDescription || '').toLowerCase().includes(s);
    const matchesLevel = levelFilter === 'ALL' || a.riskLevel === levelFilter;
    const matchesCenter = centerFilter === 'ALL' || a.workCenterId === centerFilter;
    return matchesSearch && matchesLevel && matchesCenter;
  });

  const handleDownloadPdf = () => {
    if (!company || !matrix) return;
    PdfGenerator.generateMiperReport(company, matrix);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const wc = workCenters.find((w) => w.id === formCenter);
    await onAddAssessment({
      workCenterId: formCenter,
      workCenterName: wc?.name || 'Centro Principal',
      process: formProcess,
      activity: formActivity,
      jobPosition: formJobPosition,
      hazardName: formHazard,
      hazardCategory: formCategory,
      riskDescription: formRiskDesc,
      exposedCount: Number(formExposed),
      probability: Number(formProb),
      consequence: Number(formCons),
      existingControls: formControls.split(',').map((s) => s.trim()).filter(Boolean),
      additionalMeasures: formAdditional.split(',').map((s) => s.trim()).filter(Boolean),
      responsibleName: formResponsible,
      targetDate: formTargetDate,
    });
    setShowAddModal(false);
  };

  const handleVersionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateNewVersion(verName || `MIPER Revisión v${(matrix?.currentVersion || 1) + 1}`, verChangelog);
    setShowVersionModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Matriz de Identificación de Peligros y Evaluación de Riesgos (MIPER)
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full font-mono">
              Versión {matrix?.currentVersion || 2} Vigente
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Instrumento preventivo fundamental regulado por el DS 44 Art. 5 para la gestión jerarquizada de controles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMethodologyModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Metodología (5x5)
          </button>
          <button
            onClick={() => setShowVersionModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5" />
            <span>Versionar</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar PDF</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Peligro</span>
          </button>
        </div>
      </div>

      {/* Version & Metric Summary Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Riesgos Críticos</span>
          <span className="text-xl font-black text-rose-600">
            {assessments.filter((a) => a.riskLevel === 'Crítico').length}
          </span>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Riesgos Altos</span>
          <span className="text-xl font-black text-orange-600">
            {assessments.filter((a) => a.riskLevel === 'Alto').length}
          </span>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Riesgos Medios</span>
          <span className="text-xl font-black text-amber-600">
            {assessments.filter((a) => a.riskLevel === 'Medio').length}
          </span>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Riesgos Bajos</span>
          <span className="text-xl font-black text-emerald-600">
            {assessments.filter((a) => a.riskLevel === 'Bajo').length}
          </span>
        </div>
      </div>

      {/* Search & Fast Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar peligro, puesto, proceso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={centerFilter}
            onChange={(e) => setCenterFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="ALL">Todos los Centros</option>
            {workCenters.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="ALL">Todos los Niveles</option>
            <option value="Crítico">Crítico</option>
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
          </select>
        </div>
      </div>

      {/* MIPER Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Centro / Proceso</th>
                <th className="py-3 px-4">Puesto de Trabajo</th>
                <th className="py-3 px-4">Peligro & Descripción</th>
                <th className="py-3 px-3 text-center">P</th>
                <th className="py-3 px-3 text-center">C</th>
                <th className="py-3 px-3 text-center">MR</th>
                <th className="py-3 px-4">Nivel de Riesgo</th>
                <th className="py-3 px-4">Medidas de Control</th>
                <th className="py-3 px-4">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{a.workCenterName}</p>
                    <p className="text-[10px] text-slate-400">{a.process} • {a.activity}</p>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {a.jobPosition}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mr-1.5">
                      {a.hazardCategory}
                    </span>
                    <strong className="text-slate-900 dark:text-slate-100">{a.hazardName}</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">{a.riskDescription}</p>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                    {a.probability}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                    {a.consequence}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-slate-100">
                    {a.riskScore}
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={a.riskLevel} />
                  </td>
                  <td className="py-3 px-4 max-w-xs space-y-0.5 text-[11px]">
                    {a.existingControls.map((c, i) => (
                      <p key={i} className="text-slate-600 dark:text-slate-400">• {c}</p>
                    ))}
                    {a.additionalMeasures.map((m, i) => (
                      <p key={i} className="text-emerald-700 dark:text-emerald-400 font-semibold">• [Plan]: {m}</p>
                    ))}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                    {a.responsibleName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Assessment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Incorporar Peligro a la MIPER"
        subtitle="Evaluación de riesgo conforme a metodología formal DS 44"
        maxWidth="2xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Centro de Trabajo:</label>
              <select
                value={formCenter}
                onChange={(e) => setFormCenter(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {workCenters.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Puesto de Trabajo:</label>
              <input
                required
                type="text"
                placeholder="Ej. Conductor, Mecánico..."
                value={formJobPosition}
                onChange={(e) => setFormJobPosition(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Proceso Operacional:</label>
              <input
                required
                type="text"
                placeholder="Ej. Transporte Carretero"
                value={formProcess}
                onChange={(e) => setFormProcess(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Actividad Específica:</label>
              <input
                required
                type="text"
                placeholder="Ej. Conducción nocturna"
                value={formActivity}
                onChange={(e) => setFormActivity(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold mb-1">Nombre del Peligro:</label>
              <input
                required
                type="text"
                placeholder="Ej. Colisión por fatiga o exceso de velocidad"
                value={formHazard}
                onChange={(e) => setFormHazard(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Categoría:</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Tránsito">Tránsito</option>
                <option value="Físico">Físico</option>
                <option value="Mecánico">Mecánico</option>
                <option value="Químico">Químico</option>
                <option value="Locativo">Locativo</option>
                <option value="Ergonómico">Ergonómico</option>
                <option value="Psicosocial">Psicosocial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Descripción del Riesgo y Consecuencias Potenciales:</label>
            <textarea
              rows={2}
              value={formRiskDesc}
              onChange={(e) => setFormRiskDesc(e.target.value)}
              placeholder="Describa cómo puede ocurrir el evento y qué daño causaría..."
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div>
              <label className="block font-semibold mb-1">Probabilidad (1 a 5):</label>
              <select
                value={formProb}
                onChange={(e) => setFormProb(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="1">1 - Muy Baja</option>
                <option value="2">2 - Baja</option>
                <option value="3">3 - Media</option>
                <option value="4">4 - Alta</option>
                <option value="5">5 - Muy Alta</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Consecuencia (1 a 5):</label>
              <select
                value={formCons}
                onChange={(e) => setFormCons(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="1">1 - Insignificante</option>
                <option value="2">2 - Menor (STP)</option>
                <option value="3">3 - Moderada (CTP)</option>
                <option value="4">4 - Grave / Invalidez</option>
                <option value="5">5 - Catastrófica / Fatal</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Magnitud Calculada:</label>
              <div className="p-2 text-center font-mono font-bold text-sm bg-white dark:bg-slate-900 border rounded-lg">
                MR = {Number(formProb) * Number(formCons)}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Controles Existentes (separados por coma):</label>
            <input
              type="text"
              placeholder="Capacitación ODI, uso de EPP, procedimiento seguro..."
              value={formControls}
              onChange={(e) => setFormControls(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Medidas Adicionales a Implementar:</label>
            <input
              type="text"
              placeholder="Instalar sensor, plan de pausas obligatorias..."
              value={formAdditional}
              onChange={(e) => setFormAdditional(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
            >
              Guardar en MIPER
            </button>
          </div>
        </form>
      </Modal>

      {/* Versioning Modal */}
      <Modal
        isOpen={showVersionModal}
        onClose={() => setShowVersionModal(false)}
        title="Crear Nueva Versión de MIPER"
        subtitle="Versionamiento inmutable con preservación de antecedentes históricos"
      >
        <form onSubmit={handleVersionSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Nombre de la Nueva Versión:</label>
            <input
              type="text"
              placeholder={`MIPER Actualizada v${(matrix?.currentVersion || 1) + 1}`}
              value={verName}
              onChange={(e) => setVerName(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Motivo / Bitácora de Cambios (Changelog):</label>
            <textarea
              rows={3}
              required
              placeholder="Describa el motivo de la actualización (ej. auditoría anual, accidente registrado, cambio de procesos)..."
              value={verChangelog}
              onChange={(e) => setVerChangelog(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowVersionModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
            >
              Aprobar y Emitir Nueva Versión
            </button>
          </div>
        </form>
      </Modal>

      {/* Methodology Modal */}
      <Modal
        isOpen={showMethodologyModal}
        onClose={() => setShowMethodologyModal(false)}
        title="Metodología de Evaluación de Riesgos (5x5)"
        subtitle="Parámetros y criterios de clasificación DS 44"
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            La matriz evalúa la <strong>Magnitud del Riesgo (MR = P × C)</strong> cruzando la Probabilidad de ocurrencia con la Severidad o Consecuencia máxima previsible:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg">
              <strong>Bajo (1 a 4):</strong> Riesgo Aceptable. Mantener controles operacionales habituales.
            </div>
            <div className="p-3 bg-amber-50 text-amber-800 rounded-lg">
              <strong>Medio (5 a 9):</strong> Riesgo Moderado. Planificar mejoras preventivas periódicas.
            </div>
            <div className="p-3 bg-orange-50 text-orange-800 rounded-lg">
              <strong>Alto (10 a 16):</strong> No Aceptable. Medidas de control obligatorias a corto plazo.
            </div>
            <div className="p-3 bg-rose-50 text-rose-800 rounded-lg">
              <strong>Crítico (17 a 25):</strong> Intolerable. Detener o mitigar actividad antes de continuar.
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
