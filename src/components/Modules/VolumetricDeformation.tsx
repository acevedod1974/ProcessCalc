// ...existing code...
import React, { useState, startTransition } from "react";
import { useApp } from "../../contexts/AppContext";
// Removed unused UI imports after modularization
import { RollingModule } from "./RollingModule";
import { saveCalculation } from "../../utils/api";
import type { Calculation } from "../../types";
import { ForgingModule } from "./ForgingModule";
import { DrawingModule } from "./DrawingModule";
import { ExtrusionModule } from "./ExtrusionModule";
import { Hammer, Settings, Download, AlertCircle } from "lucide-react";
// Removed unused rolling and drawing imports after modularization

const formingMaterialOptions = [
  { value: "steel-low-carbon", label: "Steel (Low Carbon)" },
  { value: "steel-medium-carbon", label: "Steel (Medium Carbon)" },
  { value: "aluminum-6061", label: "Aluminum 6061" },
  { value: "copper", label: "Copper" },
  // Add more as needed, ensure value matches MATERIALS keys
];

type DeformationProcess = "rolling" | "forging" | "drawing" | "extrusion";

export function VolumetricDeformation() {
  // --- EXTRUSION STATE/ACTION ---
  // (Type and initial state are declared only once, here)
  // Declare extrusionState and extrusionSubmit first
  // (Assume extrusionAction and initial state are defined in a module or above)
  // --- EXTRUSION STATE/ACTION ---
  // Move the extrusionAction function definition here (from previous modularization or backup)
  // Removed: ExtrusionFormState type, now handled inside ExtrusionModule

  // Removed: validateExtrusionInputs is now handled inside ExtrusionModule

  // Removed: extrusionAction is now handled inside ExtrusionModule

  // Removed: extrusionState and extrusionSubmit are now managed inside ExtrusionModule

  // Removed: extrusionState effect, now handled inside ExtrusionModule
  // Removed: extrusionFields and setExtrusionFields, now handled inside ExtrusionModule

  // extrusionState is declared later, so move this effect after extrusionState is defined
  // handleExtrusionSubmit removed: now handled internally by ExtrusionModule
  const { state } = useApp();
  const isDark = state.theme.mode === "dark";

  // State management
  const [activeProcess, setActiveProcess] =
    useState<DeformationProcess>("rolling");

  // Handler to save calculation only
  const handleSaveCalculation = async (calculation: Calculation) => {
    await saveCalculation(calculation);
    // Optionally: show a toast or notification here
  };

  // ...existing code...
  // All rolling, forging, and drawing state/action logic has been removed from this file.
  // These are now fully managed within their respective modules.
  // Only extrusion logic remains here.
  // ...existing code...
  const processes = [
    {
      id: "rolling",
      name: "Rolling",
      description: "Sheet & Plate Rolling",
      icon: "🔄",
    },
    {
      id: "forging",
      name: "Forging",
      description: "Open & Closed Die",
      icon: "🔨",
    },
    {
      id: "drawing",
      name: "Drawing",
      description: "Wire & Tube Drawing",
      icon: "📏",
    },
    {
      id: "extrusion",
      name: "Extrusion",
      description: "Direct & Indirect",
      icon: "⚡",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`p-3 rounded-lg ${
              isDark ? "bg-blue-900" : "bg-blue-100"
            }`}
          >
            <Hammer
              className={`${isDark ? "text-blue-300" : "text-blue-600"}`}
              size={24}
            />
          </div>
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Volumetric Deformation
            </h1>
            <p className={`${isDark ? "text-slate-400" : "text-gray-600"}`}>
              Rolling, Forging, Drawing, and Extrusion Analysis
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              isDark
                ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              isDark
                ? "bg-blue-900 hover:bg-blue-800 text-blue-300"
                : "bg-blue-100 hover:bg-blue-200 text-blue-700"
            }`}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Process Selection */}
      <div
        className={`${
          isDark ? "bg-slate-800" : "bg-white"
        } rounded-xl shadow-lg p-6`}
      >
        <h2
          className={`text-lg font-semibold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Deformation Process Selection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {processes.map((process) => (
            <button
              key={process.id}
              onClick={() => setActiveProcess(process.id as DeformationProcess)}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                activeProcess === process.id
                  ? isDark
                    ? "border-blue-500 bg-blue-900 text-blue-300"
                    : "border-blue-500 bg-blue-50 text-blue-700"
                  : isDark
                  ? "border-slate-600 hover:border-slate-500 text-slate-300"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <div className="text-2xl mb-2">{process.icon}</div>
              <div className="font-medium">{process.name}</div>
              <div
                className={`text-sm mt-1 ${
                  activeProcess === process.id
                    ? isDark
                      ? "text-blue-400"
                      : "text-blue-600"
                    : isDark
                    ? "text-slate-400"
                    : "text-gray-500"
                }`}
              >
                {process.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Rolling Process */}
      {activeProcess === "rolling" && (
        <RollingModule
          state={state}
          isDark={isDark}
          formingMaterialOptions={formingMaterialOptions}
          startTransition={startTransition}
          onSaveCalculation={handleSaveCalculation}
        />
      )}

      {/* Forging Process */}
      {activeProcess === "forging" && (
        <ForgingModule
          state={state}
          isDark={isDark}
          formingMaterialOptions={formingMaterialOptions}
          startTransition={startTransition}
        />
      )}

      {/* Drawing Process */}
      {activeProcess === "drawing" && (
        <DrawingModule
          state={state}
          isDark={isDark}
          formingMaterialOptions={formingMaterialOptions}
          startTransition={startTransition}
        />
      )}

      {/* Extrusion Process */}
      {activeProcess === "extrusion" && (
        <ExtrusionModule
          state={state}
          isDark={isDark}
          formingMaterialOptions={formingMaterialOptions}
          startTransition={startTransition}
        />
      )}

      {/* Information Panel */}
      <div
        className={`${
          isDark ? "bg-blue-900/30" : "bg-blue-50"
        } rounded-xl p-6 border ${
          isDark ? "border-blue-800" : "border-blue-200"
        }`}
      >
        <div className="flex items-start space-x-3">
          <AlertCircle
            className={`${isDark ? "text-blue-300" : "text-blue-700"} mt-1`}
            size={20}
          />
          <div>
            <h4
              className={`font-semibold mb-2 ${
                isDark ? "text-blue-300" : "text-blue-700"
              }`}
            >
              Volumetric Deformation Process Notes
            </h4>
            <div
              className={`text-sm space-y-1 ${
                isDark ? "text-blue-200" : "text-blue-600"
              }`}
            >
              <p>
                • Calculations are based on established metal forming theories
                and empirical data
              </p>
              <p>
                • Material properties include temperature and strain rate
                dependencies
              </p>
              <p>
                • Friction effects are considered in force and power
                calculations
              </p>
              <p>
                • Results provide estimates - actual values may vary based on
                specific conditions
              </p>
              {activeProcess === "rolling" && (
                <p>
                  • Rolling calculations assume steady-state conditions with
                  constant parameters
                </p>
              )}
              {activeProcess === "forging" && (
                <p>
                  • Forging analysis includes friction factor based on die
                  geometry
                </p>
              )}
              {activeProcess === "drawing" && (
                <p>
                  • Drawing calculations consider die angle and lubrication
                  effects
                </p>
              )}
              {activeProcess === "extrusion" && (
                <p>
                  • Extrusion analysis accounts for temperature effects and die
                  design
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
