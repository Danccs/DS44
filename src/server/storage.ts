import {
  Tenant,
  User,
  Company,
  WorkCenter,
  Worker,
  RiskMethodology,
  RiskMatrix,
  RiskAssessment,
  PreventiveProgram,
  PreventiveAction,
  Evidence,
  Training,
  WorkerTraining,
  Inspection,
  Incident,
  ComplianceRequirement,
  TenantComplianceRequirement,
  ComplianceTrigger,
  DocumentItem,
  AuditLog,
  NotificationItem,
} from '../types';
import { DEFAULT_COMPLIANCE_REQUIREMENTS } from './regulatoryRules';

export class AppStorage {
  private static instance: AppStorage;

  public tenants: Tenant[] = [];
  public users: User[] = [];
  public companies: Company[] = [];
  public workCenters: WorkCenter[] = [];
  public workers: Worker[] = [];
  public methodologies: RiskMethodology[] = [];
  public riskMatrices: RiskMatrix[] = [];
  public preventivePrograms: PreventiveProgram[] = [];
  public preventiveActions: PreventiveAction[] = [];
  public evidences: Evidence[] = [];
  public trainings: Training[] = [];
  public workerTrainings: WorkerTraining[] = [];
  public inspections: Inspection[] = [];
  public incidents: Incident[] = [];
  public complianceRequirements: ComplianceRequirement[] = [];
  public tenantRequirements: TenantComplianceRequirement[] = [];
  public complianceTriggers: ComplianceTrigger[] = [];
  public documents: DocumentItem[] = [];
  public auditLogs: AuditLog[] = [];
  public notifications: NotificationItem[] = [];

  private constructor() {
    this.seedInitialData();
  }

  public static getInstance(): AppStorage {
    if (!AppStorage.instance) {
      AppStorage.instance = new AppStorage();
    }
    return AppStorage.instance;
  }

  public seedInitialData() {
    const tenantId = 'tenant-andes';
    const now = new Date().toISOString();
    const todayStr = now.split('T')[0];

    // 1. Tenant
    this.tenants = [
      {
        id: tenantId,
        name: 'Transportes Andes SpA',
        slug: 'transportes-andes',
        createdAt: '2025-01-10T08:00:00.000Z',
        active: true,
      },
    ];

    // 2. Users
    this.users = [
      {
        id: 'usr-admin',
        tenantId,
        name: 'Carlos Mendoza Silva',
        email: 'carlos.mendoza@transportesandes.cl',
        role: 'admin',
        jobTitle: 'Gerente General / Administrador',
        active: true,
        createdAt: '2025-01-10T08:00:00.000Z',
      },
      {
        id: 'usr-prev',
        tenantId,
        name: 'Camila Soto Valenzuela',
        email: 'camila.soto@transportesandes.cl',
        role: 'prevencionista',
        jobTitle: 'Ingeniera en Prevención de Riesgos (SNS: RM/P-84920)',
        active: true,
        createdAt: '2025-01-10T08:00:00.000Z',
      },
      {
        id: 'usr-super',
        tenantId,
        name: 'Jorge Alarcón R.',
        email: 'jorge.alarcon@transportesandes.cl',
        role: 'supervisor',
        jobTitle: 'Jefe de Operaciones y Taller',
        workCenterId: 'wc-rancagua',
        active: true,
        createdAt: '2025-01-10T08:00:00.000Z',
      },
      {
        id: 'usr-auditor',
        tenantId,
        name: 'Auditor Externo / DT',
        email: 'auditor@inspecciondt.gob.cl',
        role: 'auditor',
        jobTitle: 'Fiscalizador / Auditor de Cumplimiento',
        active: true,
        createdAt: '2025-01-10T08:00:00.000Z',
      },
    ];

    // 3. Company
    this.companies = [
      {
        id: 'comp-andes',
        tenantId,
        legalName: 'Transportes Andes SpA',
        rut: '77.419.820-K',
        tradeName: 'Andes Logistics & Freight',
        economicActivity: 'Transporte de Carga por Carretera y Servicios de Almacenaje',
        industry: 'Transporte y Logística',
        workerCount: 57,
        address: 'Av. Américo Vespucio Norte 2840',
        region: 'Región Metropolitana',
        commune: 'Quilicura',
        legalRepresentative: 'Carlos Mendoza Silva',
        legalRepresentativeRut: '12.483.921-3',
        mutualidad: 'Mutual de Seguridad',
        email: 'contacto@transportesandes.cl',
        phone: '+56 2 2840 9100',
        createdAt: '2025-01-10T08:00:00.000Z',
        updatedAt: now,
      },
    ];

    // 4. Work Centers
    this.workCenters = [
      {
        id: 'wc-santiago',
        tenantId,
        companyId: 'comp-andes',
        code: 'STGO-01',
        name: 'Base Central Santiago',
        type: 'headquarters',
        address: 'Av. Américo Vespucio Norte 2840',
        region: 'Región Metropolitana',
        commune: 'Quilicura',
        description: 'Centro de operaciones principal, patio de maniobras y oficinas corporativas.',
        workerCount: 32,
        managerName: 'Carlos Mendoza Silva',
        managerEmail: 'carlos.mendoza@transportesandes.cl',
        active: true,
        createdAt: '2025-01-10T08:00:00.000Z',
      },
      {
        id: 'wc-rancagua',
        tenantId,
        companyId: 'comp-andes',
        code: 'RNCG-02',
        name: 'Taller & Mantenimiento Rancagua',
        type: 'workshop',
        address: 'Ruta 5 Sur Km 88, Lote 4B',
        region: 'Región de O’Higgins',
        commune: 'Rancagua',
        description: 'Taller de mantención mecánica preventiva y correctiva de tractocamiones y semirremolques.',
        workerCount: 15,
        managerName: 'Jorge Alarcón R.',
        managerEmail: 'jorge.alarcon@transportesandes.cl',
        active: true,
        createdAt: '2025-01-10T08:00:00.000Z',
      },
      {
        id: 'wc-valparaiso',
        tenantId,
        companyId: 'comp-andes',
        code: 'VLP-03',
        name: 'Terminal Puerto Valparaíso',
        type: 'site',
        address: 'Av. Errázuriz 1940, Galpón 3',
        region: 'Región de Valparaíso',
        commune: 'Valparaíso',
        description: 'Base de recepción y consolidación de carga marítima y despacho a puertos.',
        workerCount: 10,
        managerName: 'Patricia Morales V.',
        managerEmail: 'patricia.morales@transportesandes.cl',
        active: true,
        createdAt: '2025-01-10T08:00:00.000Z',
      },
    ];

    // 5. Workers (57 items generated cleanly)
    const workerNames = [
      { f: 'Juan', l: 'Pérez Gallardo', pos: 'Conductor de Larga Distancia', wc: 'wc-santiago', area: 'Operaciones Transporte' },
      { f: 'Roberto', l: 'Gómez Tapia', pos: 'Conductor de Larga Distancia', wc: 'wc-santiago', area: 'Operaciones Transporte' },
      { f: 'Mario', l: 'Castro Fuentes', pos: 'Mecánico Diésel Senior', wc: 'wc-rancagua', area: 'Taller y Mantención' },
      { f: 'Pedro', l: 'Navarro Silva', pos: 'Electromecánico Automotriz', wc: 'wc-rancagua', area: 'Taller y Mantención' },
      { f: 'Felipe', l: 'Morales Soto', pos: 'Operador de Grúa Horquilla', wc: 'wc-valparaiso', area: 'Logística Portuaria' },
      { f: 'Claudia', l: 'Rojas Peña', pos: 'Asistente de Tráfico y Despacho', wc: 'wc-santiago', area: 'Operaciones Transporte' },
      { f: 'Esteban', l: 'Vidal Vera', pos: 'Conductor de Reparto Urbano', wc: 'wc-santiago', area: 'Operaciones Transporte' },
      { f: 'Luis', l: 'Araya Cortés', pos: 'Peoneta / Auxiliar de Carga', wc: 'wc-valparaiso', area: 'Logística Portuaria' },
      { f: 'Héctor', l: 'Bravo Lagos', pos: 'Jefe de Patio', wc: 'wc-santiago', area: 'Operaciones Transporte' },
      { f: 'Camila', l: 'Soto Valenzuela', pos: 'Ingeniera en Prevención de Riesgos', wc: 'wc-santiago', area: 'HSE' },
    ];

    this.workers = [];
    for (let i = 1; i <= 57; i++) {
      const template = workerNames[(i - 1) % workerNames.length];
      const rutNum = 14000000 + i * 83711;
      const dv = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'K'][i % 11];
      const isExpiring = i >= 40 && i <= 46; // 7 expiring trainings / medical exams

      this.workers.push({
        id: `wrk-${i.toString().padStart(3, '0')}`,
        tenantId,
        workCenterId: template.wc,
        firstName: i <= 10 ? template.f : `${template.f} ${i}`,
        lastName: template.l,
        rut: `${rutNum.toLocaleString('es-CL').replace(/\./g, '.')}-${dv}`,
        email: `trabajador.${i}@transportesandes.cl`,
        phone: `+56 9 ${80000000 + i * 147}`,
        jobPosition: template.pos,
        area: template.area,
        hireDate: '2024-03-01',
        supervisorName: 'Jorge Alarcón R.',
        status: 'active',
        emergencyContact: 'Familiar Directo',
        emergencyPhone: '+56 9 7711 2233',
        odiSigned: i !== 53, // 1 worker missing ODI for demo alert
        odiDate: '2024-03-02',
        medicalExamValidUntil: isExpiring ? '2025-03-05' : '2025-11-20',
        eppDelivered: true,
        createdAt: '2025-01-10T08:00:00.000Z',
      });
    }

