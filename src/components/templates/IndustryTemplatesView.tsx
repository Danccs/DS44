import React, { useState } from 'react';
import {
  Layers,
  Truck,
  HardHat,
  Wrench,
  Sparkles,
  Shield,
  CheckCircle,
  Download,
  Check,
} from 'lucide-react';
import { IndustryTemplate } from '../../types';

interface IndustryTemplatesViewProps {
  templates: IndustryTemplate[];
  onApplyTemplate: (templateId: string) => Promise<void>;
}

export const IndustryTemplatesView: React.FC<IndustryTemplatesViewProps> = ({
  templates,
  onApplyTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<IndustryTemplate | null>(templates[0] || null);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const getIcon = (id: string = '') => {
    const cleanId = (id || '').toLowerCase();
    if (cleanId.includes('transporte')) return Truck;
    if (cleanId.includes('construccion')) return HardHat;
    if (cleanId.includes('taller')) return Wrench;
    return Layers;
  };

  const handleApply = async () => {
    if (!selectedTemplate) return;
    setIsApplying(true);
    try {
      await onApplyTemplate(selectedTemplate.id);
      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 3000);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Plantillas Sectoriales de Gestión Preventiva DS 44
          </h2>
          <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-full font-mono">
            5 Industrias Chilenas
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Kits normativos precargados con matriz de riesgos MIPER, programas preventivos tipo, listas de chequeo y protocolos técnicos validados para PYMEs de Chile.
        </p>
      </div>

      {appliedSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>¡Plantilla sectorial aplicada con éxito! Los peligros, listas de chequeo y programas fueron importados al sistema.</span>
        </div>
      )}

      {/* Grid of Templates & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="space-y-3">
          {templates.map((tpl) => {
            const Icon = getIcon(tpl.id);
            const isSelected = selectedTemplate?.id === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-xs cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{tpl.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">v{tpl.version}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{tpl.description}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Template Preview */}
        {selectedTemplate && (
          <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Detalle del Kit Normativo
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedTemplate.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{selectedTemplate.description}</p>
              </div>

              <button
                onClick={handleApply}
                disabled={isApplying}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs shrink-0"
              >
                {isApplying ? 'Importando...' : 'Aplicar Plantilla a la Empresa'}
              </button>
            </div>

            {/* Included Hazards */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Peligros Críticos Precargados ({selectedTemplate.defaultHazards.length}):
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedTemplate.defaultHazards.map((h, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 block">{h.category}</span>
                    <strong className="text-slate-800 dark:text-slate-200">{h.hazardName}</strong>
                    <p className="text-[11px] text-slate-500">{h.riskDescription}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard Checklists */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Listas de Chequeo y Pautas Técnicas Incluidas:
              </h5>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.standardChecklists.map((chk, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium">
                    ✓ {chk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
