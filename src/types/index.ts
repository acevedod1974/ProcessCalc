export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'professional';
}

export interface Material {
  id: string;
  name: string;
  density: number;
  yieldStrength: number;
  ultimateStrength: number;
  youngsModulus: number;
  poissonRatio: number;
  thermalConductivity: number;
  specificHeat: number;
}

// Process-specific parameter interfaces
export interface RollingParameters {
  initialThickness: number;
  finalThickness: number;
  width: number;
  speed: number;
  materialId: string;
  frictionCoefficient: number;
  temperature?: number;
}

export interface ForgingParameters {
  initialHeight: number;
  finalHeight: number;
  diameter: number;
  strainRate: number;
  materialId: string;
  temperature: number;
  efficiency?: number;
}

export interface DrawingParameters {
  initialDiameter: number;
  finalDiameter: number;
  length: number;
  dieAngle: number;
  materialId: string;
  speed: number;
  lubrication?: boolean;
}

export interface ExtrusionParameters {
  billetDiameter: number;
  productDiameter: number;
  extrusionRatio: number;
  temperature: number;
  materialId: string;
  speed: number;
  dieDesign?: string;
}

// Process-specific result interfaces
export interface RollingResults {
  force: number;
  torque: number;
  power: number;
  reduction: number;
  stress: number;
  strain: number;
  efficiency: number;
}

export interface ForgingResults {
  force: number;
  stress: number;
  strain: number;
  energy: number;
  power: number;
  efficiency: number;
}

export interface DrawingResults {
  force: number;
  stress: number;
  strain: number;
  power: number;
  reduction: number;
  efficiency: number;
}

export interface ExtrusionResults {
  force: number;
  pressure: number;
  stress: number;
  strain: number;
  power: number;
  efficiency: number;
}

export type CalculationParameters = 
  | RollingParameters 
  | ForgingParameters 
  | DrawingParameters 
  | ExtrusionParameters;

export type CalculationResults = 
  | RollingResults 
  | ForgingResults 
  | DrawingResults 
  | ExtrusionResults;

export interface Calculation {
  id: string;
  type: 'volumetric' | 'cutting' | 'machining';
  process: 'rolling' | 'forging' | 'drawing' | 'extrusion' | 'cutting' | 'machining';
  name: string;
  parameters: CalculationParameters;
  results: CalculationResults;
  timestamp: Date;
  userId: string;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  calculations: Calculation[];
  createdAt: string;
  lastModified: string;
  userId?: string;
  tags?: string[];
}

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
}

export interface UnitSystem {
  type: 'metric' | 'imperial';
  length: string;
  force: string;
  pressure: string;
  temperature: string;
  power: string;
}