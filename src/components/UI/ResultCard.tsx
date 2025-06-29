import React from "react";
import { useApp } from "../../contexts/AppContext";

interface ResultCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  trend?: "up" | "down" | "neutral";
  precision?: number;
}

export const ResultCard = React.memo(function ResultCard({
  title,
  value,
  unit,
  description,
  trend = "neutral",
  precision = 2,
}: ResultCardProps) {
  const { state } = useApp();
  const isDark = state.theme.mode === "dark";

  const formatValue = (val: string | number): string => {
    if (typeof val === "number") {
      return val.toFixed(precision);
    }
    return val;
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return isDark ? "text-green-400" : "text-green-600";
      case "down":
        return isDark ? "text-red-400" : "text-red-600";
      default:
        return isDark ? "text-blue-400" : "text-blue-600";
    }
  };

  return (
    <div
      className={`p-4 rounded-lg transition-all duration-200 hover:scale-105 ${
        isDark ? "bg-slate-700" : "bg-gray-50"
      }`}
    >
      <div
        className={`text-sm font-medium mb-1 ${
          isDark ? "text-slate-400" : "text-gray-600"
        }`}
      >
        {title}
      </div>
      <div
        className={`text-2xl font-bold ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        <span className={getTrendColor()}>{formatValue(value)}</span>
        {unit && (
          <span
            className={`text-lg ml-1 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            {unit}
          </span>
        )}
      </div>
      {description && (
        <div
          className={`text-xs mt-1 ${
            isDark ? "text-slate-500" : "text-gray-500"
          }`}
        >
          {description}
        </div>
      )}
    </div>
  );
});
