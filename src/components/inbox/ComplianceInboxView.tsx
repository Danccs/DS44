import React, { useState } from 'react';
import {
  Inbox,
  AlertTriangle,
  FileCheck,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  RefreshCw,
  Upload,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { ComplianceInboxItem, PreventiveAction } from '../../types';
import { Modal } from '../common/Modal';

interface ComplianceInboxViewProps {
  items: ComplianceInboxItem[];
  actions: PreventiveAction[];
  onResolveItem: (itemId: string, actionId?: string) => void;
  onUploadEvidenceForAction: (actionId: string) => void;
  onNavigate: (view: any) => void;
}

export const ComplianceInboxView: React.FC<ComplianceInboxViewProps> = ({
  items,
  actions,
  onResolveItem,
  onUploadEvidenceForAction,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'OVERDUE' | 'EVIDENCE' | 'TRAINING' | 'MIPER' | 'FINDING'>('ALL');
  const [selectedItem, setSelectedItem] = useState<ComplianceInboxItem | null>(null);
  const [resolveComment, setResolveComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredItems = items.filter((item) => {
    if (activeTab === 'OVERDUE') return item.type === 'OVERDUE_ACTION';
    if (activeTab === 'EVIDENCE') return item.type === 'MISSING_EVIDENCE';
    if (activeTab === 'TRAINING') return item.type === 'EXPIRING_TRAINING';
    if (activeTab === 'MIPER') return item.type === 'MIPER_REVIEW_NEEDED';
    if (activeTab === 'FINDING') return item.type === 'UNRESOLVED_FINDING';
    return true;
  });

  const handleQuickAction = (item: ComplianceInboxItem) => {
    if (item.type === 'MISSING_EVIDENCE' && item.relatedEntityId) {
      onUploadEvidenceForAction(item.relatedEntityId);
    } else if (item.type === 'MIPER_REVIEW_NEEDED') {
      onNavigate('miper');
    } else if (item.type === 'EXPIRING_TRAINING') {
      onNavigate('trainings');
    } else {
      setSelectedItem(item);
    }
  };

  const handleConfirmResolution = () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onResolveItem(selectedItem.id, selectedItem.relatedEntityId);
      setIsSubmitting(false);
      setSelectedItem(null);
      setResolveComment('');
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Compliance Inbox
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 rounded-full">
              {items.length} pendientes
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Bandeja central unificada de brechas, medidas vencidas, evidencias faltantes y revisiones normativas obligatorias.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Metodología:</span>
          <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800">
            Inbox Zero para Prevención
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs">
        {[
          { id: 'ALL', label: `Todas (${items.length})` },
          { id: 'OVERDUE', label: `Medidas Vencidas (${items.filter(i => i.type === 'OVERDUE_ACTION').length})` },
          { id: 'EVIDENCE', label: `Evidencias Faltantes (${items.filter(i => i.type === 'MISSING_EVIDENCE').length})` },
          { id: 'TRAINING', label: `Capacitaciones (${items.filter(i => i.type === 'EXPIRING_TRAINING').length})` },
          { id: 'MIPER', label: `Revisión MIPER (${items.filter(i => i.type === 'MIPER_REVIEW_NEEDED').length})` },
          { id: 'FINDING', label: `Hallazgos (${items.filter(i => i.type === 'UNRESOLVED_FINDING').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Item List */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            ¡Bandeja de Cumplimiento al Día!
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No tienes tareas críticas pendientes en esta categoría. Todas las medidas y evidencias se encuentran al día.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-xl border bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.severity === 'critical'
                  ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      item.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {item.severity === 'critical' ? '🔴 CRÍTICA' : '🟡 ATENCIÓN'}
                  </span>
                  <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                    {item.type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    Responsable: <strong className="text-slate-700 dark:text-slate-300">{item.responsible}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    Fecha Vencimiento: <strong className="text-rose-600 dark:text-rose-400">{item.dueDate}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                <button
                  onClick={() => handleQuickAction(item)}
                  className="w-full md:w-auto px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>{item.quickActionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Direct Resolution Modal */}
      <Modal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        title={`Gestionar: ${selectedItem?.title}`}
        subtitle={`Entidad relacionada: ${selectedItem?.relatedEntityType} (${selectedItem?.relatedEntityId})`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-1">
            <p className="text-slate-500">Detalle de la exigencia:</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedItem?.description}</p>
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Registrar Acción / Prórroga Justificada:
            </label>
            <textarea
              rows={3}
              value={resolveComment}
              onChange={(e) => setResolveComment(e.target.value)}
              placeholder="Describa las acciones correctivas aplicadas, motivo de prórroga o adjunto de verificación..."
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setSelectedItem(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmResolution}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
            >
              {isSubmitting ? 'Guardando...' : 'Marcar como Atendido'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
