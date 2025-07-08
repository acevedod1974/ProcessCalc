import React from "react";
import { InputField } from "../UI/InputField";
import { ResultCard } from "../UI/ResultCard";
import { Calculator, CheckCircle } from "lucide-react";
import { RecommendationCard } from "../UI/RecommendationCard";
import {
  WireDrawingParameters,
  WireDrawingResults,
  calculateWireDrawing,
} from "../../utils/drawingExtrusionCalculations";
import { AppState } from "../../contexts/AppContext";

interface DrawingModuleProps {
  state: AppState;
  isDark: boolean;
  formingMaterialOptions: { value: string; label: string }[];
  startTransition: (cb: () => void) => void;
}

export function DrawingModule({
  state,
  isDark,
  formingMaterialOptions,
  startTransition,
}: DrawingModuleProps) {
  // Local state for form fields
  const [fields, setFields] = React.useState<Partial<WireDrawingParameters>>({
    material: "",
    initialDiameter: "",
    finalDiameter: "",
    drawingSpeed: "",
    numberOfPasses: "1",
    dieAngle: "8",
    temperature: "20",
    lubrication: false,
  });
  const [formState, setFormState] = React.useState<{
    params: Partial<WireDrawingParameters>;
    isCalculating: boolean;
    errors: Record<string, string>;
    results: WireDrawingResults | null;
  }>({
    params: fields,
    isCalculating: false,
    errors: {},
    results: null,
  });

  // Validation
  function validateInputs(
    params: Partial<WireDrawingParameters>
  ): Record<string, string> {
    const newErrors: Record<string, string> = {};
    if (!params.material) newErrors.material = "Material is required";
    if (!params.initialDiameter || Number(params.initialDiameter) <= 0)
      newErrors.initialDiameter = "Initial diameter must be greater than 0";
    if (!params.finalDiameter || Number(params.finalDiameter) <= 0)
      newErrors.finalDiameter = "Final diameter must be greater than 0";
    if (
      params.initialDiameter &&
      params.finalDiameter &&
      Number(params.finalDiameter) >= Number(params.initialDiameter)
    )
      newErrors.finalDiameter =
        "Final diameter must be less than initial diameter";
    if (!params.drawingSpeed || Number(params.drawingSpeed) <= 0)
      newErrors.drawingSpeed = "Drawing speed must be greater than 0";
    if (!params.numberOfPasses || Number(params.numberOfPasses) < 1)
      newErrors.numberOfPasses = "Number of passes must be at least 1";
    if (!params.dieAngle || Number(params.dieAngle) <= 0)
      newErrors.dieAngle = "Die angle must be greater than 0";
    return newErrors;
  }

  // Calculation logic (dummy fallback if not implemented)
  function calculate(
    params: Partial<WireDrawingParameters>
  ): WireDrawingResults {
    // Defensive: Only call if material is valid
    const DRAWING_MATERIALS = {
      "steel-low-carbon": true,
      "aluminum-1100": true,
      "copper-c110": true,
      "stainless-304": true,
    };
    if (
      typeof calculateWireDrawing === "function" &&
      params.material &&
      DRAWING_MATERIALS[params.material]
    ) {
      return calculateWireDrawing(params as WireDrawingParameters);
    }
    // Dummy fallback
    return {
      reductionRatio: 0,
      drawingForce: 0,
      drawingPower: 0,
      efficiency: 0,
      reductionPerPass: 0,
      drawingStress: 0,
      dieStress: 0,
      workDone: 0,
      recommendations: [],
    };
  }

  // Submit handler
  function handleSubmit() {
    setFormState((prev) => ({ ...prev, isCalculating: true }));
    const errors = validateInputs(fields);
    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({ ...prev, errors, isCalculating: false }));
      return;
    }
    setTimeout(() => {
      const results = calculate(fields);
      setFormState((prev) => ({
        ...prev,
        params: fields,
        isCalculating: false,
        errors: {},
        results,
      }));
    }, 300);
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`${
            isDark ? "bg-slate-800" : "bg-white"
          } rounded-xl shadow-lg p-6`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Wire Specifications
          </h3>
          <div className="space-y-4">
            <InputField
              label="Material"
              value={fields.material || ""}
              onChange={(value: string) =>
                setFields((f) => ({ ...f, material: value }))
              }
              type="select"
              options={formingMaterialOptions}
              placeholder="Select Material..."
              required
              error={formState.errors.material}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Initial Diameter"
                value={fields.initialDiameter || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, initialDiameter: value }))
                }
                type="number"
                placeholder="5.0"
                unit={state.unitSystem.length}
                required
                step="0.1"
                min="0"
                error={formState.errors.initialDiameter}
              />
              <InputField
                label="Final Diameter"
                value={fields.finalDiameter || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, finalDiameter: value }))
                }
                type="number"
                placeholder="4.0"
                unit={state.unitSystem.length}
                required
                step="0.1"
                min="0"
                error={formState.errors.finalDiameter}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Drawing Speed"
                value={fields.drawingSpeed || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, drawingSpeed: value }))
                }
                type="number"
                placeholder="10.0"
                unit="m/min"
                required
                step="0.1"
                min="0"
                error={formState.errors.drawingSpeed}
              />
              <InputField
                label="Number of Passes"
                value={fields.numberOfPasses || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, numberOfPasses: value }))
                }
                type="number"
                placeholder="1"
                required
                step="1"
                min="1"
                error={formState.errors.numberOfPasses}
              />
            </div>
          </div>
        </div>
        <div
          className={`${
            isDark ? "bg-slate-800" : "bg-white"
          } rounded-xl shadow-lg p-6`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Process Parameters
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Die Angle"
                value={fields.dieAngle || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, dieAngle: value }))
                }
                type="number"
                placeholder="8"
                unit="degrees"
                step="0.5"
                min="0"
                max="30"
              />
              <InputField
                label="Temperature"
                value={fields.temperature || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, temperature: value }))
                }
                type="number"
                placeholder="20"
                unit={state.unitSystem.temperature}
                step="1"
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="lubrication-drawing"
                checked={fields.lubrication || false}
                onChange={(e) =>
                  setFields((f) => ({ ...f, lubrication: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="lubrication-drawing"
                className={`text-sm font-medium ${
                  isDark ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Use Lubrication
              </label>
            </div>
            <button
              onClick={() => startTransition(handleSubmit)}
              disabled={formState.isCalculating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {formState.isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <Calculator size={16} />
                  <span>Calculate Drawing</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {formState.results && (
        <>
          <div
            className={`${
              isDark ? "bg-slate-800" : "bg-white"
            } rounded-xl shadow-lg p-6`}
          >
            <div className="flex items-center space-x-2 mb-6">
              <CheckCircle
                className={`${isDark ? "text-green-400" : "text-green-600"}`}
                size={20}
              />
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Wire Drawing Analysis Results
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <ResultCard
                title="Reduction Ratio"
                value={formState.results.reductionRatio}
                unit="%"
                description="Area reduction percentage"
                trend="up"
              />
              <ResultCard
                title="Drawing Force"
                value={formState.results.drawingForce}
                unit={state.unitSystem.force}
                description="Force required for drawing"
                trend="up"
              />
              <ResultCard
                title="Drawing Power"
                value={formState.results.drawingPower}
                unit={state.unitSystem.power}
                description="Power consumption"
                trend="up"
              />
              <ResultCard
                title="Efficiency"
                value={formState.results.efficiency}
                unit="%"
                description="Process efficiency"
                trend="up"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <ResultCard
                title="Reduction per Pass"
                value={formState.results.reductionPerPass}
                unit="%"
                description="Reduction per drawing pass"
                trend="neutral"
              />
              <ResultCard
                title="Drawing Stress"
                value={formState.results.drawingStress}
                unit={state.unitSystem.pressure}
                description="Stress in drawn wire"
                trend="up"
              />
              <ResultCard
                title="Die Stress"
                value={formState.results.dieStress}
                unit={state.unitSystem.pressure}
                description="Stress on drawing die"
                trend="up"
              />
              <ResultCard
                title="Work Done"
                value={formState.results.workDone}
                unit="kJ"
                description="Energy consumed"
                trend="neutral"
              />
            </div>
          </div>
          <RecommendationCard
            recommendations={formState.results.recommendations}
            type="info"
          />
        </>
      )}
    </>
  );
}
