import React, { useState } from 'react';
import {
  Building2,
  Save,
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Company } from '../../types';

interface CompanySettingsViewProps {
  company: Company | null;
  onUpdateCompany: (data: Partial<Company>) => Promise<void>;
}

export const CompanySettingsView: React.FC<CompanySettingsViewProps> = ({
  company,
  onUpdateCompany,
}) => {
  const [legalName, setLegalName] = useState(company?.legalName || 'Transportes Andes SpA');
  const [rut, setRut] = useState(company?.rut || '77.419.820-K');
  const [workerCount, setWorkerCount] = useState(String(company?.workerCount || 57));
  const [mutualidad, setMutualidad] = useState(company?.mutualidad || 'Mutual de Seguridad');
  const [riskActivityCode, setRiskActivityCode] = useState(company?.riskActivityCode || '492300');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateCompany({
      legalName,
      rut,
      workerCount: Number(workerCount),
      mutualidad: mutualidad as any,
      riskActivityCode,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Antecedentes de la Empresa y Organismo Administrador
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configuración corporativa obligatoria para el cálculo de aplicabilidad legal bajo el DS 44 y la Ley 16.744.
        </p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>¡Antecedentes de la empresa actualizados correctamente!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Razón Social de la Empresa:
            </label>
            <input
              required
              type="text"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              RUT Empresa (con guión y dígito verificador):
            </label>
            <input
              required
              type="text"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Dotación Total de Trabajadores:
            </label>
            <input
              required
              type="number"
              value={workerCount}
              onChange={(e) => setWorkerCount(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              {Number(workerCount) >= 25 ? 'Exige Comité Paritario (CPHS)' : 'No exige CPHS (<25)'}
            </span>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Organismo Administrador Ley (OAL):
            </label>
            <select
              value={mutualidad}
              onChange={(e) => setMutualidad(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="Mutual de Seguridad">Mutual de Seguridad CChC</option>
              <option value="ACHS">ACHS (Asociación Chilena de Seguridad)</option>
              <option value="IST">IST (Instituto de Seguridad del Trabajo)</option>
              <option value="ISL">ISL (Instituto de Seguridad Laboral)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Código Actividad Económica SII:
            </label>
            <input
              type="text"
              value={riskActivityCode}
              onChange={(e) => setRiskActivityCode(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-900 dark:text-slate-100">
              Evaluación de Aplicabilidad Normativa DS 44
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
            Con <strong>{workerCount} trabajadores</strong>, su empresa está sujeta a la totalidad de las 12 obligaciones del DS 44, incluyendo la obligación de contar con Matriz MIPER formalmente validada, Comité Paritario de Higiene y Seguridad activo y Plan Anual de Capacitación.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </form>
    </div>
  );
};
