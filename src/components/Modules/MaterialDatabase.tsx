import React, { useState, useMemo } from "react";
import { useApp } from "../../contexts/AppContext";
import { InputField } from "../UI/InputField";
import { ResultCard } from "../UI/ResultCard";
import {
  Database,
  Search,
  Plus,
  Download,
  BookOpen,
  Eye,
  Edit,
} from "lucide-react";
import { MATERIALS } from "../../utils/calculations";
import { CUTTING_MATERIALS } from "../../utils/cuttingCalculations";
import { MACHINING_MATERIALS } from "../../utils/machiningCalculations";

// Define a specific type for material properties
interface MaterialProperties {
  name: string;
  density?: number;
  yieldStrength?: number;
  ultimateStrength?: number;
  tensileStrength?: number;
  shearStrength?: number;
  hardness?: number;
  youngsModulus?: number;
  poissonRatio?: number;
  flowStressCoefficient?: number;
  strainHardeningExponent?: number;
  workHardeningExponent?: number;
  thermalConductivity?: number;
  specificHeat?: number;
  machinabilityRating?: number;
  frictionCoefficient?: number;
  recommendedSpeed?: {
    hss?: number;
    carbide?: number;
    ceramic?: number;
    diamond?: number;
  };
  // ...add more as needed
}

interface MaterialEntry {
  id: string;
  name: string;
  category: "forming" | "cutting" | "machining";
  properties: MaterialProperties;
}

