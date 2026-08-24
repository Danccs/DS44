import React, { useState } from 'react';
import {
  FolderLock,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Image,
  ShieldCheck,
  Lock,
  ExternalLink,
  Download,
  Check,
  Eye,
} from 'lucide-react';
import { Evidence, PreventiveAction, TenantComplianceRequirement } from '../../types';
import { Modal } from '../common/Modal';

interface EvidenceVaultViewProps {
  evidences: Evidence[];
  requirements: TenantComplianceRequirement[];
  actions: PreventiveAction[];
  onUploadEvidence: (data: Partial<Evidence>) => Promise<void>;
  onVerifyEvidence: (id: string) => Promise<void>;
}

export const EvidenceVaultView: React.FC<EvidenceVaultViewProps> = ({
  evidences,
  requirements,
  actions,
  onUploadEvidence,
  onVerifyEvidence,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState<Evidence['evidenceType']>('Documento');
  const [associatedEntityType, setAssociatedEntityType] = useState<Evidence['associatedEntityType']>('Requirement');
  const [associatedEntityId, setAssociatedEntityId] = useState('REQ-DS44-01');
  const [fileName, setFileName] = useState('acta_capacitacion_odi.pdf');
  const [notes, setNotes] = useState('');

  const filtered = evidences.filter((e) => {
    const s = (search || '').toLowerCase();
    const matchesSearch =
      (e.title || '').toLowerCase().includes(s) ||
      (e.fileName || '').toLowerCase().includes(s) ||
      (e.fileHash || '').toLowerCase().includes(s);

    const matchesType = typeFilter === 'ALL' || e.evidenceType === typeFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'VERIFIED' && e.verified) ||
      (statusFilter === 'UNVERIFIED' && !e.verified);

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUploadEvidence({
      title,
      evidenceType,
      associatedEntityType,
      associatedEntityId,
      fileName,
      fileSizeBytes: 1024 * 340, // 340 KB mock
      mimeType: fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      notes,
    });
    setShowUploadModal(false);
    setTitle('');
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Bóveda de Evidencias Digitales
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full font-mono">
              {evidences.length} Archivos Foliados
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Repositorio inmutable de actas, firmas, fotos y certificados exigidos por la normativa DS 44. Cada archivo cuenta con sellado criptográfico SHA-256.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Upload className="w-4 h-4" />
          <span>Subir Evidencia Foliada</span>
        </button>
      </div>

      {/* Quick Search and Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, archivo o hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="ALL">Todos los Tipos</option>
            <option value="Documento">Documentos / Actas</option>
            <option value="Fotografía">Fotografías en Terreno</option>
            <option value="Certificado">Certificados</option>
            <option value="Acta">Actas de Reunión</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="VERIFIED">Verificadas (HSE)</option>
            <option value="UNVERIFIED">Pendientes de Validación</option>
          </select>
        </div>
      </div>

      {/* Evidences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <div
            key={e.id}
            className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    {e.evidenceType === 'Fotografía' ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {e.evidenceType} • {e.associatedEntityType}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {e.title}
                    </h4>
                  </div>
                </div>

                {e.verified ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verificada
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-800">
                    Pendiente
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 line-clamp-2">
                {e.notes || `Archivo adjunto: ${e.fileName}`}
              </p>

              <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all space-y-0.5">
                <span className="text-[9px] font-sans font-bold text-slate-400 uppercase block">Hash de Integridad</span>
                <span>SHA-256: {e.fileHash.slice(0, 24)}...</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Subido: {e.uploadedAt}</span>
              <div className="flex items-center gap-1.5">
                {!e.verified && (
                  <button
                    onClick={() => onVerifyEvidence(e.id)}
                    className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
                  >
                    Aprobar
                  </button>
                )}
                <button
                  onClick={() => setSelectedEvidence(e)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Subir y Foliar Nueva Evidencia Legal"
        subtitle="Generación automática de Hash SHA-256 e integración con DS 44"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Título Descriptivo de la Evidencia:</label>
            <input
              required
              type="text"
              placeholder="Ej. Registro de Entrega de EPP Calzado Dieléctrico 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Tipo de Evidencia:</label>
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Documento">Documento Firmado / PDF</option>
                <option value="Fotografía">Fotografía en Terreno</option>
                <option value="Certificado">Certificado Oficial</option>
                <option value="Acta">Acta de Reunión / Comité</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Vincular a:</label>
              <select
                value={associatedEntityType}
                onChange={(e) => setAssociatedEntityType(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Requirement">Obligación DS 44</option>
                <option value="Action">Medida Preventiva (Action Center)</option>
                <option value="Inspection">Inspección Planeada</option>
                <option value="Incident">Investigación de Accidente</option>
                <option value="Training">Capacitación / Inducción</option>
              </select>
            </div>
          </div>

          {/* Drag & Drop Simulation */}
          <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center space-y-2 bg-slate-50 dark:bg-slate-850">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Arrastre y suelte su archivo aquí o haga clic para seleccionar
            </p>
            <p className="text-[11px] text-slate-400">PDF, JPG, PNG, XLSX hasta 25 MB</p>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Nombre del archivo..."
              className="mt-2 text-center text-xs p-1.5 w-64 border rounded-lg bg-white dark:bg-slate-900 border-slate-300"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Notas / Observaciones de Trazabilidad:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observaciones de contexto, fecha de firma o folio interno..."
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
            >
              Foliar y Guardar
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={Boolean(selectedEvidence)}
        onClose={() => setSelectedEvidence(null)}
        title={selectedEvidence?.title || ''}
        subtitle={`ID: ${selectedEvidence?.id} • Tipo: ${selectedEvidence?.evidenceType}`}
      >
        {selectedEvidence && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Archivo Asociado:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedEvidence.fileName}</p>
              <p className="text-slate-500">{selectedEvidence.notes}</p>
            </div>

            <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-[11px] space-y-1">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">Foliación Digital SHA-256</span>
              <p className="text-emerald-700 dark:text-emerald-400 break-all">{selectedEvidence.fileHash}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg flex justify-between text-[11px]">
              <span>Subido por: <strong>{selectedEvidence.uploadedBy}</strong></span>
              <span>Fecha: <strong>{selectedEvidence.uploadedAt}</strong></span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
