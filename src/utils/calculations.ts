// Manufacturing Process Calculations Utilities

export interface MaterialProperties {
  name: string;
  density: number; // kg/m³
  yieldStrength: number; // MPa
  ultimateStrength: number; // MPa
  youngsModulus: number; // GPa
  poissonRatio: number;
  thermalConductivity: number; // W/m·K
  specificHeat: number; // J/kg·K
  flowStressCoefficient: number; // K value in σ = K * ε^n
  strainHardeningExponent: number; // n value
}

export const MATERIALS: Record<string, MaterialProperties> = {
  'steel-low-carbon': {
    name: 'Steel (Low Carbon)',
    density: 7850,
    yieldStrength: 250,
    ultimateStrength: 400,
    youngsModulus: 200,
    poissonRatio: 0.3,
    thermalConductivity: 50,
    specificHeat: 460,
    flowStressCoefficient: 530,
    strainHardeningExponent: 0.26
  },
  'steel-medium-carbon': {
    name: 'Steel (Medium Carbon)',
    density: 7850,
    yieldStrength: 350,
    ultimateStrength: 550,
    youngsModulus: 200,
    poissonRatio: 0.3,
    thermalConductivity: 48,
    specificHeat: 460,
    flowStressCoefficient: 700,
    strainHardeningExponent: 0.23
  },
  'aluminum-6061': {
    name: 'Aluminum 6061',
    density: 2700,
    yieldStrength: 276,
    ultimateStrength: 310,
    youngsModulus: 69,
    poissonRatio: 0.33,
    thermalConductivity: 167,
    specificHeat: 896,
    flowStressCoefficient: 350,
    strainHardeningExponent: 0.20
  },
  'copper': {
    name: 'Copper',
    density: 8960,
    yieldStrength: 70,
    ultimateStrength: 220,
    youngsModulus: 110,
    poissonRatio: 0.34,
    thermalConductivity: 401,
    specificHeat: 385,
    flowStressCoefficient: 315,
    strainHardeningExponent: 0.54
  }
};

export interface RollingParameters {
  material: string;
  initialThickness: number;
  finalThickness: number;
  width: number;
  rollDiameter: number;
  rollingSpeed: number;
  frictionCoefficient: number;
  temperature?: number;
}

export interface RollingResults {
  reductionRatio: number;
  trueStrain: number;
  contactLength: number;
  averageFlowStress: number;
  rollingForce: number;
  rollingPower: number;
  torque: number;
  separatingForce: number;
  rollPressure: number;
  exitVelocity: number;
  forwardSlip: number;
}

/**
 * Calculate rolling process parameters using correct metallurgical formulas
 * @param params - Rolling parameters including dimensions, material, and process conditions
 * @returns Complete rolling analysis results including forces, power, and geometric parameters
 */
export function calculateRolling(params: RollingParameters): RollingResults {
  const material = MATERIALS[params.material];
  if (!material) {
    throw new Error('Material not found');
  }

  // Basic calculations
  const reduction = params.initialThickness - params.finalThickness;
  const reductionRatio = (reduction / params.initialThickness) * 100;
  const trueStrain = Math.log(params.initialThickness / params.finalThickness);
  
  // Contact geometry - corrected formulas
  // Contact length: L = √(R * Δh) where R is roll radius, Δh is thickness reduction
  const rollRadius = params.rollDiameter / 2; // mm
  const contactLength = Math.sqrt(rollRadius * reduction); // mm
  // Contact angle: α = √(Δh / R) in radians
  const contactAngle = Math.sqrt(reduction / rollRadius); // radians
  
  // Flow stress calculation using power law: σ = K * ε^n
  const averageFlowStress = material.flowStressCoefficient * Math.pow(trueStrain, material.strainHardeningExponent);
  
  // Rolling force calculation (Hitchcock's formula): F = σ * w * L
  const rollingForce = averageFlowStress * params.width * contactLength * 1000; // Convert to N
  
  // Power calculation
  const rollCircumference = Math.PI * params.rollDiameter / 1000; // Convert to m
  const rollRPM = params.rollingSpeed / rollCircumference;
  const rollAngularVelocity = (rollRPM * 2 * Math.PI) / 60;
  const torque = rollingForce * contactLength / 2000; // Nm
  const rollingPower = torque * rollAngularVelocity / 1000; // kW
  
  // Additional calculations
  const separatingForce = rollingForce * Math.sin(contactAngle);
  const rollPressure = rollingForce / (params.width * contactLength); // MPa
  const exitVelocity = params.rollingSpeed * (params.initialThickness / params.finalThickness);
  const forwardSlip = ((exitVelocity - params.rollingSpeed) / params.rollingSpeed) * 100;

  return {
    reductionRatio,
    trueStrain,
    contactLength,
    averageFlowStress,
    rollingForce,
    rollingPower,
    torque,
    separatingForce,
    rollPressure,
    exitVelocity,
    forwardSlip
  };
}

