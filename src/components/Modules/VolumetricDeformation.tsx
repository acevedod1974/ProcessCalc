import React, { useState, useActionState, useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import { InputField } from "../UI/InputField";
import { ResultCard } from "../UI/ResultCard";
import { RecommendationCard } from "../UI/RecommendationCard";
import {
  Hammer,
  Calculator,
  Settings,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  calculateRolling,
  RollingParameters,
  RollingResults,
} from "../../utils/calculations";

const formingMaterialOptions = [
  { value: "steel", label: "Steel" },
  { value: "aluminum", label: "Aluminum" },
  { value: "copper", label: "Copper" },
  { value: "brass", label: "Brass" },
  // Puedes agregar más materiales según necesidad
];

type DeformationProcess = "rolling" | "forging" | "drawing" | "extrusion";

export function VolumetricDeformation() {
  const { state } = useApp();
  const isDark = state.theme.mode === "dark";

  // State management
  const [activeProcess, setActiveProcess] =
    useState<DeformationProcess>("rolling");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Rolling form state and action (React 19)
  type RollingFormState = {
    params: Partial<RollingParameters>;
    isCalculating: boolean;
    errors: Record<string, string>;
    results: RollingResults | null;
  };

  const initialRollingState: RollingFormState = {
    params: {
      material: "",
      initialThickness: "",
      finalThickness: "",
      width: "",
      rollDiameter: "",
      rollingSpeed: "",
      frictionCoefficient: "0.3",
      temperature: "20",
    },
    isCalculating: false,
    errors: {},
    results: null,
  };

  function validateRollingInputs(
    params: Partial<RollingParameters>
  ): Record<string, string> {
    const newErrors: Record<string, string> = {};
    if (!params.material) newErrors.material = "Material is required";
    if (!params.initialThickness || Number(params.initialThickness) <= 0)
      newErrors.initialThickness = "Initial thickness must be greater than 0";
    if (!params.finalThickness || Number(params.finalThickness) <= 0)
      newErrors.finalThickness = "Final thickness must be greater than 0";
    if (Number(params.finalThickness) >= Number(params.initialThickness))
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

  async function rollingAction(
    prevState: RollingFormState,
    formData: Partial<RollingParameters>
  ): Promise<RollingFormState> {
    const errors = validateRollingInputs(formData);
    if (Object.keys(errors).length > 0) {
      return { ...prevState, errors };
    }
    try {
      const params: RollingParameters = {
        material: formData.material!,
        initialThickness: Number(formData.initialThickness),
        finalThickness: Number(formData.finalThickness),
        width: Number(formData.width),
        rollDiameter: Number(formData.rollDiameter),
        rollingSpeed: Number(formData.rollingSpeed),
        frictionCoefficient: Number(formData.frictionCoefficient || 0.3),
        temperature: Number(formData.temperature || 20),
      };
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const results = calculateRolling(params);
      return { ...prevState, results, errors: {}, isCalculating: false };
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      return { ...prevState, errors: { global: errMsg }, isCalculating: false };
    }
  }

  const [rollingState, rollingDispatch, rollingSubmit] = useActionState(
    rollingAction,
    initialRollingState
  );

  // Clear results when process changes
  useEffect(() => {
    setErrors({});
  }, [activeProcess]);

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
                  value={rollingState.params.material || ""}
                  onChange={(value) =>
                    rollingDispatch({
                      ...rollingState,
                      params: { ...rollingState.params, material: value },
                    })
                  }
                  type="select"
                  options={formingMaterialOptions}
                  placeholder="Select Material..."
                  required
                  error={rollingState.errors.material}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Initial Thickness"
                    value={rollingState.params.initialThickness || ""}
                    onChange={(value) =>
                      rollingDispatch({
                        ...rollingState,
                        params: {
                          ...rollingState.params,
                          initialThickness: value,
                        },
                      })
                    }
                    type="number"
                    placeholder="10.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={rollingState.errors.initialThickness}
                  />
                  <InputField
                    label="Final Thickness"
                    value={rollingState.params.finalThickness || ""}
                    onChange={(value) =>
                      rollingDispatch({
                        ...rollingState,
                        params: {
                          ...rollingState.params,
                          finalThickness: value,
                        },
                      })
                    }
                    type="number"
                    placeholder="8.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={rollingState.errors.finalThickness}
                  />
                </div>
                <InputField
                  label="Width"
                  value={rollingState.params.width || ""}
                  onChange={(value) =>
                    rollingDispatch({
                      ...rollingState,
                      params: { ...rollingState.params, width: value },
                    })
                  }
                  type="number"
                  placeholder="100.0"
                  unit={state.unitSystem.length}
                  required
                  step="1"
                  min="0"
                  error={rollingState.errors.width}
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
                  value={rollingState.params.rollDiameter || ""}
                  onChange={(value) =>
                    rollingDispatch({
                      ...rollingState,
                      params: { ...rollingState.params, rollDiameter: value },
                    })
                  }
                  type="number"
                  placeholder="300.0"
                  unit={state.unitSystem.length}
                  required
                  step="1"
                  min="0"
                  error={rollingState.errors.rollDiameter}
                />
                <InputField
                  label="Rolling Speed"
                  value={rollingState.params.rollingSpeed || ""}
                  onChange={(value) =>
                    rollingDispatch({
                      ...rollingState,
                      params: { ...rollingState.params, rollingSpeed: value },
                    })
                  }
                  type="number"
                  placeholder="50.0"
                  unit="m/min"
                  required
                  step="1"
                  min="0"
                  error={rollingState.errors.rollingSpeed}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Friction Coefficient"
                    value={rollingState.params.frictionCoefficient || ""}
                    onChange={(value) =>
                      rollingDispatch({
                        ...rollingState,
                        params: {
                          ...rollingState.params,
                          frictionCoefficient: value,
                        },
                      })
                    }
                    type="number"
                    placeholder="0.3"
                    step="0.01"
                    min="0"
                    max="1"
                  />
                  <InputField
                    label="Temperature"
                    value={rollingState.params.temperature || ""}
                    onChange={(value) =>
                      rollingDispatch({
                        ...rollingState,
                        params: { ...rollingState.params, temperature: value },
                      })
                    }
                    type="number"
                    placeholder="20"
                    unit={state.unitSystem.temperature}
                    step="1"
                  />
                </div>
                <button
                  onClick={() => rollingSubmit(rollingState.params)}
                  disabled={rollingState.isCalculating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {rollingState.isCalculating ? (
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
          {rollingState.results && (
            <>
              <div
                className={`${
                  isDark ? "bg-slate-800" : "bg-white"
                } rounded-xl shadow-lg p-6`}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <CheckCircle
                    className={`${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
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
                    value={rollingState.results.reductionRatio}
                    unit="%"
                    description="Percentage reduction in thickness"
                    trend="up"
                  />
                  <ResultCard
                    title="Rolling Force"
                    value={rollingState.results.rollingForce}
                    unit={state.unitSystem.force}
                    description="Force required for rolling"
                    trend="up"
                  />
                  <ResultCard
                    title="Rolling Power"
                    value={rollingState.results.rollingPower}
                    unit={state.unitSystem.power}
                    description="Power consumption"
                    trend="up"
                  />
                  <ResultCard
                    title="Contact Length"
                    value={rollingState.results.contactLength}
                    unit={state.unitSystem.length}
                    description="Roll-workpiece contact length"
                    trend="neutral"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="True Strain"
                    value={rollingState.results.trueStrain}
                    description="Logarithmic strain"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Average Flow Stress"
                    value={rollingState.results.averageFlowStress}
                    unit={state.unitSystem.pressure}
                    description="Material flow stress"
                    trend="up"
                  />
                  <ResultCard
                    title="Exit Velocity"
                    value={rollingState.results.exitVelocity}
                    unit="m/min"
                    description="Material exit velocity"
                    trend="up"
                  />
                  <ResultCard
                    title="Forward Slip"
                    value={rollingState.results.forwardSlip}
                    unit="%"
                    description="Forward slip percentage"
                    trend="neutral"
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Forging Process */}
      {activeProcess === "forging" && (
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
                  value={forgingParams.material || ""}
                  onChange={(value) =>
                    setForgingParams((prev) => ({ ...prev, material: value }))
                  }
                  type="select"
                  options={formingMaterialOptions}
                  placeholder="Select Material..."
                  required
                  error={errors.material}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Initial Height"
                    value={forgingParams.initialHeight || ""}
                    onChange={(value) =>
                      setForgingParams((prev) => ({
                        ...prev,
                        initialHeight: value,
                      }))
                    }
                    type="number"
                    placeholder="50.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.initialHeight}
                  />
                  <InputField
                    label="Final Height"
                    value={forgingParams.finalHeight || ""}
                    onChange={(value) =>
                      setForgingParams((prev) => ({
                        ...prev,
                        finalHeight: value,
                      }))
                    }
                    type="number"
                    placeholder="30.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.finalHeight}
                  />
                </div>

                <InputField
                  label="Diameter"
                  value={forgingParams.diameter || ""}
                  onChange={(value) =>
                    setForgingParams((prev) => ({ ...prev, diameter: value }))
                  }
                  type="number"
                  placeholder="100.0"
                  unit={state.unitSystem.length}
                  required
                  step="1"
                  min="0"
                  error={errors.diameter}
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
                  label="Die Type"
                  value={forgingParams.dieType || ""}
                  onChange={(value) =>
                    setForgingParams((prev) => ({ ...prev, dieType: value }))
                  }
                  type="select"
                  options={[
                    { value: "flat", label: "Flat Die" },
                    { value: "grooved", label: "Grooved Die" },
                  ]}
                  placeholder="Select Die Type..."
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Friction Coefficient"
                    value={forgingParams.frictionCoefficient || ""}
                    onChange={(value) =>
                      setForgingParams((prev) => ({
                        ...prev,
                        frictionCoefficient: value,
                      }))
                    }
                    type="number"
                    placeholder="0.3"
                    step="0.01"
                    min="0"
                    max="1"
                  />
                  <InputField
                    label="Temperature"
                    value={forgingParams.temperature || ""}
                    onChange={(value) =>
                      setForgingParams((prev) => ({
                        ...prev,
                        temperature: value,
                      }))
                    }
                    type="number"
                    placeholder="20"
                    unit={state.unitSystem.temperature}
                    step="1"
                  />
                </div>

                <button
                  onClick={handleForgingCalculation}
                  disabled={isCalculating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isCalculating ? (
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

          {/* Forging Results */}
          {forgingResults && (
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
                  value={forgingResults.reductionRatio}
                  unit="%"
                  description="Height reduction percentage"
                  trend="up"
                />
                <ResultCard
                  title="Forging Force"
                  value={forgingResults.forgingForce}
                  unit={state.unitSystem.force}
                  description="Force required for forging"
                  trend="up"
                />
                <ResultCard
                  title="Work Done"
                  value={forgingResults.workDone}
                  unit="kJ"
                  description="Energy consumed"
                  trend="neutral"
                />
                <ResultCard
                  title="Efficiency"
                  value={forgingResults.efficiency}
                  unit="%"
                  description="Process efficiency"
                  trend="up"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Drawing Process */}
      {activeProcess === "drawing" && (
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
                  value={drawingParams.material || ""}
                  onChange={(value) =>
                    setDrawingParams((prev) => ({ ...prev, material: value }))
                  }
                  type="select"
                  options={drawingMaterialOptions}
                  placeholder="Select Material..."
                  required
                  error={errors.material}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Initial Diameter"
                    value={drawingParams.initialDiameter || ""}
                    onChange={(value) =>
                      setDrawingParams((prev) => ({
                        ...prev,
                        initialDiameter: value,
                      }))
                    }
                    type="number"
                    placeholder="5.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.initialDiameter}
                  />
                  <InputField
                    label="Final Diameter"
                    value={drawingParams.finalDiameter || ""}
                    onChange={(value) =>
                      setDrawingParams((prev) => ({
                        ...prev,
                        finalDiameter: value,
                      }))
                    }
                    type="number"
                    placeholder="4.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.finalDiameter}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Drawing Speed"
                    value={drawingParams.drawingSpeed || ""}
                    onChange={(value) =>
                      setDrawingParams((prev) => ({
                        ...prev,
                        drawingSpeed: value,
                      }))
                    }
                    type="number"
                    placeholder="10.0"
                    unit="m/min"
                    required
                    step="0.1"
                    min="0"
                    error={errors.drawingSpeed}
                  />
                  <InputField
                    label="Number of Passes"
                    value={drawingParams.numberOfPasses || ""}
                    onChange={(value) =>
                      setDrawingParams((prev) => ({
                        ...prev,
                        numberOfPasses: value,
                      }))
                    }
                    type="number"
                    placeholder="1"
                    required
                    step="1"
                    min="1"
                    error={errors.numberOfPasses}
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
                    value={drawingParams.dieAngle || ""}
                    onChange={(value) =>
                      setDrawingParams((prev) => ({ ...prev, dieAngle: value }))
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
                    value={drawingParams.temperature || ""}
                    onChange={(value) =>
                      setDrawingParams((prev) => ({
                        ...prev,
                        temperature: value,
                      }))
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
                    checked={drawingParams.lubrication || false}
                    onChange={(e) =>
                      setDrawingParams((prev) => ({
                        ...prev,
                        lubrication: e.target.checked,
                      }))
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
                  onClick={handleDrawingCalculation}
                  disabled={isCalculating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isCalculating ? (
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

          {/* Drawing Results */}
          {drawingResults && (
            <>
              <div
                className={`${
                  isDark ? "bg-slate-800" : "bg-white"
                } rounded-xl shadow-lg p-6`}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <CheckCircle
                    className={`${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
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
                    value={drawingResults.reductionRatio}
                    unit="%"
                    description="Area reduction percentage"
                    trend="up"
                  />
                  <ResultCard
                    title="Drawing Force"
                    value={drawingResults.drawingForce}
                    unit={state.unitSystem.force}
                    description="Force required for drawing"
                    trend="up"
                  />
                  <ResultCard
                    title="Drawing Power"
                    value={drawingResults.drawingPower}
                    unit={state.unitSystem.power}
                    description="Power consumption"
                    trend="up"
                  />
                  <ResultCard
                    title="Efficiency"
                    value={drawingResults.efficiency}
                    unit="%"
                    description="Process efficiency"
                    trend="up"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Reduction per Pass"
                    value={drawingResults.reductionPerPass}
                    unit="%"
                    description="Reduction per drawing pass"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Drawing Stress"
                    value={drawingResults.drawingStress}
                    unit={state.unitSystem.pressure}
                    description="Stress in drawn wire"
                    trend="up"
                  />
                  <ResultCard
                    title="Die Stress"
                    value={drawingResults.dieStress}
                    unit={state.unitSystem.pressure}
                    description="Stress on drawing die"
                    trend="up"
                  />
                  <ResultCard
                    title="Work Done"
                    value={drawingResults.workDone}
                    unit="kJ"
                    description="Energy consumed"
                    trend="neutral"
                  />
                </div>
              </div>

              <RecommendationCard
                recommendations={drawingResults.recommendations}
                type="info"
              />
            </>
          )}
        </>
      )}

      {/* Extrusion Process */}
      {activeProcess === "extrusion" && (
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
                  value={extrusionParams.material || ""}
                  onChange={(value) =>
                    setExtrusionParams((prev) => ({ ...prev, material: value }))
                  }
                  type="select"
                  options={drawingMaterialOptions}
                  placeholder="Select Material..."
                  required
                  error={errors.material}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Billet Diameter"
                    value={extrusionParams.billetDiameter || ""}
                    onChange={(value) =>
                      setExtrusionParams((prev) => ({
                        ...prev,
                        billetDiameter: value,
                      }))
                    }
                    type="number"
                    placeholder="100.0"
                    unit={state.unitSystem.length}
                    required
                    step="1"
                    min="0"
                    error={errors.billetDiameter}
                  />
                  <InputField
                    label="Extruded Diameter"
                    value={extrusionParams.extrudedDiameter || ""}
                    onChange={(value) =>
                      setExtrusionParams((prev) => ({
                        ...prev,
                        extrudedDiameter: value,
                      }))
                    }
                    type="number"
                    placeholder="20.0"
                    unit={state.unitSystem.length}
                    required
                    step="1"
                    min="0"
                    error={errors.extrudedDiameter}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Billet Length"
                    value={extrusionParams.billetLength || ""}
                    onChange={(value) =>
                      setExtrusionParams((prev) => ({
                        ...prev,
                        billetLength: value,
                      }))
                    }
                    type="number"
                    placeholder="200.0"
                    unit={state.unitSystem.length}
                    required
                    step="1"
                    min="0"
                    error={errors.billetLength}
                  />
                  <InputField
                    label="Extrusion Speed"
                    value={extrusionParams.extrusionSpeed || ""}
                    onChange={(value) =>
                      setExtrusionParams((prev) => ({
                        ...prev,
                        extrusionSpeed: value,
                      }))
                    }
                    type="number"
                    placeholder="5.0"
                    unit="mm/min"
                    required
                    step="0.1"
                    min="0"
                    error={errors.extrusionSpeed}
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
                  value={extrusionParams.extrusionType || ""}
                  onChange={(value) =>
                    setExtrusionParams((prev) => ({
                      ...prev,
                      extrusionType: value,
                    }))
                  }
                  type="select"
                  options={[
                    { value: "direct", label: "Direct Extrusion" },
                    { value: "indirect", label: "Indirect Extrusion" },
                  ]}
                  placeholder="Select Extrusion Type..."
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Die Angle"
                    value={extrusionParams.dieAngle || ""}
                    onChange={(value) =>
                      setExtrusionParams((prev) => ({
                        ...prev,
                        dieAngle: value,
                      }))
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
                    value={extrusionParams.temperature || ""}
                    onChange={(value) =>
                      setExtrusionParams((prev) => ({
                        ...prev,
                        temperature: value,
                      }))
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
                    checked={extrusionParams.lubrication || false}
                    onChange={(e) =>
                      setExtrusionParams((prev) => ({
                        ...prev,
                        lubrication: e.target.checked,
                      }))
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
                  onClick={handleExtrusionCalculation}
                  disabled={isCalculating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isCalculating ? (
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

          {/* Extrusion Results */}
          {extrusionResults && (
            <>
              <div
                className={`${
                  isDark ? "bg-slate-800" : "bg-white"
                } rounded-xl shadow-lg p-6`}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <CheckCircle
                    className={`${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
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
                    value={extrusionResults.extrusionRatio}
                    description="Area reduction ratio"
                    trend="up"
                  />
                  <ResultCard
                    title="Extrusion Force"
                    value={extrusionResults.extrusionForce}
                    unit={state.unitSystem.force}
                    description="Force required for extrusion"
                    trend="up"
                  />
                  <ResultCard
                    title="Extrusion Pressure"
                    value={extrusionResults.extrusionPressure}
                    unit={state.unitSystem.pressure}
                    description="Pressure on billet"
                    trend="up"
                  />
                  <ResultCard
                    title="Extrusion Power"
                    value={extrusionResults.extrusionPower}
                    unit={state.unitSystem.power}
                    description="Power consumption"
                    trend="up"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Extrusion Time"
                    value={extrusionResults.extrusionTime}
                    unit="min"
                    description="Time to complete extrusion"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Material Flow"
                    value={extrusionResults.materialFlow}
                    unit="mm/min"
                    description="Material flow rate"
                    trend="up"
                  />
                  <ResultCard
                    title="Work Done"
                    value={extrusionResults.workDone}
                    unit="kJ"
                    description="Energy consumed"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Efficiency"
                    value={extrusionResults.efficiency}
                    unit="%"
                    description="Process efficiency"
                    trend="up"
                  />
                </div>
              </div>

              <RecommendationCard
                recommendations={extrusionResults.recommendations}
                type="info"
              />
            </>
          )}
        </>
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
