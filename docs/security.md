# Seguridad y Aislamiento Multi-Tenant

## 1. Principios de Seguridad
1. **Aislamiento Multi-Tenant**: El `tenantId` se valida y asocia a nivel de sesión/token en el servidor, no en parámetros de consulta no autenticados.
2. **Control de Acceso Basado en Roles (RBAC)**: Autorización granular por módulo (`company.manage`, `riskMatrix.manage`, `actions.verify`, `compliance.read`, etc.).
3. **Auditoría Integral (AuditLog)**: Todo evento de creación, modificación de MIPER, verificación de evidencias y cambios regulatorios queda registrado con `userId`, `action`, `entityType`, `entityId`, `timestamp`, `ipAddress` y `userAgent`.
4. **Validación de Archivos y Almacenamiento**: Límite de tamaño, lista blanca de extensiones (PDF, JPG, PNG, DOCX, XLSX), nombres de archivo desinfectados y verificación por hash SHA-256.
