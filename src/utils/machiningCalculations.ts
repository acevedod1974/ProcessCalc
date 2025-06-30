import { validateMaterial, generateRecommendations } from "./sharedUtils";

// Machining Operations Calculations

export interface MachiningMaterialProperties {
  name: string;
  hardness: number; // HB
  tensileStrength: number; // MPa
  thermalConductivity: number; // W/m·K
  specificHeat: number; // J/kg·K
  density: number; // kg/m³
  machinabilityRating: number; // 0-100 scale
  recommendedSpeed: {
    hss: number; // m/min
    carbide: number; // m/min
    ceramic: number; // m/min
    diamond: number; // m/min
  };
}

export const MACHINING_MATERIALS: Record<string, MachiningMaterialProperties> =
  {
    "steel-mild": {
      name: "Mild Steel (AISI 1018)",
      hardness: 126,
      tensileStrength: 440,
      thermalConductivity: 51.9,
      specificHeat: 486,
      density: 7850,
      machinabilityRating: 70,
      recommendedSpeed: {
        hss: 25,
        carbide: 150,
        ceramic: 300,
        diamond: 500,
      },
    },
    "steel-medium": {
      name: "Medium Carbon Steel (AISI 1045)",
      hardness: 170,
      tensileStrength: 625,
      thermalConductivity: 49.8,
      specificHeat: 486,
      density: 7850,
      machinabilityRating: 55,
      recommendedSpeed: {
        hss: 20,
        carbide: 120,
        ceramic: 250,
        diamond: 400,
      },
    },
    "stainless-304": {
      name: "Stainless Steel 304",
      hardness: 201,
      tensileStrength: 620,
      thermalConductivity: 16.2,
      specificHeat: 500,
      density: 8000,
      machinabilityRating: 45,
      recommendedSpeed: {
        hss: 15,
        carbide: 100,
        ceramic: 200,
        diamond: 350,
      },
    },
    "aluminum-6061": {
      name: "Aluminum 6061-T6",
      hardness: 95,
      tensileStrength: 310,
      thermalConductivity: 167,
      specificHeat: 896,
      density: 2700,
      machinabilityRating: 90,
      recommendedSpeed: {
        hss: 100,
        carbide: 400,
        ceramic: 800,
        diamond: 1200,
      },
    },
    "copper-c110": {
      name: "Copper C110",
      hardness: 40,
      tensileStrength: 220,
      thermalConductivity: 391,
      specificHeat: 385,
      density: 8960,
      machinabilityRating: 85,
      recommendedSpeed: {
        hss: 80,
        carbide: 300,
        ceramic: 600,
        diamond: 1000,
      },
    },
    "titanium-ti6al4v": {
      name: "Titanium Ti-6Al-4V",
      hardness: 334,
      tensileStrength: 1170,
      thermalConductivity: 6.7,
      specificHeat: 526,
      density: 4430,
      machinabilityRating: 25,
      recommendedSpeed: {
        hss: 8,
        carbide: 60,
        ceramic: 150,
        diamond: 250,
      },
    },
  };

// Turning Operations
export interface TurningParameters {
  material: string;
  diameter: number; // mm
  length: number; // mm
  cuttingSpeed: number; // m/min
  feedRate: number; // mm/rev
  depthOfCut: number; // mm
  toolMaterial: "hss" | "carbide" | "ceramic" | "diamond";
  coolant: boolean;
}

export interface TurningResults {
  spindleSpeed: number; // RPM
  materialRemovalRate: number; // cm³/min
  cuttingForce: number; // N
  cuttingPower: number; // kW
  machiningTime: number; // min
  surfaceRoughness: number; // μm
  toolLife: number; // min
  costPerPart: number; // $
  recommendations: string[];
}

