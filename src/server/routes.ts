import { Router, Request, Response } from 'express';
import { AppStorage } from './storage';
import { ComplianceEngine } from './complianceEngine';
import { INDUSTRY_TEMPLATES } from './industryTemplates';
import {
  PreventiveAction,
  Evidence,
  RiskAssessment,
  Worker,
  Inspection,
  Incident,
  AuditLog,
} from '../types';

export const apiRouter = Router();
const storage = AppStorage.getInstance();
const complianceEngine = new ComplianceEngine();

// Helper for tenant context (defaulting to tenant-andes)
function getTenantId(req: Request): string {
  return (req.headers['x-tenant-id'] as string) || 'tenant-andes';
}

function getUserId(req: Request): string {
  return (req.headers['x-user-id'] as string) || 'usr-prev';
}

// Log audit trail
function logAudit(
  tenantId: string,
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  newValues?: any,
  oldValues?: any
) {
  const user = storage.users.find(u => u.id === userId) || { name: 'Sistema / Usuario' };
  const audit: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    tenantId,
    userId,
    userName: user.name,
    action,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
    newValues: newValues ? JSON.stringify(newValues) : undefined,
    oldValues: oldValues ? JSON.stringify(oldValues) : undefined,
    ipAddress: '127.0.0.1',
    userAgent: 'DS44 Compliance Client',
  };
  storage.auditLogs.unshift(audit);
}

// ----------------------------------------------------
// AUTH & USERS
// ----------------------------------------------------
apiRouter.get('/auth/me', (req, res) => {
  const tenantId = getTenantId(req);
  const userId = getUserId(req);
  const user = storage.users.find(u => u.id === userId) || storage.users[1];
  const tenant = storage.tenants.find(t => t.id === tenantId);
  const company = storage.companies.find(c => c.tenantId === tenantId);
  res.json({ user, tenant, company, allUsers: storage.users });
});

apiRouter.post('/auth/switch-role', (req, res) => {
  const { role } = req.body;
  const targetUser = storage.users.find(u => u.role === role);
  if (targetUser) {
    res.json({ success: true, user: targetUser });
  } else {
    res.status(404).json({ error: 'Role not found' });
  }
});

// ----------------------------------------------------
// COMPANY & WORK CENTERS
// ----------------------------------------------------
apiRouter.get('/company', (req, res) => {
  const tenantId = getTenantId(req);
  const company = storage.companies.find(c => c.tenantId === tenantId);
  if (!company) return res.status(404).json({ error: 'Empresa no encontrada' });
  res.json(company);
});

apiRouter.put('/company', (req, res) => {
  const tenantId = getTenantId(req);
  const index = storage.companies.findIndex(c => c.tenantId === tenantId);
  if (index === -1) return res.status(404).json({ error: 'Empresa no encontrada' });

  const old = storage.companies[index];
  storage.companies[index] = { ...old, ...req.body, updatedAt: new Date().toISOString() };
  logAudit(tenantId, getUserId(req), 'COMPANY_UPDATED', 'Company', old.id, storage.companies[index], old);
  res.json(storage.companies[index]);
});

apiRouter.get('/work-centers', (req, res) => {
  const tenantId = getTenantId(req);
  const centers = storage.workCenters.filter(w => w.tenantId === tenantId);
  res.json(centers);
});

apiRouter.post('/work-centers', (req, res) => {
  const tenantId = getTenantId(req);
  const newCenter = {
    id: `wc-${Date.now()}`,
    tenantId,
    companyId: req.body.companyId || 'comp-andes',
    code: req.body.code || `WC-${storage.workCenters.length + 1}`,
    name: req.body.name,
    type: req.body.type || 'branch',
    address: req.body.address || '',
    region: req.body.region || 'Región Metropolitana',
    commune: req.body.commune || 'Santiago',
    description: req.body.description || '',
    workerCount: Number(req.body.workerCount) || 0,
    managerName: req.body.managerName || 'No asignado',
    managerEmail: req.body.managerEmail || '',
    active: true,
    createdAt: new Date().toISOString(),
  };
  storage.workCenters.push(newCenter);
  logAudit(tenantId, getUserId(req), 'WORK_CENTER_CREATED', 'WorkCenter', newCenter.id, newCenter);
  res.status(201).json(newCenter);
});

