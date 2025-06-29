# ProcessCalc

ProcessCalc is a modern, educational, and engineering-focused web application for simulating, analyzing, and optimizing various manufacturing processes. It provides interactive modules for metal cutting, volumetric deformation (rolling, forging, drawing, extrusion), machining operations (turning, milling, drilling), and more. The app is built with React, TypeScript, Vite, and Tailwind CSS, and is designed for both students and professionals in manufacturing, mechanical engineering, and materials science.

## Features

- **Metal Cutting Module:** Calculate punching forces, assess cut quality, estimate tool wear, and receive actionable recommendations.
- **Volumetric Deformation Module:** Simulate rolling, forging, drawing, and extrusion processes with detailed input validation and engineering calculations.
- **Machining Operations Module:** Analyze turning, milling, and drilling with cost, tool life, and process optimization suggestions.
- **Calculation History:** Save, review, and manage past calculations and projects.
- **Educational Resources:** Access learning materials and explanations for each process.
- **Modern UI:** Responsive, theme-aware interface with clear visual indicators and recommendations.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context API

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```
3. **Build for production:**
   ```sh
   npm run build
   ```
4. **Preview production build:**
   ```sh
   npm run preview
   ```

## Folder Structure

- `src/components/Modules/` — Main process modules (MetalCutting, VolumetricDeformation, MachiningOperations, etc.)
- `src/components/UI/` — Reusable UI components (QualityIndicator, RecommendationCard, etc.)
- `src/utils/` — Calculation logic for each process
- `src/contexts/` — App-wide state management
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript type definitions

## Contributing

Contributions are welcome! Please see `TODO.md` and `PLANNING.md` for current tasks and roadmap.

## License

MIT License
