import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Shield,
  User,
  Clock,
  Lock,
} from 'lucide-react';
import { AuditLog } from '../../types';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filtered = logs.filter((l) => {
    const s = (search || '').toLowerCase();
    const matchesSearch =
      (l.details || '').toLowerCase().includes(s) ||
      (l.performedByName || '').toLowerCase().includes(s) ||
      (l.entityType || '').toLowerCase().includes(s);
    const matchesAction = actionFilter === 'ALL' || l.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Registro Inmutable de Auditoría y Trazabilidad
          </h2>
          <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-mono">
            {logs.length} Eventos Registrados
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Bitácora criptográfica de cambios de estado, aprobaciones de prevencionistas, subidas de evidencias y reevaluaciones de matrices.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por usuario, entidad o detalle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-hidden"
        >
          <option value="ALL">Todas las Operaciones</option>
          <option value="CREATE">Creaciones</option>
          <option value="UPDATE">Modificaciones</option>
          <option value="VERIFY">Verificaciones Formales</option>
          <option value="RESOLVE_INBOX">Resoluciones Inbox</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Usuario / Rol</th>
                <th className="py-3 px-4">Acción</th>
                <th className="py-3 px-4">Entidad Afectada</th>
                <th className="py-3 px-4">Detalle de la Operación</th>
                <th className="py-3 px-4">IP / Origen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(l.timestamp).toLocaleString('es-CL')}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    <div>{l.performedByName}</div>
                    <span className="text-[10px] text-slate-400 capitalize">{l.role}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
                      {l.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {l.entityType} ({l.entityId})
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="text-slate-700 dark:text-slate-300 line-clamp-1">{l.details}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {l.ipAddress || '190.161.42.11'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
