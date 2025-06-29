import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Hammer, 
  Scissors, 
  Cog, 
  Database, 
  History, 
  BookOpen,
  X,
  ChevronRight
} from 'lucide-react';

const navigationItems = [
  {
    id: 'volumetric',
    label: 'Volumetric Deformation',
    icon: Hammer,
    description: 'Rolling, Forging, Drawing, Extrusion',
  },
  {
    id: 'cutting',
    label: 'Metal Cutting Analysis',
    icon: Scissors,
    description: 'Punching, Shearing, Clearance Analysis',
  },
  {
    id: 'machining',
    label: 'Machining Operations',
    icon: Cog,
    description: 'Turning, Milling, Drilling, Tool Life',
  },
  {
    id: 'materials',
    label: 'Material Database',
    icon: Database,
    description: 'Properties, Flow Stress, Temperature',
  },
  {
    id: 'history',
    label: 'Calculation History',
    icon: History,
    description: 'Saved Calculations, Projects',
  },
  {
    id: 'education',
    label: 'Educational Resources',
    icon: BookOpen,
    description: 'Tutorials, Examples, References',
  },
];

export function Sidebar() {
  const { state, dispatch } = useApp();
  const isDark = state.theme.mode === 'dark';

  const closeSidebar = () => {
    dispatch({ type: 'SET_SIDEBAR', payload: false });
  };

  const setActiveTab = (tabId: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {state.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out
        ${state.sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:z-auto
        ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
        border-r
      `}>
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className={`flex items-center justify-between p-6 border-b md:hidden ${
            isDark ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Navigation
            </h2>
            <button
              onClick={closeSidebar}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-slate-700 text-slate-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = state.activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    text-left group hover:scale-[1.02]
                    ${isActive
                      ? isDark
                        ? 'bg-blue-900 text-blue-200 shadow-lg'
                        : 'bg-blue-50 text-blue-700 shadow-md'
                      : isDark
                        ? 'text-slate-300 hover:bg-slate-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={20} className={`${isActive ? 'text-current' : ''}`} />
                  <div className="flex-1">
                    <div className={`font-medium ${isActive ? 'text-current' : ''}`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${
                      isActive
                        ? isDark ? 'text-blue-300' : 'text-blue-600'
                        : isDark ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  <ChevronRight 
                    size={16} 
                    className={`transform transition-transform ${
                      isActive ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              ProcessCalc v1.0.0<br />
              Manufacturing Process Calculations
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}