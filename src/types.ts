// ==========================================
// DS44 COMPLIANCE OS — DOMAIN TYPES
// ==========================================

export type UserRole =
  | 'admin'
  | 'prevencionista'
  | 'supervisor'
  | 'responsable'
  | 'trabajador'
  | 'auditor';

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  jobTitle: string;
  workCenterId?: string;
  active: boolean;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  active: boolean;
}

export type MutualidadType =
  | 'ACHS'
  | 'Mutual de Seguridad'
  | 'IST'
  | 'ISL'
  | 'Administración Delegada';

export interface Company {
  id: string;
  tenantId: string;
  legalName: string;
  rut: string;
  tradeName: string;
  economicActivity: string;
  industry: string;
  workerCount: number;
  address: string;
  region: string;
  commune: string;
  legalRepresentative: string;
  legalRepresentativeRut: string;
  mutualidad: MutualidadType;
  email: string;
  phone: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkCenter {
  id: string;
  tenantId: string;
  companyId: string;
  code: string;
  name: string;
  type: 'headquarters' | 'branch' | 'workshop' | 'plant' | 'site' | 'warehouse';
  address: string;
  region: string;
  commune: string;
  description: string;
  workerCount: number;
  managerName: string;
  managerEmail: string;
  active: boolean;
  createdAt: string;
}

export interface Worker {
  id: string;
  tenantId: string;
  workCenterId: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  rut: string;
  email?: string;
  phone?: string;
  jobPosition: string;
  area?: string;
  workCenterName?: string;
  hireDate?: string;
  supervisorName?: string;
  status?: 'active' | 'inactive' | 'medical_leave' | 'vacation';
  emergencyContact?: string;
  emergencyPhone?: string;
  odiSigned?: boolean;
  odiDate?: string;
  odiStatus?: 'Firmado' | 'Pendiente' | 'Vencido';
  medicalExamValidUntil?: string;
  medicalExamStatus?: 'Vigente' | 'PorVencer' | 'Vencido';
  eppDelivered?: boolean;
  eppDeliveryStatus?: 'Entregado' | 'Pendiente';
  active?: boolean;
  createdAt?: string;
}

export interface JobPosition {
  id: string;
  tenantId: string;
  name: string;
  area: string;
  description: string;
  inherentRisksCount: number;
  eppRequired: string[];
}

// ----------------------------------------------------
// MIPER & RISK MANAGEMENT
// ----------------------------------------------------

export type RiskLevel = 'Bajo' | 'Medio' | 'Alto' | 'Crítico';

export interface RiskMethodology {
  id: string;
  name: string;
  probabilityScale: { value: number; label: string; description: string }[];
  consequenceScale: { value: number; label: string; description: string }[];
  levels: {
    minScore: number;
    maxScore: number;
    level: RiskLevel;
    color: string;
    actionRequired: string;
  }[];
}

export interface Hazard {
  id: string;
  code: string;
  category: 'Físico' | 'Químico' | 'Biológico' | 'Ergonómico' | 'Psicosocial' | 'Mecánico' | 'Eléctrico' | 'Locativo' | 'Tránsito' | 'Incendio';
  name: string;
  description: string;
  legalNormReference?: string;
}

export interface RiskAssessment {
  id: string;
  matrixId: string;
  workCenterId: string;
  workCenterName: string;
  process: string;
  activity: string;
  jobPosition: string;
  hazardId: string;
  hazardName: string;
  hazardCategory: string;
  riskDescription: string;
  exposedCount: number;
  
  // Evaluación Pura
  probability: number;
  consequence: number;
  riskScore: number;
  riskLevel: RiskLevel;
  
  existingControls: string[];
  additionalMeasures: string[];
  responsibleName: string;
  targetDate: string;
  
  // Riesgo Residual
  residualProbability?: number;
  residualConsequence?: number;
  residualRiskScore?: number;
  residualRiskLevel?: RiskLevel;
  
