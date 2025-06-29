import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  History, 
  Clock, 
  FileText, 
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Copy,
  Star,
  Calendar,
  BarChart3,
  Folder,
  Plus
} from 'lucide-react';

interface CalculationRecord {
  id: string;
  name: string;
  type: 'volumetric' | 'cutting' | 'machining';
  process: string;
  material: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  timestamp: Date;
  starred: boolean;
  project?: string;
  notes?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  calculations: string[];
  createdAt: Date;
  lastModified: Date;
}

export function CalculationHistory() {
  const { state } = useApp();
  const isDark = state.theme.mode === 'dark';

  const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type'>('date');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedCalculation, setSelectedCalculation] = useState<CalculationRecord | null>(null);
  const [showCreateProject, setShowCreateProject] = useState(false);

  // Sample data for demonstration
  useEffect(() => {
    const sampleCalculations: CalculationRecord[] = [
      {
        id: '1',
        name: 'Steel Rolling Analysis',
        type: 'volumetric',
        process: 'rolling',
        material: 'steel-low-carbon',
        parameters: {
          initialThickness: 10,
          finalThickness: 8,
          width: 100,
          rollDiameter: 300,
          rollingSpeed: 50
        },
        results: {
          rollingForce: 2500000,
          rollingPower: 125,
          reductionRatio: 20
        },
        timestamp: new Date('2024-01-15T10:30:00'),
        starred: true,
        project: 'automotive-parts',
        notes: 'Initial analysis for automotive body panels'
      },
      {
        id: '2',
        name: 'Aluminum Punching Operation',
        type: 'cutting',
        process: 'punching',
        material: 'aluminum-6061',
        parameters: {
          thickness: 3,
          holeDiameter: 10,
          clearance: 6
        },
        results: {
          punchingForce: 15000,
          cutQuality: 'Excellent',
          toolLife: 5000
        },
        timestamp: new Date('2024-01-14T14:20:00'),
        starred: false,
        project: 'aerospace-components'
      },
      {
        id: '3',
        name: 'Titanium Turning Process',
        type: 'machining',
        process: 'turning',
        material: 'titanium-ti6al4v',
        parameters: {
          diameter: 50,
          cuttingSpeed: 60,
          feedRate: 0.15,
          depthOfCut: 2
        },
        results: {
          machiningTime: 12.5,
          toolLife: 45,
          costPerPart: 25.50
        },
        timestamp: new Date('2024-01-13T09:15:00'),
        starred: true,
        project: 'medical-devices'
      }
    ];

    const sampleProjects: Project[] = [
      {
        id: 'automotive-parts',
        name: 'Automotive Parts Manufacturing',
        description: 'Analysis for various automotive components including body panels and structural elements',
        calculations: ['1'],
        createdAt: new Date('2024-01-10T08:00:00'),
        lastModified: new Date('2024-01-15T10:30:00')
      },
      {
        id: 'aerospace-components',
        name: 'Aerospace Components',
        description: 'Precision manufacturing analysis for aerospace industry applications',
        calculations: ['2'],
        createdAt: new Date('2024-01-12T09:00:00'),
        lastModified: new Date('2024-01-14T14:20:00')
      },
      {
        id: 'medical-devices',
        name: 'Medical Device Manufacturing',
        description: 'High-precision manufacturing processes for medical device components',
        calculations: ['3'],
        createdAt: new Date('2024-01-08T10:00:00'),
        lastModified: new Date('2024-01-13T09:15:00')
      }
    ];

    setCalculations(sampleCalculations);
    setProjects(sampleProjects);
  }, []);

  // Filter and sort calculations
  const filteredCalculations = calculations
    .filter(calc => {
      const matchesSearch = calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           calc.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           calc.process.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || calc.type === selectedType;
      const matchesProject = selectedProject === 'all' || calc.project === selectedProject;
      return matchesSearch && matchesType && matchesProject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'volumetric', label: 'Volumetric Deformation' },
    { value: 'cutting', label: 'Metal Cutting' },
    { value: 'machining', label: 'Machining Operations' }
  ];

  const projectOptions = [
    { value: 'all', label: 'All Projects' },
    ...projects.map(project => ({ value: project.id, label: project.name }))
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProcessIcon = (type: string) => {
    switch (type) {
      case 'volumetric': return '🔨';
      case 'cutting': return '✂️';
      case 'machining': return '⚙️';
      default: return '📊';
    }
  };

  const toggleStar = (id: string) => {
    setCalculations(prev => prev.map(calc => 
      calc.id === id ? { ...calc, starred: !calc.starred } : calc
    ));
  };

  const deleteCalculation = (id: string) => {
    setCalculations(prev => prev.filter(calc => calc.id !== id));
  };

  const duplicateCalculation = (calc: CalculationRecord) => {
    const newCalc: CalculationRecord = {
      ...calc,
      id: Date.now().toString(),
      name: calc.name + ' (Copy)',
      timestamp: new Date(),
      starred: false
    };
    setCalculations(prev => [newCalc, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
            <History className={`${isDark ? 'text-indigo-300' : 'text-indigo-600'}`} size={24} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Calculation History
            </h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Saved Calculations and Project Management
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowCreateProject(true)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              isDark 
                ? 'bg-indigo-900 hover:bg-indigo-800 text-indigo-300' 
                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
            }`}
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
          <button className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
            isDark 
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}>
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
              <FileText className={`${isDark ? 'text-blue-300' : 'text-blue-600'}`} size={20} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {calculations.length}
              </div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Total Calculations
              </div>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-green-900' : 'bg-green-100'}`}>
              <Folder className={`${isDark ? 'text-green-300' : 'text-green-600'}`} size={20} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {projects.length}
              </div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Active Projects
              </div>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
              <Star className={`${isDark ? 'text-yellow-300' : 'text-yellow-600'}`} size={20} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {calculations.filter(c => c.starred).length}
              </div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Starred Items
              </div>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
              <Calendar className={`${isDark ? 'text-purple-300' : 'text-purple-600'}`} size={20} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {calculations.filter(c => {
                  const today = new Date();
                  const calcDate = new Date(c.timestamp);
                  return calcDate.toDateString() === today.toDateString();
                }).length}
              </div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Today's Work
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={20} />
              <input
                type="text"
                placeholder="Search calculations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                }`}
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`px-3 py-2 rounded-lg border transition-all ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className={`px-3 py-2 rounded-lg border transition-all ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {projectOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'type')}
              className={`px-3 py-2 rounded-lg border transition-all ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calculations List */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg`}>
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Calculations ({filteredCalculations.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-slate-700">
          {filteredCalculations.map((calculation) => (
            <div
              key={calculation.id}
              className={`p-6 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer`}
              onClick={() => setSelectedCalculation(calculation)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getProcessIcon(calculation.type)}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {calculation.name}
                      </h4>
                      {calculation.starred && (
                        <Star className="text-yellow-500" size={16} fill="currentColor" />
                      )}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      {calculation.process} • {calculation.material} • {formatDate(calculation.timestamp)}
                    </div>
                    {calculation.project && (
                      <div className={`text-xs mt-1 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        Project: {projects.find(p => p.id === calculation.project)?.name}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(calculation.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      calculation.starred
                        ? 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                        : isDark
                          ? 'text-slate-400 hover:bg-slate-600'
                          : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Star size={16} fill={calculation.starred ? 'currentColor' : 'none'} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateCalculation(calculation);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? 'text-slate-400 hover:bg-slate-600'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Copy size={16} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Edit functionality
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? 'text-slate-400 hover:bg-slate-600'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Edit size={16} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCalculation(calculation.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? 'text-red-400 hover:bg-red-900'
                        : 'text-red-500 hover:bg-red-100'
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredCalculations.length === 0 && (
            <div className="p-12 text-center">
              <FileText className={`mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={48} />
              <h4 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                No calculations found
              </h4>
              <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Try adjusting your search criteria or create a new calculation.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Projects Section */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Projects
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer ${
                isDark
                  ? 'border-slate-600 hover:border-slate-500 bg-slate-700'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                  <Folder className={`${isDark ? 'text-indigo-300' : 'text-indigo-600'}`} size={20} />
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  {project.calculations.length} calculations
                </div>
              </div>
              
              <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {project.name}
              </h4>
              
              <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                {project.description}
              </p>
              
              <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                Last modified: {formatDate(project.lastModified)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Information Panel */}
      <div className={`${isDark ? 'bg-indigo-900/30' : 'bg-indigo-50'} rounded-xl p-6 border ${isDark ? 'border-indigo-800' : 'border-indigo-200'}`}>
        <div className="flex items-start space-x-3">
          <BarChart3 className={`${isDark ? 'text-indigo-300' : 'text-indigo-700'} mt-1`} size={20} />
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
              Calculation History Features
            </h4>
            <div className={`text-sm space-y-1 ${isDark ? 'text-indigo-200' : 'text-indigo-600'}`}>
              <p>• Organize calculations into projects for better management</p>
              <p>• Star important calculations for quick access</p>
              <p>• Search and filter by type, project, or material</p>
              <p>• Export calculation data and reports</p>
              <p>• Duplicate calculations to create variations</p>
              <p>• Track calculation history and modifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}