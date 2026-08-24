import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  ShieldAlert,
  ClipboardCheck,
  CheckSquare,
  FileSpreadsheet,
  GraduationCap,
  SearchCheck,
  AlertOctagon,
  Users,
  Building2,
  FolderLock,
  FileText,
  History,
  Layers,
  Settings,
  FileSignature,
  ShieldCheck,
} from 'lucide-react';

export type NavView =
  | 'dashboard'
  | 'inbox'
  | 'checklist'
  | 'audit-mode'
  | 'miper'
  | 'actions'
  | 'inspections'
  | 'incidents'
  | 'trainings'
  | 'workers'
  | 'work-centers'
  | 'evidence'
  | 'documents'
  | 'reports'
  | 'audit-logs'
  | 'templates'
  | 'company-settings';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  inboxCount: number;
  overdueCount: number;
  criticalRisksCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  inboxCount,
  overdueCount,
  criticalRisksCount,
}) => {
  const sections = [
    {
      title: 'VISTA PRINCIPAL',
      items: [
        { id: 'dashboard' as NavView, label: 'Dashboard General', icon: LayoutDashboard },
        {
          id: 'inbox' as NavView,
          label: 'Compliance Inbox',
          icon: Inbox,
          badge: inboxCount > 0 ? inboxCount : undefined,
          badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
        },
      ],
    },
    {
      title: 'NORMATIVA DS 44',
      items: [
        { id: 'checklist' as NavView, label: '12 Obligaciones DS44', icon: ClipboardCheck },
        { id: 'audit-mode' as NavView, label: 'Modo Auditoría (DT)', icon: ShieldAlert, highlight: true },
      ],
    },
    {
      title: 'GESTIÓN PREVENTIVA',
      items: [
        {
          id: 'miper' as NavView,
          label: 'Matriz MIPER (5x5)',
          icon: FileSpreadsheet,
          badge: criticalRisksCount > 0 ? `${criticalRisksCount} Críticos` : undefined,
          badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
        },
        {
          id: 'actions' as NavView,
          label: 'Centro de Acciones',
          icon: CheckSquare,
          badge: overdueCount > 0 ? `${overdueCount} Vencidas` : undefined,
          badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
        },
        { id: 'inspections' as NavView, label: 'Inspecciones y Hallazgos', icon: SearchCheck },
        { id: 'incidents' as NavView, label: 'Incidentes y Accidentes', icon: AlertOctagon },
      ],
    },
    {
      title: 'PERSONAS Y FAENAS',
      items: [
        { id: 'workers' as NavView, label: 'Trabajadores (57)', icon: Users },
        { id: 'trainings' as NavView, label: 'Capacitaciones y ODI', icon: GraduationCap },
        { id: 'work-centers' as NavView, label: 'Centros de Trabajo (3)', icon: Building2 },
      ],
    },
    {
      title: 'EVIDENCIAS Y REPORTES',
      items: [
        { id: 'evidence' as NavView, label: 'Bóveda de Evidencias', icon: FolderLock },
        { id: 'documents' as NavView, label: 'Documentos Oficiales', icon: FileText },
        { id: 'reports' as NavView, label: 'Generador de Informes', icon: FileSignature },
      ],
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        { id: 'templates' as NavView, label: 'Plantillas por Industria', icon: Layers },
        { id: 'audit-logs' as NavView, label: 'Registro de Auditoría', icon: History },
        { id: 'company-settings' as NavView, label: 'Empresa y Parámetros', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-50/70 border-r border-slate-200 flex flex-col shrink-0 select-none min-h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {sections.map((sec, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
              {sec.title}
            </p>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-white text-emerald-700 font-semibold shadow-xs border border-slate-200/90'
                        : item.highlight
                        ? 'bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/60'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-emerald-600'
                            : item.highlight
                            ? 'text-emerald-600'
                            : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md shrink-0 ${
                          item.badgeColor || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Compliance quick status footer */}
      <div className="p-3.5 border-t border-slate-200 bg-white/60 text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Reglamento DS 44
          </span>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
            Vigente 2025
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Mutualidad:</span>
          <span className="text-slate-800 font-medium">Mutual de Seg.</span>
        </div>
      </div>
    </aside>
  );
};

