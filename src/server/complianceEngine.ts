import { AppStorage } from './storage';
import {
  ComplianceScoreSummary,
  ComplianceInboxItem,
  TenantComplianceRequirement,
  PreventiveAction,
} from '../types';

export class ComplianceEngine {
  private storage: AppStorage;

  constructor() {
    this.storage = AppStorage.getInstance();
  }

  /**
   * Calculates dynamic compliance score & breakdown for a given tenant
   */
  public calculateScore(tenantId: string): ComplianceScoreSummary {
    const tenantReqs = this.storage.tenantRequirements.filter(r => r.tenantId === tenantId);
    const actions = this.storage.preventiveActions.filter(a => a.tenantId === tenantId);
    const workerTrainings = this.storage.workerTrainings.filter(wt => wt.tenantId === tenantId);
    const miper = this.storage.riskMatrices.find(m => m.tenantId === tenantId);

    // Sum weights
    let totalWeight = 0;
    let satisfiedWeight = 0;

    let compliantCount = 0;
    let partiallyCompliantCount = 0;
    let nonCompliantCount = 0;
    let needsReviewCount = 0;
    let criticalNonCompliances = 0;

    const categoryMap: { [key: string]: { weight: number; satisfied: number; count: number; compliant: number } } = {};

    tenantReqs.forEach(tr => {
      const weight = tr.requirement.weight || 5;
      totalWeight += weight;

      if (!categoryMap[tr.requirement.category]) {
        categoryMap[tr.requirement.category] = { weight: 0, satisfied: 0, count: 0, compliant: 0 };
      }
      categoryMap[tr.requirement.category].weight += weight;
      categoryMap[tr.requirement.category].count += 1;

      if (tr.status === 'Compliant') {
        satisfiedWeight += weight;
        compliantCount++;
        categoryMap[tr.requirement.category].satisfied += weight;
        categoryMap[tr.requirement.category].compliant += 1;
      } else if (tr.status === 'PartiallyCompliant') {
        const factor = (tr.fulfillmentPercent || 50) / 100;
        satisfiedWeight += weight * factor;
        partiallyCompliantCount++;
        categoryMap[tr.requirement.category].satisfied += weight * factor;
      } else if (tr.status === 'NeedsReview') {
        needsReviewCount++;
      } else if (tr.status === 'NonCompliant') {
        nonCompliantCount++;
        if (tr.requirement.criticality === 'Crítica') {
          criticalNonCompliances++;
        }
      }
    });

    const overallScore = totalWeight > 0 ? Math.round((satisfiedWeight / totalWeight) * 100) : 0;

    const overdueActionsCount = actions.filter(a => a.status === 'Overdue').length;
    const expiringTrainingsCount = workerTrainings.filter(wt => wt.status === 'ProximaAVencer' || wt.status === 'Vencida').length;
    
    // Actions completed but pending verification & evidence
    const pendingEvidencesCount = actions.filter(
      a => a.status === 'Completed' || (a.status === 'InProgress' && a.evidenceIds.length === 0 && a.priority === 'Crítica')
    ).length;

    const scoreByCategory = Object.keys(categoryMap).map(cat => ({
      category: cat,
      score: categoryMap[cat].weight > 0 ? Math.round((categoryMap[cat].satisfied / categoryMap[cat].weight) * 100) : 0,
      total: categoryMap[cat].count,
      compliant: categoryMap[cat].compliant,
    }));

    const verifiedProgActions = actions.filter(a => a.status === 'Verified').length;
    const totalProgActions = actions.length;
    const preventiveProgramProgress = totalProgActions > 0 ? Math.round((verifiedProgActions / totalProgActions) * 100) : 0;

    return {
      overallScore,
      totalApplicableRequirements: tenantReqs.length,
      compliantCount,
      partiallyCompliantCount,
      nonCompliantCount,
      needsReviewCount,
      criticalNonCompliancesCount: criticalNonCompliances + (overdueActionsCount > 0 ? 1 : 0),
      overdueActionsCount,
      expiringTrainingsCount,
      pendingEvidencesCount,
      miperStatus: miper?.status || 'Vigente',
      miperLastReview: miper?.lastReviewDate || '2025-01-15',
      preventiveProgramProgress,
      scoreByCategory,
    };
  }

