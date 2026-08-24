import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Building2,
  Paperclip,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import { PreventiveAction, WorkCenter, ActionStatus, ActionPriority } from '../../types';
import { ActionStatusBadge, PriorityBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface ActionCenterViewProps {
  actions: PreventiveAction[];
  workCenters: WorkCenter[];
  onCreateAction: (data: Partial<PreventiveAction>) => Promise<void>;
  onUpdateAction: (id: string, data: Partial<PreventiveAction>) => Promise<void>;
  onVerifyAction: (id: string, notes: string, status: 'Verified' | 'Rejected') => Promise<void>;
  onOpenEvidenceForAction: (actionId: string) => void;
}

export const ActionCenterView: React.FC<ActionCenterViewProps> = ({
  actions,
  workCenters,
  onCreateAction,
  onUpdateAction,
  onVerifyAction,
  onOpenEvidenceForAction,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [centerFilter, setCenterFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [quickFilter, setQuickFilter] = useState<'ALL' | 'OVERDUE' | 'NO_EVIDENCE' | 'COMPLETED_UNVERIFIED'>('ALL');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedActionForVerify, setSelectedActionForVerify] = useState<PreventiveAction | null>(null);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [selectedActionDetails, setSelectedActionDetails] = useState<PreventiveAction | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formOrigin, setFormOrigin] = useState<'MIPER' | 'Inspección' | 'Incidente' | 'Obligación Legal'>('MIPER');
  const [formCenter, setFormCenter] = useState(workCenters[0]?.id || 'wc-santiago');
  const [formPriority, setFormPriority] = useState<ActionPriority>('Alta');
  const [formResponsible, setFormResponsible] = useState('Jorge Alarcón R.');
  const [formDueDate, setFormDueDate] = useState('2025-03-30');

  const filtered = actions.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.responsibleName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesCenter = centerFilter === 'ALL' || a.workCenterId === centerFilter;
    const matchesPriority = priorityFilter === 'ALL' || a.priority === priorityFilter;

    let matchesQuick = true;
    if (quickFilter === 'OVERDUE') matchesQuick = a.status === 'Overdue';
    if (quickFilter === 'NO_EVIDENCE') matchesQuick = a.evidenceIds.length === 0;
    if (quickFilter === 'COMPLETED_UNVERIFIED') matchesQuick = a.status === 'Completed';

    return matchesSearch && matchesStatus && matchesCenter && matchesPriority && matchesQuick;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const wc = workCenters.find((w) => w.id === formCenter);
    await onCreateAction({
      title: formTitle,
      description: formDesc,
      origin: formOrigin,
      workCenterId: formCenter,
      workCenterName: wc?.name || 'Centro Principal',
      priority: formPriority,
      responsibleName: formResponsible,
      dueDate: formDueDate,
    });
    setShowCreateModal(false);
    setFormTitle('');
    setFormDesc('');
  };

  const handleVerifySubmit = async (status: 'Verified' | 'Rejected') => {
    if (!selectedActionForVerify) return;
    await onVerifyAction(selectedActionForVerify.id, verifyNotes || 'Verificación aprobada por Prevención de Riesgos.', status);
    setSelectedActionForVerify(null);
    setVerifyNotes('');
  };

  const handleMarkAsCompleted = async (action: PreventiveAction) => {
    await onUpdateAction(action.id, { status: 'Completed', progressPercent: 100 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Action Center — Gestión de Medidas Preventivas
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-mono">
              {actions.length} Medidas
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Control integral del Programa Preventivo DS 44. Diferenciación estricta entre tareas completadas por el usuario y verificadas formalmente por el prevencionista.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Medida Preventiva</span>
        </button>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setQuickFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            quickFilter === 'ALL'
              ? 'bg-slate-900 text-white dark:bg-emerald-600'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          Todas ({actions.length})
        </button>
        <button
          onClick={() => setQuickFilter('OVERDUE')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
            quickFilter === 'OVERDUE'
              ? 'bg-rose-600 text-white'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Vencidas ({actions.filter(a => a.status === 'Overdue').length})</span>
        </button>
        <button
          onClick={() => setQuickFilter('COMPLETED_UNVERIFIED')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
            quickFilter === 'COMPLETED_UNVERIFIED'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Completadas por Verificar ({actions.filter(a => a.status === 'Completed').length})</span>
        </button>
        <button
          onClick={() => setQuickFilter('NO_EVIDENCE')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            quickFilter === 'NO_EVIDENCE'
              ? 'bg-indigo-600 text-white'
              : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
          }`}
        >
          Sin Evidencia ({actions.filter(a => a.evidenceIds.length === 0).length})
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, título o responsable..."
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
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="ALL">Todas las Prioridades</option>
            <option value="Crítica">Crítica</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Pending">Pendiente</option>
            <option value="InProgress">En Progreso</option>
            <option value="Completed">Completada</option>
            <option value="Verified">Verificada</option>
            <option value="Overdue">Vencida</option>
          </select>
        </div>
      </div>

      {/* Actions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Código / Origen</th>
                <th className="py-3 px-4">Medida Preventiva</th>
                <th className="py-3 px-4">Centro Asignado</th>
                <th className="py-3 px-4">Prioridad</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Vencimiento</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Evidencias</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{a.code}</span>
                    <span className="text-[10px] text-slate-400 font-sans">{a.origin}</span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{a.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{a.description}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {a.workCenterName}
                  </td>
                  <td className="py-3.5 px-4">
                    <PriorityBadge priority={a.priority} />
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {a.responsibleName}
                  </td>
                  <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                    <span className={a.status === 'Overdue' ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                      {a.dueDate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <ActionStatusBadge status={a.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onOpenEvidenceForAction(a.id)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        a.evidenceIds.length > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <Paperclip className="w-3 h-3" />
                      <span>{a.evidenceIds.length} adjuntos</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                    {a.status === 'Completed' ? (
                      <button
                        onClick={() => setSelectedActionForVerify(a)}
                        className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
                      >
                        Verificar (HSE)
                      </button>
                    ) : a.status !== 'Verified' ? (
                      <button
                        onClick={() => handleMarkAsCompleted(a)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 rounded-lg"
                      >
                        Terminar
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verificado
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal (Prevencionista Approval) */}
      <Modal
        isOpen={Boolean(selectedActionForVerify)}
        onClose={() => setSelectedActionForVerify(null)}
        title={`Verificación Técnica HSE: ${selectedActionForVerify?.code}`}
        subtitle="Validación del cumplimiento efectivo de la medida y revisión de evidencia"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Medida Ejecutada:</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedActionForVerify?.title}</p>
            <p className="text-slate-500">{selectedActionForVerify?.description}</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Dictamen y Observaciones del Prevencionista:</label>
            <textarea
              rows={3}
              value={verifyNotes}
              onChange={(e) => setVerifyNotes(e.target.value)}
              placeholder="Constatar inspección en terreno, revisión de certificado de calibración, fotografía o firma de acta..."
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleVerifySubmit('Rejected')}
              className="px-4 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg font-semibold"
            >
              Rechazar Evidencia
            </button>
            <button
              onClick={() => handleVerifySubmit('Verified')}
              className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
            >
              Aprobar y Verificar Medida
            </button>
          </div>
        </div>
      </Modal>

      {/* Create Action Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nueva Medida Preventiva / Correctiva"
        subtitle="Incorporación al Programa Preventivo Anual DS 44"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Título de la Medida:</label>
            <input
              required
              type="text"
              placeholder="Ej. Instalación de baranda perimetral en andén..."
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Descripción y Alcance:</label>
            <textarea
              rows={2}
              required
              placeholder="Detalle técnico de la acción y resultado esperado..."
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Origen:</label>
              <select
                value={formOrigin}
                onChange={(e) => setFormOrigin(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="MIPER">MIPER (Matriz de Riesgo)</option>
                <option value="Inspección">Inspección Planeada</option>
                <option value="Incidente">Investigación Accidente</option>
                <option value="Obligación Legal">Obligación Legal DS 44</option>
              </select>
            </div>
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
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Prioridad:</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Crítica">Crítica</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block font-semibold mb-1">Responsable:</label>
              <input
                required
                type="text"
                placeholder="Nombre del responsable..."
                value={formResponsible}
                onChange={(e) => setFormResponsible(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Fecha Límite (Deadline):</label>
            <input
              required
              type="date"
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
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
              Registrar Medida
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
