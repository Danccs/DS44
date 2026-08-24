# Modelo de Dominio — DS44 Compliance OS

## 1. Entidades Principales

```mermaid
erDiagram
    Tenant ||--o{ Company : owns
    Company ||--o{ WorkCenter : operates
    Company ||--o{ Worker : employs
    WorkCenter ||--o{ Worker : hosts
    Company ||--o{ RiskMatrix : evaluates
    RiskMatrix ||--o{ RiskMatrixVersion : versions
    RiskMatrixVersion ||--o{ RiskAssessment : contains
    RiskAssessment ||--o{ Hazard : identifies
    RiskAssessment ||--o{ ControlMeasure : prescribes
    ControlMeasure ||--o{ PreventiveAction : materializes
    PreventiveProgram ||--o{ PreventiveAction : organizes
    PreventiveAction ||--o{ Evidence : proves
    Company ||--o{ Training : plans
    Training ||--o{ WorkerTraining : registers
    Company ||--o{ Inspection : conducts
    Inspection ||--o{ Finding : discovers
    Finding ||--o{ PreventiveAction : triggers
    Company ||--o{ Incident : records
    Incident ||--o{ PreventiveAction : investigates
    RegulatoryRuleSet ||--o{ ComplianceRequirement : defines
    TenantComplianceRequirement ||--o{ ComplianceRequirement : maps
```

## 2. Estados de Entidades Críticas
### PreventiveAction
- `Draft`: Borrador inicial en confección de MIPER o inspección.
- `Pending`: Medida aprobada pendiente de inicio.
- `InProgress`: En ejecución por el responsable asignado.
- `Completed`: Marcada como terminada por el ejecutante (requiere evidencia).
- `Verified`: Validada técnicamente por el prevencionista tras revisar evidencia.
- `Rejected`: Evidencia insuficiente o rechazada en verificación.
- `Overdue`: Plazo límite superado sin completarse ni verificarse.
- `Cancelled`: Descartada con justificación registrada.

### TenantComplianceRequirement
- `Compliant`: 100% de los controles y evidencias requeridos están vigentes y verificados.
- `PartiallyCompliant`: Medidas en ejecución con avance comprobable.
- `NonCompliant`: Obligación exigible sin medidas activas o con medidas vencidas.
- `NeedsReview`: Aconteció un trigger de revisión (accidente, cambio de proceso).
- `NotApplicable`: Exenta según dotación o rubro.
