import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Company,
  ComplianceScoreSummary,
  TenantComplianceRequirement,
  PreventiveAction,
  RiskMatrix,
  Inspection,
  Incident,
} from '../types';

export class PdfGenerator {
  /**
   * Generates Executive DS44 Compliance Report
   */
  public static generateExecutiveReport(
    company: Company,
    summary: ComplianceScoreSummary,
    requirements: TenantComplianceRequirement[],
    actions: PreventiveAction[]
  ) {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });

    // Corporate Header
    doc.setFillColor(30, 41, 59); // Dark slate
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORME EJECUTIVO DE CUMPLIMIENTO DS 44', 14, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Gestión de Seguridad y Salud en el Trabajo — Ley 16.744', 14, 26);

    doc.setFontSize(9);
    doc.text(`Fecha Emisión: ${today}`, 150, 26);

    // Company Information Table
    doc.setTextColor(33, 37, 41);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('1. ANTECEDENTES DE LA EMPRESA', 14, 46);

    autoTable(doc, {
      startY: 50,
      head: [['Razón Social', 'RUT', 'Mutualidad', 'Dotación', 'Centros']],
      body: [
        [
          company.legalName,
          company.rut,
          company.mutualidad,
          `${company.workerCount} trabajadores`,
          'Santiago, Rancagua, Valparaíso',
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
    });

    // Score Summary Block
    const finalY1 = (doc as any).lastAutoTable.finalY || 70;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('2. RESUMEN DE CUMPLIMIENTO NORMATIVO DS 44', 14, finalY1 + 10);

    autoTable(doc, {
      startY: finalY1 + 14,
      head: [['Indicador Clave', 'Resultado', 'Estado']],
      body: [
        ['Nivel de Cumplimiento Global DS 44', `${summary.overallScore}%`, summary.overallScore >= 80 ? 'CONFORME' : 'BRECHA DETECTADA'],
        ['Total Obligaciones Evaluadas', `${summary.totalApplicableRequirements} requisitos`, '100% Auditadas'],
        ['Obligaciones 100% Conformes', `${summary.compliantCount} requisitos`, 'Cumplimiento Total'],
        ['Obligaciones con Brecha / Parciales', `${summary.partiallyCompliantCount} requisitos`, 'En Tratamiento'],
        ['Incumplimientos Críticos', `${summary.criticalNonCompliancesCount}`, summary.criticalNonCompliancesCount === 0 ? 'Sin alertas' : 'ATENCIÓN REQUERIDA'],
        ['Medidas Preventivas Vencidas', `${summary.overdueActionsCount}`, summary.overdueActionsCount === 0 ? 'Al día' : 'VENCIDAS'],
        ['Estado Matriz MIPER', summary.miperStatus, `Última Rev: ${summary.miperLastReview}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 3 },
    });

    // Detailed Requirements Matrix
    const finalY2 = (doc as any).lastAutoTable.finalY || 140;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('3. DETALLE DE REQUISITOS Y ESTADO DE EVIDENCIAS', 14, finalY2 + 10);

    const reqRows = requirements.map(r => [
      r.requirement.code,
      r.requirement.title,
      r.requirement.category,
      r.status === 'Compliant' ? 'Cumple (100%)' : r.status === 'PartiallyCompliant' ? `Parcial (${r.fulfillmentPercent}%)` : 'No Cumple',
      r.responsibleName,
    ]);

    autoTable(doc, {
      startY: finalY2 + 14,
      head: [['Código', 'Obligación Legal DS 44', 'Categoría', 'Estado Cumplimiento', 'Responsable']],
      body: reqRows,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 2.5 },
    });

    // Signature Footer on New Page
    doc.addPage();
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('4. PLAN DE ACCIÓN Y MEDIDAS PREVENTIVAS PRIORITARIAS', 14, 20);

    const actionRows = actions.slice(0, 12).map(a => [
      a.code,
      a.title,
      a.workCenterName,
      a.priority,
      a.dueDate,
      a.status === 'Verified' ? 'Verificada' : a.status === 'Overdue' ? 'VENCIDA' : a.status === 'Completed' ? 'Completada (Sin Verif.)' : 'En Ejecución',
      a.responsibleName,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [['Código', 'Medida Preventiva / Correctiva', 'Centro', 'Prioridad', 'Vencimiento', 'Estado', 'Responsable']],
      body: actionRows,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 2.5 },
    });

    // Signatures
    const signY = 220;
    doc.setDrawColor(150, 150, 150);
    doc.line(20, signY, 80, signY);
    doc.line(130, signY, 190, signY);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Representante Legal / Gerencia', 30, signY + 6);
    doc.text(company.legalName, 33, signY + 11);

    doc.text('Experto en Prevención de Riesgos', 138, signY + 6);
    doc.text('Registro SNS / Seremi de Salud', 140, signY + 11);

    doc.save(`Informe_Ejecutivo_DS44_${company.rut.replace(/[^0-9kK]/g, '')}.pdf`);
  }

  /**
   * Generates Official MIPER PDF
   */
  public static generateMiperReport(company: Company, matrix: RiskMatrix) {
    const doc = new jsPDF({ orientation: 'landscape' });
    const today = new Date().toLocaleDateString('es-CL');

    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 297, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`MATRIZ DE IDENTIFICACIÓN DE PELIGROS Y EVALUACIÓN DE RIESGOS (MIPER) — v${matrix.currentVersion}`, 14, 14);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Empresa: ${company.legalName} | RUT: ${company.rut} | Fecha de Aprobación: ${matrix.lastReviewDate} | Vigente hasta: ${matrix.nextReviewDate}`, 14, 22);

    const rows = matrix.assessments.map(a => [
      a.workCenterName,
      a.process,
      a.activity,
      a.jobPosition,
      a.hazardName,
      a.riskDescription,
      `${a.exposedCount}`,
      `${a.probability}`,
      `${a.consequence}`,
      `${a.riskScore}`,
      a.riskLevel,
      a.existingControls.join('; '),
      a.additionalMeasures.join('; '),
      a.responsibleName,
    ]);

    autoTable(doc, {
      startY: 34,
      head: [
        [
          'Centro',
          'Proceso',
          'Actividad',
          'Puesto',
          'Peligro',
          'Descripción del Riesgo',
          'Exp.',
          'P',
          'C',
          'MR',
          'Nivel',
          'Controles Existentes',
          'Medidas Adicionales',
          'Responsable',
        ],
      ],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: 255, fontSize: 8 },
      styles: { fontSize: 7, cellPadding: 2 },
    });

    doc.save(`MIPER_Oficial_${company.rut.replace(/[^0-9kK]/g, '')}_v${matrix.currentVersion}.pdf`);
  }

  /**
   * Generates Inspection Report PDF
   */
  public static generateInspectionReport(company: Company, inspection: Inspection) {
    const doc = new jsPDF();
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`INFORME DE INSPECCIÓN DE SEGURIDAD: ${inspection.code}`, 14, 15);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Centro: ${inspection.workCenterName} | Inspector: ${inspection.inspectorName} | Fecha: ${inspection.inspectionDate}`, 14, 23);

    autoTable(doc, {
      startY: 38,
      head: [['Pregunta / Aspecto Evaluado', 'Categoría', 'Criticidad', 'Resultado', 'Observaciones']],
      body: inspection.items.map(i => [
        i.question,
        i.category,
        i.criticality,
        i.response === 'Cumple' ? 'CUMPLE' : i.response === 'NoCumple' ? 'NO CUMPLE' : 'N/A',
        i.comments || '-',
      ]),
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 2.5 },
    });

    if (inspection.findings.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY || 150;
      doc.setTextColor(33, 37, 41);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('HALLAZGOS Y MEDIDAS CORRECTIVAS ASOCIADAS', 14, finalY + 10);

      autoTable(doc, {
        startY: finalY + 14,
        head: [['Hallazgo', 'Ubicación', 'Gravedad', 'Estado']],
        body: inspection.findings.map(f => [f.description, f.location, f.severity, f.status]),
        theme: 'striped',
        headStyles: { fillColor: [185, 28, 28], textColor: 255 },
        styles: { fontSize: 8 },
      });
    }

    doc.save(`Inspeccion_${inspection.code}.pdf`);
  }

  /**
   * Generates Incident Investigation PDF
   */
  public static generateIncidentReport(company: Company, incident: Incident) {
    const doc = new jsPDF();
    doc.setFillColor(185, 28, 28); // Red banner for incident
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`INFORME DE INVESTIGACIÓN DE ACCIDENTE: ${incident.code}`, 14, 15);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tipo: ${incident.type} | Gravedad: ${incident.severity} | Fecha: ${incident.incidentDate} ${incident.incidentTime}`, 14, 23);

    autoTable(doc, {
      startY: 38,
      head: [['Campo', 'Detalle']],
      body: [
        ['Centro de Trabajo', incident.workCenterName],
        ['Ubicación Exacta', incident.exactLocation],
        ['Trabajador Involucrado', `${incident.involvedWorkerName || 'N/A'} (RUT: ${incident.involvedWorkerRut || 'N/A'})`],
        ['Cargo', incident.involvedWorkerPosition || 'N/A'],
        ['Descripción del Hecho', incident.description],
        ['Primeros Auxilios / Acciones Inmediatas', incident.immediateActionsTaken],
        ['Denuncia OAL (DIAT)', incident.reportedToMutualidad ? `Ingresada (${incident.diatNumber || 'DIAT Registrada'})` : 'No reportado'],
        ['Días Perdidos Estimados', `${incident.daysLost} días`],
        ['Causas Inmediatas / Directas', (incident.directCauses || []).join('; ') || 'En investigación'],
        ['Causas Básicas / Raíz', (incident.rootCauses || []).join('; ') || 'En investigación'],
        ['Investigador Responsable', incident.investigatorName || 'Prevencionista de Riesgos'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3 },
    });

    doc.save(`Investigacion_Accidente_${incident.code}.pdf`);
  }
}