    // 6. Methodology
    this.methodologies = [
      {
        id: 'meth-matrix-5x5',
        name: 'Matriz de Evaluación de Riesgos Estándar DS 44 (5x5)',
        probabilityScale: [
          { value: 1, label: 'Muy Baja (1)', description: 'Rara vez ocurre o no hay antecedentes' },
          { value: 2, label: 'Baja (2)', description: 'Ocurre ocasionalmente en la industria' },
          { value: 3, label: 'Media (3)', description: 'Ha ocurrido en la empresa o con frecuencia anual' },
          { value: 4, label: 'Alta (4)', description: 'Ocurre habitualmente varias veces al año' },
          { value: 5, label: 'Muy Alta (5)', description: 'Certeza de que ocurrirá de forma continua' },
        ],
        consequenceScale: [
          { value: 1, label: 'Insignificante (1)', description: 'Lesión leve sin tiempo perdido o primeros auxilios' },
          { value: 2, label: 'Menor (2)', description: 'Lesión con tiempo perdido leve (< 7 días)' },
          { value: 3, label: 'Moderada (3)', description: 'Lesión con incapacidad temporal mayor (> 7 días)' },
          { value: 4, label: 'Grave (4)', description: 'Invalidez parcial permanente o daño estructural severo' },
          { value: 5, label: 'Catastrófica (5)', description: 'Muerte o invalidez total permanente' },
        ],
        levels: [
          { minScore: 1, maxScore: 4, level: 'Bajo', color: '#10b981', actionRequired: 'Aceptable. Mantener controles existentes.' },
          { minScore: 5, maxScore: 9, level: 'Medio', color: '#f59e0b', actionRequired: 'Moderado. Planificar mejoras preventivas.' },
          { minScore: 10, maxScore: 16, level: 'Alto', color: '#f97316', actionRequired: 'No aceptable. Medidas correctivas a corto plazo.' },
          { minScore: 17, maxScore: 25, level: 'Crítico', color: '#ef4444', actionRequired: 'Intolerable. Detener actividad hasta mitigar.' },
        ],
      },
    ];