export function MaterialDatabase() {
  const { state } = useApp();
  const isDark = state.theme.mode === "dark";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialEntry | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Combine all materials into a unified database using useMemo for performance
  const materials = useMemo(() => {
    const combinedMaterials: MaterialEntry[] = [];

    // Add forming materials
    Object.entries(MATERIALS).forEach(([key, material]) => {
      combinedMaterials.push({
        id: `forming-${key}`,
        name: material.name,
        category: "forming",
        properties: material,
      });
    });

    // Add cutting materials
    Object.entries(CUTTING_MATERIALS).forEach(([key, material]) => {
      combinedMaterials.push({
        id: `cutting-${key}`,
        name: material.name,
        category: "cutting",
        properties: material,
      });
    });

    // Add machining materials
    Object.entries(MACHINING_MATERIALS).forEach(([key, material]) => {
      combinedMaterials.push({
        id: `machining-${key}`,
        name: material.name,
        category: "machining",
        properties: material,
      });
    });

    return combinedMaterials;
  }, []);

  // Memoize filtered materials
  const filteredMaterials = useMemo(
    () =>
      materials.filter((material) => {
        const matchesSearch = material.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || material.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [materials, searchTerm, selectedCategory]
  );

  // Memoize statistics
  const stats = useMemo(
    () => ({
      total: materials.length,
      forming: materials.filter((m) => m.category === "forming").length,
      cutting: materials.filter((m) => m.category === "cutting").length,
      machining: materials.filter((m) => m.category === "machining").length,
    }),
    [materials]
  );

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "forming", label: "Forming Materials" },
    { value: "cutting", label: "Cutting Materials" },
    { value: "machining", label: "Machining Materials" },
  ];

  const renderMaterialProperties = (material: MaterialEntry) => {
    const props = material.properties;

    return (
      <div className="space-y-6">
        {/* Basic Properties */}
        <div>
          <h4
            className={`font-semibold mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Basic Properties
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {props.density && (
              <ResultCard
                title="Density"
                value={props.density}
                unit="kg/m³"
                description="Material density"
                trend="neutral"
              />
            )}
            {props.yieldStrength && (
              <ResultCard
                title="Yield Strength"
                value={props.yieldStrength}
                unit="MPa"
                description="Yield strength"
                trend="up"
              />
            )}
            {props.ultimateStrength && (
              <ResultCard
                title="Ultimate Strength"
                value={props.ultimateStrength}
                unit="MPa"
                description="Ultimate tensile strength"
                trend="up"
              />
            )}
            {props.tensileStrength && (
              <ResultCard
                title="Tensile Strength"
                value={props.tensileStrength}
                unit="MPa"
                description="Tensile strength"
                trend="up"
              />
            )}
            {props.shearStrength && (
              <ResultCard
                title="Shear Strength"
                value={props.shearStrength}
                unit="MPa"
                description="Shear strength"
                trend="up"
              />
            )}
            {props.hardness && (
              <ResultCard
                title="Hardness"
                value={props.hardness}
                unit="HB"
                description="Brinell hardness"
                trend="up"
              />
            )}
          </div>
        </div>

        {/* Mechanical Properties */}
        {(props.youngsModulus || props.poissonRatio) && (
          <div>
            <h4
              className={`font-semibold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Mechanical Properties
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {props.youngsModulus && (
                <ResultCard
                  title="Young's Modulus"
                  value={props.youngsModulus}
                  unit="GPa"
                  description="Elastic modulus"
                  trend="up"
                />
              )}
              {props.poissonRatio && (
                <ResultCard
                  title="Poisson's Ratio"
                  value={props.poissonRatio}
                  description="Poisson's ratio"
                  trend="neutral"
                />
              )}
              {props.flowStressCoefficient && (
                <ResultCard
                  title="Flow Stress Coefficient"
                  value={props.flowStressCoefficient}
                  unit="MPa"
                  description="K value in σ = Kε^n"
                  trend="up"
                />
              )}
              {props.strainHardeningExponent && (
                <ResultCard
                  title="Strain Hardening Exponent"
                  value={props.strainHardeningExponent}
                  description="n value in σ = Kε^n"
                  trend="neutral"
                />
              )}
              {props.workHardeningExponent && (
                <ResultCard
                  title="Work Hardening Exponent"
                  value={props.workHardeningExponent}
                  description="Work hardening exponent"
                  trend="neutral"
                />
              )}
            </div>
          </div>
        )}

        {/* Thermal Properties */}
        {(props.thermalConductivity || props.specificHeat) && (
          <div>
            <h4
              className={`font-semibold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Thermal Properties
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {props.thermalConductivity && (
                <ResultCard
                  title="Thermal Conductivity"
                  value={props.thermalConductivity}
                  unit="W/m·K"
                  description="Heat conduction ability"
                  trend="up"
                />
              )}
              {props.specificHeat && (
                <ResultCard
                  title="Specific Heat"
                  value={props.specificHeat}
                  unit="J/kg·K"
                  description="Heat capacity"
                  trend="neutral"
                />
              )}
            </div>
          </div>
        )}

        {/* Machining Properties */}
        {(props.machinabilityRating || props.recommendedSpeed) && (
          <div>
            <h4
              className={`font-semibold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Machining Properties
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {props.machinabilityRating && (
                <ResultCard
                  title="Machinability Rating"
                  value={props.machinabilityRating}
                  unit="%"
                  description="Relative machinability"
                  trend="up"
                />
              )}
              {props.frictionCoefficient && (
                <ResultCard
                  title="Friction Coefficient"
                  value={props.frictionCoefficient}
                  description="Friction coefficient"
                  trend="neutral"
                />
              )}
            </div>

            {props.recommendedSpeed && (
              <div className="mt-4">
                <h5
                  className={`font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Recommended Cutting Speeds
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ResultCard
                    title="HSS"
                    value={props.recommendedSpeed.hss}
                    unit="m/min"
                    description="High Speed Steel"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Carbide"
                    value={props.recommendedSpeed.carbide}
                    unit="m/min"
                    description="Carbide tools"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Ceramic"
                    value={props.recommendedSpeed.ceramic}
                    unit="m/min"
                    description="Ceramic tools"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Diamond"
                    value={props.recommendedSpeed.diamond}
                    unit="m/min"
                    description="Diamond tools"
                    trend="neutral"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`p-3 rounded-lg ${
              isDark ? "bg-purple-900" : "bg-purple-100"
            }`}
          >
            <Database
              className={`${isDark ? "text-purple-300" : "text-purple-600"}`}
              size={24}
            />
          </div>
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Material Database
            </h1>
            <p className={`${isDark ? "text-slate-400" : "text-gray-600"}`}>
              Comprehensive Material Properties and Flow Stress Data
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              isDark
                ? "bg-purple-900 hover:bg-purple-800 text-purple-300"
                : "bg-purple-100 hover:bg-purple-200 text-purple-700"
            }`}
          >
            <Plus size={16} />
            <span>Add Material</span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              isDark
                ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div
        className={`${
          isDark ? "bg-slate-800" : "bg-white"
        } rounded-xl shadow-lg p-6`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? "text-slate-400" : "text-gray-400"
                }`}
                size={20}
              />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white focus:border-purple-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-purple-500"
                }`}
              />
            </div>
          </div>
          <div className="md:w-64">
            <InputField
              label=""
              value={selectedCategory}
              onChange={setSelectedCategory}
              type="select"
              options={categories}
              placeholder="Filter by category..."
            />
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Materials List */}
        <div
          className={`lg:col-span-1 ${
            isDark ? "bg-slate-800" : "bg-white"
          } rounded-xl shadow-lg p-6`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Materials ({filteredMaterials.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredMaterials.map((material) => (
              <button
                key={material.id}
                onClick={() => setSelectedMaterial(material)}
                className={`w-full text-left p-3 rounded-lg transition-all hover:scale-[1.02] ${
                  selectedMaterial?.id === material.id
                    ? isDark
                      ? "bg-purple-900 text-purple-200"
                      : "bg-purple-50 text-purple-700"
                    : isDark
                    ? "hover:bg-slate-700 text-slate-300"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{material.name}</div>
                    <div
                      className={`text-xs mt-1 ${
                        selectedMaterial?.id === material.id
                          ? isDark
                            ? "text-purple-300"
                            : "text-purple-600"
                          : isDark
                          ? "text-slate-400"
                          : "text-gray-500"
                      }`}
                    >
                      {material.category.charAt(0).toUpperCase() +
                        material.category.slice(1)}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Eye
                      size={16}
                      className={isDark ? "text-slate-400" : "text-gray-400"}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Material Details */}
        <div
          className={`lg:col-span-2 ${
            isDark ? "bg-slate-800" : "bg-white"
          } rounded-xl shadow-lg p-6`}
        >
          {selectedMaterial ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedMaterial.name}
                  </h3>
                  <p
                    className={`${isDark ? "text-slate-400" : "text-gray-600"}`}
                  >
                    {selectedMaterial.category.charAt(0).toUpperCase() +
                      selectedMaterial.category.slice(1)}{" "}
                    Material
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "hover:bg-slate-700 text-slate-300"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? "hover:bg-slate-700 text-slate-300"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <BookOpen size={16} />
                  </button>
                </div>
              </div>

              {renderMaterialProperties(selectedMaterial)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Database
                className={`mx-auto mb-4 ${
                  isDark ? "text-slate-400" : "text-gray-400"
                }`}
                size={48}
              />
              <h4
                className={`text-lg font-medium mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Select a Material
              </h4>
              <p className={`${isDark ? "text-slate-400" : "text-gray-600"}`}>
                Choose a material from the list to view its detailed properties
                and characteristics.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div
        className={`${
          isDark ? "bg-slate-800" : "bg-white"
        } rounded-xl shadow-lg p-6`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Database Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ResultCard
            title="Total Materials"
            value={stats.total}
            description="Materials in database"
            trend="up"
          />
          <ResultCard
            title="Forming Materials"
            value={stats.forming}
            description="For deformation processes"
            trend="neutral"
          />
          <ResultCard
            title="Cutting Materials"
            value={stats.cutting}
            description="For cutting operations"
            trend="neutral"
          />
          <ResultCard
            title="Machining Materials"
            value={stats.machining}
            description="For machining operations"
            trend="neutral"
          />
        </div>
      </div>

      {/* Information Panel */}
      <div
        className={`${
          isDark ? "bg-purple-900/30" : "bg-purple-50"
        } rounded-xl p-6 border ${
          isDark ? "border-purple-800" : "border-purple-200"
        }`}
      >
        <div className="flex items-start space-x-3">
          <BookOpen
            className={`${isDark ? "text-purple-300" : "text-purple-700"}`}
            size={24}
          />
          <div>
            <h4
              className={`font-semibold ${
                isDark ? "text-purple-200" : "text-purple-900"
              }`}
            >
              Material Data Reference
            </h4>
            <p
              className={`${
                isDark ? "text-purple-200/80" : "text-purple-800/80"
              } text-sm mt-1`}
            >
              All material data is sourced from reputable engineering handbooks
              and standards. Always verify values for critical applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
