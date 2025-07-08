# TODOs for ProcessCalc

This file tracks outstanding tasks, bugs, and feature requests for the ProcessCalc project. Please update as you work!

## High Priority

- [ ] Complete and test the `handleExtrusionCalculation` logic in `VolumetricDeformation.tsx`
- [ ] Add missing input validation for all modules (double-check edge cases)
- [ ] Improve error handling and user feedback for calculation errors
- [ ] Expand the educational resources module with more process explanations and diagrams
- [ ] Add unit tests for calculation functions in `src/utils/`
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

For roadmap and broader planning, see `PLANNING.md`.
