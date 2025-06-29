import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { InputField } from '../UI/InputField';
import { ResultCard } from '../UI/ResultCard';
import { RecommendationCard } from '../UI/RecommendationCard';
import { QualityIndicator } from '../UI/QualityIndicator';
import { 
  Scissors, 
  Target, 
  Zap, 
  Calculator,
  Settings,
  Download,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  CUTTING_MATERIALS, 
  calculatePunching, 
  calculateShearing,
  optimizeClearance,
  PunchingParameters,
  ShearingParameters,
  PunchingResults,
  ShearingResults
} from '../../utils/cuttingCalculations';

type CuttingProcess = 'punching' | 'shearing' | 'blanking';

export function MetalCutting() {
  const { state } = useApp();
  const isDark = state.theme.mode === 'dark';

  // State management
  const [activeProcess, setActiveProcess] = useState<CuttingProcess>('punching');
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Punching parameters
  const [punchingParams, setPunchingParams] = useState<Partial<PunchingParameters>>({
    material: '',
    thickness: '',
    holeDiameter: '',
    punchDiameter: '',
    clearance: '6',
    punchSpeed: '100',
    temperature: '20',
    lubrication: true
  });
  
  // Shearing parameters
  const [shearingParams, setShearingParams] = useState<Partial<ShearingParameters>>({
    material: '',
    thickness: '',
    shearLength: '',
    bladeAngle: '3',
    clearance: '8',
    shearSpeed: '50',
    holdDownForce: '5000'
  });

  // Results
  const [punchingResults, setPunchingResults] = useState<PunchingResults | null>(null);
  const [shearingResults, setShearingResults] = useState<ShearingResults | null>(null);
  const [clearanceOptimization, setClearanceOptimization] = useState<any>(null);

  // Material options
  const materialOptions = Object.entries(CUTTING_MATERIALS).map(([key, material]) => ({
    value: key,
    label: material.name
  }));

  // Validation functions
  const validatePunchingInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!punchingParams.material) newErrors.material = 'Material is required';
    if (!punchingParams.thickness || Number(punchingParams.thickness) <= 0) {
      newErrors.thickness = 'Thickness must be greater than 0';
    }
    if (!punchingParams.holeDiameter || Number(punchingParams.holeDiameter) <= 0) {
      newErrors.holeDiameter = 'Hole diameter must be greater than 0';
    }
    if (!punchingParams.punchDiameter || Number(punchingParams.punchDiameter) <= 0) {
      newErrors.punchDiameter = 'Punch diameter must be greater than 0';
    }
    if (Number(punchingParams.punchDiameter) > Number(punchingParams.holeDiameter)) {
      newErrors.punchDiameter = 'Punch diameter must be less than hole diameter';
    }
    if (!punchingParams.clearance || Number(punchingParams.clearance) < 0 || Number(punchingParams.clearance) > 50) {
      newErrors.clearance = 'Clearance must be between 0 and 50%';
    }
    if (!punchingParams.punchSpeed || Number(punchingParams.punchSpeed) <= 0) {
      newErrors.punchSpeed = 'Punch speed must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateShearingInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!shearingParams.material) newErrors.material = 'Material is required';
    if (!shearingParams.thickness || Number(shearingParams.thickness) <= 0) {
      newErrors.thickness = 'Thickness must be greater than 0';
    }
    if (!shearingParams.shearLength || Number(shearingParams.shearLength) <= 0) {
      newErrors.shearLength = 'Shear length must be greater than 0';
    }
    if (!shearingParams.bladeAngle || Number(shearingParams.bladeAngle) <= 0 || Number(shearingParams.bladeAngle) > 10) {
      newErrors.bladeAngle = 'Blade angle must be between 0 and 10 degrees';
    }
    if (!shearingParams.clearance || Number(shearingParams.clearance) < 0 || Number(shearingParams.clearance) > 30) {
      newErrors.clearance = 'Clearance must be between 0 and 30%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate functions
  const handlePunchingCalculation = async () => {
    if (!validatePunchingInputs()) return;
    
    setIsCalculating(true);
    try {
      const params: PunchingParameters = {
        material: punchingParams.material!,
        thickness: Number(punchingParams.thickness),
        holeDiameter: Number(punchingParams.holeDiameter),
        punchDiameter: Number(punchingParams.punchDiameter),
        clearance: Number(punchingParams.clearance),
        punchSpeed: Number(punchingParams.punchSpeed),
        temperature: Number(punchingParams.temperature || 20),
        lubrication: punchingParams.lubrication || false
      };
      
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = calculatePunching(params);
      setPunchingResults(results);

      // Calculate clearance optimization
      const optimization = optimizeClearance(
        params.material,
        params.thickness,
        params.holeDiameter
      );
      setClearanceOptimization(optimization);
      
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleShearingCalculation = async () => {
    if (!validateShearingInputs()) return;
    
    setIsCalculating(true);
    try {
      const params: ShearingParameters = {
        material: shearingParams.material!,
        thickness: Number(shearingParams.thickness),
        shearLength: Number(shearingParams.shearLength),
        bladeAngle: Number(shearingParams.bladeAngle),
        clearance: Number(shearingParams.clearance),
        shearSpeed: Number(shearingParams.shearSpeed),
        holdDownForce: Number(shearingParams.holdDownForce)
      };
      
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = calculateShearing(params);
      setShearingResults(results);
      
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Clear results when process changes
  useEffect(() => {
    setPunchingResults(null);
    setShearingResults(null);
    setClearanceOptimization(null);
    setErrors({});
  }, [activeProcess]);

  const processes = [
    { id: 'punching', name: 'Punching', description: 'Hole Punching Operations', icon: '🎯' },
    { id: 'shearing', name: 'Shearing', description: 'Sheet Metal Shearing', icon: '✂️' },
    { id: 'blanking', name: 'Blanking', description: 'Blanking Operations', icon: '📐' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-orange-900' : 'bg-orange-100'}`}>
            <Scissors className={`${isDark ? 'text-orange-300' : 'text-orange-600'}`} size={24} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Metal Cutting Analysis
            </h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Punching, Shearing, and Clearance Analysis
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
            isDark 
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}>
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
            isDark 
              ? 'bg-orange-900 hover:bg-orange-800 text-orange-300' 
              : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
          }`}>
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Process Selection */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Cutting Process Selection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {processes.map((process) => (
            <button
              key={process.id}
              onClick={() => setActiveProcess(process.id as CuttingProcess)}
              disabled={process.id === 'blanking'}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                activeProcess === process.id
                  ? isDark
                    ? 'border-orange-500 bg-orange-900 text-orange-300'
                    : 'border-orange-500 bg-orange-50 text-orange-700'
                  : process.id === 'blanking'
                    ? isDark
                      ? 'border-slate-700 bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isDark
                      ? 'border-slate-600 hover:border-slate-500 text-slate-300'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-2xl mb-2">{process.icon}</div>
              <div className="font-medium">{process.name}</div>
              <div className={`text-sm mt-1 ${
                activeProcess === process.id
                  ? isDark ? 'text-orange-400' : 'text-orange-600'
                  : process.id === 'blanking'
                    ? isDark ? 'text-slate-500' : 'text-gray-400'
                    : isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {process.description}
                {process.id === 'blanking' && (
                  <div className="text-xs mt-1">(Coming Soon)</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Punching Process */}
      {activeProcess === 'punching' && (
        <>
          {/* Input Parameters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Material & Geometry
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Material"
                  value={punchingParams.material || ''}
                  onChange={(value) => setPunchingParams(prev => ({ ...prev, material: value }))}
                  type="select"
                  options={materialOptions}
                  placeholder="Select Material..."
                  required
                  error={errors.material}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Material Thickness"
                    value={punchingParams.thickness || ''}
                    onChange={(value) => setPunchingParams(prev => ({ ...prev, thickness: value }))}
                    type="number"
                    placeholder="3.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.thickness}
                  />
                  <InputField
                    label="Hole Diameter"
                    value={punchingParams.holeDiameter || ''}
                    onChange={(value) => setPunchingParams(prev => ({ ...prev, holeDiameter: value }))}
                    type="number"
                    placeholder="10.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.holeDiameter}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Punch Diameter"
                    value={punchingParams.punchDiameter || ''}
                    onChange={(value) => setPunchingParams(prev => ({ ...prev, punchDiameter: value }))}
                    type="number"
                    placeholder="9.8"
                    unit={state.unitSystem.length}
                    required
                    step="0.01"
                    min="0"
                    error={errors.punchDiameter}
                  />
                  <InputField
                    label="Clearance"
                    value={punchingParams.clearance || ''}
                    onChange={(value) => setPunchingParams(prev => ({ ...prev, clearance: value }))}
                    type="number"
                    placeholder="6"
                    unit="%"
                    required
                    step="0.5"
                    min="0"
                    max="50"
                    error={errors.clearance}
                  />
                </div>
              </div>
            </div>

            <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Process Parameters
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Punch Speed"
                  value={punchingParams.punchSpeed || ''}
                  onChange={(value) => setPunchingParams(prev => ({ ...prev, punchSpeed: value }))}
                  type="number"
                  placeholder="100"
                  unit="mm/min"
                  required
                  step="1"
                  min="0"
                  error={errors.punchSpeed}
                />
                
                <InputField
                  label="Temperature"
                  value={punchingParams.temperature || ''}
                  onChange={(value) => setPunchingParams(prev => ({ ...prev, temperature: value }))}
                  type="number"
                  placeholder="20"
                  unit={state.unitSystem.temperature}
                  step="1"
                />
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="lubrication"
                    checked={punchingParams.lubrication || false}
                    onChange={(e) => setPunchingParams(prev => ({ ...prev, lubrication: e.target.checked }))}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="lubrication" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Use Lubrication
                  </label>
                </div>
                
                <button 
                  onClick={handlePunchingCalculation}
                  disabled={isCalculating}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <Calculator size={16} />
                      <span>Calculate Punching</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Punching Results */}
          {punchingResults && (
            <>
              <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <div className="flex items-center space-x-2 mb-6">
                  <CheckCircle className={`${isDark ? 'text-green-400' : 'text-green-600'}`} size={20} />
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Punching Analysis Results
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Punching Force"
                    value={punchingResults.punchingForce}
                    unit={state.unitSystem.force}
                    description="Force required for punching"
                    trend="up"
                  />
                  <ResultCard
                    title="Stripping Force"
                    value={punchingResults.strippingForce}
                    unit={state.unitSystem.force}
                    description="Force to strip material from punch"
                    trend="up"
                  />
                  <ResultCard
                    title="Total Force"
                    value={punchingResults.totalForce}
                    unit={state.unitSystem.force}
                    description="Combined punching and stripping force"
                    trend="up"
                  />
                  <ResultCard
                    title="Punching Energy"
                    value={punchingResults.punchingEnergy}
                    unit="J"
                    description="Energy consumed per punch"
                    trend="neutral"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Punching Power"
                    value={punchingResults.punchingPower}
                    unit={state.unitSystem.power}
                    description="Power consumption"
                    trend="up"
                  />
                  <ResultCard
                    title="Shear Stress"
                    value={punchingResults.shearStress}
                    unit={state.unitSystem.pressure}
                    description="Average shear stress"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Tool Wear Rate"
                    value={punchingResults.toolWearRate}
                    unit="μm/1000 holes"
                    description="Expected tool wear rate"
                    trend="down"
                  />
                  <ResultCard
                    title="Tool Life"
                    value={punchingResults.expectedToolLife}
                    unit="holes"
                    description="Expected tool life"
                    trend="up"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <QualityIndicator quality={punchingResults.cutQuality} />
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Clearance Analysis
                    </h4>
                    <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                      <p>Actual Clearance: {punchingResults.clearanceValue.toFixed(3)} mm</p>
                      {clearanceOptimization && (
                        <>
                          <p>Optimal Clearance: {clearanceOptimization.optimal.toFixed(3)} mm</p>
                          <p>Optimal Percentage: {clearanceOptimization.percentage.toFixed(1)}%</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <RecommendationCard 
                recommendations={punchingResults.recommendations}
                type={punchingResults.cutQuality === 'Excellent' ? 'success' : 
                      punchingResults.cutQuality === 'Poor' ? 'warning' : 'info'}
              />
            </>
          )}
        </>
      )}

      {/* Shearing Process */}
      {activeProcess === 'shearing' && (
        <>
          {/* Input Parameters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Material & Geometry
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Material"
                  value={shearingParams.material || ''}
                  onChange={(value) => setShearingParams(prev => ({ ...prev, material: value }))}
                  type="select"
                  options={materialOptions}
                  placeholder="Select Material..."
                  required
                  error={errors.material}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Material Thickness"
                    value={shearingParams.thickness || ''}
                    onChange={(value) => setShearingParams(prev => ({ ...prev, thickness: value }))}
                    type="number"
                    placeholder="5.0"
                    unit={state.unitSystem.length}
                    required
                    step="0.1"
                    min="0"
                    error={errors.thickness}
                  />
                  <InputField
                    label="Shear Length"
                    value={shearingParams.shearLength || ''}
                    onChange={(value) => setShearingParams(prev => ({ ...prev, shearLength: value }))}
                    type="number"
                    placeholder="200.0"
                    unit={state.unitSystem.length}
                    required
                    step="1"
                    min="0"
                    error={errors.shearLength}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Blade Angle"
                    value={shearingParams.bladeAngle || ''}
                    onChange={(value) => setShearingParams(prev => ({ ...prev, bladeAngle: value }))}
                    type="number"
                    placeholder="3"
                    unit="degrees"
                    required
                    step="0.1"
                    min="0"
                    max="10"
                    error={errors.bladeAngle}
                  />
                  <InputField
                    label="Clearance"
                    value={shearingParams.clearance || ''}
                    onChange={(value) => setShearingParams(prev => ({ ...prev, clearance: value }))}
                    type="number"
                    placeholder="8"
                    unit="%"
                    required
                    step="0.5"
                    min="0"
                    max="30"
                    error={errors.clearance}
                  />
                </div>
              </div>
            </div>

            <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Process Parameters
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Shear Speed"
                  value={shearingParams.shearSpeed || ''}
                  onChange={(value) => setShearingParams(prev => ({ ...prev, shearSpeed: value }))}
                  type="number"
                  placeholder="50"
                  unit="mm/min"
                  required
                  step="1"
                  min="0"
                />
                
                <InputField
                  label="Hold-Down Force"
                  value={shearingParams.holdDownForce || ''}
                  onChange={(value) => setShearingParams(prev => ({ ...prev, holdDownForce: value }))}
                  type="number"
                  placeholder="5000"
                  unit={state.unitSystem.force}
                  required
                  step="100"
                  min="0"
                />
                
                <button 
                  onClick={handleShearingCalculation}
                  disabled={isCalculating}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <Calculator size={16} />
                      <span>Calculate Shearing</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Shearing Results */}
          {shearingResults && (
            <>
              <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <div className="flex items-center space-x-2 mb-6">
                  <CheckCircle className={`${isDark ? 'text-green-400' : 'text-green-600'}`} size={20} />
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Shearing Analysis Results
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Shearing Force"
                    value={shearingResults.shearingForce}
                    unit={state.unitSystem.force}
                    description="Force required for shearing"
                    trend="up"
                  />
                  <ResultCard
                    title="Total Force"
                    value={shearingResults.totalForce}
                    unit={state.unitSystem.force}
                    description="Combined shearing and hold-down force"
                    trend="up"
                  />
                  <ResultCard
                    title="Shearing Energy"
                    value={shearingResults.shearingEnergy}
                    unit="J"
                    description="Energy consumed per shear"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Shearing Power"
                    value={shearingResults.shearingPower}
                    unit={state.unitSystem.power}
                    description="Power consumption"
                    trend="up"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ResultCard
                    title="Hold-Down Pressure"
                    value={shearingResults.holdDownPressure}
                    unit={state.unitSystem.pressure}
                    description="Pressure applied by hold-down"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Blade Wear"
                    value={shearingResults.bladeWear}
                    unit="μm/m"
                    description="Expected blade wear rate"
                    trend="down"
                  />
                  <ResultCard
                    title="Cut Angle"
                    value={shearingResults.cutAngle}
                    unit="degrees"
                    description="Angle of cut surface"
                    trend="neutral"
                  />
                  <ResultCard
                    title="Material Distortion"
                    value={shearingResults.distortion}
                    unit={state.unitSystem.length}
                    description="Expected material distortion"
                    trend="down"
                  />
                </div>
              </div>

              <RecommendationCard 
                recommendations={shearingResults.recommendations}
                type="info"
              />
            </>
          )}
        </>
      )}

      {/* Information Panel */}
      <div className={`${isDark ? 'bg-orange-900/30' : 'bg-orange-50'} rounded-xl p-6 border ${isDark ? 'border-orange-800' : 'border-orange-200'}`}>
        <div className="flex items-start space-x-3">
          <AlertCircle className={`${isDark ? 'text-orange-300' : 'text-orange-700'} mt-1`} size={20} />
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
              Metal Cutting Analysis Notes
            </h4>
            <div className={`text-sm space-y-1 ${isDark ? 'text-orange-200' : 'text-orange-600'}`}>
              <p>• Calculations include material properties, temperature effects, and tool wear considerations</p>
              <p>• Clearance optimization is based on material hardness and thickness relationships</p>
              <p>• Tool life predictions are estimates based on standard wear models</p>
              <p>• Cut quality assessment considers clearance ratio and process parameters</p>
              {activeProcess === 'punching' && (
                <p>• Punching force includes both shearing and stripping components</p>
              )}
              {activeProcess === 'shearing' && (
                <p>• Shearing calculations account for blade angle and hold-down pressure effects</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}