// Metal Cutting Analysis Calculations

export interface CuttingMaterialProperties {
  name: string;
  shearStrength: number; // MPa
  tensileStrength: number; // MPa
  hardness: number; // HB
  density: number; // kg/m³
  thermalConductivity: number; // W/m·K
  specificHeat: number; // J/kg·K
  workHardeningExponent: number;
  frictionCoefficient: number;
}

export const CUTTING_MATERIALS: Record<string, CuttingMaterialProperties> = {
  'steel-mild': {
    name: 'Mild Steel (AISI 1018)',
    shearStrength: 290,
    tensileStrength: 440,
    hardness: 126,
    density: 7850,
    thermalConductivity: 51.9,
    specificHeat: 486,
    workHardeningExponent: 0.15,
    frictionCoefficient: 0.6
  },
  'steel-medium': {
    name: 'Medium Carbon Steel (AISI 1045)',
    shearStrength: 380,
    tensileStrength: 625,
    hardness: 170,
    density: 7850,
    thermalConductivity: 49.8,
    specificHeat: 486,
    workHardeningExponent: 0.12,
    frictionCoefficient: 0.65
  },
  'stainless-304': {
    name: 'Stainless Steel 304',
    shearStrength: 515,
    tensileStrength: 620,
    hardness: 201,
    density: 8000,
    thermalConductivity: 16.2,
    specificHeat: 500,
    workHardeningExponent: 0.45,
    frictionCoefficient: 0.7
  },
  'aluminum-6061': {
    name: 'Aluminum 6061-T6',
    shearStrength: 207,
    tensileStrength: 310,
    hardness: 95,
    density: 2700,
    thermalConductivity: 167,
    specificHeat: 896,
    workHardeningExponent: 0.05,
    frictionCoefficient: 0.4
  },
  'copper-c110': {
    name: 'Copper C110',
    shearStrength: 220,
    tensileStrength: 220,
    hardness: 40,
    density: 8960,
    thermalConductivity: 391,
    specificHeat: 385,
    workHardeningExponent: 0.54,
    frictionCoefficient: 0.3
  },
  'brass-360': {
    name: 'Brass 360',
    shearStrength: 230,
    tensileStrength: 340,
    hardness: 70,
    density: 8500,
    thermalConductivity: 115,
    specificHeat: 380,
    workHardeningExponent: 0.35,
    frictionCoefficient: 0.35
  }
};

export interface PunchingParameters {
  material: string;
  thickness: number; // mm
  holeDiameter: number; // mm
  punchDiameter: number; // mm
  clearance: number; // % of thickness
  punchSpeed: number; // mm/min
  temperature: number; // °C
  lubrication: boolean;
}

export interface PunchingResults {
  punchingForce: number; // N
  strippingForce: number; // N
  totalForce: number; // N
  punchingEnergy: number; // J
  punchingPower: number; // W
  shearStress: number; // MPa
  clearanceValue: number; // mm
  cutQuality: string;
  toolWearRate: number; // μm/1000 holes
  expectedToolLife: number; // holes
  recommendations: string[];
}

/**
 * Calculate punching/piercing process parameters using established formulas
 * @param params - Punching parameters including hole geometry, material, and process conditions
 * @returns Complete punching analysis including forces, energy, tool life, and quality assessment
 */
export function calculatePunching(params: PunchingParameters): PunchingResults {
  const material = CUTTING_MATERIALS[params.material];
  if (!material) {
    throw new Error('Material not found');
  }

  // Temperature compensation
  const tempFactor = 1 - (params.temperature - 20) * 0.002; // 0.2% reduction per °C above 20°C
  const adjustedShearStrength = material.shearStrength * tempFactor;

  // Clearance calculations
  const clearanceValue = (params.clearance / 100) * params.thickness;

  // Punching force calculation using: F = τ × A_shear = τ × π × D × t
  // where τ = shear strength, D = hole diameter, t = thickness
  const shearArea = Math.PI * params.holeDiameter * params.thickness;
  const punchingForce = adjustedShearStrength * shearArea * 1000; // Convert to N

  // Stripping force calculation: F_strip = F_punch × k_strip
  // Stripping factor varies with thickness-to-diameter ratio
  const strippingFactor = 0.08 + (params.thickness / params.holeDiameter) * 0.02;
  const strippingForce = punchingForce * strippingFactor;

  // Total force
  const totalForce = punchingForce + strippingForce;

  // Energy and power calculations
  const punchingStroke = params.thickness + 2; // mm (including breakthrough)
  const punchingEnergy = (punchingForce * punchingStroke) / 1000; // J
  const punchingPower = (punchingEnergy * params.punchSpeed) / 60; // W

  // Shear stress
  const shearStress = punchingForce / (shearArea * 1000); // MPa

  // Cut quality assessment
  let cutQuality = 'Poor';
  const optimalClearance = params.thickness * 0.05; // 5% of thickness
  const clearanceRatio = clearanceValue / optimalClearance;

  if (clearanceRatio >= 0.8 && clearanceRatio <= 1.2) {
    cutQuality = 'Excellent';
  } else if (clearanceRatio >= 0.6 && clearanceRatio <= 1.5) {
    cutQuality = 'Good';
  } else if (clearanceRatio >= 0.4 && clearanceRatio <= 2.0) {
    cutQuality = 'Fair';
  }

  // Tool wear rate calculation
  const wearFactor = material.hardness / 100;
  const speedFactor = Math.pow(params.punchSpeed / 100, 0.3);
  const clearanceFactor = Math.abs(1 - clearanceRatio) + 1;
  const lubricationFactor = params.lubrication ? 0.7 : 1.0;
  
  const toolWearRate = wearFactor * speedFactor * clearanceFactor * lubricationFactor * 2.5;
  const expectedToolLife = Math.round(250 / toolWearRate * 1000); // holes

  // Recommendations
  const recommendations: string[] = [];
  
  if (clearanceRatio < 0.8) {
    recommendations.push('Increase clearance to improve cut quality and reduce tool wear');
  } else if (clearanceRatio > 1.2) {
    recommendations.push('Reduce clearance to minimize burr formation');
  }
  
  if (params.punchSpeed > 200) {
    recommendations.push('Consider reducing punch speed to extend tool life');
  }
  
  if (!params.lubrication) {
    recommendations.push('Use lubrication to reduce friction and improve tool life');
  }
  
  if (params.temperature > 50) {
    recommendations.push('High temperature may affect material properties - consider cooling');
  }

  if (recommendations.length === 0) {
    recommendations.push('Parameters are within optimal range');
  }

  return {
    punchingForce,
    strippingForce,
    totalForce,
    punchingEnergy,
    punchingPower,
    shearStress,
    clearanceValue,
    cutQuality,
    toolWearRate,
    expectedToolLife,
    recommendations
  };
}

