import React, { useState } from 'react';
import {
  Search,
  Bell,
  CheckCircle,
  FileCheck,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { User, NotificationItem } from '../../types';

interface HeaderProps {
  currentUser: User;
  onSwitchRole: (role: string) => void;
  notifications: NotificationItem[];
  onOpenAuditMode: () => void;
  onOpenQuickAction: () => void;
  onOpenCommandPalette: () => void;
  onOpenOnboarding: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchRole,
  notifications,
  onOpenAuditMode,
  onOpenQuickAction,
  onOpenCommandPalette,
  onOpenOnboarding,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<string, string> = {
    admin: 'Administrador / Gerencia',
    prevencionista: 'Ingeniero Prevencionista',
    supervisor: 'Supervisor de Faena',
    responsable: 'Responsable de Medida',
    auditor: 'Fiscalizador / Auditor',
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 select-none px-6 flex items-center justify-between shadow-xs">
      {/* Left: Organization & Context */}
      <div className="flex items-center gap-4">
        {/* Brand Shield Emblem */}
        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
              Transportes Andes SpA
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200/80">
              DS 44 / 2025
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            RUT 77.419.820-K • Faenas Activas: 3 • Mutual de Seguridad
          </span>
        </div>

        {/* Command Search Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-lg border border-slate-200/90 transition-all ml-4"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-normal">Buscar obligaciones, riesgos o trabajadores...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-slate-200 text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Notifications, Role Switcher */}
      <div className="flex items-center gap-2.5">
        {/* Diagnostic Wizard */}
        <button
          onClick={onOpenOnboarding}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Diagnóstico Inicial</span>
        </button>

        {/* Audit Mode Button */}
        <button
          onClick={onOpenAuditMode}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-all shadow-2xs"
        >
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Audit Mode DT</span>
        </button>

        {/* Quick New Action Button */}
        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Medida</span>
        </button>

        <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-rose-500 rounded-full shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Alertas de Cumplimiento</span>
                <span className="text-[10px] font-medium text-slate-500">{notifications.length} registros</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          n.type === 'alert' ? 'text-rose-500' : 'text-amber-500'
                        }`}
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all text-left"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {currentUser.name.split(' ')[0]}
              </p>
              <p className="text-[10px] text-slate-500 font-medium capitalize">
                {currentUser.role}
              </p>
            </div>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Cambiar Rol de Simulación
              </div>
              {(['prevencionista', 'admin', 'supervisor', 'auditor'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onSwitchRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 transition-colors ${
                    currentUser.role === r ? 'text-emerald-700 font-semibold bg-emerald-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>{roleLabels[r]}</span>
                  {currentUser.role === r && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

