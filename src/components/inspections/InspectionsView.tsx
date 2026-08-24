import React, { useState } from 'react';
import {
  SearchCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Building2,
  Eye,
  Download,
  AlertCircle,
} from 'lucide-react';
import { Inspection, Company, WorkCenter } from '../../types';
import { Modal } from '../common/Modal';
import { PdfGenerator } from '../../lib/pdfGenerator';

interface InspectionsViewProps {
  inspections: Inspection[];
  company: Company | null;
  workCenters: WorkCenter[];
  onCreateInspection: (data: any) => Promise<void>;
}

export const InspectionsView: React.FC<InspectionsViewProps> = ({
  inspections,
  company,
  workCenters,
  onCreateInspection,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

  // Form State
  const [formCenter, setFormCenter] = useState(workCenters[0]?.id || 'wc-santiago');
  const [formType, setFormType] = useState<Inspection['type']>('Instalaciones Generales');
  const [formInspector, setFormInspector] = useState('Camila Soto Valenzuela');
  const [formDate, setFormDate] = useState('2025-03-25');
  const [item1, setItem1] = useState<'Cumple' | 'NoCumple' | 'NA'>('Cumple');
  const [item2, setItem2] = useState<'Cumple' | 'NoCumple' | 'NA'>('Cumple');
  const [item3, setItem3] = useState<'Cumple' | 'NoCumple' | 'NA'>('Cumple');
  const [findingDesc, setFindingDesc] = useState('');

  const handleDownloadPdf = (insp: Inspection) => {
    if (!company) return;
    PdfGenerator.generateInspectionReport(company, insp);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const wc = workCenters.find((w) => w.id === formCenter);
    const items = [
      {
        id: 'chk-1',
        category: 'Orden y Limpieza',
        question: 'Vías de evacuación despejadas y demarcadas',
        criticality: 'Alta' as const,
        response: item1,
      },
      {
        id: 'chk-2',
        category: 'Equipos contra Incendio',
        question: 'Extintores con mantención vigente y libre acceso',
        criticality: 'Crítica' as const,
        response: item2,
      },
      {
        id: 'chk-3',
        category: 'Instalaciones Eléctricas',
        question: 'Tableros cerrados y rotulados con protectores diferenciales',
        criticality: 'Crítica' as const,
        response: item3,
      },
    ];

    const findings = findingDesc
      ? [
          {
            id: 'fnd-' + Date.now(),
            description: findingDesc,
            location: wc?.name || 'En terreno',
            severity: 'Alta' as const,
            suggestedAction: 'Subsanar de inmediato',
            status: 'Open' as const,
          },
        ]
      : [];

    await onCreateInspection({
      workCenterId: formCenter,
      workCenterName: wc?.name || 'Centro Principal',
      type: formType,
      inspectorName: formInspector,
      inspectionDate: formDate,
      items,
      findings,
    });

    setShowCreateModal(false);
    setFindingDesc('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Inspecciones Planeadas y Observaciones de Seguridad
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-mono">
              {inspections.length} Registros
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verificación preventiva en terreno exigida por el DS 44 Art. 7 con generación automática de hallazgos para el Action Center.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Ejecutar Nueva Inspección</span>
        </button>
      </div>

      {/* Inspections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inspections.map((insp) => (
          <div
            key={insp.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 block">{insp.code}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{insp.type}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{insp.workCenterName}</p>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  insp.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                {insp.status === 'Completed' ? 'Completada' : 'Borrador'}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <p>Inspector: <strong>{insp.inspectorName}</strong></p>
              <p>Fecha: <strong>{insp.inspectionDate}</strong></p>
              <p>Items Evaluados: <strong>{insp.items.length}</strong> ({insp.findings.length} hallazgos detectados)</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedInspection(insp)}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Ver Detalle
              </button>
              <button
                onClick={() => handleDownloadPdf(insp)}
                className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Execute Inspection Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Pauta de Inspección Preventiva en Terreno"
        subtitle="Registro de lista de chequeo y levantamiento de condiciones inseguras"
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
              <label className="block font-semibold mb-1">Tipo de Inspección:</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Instalaciones Generales">Instalaciones Generales</option>
                <option value="Vehículos y Maquinaria">Vehículos y Flota de Transporte</option>
                <option value="Equipos contra Incendio">Equipos contra Incendio (Extintores)</option>
                <option value="EPP">Uso de Elementos de Protección Personal</option>
                <option value="Herramientas y Equipos">Herramientas y Taller</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Inspector / Supervisor:</label>
              <input
                type="text"
                value={formInspector}
                onChange={(e) => setFormInspector(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Fecha de Inspección:</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Checklist questions */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Puntos Críticos a Evaluar:</span>

            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
              <span className="font-medium">1. Vías de tránsito, salidas de emergencia y pasillos despejados</span>
              <div className="flex gap-2">
                {(['Cumple', 'NoCumple', 'NA'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setItem1(r)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${item1 === r ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-700'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
              <span className="font-medium">2. Extintores presurizados, rotulados y accesibles</span>
              <div className="flex gap-2">
                {(['Cumple', 'NoCumple', 'NA'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setItem2(r)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${item2 === r ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-700'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">3. Tableros eléctricos con tapas y señalética de peligro</span>
              <div className="flex gap-2">
                {(['Cumple', 'NoCumple', 'NA'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setItem3(r)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${item3 === r ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-700'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Hallazgo Detectado (Condición o Acto Subestándar):</label>
            <input
              type="text"
              placeholder="Opcional: Describa si detectó alguna anomalía..."
              value={findingDesc}
              onChange={(e) => setFindingDesc(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
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
              className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
            >
              Finalizar Inspección
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={Boolean(selectedInspection)}
        onClose={() => setSelectedInspection(null)}
        title={selectedInspection ? `${selectedInspection.code}: ${selectedInspection.type}` : ''}
        subtitle={selectedInspection ? `${selectedInspection.workCenterName} — ${selectedInspection.inspectionDate}` : ''}
      >
        {selectedInspection && (
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-100">Resultados del Checklist:</span>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-lg overflow-hidden">
                {selectedInspection.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{it.question}</span>
                      <p className="text-[10px] text-slate-400">{it.category}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold ${it.response === 'Cumple' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {it.response}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedInspection.findings.length > 0 && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 rounded-lg space-y-1">
                <span className="font-bold text-rose-900 dark:text-rose-200">Hallazgos Registrados:</span>
                {selectedInspection.findings.map((f, idx) => (
                  <p key={idx} className="text-rose-700 dark:text-rose-300">• {f.description} ({f.location})</p>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