// ----------------------------------------------------
// WORKERS
// ----------------------------------------------------
apiRouter.get('/workers', (req, res) => {
  const tenantId = getTenantId(req);
  const { workCenterId, status, search } = req.query;
  let list = storage.workers.filter(w => w.tenantId === tenantId);

  if (workCenterId) list = list.filter(w => w.workCenterId === workCenterId);
  if (status) list = list.filter(w => w.status === status);
  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(
      w =>
        (w.firstName || '').toLowerCase().includes(q) ||
        (w.lastName || '').toLowerCase().includes(q) ||
        (w.fullName || '').toLowerCase().includes(q) ||
        (w.rut || '').toLowerCase().includes(q) ||
        (w.jobPosition || '').toLowerCase().includes(q)
    );
  }
  res.json(list);
});

apiRouter.post('/workers', (req, res) => {
  const tenantId = getTenantId(req);
  const newWorker: Worker = {
    id: `wrk-${Date.now()}`,
    tenantId,
    workCenterId: req.body.workCenterId || 'wc-santiago',
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    rut: req.body.rut,
    email: req.body.email || '',
    phone: req.body.phone || '',
    jobPosition: req.body.jobPosition,
    area: req.body.area || 'Operaciones',
    hireDate: req.body.hireDate || new Date().toISOString().split('T')[0],
    supervisorName: req.body.supervisorName || 'Jefe Directo',
    status: req.body.status || 'active',
    emergencyContact: req.body.emergencyContact || 'Familiar',
    emergencyPhone: req.body.emergencyPhone || '',
    odiSigned: Boolean(req.body.odiSigned),
    odiDate: req.body.odiDate,
    medicalExamValidUntil: req.body.medicalExamValidUntil,
    eppDelivered: Boolean(req.body.eppDelivered),
    createdAt: new Date().toISOString(),
  };
  storage.workers.push(newWorker);
  logAudit(tenantId, getUserId(req), 'WORKER_CREATED', 'Worker', newWorker.id, newWorker);
  res.status(201).json(newWorker);
});