export interface ShearingParameters {
  material: string;
  thickness: number; // mm
  shearLength: number; // mm
  bladeAngle: number; // degrees
  clearance: number; // % of thickness
  shearSpeed: number; // mm/min
  holdDownForce: number; // N
}

export interface ShearingResults {
  shearingForce: number; // N
  holdDownPressure: number; // MPa
  totalForce: number; // N
  shearingEnergy: number; // J
  shearingPower: number; // W
  bladeWear: number; // μm/m
  cutAngle: number; // degrees
  distortion: number; // mm
  recommendations: string[];
}

/**
 * Calculate shearing process parameters using metal cutting mechanics
 * @param params - Shearing parameters including geometry, material, and cutting conditions
 * @returns Complete shearing analysis including forces, power, blade wear, and recommendations
 */
export function calculateShearing(params: ShearingParameters): ShearingResults {
  const material = CUTTING_MATERIALS[params.material];
  if (!material) {
    throw new Error('Material not found');
  }

  // Blade angle factor
  const angleRadians = (params.bladeAngle * Math.PI) / 180;
  const angleFactor = 1 / Math.sin(angleRadians);

  // Clearance factor
  const clearanceValue = (params.clearance / 100) * params.thickness;
  const clearanceFactor = 1 + (clearanceValue / params.thickness) * 0.3;

  // Shearing force calculation
  const shearArea = params.shearLength * params.thickness;
  const baseShearForce = material.shearStrength * shearArea * 1000; // N
  const shearingForce = baseShearForce * angleFactor * clearanceFactor;

  // Hold down pressure
  const holdDownArea = params.shearLength * (params.thickness + 10); // mm²
  const holdDownPressure = params.holdDownForce / holdDownArea; // MPa

  // Total force
  const totalForce = shearingForce + params.holdDownForce;

  // Energy and power
  const shearingStroke = params.thickness * angleFactor;
  const shearingEnergy = (shearingForce * shearingStroke) / 1000; // J
  const shearingPower = (shearingEnergy * params.shearSpeed) / 60; // W

  // Blade wear estimation
  const hardnessFactor = material.hardness / 200;
  const speedFactor = params.shearSpeed / 100;
  const bladeWear = hardnessFactor * speedFactor * 15; // μm/m

  // Cut angle (affected by clearance and material properties)
  const cutAngle = Math.atan(clearanceValue / params.thickness) * (180 / Math.PI);

  // Distortion calculation
  const distortion = (shearingForce / (material.tensileStrength * 1000)) * params.thickness;

  // Recommendations
  const recommendations: string[] = [];
  
  if (params.bladeAngle < 2) {
    recommendations.push('Increase blade angle to reduce shearing force');
  } else if (params.bladeAngle > 6) {
    recommendations.push('Reduce blade angle to improve cut quality');
  }
  
  if (params.clearance < 5) {
    recommendations.push('Increase clearance to reduce blade wear');
  } else if (params.clearance > 15) {
    recommendations.push('Reduce clearance to minimize burr formation');
  }
  
  if (holdDownPressure < 10) {
    recommendations.push('Increase hold-down force to prevent material movement');
  }

  if (recommendations.length === 0) {
    recommendations.push('Shearing parameters are optimized');
  }

  return {
    shearingForce,
    holdDownPressure,
    totalForce,
    shearingEnergy,
    shearingPower,
    bladeWear,
    cutAngle,
    distortion,
    recommendations
  };
}

// Clearance optimization function
export function optimizeClearance(material: string, thickness: number) {
  const mat = CUTTING_MATERIALS[material];
  if (!mat) return null;

  const optimalClearance = thickness * (0.04 + (mat.hardness / 5000));
  const minClearance = optimalClearance * 0.8;
  const maxClearance = optimalClearance * 1.2;

  return {
    optimal: optimalClearance,
    minimum: minClearance,
    maximum: maxClearance,
    percentage: (optimalClearance / thickness) * 100
  };
}