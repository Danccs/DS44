import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  Calendar,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { ComplianceDocument } from '../../types';
import { Modal } from '../common/Modal';

interface DocumentsViewProps {
  documents: ComplianceDocument[];
  onCreateDocument: (data: any) => Promise<void>;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onCreateDocument,
}) => {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [code, setCode] = useState('DOC-DS44-05');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplianceDocument['category']>('Procedimiento');
  const [version, setVersion] = useState('1.0');
  const [approver, setApprover] = useState('Gerencia General & Prevención');

  const filtered = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === 'ALL' || d.category === catFilter;
    return matchesSearch && matchesCat;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateDocument({
      code,
      title,
      category,
      currentVersion: version,
      status: 'Aprobado',
      approvedBy: approver,
      approvalDate: new Date().toISOString().split('T')[0],
      nextReviewDate: '2026-03-01',
    });
    setShowAddModal(false);
    setTitle('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Biblioteca de Documentación Oficial de Seguridad
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full font-mono">
              {documents.length} Documentos
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Políticas de SST, Reglamento Interno (RIOHS), Procedimientos de Trabajo Seguro (PTS) y Programas Preventivos Oficiales.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Documento</span>
        </button>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {doc.category}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded">
                  v{doc.currentVersion} • Vigente
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 block">{doc.code}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{doc.title}</h4>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <p>Aprobado por: <strong>{doc.approvedBy}</strong></p>
                <p>Fecha Aprobación: <strong>{doc.approvalDate}</strong></p>
                <p>Próxima Revisión: <strong>{doc.nextReviewDate}</strong></p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-[11px] text-slate-400">DS 44 Art. 4</span>
              <button
                onClick={() => alert(`Descargando documento oficial: ${doc.title}`)}
                className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Descargar PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Document Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Incorporar Documento al Sistema de Gestión"
        subtitle="Control de versiones y aprobación formal conforme a la normativa"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Código del Documento:</label>
              <input
                required
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Categoría:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Política">Política de SST</option>
                <option value="Reglamento">Reglamento Interno (RIOHS)</option>
                <option value="Programa">Programa Preventivo Anual</option>
                <option value="Procedimiento">Procedimiento de Trabajo Seguro (PTS)</option>
                <option value="Plan">Plan de Emergencia y Evacuación</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Título del Documento:</label>
            <input
              required
              type="text"
              placeholder="Ej. Procedimiento de Bloqueo y Etiquetado LOTO"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Versión Inicial:</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Aprobador:</label>
              <input
                type="text"
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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
              Guardar Documento
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
