import React, { useState, useActionState, startTransition } from "react";
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
import {
  calculateWireDrawing,
  WireDrawingParameters,
  WireDrawingResults,
  calculateExtrusion,
  ExtrusionParameters,
  ExtrusionResults,
} from "../../utils/drawingExtrusionCalculations";

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

  // Rolling calculation action state
  type RollingFormState = {
    params: Partial<RollingParameters>;
    errors: Record<string, string>;
    results: RollingResults | null;
    isCalculating: boolean;
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
    errors: {},
    results: null,
    isCalculating: false,
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
  const [rollingState, rollingSubmit] = useActionState(
    async (prevState, formData) => {
      // Set isCalculating to true immediately
      if (!prevState.isCalculating) {
        console.log("[Rolling] Set isCalculating to true", {
          prevState,
          formData,
        });
        return { ...prevState, isCalculating: true };
      }
      // Only run calculation if already calculating
      console.log("[Rolling] Running calculation", { prevState, formData });
      const errors = validateRollingInputs(formData);
      if (Object.keys(errors).length > 0) {
        console.log("[Rolling] Validation errors", errors);
        return { ...prevState, errors, isCalculating: false };
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
        console.log("[Rolling] Params for calculation", params);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const results = calculateRolling(params);
        console.log("[Rolling] Calculation results", results);
        return { ...prevState, results, errors: {}, isCalculating: false };
      } catch (error) {
        const errMsg =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        console.error("[Rolling] Calculation error", error);
        return {
          ...prevState,
          errors: { global: errMsg },
          isCalculating: false,
        };
      }
    },
    initialRollingState
  );

  // --- FORGING STATE/ACTION ---

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

  const initialForgingState: ForgingFormState = {
    params: {
      material: "",
      initialHeight: "",
      finalHeight: "",
      diameter: "",
      dieType: "",
      frictionCoefficient: "0.3",
      temperature: "20",
    },
    isCalculating: false,
    errors: {},
    results: null,
  };

  function validateForgingInputs(
    params: Partial<ForgingParameters>
  ): Record<string, string> {
    const newErrors: Record<string, string> = {};
    if (!params.material) newErrors.material = "Material is required";
    if (!params.initialHeight || Number(params.initialHeight) <= 0)
      newErrors.initialHeight = "Initial height must be greater than 0";
    if (!params.finalHeight || Number(params.finalHeight) <= 0)
      newErrors.finalHeight = "Final height must be greater than 0";
    if (Number(params.finalHeight) >= Number(params.initialHeight))
      newErrors.finalHeight = "Final height must be less than initial height";
    if (!params.diameter || Number(params.diameter) <= 0)
      newErrors.diameter = "Diameter must be greater than 0";
    if (!params.dieType) newErrors.dieType = "Die type is required";
    return newErrors;
  }

  async function forgingAction(
    prevState: ForgingFormState,
    formData: Partial<ForgingParameters>
  ): Promise<ForgingFormState> {
    const errors = validateForgingInputs(formData);
    if (Object.keys(errors).length > 0) {
      return { ...prevState, errors };
    }
    try {
      const params = {
        material: formData.material!,
        initialHeight: Number(formData.initialHeight),
        finalHeight: Number(formData.finalHeight),
        diameter: Number(formData.diameter),
        dieType: formData.dieType!,
        frictionCoefficient: Number(formData.frictionCoefficient || 0.3),
        temperature: Number(formData.temperature || 20),
      };
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Dummy calculation for now
      const reductionRatio =
        ((params.initialHeight - params.finalHeight) / params.initialHeight) *
        100;
      const forgingForce = params.diameter * 1000; // Dummy
      const workDone =
        forgingForce * (params.initialHeight - params.finalHeight); // Dummy
      const efficiency = 90; // Dummy
      const results: ForgingResults = {
        reductionRatio,
        forgingForce,
        workDone,
        efficiency,
      };
      return { ...prevState, results, errors: {}, isCalculating: false };
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      return { ...prevState, errors: { global: errMsg }, isCalculating: false };
    }
  }

  const [forgingState, forgingDispatch, forgingSubmit] = useActionState(
    forgingAction,
    initialForgingState
  );

  // --- DRAWING STATE/ACTION ---
  type DrawingFormState = {
    params: Partial<WireDrawingParameters>;
    errors: Record<string, string>;
    results: WireDrawingResults | null;
    isCalculating: boolean;
  };
  const initialDrawingState: DrawingFormState = {
    params: {
      material: "",
      initialDiameter: "",
      finalDiameter: "",
      drawingSpeed: "",
      numberOfPasses: "1",
      dieAngle: "8",
      temperature: "20",
      lubrication: false,
    },
    errors: {},
    results: null,
    isCalculating: false,
  };
  function validateDrawingInputs(
    params: Partial<WireDrawingParameters>
  ): Record<string, string> {
    const newErrors: Record<string, string> = {};
    if (!params.material) newErrors.material = "Material is required";
    if (!params.initialDiameter || Number(params.initialDiameter) <= 0)
      newErrors.initialDiameter = "Initial diameter must be greater than 0";
    if (!params.finalDiameter || Number(params.finalDiameter) <= 0)
      newErrors.finalDiameter = "Final diameter must be greater than 0";
    if (Number(params.finalDiameter) >= Number(params.initialDiameter))
      newErrors.finalDiameter =
        "Final diameter must be less than initial diameter";
    if (!params.drawingSpeed || Number(params.drawingSpeed) <= 0)
      newErrors.drawingSpeed = "Drawing speed must be greater than 0";
    if (!params.numberOfPasses || Number(params.numberOfPasses) < 1)
      newErrors.numberOfPasses = "Number of passes must be at least 1";
    return newErrors;
  }
  async function drawingAction(
    prevState: DrawingFormState,
    formData: Partial<WireDrawingParameters>
  ): Promise<DrawingFormState> {
    const errors = validateDrawingInputs(formData);
    if (Object.keys(errors).length > 0) {
      return { ...prevState, errors, isCalculating: false };
    }
    try {
      const params: WireDrawingParameters = {
        material: formData.material!,
        initialDiameter: Number(formData.initialDiameter),
        finalDiameter: Number(formData.finalDiameter),
        drawingSpeed: Number(formData.drawingSpeed),
        numberOfPasses: Number(formData.numberOfPasses),
        dieAngle: Number(formData.dieAngle || 8),
        temperature: Number(formData.temperature || 20),
        lubrication: Boolean(formData.lubrication),
      };
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const results = calculateWireDrawing(params);
      return { ...prevState, results, errors: {}, isCalculating: false };
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      return { ...prevState, errors: { global: errMsg }, isCalculating: false };
    }
  }
  const [drawingState, drawingSubmit] = useActionState(
    drawingAction,
    initialDrawingState
  );

  // --- EXTRUSION STATE/ACTION ---
  type ExtrusionFormState = {
    params: Partial<ExtrusionParameters>;
    errors: Record<string, string>;
    results: ExtrusionResults | null;
    isCalculating: boolean;
  };
  const initialExtrusionState: ExtrusionFormState = {
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
  };
  function validateExtrusionInputs(
    params: Partial<ExtrusionParameters>
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
    formData: Partial<ExtrusionParameters>
  ): Promise<ExtrusionFormState> {
    const errors = validateExtrusionInputs(formData);
    if (Object.keys(errors).length > 0) {
      return { ...prevState, errors, isCalculating: false };
    }
    try {
      const params: ExtrusionParameters = {
        material: formData.material!,
        billetDiameter: Number(formData.billetDiameter),
        extrudedDiameter: Number(formData.extrudedDiameter),
        billetLength: Number(formData.billetLength),
        extrusionSpeed: Number(formData.extrusionSpeed),
        extrusionType: formData.extrusionType as "direct" | "indirect",
        dieAngle: Number(formData.dieAngle || 45),
        temperature: Number(formData.temperature || 400),
        lubrication: Boolean(formData.lubrication),
      };
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const results = calculateExtrusion(params);
      return { ...prevState, results, errors: {}, isCalculating: false };
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      return { ...prevState, errors: { global: errMsg }, isCalculating: false };
    }
  }
  const [extrusionState, extrusionSubmit] = useActionState(
    extrusionAction,
    initialExtrusionState
  );

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

  // Rolling form local state
  const [rollingFields, setRollingFields] = useState(
    initialRollingState.params
  );

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
                  value={rollingFields.material || ""}
                  onChange={(value) =>
                    setRollingFields((f) => ({ ...f, material: value }))
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
                    value={rollingFields.initialThickness || ""}
                    onChange={(value) =>
                      setRollingFields((f) => ({
                        ...f,
                        initialThickness: value,
                      }))
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
                    value={rollingFields.finalThickness || ""}
                    onChange={(value) =>
                      setRollingFields((f) => ({ ...f, finalThickness: value }))
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
                  value={rollingFields.width || ""}
                  onChange={(value) =>
                    setRollingFields((f) => ({ ...f, width: value }))
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
                  value={rollingFields.rollDiameter || ""}
                  onChange={(value) =>
                    setRollingFields((f) => ({ ...f, rollDiameter: value }))
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
                  value={rollingFields.rollingSpeed || ""}
                  onChange={(value) =>
                    setRollingFields((f) => ({ ...f, rollingSpeed: value }))
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
                    value={rollingFields.frictionCoefficient || ""}
                    onChange={(value) =>
                      setRollingFields((f) => ({
                        ...f,
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
                    value={rollingFields.temperature || ""}
                    onChange={(value) =>
                      setRollingFields((f) => ({ ...f, temperature: value }))
                    }
                    type="number"
                    placeholder="20"
                    unit={state.unitSystem.temperature}
                    step="1"
                  />
                </div>
                <button
                  onClick={() =>
                    startTransition(() => {
                      rollingSubmit(rollingFields);
                    })
                  }
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
                  value={forgingState.params.material || ""}
                  onChange={(value) =>
                    forgingDispatch({
                      ...forgingState,
                      params: { ...forgingState.params, material: value },
                    })
                  }
                  type="select"
                  options={formingMaterialOptions}
                  placeholder="Select Material..."
                  required
                  error={forgingState.errors.material}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Initial Height"
                    value={forgingState.params.initialHeight || ""}
                    onChange={(value) =>
                      forgingDispatch({
                        ...forgingState,
                        params: {
                          ...forgingState.params,
                          initialHeight: value,
                        },
                      })
                    }
                    type="number"
                    placeholder="50.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={forgingState.errors.initialHeight}
                  />
                  <InputField
                    label="Final Height"
                    value={forgingState.params.finalHeight || ""}
                    onChange={(value) =>
                      forgingDispatch({
                        ...forgingState,
                        params: { ...forgingState.params, finalHeight: value },
                      })
                    }
                    type="number"
                    placeholder="30.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={forgingState.errors.finalHeight}
                  />
                </div>
                <InputField
                  label="Diameter"
                  value={forgingState.params.diameter || ""}
                  onChange={(value) =>
                    forgingDispatch({
                      ...forgingState,
                      params: { ...forgingState.params, diameter: value },
                    })
                  }
                  type="number"
                  placeholder="100.0"
                  unit={state.unitSystem.length}
                  required
                  step="1"
                  min="0"
                  error={forgingState.errors.diameter}
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
                  value={forgingState.params.dieType || ""}
                  onChange={(value) =>
                    forgingDispatch({
                      ...forgingState,
                      params: { ...forgingState.params, dieType: value },
                    })
                  }
                  type="select"
                  options={[
                    { value: "flat", label: "Flat Die" },
                    { value: "grooved", label: "Grooved Die" },
                  ]}
                  placeholder="Select Die Type..."
                  required
                  error={forgingState.errors.dieType}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Friction Coefficient"
                    value={forgingState.params.frictionCoefficient || ""}
                    onChange={(value) =>
                      forgingDispatch({
                        ...forgingState,
                        params: {
                          ...forgingState.params,
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
                    value={forgingState.params.temperature || ""}
                    onChange={(value) =>
                      forgingDispatch({
                        ...forgingState,
                        params: { ...forgingState.params, temperature: value },
                      })
                    }
                    type="number"
                    placeholder="20"
                    unit={state.unitSystem.temperature}
                    step="1"
                  />
                </div>
                <button
                  onClick={() => forgingSubmit(forgingState.params)}
                  disabled={forgingState.isCalculating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {forgingState.isCalculating ? (
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
          {forgingState.results && (
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
                  value={forgingState.results.reductionRatio}
                  unit="%"
                  description="Height reduction percentage"
                  trend="up"
                />
                <ResultCard
                  title="Forging Force"
                  value={forgingState.results.forgingForce}
                  unit={state.unitSystem.force}
                  description="Force required for forging"
                  trend="up"
                />
                <ResultCard
                  title="Work Done"
                  value={forgingState.results.workDone}
                  unit="kJ"
                  description="Energy consumed"
                  trend="neutral"
                />
                <ResultCard
                  title="Efficiency"
                  value={forgingState.results.efficiency}
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
                  value={drawingFields.material || ""}
                  onChange={(value) =>
                    setDrawingFields((f) => ({ ...f, material: value }))
                  }
                  type="select"
                  options={formingMaterialOptions}
                  placeholder="Select Material..."
                  required
                  error={drawingState.errors.material}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Initial Diameter"
                    value={drawingFields.initialDiameter || ""}
                    onChange={(value) =>
                      setDrawingFields((f) => ({
                        ...f,
                        initialDiameter: value,
                      }))
                    }
                    type="number"
                    placeholder="5.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={drawingState.errors.initialDiameter}
                  />
                  <InputField
                    label="Final Diameter"
                    value={drawingFields.finalDiameter || ""}
                    onChange={(value) =>
                      setDrawingFields((f) => ({ ...f, finalDiameter: value }))
                    }
                    type="number"
                    placeholder="4.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={drawingState.errors.finalDiameter}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Drawing Speed"
                    value={drawingFields.drawingSpeed || ""}
                    onChange={(value) =>
                      setDrawingFields((f) => ({ ...f, drawingSpeed: value }))
                    }
                    type="number"
                    placeholder="10.0"
                    unit="m/min"
                    required
                    step="0.1"
                    min="0"
                    error={drawingState.errors.drawingSpeed}
                  />
                  <InputField
                    label="Number of Passes"
                    value={drawingFields.numberOfPasses || ""}
                    onChange={(value) =>
                      setDrawingFields((f) => ({ ...f, numberOfPasses: value }))
                    }
                    type="number"
                    placeholder="1"
                    required
                    step="1"
                    min="1"
                    error={drawingState.errors.numberOfPasses}
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
                    value={drawingFields.dieAngle || ""}
                    onChange={(value) =>
                      setDrawingFields((f) => ({ ...f, dieAngle: value }))
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
                    value={drawingFields.temperature || ""}
                    onChange={(value) =>
                      setDrawingFields((f) => ({ ...f, temperature: value }))
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
                    checked={drawingFields.lubrication || false}
                    onChange={(e) =>
                      setDrawingFields((f) => ({
                        ...f,
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
                  onClick={() => drawingSubmit(drawingFields)}
                  disabled={drawingState.isCalculating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {drawingState.isCalculating ? (
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
          {drawingState.results && (
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
                    value={drawingState.results.reductionRatio}
                    unit="%"
                    description="Area reduction percentage"
                    trend="up"
                  />
                  <ResultCard
                    title="Drawing Force"
                    value={drawingState.results.drawingForce}
                    unit={state.unitSystem.force}
                    description="Force required for drawing"
                    trend="up"
                  />
                  <ResultCard
                    title="Drawing Power"
                    value={drawingState.results.drawingPower}
                    unit={state.unitSystem.power}
                    description="Power consumption"
                    trend="up"
                  />
                  <ResultCard
                    title="Efficiency"
                    value={drawingState.results.efficiency}
                    unit="%"
                    description="Process efficiency"
                    trend="up"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Reduction per Pass"
                    value={drawingState.results.reductionPerPass}
                    unit="%"
                    description="Reduction per drawing pass"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Drawing Stress"
                    value={drawingState.results.drawingStress}
                    unit={state.unitSystem.pressure}
                    description="Stress in drawn wire"
                    trend="up"
                  />
                  <ResultCard
                    title="Die Stress"
                    value={drawingState.results.dieStress}
                    unit={state.unitSystem.pressure}
                    description="Stress on drawing die"
                    trend="up"
                  />
                  <ResultCard
                    title="Work Done"
                    value={drawingState.results.workDone}
                    unit="kJ"
                    description="Energy consumed"
                    trend="neutral"
                  />
                </div>
              </div>

              <RecommendationCard
                recommendations={drawingState.results.recommendations}
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
                  value={extrusionFields.material || ""}
                  onChange={(value) =>
                    setExtrusionFields((f) => ({ ...f, material: value }))
                  }
                  type="select"
                  options={formingMaterialOptions}
                  placeholder="Select Material..."
                  required
                  error={extrusionState.errors.material}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Billet Diameter"
                    value={extrusionFields.billetDiameter || ""}
                    onChange={(value) =>
                      setExtrusionFields((f) => ({
                        ...f,
                        billetDiameter: value,
                      }))
                    }
                    type="number"
                    placeholder="100.0"
                    unit={state.unitSystem.length}
                    required
                    step="1"
                    min="0"
                    error={extrusionState.errors.billetDiameter}
                  />
                  <InputField
                    label="Extruded Diameter"
                    value={extrusionFields.extrudedDiameter || ""}
                    onChange={(value) =>
                      setExtrusionFields((f) => ({
                        ...f,
                        extrudedDiameter: value,
                      }))
                    }
                    type="number"
                    placeholder="20.0"
                    unit={state.unitSystem.length}
                    required
                    step="1"
                    min="0"
                    error={extrusionState.errors.extrudedDiameter}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Billet Length"
                    value={extrusionFields.billetLength || ""}
                    onChange={(value) =>
                      setExtrusionFields((f) => ({ ...f, billetLength: value }))
                    }
                    type="number"
                    placeholder="200.0"
                    unit={state.unitSystem.length}
                    required
                    step="1"
                    min="0"
                    error={extrusionState.errors.billetLength}
                  />
                  <InputField
                    label="Extrusion Speed"
                    value={extrusionFields.extrusionSpeed || ""}
                    onChange={(value) =>
                      setExtrusionFields((f) => ({
                        ...f,
                        extrusionSpeed: value,
                      }))
                    }
                    type="number"
                    placeholder="5.0"
                    unit="mm/min"
                    required
                    step="0.1"
                    min="0"
                    error={extrusionState.errors.extrusionSpeed}
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
                  value={extrusionFields.extrusionType || ""}
                  onChange={(value) =>
                    setExtrusionFields((f) => ({ ...f, extrusionType: value }))
                  }
                  type="select"
                  options={[
                    { value: "direct", label: "Direct Extrusion" },
                    { value: "indirect", label: "Indirect Extrusion" },
                  ]}
                  placeholder="Select Extrusion Type..."
                  required
                  error={extrusionState.errors.extrusionType}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Die Angle"
                    value={extrusionFields.dieAngle || ""}
                    onChange={(value) =>
                      setExtrusionFields((f) => ({ ...f, dieAngle: value }))
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
                    value={extrusionFields.temperature || ""}
                    onChange={(value) =>
                      setExtrusionFields((f) => ({ ...f, temperature: value }))
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
                    checked={extrusionFields.lubrication || false}
                    onChange={(e) =>
                      setExtrusionFields((f) => ({
                        ...f,
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
                  onClick={() => extrusionSubmit(extrusionFields)}
                  disabled={extrusionState.isCalculating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {extrusionState.isCalculating ? (
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
          {extrusionState.results && (
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
