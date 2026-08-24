# Guía de Desarrollo y Despliegue

## 1. Stack Tecnológico
- **Frontend**: React 19 + TypeScript + Tailwind CSS + Lucide Icons + jsPDF / jsPDF-AutoTable + JSZip.
- **Backend**: Node.js + Express + TypeScript con repositorio ACID en memoria con persistencia, arquitectura modular monolítica.
- **API**: REST con DTOs tipados, filtros, paginación, auditoría y ProblemDetails.

## 2. Puesta en Marcha Local
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 3. Datos Demo Iniciales
- Empresa: **Transportes Andes SpA** (RUT: `77.419.820-K`)
- Dotación: 57 trabajadores en 3 centros (Santiago Central, Taller Rancagua, Terminal Puerto Valparaíso)
- Mutualidad: Mutual de Seguridad
- Estado: MIPER v2 vigente, Score DS44 ~81%, 3 medidas vencidas, 7 capacitaciones próximas a vencer.
