# TODOs for ProcessCalc

This file tracks outstanding tasks, bugs, and feature requests for the ProcessCalc project. Please update as you work!

## High Priority

- [ ] Complete and test the `handleExtrusionCalculation` logic in `VolumetricDeformation.tsx` (ver también integración completa de lógica auditada en DEV_PLAN.md)
- [ ] Add missing input validation for all modules (double-check edge cases). NOTA: La validación y feedback de errores aún están incompletos en varios módulos. Ver DEV_PLAN.md para detalles y prioridades.
- [ ] Improve error handling and user feedback for calculation errors (ver también sección de validación y manejo de errores en DEV_PLAN.md)
- [ ] Expand the educational resources module with more process explanations and diagrams
- [ ] Add unit tests for calculation functions in `src/utils/`. NOTA: Es un requisito crítico pendiente, ver DEV_PLAN.md y PRD.md.
- [x] Remove Firecrawl MCP server and dependency from project, settings, and package.json

## Medium Priority

- [ ] Refactor UI components for better accessibility (ARIA, keyboard navigation)
- [ ] Add export options (PDF, CSV) for calculation results and history
- [ ] Implement user authentication for saving personal calculation history (optional)
- [ ] Add more materials and process parameters to the database
- [ ] Optimize performance for large calculation histories

## Low Priority / Ideas

- [ ] Add multi-language support
- [ ] Integrate with external engineering databases/APIs
- [ ] Add dark/light mode toggle in settings
- [ ] Create a mobile-friendly version or PWA

## Bugs

- [ ] Occasional UI flicker when switching modules (investigate context updates)
- [ ] Some tooltips overlap on small screens

---

## MCP Integration

- [x] Remove Firecrawl MCP server and dependency (July 2025)
- [ ] Verify GitHub MCP server integration and document any issues

---

Para visión, principios y roadmap general, ver `VISION_ROADMAP.md`. Para planificación técnica y prioridades, ver `DEV_PLAN.md`.
