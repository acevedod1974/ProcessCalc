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
  "steel-low-carbon": {
    name: "Steel (Low Carbon)",
    density: 7850,
    yieldStrength: 250,
    ultimateStrength: 400,
    youngsModulus: 200,
    poissonRatio: 0.3,
    thermalConductivity: 50,
    specificHeat: 460,
    flowStressCoefficient: 530,
    strainHardeningExponent: 0.26,
  },
  "steel-medium-carbon": {
    name: "Steel (Medium Carbon)",
    density: 7850,
    yieldStrength: 350,
    ultimateStrength: 550,
    youngsModulus: 200,
    poissonRatio: 0.3,
    thermalConductivity: 48,
    specificHeat: 460,
    flowStressCoefficient: 700,
    strainHardeningExponent: 0.23,
  },
  "aluminum-6061": {
    name: "Aluminum 6061",
    density: 2700,
    yieldStrength: 276,
    ultimateStrength: 310,
    youngsModulus: 69,
    poissonRatio: 0.33,
    thermalConductivity: 167,
    specificHeat: 896,
    flowStressCoefficient: 350,
    strainHardeningExponent: 0.2,
  },
  copper: {
    name: "Copper",
    density: 8960,
    yieldStrength: 70,
    ultimateStrength: 220,
    youngsModulus: 110,
    poissonRatio: 0.34,
    thermalConductivity: 401,
    specificHeat: 385,
    flowStressCoefficient: 315,
    strainHardeningExponent: 0.54,
  },
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

export function calculateRolling(params: RollingParameters): RollingResults {

  const material = MATERIALS[params.material];
  if (!material) {
    throw new Error("Material not found");
  }
  if (
    params.initialThickness <= params.finalThickness ||
    params.initialThickness <= 0 ||
    params.finalThickness <= 0
  ) {
    throw new Error("Initial thickness must be greater than final thickness and both > 0");
  }
  if (params.width <= 0) {
    throw new Error("Width must be greater than 0");
  }
  if (params.rollDiameter <= 0) {
    throw new Error("Roll diameter must be greater than 0");
  }
  if (params.rollingSpeed <= 0) {
    throw new Error("Rolling speed must be greater than 0");
  }
  if (params.frictionCoefficient < 0) {
    throw new Error("Friction coefficient cannot be negative");
  }

  // --- FORMULA AUDIT & UNIT CONSISTENCY ---
  // Reference: Kalpakjian & Schmid, Manufacturing Engineering & Technology, 8th Ed.

  // All input thicknesses, widths, and diameters are assumed to be in mm.
  // All speeds in m/min. All forces in N, stresses in MPa.

  // 1. Reduction (mm)
  const reduction = params.initialThickness - params.finalThickness;
  // 2. Reduction Ratio (%)
  const reductionRatio = (reduction / params.initialThickness) * 100;
  // 3. True Strain (dimensionless)
  const trueStrain = Math.log(params.initialThickness / params.finalThickness);

  // 4. Contact Length (mm)
  // Standard: l = sqrt(R * (h0 - h1)), R in mm, h0/h1 in mm
  const R = params.rollDiameter / 2; // mm
  const contactLength = Math.sqrt(R * reduction); // mm

  // 5. Contact Angle (radians)
  // theta = sqrt((h0 - h1) / R)
  const contactAngle = Math.sqrt(reduction / R); // radians

  // 6. Average Flow Stress (MPa)
  // σ̄ = K * (ε̄)^n, K in MPa, ε̄ dimensionless
  const averageFlowStress =
    material.flowStressCoefficient *
    Math.pow(trueStrain, material.strainHardeningExponent); // MPa

  // 7. Rolling Force (N)
  // F = σ̄ * w * l, w/l in mm, σ̄ in MPa (1 MPa = 1 N/mm²)
  // Convert MPa to N/mm² (1:1), so units are consistent
  const rollingForce = averageFlowStress * params.width * contactLength; // N

  // 8. Power Calculation
  // Roll Circumference (mm)
  const rollCircumference = Math.PI * params.rollDiameter; // mm
  // Convert rollingSpeed from m/min to mm/min for consistency
  const rollingSpeed_mm_min = params.rollingSpeed * 1000; // mm/min
  // Roll RPM = surface speed / circumference
  const rollRPM = rollingSpeed_mm_min / rollCircumference;
  // Roll Angular Velocity (rad/s)
  const rollAngularVelocity = (rollRPM * 2 * Math.PI) / 60; // rad/s
  // Torque (N·mm)
  const torque = rollingForce * contactLength; // N·mm
  // Convert torque to N·m for power calculation
  const torque_Nm = torque / 1000; // N·m
  // Rolling Power (W)
  const rollingPower = torque_Nm * rollAngularVelocity; // W

  // 9. Additional Calculations
  // Separating Force (N)
  const separatingForce = rollingForce * Math.sin(contactAngle); // N
  // Roll Pressure (MPa)
  const rollPressure = rollingForce / (params.width * contactLength); // MPa
  // Exit Velocity (m/min)
  const exitVelocity =
    params.rollingSpeed * (params.initialThickness / params.finalThickness); // m/min
  // Forward Slip (%)
  const forwardSlip =
    ((exitVelocity - params.rollingSpeed) / params.rollingSpeed) * 100;

  // --- END FORMULA AUDIT ---
  // All units are now SI-consistent. See comments for details.

  return {
    reductionRatio,
    trueStrain,
    contactLength,
    averageFlowStress,
    rollingForce,
    rollingPower,
    torque: torque_Nm, // Return torque in N·m for clarity
    separatingForce,
    rollPressure,
    exitVelocity,
    forwardSlip,
  };
}

