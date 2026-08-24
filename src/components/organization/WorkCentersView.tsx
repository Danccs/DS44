import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Users,
  ShieldCheck,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { WorkCenter } from '../../types';
import { Modal } from '../common/Modal';

interface WorkCentersViewProps {
  workCenters: WorkCenter[];
  onCreateWorkCenter: (data: Partial<WorkCenter>) => Promise<void>;
}

export const WorkCentersView: React.FC<WorkCentersViewProps> = ({
  workCenters,
  onCreateWorkCenter,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [commune, setCommune] = useState('');
  const [region, setRegion] = useState('');
  const [manager, setManager] = useState('');
  const [count, setCount] = useState('10');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateWorkCenter({
      name,
      address,
      commune,
      region,
      managerName: manager,
      workerCount: Number(count),
      hasComiteParitario: Number(count) >= 25,
      active: true,
    });
    setShowAddModal(false);
    setName('');
    setAddress('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Centros de Trabajo y Faenas Operacionales
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-mono">
              {workCenters.length} Centros
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Segmentación por sucursal conforme al DS 44. Cada faena cuenta con su propia dotación, matriz de riesgos y estado de Comité Paritario.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Centro de Trabajo</span>
        </button>
      </div>

      {/* Grid of Work Centers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {workCenters.map((wc) => (
          <div
            key={wc.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{wc.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{wc.id}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                  Operativo
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                <span>{wc.address}, {wc.commune} ({wc.region})</span>
              </p>

              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Dotación Asignada:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{wc.workerCount} trabajadores</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Jefe de Operaciones:</span>
                  <strong className="text-slate-900 dark:text-slate-100">{wc.managerName}</strong>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-500">Comité Paritario (CPHS):</span>
                  <span className={wc.hasComiteParitario ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                    {wc.hasComiteParitario ? 'Constituido (>25)' : 'No exigible (<25)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">DS 44 Art. 3</span>
              <span className="text-emerald-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                Ver MIPER del centro →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Incorporar Centro de Trabajo o Faena"
        subtitle="Identificación oficial de sucursal o faena según DS 44"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Nombre de la Sucursal / Faena:</label>
            <input
              required
              type="text"
              placeholder="Ej. Bodega Central Concepción"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Dirección Completa:</label>
            <input
              required
              type="text"
              placeholder="Av. Los Carrera 1420"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Comuna:</label>
              <input
                required
                type="text"
                placeholder="Concepción"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Región:</label>
              <input
                required
                type="text"
                placeholder="Región del Biobío"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Responsable / Supervisor:</label>
              <input
                required
                type="text"
                placeholder="Nombre del jefe de faena..."
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Dotación Estimada:</label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
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
              Guardar Centro
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
