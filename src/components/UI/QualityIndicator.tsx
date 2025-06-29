import React from 'react';
import { useApp } from '../../contexts/AppContext';

interface QualityIndicatorProps {
  quality: string;
  value?: number;
  maxValue?: number;
}

export const QualityIndicator = React.memo(function QualityIndicator({ quality, value, maxValue = 100 }: QualityIndicatorProps) {
  const { state } = useApp();
  const isDark = state.theme.mode === 'dark';

  const getQualityColor = (qual: string) => {
    switch (qual.toLowerCase()) {
      case 'excellent':
        return {
          bg: isDark ? 'bg-green-900' : 'bg-green-100',
          text: isDark ? 'text-green-300' : 'text-green-800',
          bar: 'bg-green-500',
          percentage: 95
        };
      case 'good':
        return {
          bg: isDark ? 'bg-blue-900' : 'bg-blue-100',
          text: isDark ? 'text-blue-300' : 'text-blue-800',
          bar: 'bg-blue-500',
          percentage: 80
        };
      case 'fair':
        return {
          bg: isDark ? 'bg-yellow-900' : 'bg-yellow-100',
          text: isDark ? 'text-yellow-300' : 'text-yellow-800',
          bar: 'bg-yellow-500',
          percentage: 60
        };
      case 'poor':
        return {
          bg: isDark ? 'bg-red-900' : 'bg-red-100',
          text: isDark ? 'text-red-300' : 'text-red-800',
          bar: 'bg-red-500',
          percentage: 30
        };
      default:
        return {
          bg: isDark ? 'bg-gray-900' : 'bg-gray-100',
          text: isDark ? 'text-gray-300' : 'text-gray-800',
          bar: 'bg-gray-500',
          percentage: 50
        };
    }
  };

  const colors = getQualityColor(quality);
  const percentage = value ? (value / maxValue) * 100 : colors.percentage;

  return (
    <div className={`${colors.bg} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-medium ${colors.text}`}>Cut Quality</span>
        <span className={`text-sm font-bold ${colors.text}`}>{quality}</span>
      </div>
      <div className={`w-full bg-gray-300 rounded-full h-2 ${isDark ? 'bg-gray-700' : ''}`}>
        <div
          className={`${colors.bar} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {value && (
        <div className={`text-xs mt-1 ${colors.text}`}>
          {value.toFixed(1)} / {maxValue}
        </div>
      )}
    </div>
  );
});