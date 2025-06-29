import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Settings, 
  Menu, 
  Sun, 
  Moon, 
  Calculator,
  User,
  HelpCircle
} from 'lucide-react';

export function Header() {
  const { state, dispatch } = useApp();

  const toggleTheme = () => {
    const newTheme = {
      ...state.theme,
      mode: state.theme.mode === 'light' ? 'dark' : 'light',
      colors: state.theme.mode === 'light' 
        ? {
            primary: '#3B82F6',
            secondary: '#94A3B8',
            accent: '#F97316',
            background: '#0F172A',
            surface: '#1E293B',
            text: '#F1F5F9',
          }
        : {
            primary: '#2563EB',
            secondary: '#64748B',
            accent: '#EA580C',
            background: '#F8FAFC',
            surface: '#FFFFFF',
            text: '#1E293B',
          }
    };
    dispatch({ type: 'SET_THEME', payload: newTheme });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const isDark = state.theme.mode === 'dark';

  return (
    <header className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b transition-colors duration-200`}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-slate-700 text-slate-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
              <Calculator className={`${isDark ? 'text-blue-300' : 'text-blue-600'}`} size={24} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ProcessCalc
              </h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                Manufacturing Process Calculations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isDark 
              ? 'bg-slate-700 text-slate-300' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {state.unitSystem.type === 'metric' ? 'Metric' : 'Imperial'}
          </div>
          
          <button
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-slate-700 text-slate-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <HelpCircle size={20} />
          </button>
          
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-slate-700 text-slate-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-slate-700 text-slate-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Settings size={20} />
          </button>
          
          <button
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-slate-700 text-slate-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}