    // 7. MIPER & Risk Assessments
    const assessments: RiskAssessment[] = [
      {
        id: 'ra-01',
        matrixId: 'mat-andes-01',
        workCenterId: 'wc-santiago',
        workCenterName: 'Base Central Santiago',
        process: 'Transporte Carretero',
        activity: 'Conducción en Rutas Interurbanas',
        jobPosition: 'Conductor de Larga Distancia',
        hazardId: 'haz-transito-01',
        hazardName: 'Colisión / Volcamiento por Fatiga o Velocidad',
        hazardCategory: 'Tránsito',
        riskDescription: 'Accidente de tránsito en carretera por cansancio acumulado, clima adverso o terceros.',
        exposedCount: 24,
        probability: 4,
        consequence: 5,
        riskScore: 20,
        riskLevel: 'Crítico',
        existingControls: ['Capacitación en conducción defensiva', 'GPS con alerta de velocidad'],
        additionalMeasures: ['Implementar sensor de fatiga en cabina', 'Plan de pausas activas obligatorias cada 4 horas'],
        responsibleName: 'Camila Soto Valenzuela',
        targetDate: '2025-03-30',
        residualProbability: 2,
        residualConsequence: 4,
        residualRiskScore: 8,
        residualRiskLevel: 'Medio',
        status: 'EnControl',
        evidenceIds: ['evi-01'],
        updatedAt: now,
      },
      {
        id: 'ra-02',
        matrixId: 'mat-andes-01',
        workCenterId: 'wc-rancagua',
        workCenterName: 'Taller & Mantenimiento Rancagua',
        process: 'Mantenimiento Mecánico',
        activity: 'Reparación de Chasis bajo Elevador',
        jobPosition: 'Mecánico Diésel Senior',
        hazardId: 'haz-mecanico-01',
        hazardName: 'Atrapamiento / Aplastamiento por Falla de Elevador',
        hazardCategory: 'Mecánico',
        riskDescription: 'Caída de tractocamión por falla hidráulica o mal anclaje en puente elevador.',
        exposedCount: 6,
        probability: 3,
        consequence: 5,
        riskScore: 15,
        riskLevel: 'Alto',
        existingControls: ['Bloqueo mecánico de seguridad', 'Calzado de seguridad con puntera'],
        additionalMeasures: ['Certificación semestral de gatas y elevadores por empresa externa'],
        responsibleName: 'Jorge Alarcón R.',
        targetDate: '2025-02-15',
        residualProbability: 1,
        residualConsequence: 4,
        residualRiskScore: 4,
        residualRiskLevel: 'Bajo',
        status: 'RequiereRevision',
        evidenceIds: [],
        updatedAt: now,
      },
      {
        id: 'ra-03',
        matrixId: 'mat-andes-01',
        workCenterId: 'wc-valparaiso',
        workCenterName: 'Terminal Puerto Valparaíso',
        process: 'Carga y Descarga',
        activity: 'Maniobra con Grúa Horquilla en Galpón',
        jobPosition: 'Operador de Grúa Horquilla',
        hazardId: 'haz-locativo-01',
        hazardName: 'Atropello / Choque con Estructuras',
        hazardCategory: 'Locativo',
        riskDescription: 'Interacción de grúas horquillas con peatones en pasillos de consolidación.',
        exposedCount: 10,
        probability: 3,
        consequence: 4,
        riskScore: 12,
        riskLevel: 'Alto',
        existingControls: ['Uso obligatorio de chaleco reflectante', 'Bocina en retroceso'],
        additionalMeasures: ['Demarcación de sendas peatonales segregadas con barreras físicas'],
        responsibleName: 'Patricia Morales V.',
        targetDate: '2025-04-15',
        status: 'EnControl',
        evidenceIds: ['evi-02'],
        updatedAt: now,
      },
      {
        id: 'ra-04',
        matrixId: 'mat-andes-01',
        workCenterId: 'wc-rancagua',
        workCenterName: 'Taller & Mantenimiento Rancagua',
        process: 'Mantenimiento Mecánico',
        activity: 'Soldadura de Estructuras y Tubos de Escape',
        jobPosition: 'Electromecánico Automotriz',
        hazardId: 'haz-quimico-01',
        hazardName: 'Inhalación de Humos Metálicos y Radiación UV',
        hazardCategory: 'Químico',
        riskDescription: 'Exposición a humos de soldadura y emisión de radiación no ionizante.',
        exposedCount: 4,
        probability: 3,
        consequence: 3,
        riskScore: 9,
        riskLevel: 'Medio',
        existingControls: ['Careta de soldar fotosensible', 'Extractor móvil de humos'],
        additionalMeasures: ['Medición cuantitativa de humos de soldadura con Mutualidad'],
        responsibleName: 'Camila Soto Valenzuela',
        targetDate: '2025-05-10',
        status: 'Controlado',
        evidenceIds: ['evi-03'],
        updatedAt: now,
      },
      {
        id: 'ra-05',
        matrixId: 'mat-andes-01',
        workCenterId: 'wc-santiago',
        workCenterName: 'Base Central Santiago',
        process: 'Operaciones Transporte',
        activity: 'Inspección Preoperacional de Carga sobre Semirremolque',
        jobPosition: 'Conductor de Larga Distancia',
        hazardId: 'haz-altura-01',
        hazardName: 'Caída de Distinto Nivel (> 1.8m)',
        hazardCategory: 'Locativo',
        riskDescription: 'Pérdida de equilibrio al entoldar o amarrar carga sobre la rampla del camión.',
        exposedCount: 20,
        probability: 4,
        consequence: 4,
        riskScore: 16,
        riskLevel: 'Alto',
        existingControls: ['Escalera de acceso con baranda', 'Zapatos antideslizantes'],
        additionalMeasures: ['Línea de vida retráctil en andén de entolde'],
        responsibleName: 'Héctor Bravo Lagos',
        targetDate: '2025-03-20',
        status: 'EnControl',
        evidenceIds: [],
        updatedAt: now,
      },
    ];

