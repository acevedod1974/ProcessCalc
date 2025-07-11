# Product Requirements Document (PRD)

**Project:** ProcessCalc  
**Date:** July 3, 2025  
**Owner:** [Your Name/Team]

---

## 1. Purpose

ProcessCalc is a modern, modular web application for performing, documenting, and visualizing engineering calculations related to manufacturing processes (e.g., rolling, forging, drawing, extrusion, machining, cutting). The goal is to provide engineers, students, and professionals with a reliable, extensible, and user-friendly tool for accurate process analysis, learning, and reporting.

---

## 2. Background & Motivation

- Existing tools are fragmented, outdated, or lack transparency in calculations.
- Engineers and students need a single, trustworthy platform for process calculations, documentation, and learning.
- The app must be robust, auditable, and easy to maintain, with a modern UI and strong type safety.

---

## 3. Goals & Objectives

- Provide accurate, validated calculations for key manufacturing processes.
- Ensure all formulas and units are SI-compliant and referenced.
- Offer a modular, extensible architecture for future process modules.
- Deliver a consistent, accessible, and modern user experience.
- Support export, documentation, and educational resources.
- Enable secure user authentication and data storage (future phase).

---

## 4. Features & Requirements

### 4.1 Core Calculation Modules

- **Rolling, Forging, Drawing, Extrusion:**

  - Each module is self-contained: manages its own state, validation, calculation, and results.
  - Receives only global props (theme, material options, etc.) from the main orchestrator.
  - Supports input, recalculation, and result updates on input change.
  - Displays recommendations and educational notes after results.
  - UI/UX is consistent across all modules.

- **Machining, Cutting, and Future Modules:**
  - Same architecture and standards as above.

### 4.2 Data & Validation

- All formulas and units must be SI-compliant and referenced (e.g., Kalpakjian & Schmid).
- Strong TypeScript typing; no use of any.
- Centralized types and constants; no magic numbers.
  NOTA [2025-07-11]: La validación de entradas y el manejo de errores aún están incompletos en varios módulos. Priorizar la implementación de validaciones exhaustivas y feedback de errores amigable para el usuario.

### 4.3 State Management

- AppContext provides global state (theme, units, materials, etc.).
- LocalStorage is used only for secondary persistence.
- NOTA [2025-07-11]: La migración a useActionState está incompleta. Algunos formularios aún usan useState/startTransition. Se requiere migración completa o actualizar la documentación para reflejar el patrón real.

### 4.4 UI/UX

- Modern, responsive design using TailwindCSS 4.
- Accessible components (ARIA labels, keyboard navigation).
- Consistent input, button, loading, and result card patterns.
- Recommendations and educational notes are always shown after results.

### 4.5 Export & Reporting

- Export results to PDF (using jsPDF + html2pdf.js) and CSV (tab-escaped).
- All exports include units, formulas, and references.

### 4.6 Security & Compliance

- No critical vulnerabilities (e.g., in export, storage).
- Secure authentication and backend storage (future phase).

### 4.7 Extensibility

- Easy to add new process modules (e.g., punching, heat treatment, welding).
- Shared utilities for validation, recommendations, and material data.

### 4.8 Documentation & Auditability

- All formulas, units, and references are documented in code and UI.
- Code is fully commented and follows best practices.
- PRD, dev plan, and code documentation are kept up to date.
- NOTA [2025-07-11]: Se recomienda establecer un proceso de auditoría regular para cruzar PRD.md, DEV_PLAN.md y TODO.md con la base de código real y mantener la documentación sincronizada.

### 4.9 Testing & Reliability

- Implementar pruebas unitarias exhaustivas para todas las funciones de cálculo en src/utils/. Este es un requisito crítico pendiente para garantizar la precisión y robustez a largo plazo.
- Integrar completamente la lógica de cálculo auditada (ej. Extrusión) en los módulos de UI correspondientes. Auditar todos los módulos para detectar discrepancias similares.

---

## 5. Non-Goals

- Real-time collaboration (not in scope for MVP).
- Mobile app (web-first, responsive design only).
- Advanced 3D visualization (basic charts/graphs only for now).

---

## 6. Success Metrics

- All core modules pass validation with engineering references.
- No critical bugs or calculation errors in production.
- User feedback indicates high trust in results and usability.
- Codebase passes linting, type checks, y pruebas automatizadas.
- Pruebas unitarias implementadas y ejecutadas para todos los motores de cálculo.

---

## 7. Timeline & Milestones

- **Phase 1:** Formula/unit audit, bug fixes, and code modernization (COMPLETE)
- **Phase 2:** Modularization, state unification, type safety, and UI/UX unification (IN PROGRESS)
- **Phase 3:** Backend, authentication, advanced features (PLANNED)

---

## 8. Stakeholders

- Product Owner: [Name]
- Engineering: [Names]
- QA: [Names]
- Users: Engineers, students, educators

---

## 9. Open Questions

- Which additional modules are highest priority for future releases?
- What integrations (e.g., cloud storage, LMS) are needed?
- What are the requirements for regulatory or academic compliance?

---
