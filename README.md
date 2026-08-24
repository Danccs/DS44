# 🛡️ DS44 Compliance OS

[![React](https://img.shields.io/badge/React-19.0-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev/)
[![Normativa](https://img.shields.io/badge/Normativa-DS%2044%20%2F%202025%20(Chile)-emerald.svg)]()
[![Design System](https://img.shields.io/badge/Design%20System-Nordic%20Safety%20Clean-059669.svg)]()

**DS44 Compliance OS** es una plataforma integral de gestión preventiva y cumplimiento legal diseñada específicamente para empresas y PYMEs en Chile bajo el marco regulatorio del **Decreto Supremo N.º 44 (DS 44 / 2025)** del Ministerio del Trabajo y Previsión Social.

Permite a prevencionistas de riesgos, administradores y comités paritarios gestionar de forma continua la **Matriz MIPER (5x5)**, el **Programa de Trabajo Preventivo Anual**, el control de **Capacitaciones y Obligación de Informar (ODI)**, la **Bóveda de Evidencias Digitales** y el **Modo Auditoría Oficial (DT / SUSESO / Mutualidades)** con generación de expedientes en PDF y ZIP.

---

## 🎨 Sistema de Diseño: "Nordic Safety Clean"

La interfaz visual está inspirada en la precisión y claridad del diseño nórdico aplicado a la ingeniería de seguridad ocupacional:

*   **Paleta Cromática de Alto Contraste y Calma Visual:**
    *   Fondo base en blanco puro (`#ffffff`) y pizarra suave (`#f8fafc`).
    *   Tono primario de acción en **Verde Esmeralda Institucional** (`#059669`).
    *   Tipografía de alta legibilidad en **Pizarra Oscuro** (`#0f172a` y `#334155`).
    *   Código cromático unificado de severidad y riesgo:
        *   🟢 **Bajo / Conforme:** Verde esmeralda (`#10b981`).
        *   🟡 **Medio / Atención:** Ámbar preventivo (`#f59e0b`).
        *   🟠 **Alto:** Naranja de advertencia (`#f97316`).
        *   🔴 **Crítico / Vencido:** Rojo carmesí (`#f43f5e`).
*   **Estructura y Micro-interacciones:**
    *   Tarjetas con micro-bordes finos de 1px (`#e2e8f0`) y sombras de baja densidad.
    *   Navegación contextual por centros de trabajo (faenas) y perfiles de rol.
    *   Paleta de comandos rápida integrada mediante el atajo universal (`⌘K` / `Ctrl+K`).

---

## 🚀 Características Clave

1.  📋 **Checklist de las 12 Obligaciones DS 44:**
    *   Evaluación sistemática de cada obligación reglamentaria: Política Preventiva, MIPER, Programa Anual, CPHS, ODI, Emergencias, Contratistas, etc.
    *   Cálculo transparente del **Compliance Score** con desglose de ponderación auditable.
2.  📊 **Matriz MIPER Interactiva (Metodología 5x5):**
    *   Evaluación de Probabilidad × Consecuencia con cálculo automático de Magnitud de Riesgo (MR).
    *   Jerarquía de controles: Eliminación, Sustitución, Ingeniería, Administrativos y EPP.
    *   Disparadores automáticos por accidentes graves o cambios operacionales.
3.  ⚡ **Compliance Inbox & Action Center:**
    *   Bandeja de entrada priorizada por severidad y riesgo legal vinculante.
    *   Workflow de estados de medidas preventivas: *Borrador → Pendiente → En Progreso → Completada → Verificada (HSE)*.
4.  📁 **Bóveda de Evidencias Digitales con Hash SHA-256:**
    *   Almacenamiento clasificado de actas CPHS, registros ODI firmados, certificados EPP e informes de mutualidades.
    *   Integridad criptográfica simulada con hash SHA-256 para trazabilidad ante fiscalizaciones.
5.  🔍 **Modo Auditoría Directa (DT / Seremi de Salud / SUSESO):**
    *   Vista blindada de solo lectura para inspectores oficiales.
    *   Acceso instantáneo a la Ficha de la Empresa, Matriz MIPER vigente y carpeta probatoria en un solo clic.
6.  📑 **Generador de Informes Oficiales (PDF y ZIP):**
    *   Exportación con `jspdf` y `jspdf-autotable` de Informes de Auditoría DS 44 listos para firmar.
    *   Descarga consolidada del expediente probatorio en archivo ZIP comprimido con `jszip`.
7.  👥 **Gestión de Personal, Faenas y Capacitaciones:**
    *   Monitoreo de vencimiento de exámenes ocupacionales, licencias de conducir y charlas ODI por trabajador.
    *   Control sectorizado por Centro de Trabajo (Casa Matriz, Faenas Mineras, Talleres, Puertos).
8.  🤖 **Diagnóstico Inicial Inteligente (Onboarding Wizard):**
    *   Asistente paso a paso para configurar el perfil de la empresa, tamaño de dotación y mutualidad administradora.

---

## 🏛️ Arquitectura del Software

El sistema sigue una arquitectura modular en TypeScript con separación clara entre lógica de negocio, servicios de datos, utilidades normativas y componentes de presentación en React:

```
src/
├── components/          # Capa de Presentación (Componentes React)
│   ├── actions/         # Centro de Acciones y Medidas Preventivas
│   ├── audit/           # Historial y Registro de Auditoría
│   ├── common/          # Modales, Badges, Botones, Paleta de Comandos (⌘K)
│   ├── company/         # Parámetros de Empresa y Mutualidad
│   ├── compliance/      # Checklist 12 Obligaciones y Vista Audit Mode DT
│   ├── dashboard/       # Panel de Mando General y Compliance Inbox
│   ├── documents/       # Generador de Documentos Oficiales
│   ├── evidence/        # Bóveda de Evidencias y Carga de Archivos
│   ├── incidents/       # Registro e Investigación de Incidentes
│   ├── inspections/     # Inspecciones Planeadas y Hallazgos
│   ├── layout/          # Header, Sidebar de Navegación y Footer
│   ├── miper/           # Matriz de Identificación de Peligros y Evaluación de Riesgos (5x5)
│   ├── onboarding/      # Asistente de Diagnóstico Inicial DS 44
│   ├── reports/         # Generador y Exportador de Informes PDF/ZIP
│   ├── templates/       # Plantillas de Medidas por Industria (Transporte, Minería, Construcción)
│   ├── trainings/       # Control de Capacitaciones y Registros ODI
│   └── workers/         # Padrón de Trabajadores y Estado de Aptitud
│
├── services/            # Servicios de Datos y Persistencia
│   └── mockData.ts      # Dataset base inicial conforme al sector transporte/industrial
│
├── types/               # Definición Estricta de Modelos de Datos
│   └── index.ts         # Tipos TypeScript para Obligaciones DS44, MIPER, Acciones, etc.
│
├── utils/               # Utilidades de Dominio y Exportación
│   ├── complianceCalculator.ts # Algoritmo de ponderación y Compliance Score
│   └── reportGenerator.ts      # Motores de renderizado jsPDF y compresión JSZip
│
├── App.tsx              # Orquestador Principal de Rutas y Estado Global
├── main.tsx             # Punto de Entrada de React 19
└── index.css            # Configuración Tailwind CSS v4 y Variables de Tema
```

---

## 🗄️ Modelo de Dominio y Normativa DS 44

El modelo de datos implementa las entidades requeridas por el marco legal chileno:

*   **`ComplianceRequirement`**: Los 12 ejes reglamentarios del DS 44 con peso porcentual, estado de cumplimiento y evidencias asociadas.
*   **`RiskAssessment (MIPER)`**: Registro de procesos, peligros, medidas de control existentes, probabilidad (1-5), severidad (1-5), nivel de riesgo residual y plan de acción.
*   **`PreventiveAction`**: Tarea preventiva correctiva o de mejora asignada a un responsable, con fecha de vencimiento, prioridad y flujo de verificación.
*   **`EvidenceItem`**: Documento probatorio con código normativo, fecha de emisión, autor, estado de verificación y hash SHA-256.
*   **`Worker` & `TrainingRecord`**: Padrón laboral con seguimiento de exámenes de salud, contratos, capacitaciones y constancias ODI.

---

## 🛠️ Configuración e Instalación Local

### 1. Clonar el Repositorio e Instalar Dependencias
```bash
git clone https://github.com/tu-organizacion/ds44-compliance-os.git
cd ds44-compliance-os
npm install
```

### 2. Ejecutar el Servidor de Desarrollo
```bash
npm run dev
```

El servidor local se iniciará automáticamente en `http://localhost:3000`.

### 3. Compilar para Producción y Verificación
```bash
# Validar tipado TypeScript
npm run lint

# Compilar cliente estático y servidor de producción
npm run build

# Iniciar servidor compilado
npm run start
```

---

## 📦 Tecnologías Principales

*   **Frontend:** [React 19](https://react.dev/), [TypeScript 5.8](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/).
*   **Animaciones & UI:** [Motion](https://motion.dev/), [Tailwind Merge](https://github.com/dcastil/tailwind-merge).
*   **Generación de Documentos:** [jsPDF](https://github.com/parallax/jsPDF), [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable), [JSZip](https://stuk.github.io/jszip/).
*   **Backend & Server:** [Express 4.21](https://expressjs.com/), [TSX](https://github.com/privatenumber/tsx), [esbuild](https://esbuild.github.io/).
*   **Bundler:** [Vite 6.2](https://vite.dev/).

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Diseñado para la prevención de riesgos y seguridad laboral en Chile.