    this.riskMatrices = [
      {
        id: 'mat-andes-01',
        tenantId,
        companyId: 'comp-andes',
        name: 'Matriz MIPER Corporativa Transportes Andes 2025',
        methodologyId: 'meth-matrix-5x5',
        currentVersion: 2,
        status: 'Vigente',
        lastReviewDate: '2025-01-15',
        nextReviewDate: '2026-01-15',
        assessments,
        versions: [
          {
            id: 'ver-01',
            matrixId: 'mat-andes-01',
            versionNumber: 1,
            versionName: 'MIPER Inicial 2024',
            approvedBy: 'Carlos Mendoza Silva',
            approvalDate: '2024-01-10',
            effectiveFrom: '2024-01-10',
            effectiveTo: '2025-01-14',
            changelog: 'Confección inicial de matriz con levantamiento de 18 peligros base.',
            isCurrent: false,
            totalAssessments: 18,
            criticalRisksCount: 3,
            highRisksCount: 6,
            mediumRisksCount: 7,
            lowRisksCount: 2,
          },
          {
            id: 'ver-02',
            matrixId: 'mat-andes-01',
            versionNumber: 2,
            versionName: 'MIPER Actualizada DS44 (2025)',
            approvedBy: 'Carlos Mendoza Silva y Camila Soto',
            approvalDate: '2025-01-15',
            effectiveFrom: '2025-01-15',
            effectiveTo: '2026-01-15',
            changelog: 'Alineación completa a nuevos estándares DS44 y reevaluación de riesgos en taller Rancagua.',
            isCurrent: true,
            totalAssessments: assessments.length,
            criticalRisksCount: assessments.filter(a => a.riskLevel === 'Crítico').length,
            highRisksCount: assessments.filter(a => a.riskLevel === 'Alto').length,
            mediumRisksCount: assessments.filter(a => a.riskLevel === 'Medio').length,
            lowRisksCount: assessments.filter(a => a.riskLevel === 'Bajo').length,
          },
        ],
        createdAt: '2024-01-10T08:00:00.000Z',
      },
    ];

    // 8. Evidences
    this.evidences = [
      {
        id: 'evi-01',
        tenantId,
        title: 'Certificado y Acta de Capacitación en Conducción Defensiva',
        description: 'Capacitación dictada por Mutual de Seguridad a 24 conductores con evaluación teórica y práctica aprobada.',
        evidenceType: 'Certificado',
        fileUrl: '/uploads/evidences/capacitacion_conduccion_defensiva.pdf',
        fileName: 'acta_mutual_conduccion_defensiva_2025.pdf',
        fileSize: 1450200,
        fileMimeType: 'application/pdf',
        fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        uploadedBy: 'Camila Soto Valenzuela',
        uploadedAt: '2025-01-20T10:30:00.000Z',
        associatedEntityType: 'PreventiveAction',
        associatedEntityId: 'act-01',
        verified: true,
        verifiedBy: 'Camila Soto Valenzuela (Prevencionista)',
        verifiedAt: '2025-01-21T09:00:00.000Z',
        verificationComment: 'Certificado válido emitido por OAL con firmas y asistencia completa.',
      },
      {
        id: 'evi-02',
        tenantId,
        title: 'Fotografía de Segregación Peatonal Galpón Valparaíso',
        description: 'Registro fotográfico de la demarcación vial de color amarillo termoplástico y barandas de protección instaladas.',
        evidenceType: 'Fotografía',
        fileUrl: '/uploads/evidences/segregacion_valparaiso.jpg',
        fileName: 'foto_demarcacion_puerto_galpon3.jpg',
        fileSize: 2890000,
        fileMimeType: 'image/jpeg',
        fileHash: 'f4567a89b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8',
        uploadedBy: 'Patricia Morales V.',
        uploadedAt: '2025-01-25T14:15:00.000Z',
        associatedEntityType: 'PreventiveAction',
        associatedEntityId: 'act-02',
        verified: true,
        verifiedBy: 'Camila Soto Valenzuela',
        verifiedAt: '2025-01-26T11:00:00.000Z',
        verificationComment: 'Inspeccionado en terreno. Cumple con ancho mínimo de 1.2 metros reglamentario.',
      },
      {
        id: 'evi-03',
        tenantId,
        title: 'Informe Técnico de Medición de Humos de Soldadura',
        description: 'Informe de higiene industrial emitido por Mutual de Seguridad que acredita concentraciones bajo el LPP del DS 594.',
        evidenceType: 'Documento PDF',
        fileUrl: '/uploads/evidences/informe_humos_soldadura.pdf',
        fileName: 'informe_mutual_higiene_humos_rancagua.pdf',
        fileSize: 3200100,
        fileMimeType: 'application/pdf',
        fileHash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        uploadedBy: 'Camila Soto Valenzuela',
        uploadedAt: '2025-02-02T16:45:00.000Z',
        associatedEntityType: 'PreventiveAction',
        associatedEntityId: 'act-03',
        verified: true,
        verifiedBy: 'Camila Soto Valenzuela',
        verifiedAt: '2025-02-03T08:30:00.000Z',
        verificationComment: 'Valores en norma. Mantener extractores móviles activos.',
      },
      {
        id: 'evi-04',
        tenantId,
        title: 'Plan de Emergencias y Acta de Simulacro 2025',
        description: 'Plan formal de emergencias actualizado con plano de evacuación y acta firmada de simulacro de sismo e incendio.',
        evidenceType: 'Acta Firmada',
        fileUrl: '/uploads/evidences/acta_simulacro_santiago.pdf',
        fileName: 'acta_simulacro_evacuacion_stgo_2025.pdf',
        fileSize: 1980000,
        fileMimeType: 'application/pdf',
        fileHash: '9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba',
        uploadedBy: 'Camila Soto Valenzuela',
        uploadedAt: '2025-01-18T12:00:00.000Z',
        associatedEntityType: 'PreventiveAction',
        associatedEntityId: 'act-04',
        verified: true,
        verifiedBy: 'Carlos Mendoza Silva',
        verifiedAt: '2025-01-19T10:00:00.000Z',
        verificationComment: 'Simulacro ejecutado con tiempo de evacuación de 2 minutos 40 segundos.',
      },
    ];

