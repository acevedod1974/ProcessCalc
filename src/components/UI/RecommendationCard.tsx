import React from "react";
import { useApp } from "../../contexts/AppContext";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface RecommendationCardProps {
  recommendations: string[];
  type?: "info" | "warning" | "success";
}

export const RecommendationCard = React.memo(function RecommendationCard({
  recommendations,
  type = "info",
}: RecommendationCardProps) {
  const { state } = useApp();
  const isDark = state.theme.mode === "dark";

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={20} />;
      case "success":
        return <CheckCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "warning":
        return {
          bg: isDark ? "bg-yellow-900/30" : "bg-yellow-50",
          border: isDark ? "border-yellow-700" : "border-yellow-200",
          icon: isDark ? "text-yellow-400" : "text-yellow-600",
          text: isDark ? "text-yellow-200" : "text-yellow-800",
        };
      case "success":
        return {
          bg: isDark ? "bg-green-900/30" : "bg-green-50",
          border: isDark ? "border-green-700" : "border-green-200",
          icon: isDark ? "text-green-400" : "text-green-600",
          text: isDark ? "text-green-200" : "text-green-800",
        };
      default:
        return {
          bg: isDark ? "bg-blue-900/30" : "bg-blue-50",
          border: isDark ? "border-blue-700" : "border-blue-200",
          icon: isDark ? "text-blue-400" : "text-blue-600",
          text: isDark ? "text-blue-200" : "text-blue-800",
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-lg p-4`}
      role="region"
      aria-label="recommendations"
      tabIndex={0}
    >
      <div className="flex items-start space-x-3">
        <div className={colors.icon} aria-hidden="true">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4
            className={`font-medium mb-2 ${colors.text}`}
            id="recommendations-heading"
          >
            Recommendations
          </h4>
          <ul
            className={`space-y-1 text-sm ${colors.text}`}
            aria-labelledby="recommendations-heading"
          >
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-xs mt-1" aria-hidden="true">
                  •
                </span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});
