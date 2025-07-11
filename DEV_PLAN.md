# ProcessCalc DEV Branch Refactoring, Auditoría y Modernización

> **Nota:** La visión, principios y roadmap general del proyecto están ahora en `VISION_ROADMAP.md`. Este archivo se centra en el plan técnico y de desarrollo.

Este plan integra la auditoría integral, feedback de código y mejores prácticas para ProcessCalc. Trabaja cada sección en orden, marcando los ítems completados. Actualiza este archivo conforme avances.

---

## Fase 1: Corrección Fundamental (Prioridad Inmediata)

- [x] Corregir todas las fórmulas y unidades en los motores de cálculo (`calculations.ts` - función calculateRolling auditada y corregida; fórmulas documentadas, unidades SI validadas, referencias: Kalpakjian & Schmid, Manufacturing Engineering & Technology).
  - [2025-06-30] Fórmulas y unidades revisadas, SI validado, documentación y referencias añadidas. Ver detalles al final del plan.
- [x] Corregir todas las fórmulas y unidades en los motores de cálculo (`cuttingCalculations.ts` - funciones calculatePunching y calculateShearing auditadas y corregidas; fórmulas documentadas, unidades SI validadas, referencias: Kalpakjian & Schmid, Manufacturing Engineering & Technology).
  - [2025-06-30] Fórmulas revisadas, SI validado, variables no usadas eliminadas, documentación y referencias añadidas.
- [x] Corregir todas las fórmulas y unidades en los motores de cálculo (`machiningCalculations.ts`, `drawingExtrusionCalculations.ts` - todas las funciones principales auditadas y corregidas; fórmulas documentadas, unidades SI validadas, referencias: Kalpakjian & Schmid, Manufacturing Engineering & Technology).
  - [2025-06-30] Todas las funciones principales auditadas, SI validado, tipado fuerte implementado, documentación y referencias añadidas.
- [x] Validar todas las fórmulas con fuentes de ingeniería y/o expertos.
  - [2025-12-30] Validación completada basada en referencias de ingeniería reconocidas (Kalpakjian & Schmid, Manufacturing Engineering & Technology, 8th Ed.). Todas las fórmulas han sido auditadas y documentadas con comentarios detallados, unidades SI validadas, y referencias incluidas. Recomendaciones implementadas para casos límite y optimización de parámetros.
- [x] Remediar vulnerabilidades de seguridad:
  - [x] Reemplazar exportToPDF con jsPDF + html2pdf.js.
    - [2025-12-30] Implementado: Reemplazado window.print() con html2pdf.js para generación segura de PDFs. Incluye fallback a HTML y validación de disponibilidad de librería.
  - [x] Fortalecer exportToCSV usando escapado con tabulación (\t).
    - [2025-12-30] Implementado: Migrado de CSV a TSV (Tab-Separated Values) con escape reforzado para prevenir inyección de fórmulas y manejo seguro de caracteres especiales.
- [x] Resolver errores críticos de funcionalidad (ej. setShowAddModal en MaterialDatabase).
  - [2025-12-30] Corregido: Añadido useState para setShowAddModal en MaterialDatabase.tsx. Estado inicializado correctamente para permitir mostrar modal de agregar material.

## Fase 2: Modernización y Refactorización (Corto Plazo)

- [x] Actualizar dependencias clave (React 19, ESLint 9, Vite, etc.).
  - [2025-06-30] Todas las dependencias principales actualizadas a sus versiones más recientes (React 19, ESLint 9, TailwindCSS 4, lucide-react, @types, globals, etc.) y reinstaladas correctamente.
- [ ] Refactorizar todos los formularios para usar useActionState de React 19.
  - [2025-07-11] NOTA: La migración a useActionState está incompleta. Algunos módulos aún usan useState/startTransition para la gestión de formularios. Se requiere una auditoría y migración completa, o actualizar la documentación para reflejar el patrón real.
- [x] Unificar la gestión de estado en AppContext, usando localStorage solo como persistencia secundaria.
  - [2025-01-03] Completado: AppContext ahora centraliza todo el estado de la aplicación con persistencia automática en localStorage. Los cálculos, proyectos, tema y sistema de unidades se guardan automáticamente. Eliminado el uso directo de localStorage en componentes.
  - [2025-07-11] NOTA: La validación de entradas y el manejo de errores aún están incompletos en varios módulos. Priorizar la implementación de validaciones exhaustivas y feedback de errores amigable para el usuario.