  status: 'Identificado' | 'EnControl' | 'Controlado' | 'RequiereRevision';
  evidenceIds: string[];
  updatedAt: string;
}

export interface RiskMatrixVersion {
  id: string;
  matrixId: string;
  versionNumber: number;
  versionName: string;
  approvedBy: string;
  approvalDate: string;
  effectiveFrom: string;
  effectiveTo: string;
  changelog: string;
  isCurrent: boolean;
  totalAssessments: number;
  criticalRisksCount: number;
  highRisksCount: number;
  mediumRisksCount: number;
  lowRisksCount: number;
  pdfUrl?: string;
}

export interface RiskMatrix {
  id: string;
  tenantId: string;
  companyId: string;
  name: string;
  methodologyId: string;
  currentVersion: number;
  status: 'Vigente' | 'EnRevision' | 'Vencida';
  lastReviewDate: string;
  nextReviewDate: string;
  assessments: RiskAssessment[];
  versions: RiskMatrixVersion[];
  createdAt: string;
}

// ----------------------------------------------------
// PROGRAMA PREVENTIVO & ACTION CENTER
// ----------------------------------------------------

export type ActionStatus =
  | 'Draft'
  | 'Pending'
  | 'InProgress'
  | 'Completed'
  | 'Verified'
  | 'Rejected'
  | 'Overdue'
  | 'Cancelled';

export type ActionPriority = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export type ActionOrigin =
  | 'MIPER'
  | 'Inspección'
  | 'Incidente'
  | 'Obligación Legal'
  | 'Comité Paritario'
  | 'Auditoría';

export interface PreventiveAction {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  description: string;
  origin: ActionOrigin;
  originReferenceId?: string;
  riskAssessmentId?: string;
  workCenterId: string;
  workCenterName: string;
  priority: ActionPriority;
  responsibleName: string;
  responsibleEmail: string;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  verifiedDate?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  status: ActionStatus;
  progressPercent: number;
  evidenceIds: string[];
  commentsCount: number;
  costEstimated?: number;
  regulatoryRequirementCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PreventiveProgram {
  id: string;
  tenantId: string;
  companyId: string;
  year: number;
  name: string;
  version: number;
  approvedBy: string;
  approvalDate: string;
  status: 'Aprobado' | 'EnElaboracion' | 'Vencido';
  totalActions: number;
  completedActions: number;
  verifiedActions: number;
  overdueActions: number;
  progressPercentage: number;
  createdAt: string;
}

// ----------------------------------------------------
// EVIDENCIAS
// ----------------------------------------------------

export type EvidenceType =
  | 'Fotografía'
  | 'Documento PDF'
  | 'Certificado'
  | 'Acta Firmada'
  | 'Lista de Chequeo'
  | 'Registro Digital'
  | 'Factura / Boleta'
  | 'Enlace Externo';

export interface Evidence {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  evidenceType: EvidenceType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileMimeType: string;
  fileHash: string; // SHA-256 for audit integrity
  uploadedBy: string;
  uploadedAt: string;
  associatedEntityType: 'PreventiveAction' | 'Training' | 'Inspection' | 'Incident' | 'Worker' | 'RiskMatrix';
  associatedEntityId: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationComment?: string;
}

// ----------------------------------------------------
// CAPACITACIONES (TRAININGS)
// ----------------------------------------------------

export type TrainingStatus = 'Planificada' | 'Ejecutada' | 'Cancelada' | 'Reprogramada';

export interface Training {
  id: string;
  tenantId: string;
  title: string;
  topic?: string;
  type?: string;
  description?: string;
  durationHours: number;
  trainerName?: string;
  trainerOrganization?: string;
  instructorName?: string;
  instructorInstitution?: string;
  scheduledDate: string;
  validityMonths?: number;
  workCenterId?: string;
  workCenterName?: string;
  status: TrainingStatus | 'Completed' | 'Scheduled';
  totalEnrolled?: number;
  totalAttended?: number;
  assignedWorkerIds?: string[];
  attendedWorkerIds?: string[];
  evidenceIds?: string[];
  createdAt?: string;
}

export interface WorkerTraining {
  id: string;
  tenantId: string;
  trainingId: string;
  trainingTitle: string;
  workerId: string;
  workerName: string;
  workerRut: string;
  attended: boolean;
  passedScore?: number;
  certificateUrl?: string;
  completedDate?: string;
  expiresAt?: string;
  status: 'Vigente' | 'ProximaAVencer' | 'Vencida' | 'Pendiente';
}

// ----------------------------------------------------
// INSPECCIONES & HALLAZGOS
// ----------------------------------------------------

export interface InspectionTemplate {
  id: string;
  name: string;
  category: string;
  items: {
    id: string;
    question: string;
    category: string;
    criticality: 'Baja' | 'Media' | 'Alta' | 'Crítica';
    legalReference?: string;
  }[];
}

export interface InspectionItemResult {
  itemId: string;
  question: string;
  category: string;
  criticality: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  response: 'Cumple' | 'NoCumple' | 'NoAplica';
  comments?: string;
  photos?: string[];
  findingGenerated?: boolean;
}

export interface Finding {
  id: string;
  inspectionId: string;
  question: string;
  description: string;
  severity: 'Leve' | 'Grave' | 'Gravísima';
  location: string;
  photoUrl?: string;
  actionCreatedId?: string;
  status: 'Abierto' | 'EnTratamiento' | 'Cerrado';
  createdAt: string;
}

export interface Inspection {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  type?: string;
  templateName: string;
  workCenterId: string;
  workCenterName: string;
  area: string;
  inspectorName: string;
  inspectionDate: string;
  scorePercent: number;
  status: 'Borrador' | 'Finalizada' | 'Completed';
  items: InspectionItemResult[];
  findings: Finding[];
  evidenceIds: string[];
  createdAt: string;
}

// ----------------------------------------------------
// INCIDENTES & INVESTIGACIÓN
// ----------------------------------------------------

export type IncidentType =
  | 'Accidente con Tiempo Perdido (CTP)'
  | 'Accidente sin Tiempo Perdido (STP)'
  | 'Accidente de Trayecto'
  | 'Incidente Peligroso (Casi Accidente)'
  | 'Sospecha Enfermedad Profesional';

export type IncidentSeverity = 'Leve' | 'Grave' | 'Fatal' | 'Potencialmente Grave';

export interface Incident {
  id: string;
  tenantId: string;
  code: string;
  type: IncidentType;
  severity: IncidentSeverity;
  incidentDate: string;
  incidentTime: string;
  workCenterId: string;
  workCenterName: string;
  exactLocation: string;
  involvedWorkerId?: string;
  involvedWorkerName?: string;
  involvedWorkerRut?: string;
  involvedWorkerPosition?: string;
  description: string;
  immediateActionsTaken: string;
  reportedToMutualidad: boolean;
  diatNumber?: string; // Declaración Individual de Accidente del Trabajo
  daysLost: number;
  
