# Especificación de Producto — DS44 Compliance OS

## 1. Visión y Propósito
**DS44 Compliance OS** es el Sistema Operativo de Cumplimiento Preventivo diseñado específicamente para Pequeñas y Medianas Empresas (PYMEs) en Chile (10 a 200 trabajadores).
Permite gestionar de manera integral y demostrar el cumplimiento del **Decreto Supremo N.º 44 (DS 44)** del Ministerio del Trabajo y Previsión Social de Chile, sobre gestión preventiva de riesgos laborales.

## 2. Propuesta de Valor
Transformar la incertidumbre reglamentaria en una cadena de ejecución continua y auditable:
$$\text{Obligación} \longrightarrow \text{Acción} \longrightarrow \text{Responsable} \longrightarrow \text{Plazo} \longrightarrow \text{Evidencia} \longrightarrow \text{Verificación} \longrightarrow \text{Cumplimiento}$$

## 3. Principales Módulos del Sistema
1. **Tenant & Empresa**: Multiempresa con aislamiento estricto, RUT, OAL (ACHS, Mutual de Seguridad, IST, ISL), centros de trabajo y dotación.
2. **Organización & Dotación**: Centros de trabajo (sucursales, faenas, plantas), puestos de trabajo, procesos, actividades e importador CSV/Excel de trabajadores.
3. **MIPER (Matriz de Identificación de Peligros y Evaluación de Riesgos)**: Metodologías configurables ($P \times C$, matrices $3\times3$, $4\times4$, $5\times5$), clasificación de severidad y probabilidad, riesgos residuales y versionado inmutable ($v_1, v_2, \dots$).
4. **Triggers de Revisión MIPER**: Detección de accidentes graves, cambios de procesos, fiscalizaciones o aniversarios anuales que obligan a actualizar la matriz.
5. **Programa de Trabajo Preventivo**: Medidas preventivas y correctivas con estados granulares (`Draft`, `Pending`, `InProgress`, `Completed`, `Verified`, `Rejected`, `Overdue`, `Cancelled`).
6. **Action Center**: Bandeja operativa de medidas con filtros rápidos (vencidas, sin responsable, sin evidencia, por centro, por criticidad).
7. **Compliance Engine & Scoring**: Motor de aplicabilidad legal basado en dotación, actividad y riesgos, cálculo transparente del score de cumplimiento (%) y semáforo de incumplimientos críticos.
8. **Compliance Inbox**: Bandeja unificada tipo "Inbox Zero" con acciones prioritarias para resolver brechas inmediatas.
9. **Gestión de Evidencias**: Repositorio de evidencias (fotografías, actas firmadas, certificados, checklist), metadatos, control de verificación y hashes SHA-256.
10. **Capacitaciones**: Plan de formación, control de vencimiento de cursos (ODI, inducción, uso EPP, manejo de extintores, trabajo en altura) y registro de asistencia.
11. **Inspecciones & Checklists**: Ejecución en terreno, registro de hallazgos y creación automática de acciones correctivas vinculadas.
12. **Incidentes & Accidentes**: Registro de accidentes/incidentes del trabajo, investigación de causas (método árbol de causas / 5 Porqués), acciones correctivas y triggers hacia MIPER.
13. **Audit Mode ("Audit Ready")**: Vista especial para fiscalizaciones de la Dirección del Trabajo (DT) o Seremi de Salud / SUSESO, con exportación de *Compliance Pack* (ZIP con evidencias y reporte PDF).
14. **Generador de Reportes PDF**:
    - Reporte Ejecutivo DS44
    - Matriz MIPER Oficial
    - Programa de Trabajo Preventivo
    - Informe de Inspección
    - Informe de Investigación de Accidentes

## 4. Perfiles de Usuario (RBAC)
- **Administrador / Dueño**: Gestión total, configuración, invitaciones y auditoría.
- **Prevencionista de Riesgos**: Gestión técnica de MIPER, programas, inspecciones y verificación de evidencias.
- **Supervisor / Jefatura de Centro**: Gestión operativa de su centro asignado, asignación de tareas locales y seguimiento.
- **Responsable de Medida**: Ejecución de acciones y carga de evidencias.
- **Auditor / Fiscalizador**: Modo consulta de solo lectura para inspecciones oficiales.