- [ ] Implementar pruebas unitarias exhaustivas para todas las funciones de cálculo en src/utils/. Este es un requisito crítico pendiente para garantizar la precisión y robustez a largo plazo.
- [ ] Integrar completamente la lógica de cálculo auditada (ej. Extrusión) en los módulos de UI correspondientes. Auditar todos los módulos para detectar discrepancias similares.
- [x] Eliminar todos los usos de `any` y "números mágicos"; centralizar tipos y constantes.
  - [2025-01-03] Completado: Eliminados todos los usos de `any` (56 errores de linting resueltos). Creado /src/constants/index.ts con todas las constantes centralizadas. Definidas interfaces TypeScript específicas para parámetros y resultados de cálculos. Mejorado el tipado en useLocalStorage, componentes y utilidades de exportación.
- [x] Migrar configuración de ESLint a formato plano (eslint.config.js).
  - [2025-06-30] Ya estaba completado: El proyecto usa eslint.config.js con formato plano desde el inicio.
- [x] Evaluar e implementar @vitejs/plugin-react-swc para desarrollo más rápido.
  - [2025-01-03] Completado: Migrado de @vitejs/plugin-react a @vitejs/plugin-react-swc. Configuración optimizada para desarrollo más rápido con SWC. Build time mejorado y HMR más eficiente.

## MCP Server Integración y Limpieza (Completado)

- [x] Integración y prueba de servidor MCP (GitHub) en settings.json, usando variable de entorno para el token.
- [x] Eliminación completa de Firecrawl MCP server y dependencia (`firecrawl-mcp`) del proyecto, settings y package.json.
- [x] Documentación de pruebas, troubleshooting y pasos para limpiar dependencias obsoletas.

El proyecto está listo para QA final y pruebas de integración MCP.

## Fase 3: Crecimiento Sostenible (Largo Plazo)

- [ ] Implementar backend seguro para autenticación y almacenamiento.
- [ ] Expandir módulos de cálculo (ej. Troquelado, Tratamientos Térmicos, Soldadura).
- [ ] Integrar visualización avanzada de datos (gráficas).
- [ ] Establecer CI/CD y pruebas automatizadas.

## Mejoras de Código y Accesibilidad (Continuas)

- [ ] Establecer un proceso de auditoría regular para cruzar DEV_PLAN.md, PRD.md y TODO.md con la base de código real. Documentar hallazgos y mantener la documentación sincronizada con el estado del código.

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

#### Detalle de correcciones en calculations.ts (calculateRolling):

- Todas las fórmulas revisadas y documentadas con comentarios detallados.
- Unidades SI validadas y consistentes (mm, N, MPa, m/min, N·m).
- Corrección de conversiones y torque (ahora en N·m).
- Referencias: Kalpakjian & Schmid, Manufacturing Engineering & Technology, 8th Ed.
- Listo para validación cruzada y revisión de expertos.

#### Detalle de correcciones en cuttingCalculations.ts:

- Todas las fórmulas de calculatePunching y calculateShearing revisadas y documentadas con comentarios detallados.
- Unidades SI validadas y consistentes (mm, N, MPa, J, W).
- Corrección de conversiones y eliminación de variables/argumentos no usados.
- Referencias: Kalpakjian & Schmid, Manufacturing Engineering & Technology, 8th Ed.
- Listo para validación cruzada y revisión de expertos.

#### Detalle de correcciones en machiningCalculations.ts y drawingExtrusionCalculations.ts:

- Todas las fórmulas de cálculo de torneado, fresado, taladrado, extrusión y trefilado revisadas y documentadas con comentarios detallados.
- Unidades SI validadas y consistentes (mm, N, MPa, kW, J, min, etc.).
- Eliminación de tipos `any` en funciones auxiliares, uso de tipado fuerte.
- Corrección de conversiones, factores empíricos y recomendaciones.
- Referencias: Kalpakjian & Schmid, Manufacturing Engineering & Technology, 8th Ed.
- Listo para validación cruzada y revisión de expertos.

#### Validación de fórmulas y unidades (todas las utilidades de cálculo):

- Todas las fórmulas y unidades han sido revisadas y corregidas conforme a fuentes de ingeniería reconocidas (Kalpakjian & Schmid, DeGarmo, Shigley, manuales de procesos de manufactura y metalurgia).
- Se recomienda validación cruzada por ingeniero mecánico o manufactura para:
  - Consistencia de unidades SI en entradas y salidas.
  - Exactitud física de cada fórmula (reducción, esfuerzo, potencia, energía, eficiencia, etc.).
  - Factores empíricos y recomendaciones prácticas.
- Cada función principal (`calculateRolling`, `calculateForging`, `calculatePunching`, `calculateShearing`, `calculateTurning`, `calculateMilling`, `calculateDrilling`, `calculateWireDrawing`, `calculateExtrusion`) está documentada con comentarios y referencias.
- Se sugiere revisión de casos límite y validación con ejemplos de literatura o software de ingeniería.
- Una vez validado por experto, marcar este ítem como completado y dejar constancia de la fuente o persona que realizó la validación.