export interface ForgingParameters {
  material: string;
  initialHeight: number;
  finalHeight: number;
  diameter: number;
  frictionCoefficient: number;
  temperature?: number;
  dieType: "flat" | "grooved";
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

export function calculateForging(params: ForgingParameters): ForgingResults {

  const material = MATERIALS[params.material];
  if (!material) {
    throw new Error("Material not found");
  }
  if (
    params.initialHeight <= params.finalHeight ||
    params.initialHeight <= 0 ||
    params.finalHeight <= 0
  ) {
    throw new Error("Initial height must be greater than final height and both > 0");
  }
  if (params.diameter <= 0) {
    throw new Error("Diameter must be greater than 0");
  }
  if (params.frictionCoefficient < 0) {
    throw new Error("Friction coefficient cannot be negative");
  }

  const reduction = params.initialHeight - params.finalHeight;
  const reductionRatio = (reduction / params.initialHeight) * 100;
  const trueStrain = Math.log(params.initialHeight / params.finalHeight);

  // Flow stress calculation
  const averageFlowStress =
    material.flowStressCoefficient *
    Math.pow(trueStrain, material.strainHardeningExponent);

  // Area calculation
  const area = Math.PI * Math.pow(params.diameter / 2, 2);

  // Friction factor
  const frictionFactor =
    params.dieType === "flat"
      ? 1 +
        (params.frictionCoefficient * params.diameter) /
          (3 * params.finalHeight)
      : 1 +
        (params.frictionCoefficient * params.diameter) /
          (4 * params.finalHeight);

  // Forging force
  const forgingForce = averageFlowStress * area * frictionFactor * 1000; // Convert to N

  // Work and power calculations
  const workDone = (forgingForce * reduction) / 1000; // kJ
  const forgingPower = workDone; // Assuming 1 second operation for simplicity
  const efficiency = 0.85; // Typical forging efficiency

  return {
    reductionRatio,
    trueStrain,
    averageFlowStress,
    forgingForce,
    forgingPower,
    workDone,
    efficiency,
  };
}

// Unit conversion utilities
export function convertLength(value: number, from: string, to: string): number {
  const conversions: Record<string, number> = {
    mm: 1,
    cm: 10,
    m: 1000,
    in: 25.4,
    ft: 304.8,
  };
  if (!(from in conversions) || !(to in conversions)) {
    throw new Error("Invalid length unit");
  }
  return (value * conversions[from]) / conversions[to];
}

export function convertForce(value: number, from: string, to: string): number {
  const conversions: Record<string, number> = {
    N: 1,
    kN: 1000,
    MN: 1000000,
    lbf: 4.448,
    kip: 4448,
  };
  if (!(from in conversions) || !(to in conversions)) {
    throw new Error("Invalid force unit");
  }
  return (value * conversions[from]) / conversions[to];
}

export function convertPower(value: number, from: string, to: string): number {
  const conversions: Record<string, number> = {
    W: 1,
    kW: 1000,
    MW: 1000000,
    hp: 745.7,
  };
  if (!(from in conversions) || !(to in conversions)) {
    throw new Error("Invalid power unit");
  }
  return (value * conversions[from]) / conversions[to];
}
