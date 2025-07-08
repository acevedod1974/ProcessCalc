// Constants for ProcessCalc application
// Centralizes all magic numbers and constant values

export const APP_CONSTANTS = {
  // Local Storage Keys
  STORAGE_KEYS: {
    CALCULATIONS: 'processcalc-calculations',
    PROJECTS: 'processcalc-projects',
    USER_PREFERENCES: 'processcalc-preferences',
    THEME: 'processcalc-theme',
    UNIT_SYSTEM: 'processcalc-units',
  },

  // Default Values
  DEFAULTS: {
    MATERIAL_DENSITY: 7850, // kg/m³ for steel
    SAFETY_FACTOR: 2.0,
    EFFICIENCY_FACTOR: 0.85,
    FRICTION_COEFFICIENT: 0.1,
    TEMPERATURE_AMBIENT: 20, // °C
  },

  // UI Constants
  UI: {
    SIDEBAR_WIDTH: 256,
    HEADER_HEIGHT: 64,
    ANIMATION_DURATION: 200,
    DEBOUNCE_DELAY: 300,
  },

  // Calculation Limits
  LIMITS: {
    MAX_FORCE: 1000000, // N
    MIN_TEMPERATURE: -273, // °C
    MAX_TEMPERATURE: 3000, // °C
    MAX_VELOCITY: 1000, // m/s
    MIN_THICKNESS: 0.001, // mm
    MAX_THICKNESS: 1000, // mm
  },

  // Material Property Ranges
  MATERIAL_RANGES: {
    DENSITY: { min: 500, max: 20000 }, // kg/m³
    YIELD_STRENGTH: { min: 10, max: 3000 }, // MPa
    ULTIMATE_STRENGTH: { min: 20, max: 5000 }, // MPa
    YOUNGS_MODULUS: { min: 1, max: 1000 }, // GPa
    POISSON_RATIO: { min: 0.1, max: 0.5 },
  },

  // Process-specific constants
  PROCESSES: {
    ROLLING: {
      MIN_REDUCTION: 0.05, // 5%
      MAX_REDUCTION: 0.9,  // 90%
      TYPICAL_FRICTION: 0.15,
    },
    FORGING: {
      MIN_STRAIN_RATE: 0.1, // s⁻¹
      MAX_STRAIN_RATE: 1000, // s⁻¹
      TYPICAL_EFFICIENCY: 0.75,
    },
    DRAWING: {
      MIN_REDUCTION: 0.1, // 10%
      MAX_REDUCTION: 0.5, // 50%
      TYPICAL_DIE_ANGLE: 15, // degrees
    },
    EXTRUSION: {
      MIN_RATIO: 2,
      MAX_RATIO: 100,
      TYPICAL_TEMPERATURE: 450, // °C for aluminum
    },
  },
} as const;

export const UNIT_CONVERSIONS = {
  LENGTH: {
    MM_TO_M: 0.001,
    M_TO_MM: 1000,
    IN_TO_MM: 25.4,
    MM_TO_IN: 0.0393701,
  },
  FORCE: {
    N_TO_KN: 0.001,
    KN_TO_N: 1000,
    LBF_TO_N: 4.44822,
    N_TO_LBF: 0.224809,
  },
  PRESSURE: {
    PA_TO_MPA: 1e-6,
    MPA_TO_PA: 1e6,
    PSI_TO_MPA: 0.00689476,
    MPA_TO_PSI: 145.038,
  },
  TEMPERATURE: {
    C_TO_K: (c: number) => c + 273.15,
    K_TO_C: (k: number) => k - 273.15,
    C_TO_F: (c: number) => (c * 9/5) + 32,
    F_TO_C: (f: number) => (f - 32) * 5/9,
  },
} as const;

export type UnitConversionKey = keyof typeof UNIT_CONVERSIONS;
export type ProcessKey = keyof typeof APP_CONSTANTS.PROCESSES;