// Drawing and Extrusion Process Calculations

export interface DrawingMaterialProperties {
  name: string;
  yieldStrength: number; // MPa
  ultimateStrength: number; // MPa
  reductionLimit: number; // Maximum reduction per pass (%)
  frictionCoefficient: number;
  workHardeningExponent: number;
  flowStressCoefficient: number;
}

export const DRAWING_MATERIALS: Record<string, DrawingMaterialProperties> = {
  "steel-low-carbon": {
    name: "Steel (Low Carbon)",
    yieldStrength: 250,
    ultimateStrength: 400,
    reductionLimit: 25,
    frictionCoefficient: 0.1,
    workHardeningExponent: 0.26,
    flowStressCoefficient: 530,
  },
  "aluminum-1100": {
    name: "Aluminum 1100",
    yieldStrength: 90,
    ultimateStrength: 130,
    reductionLimit: 35,
    frictionCoefficient: 0.08,
    workHardeningExponent: 0.2,
    flowStressCoefficient: 180,
  },
  "copper-c110": {
    name: "Copper C110",
    yieldStrength: 70,
    ultimateStrength: 220,
    reductionLimit: 40,
    frictionCoefficient: 0.05,
    workHardeningExponent: 0.54,
    flowStressCoefficient: 315,
  },
  "stainless-304": {
    name: "Stainless Steel 304",
    yieldStrength: 290,
    ultimateStrength: 620,
    reductionLimit: 20,
    frictionCoefficient: 0.12,
    workHardeningExponent: 0.45,
    flowStressCoefficient: 1275,
  },
};

// Wire Drawing
export interface WireDrawingParameters {
  material: string;
  initialDiameter: number; // mm
  finalDiameter: number; // mm
  drawingSpeed: number; // m/min
  dieAngle: number; // degrees
  numberOfPasses: number;
  lubrication: boolean;
  temperature: number; // °C
}

export interface WireDrawingResults {
  reductionRatio: number; // %
  reductionPerPass: number; // %
  trueStrain: number;
  drawingForce: number; // N
  drawingStress: number; // MPa
  drawingPower: number; // kW
  dieStress: number; // MPa
  workDone: number; // kJ
  efficiency: number; // %
  recommendations: string[];
}

export function calculateWireDrawing(
  params: WireDrawingParameters
): WireDrawingResults {
  const material = DRAWING_MATERIALS[params.material];
  if (!material) {
    throw new Error("Material not found");
  }

  // Basic calculations
  const initialArea = Math.PI * Math.pow(params.initialDiameter / 2, 2);
  const finalArea = Math.PI * Math.pow(params.finalDiameter / 2, 2);
  const reductionRatio = ((initialArea - finalArea) / initialArea) * 100;
  const reductionPerPass = reductionRatio / params.numberOfPasses;
  const trueStrain = Math.log(initialArea / finalArea);

  // Temperature factor
  const tempFactor = 1 - (params.temperature - 20) * 0.001;
  const adjustedYieldStrength = material.yieldStrength * tempFactor;

  // Die angle factor
  const angleRadians = (params.dieAngle * Math.PI) / 180;
  const angleFactor =
    (1 + Math.sin(angleRadians)) / (1 + Math.cos(angleRadians));

  // Friction factor
  const frictionFactor = params.lubrication
    ? material.frictionCoefficient * 0.5
    : material.frictionCoefficient;

  // Drawing stress calculation
  const drawingStress =
    adjustedYieldStrength *
    (1 + frictionFactor / Math.tan(angleRadians / 2)) *
    Math.log(initialArea / finalArea);

  // Drawing force
  const drawingForce = drawingStress * finalArea * 1000; // Convert to N

  // Power calculation
  const drawingPower = (drawingForce * params.drawingSpeed) / 60000; // kW

  // Die stress
  const dieStress = drawingStress * angleFactor;

  // Work done
  const workDone =
    (drawingForce * (params.initialDiameter - params.finalDiameter)) / 1000; // kJ

  // Efficiency
  const idealWork = (adjustedYieldStrength * finalArea * trueStrain) / 1000;
  const efficiency = Math.min((idealWork / workDone) * 100, 95);

  // Recommendations
  const recommendations = generateDrawingRecommendations(params, material, {
    reductionPerPass,
    drawingStress,
    dieStress,
    efficiency,
  });

  return {
    reductionRatio: Number(reductionRatio.toFixed(2)),
    reductionPerPass: Number(reductionPerPass.toFixed(2)),
    trueStrain: Number(trueStrain.toFixed(3)),
    drawingForce: Math.round(drawingForce),
    drawingStress: Number(drawingStress.toFixed(1)),
    drawingPower: Number(drawingPower.toFixed(2)),
    dieStress: Number(dieStress.toFixed(1)),
    workDone: Number(workDone.toFixed(2)),
    efficiency: Number(efficiency.toFixed(1)),
    recommendations,
  };
}

// Extrusion
export interface ExtrusionParameters {
  material: string;
  billetDiameter: number; // mm
  extrudedDiameter: number; // mm
  billetLength: number; // mm
  extrusionSpeed: number; // mm/min
  dieAngle: number; // degrees
  temperature: number; // °C
  extrusionType: "direct" | "indirect";
  lubrication: boolean;
}

export interface ExtrusionResults {
  extrusionRatio: number;
  extrusionForce: number; // N
  extrusionPressure: number; // MPa
  extrusionPower: number; // kW
  extrusionTime: number; // min
  materialFlow: number; // mm/min
  workDone: number; // kJ
  efficiency: number; // %
  recommendations: string[];
}

