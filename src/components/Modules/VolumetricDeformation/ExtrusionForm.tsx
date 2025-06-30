import React from "react";
import { InputField } from "../../UI/InputField";
import { ResultCard } from "../../UI/ResultCard";
import { RecommendationCard } from "../../UI/RecommendationCard";
import {
  ExtrusionParameters,
  ExtrusionResults,
} from "../../../utils/drawingExtrusionCalculations";

interface ExtrusionFormProps {
  params: Partial<ExtrusionParameters>;
  setParams: (params: Partial<ExtrusionParameters>) => void;
  results: ExtrusionResults | null;
  isCalculating: boolean;
  onCalculate: () => void;
}

export const ExtrusionForm: React.FC<ExtrusionFormProps> = ({
  params,
  setParams,
  results,
  isCalculating,
  onCalculate,
}) => {
  return (
    <div>
      {/* Example: Add InputFields for extrusion parameters here */}
      <InputField
        label="Material"
        value={params.material || ""}
        onChange={(v) => setParams({ ...params, material: v })}
        required
      />
      {/* ...other fields... */}
      <button
        onClick={onCalculate}
        disabled={isCalculating}
        className="mt-4 px-4 py-2 rounded bg-blue-600 text-white"
      >
        Calculate
      </button>
      {results && (
        <div className="mt-6">
          <ResultCard
            title="Extrusion Ratio"
            value={results.extrusionRatio}
            unit=""
          />
          {/* ...other results... */}
          <RecommendationCard recommendations={results.recommendations} />
        </div>
      )}
    </div>
  );
};
