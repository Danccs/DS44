import JSZip from 'jszip';
import { Company, ComplianceScoreSummary, TenantComplianceRequirement, PreventiveAction, Evidence } from '../types';

export class ZipExporter {
  public static async exportCompliancePack(
    company: Company,
    summary: ComplianceScoreSummary,
    requirements: TenantComplianceRequirement[],
    actions: PreventiveAction[],
    evidences: Evidence[]
  ): Promise<void> {
    const zip = new JSZip();
    const today = new Date().toISOString().split('T')[0];

    // 1. Manifest
    const manifest = {
      product: 'DS44 Compliance OS',
      standard: 'Decreto Supremo N.º 44 - República de Chile',
      rulesetVersion: 'DS44-CHILE-2025-v1',
      exportedAt: new Date().toISOString(),
      company: {
        legalName: company.legalName,
        rut: company.rut,
        workerCount: company.workerCount,
        mutualidad: company.mutualidad,
      },
      complianceScore: `${summary.overallScore}%`,
      status: summary.overallScore >= 80 ? 'Auditoría Conforme' : 'Con Observaciones',
    };
    zip.file('00_MANIFIESTO_LEGAL.json', JSON.stringify(manifest, null, 2));

    // 2. Score & Requirements JSON
    const reportData = {
      summary,
      requirements: requirements.map(r => ({
        code: r.requirement.code,
        article: r.requirement.articleReference,
        title: r.requirement.title,
        status: r.status,
        fulfillmentPercent: r.fulfillmentPercent,
        responsible: r.responsibleName,
        justification: r.statusJustification,
      })),
      actions: actions.map(a => ({
        code: a.code,
        title: a.title,
        workCenter: a.workCenterName,
        priority: a.priority,
        status: a.status,
        dueDate: a.dueDate,
        verifiedBy: a.verifiedBy,
      })),
    };
    zip.file('01_INFORME_CUMPLIMIENTO_DS44.json', JSON.stringify(reportData, null, 2));

    // 3. Evidence Index CSV
    const csvHeader = 'ID,Titulo,Tipo,Entidad_Asociada,Subido_Por,Fecha_Subida,Verificado,Verificador,Hash_SHA256\n';
    const csvRows = evidences.map(e =>
      `"${e.id}","${e.title.replace(/"/g, '""')}","${e.evidenceType}","${e.associatedEntityType}","${e.uploadedBy}","${e.uploadedAt}","${e.verified ? 'SI' : 'NO'}","${e.verifiedBy || ''}","${e.fileHash}"`
    ).join('\n');
    zip.file('02_INDICE_EVIDENCIAS_FOLIADAS.csv', '\uFEFF' + csvHeader + csvRows);

    // 4. Instructions Readme for Labor Inspector (DT / Seremi)
    const readme = `===============================================================
CARPETA DE AUDITORÍA Y FISCALIZACIÓN DS 44 — EXPEDIENTE DIGITAL
===============================================================
Empresa: ${company.legalName}
RUT: ${company.rut}
Fecha de Emisión: ${today}
Software de Gestión: DS44 Compliance OS (ds44.cl)

Contenido del Expediente:
- 00_MANIFIESTO_LEGAL.json : Declaración jurada de integridad del paquete.
- 01_INFORME_CUMPLIMIENTO_DS44.json : Resumen de los 12 requisitos del DS 44 auditados.
- 02_INDICE_EVIDENCIAS_FOLIADAS.csv : Índice maestro de todas las evidencias adjuntas con sus hashes criptográficos SHA-256.

Para verificar la autenticidad de este paquete o consultar la plataforma en vivo:
Ingrese en modo consulta al portal corporativo de la empresa.
`;
    zip.file('LEAME_FISCALIZADOR_DT.txt', readme);

    // Generate blob and download
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `DS44_Compliance_Pack_${company.rut.replace(/[^0-9kK]/g, '')}_${today}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
