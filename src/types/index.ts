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

export interface Calculation {
  id: string;
  type: 'volumetric' | 'cutting' | 'machining';
  name: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  timestamp: Date;
  userId: string;
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