export function calculateTurning(params: TurningParameters): TurningResults {
  const material = validateMaterial(MACHINING_MATERIALS, params.material);

  // Spindle speed calculation
  const spindleSpeed =
    (params.cuttingSpeed * 1000) / (Math.PI * params.diameter);

  // Material removal rate
  const materialRemovalRate =
    (params.cuttingSpeed * params.feedRate * params.depthOfCut) / 10; // cm³/min

  // Cutting force estimation (simplified model)
  const specificCuttingForce = material.tensileStrength * 2.5; // N/mm²
  const chipArea = params.feedRate * params.depthOfCut; // mm²
  const cuttingForce = specificCuttingForce * chipArea;

  // Power calculation
  const cuttingPower = (cuttingForce * params.cuttingSpeed) / 60000; // kW

  // Machining time
  const machiningTime = params.length / (params.feedRate * spindleSpeed);

  // Surface roughness estimation
  const surfaceRoughness = (params.feedRate * params.feedRate) / (8 * 0.8); // μm (simplified)

  // Tool life calculation (Taylor's equation: VT^n = C)
  const taylorExponent = getToolLifeExponent(params.toolMaterial);
  const taylorConstant = getToolLifeConstant(
    params.toolMaterial,
    material.machinabilityRating
  );
  const toolLife = Math.pow(
    taylorConstant / params.cuttingSpeed,
    1 / taylorExponent
  );

  // Cost calculation
  const toolCost = getToolCost(params.toolMaterial);
  const machineCostPerMin = 1.5; // $/min
  const laborCostPerMin = 0.8; // $/min
  const costPerPart =
    machiningTime * (machineCostPerMin + laborCostPerMin) +
    (toolCost * machiningTime) / toolLife;

  const recommendations = generateRecommendations(
    [
      {
        condition:
          params.cuttingSpeed >
          material.recommendedSpeed[params.toolMaterial] * 1.2,
        message: "Consider reducing cutting speed to extend tool life",
      },
      {
        condition:
          params.cuttingSpeed <
          material.recommendedSpeed[params.toolMaterial] * 0.8,
        message: "Cutting speed can be increased for higher productivity",
      },
      {
        condition: params.feedRate > 0.5,
        message: "High feed rate may cause poor surface finish",
      },
      {
        condition: toolLife < 30,
        message:
          "Tool life is low - consider using coolant or reducing cutting parameters",
      },
      {
        condition: cuttingPower > 10,
        message: "High power consumption - check machine capability",
      },
      {
        condition: !params.coolant && material.machinabilityRating < 60,
        message: "Use coolant to improve tool life and surface finish",
      },
    ],
    "Turning parameters are optimized for this material"
  );

  return {
    spindleSpeed: Math.round(spindleSpeed),
    materialRemovalRate: Number(materialRemovalRate.toFixed(2)),
    cuttingForce: Math.round(cuttingForce),
    cuttingPower: Number(cuttingPower.toFixed(2)),
    machiningTime: Number(machiningTime.toFixed(2)),
    surfaceRoughness: Number(surfaceRoughness.toFixed(2)),
    toolLife: Math.round(toolLife),
    costPerPart: Number(costPerPart.toFixed(2)),
    recommendations,
  };
}

// Milling Operations
export interface MillingParameters {
  material: string;
  width: number; // mm
  length: number; // mm
  depth: number; // mm
  cutterDiameter: number; // mm
  numberOfTeeth: number;
  spindleSpeed: number; // RPM
  feedRate: number; // mm/min
  toolMaterial: "hss" | "carbide" | "ceramic" | "diamond";
}

export interface MillingResults {
  cuttingSpeed: number; // m/min
  feedPerTooth: number; // mm/tooth
  materialRemovalRate: number; // cm³/min
  cuttingPower: number; // kW
  machiningTime: number; // min
  surfaceRoughness: number; // μm
  toolLife: number; // min
  costPerPart: number; // $
  recommendations: string[];
}

