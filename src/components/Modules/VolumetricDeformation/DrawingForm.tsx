import React from "react";
import { InputField } from "../../UI/InputField";
import { ResultCard } from "../../UI/ResultCard";
import { RecommendationCard } from "../../UI/RecommendationCard";
import {
  WireDrawingParameters,
  WireDrawingResults,
} from "../../../utils/drawingExtrusionCalculations";

interface DrawingFormProps {
  params: Partial<WireDrawingParameters>;
  setParams: (params: Partial<WireDrawingParameters>) => void;
  results: WireDrawingResults | null;
  isCalculating: boolean;
  onCalculate: () => void;
}

export const DrawingForm: React.FC<DrawingFormProps> = ({
  params,
  setParams,
  results,
  isCalculating,
  onCalculate,
}) => {
  return (
    <div>
      {/* Example: Add InputFields for drawing parameters here */}
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
            title="Reduction Ratio"
            value={results.reductionRatio}
            unit="%"
          />
          {/* ...other results... */}
          <RecommendationCard recommendations={results.recommendations} />
        </div>
      )}
    </div>
  );
};
