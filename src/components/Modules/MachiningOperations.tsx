import React, { useState, useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import { InputField } from "../UI/InputField";
import { ResultCard } from "../UI/ResultCard";
import { RecommendationCard } from "../UI/RecommendationCard";
import {
  Calculator,
  Settings,
  Download,
  AlertCircle,
  CheckCircle,
  Cog,
} from "lucide-react";
import {
  MACHINING_MATERIALS,
  calculateTurning,
  calculateMilling,
  calculateDrilling,
  TurningParameters,
  MillingParameters,
  DrillingParameters,
  TurningResults,
  MillingResults,
  DrillingResults,
} from "../../utils/machiningCalculations";

type MachiningProcess = "turning" | "milling" | "drilling";

export function MachiningOperations() {
  const { state } = useApp();
  const isDark = state.theme.mode === "dark";

  // State management
  const [activeProcess, setActiveProcess] =
    useState<MachiningProcess>("turning");
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Turning parameters
  const [turningParams, setTurningParams] = useState<
    Partial<TurningParameters>
  >({
    material: "",
    diameter: "",
    length: "",
    cuttingSpeed: "",
    feedRate: "",
    depthOfCut: "",
    toolMaterial: "carbide",
    coolant: true,
  });

  // Milling parameters
  const [millingParams, setMillingParams] = useState<
    Partial<MillingParameters>
  >({
    material: "",
    width: "",
    length: "",
    depth: "",
    cutterDiameter: "",
    numberOfTeeth: "",
    spindleSpeed: "",
    feedRate: "",
    toolMaterial: "carbide",
  });

  // Drilling parameters
  const [drillingParams, setDrillingParams] = useState<
    Partial<DrillingParameters>
  >({
    material: "",
    holeDiameter: "",
    holeDepth: "",
    drillSpeed: "",
    feedRate: "",
    toolMaterial: "hss",
    coolant: true,
  });

  // Results
  const [turningResults, setTurningResults] = useState<TurningResults | null>(
    null
  );
  const [millingResults, setMillingResults] = useState<MillingResults | null>(
    null
  );
  const [drillingResults, setDrillingResults] =
    useState<DrillingResults | null>(null);

  // Material options
  const materialOptions = Object.entries(MACHINING_MATERIALS).map(
    ([key, material]) => ({
      value: key,
      label: material.name,
    })
  );

  const toolMaterialOptions = [
    { value: "hss", label: "High Speed Steel (HSS)" },
    { value: "carbide", label: "Carbide" },
    { value: "ceramic", label: "Ceramic" },
    { value: "diamond", label: "Diamond" },
  ];

  // Validation functions
  const validateTurningInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!turningParams.material) newErrors.material = "Material is required";
    if (!turningParams.diameter || Number(turningParams.diameter) <= 0) {
      newErrors.diameter = "Diameter must be greater than 0";
    }
    if (!turningParams.length || Number(turningParams.length) <= 0) {
      newErrors.length = "Length must be greater than 0";
    }
    if (
      !turningParams.cuttingSpeed ||
      Number(turningParams.cuttingSpeed) <= 0
    ) {
      newErrors.cuttingSpeed = "Cutting speed must be greater than 0";
    }
    if (!turningParams.feedRate || Number(turningParams.feedRate) <= 0) {
      newErrors.feedRate = "Feed rate must be greater than 0";
    }
    if (!turningParams.depthOfCut || Number(turningParams.depthOfCut) <= 0) {
      newErrors.depthOfCut = "Depth of cut must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMillingInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!millingParams.material) newErrors.material = "Material is required";
    if (!millingParams.width || Number(millingParams.width) <= 0) {
      newErrors.width = "Width must be greater than 0";
    }
    if (!millingParams.length || Number(millingParams.length) <= 0) {
      newErrors.length = "Length must be greater than 0";
    }
    if (!millingParams.depth || Number(millingParams.depth) <= 0) {
      newErrors.depth = "Depth must be greater than 0";
    }
    if (
      !millingParams.cutterDiameter ||
      Number(millingParams.cutterDiameter) <= 0
    ) {
      newErrors.cutterDiameter = "Cutter diameter must be greater than 0";
    }
    if (
      !millingParams.numberOfTeeth ||
      Number(millingParams.numberOfTeeth) <= 0
    ) {
      newErrors.numberOfTeeth = "Number of teeth must be greater than 0";
    }
    if (
      !millingParams.spindleSpeed ||
      Number(millingParams.spindleSpeed) <= 0
    ) {
      newErrors.spindleSpeed = "Spindle speed must be greater than 0";
    }
    if (!millingParams.feedRate || Number(millingParams.feedRate) <= 0) {
      newErrors.feedRate = "Feed rate must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDrillingInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!drillingParams.material) newErrors.material = "Material is required";
    if (
      !drillingParams.holeDiameter ||
      Number(drillingParams.holeDiameter) <= 0
    ) {
      newErrors.holeDiameter = "Hole diameter must be greater than 0";
    }
    if (!drillingParams.holeDepth || Number(drillingParams.holeDepth) <= 0) {
      newErrors.holeDepth = "Hole depth must be greater than 0";
    }
    if (!drillingParams.drillSpeed || Number(drillingParams.drillSpeed) <= 0) {
      newErrors.drillSpeed = "Drill speed must be greater than 0";
    }
    if (!drillingParams.feedRate || Number(drillingParams.feedRate) <= 0) {
      newErrors.feedRate = "Feed rate must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate functions
  const handleTurningCalculation = async () => {
    if (!validateTurningInputs()) return;

    setIsCalculating(true);
    try {
      const params: TurningParameters = {
        material: turningParams.material!,
        diameter: Number(turningParams.diameter),
        length: Number(turningParams.length),
        cuttingSpeed: Number(turningParams.cuttingSpeed),
        feedRate: Number(turningParams.feedRate),
        depthOfCut: Number(turningParams.depthOfCut),
        toolMaterial: turningParams.toolMaterial as
          | "hss"
          | "carbide"
          | "ceramic"
          | "diamond",
        coolant: turningParams.coolant || false,
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const results = calculateTurning(params);
      setTurningResults(results);
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      setErrors({ global: errMsg });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleMillingCalculation = async () => {
    if (!validateMillingInputs()) return;

    setIsCalculating(true);
    try {
      const params: MillingParameters = {
        material: millingParams.material!,
        width: Number(millingParams.width),
        length: Number(millingParams.length),
        depth: Number(millingParams.depth),
        cutterDiameter: Number(millingParams.cutterDiameter),
        numberOfTeeth: Number(millingParams.numberOfTeeth),
        spindleSpeed: Number(millingParams.spindleSpeed),
        feedRate: Number(millingParams.feedRate),
        toolMaterial: millingParams.toolMaterial as
          | "hss"
          | "carbide"
          | "ceramic"
          | "diamond",
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const results = calculateMilling(params);
      setMillingResults(results);
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      setErrors({ global: errMsg });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDrillingCalculation = async () => {
    if (!validateDrillingInputs()) return;

    setIsCalculating(true);
    try {
      const params: DrillingParameters = {
        material: drillingParams.material!,
        holeDiameter: Number(drillingParams.holeDiameter),
        holeDepth: Number(drillingParams.holeDepth),
        drillSpeed: Number(drillingParams.drillSpeed),
        feedRate: Number(drillingParams.feedRate),
        toolMaterial: drillingParams.toolMaterial as
          | "hss"
          | "carbide"
          | "ceramic"
          | "diamond",
        coolant: drillingParams.coolant || false,
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const results = calculateDrilling(params);
      setDrillingResults(results);
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      setErrors({ global: errMsg });
    } finally {
      setIsCalculating(false);
    }
  };

  // Clear results when process changes
  useEffect(() => {
    setTurningResults(null);
    setMillingResults(null);
    setDrillingResults(null);
    setErrors({});
  }, [activeProcess]);

  const processes = [
    {
      id: "turning",
      name: "Turning",
      description: "Lathe Operations",
      icon: "🔄",
    },
    {
      id: "milling",
      name: "Milling",
      description: "End & Face Milling",
      icon: "⚙️",
    },
    {
      id: "drilling",
      name: "Drilling",
      description: "Hole Making",
      icon: "🔩",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`p-3 rounded-lg ${
              isDark ? "bg-green-900" : "bg-green-100"
            }`}
          >
            <Cog
              className={`${isDark ? "text-green-300" : "text-green-600"}`}
              size={24}
            />
          </div>
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Machining Operations
            </h1>
            <p className={`${isDark ? "text-slate-400" : "text-gray-600"}`}>
              Turning, Milling, Drilling, and Tool Life Analysis
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
                ? "bg-green-900 hover:bg-green-800 text-green-300"
                : "bg-green-100 hover:bg-green-200 text-green-700"
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
          Machining Process Selection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {processes.map((process) => (
            <button
              key={process.id}
              onClick={() => setActiveProcess(process.id as MachiningProcess)}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                activeProcess === process.id
                  ? isDark
                    ? "border-green-500 bg-green-900 text-green-300"
                    : "border-green-500 bg-green-50 text-green-700"
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
                      ? "text-green-400"
                      : "text-green-600"
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

      {/* Turning Process */}
      {activeProcess === "turning" && (
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
                Workpiece & Material
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Material"
                  value={turningParams.material || ""}
                  onChange={(value) =>
                    setTurningParams((prev) => ({ ...prev, material: value }))
                  }
                  type="select"
                  options={materialOptions}
                  placeholder="Select Material..."
                  required
                  error={errors.material}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Diameter"
                    value={turningParams.diameter || ""}
                    onChange={(value) =>
                      setTurningParams((prev) => ({ ...prev, diameter: value }))
                    }
                    type="number"
                    placeholder="50.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.diameter}
                  />
                  <InputField
                    label="Length"
                    value={turningParams.length || ""}
                    onChange={(value) =>
                      setTurningParams((prev) => ({ ...prev, length: value }))
                    }
                    type="number"
                    placeholder="100.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.length}
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
                Cutting Parameters
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Cutting Speed"
                  value={turningParams.cuttingSpeed || ""}
                  onChange={(value) =>
                    setTurningParams((prev) => ({
                      ...prev,
                      cuttingSpeed: value,
                    }))
                  }
                  type="number"
                  placeholder="200"
                  unit="m/min"
                  required
                  step="1"
                  min="0"
                  error={errors.cuttingSpeed}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Feed Rate"
                    value={turningParams.feedRate || ""}
                    onChange={(value) =>
                      setTurningParams((prev) => ({ ...prev, feedRate: value }))
                    }
                    type="number"
                    placeholder="0.2"
                    unit="mm/rev"
                    required
                    step="0.01"
                    min="0"
                    error={errors.feedRate}
                  />
                  <InputField
                    label="Depth of Cut"
                    value={turningParams.depthOfCut || ""}
                    onChange={(value) =>
                      setTurningParams((prev) => ({
                        ...prev,
                        depthOfCut: value,
                      }))
                    }
                    type="number"
                    placeholder="2.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.depthOfCut}
                  />
                </div>

                <InputField
                  label="Tool Material"
                  value={turningParams.toolMaterial || ""}
                  onChange={(value) =>
                    setTurningParams((prev) => ({
                      ...prev,
                      toolMaterial: value,
                    }))
                  }
                  type="select"
                  options={toolMaterialOptions}
                  placeholder="Select Tool Material..."
                  required
                />

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="coolant-turning"
                    checked={turningParams.coolant || false}
                    onChange={(e) =>
                      setTurningParams((prev) => ({
                        ...prev,
                        coolant: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="coolant-turning"
                    className={`text-sm font-medium ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    Use Coolant
                  </label>
                </div>

                <button
                  onClick={handleTurningCalculation}
                  disabled={isCalculating}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <Calculator size={16} />
                      <span>Calculate Turning</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Turning Results */}
          {turningResults && (
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
                    Turning Analysis Results
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Spindle Speed"
                    value={turningResults.spindleSpeed}
                    unit="RPM"
                    description="Required spindle speed"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Material Removal Rate"
                    value={turningResults.materialRemovalRate}
                    unit="cm³/min"
                    description="Volume of material removed per minute"
                    trend="up"
                  />
                  <ResultCard
                    title="Cutting Force"
                    value={turningResults.cuttingForce}
                    unit={state.unitSystem.force}
                    description="Primary cutting force"
                    trend="up"
                  />
                  <ResultCard
                    title="Cutting Power"
                    value={turningResults.cuttingPower}
                    unit={state.unitSystem.power}
                    description="Power required for cutting"
                    trend="up"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Machining Time"
                    value={turningResults.machiningTime}
                    unit="min"
                    description="Time to complete operation"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Surface Roughness"
                    value={turningResults.surfaceRoughness}
                    unit="μm"
                    description="Expected surface roughness"
                    trend="down"
                  />
                  <ResultCard
                    title="Tool Life"
                    value={turningResults.toolLife}
                    unit="min"
                    description="Expected tool life"
                    trend="up"
                  />
                  <ResultCard
                    title="Cost per Part"
                    value={turningResults.costPerPart}
                    unit="$"
                    description="Estimated cost per part"
                    trend="down"
                  />
                </div>
              </div>

              <RecommendationCard
                recommendations={turningResults.recommendations}
                type="info"
              />
            </>
          )}
        </>
      )}

      {/* Milling Process */}
      {activeProcess === "milling" && (
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
                Workpiece Dimensions
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Material"
                  value={millingParams.material || ""}
                  onChange={(value) =>
                    setMillingParams((prev) => ({ ...prev, material: value }))
                  }
                  type="select"
                  options={materialOptions}
                  placeholder="Select Material..."
                  required
                  error={errors.material}
                />

                <div className="grid grid-cols-3 gap-4">
                  <InputField
                    label="Width"
                    value={millingParams.width || ""}
                    onChange={(value) =>
                      setMillingParams((prev) => ({ ...prev, width: value }))
                    }
                    type="number"
                    placeholder="50.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.width}
                  />
                  <InputField
                    label="Length"
                    value={millingParams.length || ""}
                    onChange={(value) =>
                      setMillingParams((prev) => ({ ...prev, length: value }))
                    }
                    type="number"
                    placeholder="100.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.length}
                  />
                  <InputField
                    label="Depth"
                    value={millingParams.depth || ""}
                    onChange={(value) =>
                      setMillingParams((prev) => ({ ...prev, depth: value }))
                    }
                    type="number"
                    placeholder="5.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.depth}
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
                Tool & Process Parameters
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Cutter Diameter"
                    value={millingParams.cutterDiameter || ""}
                    onChange={(value) =>
                      setMillingParams((prev) => ({
                        ...prev,
                        cutterDiameter: value,
                      }))
                    }
                    type="number"
                    placeholder="20.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.cutterDiameter}
                  />
                  <InputField
                    label="Number of Teeth"
                    value={millingParams.numberOfTeeth || ""}
                    onChange={(value) =>
                      setMillingParams((prev) => ({
                        ...prev,
                        numberOfTeeth: value,
                      }))
                    }
                    type="number"
                    placeholder="4"
                    required
                    step="1"
                    min="1"
                    error={errors.numberOfTeeth}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Spindle Speed"
                    value={millingParams.spindleSpeed || ""}
                    onChange={(value) =>
                      setMillingParams((prev) => ({
                        ...prev,
                        spindleSpeed: value,
                      }))
                    }
                    type="number"
                    placeholder="2000"
                    unit="RPM"
                    required
                    step="1"
                    min="0"
                    error={errors.spindleSpeed}
                  />
                  <InputField
                    label="Feed Rate"
                    value={millingParams.feedRate || ""}
                    onChange={(value) =>
                      setMillingParams((prev) => ({ ...prev, feedRate: value }))
                    }
                    type="number"
                    placeholder="500"
                    unit="mm/min"
                    required
                    step="1"
                    min="0"
                    error={errors.feedRate}
                  />
                </div>

                <InputField
                  label="Tool Material"
                  value={millingParams.toolMaterial || ""}
                  onChange={(value) =>
                    setMillingParams((prev) => ({
                      ...prev,
                      toolMaterial: value,
                    }))
                  }
                  type="select"
                  options={toolMaterialOptions}
                  placeholder="Select Tool Material..."
                  required
                />

                <button
                  onClick={handleMillingCalculation}
                  disabled={isCalculating}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <Calculator size={16} />
                      <span>Calculate Milling</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Milling Results */}
          {millingResults && (
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
                    Milling Analysis Results
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Cutting Speed"
                    value={millingResults.cuttingSpeed}
                    unit="m/min"
                    description="Peripheral cutting speed"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Feed per Tooth"
                    value={millingResults.feedPerTooth}
                    unit="mm/tooth"
                    description="Feed rate per cutting edge"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Material Removal Rate"
                    value={millingResults.materialRemovalRate}
                    unit="cm³/min"
                    description="Volume of material removed per minute"
                    trend="up"
                  />
                  <ResultCard
                    title="Cutting Power"
                    value={millingResults.cuttingPower}
                    unit={state.unitSystem.power}
                    description="Power required for cutting"
                    trend="up"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Machining Time"
                    value={millingResults.machiningTime}
                    unit="min"
                    description="Time to complete operation"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Surface Roughness"
                    value={millingResults.surfaceRoughness}
                    unit="μm"
                    description="Expected surface roughness"
                    trend="down"
                  />
                  <ResultCard
                    title="Tool Life"
                    value={millingResults.toolLife}
                    unit="min"
                    description="Expected tool life"
                    trend="up"
                  />
                  <ResultCard
                    title="Cost per Part"
                    value={millingResults.costPerPart}
                    unit="$"
                    description="Estimated cost per part"
                    trend="down"
                  />
                </div>
              </div>

              <RecommendationCard
                recommendations={millingResults.recommendations}
                type="info"
              />
            </>
          )}
        </>
      )}

      {/* Drilling Process */}
      {activeProcess === "drilling" && (
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
                Hole Specifications
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Material"
                  value={drillingParams.material || ""}
                  onChange={(value) =>
                    setDrillingParams((prev) => ({ ...prev, material: value }))
                  }
                  type="select"
                  options={materialOptions}
                  placeholder="Select Material..."
                  required
                  error={errors.material}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Hole Diameter"
                    value={drillingParams.holeDiameter || ""}
                    onChange={(value) =>
                      setDrillingParams((prev) => ({
                        ...prev,
                        holeDiameter: value,
                      }))
                    }
                    type="number"
                    placeholder="10.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.holeDiameter}
                  />
                  <InputField
                    label="Hole Depth"
                    value={drillingParams.holeDepth || ""}
                    onChange={(value) =>
                      setDrillingParams((prev) => ({
                        ...prev,
                        holeDepth: value,
                      }))
                    }
                    type="number"
                    placeholder="25.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.holeDepth}
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
                Drilling Parameters
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Drill Speed"
                    value={drillingParams.drillSpeed || ""}
                    onChange={(value) =>
                      setDrillingParams((prev) => ({
                        ...prev,
                        drillSpeed: value,
                      }))
                    }
                    type="number"
                    placeholder="1000"
                    unit="RPM"
                    required
                    step="1"
                    min="0"
                    error={errors.drillSpeed}
                  />
                  <InputField
                    label="Feed Rate"
                    value={drillingParams.feedRate || ""}
                    onChange={(value) =>
                      setDrillingParams((prev) => ({
                        ...prev,
                        feedRate: value,
                      }))
                    }
                    type="number"
                    placeholder="0.1"
                    unit="mm/rev"
                    required
                    step="0.01"
                    min="0"
                    error={errors.feedRate}
                  />
                </div>

                <InputField
                  label="Tool Material"
                  value={drillingParams.toolMaterial || ""}
                  onChange={(value) =>
                    setDrillingParams((prev) => ({
                      ...prev,
                      toolMaterial: value,
                    }))
                  }
                  type="select"
                  options={toolMaterialOptions}
                  placeholder="Select Tool Material..."
                  required
                />

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="coolant-drilling"
                    checked={drillingParams.coolant || false}
                    onChange={(e) =>
                      setDrillingParams((prev) => ({
                        ...prev,
                        coolant: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="coolant-drilling"
                    className={`text-sm font-medium ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    Use Coolant
                  </label>
                </div>

                <button
                  onClick={handleDrillingCalculation}
                  disabled={isCalculating}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <Calculator size={16} />
                      <span>Calculate Drilling</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Drilling Results */}
          {drillingResults && (
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
                    Drilling Analysis Results
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Cutting Speed"
                    value={drillingResults.cuttingSpeed}
                    unit="m/min"
                    description="Peripheral cutting speed"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Material Removal Rate"
                    value={drillingResults.materialRemovalRate}
                    unit="cm³/min"
                    description="Volume of material removed per minute"
                    trend="up"
                  />
                  <ResultCard
                    title="Thrust Force"
                    value={drillingResults.thrustForce}
                    unit={state.unitSystem.force}
                    description="Axial force on drill"
                    trend="up"
                  />
                  <ResultCard
                    title="Torque"
                    value={drillingResults.torque}
                    unit="Nm"
                    description="Drilling torque"
                    trend="up"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Drilling Time"
                    value={drillingResults.drillingTime}
                    unit="min"
                    description="Time to complete hole"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Tool Life"
                    value={drillingResults.toolLife}
                    unit="holes"
                    description="Expected holes per drill"
                    trend="up"
                  />
                  <ResultCard
                    title="Power Required"
                    value={drillingResults.power}
                    unit={state.unitSystem.power}
                    description="Power consumption"
                    trend="up"
                  />
                  <ResultCard
                    title="Cost per Hole"
                    value={drillingResults.costPerHole}
                    unit="$"
                    description="Estimated cost per hole"
                    trend="down"
                  />
                </div>
              </div>

              <RecommendationCard
                recommendations={drillingResults.recommendations}
                type="info"
              />
            </>
          )}
        </>
      )}

      {/* Information Panel */}
      <div
        className={`${
          isDark ? "bg-green-900/30" : "bg-green-50"
        } rounded-xl p-6 border ${
          isDark ? "border-green-800" : "border-green-200"
        }`}
      >
        <div className="flex items-start space-x-3">
          <AlertCircle
            className={`${isDark ? "text-green-300" : "text-green-700"} mt-1`}
            size={20}
          />
          <div>
            <h4
              className={`font-semibold mb-2 ${
                isDark ? "text-green-300" : "text-green-700"
              }`}
            >
              Machining Operations Notes
            </h4>
            <div
              className={`text-sm space-y-1 ${
                isDark ? "text-green-200" : "text-green-600"
              }`}
            >
              <p>
                • Calculations include tool life predictions based on Taylor's
                equation
              </p>
              <p>
                • Material removal rates consider chip load and cutting
                efficiency
              </p>
              <p>
                • Power calculations include both cutting and machine losses
              </p>
              <p>
                • Surface roughness estimates are based on feed rate and tool
                geometry
              </p>
              <p>• Cost analysis includes tool, machine, and labor costs</p>
              {activeProcess === "turning" && (
                <p>
                  • Turning calculations assume continuous cutting with constant
                  parameters
                </p>
              )}
              {activeProcess === "milling" && (
                <p>
                  • Milling calculations are based on conventional end milling
                  operations
                </p>
              )}
              {activeProcess === "drilling" && (
                <p>
                  • Drilling calculations assume standard twist drill geometry
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
