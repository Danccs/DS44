import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  Inbox,
  ClipboardCheck,
  ShieldAlert,
  FileSpreadsheet,
  CheckSquare,
  SearchCheck,
  AlertOctagon,
  Users,
  FolderLock,
  FileText,
  FileSignature,
  Layers,
  History,
  Settings,
  Sparkles,
} from 'lucide-react';
import { NavView } from '../layout/Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: NavView) => void;
  onNewAction: () => void;
  onNewEvidence: () => void;
  onExportPdf: () => void;
  onExportZip: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onNewAction,
  onNewEvidence,
  onExportPdf,
  onExportZip,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { label: 'Ir al Dashboard de Cumplimiento', icon: LayoutDashboard, action: () => onSelectView('dashboard') },
    { label: 'Abrir Compliance Inbox (Zero Inbox)', icon: Inbox, action: () => onSelectView('inbox') },
    { label: 'Ver Checklist de Obligaciones DS 44', icon: ClipboardCheck, action: () => onSelectView('checklist') },
    { label: 'Modo Auditoría (Audit Ready DT/SUSESO)', icon: ShieldAlert, action: () => onSelectView('audit-mode') },
    { label: 'Matriz MIPER (Evaluación 5x5)', icon: FileSpreadsheet, action: () => onSelectView('miper') },
    { label: 'Action Center (Medidas Preventivas)', icon: CheckSquare, action: () => onSelectView('actions') },
    { label: 'Inspecciones en Terreno', icon: SearchCheck, action: () => onSelectView('inspections') },
    { label: 'Investigación de Accidentes & DIAT', icon: AlertOctagon, action: () => onSelectView('incidents') },
    { label: 'Nómina de Trabajadores y ODI', icon: Users, action: () => onSelectView('workers') },
    { label: 'Bóveda de Evidencias Digitales', icon: FolderLock, action: () => onSelectView('evidence') },
    { label: 'Generador de Informes Oficiales PDF', icon: FileSignature, action: () => onSelectView('reports') },
    { label: 'Crear Nueva Medida Preventiva', icon: CheckSquare, action: onNewAction },
    { label: 'Subir Nueva Evidencia Foliada', icon: FolderLock, action: onNewEvidence },
    { label: 'Descargar Informe Ejecutivo DS44 en PDF', icon: FileSignature, action: onExportPdf },
    { label: 'Exportar Compliance Pack (ZIP)', icon: ShieldAlert, action: onExportZip },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Buscar comando, vista o acción..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent outline-hidden text-slate-900 placeholder-slate-400"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-500 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-400">No se encontraron resultados.</p>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-left text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{cmd.label}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