    // 9. Preventive Actions (Includes 3 Overdue for realistic DS44 demo)
    this.preventiveActions = [
      {
        id: 'act-01',
        tenantId,
        code: 'MED-2025-001',
        title: 'Capacitación en Conducción Defensiva y Fatiga en Ruta',
        description: 'Ejecutar taller teórico-práctico de 8 horas para los 24 conductores interurbanos con la Mutualidad.',
        origin: 'MIPER',
        originReferenceId: 'ra-01',
        workCenterId: 'wc-santiago',
        workCenterName: 'Base Central Santiago',
        priority: 'Crítica',
        responsibleName: 'Camila Soto Valenzuela',
        responsibleEmail: 'camila.soto@transportesandes.cl',
        startDate: '2025-01-10',
        dueDate: '2025-01-20',
        completedDate: '2025-01-20',
        verifiedDate: '2025-01-21',
        verifiedBy: 'Camila Soto Valenzuela',
        verificationNotes: 'Completado y verificado con acta oficial Mutual.',
        status: 'Verified',
        progressPercent: 100,
        evidenceIds: ['evi-01'],
        commentsCount: 2,
        regulatoryRequirementCode: 'DS44-ART-08',
        createdAt: '2025-01-10T08:00:00.000Z',
        updatedAt: now,
      },
      {
        id: 'act-02',
        tenantId,
        code: 'MED-2025-002',
        title: 'Demarcación y Segregación de Pasillos Peatonales en Puerto',
        description: 'Pintado de sendas peatonales con pintura de alto tráfico y colocación de barreras en Galpón 3.',
        origin: 'MIPER',
        originReferenceId: 'ra-03',
        workCenterId: 'wc-valparaiso',
        workCenterName: 'Terminal Puerto Valparaíso',
        priority: 'Alta',
        responsibleName: 'Patricia Morales V.',
        responsibleEmail: 'patricia.morales@transportesandes.cl',
        startDate: '2025-01-15',
        dueDate: '2025-01-25',
        completedDate: '2025-01-25',
        verifiedDate: '2025-01-26',
        verifiedBy: 'Camila Soto Valenzuela',
        verificationNotes: 'Fotografía validada y senda 100% operativa.',
        status: 'Verified',
        progressPercent: 100,
        evidenceIds: ['evi-02'],
        commentsCount: 1,
        regulatoryRequirementCode: 'DS44-ART-09',
        createdAt: '2025-01-10T08:00:00.000Z',
        updatedAt: now,
      },
      {
        id: 'act-03',
        tenantId,
        code: 'MED-2025-003',
        title: 'Medición Higiénica de Humos y Gases en Taller',
        description: 'Coordinar con OAL muestreo de contaminantes químicos durante trabajos de soldadura en Rancagua.',
        origin: 'MIPER',
        originReferenceId: 'ra-04',
        workCenterId: 'wc-rancagua',
        workCenterName: 'Taller & Mantenimiento Rancagua',
        priority: 'Media',
        responsibleName: 'Camila Soto Valenzuela',
        responsibleEmail: 'camila.soto@transportesandes.cl',
        startDate: '2025-01-20',
        dueDate: '2025-02-02',
        completedDate: '2025-02-02',
        verifiedDate: '2025-02-03',
        verifiedBy: 'Camila Soto Valenzuela',
        verificationNotes: 'Informe técnico archivado.',
        status: 'Verified',
        progressPercent: 100,
        evidenceIds: ['evi-03'],
        commentsCount: 0,
        regulatoryRequirementCode: 'DS44-ART-15',
        createdAt: '2025-01-10T08:00:00.000Z',
        updatedAt: now,
      },
      {
        id: 'act-04',
        tenantId,
        code: 'MED-2025-004',
        title: 'Actualización y Simulacro Plan de Evacuación Santiago',
        description: 'Revisión anual de vías de escape, rotulación de extintores y ejecución de ejercicio práctico.',
        origin: 'Obligación Legal',
        workCenterId: 'wc-santiago',
        workCenterName: 'Base Central Santiago',
        priority: 'Alta',
        responsibleName: 'Camila Soto Valenzuela',
        responsibleEmail: 'camila.soto@transportesandes.cl',
        startDate: '2025-01-10',
        dueDate: '2025-01-18',
        completedDate: '2025-01-18',
        verifiedDate: '2025-01-19',
        verifiedBy: 'Carlos Mendoza Silva',
        verificationNotes: 'Acta firmada con tiempos récord.',
        status: 'Verified',
        progressPercent: 100,
        evidenceIds: ['evi-04'],
        commentsCount: 1,
        regulatoryRequirementCode: 'DS44-ART-11',
        createdAt: '2025-01-10T08:00:00.000Z',
        updatedAt: now,
      },
      // 3 VENCIDAS (OVERDUE) — Highlighted in Demo
      {
        id: 'act-05',
        tenantId,
        code: 'MED-2025-005',
        title: 'Instalación de Protección Acrílica en Tablero General Taller',
        description: 'Colocación de acrílico cubre-barras y señalética de advertencia de riesgo eléctrico en Taller Rancagua.',
        origin: 'Inspección',
        workCenterId: 'wc-rancagua',
        workCenterName: 'Taller & Mantenimiento Rancagua',
        priority: 'Crítica',
        responsibleName: 'Jorge Alarcón R.',
        responsibleEmail: 'jorge.alarcon@transportesandes.cl',
        startDate: '2025-01-20',
        dueDate: '2025-02-10', // VENCIDA
        status: 'Overdue',
        progressPercent: 40,
        evidenceIds: [],
        commentsCount: 3,
        regulatoryRequirementCode: 'DS44-ART-09',
        createdAt: '2025-01-20T08:00:00.000Z',
        updatedAt: now,
      },
      {
        id: 'act-06',
        tenantId,
        code: 'MED-2025-006',
        title: 'Recambio y Certificación Anual Extintores Flota 4 (10 Unidades)',
        description: 'Enviar a mantención certificada extintores de PQS de 6kg y 10kg de la flota de camiones asignada a Valparaíso.',
        origin: 'Obligación Legal',
        workCenterId: 'wc-valparaiso',
        workCenterName: 'Terminal Puerto Valparaíso',
        priority: 'Alta',
        responsibleName: 'Patricia Morales V.',
        responsibleEmail: 'patricia.morales@transportesandes.cl',
        startDate: '2025-01-15',
        dueDate: '2025-02-12', // VENCIDA
        status: 'Overdue',
        progressPercent: 20,
        evidenceIds: [],
        commentsCount: 1,
        regulatoryRequirementCode: 'DS44-ART-11',
        createdAt: '2025-01-15T08:00:00.000Z',
        updatedAt: now,
      },
      {
        id: 'act-07',
        tenantId,
        code: 'MED-2025-007',
        title: 'Exámenes Ocupacionales de Audiometría para Mecánicos Taller',
        description: 'Agendar en Mutual de Seguridad evaluaciones auditivas periódicas para los 6 mecánicos expuestos a ruido continuo.',
        origin: 'MIPER',
        workCenterId: 'wc-rancagua',
        workCenterName: 'Taller & Mantenimiento Rancagua',
        priority: 'Alta',
        responsibleName: 'Camila Soto Valenzuela',
        responsibleEmail: 'camila.soto@transportesandes.cl',
        startDate: '2025-01-10',
        dueDate: '2025-02-14', // VENCIDA
        status: 'Overdue',
        progressPercent: 50,
        evidenceIds: [],
        commentsCount: 2,
        regulatoryRequirementCode: 'DS44-ART-15',
        createdAt: '2025-01-10T08:00:00.000Z',
        updatedAt: now,
      },
      // InProgress and Completed needing verification
      {
        id: 'act-08',
        tenantId,
        code: 'MED-2025-008',
        title: 'Implementación de Sensor de Fatiga y Cámara ADAS en Cabinas',
        description: 'Instalación piloto de dispositivos de detección de somnolencia en los primeros 10 camiones de ruta larga.',
        origin: 'MIPER',
        originReferenceId: 'ra-01',
        workCenterId: 'wc-santiago',
        workCenterName: 'Base Central Santiago',
        priority: 'Crítica',
        responsibleName: 'Jorge Alarcón R.',
        responsibleEmail: 'jorge.alarcon@transportesandes.cl',
        startDate: '2025-02-01',
        dueDate: '2025-03-30',
        status: 'InProgress',
        progressPercent: 65,
        evidenceIds: [],
        commentsCount: 4,
        regulatoryRequirementCode: 'DS44-ART-05',
        createdAt: '2025-02-01T08:00:00.000Z',
        updatedAt: now,
      },
      {
        id: 'act-09',
        tenantId,
        code: 'MED-2025-009',
        title: 'Instalación de Línea de Vida Retráctil en Andén de Carga',
        description: 'Instalar riel con carro retráctil para trabajo seguro en altura sobre semirremolques en patio Santiago.',
        origin: 'MIPER',
        originReferenceId: 'ra-05',
        workCenterId: 'wc-santiago',
        workCenterName: 'Base Central Santiago',
        priority: 'Alta',
        responsibleName: 'Héctor Bravo Lagos',
        responsibleEmail: 'hector.bravo@transportesandes.cl',
        startDate: '2025-02-10',
        dueDate: '2025-03-20',
        completedDate: '2025-02-21',
        status: 'Completed', // Marked completed by responsible, NEEDS VERIFICATION & EVIDENCE
        progressPercent: 100,
        evidenceIds: [],
        commentsCount: 2,
        regulatoryRequirementCode: 'DS44-ART-09',
        createdAt: '2025-02-10T08:00:00.000Z',
        updatedAt: now,
      },
      {
        id: 'act-10',
        tenantId,
        code: 'MED-2025-010',
        title: 'Certificación Semestral de Puentes Elevadores Hidráulicos',
        description: 'Inspección y prueba de carga con empresa técnica certificadora para los 3 elevadores de taller Rancagua.',
        origin: 'MIPER',
        originReferenceId: 'ra-02',
        workCenterId: 'wc-rancagua',
        workCenterName: 'Taller & Mantenimiento Rancagua',
        priority: 'Crítica',
        responsibleName: 'Jorge Alarcón R.',
        responsibleEmail: 'jorge.alarcon@transportesandes.cl',
        startDate: '2025-02-15',
        dueDate: '2025-03-15',
        status: 'InProgress',
        progressPercent: 30,
        evidenceIds: [],
        commentsCount: 1,
        regulatoryRequirementCode: 'DS44-ART-09',
        createdAt: '2025-02-15T08:00:00.000Z',
        updatedAt: now,
      },
    ];

