import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Theme, UnitSystem, User, Calculation, Project } from '../types';
import { APP_CONSTANTS } from '../constants';

interface AppState {
  user: User | null;
  theme: Theme;
  unitSystem: UnitSystem;
  calculations: Calculation[];
  projects: Project[];
  activeTab: string;
  sidebarOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_UNIT_SYSTEM'; payload: UnitSystem }
  | { type: 'ADD_CALCULATION'; payload: Calculation }
  | { type: 'UPDATE_CALCULATION'; payload: { id: string; updates: Partial<Calculation> } }
  | { type: 'DELETE_CALCULATION'; payload: string }
  | { type: 'SET_CALCULATIONS'; payload: Calculation[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<AppState> };

const initialState: AppState = {
  user: null,
  theme: {
    mode: 'light',
    colors: {
      primary: '#2563EB',
      secondary: '#64748B',
      accent: '#EA580C',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#1E293B',
    },
  },
  unitSystem: {
    type: 'metric',
    length: 'mm',
    force: 'N',
    pressure: 'MPa',
    temperature: '°C',
    power: 'kW',
  },
  calculations: [],
  projects: [],
  activeTab: 'volumetric',
  sidebarOpen: false,
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_UNIT_SYSTEM':
      return { ...state, unitSystem: action.payload };
    case 'ADD_CALCULATION':
      return { ...state, calculations: [...state.calculations, action.payload] };
    case 'UPDATE_CALCULATION':
      return {
        ...state,
        calculations: state.calculations.map(calc =>
          calc.id === action.payload.id ? { ...calc, ...action.payload.updates } : calc
        ),
      };
    case 'DELETE_CALCULATION':
      return {
        ...state,
        calculations: state.calculations.filter(calc => calc.id !== action.payload),
      };
    case 'SET_CALCULATIONS':
      return { ...state, calculations: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? { ...project, ...action.payload.updates } : project
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
      };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Utility functions for localStorage persistence
function loadFromLocalStorage(): Partial<AppState> {
  try {
    const calculations = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.CALCULATIONS);
    const projects = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.PROJECTS);
    const theme = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.THEME);
    const unitSystem = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.UNIT_SYSTEM);

    return {
      calculations: calculations ? JSON.parse(calculations) : [],
      projects: projects ? JSON.parse(projects) : [],
      theme: theme ? JSON.parse(theme) : undefined,
      unitSystem: unitSystem ? JSON.parse(unitSystem) : undefined,
    };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {};
  }
}

function saveToLocalStorage(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (Object.keys(savedData).length > 0) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: savedData });
    }
  }, []);

  // Save to localStorage when specific state changes
  useEffect(() => {
    if (state.calculations.length > 0) {
      saveToLocalStorage(APP_CONSTANTS.STORAGE_KEYS.CALCULATIONS, state.calculations);
    }
  }, [state.calculations]);

  useEffect(() => {
    if (state.projects.length > 0) {
      saveToLocalStorage(APP_CONSTANTS.STORAGE_KEYS.PROJECTS, state.projects);
    }
  }, [state.projects]);

  useEffect(() => {
    saveToLocalStorage(APP_CONSTANTS.STORAGE_KEYS.THEME, state.theme);
  }, [state.theme]);

  useEffect(() => {
    saveToLocalStorage(APP_CONSTANTS.STORAGE_KEYS.UNIT_SYSTEM, state.unitSystem);
  }, [state.unitSystem]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}