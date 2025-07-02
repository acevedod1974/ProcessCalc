// ...existing code...
import React, { useState, useActionState, startTransition } from "react";
import { useApp } from "../../contexts/AppContext";
// Removed unused UI imports after modularization
import { RollingModule } from "./RollingModule";
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
  type ExtrusionFormState = {
    params: {
      material: string;
      billetDiameter: string;
      extrudedDiameter: string;
      billetLength: string;
      extrusionSpeed: string;
      extrusionType: string;
      dieAngle: string;
      temperature: string;
      lubrication: boolean;
    };
    errors: Record<string, string>;
    results: unknown;
    isCalculating: boolean;
  };

  function validateExtrusionInputs(
    params: ExtrusionFormState["params"]
  ): Record<string, string> {
    const newErrors: Record<string, string> = {};
    if (!params.material) newErrors.material = "Material is required";
    if (!params.billetDiameter || Number(params.billetDiameter) <= 0)
      newErrors.billetDiameter = "Billet diameter must be greater than 0";
    if (!params.extrudedDiameter || Number(params.extrudedDiameter) <= 0)
      newErrors.extrudedDiameter = "Extruded diameter must be greater than 0";
    if (Number(params.extrudedDiameter) >= Number(params.billetDiameter))
      newErrors.extrudedDiameter =
        "Extruded diameter must be less than billet diameter";
    if (!params.billetLength || Number(params.billetLength) <= 0)
      newErrors.billetLength = "Billet length must be greater than 0";
    if (!params.extrusionSpeed || Number(params.extrusionSpeed) <= 0)
      newErrors.extrusionSpeed = "Extrusion speed must be greater than 0";
    if (!params.extrusionType)
      newErrors.extrusionType = "Extrusion type is required";
    return newErrors;
  }

  async function extrusionAction(
    prevState: ExtrusionFormState,
    formData: ExtrusionFormState["params"]
  ): Promise<ExtrusionFormState> {
    const errors = validateExtrusionInputs(formData);
    if (Object.keys(errors).length > 0) {
      return { ...prevState, errors, isCalculating: false };
    }
    try {
      // Log input parameters for debugging
      console.log("[Extrusion] Input Params:", formData);

      // Dummy calculation results for verification
      const results = {
        extrusionRatio: 10.5,
        areaReductionRatio: 85.2,
        extrusionForce: 120000,
        extrusionPressure: 350,
        extrusionPower: 45,
        extrusionTime: 2.5,
        materialFlow: 150,
        workDone: 320,
        efficiency: 92,
      };
      // Log output results for debugging
      console.log("[Extrusion] Results:", results);
      return { ...prevState, results, errors: {}, isCalculating: false };
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      return { ...prevState, errors: { global: errMsg }, isCalculating: false };
    }
  }

  const [extrusionState, extrusionSubmit] = useActionState(extrusionAction, {
    params: {
      material: "",
      billetDiameter: "",
      extrudedDiameter: "",
      billetLength: "",
      extrusionSpeed: "",
      extrusionType: "direct",
      dieAngle: "45",
      temperature: "400",
      lubrication: false,
    },
    errors: {},
    results: null,
    isCalculating: false,
  });

  React.useEffect(() => {
    if (extrusionState && extrusionState.params) {
      setExtrusionFields(extrusionState.params);
    }
  }, [extrusionState]);
  // --- EXTRUSION FORM LOCAL STATE ---
  // (Type and initial state are already declared later in the file, so only declare the state variable here)
  const [extrusionFields, setExtrusionFields] = useState({
    material: "",
    billetDiameter: "",
    extrudedDiameter: "",
    billetLength: "",
    extrusionSpeed: "",
    extrusionType: "direct",
    dieAngle: "45",
    temperature: "400",
    lubrication: false,
  });

  // extrusionState is declared later, so move this effect after extrusionState is defined

  // When user clicks Calculate, update extrusionState with current fields
  const handleExtrusionSubmit = () => {
    extrusionSubmit(extrusionFields);
  };
  const { state } = useApp();
  const isDark = state.theme.mode === "dark";

  // State management
  const [activeProcess, setActiveProcess] =
    useState<DeformationProcess>("rolling");

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
          extrusionFields={extrusionFields}
          setExtrusionFields={setExtrusionFields}
          extrusionState={extrusionState}
          extrusionSubmit={handleExtrusionSubmit}
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