    // 10. Preventive Program
    this.preventivePrograms = [
      {
        id: 'prog-2025',
        tenantId,
        companyId: 'comp-andes',
        year: 2025,
        name: 'Programa Anual de Seguridad y Salud en el Trabajo 2025',
        version: 1,
        approvedBy: 'Carlos Mendoza Silva (Gerente General)',
        approvalDate: '2025-01-12',
        status: 'Aprobado',
        totalActions: this.preventiveActions.length,
        completedActions: this.preventiveActions.filter(a => a.status === 'Completed' || a.status === 'Verified').length,
        verifiedActions: this.preventiveActions.filter(a => a.status === 'Verified').length,
        overdueActions: this.preventiveActions.filter(a => a.status === 'Overdue').length,
        progressPercentage: 62,
        createdAt: '2025-01-10T08:00:00.000Z',
      },
    ];

    // 11. Trainings & WorkerTrainings
    this.trainings = [
      {
        id: 'tr-01',
        tenantId,
        title: 'Manejo a la Defensiva, Fatiga y Somnolencia en Ruta',
        topic: 'Seguridad Vial Interurbana',
        description: 'Capacitación teórico-práctica con simulador y casos reales dictada por OAL.',
        durationHours: 8,
        trainerName: 'Claudio Navarrete (Instructor Mutual)',
        trainerOrganization: 'Mutual de Seguridad',
        scheduledDate: '2025-01-20',
        validityMonths: 12,
        workCenterId: 'wc-santiago',
        workCenterName: 'Base Central Santiago',
        status: 'Ejecutada',
        totalEnrolled: 24,
        totalAttended: 24,
        evidenceIds: ['evi-01'],
        createdAt: '2025-01-10T08:00:00.000Z',
      },
      {
        id: 'tr-02',
        tenantId,
        title: 'Uso y Manejo Seguro de Extintores de Incendio Portátiles',
        topic: 'Emergencias y Control de Fuego',
        description: 'Entrenamiento con fuego real en bandeja para personal de patio y taller.',
        durationHours: 4,
        trainerName: 'Camila Soto Valenzuela',
        trainerOrganization: 'Transportes Andes SpA (HSE Interno)',
        scheduledDate: '2025-03-10',
        validityMonths: 12,
        workCenterId: 'wc-rancagua',
        workCenterName: 'Taller & Mantenimiento Rancagua',
        status: 'Planificada',
        totalEnrolled: 15,
        totalAttended: 0,
        evidenceIds: [],
        createdAt: '2025-01-15T08:00:00.000Z',
      },
      {
        id: 'tr-03',
        tenantId,
        title: 'Operación Segura de Grúa Horquilla y Manejo de Cargas',
        topic: 'Maquinaria y Logística Portuaria',
        description: 'Curso con certificación de competencias y licencia interna clase D.',
        durationHours: 16,
        trainerName: 'OTEC Capacita Chile',
        trainerOrganization: 'OTEC Acreditado',
        scheduledDate: '2025-01-28',
        validityMonths: 24,
        workCenterId: 'wc-valparaiso',
        workCenterName: 'Terminal Puerto Valparaíso',
        status: 'Ejecutada',
        totalEnrolled: 5,
        totalAttended: 5,
        evidenceIds: [],
        createdAt: '2025-01-15T08:00:00.000Z',
      },
    ];

