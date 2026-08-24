import React, { useState } from 'react';
import {
  ClipboardCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Info,
  Shield,
  Eye,
} from 'lucide-react';
import { TenantComplianceRequirement } from '../../types';
import { RequirementStatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface ChecklistViewProps {
  requirements: TenantComplianceRequirement[];
  onOpenEvidenceVault: (reqCode: string) => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  requirements,
  onOpenEvidenceVault,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedReq, setSelectedReq] = useState<TenantComplianceRequirement | null>(null);

  const categories = Array.from(new Set(requirements.map((r) => r.requirement.category)));

  const filtered = requirements.filter((r) => {
    const matchesSearch =
      r.requirement.title.toLowerCase().includes(search.toLowerCase()) ||
      r.requirement.code.toLowerCase().includes(search.toLowerCase()) ||
      r.requirement.articleReference.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || r.requirement.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Checklist de Requisitos DS 44
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full font-mono">
              DS44-CHILE-2025-v1
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Matriz de aplicabilidad legal conforme al Decreto Supremo N.º 44 y normativas complementarias de la Ley 16.744.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Requisitos Auditados</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
              12 de 12 Requisitos
            </span>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por artículo, título o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-emerald-600'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            Todas ({requirements.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-emerald-600'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Requirements Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Código / Base Legal</th>
                <th className="py-3 px-4">Obligación Normativa</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Criticidad</th>
                <th className="py-3 px-4">Cumplimiento</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map((tr) => (
                <tr
                  key={tr.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    <div>{tr.requirement.code}</div>
                    <span className="text-[10px] text-slate-400 font-sans font-normal">
                      {tr.requirement.articleReference}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {tr.requirement.title}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {tr.requirement.description}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]">
                      {tr.requirement.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">
                    <span
                      className={
                        tr.requirement.criticality === 'Crítica'
                          ? 'text-rose-600 font-bold'
                          : tr.requirement.criticality === 'Alta'
                          ? 'text-amber-600'
                          : 'text-slate-500'
                      }
                    >
                      {tr.requirement.criticality}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <RequirementStatusBadge status={tr.status} />
                      <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            tr.fulfillmentPercent === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${tr.fulfillmentPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {tr.responsibleName}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedReq(tr)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requirement Details Modal */}
      <Modal
        isOpen={Boolean(selectedReq)}
        onClose={() => setSelectedReq(null)}
        title={selectedReq ? `${selectedReq.requirement.code}: ${selectedReq.requirement.title}` : ''}
        subtitle={selectedReq ? `${selectedReq.requirement.regulation} — ${selectedReq.requirement.articleReference}` : ''}
      >
        {selectedReq && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Texto Normativo</span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {selectedReq.requirement.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-semibold">Evidencia Legal Requerida</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedReq.requirement.requiredEvidenceDescription}
                </p>
              </div>

              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-semibold">Diagnóstico Actual</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedReq.statusJustification}
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-emerald-800 dark:text-emerald-200 font-bold block">
                  Porcentaje de Cumplimiento: {selectedReq.fulfillmentPercent}%
                </span>
                <span className="text-[11px] text-slate-500">
                  Responsable Asignado: {selectedReq.responsibleName}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedReq(null);
                  onOpenEvidenceVault(selectedReq.requirement.code);
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Ver Evidencias
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
