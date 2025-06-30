import React from "react";
import { InputField } from "../../UI/InputField";
import { ResultCard } from "../../UI/ResultCard";
import { RecommendationCard } from "../../UI/RecommendationCard";
import { RollingParameters, RollingResults } from "../../../utils/calculations";

interface RollingFormProps {
  params: Partial<RollingParameters>;
  setParams: (params: Partial<RollingParameters>) => void;
  results: RollingResults | null;
  isCalculating: boolean;
  onCalculate: () => void;
}

export const RollingForm: React.FC<RollingFormProps> = ({
  params,
  setParams,
  results,
  isCalculating,
  onCalculate,
}) => {
  return (
    <div>
      {/* Example: Add InputFields for rolling parameters here */}
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
