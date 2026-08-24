import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  BookOpen,
} from 'lucide-react';
import { TrainingSession, Worker } from '../../types';
import { Modal } from '../common/Modal';

interface TrainingsViewProps {
  trainings: TrainingSession[];
  workers: Worker[];
  onCreateTraining: (data: any) => Promise<void>;
}

export const TrainingsView: React.FC<TrainingsViewProps> = ({
  trainings,
  workers,
  onCreateTraining,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'SESSIONS' | 'EXPIRING_WORKERS'>('SESSIONS');

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TrainingSession['type']>('Obligación de Informar (ODI)');
  const [date, setDate] = useState('2025-04-10');
  const [hours, setHours] = useState('2');
  const [instructor, setInstructor] = useState('Mutual de Seguridad');
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);

  // Expiring workers list (workers whose ODI or medical is expiring)
  const expiringWorkers = workers.filter(w => w.medicalExamStatus === 'PorVencer' || w.odiStatus === 'Vencido' || w.odiStatus === 'Pendiente');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateTraining({
      title,
      type,
      scheduledDate: date,
      durationHours: Number(hours),
      instructorName: instructor,
      instructorInstitution: 'Mutual de Seguridad',
      assignedWorkerIds: selectedWorkers.length > 0 ? selectedWorkers : workers.slice(0, 5).map(w => w.id),
    });
    setShowCreateModal(false);
    setTitle('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Plan Anual de Capacitación y Entrenamiento DS 44
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-full font-mono">
              7 Vencimientos Próximos
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Programación de inducciones ODI, cursos técnicos, manejo a la defensiva y exámenes ocupacionales obligatorios.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Programar Capacitación</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('SESSIONS')}
          className={`px-4 py-2.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'SESSIONS'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sesiones Programadas ({trainings.length})
        </button>
        <button
          onClick={() => setActiveTab('EXPIRING_WORKERS')}
          className={`px-4 py-2.5 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'EXPIRING_WORKERS'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Alertas de Trabajadores ({expiringWorkers.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'SESSIONS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainings.map((t) => (
            <div
              key={t.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                    {t.type}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.title}</h4>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    t.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : t.status === 'Scheduled'
                      ? 'bg-sky-50 text-sky-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {t.status === 'Completed' ? 'Ejecutada' : 'Programada'}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <p className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Fecha: <strong>{t.scheduledDate}</strong> ({t.durationHours} hrs)
                </p>
                <p className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> Relator: <strong>{t.instructorName}</strong>
                </p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Asistencia: <strong>{t.attendedWorkerIds.length}</strong> de {t.assignedWorkerIds.length} trabajadores registrados
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">ID: {t.id}</span>
                <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                  Ver lista de firmas →
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border-b border-rose-100 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Trabajadores con exámenes médicos o inducciones ODI próximas a vencer según exigencia DS 44 Art. 9:</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4">Trabajador / RUT</th>
                  <th className="py-3 px-4">Cargo & Centro</th>
                  <th className="py-3 px-4">Estado ODI</th>
                  <th className="py-3 px-4">Vigilancia Médica</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expiringWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{w.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{w.rut}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {w.jobPosition} ({w.workCenterName})
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${w.odiStatus === 'Vencido' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                        ODI {w.odiStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-800">
                        Examen: {w.medicalExamStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 rounded-lg hover:bg-slate-800"
                      >
                        Agendar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Agendar Nueva Capacitación o Examen Ocupacional"
        subtitle="Registro obligatorio en el Programa de Prevención Anual"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Título del Curso / Examen:</label>
            <input
              required
              type="text"
              placeholder="Ej. Curso Conducción a la Defensiva en Alta Montaña"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Tipo de Evento:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Obligación de Informar (ODI)">Obligación de Informar (ODI)</option>
                <option value="Manejo a la Defensiva">Manejo a la Defensiva</option>
                <option value="Uso y Manejo de Extintores">Uso y Manejo de Extintores</option>
                <option value="Primeros Auxilios">Primeros Auxilios</option>
                <option value="Manejo Manual de Cargas">Manejo Manual de Cargas (Ley 20.001)</option>
                <option value="Riesgo Eléctrico">Riesgo Eléctrico</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Duración (Horas):</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Fecha Programada:</label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Institución / Relator:</label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
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
              Agendar Capacitación
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
