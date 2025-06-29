# ProcessCalc DEV Branch Refactoring & Improvement Plan

This plan integrates all code review feedback and best practices for ProcessCalc. Work through each section in order, checking off items as you complete them. Update this file as you progress.

---

## 1. Critical Fixes

- [x] Ensure `src/components/Modules/VolumetricDeformation.tsx` exists and is correctly implemented.
- [x] Restore or recreate any missing core modules referenced in the UI.

## 2. Security Improvements

- [x] Refactor `exportToPDF` in `src/utils/exportUtils.ts` to use HTML escaping or a template library and remove all `any` types from export utilities.
- [x] Audit all user-generated content for XSS risks (including CSV formula injection and HTML export).

## 3. Performance Optimizations

- [x] Use `React.memo` for pure UI components.
- [ ] Use `useMemo` for expensive calculations and large data (e.g., material databases).
- [ ] Refactor `MaterialDatabase.tsx` to avoid recreating large objects on every render.
- [ ] Ensure all `setTimeout` and event listeners are properly cleaned up.

## 4. Code Quality & Consistency

- [ ] Standardize error handling: use a consistent pattern (throw or result object).
- [ ] Implement a global error boundary in the React app.
- [ ] Add return type annotations and replace all `any` types with proper interfaces.
- [ ] Refactor repeated validation and recommendation logic into shared utility functions.
- [ ] Consolidate material property interfaces to avoid duplication.

## 5. Accessibility

- [ ] Add ARIA labels to all interactive elements.
- [ ] Implement focus management for modals/dialogs.
- [ ] Ensure color indicators have text alternatives.
- [ ] Use semantic HTML structure throughout.

## 6. Architecture & State Management

- [ ] Move business logic out of UI components into service layers.
- [ ] Centralize unit conversions and constants.
- [ ] Move global data to context or a state manager.
- [ ] Add persistence for user preferences (e.g., theme, last used material).
- [ ] Optimize context updates to avoid unnecessary re-renders.

## 7. Best Practices & Organization

- [ ] Split files exceeding 500 lines.
- [ ] Separate concerns in utility files.
- [ ] Organize shared components in a dedicated folder.
- [ ] Standardize naming conventions (camelCase, PascalCase).
- [ ] Replace magic numbers and hardcoded values with named constants.

## 8. Documentation

- [ ] Add JSDoc comments to all complex functions.
- [ ] Document calculation formulas and logic.
- [ ] Add descriptions to all type interfaces.

## 9. Minor Improvements

- [ ] Remove `console.error` from production code; use a logging service.
- [ ] Replace hardcoded URLs/paths with config or environment variables.

---

Work through each section in order. For each completed item, check it off and commit your changes to the `dev` branch. Regularly merge improvements into `main` after testing.
