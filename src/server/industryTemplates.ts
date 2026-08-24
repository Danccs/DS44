import { IndustryTemplate, Hazard } from '../types';

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'template-transporte',
    industryName: 'Transporte y Logística',
    description: 'Plantilla preconfigurada para flotas de camiones, buses, última milla y centros de distribución.',
    icon: 'Truck',
    suggestedHazardsCount: 14,
    suggestedTrainings: [
      'Manejo a la Defensiva y Fatiga en Ruta',
      'Ergonomía en Conducción y Manejo Manual de Carga',
      'Protocolo de Emergencia en Carretera y Uso de Extintor',
      'Inspección Pre-Uso de Vehículos Pesados'
    ],
    suggestedInspectionChecklists: [
      'Checklist Diario de Unidad de Transporte (Frenos, Luces, Neumáticos)',
      'Inspección de Zona de Carga y Amarres',
      'Revisión de Botiquín y Extintores de Vehículos'
    ]
  },
  {
    id: 'template-construccion',
    industryName: 'Construcción y Obras Civiles',
    description: 'Plantilla optimizada para contratistas, faenas de edificación, excavaciones e instalaciones.',
    icon: 'HardHat',
    suggestedHazardsCount: 22,
    suggestedTrainings: [
      'Trabajo en Altura Física y Uso de Arnés',
      'Riesgos de Excavaciones y Entibaciones',
      'Seguridad Eléctrica Provisoria en Faenas',
      'Uso Seguro de Herramientas Eléctricas Portátiles'
    ],
    suggestedInspectionChecklists: [
      'Inspección de Andamios y Plataformas de Trabajo',
      'Inspección de Tableros Eléctricos Provisorios',
      'Checklist de Orden y Aseo en Faena'
    ]
  },
  {
    id: 'template-talleres',
    industryName: 'Talleres Mecánicos y Automotrices',
    description: 'Plantilla diseñada para servicios técnicos, desabolladura, pintura y mantenimiento automotriz.',
    icon: 'Wrench',
    suggestedHazardsCount: 16,
    suggestedTrainings: [
      'Operación Segura de Elevadores Hidráulicos y Gatas',
      'Manejo de Sustancias Peligrosas (Aceites, Solventes, Pinturas)',
      'Protección Ocular y Auditiva en Trabajos Mecánicos',
      'Procedimiento de Bloqueo y Etiquetado (LOTO)'
    ],
    suggestedInspectionChecklists: [
      'Inspección de Elevadores y Equipos de Levante',
      'Revisión de Bodega de Sustancias Peligrosas (SUSPEL)',
      'Inspección de Compresores y Líneas de Aire Comprimido'
    ]
  },
  {
    id: 'template-aseo',
    industryName: 'Aseo y Servicios de Limpieza',
    description: 'Especializada para empresas de aseo industrial, comercial, hospitalario y domiciliario.',
    icon: 'Sparkles',
    suggestedHazardsCount: 12,
    suggestedTrainings: [
      'Manejo Seguro de Químicos y Hojas de Datos de Seguridad (HDS)',
      'Prevención de Caídas al Mismo Nivel en Pisos Húmedos',
      'Manejo Manual de Cargas y Posturas Forzadas',
      'Uso de EPP Específico (Guantes Nitrilo, Botas Antideslizantes)'
    ],
    suggestedInspectionChecklists: [
      'Inspección de Bodegas de Productos de Limpieza',
      'Revisión de Señalética de Advertencia (Piso Mojado)',
      'Control de Entrega y Estado de EPP de Aseo'
    ]
  },
  {
    id: 'template-mantencion',
    industryName: 'Mantención Industrial y Climatización',
    description: 'Para contratistas de climatización (HVAC), refrigeración, calderas e instalaciones electromecánicas.',
    icon: 'Cpu',
    suggestedHazardsCount: 18,
    suggestedTrainings: [
      'Riesgo Eléctrico y Trabajo con Baja/Media Tensión',
      'Manejo Seguro de Gases Refrigerantes a Presión',
      'Trabajo en Espacios Confinados',
      'Bloqueo de Fuentes de Energía Peligrosa'
    ],
    suggestedInspectionChecklists: [
      'Inspección de Instrumental de Medición y Aislamiento',
      'Revisión de Cilindros de Gas y Equipos de Soldadura',
      'Checklist de Permisos de Trabajo Seguro (PTS)'
    ]
  }
];