export function calculateExtrusion(
  params: ExtrusionParameters
): ExtrusionResults {
  const material = DRAWING_MATERIALS[params.material];
  if (!material) {
    throw new Error("Material not found");
  }

  // Basic calculations
  const billetArea = Math.PI * Math.pow(params.billetDiameter / 2, 2);
  const extrudedArea = Math.PI * Math.pow(params.extrudedDiameter / 2, 2);
  const extrusionRatio = billetArea / extrudedArea;

  // Temperature effects
  const tempFactor = 1 - (params.temperature - 20) * 0.002;
  const adjustedFlowStress = material.flowStressCoefficient * tempFactor;

  // Die angle factor
  const angleRadians = (params.dieAngle * Math.PI) / 180;
  const angleFactor = 1 + (2 * angleRadians) / 3;

  // Friction factor
  const frictionFactor = params.lubrication ? 0.05 : 0.15;
  const frictionEffect = 1 + frictionFactor * Math.log(extrusionRatio);

  // Extrusion type factor
  const typeMultiplier = params.extrusionType === "direct" ? 1.0 : 0.8;

  // Extrusion pressure calculation
  const extrusionPressure =
    adjustedFlowStress *
    Math.log(extrusionRatio) *
    angleFactor *
    frictionEffect *
    typeMultiplier;

  // Extrusion force
  const extrusionForce = extrusionPressure * billetArea * 1000; // Convert to N

  // Power calculation
  const extrusionPower = (extrusionForce * params.extrusionSpeed) / 60000000; // kW

  // Extrusion time
  const extrusionTime = params.billetLength / params.extrusionSpeed;

  // Material flow rate
  const materialFlow = params.extrusionSpeed * extrusionRatio;

  // Work done
  const workDone = (extrusionForce * params.billetLength) / 1000000; // kJ

  // Efficiency
  const idealWork =
    (adjustedFlowStress * billetArea * Math.log(extrusionRatio)) / 1000;
  const efficiency = Math.min((idealWork / workDone) * 100, 90);

  // Recommendations
  const recommendations = generateExtrusionRecommendations(params, material, {
    extrusionRatio,
    extrusionPressure,
    efficiency,
    temperature: params.temperature,
  });

  return {
    extrusionRatio: Number(extrusionRatio.toFixed(2)),
    extrusionForce: Math.round(extrusionForce),
    extrusionPressure: Number(extrusionPressure.toFixed(1)),
    extrusionPower: Number(extrusionPower.toFixed(2)),
    extrusionTime: Number(extrusionTime.toFixed(2)),
    materialFlow: Number(materialFlow.toFixed(1)),
    workDone: Number(workDone.toFixed(2)),
    efficiency: Number(efficiency.toFixed(1)),
    recommendations,
  };
}

// Helper functions for recommendations
function generateDrawingRecommendations(
  params: WireDrawingParameters,
  material: DrawingMaterialProperties,
  results: {
    reductionPerPass: number;
    drawingStress: number;
    dieStress: number;
    efficiency: number;
  }
): string[] {
  const recommendations: string[] = [];

  if (results.reductionPerPass > material.reductionLimit) {
    recommendations.push(
      `Reduction per pass (${results.reductionPerPass.toFixed(
        1
      )}%) exceeds material limit (${
        material.reductionLimit
      }%) - increase number of passes`
    );
  }

  if (params.dieAngle < 6) {
    recommendations.push(
      "Die angle is very small - may cause excessive drawing force"
    );
  } else if (params.dieAngle > 20) {
    recommendations.push("Die angle is large - may cause surface defects");
  }

  if (!params.lubrication) {
    recommendations.push(
      "Use lubrication to reduce drawing force and improve surface quality"
    );
  }

  if (results.dieStress > material.ultimateStrength * 3) {
    recommendations.push(
      "Die stress is high - consider using harder die material"
    );
  }

  if (results.efficiency < 70) {
    recommendations.push("Low efficiency - optimize die angle and lubrication");
  }

  if (params.drawingSpeed > 100) {
    recommendations.push(
      "High drawing speed may cause heating - monitor temperature"
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Drawing parameters are well optimized for this material"
    );
  }

  return recommendations;
}

function generateExtrusionRecommendations(
  params: ExtrusionParameters,
  material: DrawingMaterialProperties,
  results: {
    extrusionRatio: number;
    extrusionPressure: number;
    efficiency: number;
    temperature: number;
  }
): string[] {
  const recommendations: string[] = [];

  if (results.extrusionRatio > 50) {
    recommendations.push(
      "Very high extrusion ratio - consider multiple-stage extrusion"
    );
  }

  if (params.temperature < 200 && material.name.includes("Steel")) {
    recommendations.push(
      "Consider hot extrusion for steel materials to reduce force"
    );
  }

  if (params.dieAngle > 90) {
    recommendations.push(
      "Die angle is very large - may cause material flow issues"
    );
  }

  if (results.extrusionPressure > 1000) {
    recommendations.push("High extrusion pressure - ensure press capability");
  }

  if (!params.lubrication && params.extrusionType === "direct") {
    recommendations.push(
      "Use lubrication for direct extrusion to reduce friction"
    );
  }

  if (results.efficiency < 60) {
    recommendations.push(
      "Low efficiency - optimize temperature and die design"
    );
  }

  if (params.extrusionSpeed > 50 && params.temperature < 300) {
    recommendations.push("High speed with low temperature may cause defects");
  }

  if (recommendations.length === 0) {
    recommendations.push("Extrusion parameters are optimized for this process");
  }

  return recommendations;
}