export function calculateMilling(params: MillingParameters): MillingResults {
  const material = validateMaterial(MACHINING_MATERIALS, params.material);

  // Cutting speed
  const cuttingSpeed =
    (Math.PI * params.cutterDiameter * params.spindleSpeed) / 1000; // m/min

  // Feed per tooth
  const feedPerTooth =
    params.feedRate / (params.spindleSpeed * params.numberOfTeeth);

  // Material removal rate
  const materialRemovalRate =
    (params.width * params.depth * params.feedRate) / 1000; // cm³/min

  // Power calculation (simplified)
  const specificCuttingForce = material.tensileStrength * 3.0; // N/mm²
  const averageChipThickness = feedPerTooth * Math.sin(Math.PI / 4); // Simplified
  const cuttingForce =
    specificCuttingForce *
    params.width *
    averageChipThickness *
    params.numberOfTeeth;
  const cuttingPower = (cuttingForce * cuttingSpeed) / 60000; // kW

  // Machining time
  const numberOfPasses = Math.ceil(
    params.length / (params.cutterDiameter * 0.8)
  );
  const machiningTime = (params.length * numberOfPasses) / params.feedRate;

  // Surface roughness
  const surfaceRoughness = (feedPerTooth * feedPerTooth) / (8 * 0.8); // μm

  // Tool life
  const taylorExponent = getToolLifeExponent(params.toolMaterial);
  const taylorConstant =
    getToolLifeConstant(params.toolMaterial, material.machinabilityRating) *
    0.8; // Milling factor
  const toolLife = Math.pow(taylorConstant / cuttingSpeed, 1 / taylorExponent);

  // Cost calculation
  const toolCost = getToolCost(params.toolMaterial) * 1.5; // Milling tools are more expensive
  const machineCostPerMin = 2.0; // $/min
  const laborCostPerMin = 0.8; // $/min
  const costPerPart =
    machiningTime * (machineCostPerMin + laborCostPerMin) +
    (toolCost * machiningTime) / toolLife;

  const recommendations = generateRecommendations(
    [
      {
        condition: feedPerTooth > 0.3,
        message: "Feed per tooth is high - may cause tool breakage",
      },
      {
        condition: feedPerTooth < 0.05,
        message: "Feed per tooth is low - may cause work hardening",
      },
      {
        condition:
          cuttingSpeed > material.recommendedSpeed[params.toolMaterial] * 1.2,
        message: "Consider reducing spindle speed to extend tool life",
      },
      {
        condition: params.numberOfTeeth < 3,
        message:
          "Consider using end mill with more teeth for better surface finish",
      },
      {
        condition: toolLife < 60,
        message: "Tool life is low - optimize cutting parameters",
      },
      {
        condition: params.depth > params.cutterDiameter * 0.5,
        message: "Deep cuts may cause chatter - consider multiple passes",
      },
    ],
    "Milling parameters are well optimized"
  );

  return {
    cuttingSpeed: Number(cuttingSpeed.toFixed(1)),
    feedPerTooth: Number(feedPerTooth.toFixed(3)),
    materialRemovalRate: Number(materialRemovalRate.toFixed(2)),
    cuttingPower: Number(cuttingPower.toFixed(2)),
    machiningTime: Number(machiningTime.toFixed(2)),
    surfaceRoughness: Number(surfaceRoughness.toFixed(2)),
    toolLife: Math.round(toolLife),
    costPerPart: Number(costPerPart.toFixed(2)),
    recommendations,
  };
}

// Drilling Operations
export interface DrillingParameters {
  material: string;
  holeDiameter: number; // mm
  holeDepth: number; // mm
  drillSpeed: number; // RPM
  feedRate: number; // mm/rev
  toolMaterial: "hss" | "carbide" | "ceramic" | "diamond";
  coolant: boolean;
}

export interface DrillingResults {
  cuttingSpeed: number; // m/min
  materialRemovalRate: number; // cm³/min
  thrustForce: number; // N
  torque: number; // Nm
  drillingTime: number; // min
  toolLife: number; // holes
  power: number; // kW
  costPerHole: number; // $
  recommendations: string[];
}

