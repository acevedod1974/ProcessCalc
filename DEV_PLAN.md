# ProcessCalc DEV Branch Refactoring, Auditoría y Modernización

Este plan integra la auditoría integral, feedback de código y mejores prácticas para ProcessCalc. Trabaja cada sección en orden, marcando los ítems completados. Actualiza este archivo conforme avances.

---

## Fase 1: Corrección Fundamental (Prioridad Inmediata)

- [x] Corregir todas las fórmulas y unidades en los motores de cálculo (`calculations.ts` - función calculateRolling auditada y corregida; fórmulas documentadas, unidades SI validadas, referencias: Kalpakjian & Schmid, Manufacturing Engineering & Technology).
  - [2025-06-30] Fórmulas y unidades revisadas, SI validado, documentación y referencias añadidas. Ver detalles al final del plan.
- [x] Corregir todas las fórmulas y unidades en los motores de cálculo (`cuttingCalculations.ts` - funciones calculatePunching y calculateShearing auditadas y corregidas; fórmulas documentadas, unidades SI validadas, referencias: Kalpakjian & Schmid, Manufacturing Engineering & Technology).
  - [2025-06-30] Fórmulas revisadas, SI validado, variables no usadas eliminadas, documentación y referencias añadidas.
- [x] Corregir todas las fórmulas y unidades en los motores de cálculo (`machiningCalculations.ts`, `drawingExtrusionCalculations.ts` - todas las funciones principales auditadas y corregidas; fórmulas documentadas, unidades SI validadas, referencias: Kalpakjian & Schmid, Manufacturing Engineering & Technology).
  - [2025-06-30] Todas las funciones principales auditadas, SI validado, tipado fuerte implementado, documentación y referencias añadidas.
- [ ] Validar todas las fórmulas con fuentes de ingeniería y/o expertos.
- [ ] Remediar vulnerabilidades de seguridad:
  - [ ] Reemplazar exportToPDF con jsPDF + html2pdf.js.
  - [ ] Fortalecer exportToCSV usando escapado con tabulación (\t).
- [ ] Resolver errores críticos de funcionalidad (ej. setShowAddModal en MaterialDatabase).

## Fase 2: Modernización y Refactorización (Corto Plazo)

- [x] Actualizar dependencias clave (React 19, ESLint 9, Vite, etc.).
  - [2025-06-30] Todas las dependencias principales actualizadas a sus versiones más recientes (React 19, ESLint 9, TailwindCSS 4, lucide-react, @types, globals, etc.) y reinstaladas correctamente.
- [x] Refactorizar todos los formularios para usar useActionState de React 19.
  - [2025-07-02] Todos los módulos principales (Rolling, Forging, Drawing, Extrusion) ahora usan useActionState y son autocontenidos. Lógica, validación y resultados gestionados internamente. UI/UX y recomendaciones unificadas.
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
