import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { VolumetricDeformation } from '../Modules/VolumetricDeformation';
import { MetalCutting } from '../Modules/MetalCutting';
import { MachiningOperations } from '../Modules/MachiningOperations';
import { MaterialDatabase } from '../Modules/MaterialDatabase';
import { CalculationHistory } from '../Modules/CalculationHistory';
import { EducationalResources } from '../Modules/EducationalResources';

export function MainContent() {
  const { state } = useApp();
  const isDark = state.theme.mode === 'dark';

  const renderActiveModule = () => {
    switch (state.activeTab) {
      case 'volumetric':
        return <VolumetricDeformation />;
      case 'cutting':
        return <MetalCutting />;
      case 'machining':
        return <MachiningOperations />;
      case 'materials':
        return <MaterialDatabase />;
      case 'history':
        return <CalculationHistory />;
      case 'education':
        return <EducationalResources />;
      default:
        return <VolumetricDeformation />;
    }
  };

  return (
    <main className={`flex-1 overflow-auto ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="p-6">
        {renderActiveModule()}
      </div>
    </main>
  );
}