import React from "react";
import { InputField } from "../UI/InputField";
import { ResultCard } from "../UI/ResultCard";
import { Calculator, CheckCircle } from "lucide-react";
import { RecommendationCard } from "../UI/RecommendationCard";
import {
  ExtrusionParameters,
  ExtrusionResults,
  calculateExtrusion,
} from "../../utils/drawingExtrusionCalculations";
import { AppState } from "../../contexts/AppContext";

interface ExtrusionModuleProps {
  state: AppState;
  isDark: boolean;
  formingMaterialOptions: { value: string; label: string }[];
  startTransition: (cb: () => void) => void;
}

export function ExtrusionModule({
  state,
  isDark,
  formingMaterialOptions,
  startTransition,
}: ExtrusionModuleProps) {
  // Local state for form fields
  const [fields, setFields] = React.useState<Partial<ExtrusionParameters>>({
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
  const [formState, setFormState] = React.useState<{
    params: Partial<ExtrusionParameters>;
    isCalculating: boolean;
    errors: Record<string, string>;
    results: ExtrusionResults | null;
  }>({
    params: fields,
    isCalculating: false,
    errors: {},
    results: null,
  });

  function validateInputs(
    params: Partial<ExtrusionParameters>
  ): Record<string, string> {
    const newErrors: Record<string, string> = {};
    if (!params.material) newErrors.material = "Material is required";
    if (!params.billetDiameter || Number(params.billetDiameter) <= 0)
      newErrors.billetDiameter = "Billet diameter must be greater than 0";
    if (!params.extrudedDiameter || Number(params.extrudedDiameter) <= 0)
      newErrors.extrudedDiameter = "Extruded diameter must be greater than 0";
    if (
      params.billetDiameter &&
      params.extrudedDiameter &&
      Number(params.extrudedDiameter) >= Number(params.billetDiameter)
    )
      newErrors.extrudedDiameter =
        "Extruded diameter must be less than billet diameter";
    if (!params.billetLength || Number(params.billetLength) <= 0)
      newErrors.billetLength = "Billet length must be greater than 0";
    if (!params.extrusionSpeed || Number(params.extrusionSpeed) <= 0)
      newErrors.extrusionSpeed = "Extrusion speed must be greater than 0";
    if (!params.extrusionType)
      newErrors.extrusionType = "Extrusion type is required";
    if (!params.dieAngle || Number(params.dieAngle) <= 0)
      newErrors.dieAngle = "Die angle must be greater than 0";
    return newErrors;
  }

  function calculate(params: Partial<ExtrusionParameters>): ExtrusionResults {
    if (
      typeof params.material === "string" &&
      params.billetDiameter &&
      params.extrudedDiameter &&
      params.billetLength &&
      params.extrusionSpeed &&
      params.extrusionType &&
      params.dieAngle &&
      params.temperature
    ) {
      // @ts-expect-error: Partial to full type
      return calculateExtrusion(params);
    }
    // Dummy fallback
    return {
      extrusionRatio: 0,
      extrusionForce: 0,
      extrusionPressure: 0,
      extrusionPower: 0,
      extrusionTime: 0,
      materialFlow: 0,
      workDone: 0,
      efficiency: 0,
      recommendations: [],
    };
  }

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
            Billet Specifications
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
                label="Billet Diameter"
                value={fields.billetDiameter || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, billetDiameter: value }))
                }
                type="number"
                placeholder="100.0"
                unit={state.unitSystem.length}
                required
                step="1"
                min="0"
                error={formState.errors.billetDiameter}
              />
              <InputField
                label="Extruded Diameter"
                value={fields.extrudedDiameter || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, extrudedDiameter: value }))
                }
                type="number"
                placeholder="20.0"
                unit={state.unitSystem.length}
                required
                step="1"
                min="0"
                error={formState.errors.extrudedDiameter}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Billet Length"
                value={fields.billetLength || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, billetLength: value }))
                }
                type="number"
                placeholder="200.0"
                unit={state.unitSystem.length}
                required
                step="1"
                min="0"
                error={formState.errors.billetLength}
              />
              <InputField
                label="Extrusion Speed"
                value={fields.extrusionSpeed || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, extrusionSpeed: value }))
                }
                type="number"
                placeholder="5.0"
                unit="mm/min"
                required
                step="0.1"
                min="0"
                error={formState.errors.extrusionSpeed}
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
            <InputField
              label="Extrusion Type"
              value={fields.extrusionType || ""}
              onChange={(value: string) =>
                setFields((f) => ({ ...f, extrusionType: value }))
              }
              type="select"
              options={[
                { value: "direct", label: "Direct Extrusion" },
                { value: "indirect", label: "Indirect Extrusion" },
              ]}
              placeholder="Select Extrusion Type..."
              required
              error={formState.errors.extrusionType}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Die Angle"
                value={fields.dieAngle || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, dieAngle: value }))
                }
                type="number"
                placeholder="45"
                unit="degrees"
                step="1"
                min="0"
                max="90"
              />
              <InputField
                label="Temperature"
                value={fields.temperature || ""}
                onChange={(value: string) =>
                  setFields((f) => ({ ...f, temperature: value }))
                }
                type="number"
                placeholder="400"
                unit={state.unitSystem.temperature}
                step="10"
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="lubrication-extrusion"
                checked={fields.lubrication || false}
                onChange={(e) =>
                  setFields((f) => ({ ...f, lubrication: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="lubrication-extrusion"
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
                  <span>Calculate Extrusion</span>
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
                Extrusion Analysis Results
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <ResultCard
                title="Extrusion Ratio"
                value={formState.results.extrusionRatio}
                description="Area reduction ratio"
                trend="up"
              />
              <ResultCard
                title="Extrusion Force"
                value={formState.results.extrusionForce}
                unit={state.unitSystem.force}
                description="Force required for extrusion"
                trend="up"
              />
              <ResultCard
                title="Extrusion Pressure"
                value={formState.results.extrusionPressure}
                unit={state.unitSystem.pressure}
                description="Pressure on billet"
                trend="up"
              />
              <ResultCard
                title="Extrusion Power"
                value={formState.results.extrusionPower}
                unit={state.unitSystem.power}
                description="Power consumption"
                trend="up"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <ResultCard
                title="Extrusion Time"
                value={formState.results.extrusionTime}
                unit="min"
                description="Time to complete extrusion"
                trend="neutral"
              />
              <ResultCard
                title="Material Flow"
                value={formState.results.materialFlow}
                unit="mm/min"
                description="Material flow rate"
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
          <RecommendationCard
            recommendations={formState.results.recommendations}
            type="info"
          />
        </>
      )}
    </>
  );
}
