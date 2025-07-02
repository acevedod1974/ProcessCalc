import React, { useState, startTransition } from "react";
import { InputField } from "../UI/InputField";
import { ResultCard } from "../UI/ResultCard";
import { Calculator, CheckCircle } from "lucide-react";
import {
  calculateRolling,
  RollingParameters,
  RollingResults,
} from "../../utils/calculations";

import { AppState } from "../../contexts/AppContext";

interface RollingModuleProps {
  state: AppState;
  isDark: boolean;
  formingMaterialOptions: { value: string; label: string }[];
}

export function RollingModule({
  state,
  isDark,
  formingMaterialOptions,
}: RollingModuleProps) {
  const [fields, setFields] = useState<Partial<RollingParameters>>({
    material: "",
    initialThickness: "",
    finalThickness: "",
    width: "",
    rollDiameter: "",
    rollingSpeed: "",
    frictionCoefficient: "0.3",
    temperature: "20",
  });
  const [formState, setFormState] = useState<{
    errors: Record<string, string>;
    results: RollingResults | null;
    isCalculating: boolean;
  }>({
    errors: {},
    results: null,
    isCalculating: false,
  });

  function validateInputs(
    params: Partial<RollingParameters>
  ): Record<string, string> {
    const newErrors: Record<string, string> = {};
    if (!params.material) newErrors.material = "Material is required";
    if (!params.initialThickness || Number(params.initialThickness) <= 0)
      newErrors.initialThickness = "Initial thickness must be greater than 0";
    if (!params.finalThickness || Number(params.finalThickness) <= 0)
      newErrors.finalThickness = "Final thickness must be greater than 0";
    if (
      params.initialThickness &&
      params.finalThickness &&
      Number(params.finalThickness) >= Number(params.initialThickness)
    )
      newErrors.finalThickness =
        "Final thickness must be less than initial thickness";
    if (!params.width || Number(params.width) <= 0)
      newErrors.width = "Width must be greater than 0";
    if (!params.rollDiameter || Number(params.rollDiameter) <= 0)
      newErrors.rollDiameter = "Roll diameter must be greater than 0";
    if (!params.rollingSpeed || Number(params.rollingSpeed) <= 0)
      newErrors.rollingSpeed = "Rolling speed must be greater than 0";
    return newErrors;
  }

  function handleSubmit() {
    setFormState((prev) => ({ ...prev, isCalculating: true }));
    const errors = validateInputs(fields);
    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({ ...prev, errors, isCalculating: false }));
      return;
    }
    setTimeout(() => {
      try {
        const params: RollingParameters = {
          material: fields.material!,
          initialThickness: Number(fields.initialThickness),
          finalThickness: Number(fields.finalThickness),
          width: Number(fields.width),
          rollDiameter: Number(fields.rollDiameter),
          rollingSpeed: Number(fields.rollingSpeed),
          frictionCoefficient: Number(fields.frictionCoefficient || 0.3),
          temperature: Number(fields.temperature || 20),
        };
        const results = calculateRolling(params);
        setFormState({
          errors: {},
          results,
          isCalculating: false,
        });
      } catch (error) {
        const errMsg =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        setFormState((prev) => ({
          ...prev,
          errors: { global: errMsg },
          isCalculating: false,
        }));
      }
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
            Material & Geometry
          </h3>
          <div className="space-y-4">
            <InputField
              label="Material"
              value={fields.material || ""}
              onChange={(value) =>
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
                label="Initial Thickness"
                value={fields.initialThickness || ""}
                onChange={(value) =>
                  setFields((f) => ({ ...f, initialThickness: value }))
                }
                type="number"
                placeholder="10.0"
                unit={state.unitSystem.length}
                required
                step="0.1"
                min="0"
                error={formState.errors.initialThickness}
              />
              <InputField
                label="Final Thickness"
                value={fields.finalThickness || ""}
                onChange={(value) =>
                  setFields((f) => ({ ...f, finalThickness: value }))
                }
                type="number"
                placeholder="8.0"
                unit={state.unitSystem.length}
                required
                step="0.1"
                min="0"
                error={formState.errors.finalThickness}
              />
            </div>
            <InputField
              label="Width"
              value={fields.width || ""}
              onChange={(value) => setFields((f) => ({ ...f, width: value }))}
              type="number"
              placeholder="100.0"
              unit={state.unitSystem.length}
              required
              step="1"
              min="0"
              error={formState.errors.width}
            />
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
              label="Roll Diameter"
              value={fields.rollDiameter || ""}
              onChange={(value) =>
                setFields((f) => ({ ...f, rollDiameter: value }))
              }
              type="number"
              placeholder="300.0"
              unit={state.unitSystem.length}
              required
              step="1"
              min="0"
              error={formState.errors.rollDiameter}
            />
            <InputField
              label="Rolling Speed"
              value={fields.rollingSpeed || ""}
              onChange={(value) =>
                setFields((f) => ({ ...f, rollingSpeed: value }))
              }
              type="number"
              placeholder="50.0"
              unit="m/min"
              required
              step="1"
              min="0"
              error={formState.errors.rollingSpeed}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Friction Coefficient"
                value={fields.frictionCoefficient || ""}
                onChange={(value) =>
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
                onChange={(value) =>
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
                  <span>Calculate Rolling</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Rolling Results */}
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
              Rolling Analysis Results
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ResultCard
              title="Reduction Ratio"
              value={formState.results.reductionRatio}
              unit="%"
              description="Percentage reduction in thickness"
              trend="up"
            />
            <ResultCard
              title="Rolling Force"
              value={formState.results.rollingForce}
              unit={state.unitSystem.force}
              description="Force required for rolling"
              trend="up"
            />
            <ResultCard
              title="Rolling Power"
              value={formState.results.rollingPower}
              unit={state.unitSystem.power}
              description="Power consumption"
              trend="up"
            />
            <ResultCard
              title="Contact Length"
              value={formState.results.contactLength}
              unit={state.unitSystem.length}
              description="Roll-workpiece contact length"
              trend="neutral"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ResultCard
              title="True Strain"
              value={formState.results.trueStrain}
              description="Logarithmic strain"
              trend="neutral"
            />
            <ResultCard
              title="Average Flow Stress"
              value={formState.results.averageFlowStress}
              unit={state.unitSystem.pressure}
              description="Material flow stress"
              trend="up"
            />
            <ResultCard
              title="Exit Velocity"
              value={formState.results.exitVelocity}
              unit="m/min"
              description="Material exit velocity"
              trend="up"
            />
            <ResultCard
              title="Forward Slip"
              value={formState.results.forwardSlip}
              unit="%"
              description="Forward slip percentage"
              trend="neutral"
            />
          </div>
        </div>
      )}
      {formState.results &&
        formState.results.recommendations &&
        formState.results.recommendations.length > 0 && (
          <div className="mt-4">
            <RecommendationCard
              recommendations={formState.results.recommendations}
              type="info"
            />
          </div>
        )}
    </>
  );
}
