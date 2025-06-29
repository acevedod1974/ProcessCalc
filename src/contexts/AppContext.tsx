import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Theme, UnitSystem, User, Calculation } from '../types';

interface AppState {
  user: User | null;
  theme: Theme;
  unitSystem: UnitSystem;
  calculations: Calculation[];
  activeTab: string;
  sidebarOpen: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_UNIT_SYSTEM'; payload: UnitSystem }
  | { type: 'ADD_CALCULATION'; payload: Calculation }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean };

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
  activeTab: 'volumetric',
  sidebarOpen: false,
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
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}