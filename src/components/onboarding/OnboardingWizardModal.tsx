import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Users,
  FileCheck,
  Shield,
  Layers,
  X,
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1);

  // Diagnostic State
  const [q1Workers, setQ1Workers] = useState('57');
  const [q2Mutualidad, setQ2Mutualidad] = useState('Mutual de Seguridad');
  const [q3HasMiper, setQ3HasMiper] = useState('SI');
  const [q4HasCphs, setQ4HasCphs] = useState('SI');
  const [q5HasRiohs, setQ5HasRiohs] = useState('SI');
  const [q6HasTrainingPlan, setQ6HasTrainingPlan] = useState('PARCIAL');
  const [q7HasInspections, setQ7HasInspections] = useState('SI');
  const [q8HasEvidenceVault, setQ8HasEvidenceVault] = useState('SI');

  const steps = [
    { title: 'Dotación y Mutualidad', desc: 'Identificación del tamaño de la empresa' },
    { title: 'Matriz MIPER', desc: 'Identificación de peligros y riesgos' },
    { title: 'Comité Paritario (CPHS)', desc: 'Constitución legal según Art. 66 Ley 16.744' },
    { title: 'Reglamento Interno (RIOHS)', desc: 'Vigencia de orden, higiene y seguridad' },
    { title: 'Programa de Capacitación', desc: 'Inducciones ODI y cursos técnicos' },
    { title: 'Inspecciones Planeadas', desc: 'Revisiones preventivas en faenas' },
    { title: 'Investigación de Accidentes', desc: 'Registro de eventos y DIAT' },
    { title: 'Diagnóstico & Plan Recomendado', desc: 'Puntaje estimado y prioridades' },
  ];

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Diagnóstico Guiado DS 44 — Paso ${step} de 8`}
      subtitle={steps[step - 1]?.desc}
      maxWidth="xl"
    >
      <div className="space-y-5 text-xs">
        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 8) * 100}%` }}
          />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              ¿Cuál es la dotación total de trabajadores y organismo mutual?
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Número de Trabajadores:</label>
                <input
                  type="number"
                  value={q1Workers}
                  onChange={(e) => setQ1Workers(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Organismo Administrador:</label>
                <select
                  value={q2Mutualidad}
                  onChange={(e) => setQ2Mutualidad(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Mutual de Seguridad">Mutual de Seguridad</option>
                  <option value="ACHS">ACHS</option>
                  <option value="IST">IST</option>
                  <option value="ISL">ISL</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              ¿La empresa cuenta con una Matriz MIPER formalmente actualizada en el último año?
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['SI', 'PARCIAL', 'NO'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setQ3HasMiper(opt)}
                  className={`p-4 rounded-xl border text-center font-bold transition-all ${
                    q3HasMiper === opt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {opt === 'SI' ? 'Sí, al día' : opt === 'PARCIAL' ? 'En elaboración' : 'No cuenta'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Para centros con más de 25 trabajadores: ¿Tiene Comité Paritario (CPHS) constituido con actas mensuales?
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['SI', 'PARCIAL', 'NO'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setQ4HasCphs(opt)}
                  className={`p-4 rounded-xl border text-center font-bold transition-all ${
                    q4HasCphs === opt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {opt === 'SI' ? 'Sí, activo' : opt === 'PARCIAL' ? 'En proceso elección' : 'No constituido'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              ¿El Reglamento Interno de Orden, Higiene y Seguridad (RIOHS) fue entregado a todos los trabajadores con comprobante firmado?
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['SI', 'PARCIAL', 'NO'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setQ5HasRiohs(opt)}
                  className={`p-4 rounded-xl border text-center font-bold transition-all ${
                    q5HasRiohs === opt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {opt === 'SI' ? '100% Firmado' : opt === 'PARCIAL' ? 'Faltan firmas' : 'No entregado'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              ¿Dispone de un Plan Anual de Capacitación y constancia de Obligación de Informar (ODI) por cada puesto?
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['SI', 'PARCIAL', 'NO'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setQ6HasTrainingPlan(opt)}
                  className={`p-4 rounded-xl border text-center font-bold transition-all ${
                    q6HasTrainingPlan === opt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {opt === 'SI' ? 'Sí, calendarizado' : opt === 'PARCIAL' ? 'Parcial' : 'No formalizado'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6 */}
        {step === 6 && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              ¿Se realizan y registran inspecciones periódicas a extintores, vehículos e instalaciones eléctricas?
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['SI', 'PARCIAL', 'NO'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setQ7HasInspections(opt)}
                  className={`p-4 rounded-xl border text-center font-bold transition-all ${
                    q7HasInspections === opt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {opt === 'SI' ? 'Sí, mensuales' : opt === 'PARCIAL' ? 'Ocasionales' : 'No se registran'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 7 */}
        {step === 7 && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              ¿Existe un procedimiento formal para investigar accidentes y declarar DIAT ante la mutualidad?
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['SI', 'PARCIAL', 'NO'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setQ8HasEvidenceVault(opt)}
                  className={`p-4 rounded-xl border text-center font-bold transition-all ${
                    q8HasEvidenceVault === opt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {opt === 'SI' ? 'Sí, implementado' : opt === 'PARCIAL' ? 'Informal' : 'No establecido'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Diagnostic summary */}
        {step === 8 && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  Diagnóstico Inicial Completado: Score Proyectado 81%
                </h4>
              </div>
              <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Su empresa cumple con las bases estructurales del DS 44 (MIPER y CPHS), pero requiere atención urgente en el <strong>Action Center</strong> para regularizar 3 medidas preventivas vencidas y 7 capacitaciones programadas.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-100">Plan de Acción Inmediato:</span>
              <ul className="space-y-1 list-disc pl-4 text-slate-600 dark:text-slate-400">
                <li>Revisar el Compliance Inbox con 6 tareas pendientes.</li>
                <li>Verificar evidencias de mantención eléctrica en Taller Rancagua.</li>
                <li>Descargar Informe Ejecutivo PDF para presentación a Gerencia.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Anterior
            </button>
          ) : <div />}

          {step < 8 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <span>Ir al Panel de Cumplimiento</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
