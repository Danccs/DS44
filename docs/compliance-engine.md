# Motor de Cumplimiento Normativo (Compliance Engine)

## 1. Algoritmo de Ponderación y Scoring
El Compliance Score representa el porcentaje ponderado de cumplimiento de los requisitos legales exigibles según el DS 44:

$$\text{ComplianceScore} = \frac{\sum_{i \in \text{Exigibles}} \text{Peso}_i \times \text{NivelCumplimiento}_i}{\sum_{i \in \text{Exigibles}} \text{Peso}_i} \times 100$$

Donde:
- $\text{NivelCumplimiento}_i = 1.0$ si el estado es `Compliant`
- $\text{NivelCumplimiento}_i = 0.5$ si el estado es `PartiallyCompliant`
- $\text{NivelCumplimiento}_i = 0.0$ si el estado es `NonCompliant`, `NeedsReview` o `Overdue`

## 2. Bloqueo de Incumplimientos Críticos
Un porcentaje de cumplimiento alto (ej. 85%) **NUNCA** oculta una falta crítica. El sistema destaca de forma independiente:
- 🔴 Medidas vencidas en riesgos altos o críticos.
- 🔴 Obligaciones críticas sin iniciar (ej. falta de MIPER, falta de Programa Preventivo).
- 🟡 Capacitaciones legales vencidas o próximas a vencer (30 días).
- 🟡 Medidas marcadas como `Completed` pero sin evidencia verificada (`Verified`).

## 3. Compliance Triggers (Eventos de Revisión Obligatoria)
Eventos que alteran el estado de requisitos y alertan al usuario:
- `ACCIDENT_REPORTED`: Accidente con tiempo perdido o grave $\rightarrow$ Obliga a revisión de MIPER del puesto involucrado.
- `PROCESS_CHANGE`: Incorporación de nueva maquinaria, producto químico o proceso.
- `ANNUAL_EXPIRY`: Más de 12 meses desde la última aprobación de la MIPER o Programa de Trabajo.
- `WORKER_THRESHOLD_CROSSED`: Superar 25 trabajadores $\rightarrow$ Exigencia automática de Comité Paritario de Higiene y Seguridad (CPHS) según DS 54 / DS 44.
- `REGULATORY_UPDATE`: Publicación de nuevo compendio o circular SUSESO / MINTRAB.