    this.workerTrainings = [];
    // 7 Expiring worker trainings (Demo data matching prompt)
    for (let i = 1; i <= 24; i++) {
      const isExpiring = i >= 18 && i <= 24; // 7 trainings expiring soon
      this.workerTrainings.push({
        id: `wt-${i}`,
        tenantId,
        trainingId: 'tr-01',
        trainingTitle: 'Manejo a la Defensiva, Fatiga y Somnolencia en Ruta',
        workerId: `wrk-${i.toString().padStart(3, '0')}`,
        workerName: this.workers[i - 1]?.firstName + ' ' + this.workers[i - 1]?.lastName,
        workerRut: this.workers[i - 1]?.rut,
        attended: true,
        passedScore: 92,
        certificateUrl: '/uploads/certificates/cert_conduccion.pdf',
        completedDate: isExpiring ? '2024-03-10' : '2025-01-20',
        expiresAt: isExpiring ? '2025-03-10' : '2026-01-20',
        status: isExpiring ? 'ProximaAVencer' : 'Vigente',
      });
    }

    // 12. Inspections
    this.inspections = [
      {
        id: 'insp-01',
        tenantId,
        code: 'INSP-2025-001',
        title: 'Inspección de Seguridad a Instalaciones de Taller Rancagua',
        templateName: 'Checklist de Seguridad en Talleres Mecánicos',
        workCenterId: 'wc-rancagua',
        workCenterName: 'Taller & Mantenimiento Rancagua',
        area: 'Fosa de Mantención y Bodega de Aceites',
        inspectorName: 'Camila Soto Valenzuela',
        inspectionDate: '2025-01-20',
        scorePercent: 78,
        status: 'Finalizada',
        items: [
          {
            itemId: 'q1',
            question: '¿Tableros eléctricos cuentan con acrílico de protección y señalética de peligro?',
            category: 'Electricidad',
            criticality: 'Crítica',
            response: 'NoCumple',
            comments: 'Falta acrílico cubre-barras en tablero secundario fosa.',
            findingGenerated: true,
          },
          {
            itemId: 'q2',
            question: '¿Extintores se encuentran vigentes, con manómetro en verde y libres de obstáculos?',
            category: 'Incendio',
            criticality: 'Alta',
            response: 'Cumple',
          },
          {
            itemId: 'q3',
            question: '¿Bodega de lubricantes cuenta con pretil de contención para derrames?',
            category: 'Químico',
            criticality: 'Alta',
            response: 'Cumple',
          },
        ],
        findings: [
          {
            id: 'fnd-01',
            inspectionId: 'insp-01',
            question: 'Tableros eléctricos sin acrílico de protección',
            description: 'Tablero eléctrico de fosa 2 con barras vivas expuestas a contacto accidental.',
            severity: 'Gravísima',
            location: 'Fosa 2 - Taller Rancagua',
            actionCreatedId: 'act-05',
            status: 'EnTratamiento',
            createdAt: '2025-01-20T11:30:00.000Z',
          },
        ],
        evidenceIds: [],
        createdAt: '2025-01-20T10:00:00.000Z',
      },
    ];

    // 13. Incidents
    this.incidents = [
      {
        id: 'inc-01',
        tenantId,
        code: 'INC-2025-001',
        type: 'Accidente con Tiempo Perdido (CTP)',
        severity: 'Grave',
        incidentDate: '2025-01-28',
        incidentTime: '11:45',
        workCenterId: 'wc-valparaiso',
        workCenterName: 'Terminal Puerto Valparaíso',
        exactLocation: 'Andén de Despacho 2',
        involvedWorkerId: 'wrk-008',
        involvedWorkerName: 'Luis Araya Cortés',
        involvedWorkerRut: '14.000.008-8',
        involvedWorkerPosition: 'Peoneta / Auxiliar de Carga',
        description: 'Trabajador sufrió esguince de tobillo izquierdo al pisar desnivel no señalizado mientras trasladaba pallet manual.',
        immediateActionsTaken: 'Primeros auxilios inmediatos, traslado a centro asistencial Mutual de Seguridad Valparaíso con DIAT emitida.',
        reportedToMutualidad: true,
        diatNumber: 'DIAT-VALP-98420-2025',
        daysLost: 12,
        investigationStatus: 'Finalizada',
        investigatorName: 'Camila Soto Valenzuela',
        directCauses: ['Desnivel en losa de pavimento sin demarcación contrastante', 'Calzado con desgaste en suela'],
        rootCauses: ['Falta de inspección preventiva a pavimentos de patio', 'Procedimiento de reposición de calzado no contemplaba revisión periódica'],
        correctiveActionIds: ['act-02'],
        evidenceIds: ['evi-02'],
        miperRevisionTriggered: true,
        createdAt: '2025-01-28T14:00:00.000Z',
      },
    ];

    // 14. Compliance Requirements
    this.complianceRequirements = [...DEFAULT_COMPLIANCE_REQUIREMENTS];

