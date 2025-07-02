import React from "react";
import { InputField } from "../UI/InputField";
import { ResultCard } from "../UI/ResultCard";
import { Calculator, CheckCircle } from "lucide-react";
// Types are now defined locally to avoid undefined props from main file modularization
type ForgingParameters = {
  material: string;
  initialHeight: string;
  finalHeight: string;
  diameter: string;
  dieType: string;
  frictionCoefficient?: string;
  temperature?: string;
};

type ForgingResults = {
  reductionRatio: number;
  forgingForce: number;
  workDone: number;
  efficiency: number;
};

type ForgingFormState = {
  params: Partial<ForgingParameters>;
  isCalculating: boolean;
  errors: Record<string, string>;
  results: ForgingResults | null;
};
import { AppState } from "../../contexts/AppContext";

interface ForgingModuleProps {
  state: AppState;
  isDark: boolean;
  formingMaterialOptions: { value: string; label: string }[];
  startTransition: (cb: () => void) => void;
}

export function ForgingModule({
  state,
  isDark,
  formingMaterialOptions,
  startTransition,
}: ForgingModuleProps) {
  // Local state for form fields
  const [fields, setFields] = React.useState<Partial<ForgingParameters>>({
    material: "",
    initialHeight: "",
    finalHeight: "",
    diameter: "",
    dieType: "",
    frictionCoefficient: "0.3",
    temperature: "20",
  });
  const [formState, setFormState] = React.useState<ForgingFormState>({
    params: fields,
    isCalculating: false,
    errors: {},
    results: null,
  });

  // Validation
  function validateInputs(
    params: Partial<ForgingParameters>
  ): Record<string, string> {
    const newErrors: Record<string, string> = {};
    if (!params.material) newErrors.material = "Material is required";
    if (!params.initialHeight || Number(params.initialHeight) <= 0)
      newErrors.initialHeight = "Initial height must be greater than 0";
    if (!params.finalHeight || Number(params.finalHeight) <= 0)
      newErrors.finalHeight = "Final height must be greater than 0";
    if (
      params.initialHeight &&
      params.finalHeight &&
      Number(params.finalHeight) >= Number(params.initialHeight)
    )
      newErrors.finalHeight = "Final height must be less than initial height";
    if (!params.diameter || Number(params.diameter) <= 0)
      newErrors.diameter = "Diameter must be greater than 0";
    if (!params.dieType) newErrors.dieType = "Die type is required";
    return newErrors;
  }

  // Calculation logic (dummy for now)
  function calculateForging(params: Partial<ForgingParameters>) {
    // Dummy calculation for demonstration
    const reductionRatio =
      params.initialHeight && params.finalHeight
        ? ((Number(params.initialHeight) - Number(params.finalHeight)) /
            Number(params.initialHeight)) *
          100
        : 0;
    const forgingForce = params.diameter ? Number(params.diameter) * 1000 : 0;
    const workDone =
      forgingForce *
      ((Number(params.initialHeight) || 0) - (Number(params.finalHeight) || 0));
    const efficiency = 90;
    return {
      reductionRatio,
      forgingForce,
      workDone,
      efficiency,
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
    // Simulate async calculation
    setTimeout(() => {
      const results = calculateForging(fields);
      setFormState({
        params: fields,
        isCalculating: false,
        errors: {},
        results,
      });
    }, 500);
  }
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`$${
            isDark ? "bg-slate-800" : "bg-white"
          } rounded-xl shadow-lg p-6`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Material & Geometry
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
                label="Initial Height"
                value={fields.initialHeight || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, initialHeight: value }))
                }
                type="number"
                placeholder="50.0"
                unit={state.unitSystem.length}
                required
                step="0.1"
                min="0"
                error={formState.errors.initialHeight}
              />
              <InputField
                label="Final Height"
                value={fields.finalHeight || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, finalHeight: value }))
                }
                type="number"
                placeholder="30.0"
                unit={state.unitSystem.length}
                required
                step="0.1"
                min="0"
                error={formState.errors.finalHeight}
              />
            </div>
            <InputField
              label="Diameter"
              value={fields.diameter || ""}
              onChange={(value: string) =>
                setFields((f) => ({ ...f, diameter: value }))
              }
              type="number"
              placeholder="100.0"
              unit={state.unitSystem.length}
              required
              step="1"
              min="0"
              error={formState.errors.diameter}
            />
          </div>
        </div>
        <div
          className={`$${
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
            <InputField
              label="Die Type"
              value={fields.dieType || ""}
              onChange={(value: string) =>
                setFields((f) => ({ ...f, dieType: value }))
              }
              type="select"
              options={[
                { value: "flat", label: "Flat Die" },
                { value: "grooved", label: "Grooved Die" },
              ]}
              placeholder="Select Die Type..."
              required
              error={formState.errors.dieType}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Friction Coefficient"
                value={fields.frictionCoefficient || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, frictionCoefficient: value }))
                }
                type="number"
                placeholder="0.3"
                step="0.01"
                min="0"
                max="1"
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
                  <span>Calculate Forging</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {formState.results && (
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
              Forging Analysis Results
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              title="Reduction Ratio"
              value={formState.results.reductionRatio}
              unit="%"
              description="Height reduction percentage"
              trend="up"
            />
            <ResultCard
              title="Forging Force"
              value={formState.results.forgingForce}
              unit={state.unitSystem.force}
              description="Force required for forging"
              trend="up"
            />
            <ResultCard
              title="Work Done"
              value={formState.results.workDone}
              unit="kJ"
              description="Energy consumed"
              trend="neutral"
            />
            <ResultCard
              title="Efficiency"
              value={formState.results.efficiency}
              unit="%"
              description="Process efficiency"
              trend="up"
            />
          </div>
        </div>
      )}
    </>
  );
}
