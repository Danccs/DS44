import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Upload,
  UserCheck,
} from 'lucide-react';
import { Worker, WorkCenter } from '../../types';
import { Modal } from '../common/Modal';

interface WorkersViewProps {
  workers: Worker[];
  workCenters: WorkCenter[];
  onCreateWorker: (data: any) => Promise<void>;
}

export const WorkersView: React.FC<WorkersViewProps> = ({
  workers,
  workCenters,
  onCreateWorker,
}) => {
  const [search, setSearch] = useState('');
  const [centerFilter, setCenterFilter] = useState<string>('ALL');
  const [odiFilter, setOdiFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [rut, setRut] = useState('');
  const [fullName, setFullName] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [centerId, setCenterId] = useState(workCenters[0]?.id || 'wc-santiago');
  const [email, setEmail] = useState('');

  const filtered = workers.filter((w) => {
    const matchesSearch =
      w.fullName.toLowerCase().includes(search.toLowerCase()) ||
      w.rut.toLowerCase().includes(search.toLowerCase()) ||
      w.jobPosition.toLowerCase().includes(search.toLowerCase());

    const matchesCenter = centerFilter === 'ALL' || w.workCenterId === centerFilter;
    const matchesOdi = odiFilter === 'ALL' || w.odiStatus === odiFilter;

    return matchesSearch && matchesCenter && matchesOdi;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const wc = workCenters.find((w) => w.id === centerId);
    await onCreateWorker({
      rut,
      fullName,
      jobPosition,
      workCenterId: centerId,
      workCenterName: wc?.name || 'Centro Principal',
      email,
      hireDate: new Date().toISOString().split('T')[0],
      odiStatus: 'Firmado',
      odiDate: new Date().toISOString().split('T')[0],
      eppDeliveryStatus: 'Entregado',
      medicalExamStatus: 'Vigente',
      active: true,
    });
    setShowAddModal(false);
    setRut('');
    setFullName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Nómina de Trabajadores y Trazabilidad de Cumplimiento
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-mono">
              {workers.length} Trabajadores
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Control de inducciones ODI (Art. 21 D.S. 40 / DS 44), firmas de recepción de EPP y vigencia de exámenes de salud ocupacional.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Trabajador</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por RUT, nombre o cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={centerFilter}
            onChange={(e) => setCenterFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="ALL">Todos los Centros</option>
            {workCenters.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          <select
            value={odiFilter}
            onChange={(e) => setOdiFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-hidden"
          >
            <option value="ALL">Todos los Estados ODI</option>
            <option value="Firmado">ODI Firmado (Vigente)</option>
            <option value="Pendiente">ODI Pendiente</option>
            <option value="Vencido">ODI Vencido</option>
          </select>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Trabajador / RUT</th>
                <th className="py-3 px-4">Cargo Operacional</th>
                <th className="py-3 px-4">Centro Asignado</th>
                <th className="py-3 px-4">Estado ODI</th>
                <th className="py-3 px-4">Entrega EPP</th>
                <th className="py-3 px-4">Vigilancia Médica</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{w.fullName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{w.rut}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {w.jobPosition}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {w.workCenterName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        w.odiStatus === 'Firmado'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {w.odiStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        w.eppDeliveryStatus === 'Entregado'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {w.eppDeliveryStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        w.medicalExamStatus === 'Vigente'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {w.medicalExamStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Ficha de Seguridad de ${w.fullName} (RUT: ${w.rut})`)}
                      className="text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      Ficha HSE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Worker Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Incorporar Nuevo Trabajador"
        subtitle="Registro obligatorio en la dotación de seguridad y asignación de ODI"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">RUT Trabajador:</label>
              <input
                required
                type="text"
                placeholder="16.482.910-3"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Nombre Completo:</label>
              <input
                required
                type="text"
                placeholder="Ej. Juan Pérez González"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Cargo / Puesto:</label>
              <input
                required
                type="text"
                placeholder="Ej. Conductor Semirremolque"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Centro de Trabajo:</label>
              <select
                value={centerId}
                onChange={(e) => setCenterId(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {workCenters.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Correo Electrónico (Opcional):</label>
            <input
              type="email"
              placeholder="juan.perez@transportesandes.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
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
              Registrar y Generar Ficha
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
