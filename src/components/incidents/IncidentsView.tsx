import React, { useState } from 'react';
import {
  AlertOctagon,
  Plus,
  AlertTriangle,
  FileText,
  Calendar,
  Building2,
  Download,
  Eye,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { Incident, Company, WorkCenter } from '../../types';
import { Modal } from '../common/Modal';
import { PdfGenerator } from '../../lib/pdfGenerator';

interface IncidentsViewProps {
  incidents: Incident[];
  company: Company | null;
  workCenters: WorkCenter[];
  onCreateIncident: (data: any) => Promise<void>;
  onNavigate: (view: any) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  company,
  workCenters,
  onCreateIncident,
  onNavigate,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Form State
  const [formCenter, setFormCenter] = useState(workCenters[0]?.id || 'wc-valparaiso');
  const [formType, setFormType] = useState<Incident['type']>('Accidente del Trabajo');
  const [formSeverity, setFormSeverity] = useState<Incident['severity']>('Con Tiempo Perdido (CTP)');
  const [formDate, setFormDate] = useState('2025-02-14');
  const [formTime, setFormTime] = useState('11:30');
  const [formLocation, setFormLocation] = useState('Andén 2 - Patio de Carga');
  const [formWorker, setFormWorker] = useState('Héctor Muñoz Contreras');
  const [formPosition, setFormPosition] = useState('Conductor de Transporte');
  const [formDesc, setFormDesc] = useState('');
  const [formDirectCauses, setFormDirectCauses] = useState('');
  const [formRootCauses, setFormRootCauses] = useState('');
  const [formDiat, setFormDiat] = useState('DIAT-2025-09812');
  const [formDaysLost, setFormDaysLost] = useState('4');

  const handleDownloadPdf = (inc: Incident) => {
    if (!company) return;
    PdfGenerator.generateIncidentReport(company, inc);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const wc = workCenters.find((w) => w.id === formCenter);
    await onCreateIncident({
      workCenterId: formCenter,
      workCenterName: wc?.name || 'Centro Operacional',
      exactLocation: formLocation,
      type: formType,
      severity: formSeverity,
      incidentDate: formDate,
      incidentTime: formTime,
      involvedWorkerName: formWorker,
      involvedWorkerPosition: formPosition,
      description: formDesc,
      immediateActionsTaken: 'Traslado a centro de atención Mutualidad, suspensión temporal de maniobra.',
      directCauses: formDirectCauses.split(',').map((s) => s.trim()).filter(Boolean),
      rootCauses: formRootCauses.split(',').map((s) => s.trim()).filter(Boolean),
      reportedToMutualidad: true,
      diatNumber: formDiat,
      daysLost: Number(formDaysLost),
      requiresMiperRevision: true,
    });

    setShowCreateModal(false);
    setFormDesc('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Investigación de Accidentes e Incidentes DS 44
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 rounded-full font-mono">
              {incidents.length} Registros
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión técnica conforme al Art. 8 del DS 44. Cada investigación genera medidas correctivas vinculadas y dispara la revisión de la matriz MIPER.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Reportar Accidente / Incidente</span>
        </button>
      </div>

      {/* Incident List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 block">{inc.code}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{inc.type}</h4>
                <p className="text-xs text-slate-500">{inc.workCenterName} • {inc.exactLocation}</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-50 text-rose-700 border border-rose-200">
                {inc.severity}
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
              {inc.description}
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg space-y-1 text-xs">
              <p>Trabajador: <strong>{inc.involvedWorkerName}</strong> ({inc.involvedWorkerPosition})</p>
              <p>DIAT Mutualidad: <strong>{inc.diatNumber || 'Registrada'}</strong> (Días perdidos: {inc.daysLost})</p>
              <p>Fecha & Hora: <strong>{inc.incidentDate} {inc.incidentTime}</strong></p>
            </div>

            {inc.requiresMiperRevision && (
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
                <span>⚠ Reevaluación obligatoria de MIPER activada</span>
                <button
                  onClick={() => onNavigate('miper')}
                  className="font-bold underline hover:text-amber-900"
                >
                  Ir a MIPER →
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedIncident(inc)}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Ver Árbol de Causas
              </button>
              <button
                onClick={() => handleDownloadPdf(inc)}
                className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Descargar Informe PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Formulario de Investigación de Accidente / Incidente"
        subtitle="Registro oficial de investigación causal exigido por el DS 44 Art. 8"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
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
              <label className="block font-semibold mb-1">Tipo de Evento:</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Accidente del Trabajo">Accidente del Trabajo</option>
                <option value="Accidente de Trayecto">Accidente de Trayecto</option>
                <option value="Incidente Peligroso">Incidente Peligroso (Cuasi-accidente)</option>
                <option value="Enfermedad Profesional">Sospecha de Enfermedad Profesional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Gravedad:</label>
              <select
                value={formSeverity}
                onChange={(e) => setFormSeverity(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Sin Tiempo Perdido (STP)">Sin Tiempo Perdido (STP)</option>
                <option value="Con Tiempo Perdido (CTP)">Con Tiempo Perdido (CTP)</option>
                <option value="Grave (Art. 76 Ley 16.744)">Grave (Art. 76)</option>
                <option value="Fatal">Fatal</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Fecha del Evento:</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Hora:</label>
              <input
                type="time"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Trabajador Afectado:</label>
              <input
                required
                type="text"
                placeholder="Nombre completo..."
                value={formWorker}
                onChange={(e) => setFormWorker(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Cargo / Función:</label>
              <input
                type="text"
                value={formPosition}
                onChange={(e) => setFormPosition(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Descripción Circunstancial del Hecho:</label>
            <textarea
              rows={2}
              required
              placeholder="Qué estaba haciendo el trabajador, cómo ocurrió el accidente y qué parte del cuerpo resultó lesionada..."
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Causas Inmediatas (Actos y Condiciones):</label>
              <input
                type="text"
                placeholder="Superficie resbalosa, no uso de guantes..."
                value={formDirectCauses}
                onChange={(e) => setFormDirectCauses(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Causas Básicas (Factores del Trabajo/Personales):</label>
              <input
                type="text"
                placeholder="Falta de procedimiento, diseño de área..."
                value={formRootCauses}
                onChange={(e) => setFormRootCauses(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-xs"
            >
              Registrar Investigación
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
        title={selectedIncident ? `${selectedIncident.code}: ${selectedIncident.type}` : ''}
        subtitle={selectedIncident ? `Investigación formal — ${selectedIncident.involvedWorkerName}` : ''}
      >
        {selectedIncident && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100">Descripción del Suceso:</span>
              <p className="text-slate-700 dark:text-slate-300">{selectedIncident.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Causas Inmediatas:</span>
                {selectedIncident.directCauses.map((c, i) => (
                  <p key={i} className="text-slate-600 dark:text-slate-400">• {c}</p>
                ))}
              </div>
              <div className="p-3 border rounded-lg border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Causas Raíz:</span>
                {selectedIncident.rootCauses.map((c, i) => (
                  <p key={i} className="text-slate-600 dark:text-slate-400">• {c}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