  /**
   * Generates actionable items for Compliance Inbox
   */
  public generateInboxItems(tenantId: string): ComplianceInboxItem[] {
    const items: ComplianceInboxItem[] = [];
    const actions = this.storage.preventiveActions.filter(a => a.tenantId === tenantId);
    const workerTrainings = this.storage.workerTrainings.filter(wt => wt.tenantId === tenantId);
    const triggers = this.storage.complianceTriggers.filter(t => t.tenantId === tenantId && t.status !== 'Resolved');
    const inspections = this.storage.inspections.filter(i => i.tenantId === tenantId);

    // 1. Overdue Actions
    actions
      .filter(a => a.status === 'Overdue')
      .forEach(a => {
        items.push({
          id: `inbox-overdue-${a.id}`,
          type: 'OVERDUE_ACTION',
          severity: 'critical',
          title: `Medida Vencida: ${a.title}`,
          description: `Asignada a ${a.responsibleName} (${a.workCenterName}). Fecha límite fue el ${a.dueDate}.`,
          responsible: a.responsibleName,
          dueDate: a.dueDate,
          daysRemainingOrOverdue: -5,
          relatedEntityId: a.id,
          relatedEntityType: 'PreventiveAction',
          actionUrl: `/actions?highlight=${a.id}`,
          quickActionLabel: 'Gestionar Medida',
          resolved: false,
        });
      });

    // 2. Actions marked Completed but missing verification / evidence
    actions
      .filter(a => a.status === 'Completed' && a.evidenceIds.length === 0)
      .forEach(a => {
        items.push({
          id: `inbox-evidence-${a.id}`,
          type: 'MISSING_EVIDENCE',
          severity: 'warning',
          title: `Evidencia Requerida: ${a.title}`,
          description: `La tarea fue terminada por ${a.responsibleName} pero requiere adjuntar documento o fotografía para su verificación legal.`,
          responsible: a.responsibleName,
          dueDate: a.dueDate,
          daysRemainingOrOverdue: 2,
          relatedEntityId: a.id,
          relatedEntityType: 'PreventiveAction',
          actionUrl: `/evidence/upload?actionId=${a.id}`,
          quickActionLabel: 'Adjuntar Evidencia',
          resolved: false,
        });
      });

    // 3. Triggers for MIPER review (e.g. Accidents)
    triggers.forEach(t => {
      items.push({
        id: `inbox-trigger-${t.id}`,
        type: 'MIPER_REVIEW_NEEDED',
        severity: 'critical',
        title: t.title,
        description: t.description,
        responsible: 'Prevencionista de Riesgos',
        dueDate: new Date().toISOString().split('T')[0],
        daysRemainingOrOverdue: 0,
        relatedEntityId: t.id,
        relatedEntityType: 'ComplianceTrigger',
        actionUrl: `/miper?reviewTrigger=${t.id}`,
        quickActionLabel: 'Revisar MIPER',
        resolved: false,
      });
    });

    // 4. Expiring Worker Trainings
    const expiring = workerTrainings.filter(wt => wt.status === 'ProximaAVencer');
    if (expiring.length > 0) {
      items.push({
        id: 'inbox-trainings-expiring',
        type: 'EXPIRING_TRAINING',
        severity: 'warning',
        title: `${expiring.length} Capacitaciones Vencen en los Próximos 30 Días`,
        description: `Trabajadores de conducción y operaciones requieren re-instrucción periódica en Mutualidad.`,
        responsible: 'Camila Soto Valenzuela',
        dueDate: expiring[0].expiresAt || '2025-03-10',
        daysRemainingOrOverdue: 15,
        relatedEntityId: 'tr-01',
        relatedEntityType: 'Training',
        actionUrl: `/trainings?filter=expiring`,
        quickActionLabel: 'Programar Cursos',
        resolved: false,
      });
    }

    // 5. Open Findings from Inspections
    inspections.forEach(insp => {
      insp.findings.filter(f => f.status === 'Abierto' || f.status === 'EnTratamiento').forEach(f => {
        if (!items.some(i => (i.title || '').includes(f.description || ''))) {
          items.push({
            id: `inbox-finding-${f.id}`,
            type: 'UNRESOLVED_FINDING',
            severity: f.severity === 'Gravísima' ? 'critical' : 'warning',
            title: `Hallazgo de Inspección: ${f.description}`,
            description: `Detectado en ${f.location} (${insp.title}).`,
            responsible: 'Supervisor de Centro',
            dueDate: insp.inspectionDate,
            daysRemainingOrOverdue: -3,
            relatedEntityId: f.id,
            relatedEntityType: 'Finding',
            actionUrl: `/inspections/${insp.id}`,
            quickActionLabel: 'Ver Hallazgo',
            resolved: false,
          });
        }
      });
    });

    return items;
  }
}