apiRouter.post('/workers/import', (req, res) => {
  const tenantId = getTenantId(req);
  const { workersList } = req.body;
  if (!Array.isArray(workersList) || workersList.length === 0) {
    return res.status(400).json({ error: 'Lista vacía o formato inválido' });
  }

  let importedCount = 0;
  workersList.forEach((raw: any) => {
    const worker: Worker = {
      id: `wrk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tenantId,
      workCenterId: raw.workCenterId || 'wc-santiago',
      firstName: raw.firstName || raw.nombre || 'Trabajador',
      lastName: raw.lastName || raw.apellido || 'Nuevo',
      rut: raw.rut || '11.111.111-1',
      email: raw.email || '',
      phone: raw.phone || '',
      jobPosition: raw.jobPosition || raw.cargo || 'Operario',
      area: raw.area || 'Operaciones',
      hireDate: raw.hireDate || new Date().toISOString().split('T')[0],
      supervisorName: raw.supervisorName || 'Supervisor',
      status: 'active',
      emergencyContact: '',
      emergencyPhone: '',
      odiSigned: Boolean(raw.odiSigned),
      odiDate: raw.odiDate,
      medicalExamValidUntil: raw.medicalExamValidUntil,
      eppDelivered: true,
      createdAt: new Date().toISOString(),
    };
    storage.workers.push(worker);
    importedCount++;
  });

  logAudit(tenantId, getUserId(req), 'WORKERS_IMPORTED_CSV', 'Worker', 'bulk', { count: importedCount });
  res.json({ success: true, count: importedCount });
});

// ----------------------------------------------------
// MIPER & RISKS
// ----------------------------------------------------
apiRouter.get('/risk-matrices', (req, res) => {
  const tenantId = getTenantId(req);
  const matrices = storage.riskMatrices.filter(m => m.tenantId === tenantId);
  res.json(matrices);
});

apiRouter.get('/risk-methodologies', (_req, res) => {
  res.json(storage.methodologies);
});

apiRouter.post('/risk-matrices/:id/assessments', (req, res) => {
  const tenantId = getTenantId(req);
  const matrix = storage.riskMatrices.find(m => m.id === req.params.id && m.tenantId === tenantId);
  if (!matrix) return res.status(404).json({ error: 'MIPER no encontrada' });

  const raw = req.body;
  const prob = Number(raw.probability) || 3;
  const cons = Number(raw.consequence) || 3;
  const score = prob * cons;

  let level: any = 'Bajo';
  if (score >= 17) level = 'Crítico';
  else if (score >= 10) level = 'Alto';
  else if (score >= 5) level = 'Medio';

  const newAssessment: RiskAssessment = {
    id: `ra-${Date.now()}`,
    matrixId: matrix.id,
    workCenterId: raw.workCenterId || 'wc-santiago',
    workCenterName: raw.workCenterName || 'Base Central Santiago',
    process: raw.process || 'General',
    activity: raw.activity || 'Actividad Operacional',
    jobPosition: raw.jobPosition || 'Operador',
    hazardId: raw.hazardId || 'haz-01',
    hazardName: raw.hazardName || 'Peligro No Especificado',
    hazardCategory: raw.hazardCategory || 'Físico',
    riskDescription: raw.riskDescription || '',
    exposedCount: Number(raw.exposedCount) || 1,
    probability: prob,
    consequence: cons,
    riskScore: score,
    riskLevel: level,
    existingControls: Array.isArray(raw.existingControls) ? raw.existingControls : [raw.existingControls].filter(Boolean),
    additionalMeasures: Array.isArray(raw.additionalMeasures) ? raw.additionalMeasures : [raw.additionalMeasures].filter(Boolean),
    responsibleName: raw.responsibleName || 'Camila Soto Valenzuela',
    targetDate: raw.targetDate || '2025-04-30',
    status: 'EnControl',
    evidenceIds: [],
    updatedAt: new Date().toISOString(),
  };

  matrix.assessments.push(newAssessment);
  logAudit(tenantId, getUserId(req), 'RISK_ASSESSMENT_ADDED', 'RiskAssessment', newAssessment.id, newAssessment);
  res.status(201).json(newAssessment);
});

apiRouter.post('/risk-matrices/:id/new-version', (req, res) => {
  const tenantId = getTenantId(req);
  const matrix = storage.riskMatrices.find(m => m.id === req.params.id && m.tenantId === tenantId);
  if (!matrix) return res.status(404).json({ error: 'MIPER no encontrada' });

  const nextVerNumber = matrix.currentVersion + 1;
  const newVer = {
    id: `ver-${Date.now()}`,
    matrixId: matrix.id,
    versionNumber: nextVerNumber,
    versionName: req.body.versionName || `MIPER Revisión v${nextVerNumber}`,
    approvedBy: req.body.approvedBy || 'Carlos Mendoza Silva y Camila Soto',
    approvalDate: new Date().toISOString().split('T')[0],
    effectiveFrom: new Date().toISOString().split('T')[0],
    effectiveTo: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    changelog: req.body.changelog || 'Actualización periódica reglamentaria DS44',
    isCurrent: true,
    totalAssessments: matrix.assessments.length,
    criticalRisksCount: matrix.assessments.filter(a => a.riskLevel === 'Crítico').length,
    highRisksCount: matrix.assessments.filter(a => a.riskLevel === 'Alto').length,
    mediumRisksCount: matrix.assessments.filter(a => a.riskLevel === 'Medio').length,
    lowRisksCount: matrix.assessments.filter(a => a.riskLevel === 'Bajo').length,
  };

  matrix.versions.forEach(v => (v.isCurrent = false));
  matrix.versions.unshift(newVer);
  matrix.currentVersion = nextVerNumber;
  matrix.lastReviewDate = newVer.effectiveFrom;
  matrix.nextReviewDate = newVer.effectiveTo;

  logAudit(tenantId, getUserId(req), 'MIPER_NEW_VERSION_CREATED', 'RiskMatrixVersion', newVer.id, newVer);
  res.json({ success: true, matrix, newVersion: newVer });
});

// ----------------------------------------------------
// PREVENTIVE PROGRAM & ACTION CENTER
// ----------------------------------------------------
apiRouter.get('/preventive-programs', (req, res) => {
  const tenantId = getTenantId(req);
  const programs = storage.preventivePrograms.filter(p => p.tenantId === tenantId);
  res.json(programs);
});

apiRouter.get('/actions', (req, res) => {
  const tenantId = getTenantId(req);
  const { status, priority, workCenterId, responsible } = req.query;
  let list = storage.preventiveActions.filter(a => a.tenantId === tenantId);

  if (status) list = list.filter(a => a.status === status);
  if (priority) list = list.filter(a => a.priority === priority);
  if (workCenterId) list = list.filter(a => a.workCenterId === workCenterId);
  if (responsible) {
    const rQuery = (responsible as string).toLowerCase();
    list = list.filter(a => (a.responsibleName || '').toLowerCase().includes(rQuery));
  }

  res.json(list);
});

apiRouter.post('/actions', (req, res) => {
  const tenantId = getTenantId(req);
  const codeNum = storage.preventiveActions.length + 1;
  const newAction: PreventiveAction = {
    id: `act-${Date.now()}`,
    tenantId,
    code: `MED-2025-${codeNum.toString().padStart(3, '0')}`,
    title: req.body.title,
    description: req.body.description || '',
    origin: req.body.origin || 'MIPER',
    originReferenceId: req.body.originReferenceId,
    riskAssessmentId: req.body.riskAssessmentId,
    workCenterId: req.body.workCenterId || 'wc-santiago',
    workCenterName: req.body.workCenterName || 'Base Central Santiago',
    priority: req.body.priority || 'Media',
    responsibleName: req.body.responsibleName || 'Responsable Asignado',
    responsibleEmail: req.body.responsibleEmail || '',
    startDate: req.body.startDate || new Date().toISOString().split('T')[0],
    dueDate: req.body.dueDate || new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
    status: 'Pending',
    progressPercent: 0,
    evidenceIds: [],
    commentsCount: 0,
    regulatoryRequirementCode: req.body.regulatoryRequirementCode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  storage.preventiveActions.unshift(newAction);
  logAudit(tenantId, getUserId(req), 'PREVENTIVE_ACTION_CREATED', 'PreventiveAction', newAction.id, newAction);
  res.status(201).json(newAction);
});

apiRouter.put('/actions/:id', (req, res) => {
  const tenantId = getTenantId(req);
  const index = storage.preventiveActions.findIndex(a => a.id === req.params.id && a.tenantId === tenantId);
  if (index === -1) return res.status(404).json({ error: 'Medida no encontrada' });

  const old = storage.preventiveActions[index];
  const updated: PreventiveAction = {
    ...old,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  // If status moved to completed
  if (req.body.status === 'Completed' && old.status !== 'Completed') {
    updated.completedDate = new Date().toISOString().split('T')[0];
    updated.progressPercent = 100;
  }

  storage.preventiveActions[index] = updated;
  logAudit(tenantId, getUserId(req), 'PREVENTIVE_ACTION_UPDATED', 'PreventiveAction', updated.id, updated, old);
  res.json(updated);
});

apiRouter.post('/actions/:id/verify', (req, res) => {
  const tenantId = getTenantId(req);
  const index = storage.preventiveActions.findIndex(a => a.id === req.params.id && a.tenantId === tenantId);
  if (index === -1) return res.status(404).json({ error: 'Medida no encontrada' });

  const { verifiedBy, verificationNotes, status } = req.body;
  const action = storage.preventiveActions[index];

  action.status = status === 'Rejected' ? 'Rejected' : 'Verified';
  action.verifiedDate = new Date().toISOString().split('T')[0];
  action.verifiedBy = verifiedBy || 'Camila Soto Valenzuela (Prevencionista)';
  action.verificationNotes = verificationNotes || 'Evidencia técnica conforme a normativa.';
  action.updatedAt = new Date().toISOString();

  logAudit(tenantId, getUserId(req), 'ACTION_VERIFIED_HSE', 'PreventiveAction', action.id, {
    status: action.status,
    verifiedBy: action.verifiedBy,
  });

  res.json(action);
});

// ----------------------------------------------------
// EVIDENCES
// ----------------------------------------------------
apiRouter.get('/evidence', (req, res) => {
  const tenantId = getTenantId(req);
  const { associatedEntityId, entityType } = req.query;
  let list = storage.evidences.filter(e => e.tenantId === tenantId);

  if (associatedEntityId) list = list.filter(e => e.associatedEntityId === associatedEntityId);
  if (entityType) list = list.filter(e => e.associatedEntityType === entityType);

  res.json(list);
});

apiRouter.post('/evidence', (req, res) => {
  const tenantId = getTenantId(req);
  const raw = req.body;
  const fakeHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  const newEvidence: Evidence = {
    id: `evi-${Date.now()}`,
    tenantId,
    title: raw.title || 'Evidencia de Cumplimiento',
    description: raw.description || '',
    evidenceType: raw.evidenceType || 'Fotografía',
    fileUrl: raw.fileUrl || '/uploads/evidences/evidencia_adjunta.pdf',
    fileName: raw.fileName || 'evidencia_documental.pdf',
    fileSize: Number(raw.fileSize) || 1024000,
    fileMimeType: raw.fileMimeType || 'application/pdf',
    fileHash: fakeHash,
    uploadedBy: raw.uploadedBy || 'Camila Soto Valenzuela',
    uploadedAt: new Date().toISOString(),
    associatedEntityType: raw.associatedEntityType || 'PreventiveAction',
    associatedEntityId: raw.associatedEntityId || 'act-01',
    verified: false,
  };

  storage.evidences.unshift(newEvidence);

  // Link to action if applicable
  if (newEvidence.associatedEntityType === 'PreventiveAction' && newEvidence.associatedEntityId) {
    const action = storage.preventiveActions.find(a => a.id === newEvidence.associatedEntityId);
    if (action && !action.evidenceIds.includes(newEvidence.id)) {
      action.evidenceIds.push(newEvidence.id);
    }
  }

  logAudit(tenantId, getUserId(req), 'EVIDENCE_UPLOADED', 'Evidence', newEvidence.id, newEvidence);
  res.status(201).json(newEvidence);
});

apiRouter.post('/evidence/:id/verify', (req, res) => {
  const tenantId = getTenantId(req);
  const evidence = storage.evidences.find(e => e.id === req.params.id && e.tenantId === tenantId);
  if (!evidence) return res.status(404).json({ error: 'Evidencia no encontrada' });

  evidence.verified = true;
  evidence.verifiedBy = req.body.verifiedBy || 'Camila Soto Valenzuela';
  evidence.verifiedAt = new Date().toISOString();
  evidence.verificationComment = req.body.comment || 'Evidencia legal aprobada';

  logAudit(tenantId, getUserId(req), 'EVIDENCE_VERIFIED', 'Evidence', evidence.id, evidence);
  res.json(evidence);
});

// ----------------------------------------------------
// TRAININGS
// ----------------------------------------------------
apiRouter.get('/trainings', (req, res) => {
  const tenantId = getTenantId(req);
  const list = storage.trainings.filter(t => t.tenantId === tenantId);
  res.json(list);
});

apiRouter.get('/worker-trainings', (req, res) => {
  const tenantId = getTenantId(req);
  const { trainingId, status, workerId } = req.query;
  let list = storage.workerTrainings.filter(wt => wt.tenantId === tenantId);

  if (trainingId) list = list.filter(wt => wt.trainingId === trainingId);
  if (status) list = list.filter(wt => wt.status === status);
  if (workerId) list = list.filter(wt => wt.workerId === workerId);

  res.json(list);
});

apiRouter.post('/trainings', (req, res) => {
  const tenantId = getTenantId(req);
  const newTraining = {
    id: `tr-${Date.now()}`,
    tenantId,
    title: req.body.title,
    topic: req.body.topic || 'Seguridad y Salud Laboral',
    description: req.body.description || '',
    durationHours: Number(req.body.durationHours) || 4,
    trainerName: req.body.trainerName || 'Mutual de Seguridad',
    trainerOrganization: req.body.trainerOrganization || 'Mutual de Seguridad',
    scheduledDate: req.body.scheduledDate || new Date().toISOString().split('T')[0],
    validityMonths: Number(req.body.validityMonths) || 12,
    workCenterId: req.body.workCenterId || 'wc-santiago',
    workCenterName: req.body.workCenterName || 'Base Central Santiago',
    status: 'Planificada',
    totalEnrolled: Number(req.body.totalEnrolled) || 0,
    totalAttended: 0,
    evidenceIds: [],
    createdAt: new Date().toISOString(),
  };

  storage.trainings.unshift(newTraining as any);
  logAudit(tenantId, getUserId(req), 'TRAINING_CREATED', 'Training', newTraining.id, newTraining);
  res.status(201).json(newTraining);
});

// ----------------------------------------------------
// INSPECTIONS
// ----------------------------------------------------
apiRouter.get('/inspections', (req, res) => {
  const tenantId = getTenantId(req);
  const list = storage.inspections.filter(i => i.tenantId === tenantId);
  res.json(list);
});

apiRouter.post('/inspections', (req, res) => {
  const tenantId = getTenantId(req);
  const raw = req.body;
  const codeNum = storage.inspections.length + 1;

  const newInspection: Inspection = {
    id: `insp-${Date.now()}`,
    tenantId,
    code: `INSP-2025-${codeNum.toString().padStart(3, '0')}`,
    title: raw.title || 'Inspección de Seguridad',
    templateName: raw.templateName || 'Checklist Estándar',
    workCenterId: raw.workCenterId || 'wc-santiago',
    workCenterName: raw.workCenterName || 'Base Central Santiago',
    area: raw.area || 'General',
    inspectorName: raw.inspectorName || 'Camila Soto Valenzuela',
    inspectionDate: raw.inspectionDate || new Date().toISOString().split('T')[0],
    scorePercent: Number(raw.scorePercent) || 85,
    status: raw.status || 'Finalizada',
    items: raw.items || [],
    findings: raw.findings || [],
    evidenceIds: raw.evidenceIds || [],
    createdAt: new Date().toISOString(),
  };

  storage.inspections.unshift(newInspection);
  logAudit(tenantId, getUserId(req), 'INSPECTION_RECORDED', 'Inspection', newInspection.id, newInspection);
  res.status(201).json(newInspection);
});

// ----------------------------------------------------
// INCIDENTS
// ----------------------------------------------------
apiRouter.get('/incidents', (req, res) => {
  const tenantId = getTenantId(req);
  const list = storage.incidents.filter(i => i.tenantId === tenantId);
  res.json(list);
});

apiRouter.post('/incidents', (req, res) => {
  const tenantId = getTenantId(req);
  const raw = req.body;
  const codeNum = storage.incidents.length + 1;

  const newIncident: Incident = {
    id: `inc-${Date.now()}`,
    tenantId,
    code: `INC-2025-${codeNum.toString().padStart(3, '0')}`,
    type: raw.type || 'Accidente con Tiempo Perdido (CTP)',
    severity: raw.severity || 'Grave',
    incidentDate: raw.incidentDate || new Date().toISOString().split('T')[0],
    incidentTime: raw.incidentTime || '10:00',
    workCenterId: raw.workCenterId || 'wc-santiago',
    workCenterName: raw.workCenterName || 'Base Central Santiago',
    exactLocation: raw.exactLocation || '',
    involvedWorkerId: raw.involvedWorkerId,
    involvedWorkerName: raw.involvedWorkerName,
    involvedWorkerRut: raw.involvedWorkerRut,
    involvedWorkerPosition: raw.involvedWorkerPosition,
    description: raw.description || '',
    immediateActionsTaken: raw.immediateActionsTaken || '',
    reportedToMutualidad: Boolean(raw.reportedToMutualidad),
    diatNumber: raw.diatNumber,
    daysLost: Number(raw.daysLost) || 0,
    investigationStatus: raw.investigationStatus || 'Pendiente',
    investigatorName: raw.investigatorName || 'Camila Soto Valenzuela',
    directCauses: raw.directCauses || [],
    rootCauses: raw.rootCauses || [],
    correctiveActionIds: [],
    evidenceIds: [],
    miperRevisionTriggered: true,
    createdAt: new Date().toISOString(),
  };

  storage.incidents.unshift(newIncident);

  // Automatically generate Compliance Trigger for MIPER revision
  const trigger = {
    id: `trig-${Date.now()}`,
    tenantId,
    triggerType: 'ACCIDENT_REPORTED' as const,
    title: `Revisión MIPER exigida por Accidente ${newIncident.code}`,
    description: `Accidente registrado en ${newIncident.workCenterName} (${newIncident.type}). Requiere revisión de controles en matriz.`,
    affectedEntity: `MIPER - ${newIncident.workCenterName}`,
    suggestedAction: 'Reevaluar probabilidad y controles existentes en la actividad involucrada.',
    status: 'Pending' as const,
    createdAt: new Date().toISOString(),
  };
  storage.complianceTriggers.unshift(trigger);

  logAudit(tenantId, getUserId(req), 'INCIDENT_REPORTED', 'Incident', newIncident.id, newIncident);
  res.status(201).json(newIncident);
});

// ----------------------------------------------------
// COMPLIANCE ENGINE ENDPOINTS
// ----------------------------------------------------
apiRouter.get('/compliance/summary', (req, res) => {
  const tenantId = getTenantId(req);
  const summary = complianceEngine.calculateScore(tenantId);
  res.json(summary);
});

apiRouter.get('/compliance/inbox', (req, res) => {
  const tenantId = getTenantId(req);
  const inbox = complianceEngine.generateInboxItems(tenantId);
  res.json(inbox);
});

apiRouter.get('/compliance/requirements', (req, res) => {
  const tenantId = getTenantId(req);
  const list = storage.tenantRequirements.filter(r => r.tenantId === tenantId);
  res.json(list);
});

apiRouter.get('/compliance/triggers', (req, res) => {
  const tenantId = getTenantId(req);
  const list = storage.complianceTriggers.filter(t => t.tenantId === tenantId);
  res.json(list);
});

// ----------------------------------------------------
// DOCUMENTS & AUDIT
// ----------------------------------------------------
apiRouter.get('/documents', (req, res) => {
  const tenantId = getTenantId(req);
  const list = storage.documents.filter(d => d.tenantId === tenantId);
  res.json(list);
});

apiRouter.post('/documents', (req, res) => {
  const tenantId = getTenantId(req);
  const raw = req.body;
  const newDoc = {
    id: `doc-${Date.now()}`,
    tenantId,
    code: `DOC-${Date.now().toString().slice(-4)}`,
    title: raw.title,
    category: raw.category || 'Políticas',
    version: raw.version || '1.0',
    fileName: raw.fileName || 'documento.pdf',
    fileUrl: raw.fileUrl || '/uploads/docs/documento.pdf',
    fileSize: Number(raw.fileSize) || 500000,
    uploadedBy: raw.uploadedBy || 'Camila Soto Valenzuela',
    uploadDate: new Date().toISOString().split('T')[0],
    validUntil: raw.validUntil,
    workCenterId: raw.workCenterId,
    workCenterName: raw.workCenterName,
    regulatoryRequirementCode: raw.regulatoryRequirementCode,
    status: 'Vigente',
    tags: raw.tags || [],
  };
  storage.documents.unshift(newDoc as any);
  logAudit(tenantId, getUserId(req), 'DOCUMENT_UPLOADED', 'DocumentItem', newDoc.id, newDoc);
  res.status(201).json(newDoc);
});

apiRouter.get('/audit-logs', (req, res) => {
  const tenantId = getTenantId(req);
  const list = storage.auditLogs.filter(a => a.tenantId === tenantId);
  res.json(list);
});

apiRouter.get('/notifications', (req, res) => {
  const tenantId = getTenantId(req);
  const list = storage.notifications.filter(n => n.tenantId === tenantId);
  res.json(list);
});

apiRouter.post('/notifications/mark-all-read', (req, res) => {
  const tenantId = getTenantId(req);
  storage.notifications.filter(n => n.tenantId === tenantId).forEach(n => (n.read = true));
  res.json({ success: true });
});

apiRouter.get('/industry-templates', (_req, res) => {
  res.json(INDUSTRY_TEMPLATES);
});

// Full Audit Compliance Pack Data (For Audit Mode & Export Pack)
apiRouter.get('/compliance/audit-pack', (req, res) => {
  const tenantId = getTenantId(req);
  const company = storage.companies.find(c => c.tenantId === tenantId);
  const workCenters = storage.workCenters.filter(w => w.tenantId === tenantId);
  const miper = storage.riskMatrices.find(m => m.tenantId === tenantId);
  const program = storage.preventivePrograms.find(p => p.tenantId === tenantId);
  const actions = storage.preventiveActions.filter(a => a.tenantId === tenantId);
  const evidences = storage.evidences.filter(e => e.tenantId === tenantId);
  const requirements = storage.tenantRequirements.filter(r => r.tenantId === tenantId);
  const score = complianceEngine.calculateScore(tenantId);
  const auditLogs = storage.auditLogs.filter(a => a.tenantId === tenantId).slice(0, 50);

  res.json({
    generatedAt: new Date().toISOString(),
    regulation: 'Decreto Supremo N.º 44 - República de Chile',
    ruleset: 'DS44-CHILE-2025-v1',
    company,
    score,
    workCenters,
    miper,
    program,
    actions,
    evidences,
    requirements,
    auditLogs,
  });
});