    // Map to Tenant Requirements with ~81% Score
    this.tenantRequirements = this.complianceRequirements.map((req, index) => {
      // Create a realistic compliance status
      let status: any = 'Compliant';
      let justification = 'Requisito formalizado con evidencias completas y vigentes.';
      let isOverdue = false;
      let fulfillment = 100;

      if (req.code === 'DS44-ART-12') {
        // CPHS (57 workers > 25)
        status = 'Compliant';
        justification = 'CPHS constituido en Santiago con actas de reuniones mensuales al día.';
      } else if (req.code === 'DS44-ART-15') {
        // Exámenes ocupacionales (Overdue action act-07)
        status = 'PartiallyCompliant';
        fulfillment = 60;
        justification = 'Nómina enviada a Mutualidad, pero restan 6 evaluaciones auditivas de mecánicos pendientes.';
      } else if (req.code === 'DS44-ART-09') {
        // Inspecciones (Hallazgo abierto tablero eléctrico)
        status = 'PartiallyCompliant';
        fulfillment = 75;
        justification = 'Inspecciones ejecutadas, pero existen 2 hallazgos críticos en proceso de cierre.';
      } else if (req.code === 'DS44-ART-07') {
        // ODI (1 trabajador sin firmar)
        status = 'PartiallyCompliant';
        fulfillment = 90;
        justification = '56 de 57 trabajadores con ODI firmada. Falta regularizar 1 ingreso reciente.';
      }

      return {
        id: `treq-${req.id}`,
        tenantId,
        requirementCode: req.code,
        requirement: req,
        status,
        statusJustification: justification,
        fulfillmentPercent: fulfillment,
        associatedActionIds: this.preventiveActions.filter(a => a.regulatoryRequirementCode === req.code).map(a => a.id),
        associatedEvidenceIds: [],
        associatedDocumentIds: [],
        lastEvaluatedAt: todayStr,
        isOverdue,
        responsibleName: 'Camila Soto Valenzuela',
      };
    });

    // 15. Compliance Triggers
    this.complianceTriggers = [
      {
        id: 'trig-01',
        tenantId,
        triggerType: 'ACCIDENT_REPORTED',
        title: 'Revisión MIPER requerida por Accidente en Terminal Valparaíso',
        description: 'Accidente CTP de Luis Araya (28/01/2025) obliga a reevaluar el peligro de desniveles y tránsito peatonal en Galpón 3.',
        affectedEntity: 'Matriz MIPER - Proceso Carga y Descarga',
        suggestedAction: 'Actualizar evaluación de riesgo residual e incorporar inspección quincenal de pavimentos.',
        status: 'Acknowledged',
        createdAt: '2025-01-29T09:00:00.000Z',
      },
    ];

    // 16. Documents
    this.documents = [
      {
        id: 'doc-01',
        tenantId,
        code: 'DOC-POL-01',
        title: 'Política Oficial de Seguridad y Salud en el Trabajo 2025',
        category: 'Políticas',
        version: '2.0',
        fileName: 'politica_sst_transportes_andes_2025.pdf',
        fileUrl: '/uploads/docs/politica_sst_2025.pdf',
        fileSize: 450000,
        uploadedBy: 'Carlos Mendoza Silva',
        uploadDate: '2025-01-10',
        validUntil: '2026-01-10',
        workCenterId: 'wc-santiago',
        workCenterName: 'Base Central Santiago',
        regulatoryRequirementCode: 'DS44-ART-04',
        status: 'Vigente',
        tags: ['Política', 'Gerencia', 'DS44'],
      },
      {
        id: 'doc-02',
        tenantId,
        code: 'DOC-RIOHS-01',
        title: 'Reglamento Interno de Orden, Higiene y Seguridad (RIOHS) Vigente',
        category: 'RIOHS',
        version: '4.1',
        fileName: 'riohs_transportes_andes_aprobado_dt.pdf',
        fileUrl: '/uploads/docs/riohs_aprobado_dt.pdf',
        fileSize: 2150000,
        uploadedBy: 'Camila Soto Valenzuela',
        uploadDate: '2024-06-15',
        validUntil: '2026-06-15',
        regulatoryRequirementCode: 'DS44-ART-13',
        status: 'Vigente',
        tags: ['RIOHS', 'Dirección del Trabajo', 'Legal'],
      },
      {
        id: 'doc-03',
        tenantId,
        code: 'DOC-MIPER-02',
        title: 'Matriz MIPER Corporativa Aprobada v2',
        category: 'MIPER',
        version: '2.0',
        fileName: 'miper_corporativa_transportes_andes_v2.pdf',
        fileUrl: '/uploads/docs/miper_v2_oficial.pdf',
        fileSize: 1890000,
        uploadedBy: 'Camila Soto Valenzuela',
        uploadDate: '2025-01-15',
        validUntil: '2026-01-15',
        regulatoryRequirementCode: 'DS44-ART-05',
        status: 'Vigente',
        tags: ['MIPER', 'Riesgos', 'Matriz'],
      },
    ];

    // 17. Audit Logs
    this.auditLogs = [
      {
        id: 'log-01',
        tenantId,
        userId: 'usr-admin',
        userName: 'Carlos Mendoza Silva',
        action: 'MIPER_APPROVED',
        entityType: 'RiskMatrixVersion',
        entityId: 'ver-02',
        timestamp: '2025-01-15T16:20:00.000Z',
        newValues: JSON.stringify({ version: 2, status: 'Vigente', approver: 'Carlos Mendoza Silva' }),
        ipAddress: '190.161.44.12',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        id: 'log-02',
        tenantId,
        userId: 'usr-prev',
        userName: 'Camila Soto Valenzuela',
        action: 'EVIDENCE_VERIFIED',
        entityType: 'Evidence',
        entityId: 'evi-01',
        timestamp: '2025-01-21T09:00:00.000Z',
        newValues: JSON.stringify({ verified: true, verifiedBy: 'Camila Soto Valenzuela' }),
        ipAddress: '190.161.44.12',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    ];

    // 18. Notifications
    this.notifications = [
      {
        id: 'notif-01',
        tenantId,
        userId: 'usr-prev',
        title: '3 Medidas Preventivas Vencidas',
        message: 'Las medidas MED-2025-005, 006 y 007 han superado su fecha límite sin verificarse.',
        type: 'alert',
        read: false,
        createdAt: '2025-02-15T08:00:00.000Z',
        link: '/actions',
      },
      {
        id: 'notif-02',
        tenantId,
        userId: 'usr-prev',
        title: '7 Capacitaciones por Vencer en 30 Días',
        message: 'Certificados de conducción defensiva de 7 trabajadores requieren renovación.',
        type: 'warning',
        read: false,
        createdAt: '2025-02-18T09:30:00.000Z',
        link: '/trainings',
      },
    ];
  }
}
