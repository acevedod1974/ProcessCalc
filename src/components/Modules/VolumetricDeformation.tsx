import React, { useState, useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import { Hammer, Settings, Download, AlertCircle } from "lucide-react";
import {
  calculateRolling,
  calculateForging,
  RollingParameters,
  ForgingParameters,
  RollingResults,
  ForgingResults,
} from "../../utils/calculations";
import {
  calculateWireDrawing,
  calculateExtrusion,
  WireDrawingParameters,
  ExtrusionParameters,
  WireDrawingResults,
  ExtrusionResults,
} from "../../utils/drawingExtrusionCalculations";
import { RollingForm } from "./VolumetricDeformation/RollingForm";
import { ForgingForm } from "./VolumetricDeformation/ForgingForm";
import { DrawingForm } from "./VolumetricDeformation/DrawingForm";
import { ExtrusionForm } from "./VolumetricDeformation/ExtrusionForm";

type DeformationProcess = "rolling" | "forging" | "drawing" | "extrusion";

export function VolumetricDeformation() {
  const { state } = useApp();
  const isDark = state.theme.mode === "dark";

  // State management
  const [activeProcess, setActiveProcess] =
    useState<DeformationProcess>("rolling");
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Rolling parameters
  const [rollingParams, setRollingParams] = useState<
    Partial<RollingParameters>
  >({
    material: "",
    initialThickness: "",
    finalThickness: "",
    width: "",
    rollDiameter: "",
    rollingSpeed: "",
    frictionCoefficient: "0.3",
    temperature: "20",
  });

  // Forging parameters
  const [forgingParams, setForgingParams] = useState<
    Partial<ForgingParameters>
  >({
    material: "",
    initialHeight: "",
    finalHeight: "",
    diameter: "",
    frictionCoefficient: "0.3",
    temperature: "20",
    dieType: "flat",
  });

  // Drawing parameters
  const [drawingParams, setDrawingParams] = useState<
    Partial<WireDrawingParameters>
  >({
    material: "",
    initialDiameter: "",
    finalDiameter: "",
    drawingSpeed: "",
    dieAngle: "8",
    numberOfPasses: "1",
    lubrication: true,
    temperature: "20",
  });

  // Extrusion parameters
  const [extrusionParams, setExtrusionParams] = useState<
    Partial<ExtrusionParameters>
  >({
    material: "",
    billetDiameter: "",
    extrudedDiameter: "",
    billetLength: "",
    extrusionSpeed: "",
    dieAngle: "45",
    temperature: "400",
    extrusionType: "direct",
    lubrication: true,
  });

  // Results
  const [rollingResults, setRollingResults] = useState<RollingResults | null>(
    null
  );
  const [forgingResults, setForgingResults] = useState<ForgingResults | null>(
    null
  );
  const [drawingResults, setDrawingResults] =
    useState<WireDrawingResults | null>(null);
  const [extrusionResults, setExtrusionResults] =
    useState<ExtrusionResults | null>(null);

  // Validation functions
  const validateRollingInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!rollingParams.material) newErrors.material = "Material is required";
    if (
      !rollingParams.initialThickness ||
      Number(rollingParams.initialThickness) <= 0
    ) {
      newErrors.initialThickness = "Initial thickness must be greater than 0";
    }
    if (
      !rollingParams.finalThickness ||
      Number(rollingParams.finalThickness) <= 0
    ) {
      newErrors.finalThickness = "Final thickness must be greater than 0";
    }
    if (
      Number(rollingParams.finalThickness) >=
      Number(rollingParams.initialThickness)
    ) {
      newErrors.finalThickness =
        "Final thickness must be less than initial thickness";
    }
    if (!rollingParams.width || Number(rollingParams.width) <= 0) {
      newErrors.width = "Width must be greater than 0";
    }
    if (
      !rollingParams.rollDiameter ||
      Number(rollingParams.rollDiameter) <= 0
    ) {
      newErrors.rollDiameter = "Roll diameter must be greater than 0";
    }
    if (
      !rollingParams.rollingSpeed ||
      Number(rollingParams.rollingSpeed) <= 0
    ) {
      newErrors.rollingSpeed = "Rolling speed must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForgingInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!forgingParams.material) newErrors.material = "Material is required";
    if (
      !forgingParams.initialHeight ||
      Number(forgingParams.initialHeight) <= 0
    ) {
      newErrors.initialHeight = "Initial height must be greater than 0";
    }
    if (!forgingParams.finalHeight || Number(forgingParams.finalHeight) <= 0) {
      newErrors.finalHeight = "Final height must be greater than 0";
    }
    if (
      Number(forgingParams.finalHeight) >= Number(forgingParams.initialHeight)
    ) {
      newErrors.finalHeight = "Final height must be less than initial height";
    }
    if (!forgingParams.diameter || Number(forgingParams.diameter) <= 0) {
      newErrors.diameter = "Diameter must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDrawingInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!drawingParams.material) newErrors.material = "Material is required";
    if (
      !drawingParams.initialDiameter ||
      Number(drawingParams.initialDiameter) <= 0
    ) {
      newErrors.initialDiameter = "Initial diameter must be greater than 0";
    }
    if (
      !drawingParams.finalDiameter ||
      Number(drawingParams.finalDiameter) <= 0
    ) {
      newErrors.finalDiameter = "Final diameter must be greater than 0";
    }
    if (
      Number(drawingParams.finalDiameter) >=
      Number(drawingParams.initialDiameter)
    ) {
      newErrors.finalDiameter =
        "Final diameter must be less than initial diameter";
    }
    if (
      !drawingParams.drawingSpeed ||
      Number(drawingParams.drawingSpeed) <= 0
    ) {
      newErrors.drawingSpeed = "Drawing speed must be greater than 0";
    }
    if (
      !drawingParams.numberOfPasses ||
      Number(drawingParams.numberOfPasses) < 1
    ) {
      newErrors.numberOfPasses = "Number of passes must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateExtrusionInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!extrusionParams.material) newErrors.material = "Material is required";
    if (
      !extrusionParams.billetDiameter ||
      Number(extrusionParams.billetDiameter) <= 0
    ) {
      newErrors.billetDiameter = "Billet diameter must be greater than 0";
    }
    if (
      !extrusionParams.extrudedDiameter ||
      Number(extrusionParams.extrudedDiameter) <= 0
    ) {
      newErrors.extrudedDiameter = "Extruded diameter must be greater than 0";
    }
    if (
      Number(extrusionParams.extrudedDiameter) >=
      Number(extrusionParams.billetDiameter)
    ) {
      newErrors.extrudedDiameter =
        "Extruded diameter must be less than billet diameter";
    }
    if (
      !extrusionParams.billetLength ||
      Number(extrusionParams.billetLength) <= 0
    ) {
      newErrors.billetLength = "Billet length must be greater than 0";
    }
    if (
      !extrusionParams.extrusionSpeed ||
      Number(extrusionParams.extrusionSpeed) <= 0
    ) {
      newErrors.extrusionSpeed = "Extrusion speed must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate functions
  const handleRollingCalculation = async () => {
    if (!validateRollingInputs()) return;

    setIsCalculating(true);
    try {
      const params: RollingParameters = {
        material: rollingParams.material!,
        initialThickness: Number(rollingParams.initialThickness),
        finalThickness: Number(rollingParams.finalThickness),
        width: Number(rollingParams.width),
        rollDiameter: Number(rollingParams.rollDiameter),
        rollingSpeed: Number(rollingParams.rollingSpeed),
        frictionCoefficient: Number(rollingParams.frictionCoefficient || 0.3),
        temperature: Number(rollingParams.temperature || 20),
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const results = calculateRolling(params);
      setRollingResults(results);
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

  const handleForgingCalculation = async () => {
    if (!validateForgingInputs()) return;

    setIsCalculating(true);
    try {
      const params: ForgingParameters = {
        material: forgingParams.material!,
        initialHeight: Number(forgingParams.initialHeight),
        finalHeight: Number(forgingParams.finalHeight),
        diameter: Number(forgingParams.diameter),
        frictionCoefficient: Number(forgingParams.frictionCoefficient || 0.3),
        temperature: Number(forgingParams.temperature || 20),
        dieType: forgingParams.dieType as "flat" | "grooved",
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const results = calculateForging(params);
      setForgingResults(results);
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

  const handleDrawingCalculation = async () => {
    if (!validateDrawingInputs()) return;

    setIsCalculating(true);
    try {
      const params: WireDrawingParameters = {
        material: drawingParams.material!,
        initialDiameter: Number(drawingParams.initialDiameter),
        finalDiameter: Number(drawingParams.finalDiameter),
        drawingSpeed: Number(drawingParams.drawingSpeed),
        dieAngle: Number(drawingParams.dieAngle || 8),
        numberOfPasses: Number(drawingParams.numberOfPasses || 1),
        lubrication: drawingParams.lubrication || false,
        temperature: Number(drawingParams.temperature || 20),
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const results = calculateWireDrawing(params);
      setDrawingResults(results);
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

  const handleExtrusionCalculation = async () => {
    if (!validateExtrusionInputs()) return;

    setIsCalculating(true);
    try {
      const params: ExtrusionParameters = {
        material: extrusionParams.material!,
        billetDiameter: Number(extrusionParams.billetDiameter),
        extrudedDiameter: Number(extrusionParams.extrudedDiameter),
        billetLength: Number(extrusionParams.billetLength),
        extrusionSpeed: Number(extrusionParams.extrusionSpeed),
        dieAngle: Number(extrusionParams.dieAngle || 45),
        temperature: Number(extrusionParams.temperature || 400),
        extrusionType: extrusionParams.extrusionType as "direct" | "indirect",
        lubrication: extrusionParams.lubrication || false,
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const results = calculateExtrusion(params);
      setExtrusionResults(results);
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
    setRollingResults(null);
    setForgingResults(null);
    setDrawingResults(null);
    setExtrusionResults(null);
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
        <RollingForm
          params={rollingParams}
          setParams={setRollingParams}
          results={rollingResults}
          errors={errors}
          isCalculating={isCalculating}
          onCalculate={handleRollingCalculation}
        />
      )}

      {/* Forging Process */}
      {activeProcess === "forging" && (
        <ForgingForm
          params={forgingParams}
          setParams={setForgingParams}
          results={forgingResults}
          errors={errors}
          isCalculating={isCalculating}
          onCalculate={handleForgingCalculation}
        />
      )}

      {/* Drawing Process */}
      {activeProcess === "drawing" && (
        <DrawingForm
          params={drawingParams}
          setParams={setDrawingParams}
          results={drawingResults}
          errors={errors}
          isCalculating={isCalculating}
          onCalculate={handleDrawingCalculation}
        />
      )}

      {/* Extrusion Process */}
      {activeProcess === "extrusion" && (
        <ExtrusionForm
          params={extrusionParams}
          setParams={setExtrusionParams}
          results={extrusionResults}
          errors={errors}
          isCalculating={isCalculating}
          onCalculate={handleExtrusionCalculation}
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
