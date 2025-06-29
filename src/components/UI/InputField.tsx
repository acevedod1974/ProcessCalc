import React from 'react';
import { useApp } from '../../contexts/AppContext';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
  unit?: string;
  error?: string;
  required?: boolean;
  step?: string;
  min?: string;
  max?: string;
}

export const InputField = React.memo(function InputField({
  label,
  value,
  onChange,
  type = 'text',
  options = [],
  placeholder,
  unit,
  error,
  required = false,
  step,
  min,
  max
}: InputFieldProps) {
  const { state } = useApp();
  const isDark = state.theme.mode === 'dark';

  const baseInputClasses = `w-full px-3 py-2 rounded-lg border transition-all duration-200 ${
    error
      ? isDark
        ? 'border-red-500 bg-red-900/20 text-red-300'
        : 'border-red-500 bg-red-50 text-red-700'
      : isDark
        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
  }`;

  return (
    <div className="space-y-1">
      <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {unit && <span className={`ml-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>({unit})</span>}
      </label>
      
      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClasses}
        >
          <option value="">{placeholder || 'Select...'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseInputClasses}
          step={step}
          min={min}
          max={max}
        />
      )}
      
      {error && (
        <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </p>
      )}
    </div>
  );
});