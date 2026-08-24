import React from 'react';
import { RiskLevel, ActionStatus, ComplianceRequirementStatus, ActionPriority } from '../../types';

export const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const styles = {
    Bajo: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    Medio: 'bg-amber-50 text-amber-700 border-amber-200/80',
    Alto: 'bg-orange-50 text-orange-700 border-orange-200/80',
    Crítico: 'bg-rose-50 text-rose-700 border-rose-200/90 font-semibold',
  };

  const dots = {
    Bajo: 'bg-emerald-500',
    Medio: 'bg-amber-500',
    Alto: 'bg-orange-500',
    Crítico: 'bg-rose-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${styles[level] || styles.Bajo}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[level] || dots.Bajo}`} />
      {level}
    </span>
  );
};

export const ActionStatusBadge: React.FC<{ status: ActionStatus }> = ({ status }) => {
  const labels: Record<ActionStatus, string> = {
    Draft: 'Borrador',
    Pending: 'Pendiente',
    InProgress: 'En Progreso',
    Completed: 'Completada',
    Verified: 'Verificada (DT/Mutual)',
    Rejected: 'Rechazada',
    Overdue: 'Vencida',
    Cancelled: 'Cancelada',
  };

  const styles: Record<ActionStatus, string> = {
    Draft: 'bg-slate-100 text-slate-600 border-slate-200',
    Pending: 'bg-sky-50 text-sky-700 border-sky-200',
    InProgress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Completed: 'bg-amber-50 text-amber-700 border-amber-200',
    Verified: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    Overdue: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    Cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${styles[status] || styles.Draft}`}>
      {labels[status] || status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: ActionPriority }> = ({ priority }) => {
  const styles: Record<ActionPriority, string> = {
    Baja: 'text-slate-600 bg-slate-100 border-slate-200',
    Media: 'text-sky-700 bg-sky-50 border-sky-200',
    Alta: 'text-amber-800 bg-amber-50 border-amber-200 font-medium',
    Crítica: 'text-rose-800 bg-rose-50 border-rose-200 font-bold',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles[priority] || styles.Baja}`}>
      {priority}
    </span>
  );
};

export const RequirementStatusBadge: React.FC<{ status: ComplianceRequirementStatus }> = ({ status }) => {
  const labels: Record<ComplianceRequirementStatus, string> = {
    Compliant: 'Conforme (100%)',
    PartiallyCompliant: 'Parcial',
    NonCompliant: 'No Conforme',
    NeedsReview: 'Revisión Necesaria',
    NotApplicable: 'No Aplica',
  };

  const styles: Record<ComplianceRequirementStatus, string> = {
    Compliant: 'bg-emerald-50 text-emerald-700 border-emerald-200/90 font-medium',
    PartiallyCompliant: 'bg-amber-50 text-amber-700 border-amber-200',
    NonCompliant: 'bg-rose-50 text-rose-700 border-rose-200 font-medium',
    NeedsReview: 'bg-purple-50 text-purple-700 border-purple-200',
    NotApplicable: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${styles[status] || styles.NonCompliant}`}>
      {labels[status] || status}
    </span>
  );
};