  // Investigación
  investigationStatus: 'Pendiente' | 'EnProceso' | 'Finalizada';
  investigatorName?: string;
  directCauses?: string[];
  rootCauses?: string[];
  correctiveActionIds: string[];
  evidenceIds: string[];
  miperRevisionTriggered: boolean;
  createdAt: string;
}

// ----------------------------------------------------
// COMPLIANCE ENGINE & REGULATORY RULES
// ----------------------------------------------------

export type RequirementCriticality = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export type ComplianceRequirementStatus =
  | 'Compliant'
  | 'PartiallyCompliant'
  | 'NonCompliant'
  | 'NeedsReview'
  | 'NotApplicable';

export interface ComplianceRequirement {
  id: string;
  code: string;
  title: string;
  description: string;
  regulation: string; // e.g. "DS 44"
  articleReference: string; // e.g. "Art. 5"
  category:
    | 'MIPER'
    | 'Programa Preventivo'
    | 'Capacitación'
    | 'Información y Participación'
    | 'Emergencias'
    | 'Comité Paritario'
    | 'Inspecciones'
    | 'Documentación y RIOHS'
    | 'Salud Ocupacional y EPP'
    | 'Investigación de Accidentes';
  applicabilityRule: string; // e.g. "ALWAYS", "WORKER_COUNT > 25", "HIGH_RISK_INDUSTRY"
  requiredEvidenceDescription: string;
  frequencyMonths: number;
  weight: number;
  criticality: RequirementCriticality;
  effectiveFrom: string;
  effectiveTo?: string;
  active: boolean;
}

export interface TenantComplianceRequirement {
  id: string;
  tenantId: string;
  requirementCode: string;
  requirement: ComplianceRequirement;
  status: ComplianceRequirementStatus;
  statusJustification: string;
  fulfillmentPercent: number;
  associatedActionIds: string[];
  associatedEvidenceIds: string[];
  associatedDocumentIds: string[];
  lastEvaluatedAt: string;
  nextRenewalDate?: string;
  isOverdue: boolean;
  responsibleName: string;
}

export interface ComplianceTrigger {
  id: string;
  tenantId: string;
  triggerType: 'ACCIDENT_REPORTED' | 'PROCESS_CHANGE' | 'ANNUAL_EXPIRY' | 'WORKER_THRESHOLD_CROSSED' | 'AUDIT_FINDING';
  title: string;
  description: string;
  affectedEntity: string;
  suggestedAction: string;
  status: 'Pending' | 'Acknowledged' | 'Resolved';
  createdAt: string;
}

export interface ComplianceScoreSummary {
  overallScore: number; // 0 - 100
  totalApplicableRequirements: number;
  compliantCount: number;
  partiallyCompliantCount: number;
  nonCompliantCount: number;
  needsReviewCount: number;
  criticalNonCompliancesCount: number;
  overdueActionsCount: number;
  expiringTrainingsCount: number;
  pendingEvidencesCount: number;
  miperStatus: 'Vigente' | 'EnRevision' | 'Vencida';
  miperLastReview: string;
  preventiveProgramProgress: number;
  scoreByCategory: {
    category: string;
    score: number;
    total: number;
    compliant: number;
  }[];
}

export interface ComplianceInboxItem {
  id: string;
  type: 'OVERDUE_ACTION' | 'MISSING_EVIDENCE' | 'EXPIRING_TRAINING' | 'MIPER_REVIEW_NEEDED' | 'CRITICAL_REQUIREMENT_OPEN' | 'UNRESOLVED_FINDING';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  responsible: string;
  dueDate: string;
  daysRemainingOrOverdue: number; // positive = days left, negative = days overdue
  relatedEntityId: string;
  relatedEntityType: string;
  actionUrl: string;
  quickActionLabel: string;
  resolved: boolean;
}

// ----------------------------------------------------
// DOCUMENTOS & AUDITORÍA
// ----------------------------------------------------

export interface DocumentItem {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  category: 'Políticas' | 'MIPER' | 'Programas' | 'RIOHS' | 'Planes de Emergencia' | 'Comité Paritario' | 'Protocolos MINSAL' | 'Informes Técnicos';
  version: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadDate: string;
  validUntil?: string;
  workCenterId?: string;
  workCenterName?: string;
  regulatoryRequirementCode?: string;
  status: 'Vigente' | 'PorVencer' | 'Vencido';
  tags: string[];
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  oldValues?: string;
  newValues?: string;
  ipAddress: string;
  userAgent: string;
}

export interface NotificationItem {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface IndustryTemplate {
  id: string;
  industryName: string;
  description: string;
  icon: string;
  suggestedHazardsCount: number;
  suggestedTrainings: string[];
  suggestedInspectionChecklists: string[];
}

export type ComplianceDocument = DocumentItem;
export type TrainingSession = Training;