export function calculateDrilling(params: DrillingParameters): DrillingResults {
  const material = validateMaterial(MACHINING_MATERIALS, params.material);

  // Cutting speed
  const cuttingSpeed =
    (Math.PI * params.holeDiameter * params.drillSpeed) / 1000; // m/min

  // Material removal rate
  const holeArea = Math.PI * Math.pow(params.holeDiameter / 2, 2); // mm²
  const materialRemovalRate =
    (holeArea * params.feedRate * params.drillSpeed) / 60000; // cm³/min

  // Thrust force calculation
  const specificThrustForce = material.tensileStrength * 0.8; // N/mm²
  const thrustForce = (specificThrustForce * holeArea) / 1000; // N

  // Torque calculation
  const specificTorque = material.tensileStrength * 0.3; // Nm/mm²
  const torque =
    (specificTorque * Math.pow(params.holeDiameter / 2, 2) * Math.PI) / 1000; // Nm

  // Drilling time
  const drillingTime = params.holeDepth / (params.feedRate * params.drillSpeed);

  // Power calculation
  const power = (torque * params.drillSpeed * 2 * Math.PI) / 60000; // kW

  // Tool life (in number of holes)
  const baseToolLife = getBaseToolLife(params.toolMaterial);
  const materialFactor = material.machinabilityRating / 100;
  const speedFactor =
    material.recommendedSpeed[params.toolMaterial] / cuttingSpeed;
  const coolantFactor = params.coolant ? 1.5 : 1.0;
  const toolLife = baseToolLife * materialFactor * speedFactor * coolantFactor;

  // Cost per hole
  const toolCost = getToolCost(params.toolMaterial) * 0.5; // Drills are less expensive
  const machineCostPerMin = 1.2; // $/min
  const laborCostPerMin = 0.8; // $/min
  const costPerHole =
    drillingTime * (machineCostPerMin + laborCostPerMin) + toolCost / toolLife;

  const recommendations = generateRecommendations(
    [
      {
        condition: params.feedRate > params.holeDiameter * 0.1,
        message:
          "Feed rate is high for this hole diameter - may cause drill breakage",
      },
      {
        condition:
          cuttingSpeed > material.recommendedSpeed[params.toolMaterial] * 1.2,
        message: "Drill speed is high - consider reducing to extend tool life",
      },
      {
        condition: params.holeDepth > params.holeDiameter * 5,
        message: "Deep hole drilling - use peck drilling cycle and coolant",
      },
      {
        condition: !params.coolant && material.machinabilityRating < 70,
        message: "Use coolant for better chip evacuation and tool life",
      },
      {
        condition: toolLife < 20,
        message: "Tool life is very low - check drill condition and parameters",
      },
      {
        condition: thrustForce > 1000,
        message: "High thrust force - ensure adequate workholding",
      },
    ],
    "Drilling parameters are appropriate for this application"
  );

  return {
    cuttingSpeed: Number(cuttingSpeed.toFixed(1)),
    materialRemovalRate: Number(materialRemovalRate.toFixed(2)),
    thrustForce: Math.round(thrustForce),
    torque: Number(torque.toFixed(2)),
    drillingTime: Number(drillingTime.toFixed(3)),
    toolLife: Math.round(toolLife),
    power: Number(power.toFixed(2)),
    costPerHole: Number(costPerHole.toFixed(3)),
    recommendations,
  };
}

// Types for recommendation results
// Remove unused recommendation result interfaces

// Helper functions
function getToolLifeExponent(toolMaterial: string): number {
  const exponents = {
    hss: 0.125,
    carbide: 0.2,
    ceramic: 0.3,
    diamond: 0.4,
  };
  return exponents[toolMaterial as keyof typeof exponents] || 0.125;
}

function getToolLifeConstant(
  toolMaterial: string,
  machinabilityRating: number
): number {
  const baseConstants = {
    hss: 30,
    carbide: 200,
    ceramic: 500,
    diamond: 1000,
  };
  const baseConstant =
    baseConstants[toolMaterial as keyof typeof baseConstants] || 30;
  return baseConstant * (machinabilityRating / 100);
}

function getToolCost(toolMaterial: string): number {
  const costs = {
    hss: 5,
    carbide: 25,
    ceramic: 50,
    diamond: 200,
  };
  return costs[toolMaterial as keyof typeof costs] || 5;
}

function getBaseToolLife(toolMaterial: string): number {
  const baseLife = {
    hss: 50,
    carbide: 200,
    ceramic: 500,
    diamond: 1000,
  };
  return baseLife[toolMaterial as keyof typeof baseLife] || 50;
}
