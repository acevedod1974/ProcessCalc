# ProcessCalc DEV Branch Refactoring, Auditoría y Modernización

Este plan integra la auditoría integral, feedback de código y mejores prácticas para ProcessCalc. Trabaja cada sección en orden, marcando los ítems completados. Actualiza este archivo conforme avances.

---

## Fase 1: Corrección Fundamental (Prioridad Inmediata)

- [ ] Corregir todas las fórmulas y unidades en los motores de cálculo (`calculations.ts`, `cuttingCalculations.ts`, `machiningCalculations.ts`, `drawingExtrusionCalculations.ts`).
- [ ] Validar todas las fórmulas con fuentes de ingeniería y/o expertos.
- [ ] Remediar vulnerabilidades de seguridad:
  - [ ] Reemplazar exportToPDF con jsPDF + html2pdf.js.
  - [ ] Fortalecer exportToCSV usando escapado con tabulación (\t).
- [ ] Resolver errores críticos de funcionalidad (ej. setShowAddModal en MaterialDatabase).

## Fase 2: Modernización y Refactorización (Corto Plazo)

- [ ] Actualizar dependencias clave (React 19, ESLint 9, Vite, etc.).
- [ ] Refactorizar todos los formularios para usar useActionState de React 19.
- [ ] Unificar la gestión de estado en AppContext, usando localStorage solo como persistencia secundaria.
- [ ] Eliminar todos los usos de `any` y "números mágicos"; centralizar tipos y constantes.
- [ ] Migrar configuración de ESLint a formato plano (eslint.config.js).
- [ ] Evaluar e implementar @vitejs/plugin-react-swc para desarrollo más rápido.

## Fase 3: Crecimiento Sostenible (Largo Plazo)

- [ ] Implementar backend seguro para autenticación y almacenamiento.
- [ ] Expandir módulos de cálculo (ej. Troquelado, Tratamientos Térmicos, Soldadura).
- [ ] Integrar visualización avanzada de datos (gráficas).
- [ ] Establecer CI/CD y pruebas automatizadas.

## Mejoras de Código y Accesibilidad (Continuas)

- [ ] Implementar un global error boundary en React.
- [ ] Añadir anotaciones de tipo y eliminar `any`.
- [ ] Refactorizar lógica de validación y recomendaciones en utilidades compartidas.
- [ ] Consolidar interfaces de materiales.
- [ ] Añadir ARIA labels y mejorar accesibilidad.
- [ ] Centralizar conversiones de unidades y constantes.
- [ ] Organizar componentes y utilidades compartidas.
- [ ] Documentar funciones complejas y fórmulas.
- [ ] Eliminar `console.error` en producción.
- [ ] Reemplazar URLs/paths hardcoded por variables de entorno.

---

Trabaja cada fase en orden. Marca los ítems completados y haz commit en la rama `DEV`. Fusiona mejoras a `main` tras pruebas.

---

### Próximo paso inmediato:

**Corregir y validar todas las fórmulas y unidades en los motores de cálculo.**

- Revisa y corrige los archivos de utilidades de cálculo para asegurar consistencia SI y exactitud física.
- Documenta cada corrección y valida con fuentes confiables.
- Haz commit de los cambios y actualiza este plan.