export interface ForgingParameters {
  material: string;
  initialHeight: number;
  finalHeight: number;
  diameter: number;
  frictionCoefficient: number;
  temperature?: number;
  dieType: 'flat' | 'grooved';
}

export interface ForgingResults {
  reductionRatio: number;
  trueStrain: number;
  averageFlowStress: number;
  forgingForce: number;
  forgingPower: number;
  workDone: number;
  efficiency: number;
}

/**
 * Calculate forging process parameters using established metallurgical principles
 * @param params - Forging parameters including geometry, material, and process conditions
 * @returns Forging analysis results including forces, work done, and efficiency
 */
export function calculateForging(params: ForgingParameters): ForgingResults {
  const material = MATERIALS[params.material];
  if (!material) {
    throw new Error('Material not found');
  }

  const reduction = params.initialHeight - params.finalHeight;
  const reductionRatio = (reduction / params.initialHeight) * 100;
  const trueStrain = Math.log(params.initialHeight / params.finalHeight);
  
  // Flow stress calculation
  const averageFlowStress = material.flowStressCoefficient * Math.pow(trueStrain, material.strainHardeningExponent);
  
  // Area calculation
  const area = Math.PI * Math.pow(params.diameter / 2, 2);
  
  // Friction factor
  const frictionFactor = params.dieType === 'flat' ? 
    1 + (params.frictionCoefficient * params.diameter) / (3 * params.finalHeight) :
    1 + (params.frictionCoefficient * params.diameter) / (4 * params.finalHeight);
  
  // Forging force
  const forgingForce = averageFlowStress * area * frictionFactor * 1000; // Convert to N
  
  // Work and power calculations
  const workDone = forgingForce * reduction / 1000; // kJ
  const forgingPower = workDone; // Assuming 1 second operation for simplicity
  const efficiency = 0.85; // Typical forging efficiency

  return {
    reductionRatio,
    trueStrain,
    averageFlowStress,
    forgingForce,
    forgingPower,
    workDone,
    efficiency
  };
}

// Unit conversion utilities
export function convertLength(value: number, from: string, to: string): number {
  const conversions: Record<string, number> = {
    'mm': 1,
    'cm': 10,
    'm': 1000,
    'in': 25.4,
    'ft': 304.8
  };
  
  return (value * conversions[from]) / conversions[to];
}

export function convertForce(value: number, from: string, to: string): number {
  const conversions: Record<string, number> = {
    'N': 1,
    'kN': 1000,
    'MN': 1000000,
    'lbf': 4.448,
    'kip': 4448
  };
  
  return (value * conversions[from]) / conversions[to];
}

export function convertPower(value: number, from: string, to: string): number {
  const conversions: Record<string, number> = {
    'W': 1,
    'kW': 1000,
    'MW': 1000000,
    'hp': 745.7
  };
  
  return (value * conversions[from]) / conversions[to];
}