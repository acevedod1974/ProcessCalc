import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { InputField } from '../UI/InputField';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Globe, 
  Download, 
  Upload,
  Save,
  RotateCcw,
  Monitor,
  Sun,
  Moon
} from 'lucide-react';

export function Settings() {
  const { state, dispatch } = useApp();
  const isDark = state.theme.mode === 'dark';

  const [tempSettings, setTempSettings] = useState({
    theme: state.theme.mode,
    unitSystem: state.unitSystem.type,
    language: 'en',
    autoSave: true,
    notifications: true,
    precision: 2,
    exportFormat: 'json'
  });

  const unitSystemOptions = [
    { value: 'metric', label: 'Metric (SI)' },
    { value: 'imperial', label: 'Imperial (US)' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light Mode', icon: Sun },
    { value: 'dark', label: 'Dark Mode', icon: Moon },
    { value: 'auto', label: 'System Default', icon: Monitor }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' }
  ];

  const exportFormatOptions = [
    { value: 'json', label: 'JSON' },
    { value: 'csv', label: 'CSV' },
    { value: 'xlsx', label: 'Excel' },
    { value: 'pdf', label: 'PDF Report' }
  ];

  const handleThemeChange = (newTheme: string) => {
    const themeConfig = {
      mode: newTheme as 'light' | 'dark',
      colors: newTheme === 'dark' 
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
    
    dispatch({ type: 'SET_THEME', payload: themeConfig });
    setTempSettings(prev => ({ ...prev, theme: newTheme }));
  };

  const handleUnitSystemChange = (newSystem: string) => {
    const unitConfig = {
      type: newSystem as 'metric' | 'imperial',
      length: newSystem === 'metric' ? 'mm' : 'in',
      force: newSystem === 'metric' ? 'N' : 'lbf',
      pressure: newSystem === 'metric' ? 'MPa' : 'psi',
      temperature: newSystem === 'metric' ? '°C' : '°F',
      power: newSystem === 'metric' ? 'kW' : 'hp',
    };
    
    dispatch({ type: 'SET_UNIT_SYSTEM', payload: unitConfig });
    setTempSettings(prev => ({ ...prev, unitSystem: newSystem }));
  };

  const exportSettings = () => {
    const settingsData = {
      theme: state.theme,
      unitSystem: state.unitSystem,
      userPreferences: tempSettings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processcalc-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetSettings = () => {
    // Reset to default theme
    handleThemeChange('light');
    handleUnitSystemChange('metric');
    setTempSettings({
      theme: 'light',
      unitSystem: 'metric',
      language: 'en',
      autoSave: true,
      notifications: true,
      precision: 2,
      exportFormat: 'json'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <SettingsIcon className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`} size={24} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Settings & Preferences
            </h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Customize your ProcessCalc experience
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={exportSettings}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              isDark 
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          <button 
            onClick={resetSettings}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              isDark 
                ? 'bg-red-900 hover:bg-red-800 text-red-300' 
                : 'bg-red-100 hover:bg-red-200 text-red-700'
            }`}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Theme Settings */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center space-x-2 mb-4">
          <Palette className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Appearance
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                      tempSettings.theme === option.value
                        ? isDark
                          ? 'border-blue-500 bg-blue-900 text-blue-300'
                          : 'border-blue-500 bg-blue-50 text-blue-700'
                        : isDark
                          ? 'border-slate-600 hover:border-slate-500 text-slate-300'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Units & Localization */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center space-x-2 mb-4">
          <Globe className={`${isDark ? 'text-green-400' : 'text-green-600'}`} size={20} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Units & Localization
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Unit System"
            value={tempSettings.unitSystem}
            onChange={handleUnitSystemChange}
            type="select"
            options={unitSystemOptions}
          />
          
          <InputField
            label="Language"
            value={tempSettings.language}
            onChange={(value) => setTempSettings(prev => ({ ...prev, language: value }))}
            type="select"
            options={languageOptions}
          />
        </div>
        
        <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
          <h4 className={`font-medium mb-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
            Current Unit System: {state.unitSystem.type === 'metric' ? 'Metric (SI)' : 'Imperial (US)'}
          </h4>
          <div className={`text-sm grid grid-cols-2 md:grid-cols-5 gap-2 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
            <div>Length: {state.unitSystem.length}</div>
            <div>Force: {state.unitSystem.force}</div>
            <div>Pressure: {state.unitSystem.pressure}</div>
            <div>Temperature: {state.unitSystem.temperature}</div>
            <div>Power: {state.unitSystem.power}</div>
          </div>
        </div>
      </div>

      {/* Application Preferences */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center space-x-2 mb-4">
          <SettingsIcon className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`} size={20} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Application Preferences
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Decimal Precision"
              value={tempSettings.precision.toString()}
              onChange={(value) => setTempSettings(prev => ({ ...prev, precision: Number(value) }))}
              type="number"
              min="0"
              max="6"
              step="1"
            />
            
            <InputField
              label="Default Export Format"
              value={tempSettings.exportFormat}
              onChange={(value) => setTempSettings(prev => ({ ...prev, exportFormat: value }))}
              type="select"
              options={exportFormatOptions}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoSave"
                checked={tempSettings.autoSave}
                onChange={(e) => setTempSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="autoSave" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Auto-save calculations
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="notifications"
                checked={tempSettings.notifications}
                onChange={(e) => setTempSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="notifications" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Show calculation notifications
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center space-x-2 mb-4">
          <Save className={`${isDark ? 'text-orange-400' : 'text-orange-600'}`} size={20} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Data Management
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
            isDark
              ? 'border-slate-600 hover:border-slate-500 text-slate-300'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}>
            <Download className="mx-auto mb-2" size={24} />
            <div className="font-medium">Export Data</div>
            <div className="text-sm mt-1 opacity-75">Download all calculations</div>
          </button>
          
          <button className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
            isDark
              ? 'border-slate-600 hover:border-slate-500 text-slate-300'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}>
            <Upload className="mx-auto mb-2" size={24} />
            <div className="font-medium">Import Data</div>
            <div className="text-sm mt-1 opacity-75">Restore from backup</div>
          </button>
          
          <button className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
            isDark
              ? 'border-red-600 hover:border-red-500 text-red-300'
              : 'border-red-200 hover:border-red-300 text-red-700'
          }`}>
            <RotateCcw className="mx-auto mb-2" size={24} />
            <div className="font-medium">Clear Data</div>
            <div className="text-sm mt-1 opacity-75">Reset all calculations</div>
          </button>
        </div>
      </div>

      {/* About */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          About ProcessCalc
        </h3>
        
        <div className={`text-sm space-y-2 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Build:</strong> 2024.01.15</p>
          <p><strong>License:</strong> Educational Use</p>
          <p><strong>Developer:</strong> Manufacturing Engineering Team</p>
          <p className="pt-2">
            ProcessCalc is a comprehensive manufacturing process calculation platform designed for 
            students, educators, and professionals in mechanical and manufacturing engineering.
          </p>
        </div>
      </div>
    </div>
  );
}