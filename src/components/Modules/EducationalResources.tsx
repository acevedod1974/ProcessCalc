import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  BookOpen, 
  Play, 
  GraduationCap,
  FileText,
  Video,
  Calculator,
  Users,
  Award,
  Download,
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'advanced' | 'applications';
  type: 'video' | 'interactive' | 'document';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  rating: number;
  topics: string[];
}

interface Example {
  id: string;
  title: string;
  description: string;
  process: string;
  material: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  learningObjectives: string[];
}

interface Reference {
  id: string;
  title: string;
  author: string;
  type: 'book' | 'paper' | 'standard' | 'handbook';
  year: number;
  description: string;
  downloadUrl?: string;
}

export function EducationalResources() {
  const { state } = useApp();
  const isDark = state.theme.mode === 'dark';

  const [activeTab, setActiveTab] = useState<'tutorials' | 'examples' | 'references' | 'assignments'>('tutorials');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  // Sample data
  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Introduction to Metal Forming',
      description: 'Learn the fundamentals of metal forming processes including rolling, forging, and extrusion.',
      category: 'basics',
      type: 'video',
      duration: '45 min',
      difficulty: 'beginner',
      completed: true,
      rating: 4.8,
      topics: ['Rolling', 'Forging', 'Material Properties', 'Force Calculations']
    },
    {
      id: '2',
      title: 'Advanced Machining Calculations',
      description: 'Deep dive into machining operations with tool life prediction and optimization techniques.',
      category: 'advanced',
      type: 'interactive',
      duration: '90 min',
      difficulty: 'advanced',
      completed: false,
      rating: 4.9,
      topics: ['Tool Life', 'Cutting Forces', 'Surface Roughness', 'Optimization']
    },
    {
      id: '3',
      title: 'Metal Cutting Theory and Practice',
      description: 'Comprehensive guide to metal cutting processes including punching, shearing, and blanking.',
      category: 'basics',
      type: 'document',
      duration: '60 min',
      difficulty: 'intermediate',
      completed: false,
      rating: 4.7,
      topics: ['Punching', 'Shearing', 'Clearance', 'Tool Design']
    },
    {
      id: '4',
      title: 'Industrial Applications Case Studies',
      description: 'Real-world examples from automotive, aerospace, and medical device manufacturing.',
      category: 'applications',
      type: 'video',
      duration: '120 min',
      difficulty: 'intermediate',
      completed: false,
      rating: 4.6,
      topics: ['Case Studies', 'Industry Applications', 'Problem Solving']
    }
  ];

  const examples: Example[] = [
    {
      id: '1',
      title: 'Automotive Body Panel Rolling',
      description: 'Step-by-step analysis of rolling process for automotive body panels.',
      process: 'Rolling',
      material: 'Steel (Low Carbon)',
      parameters: {
        initialThickness: 2.0,
        finalThickness: 1.5,
        width: 1200,
        rollDiameter: 600
      },
      results: {
        rollingForce: 1850000,
        rollingPower: 185,
        reductionRatio: 25
      },
      learningObjectives: [
        'Understand rolling force calculations',
        'Learn about material flow in rolling',
        'Analyze power requirements'
      ]
    },
    {
      id: '2',
      title: 'Precision Hole Punching',
      description: 'Analysis of high-precision punching operation for electronic components.',
      process: 'Punching',
      material: 'Aluminum 6061',
      parameters: {
        thickness: 1.5,
        holeDiameter: 5.0,
        clearance: 8
      },
      results: {
        punchingForce: 8500,
        cutQuality: 'Excellent',
        toolLife: 12000
      },
      learningObjectives: [
        'Optimize clearance for quality',
        'Predict tool life',
        'Understand force requirements'
      ]
    }
  ];

  const references: Reference[] = [
    {
      id: '1',
      title: 'Metal Forming: Mechanics and Metallurgy',
      author: 'Hosford & Caddell',
      type: 'book',
      year: 2011,
      description: 'Comprehensive textbook covering all aspects of metal forming processes.',
      downloadUrl: '#'
    },
    {
      id: '2',
      title: 'Manufacturing Engineering and Technology',
      author: 'Kalpakjian & Schmid',
      type: 'book',
      year: 2020,
      description: 'Industry-standard reference for manufacturing processes and technologies.',
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'ASTM E8 - Standard Test Methods for Tension Testing',
      author: 'ASTM International',
      type: 'standard',
      year: 2021,
      description: 'Standard test methods for determining mechanical properties of materials.',
      downloadUrl: '#'
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'basics', label: 'Fundamentals' },
    { value: 'advanced', label: 'Advanced Topics' },
    { value: 'applications', label: 'Applications' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return isDark ? 'text-green-400 bg-green-900' : 'text-green-700 bg-green-100';
      case 'intermediate':
        return isDark ? 'text-yellow-400 bg-yellow-900' : 'text-yellow-700 bg-yellow-100';
      case 'advanced':
        return isDark ? 'text-red-400 bg-red-900' : 'text-red-700 bg-red-100';
      default:
        return isDark ? 'text-gray-400 bg-gray-900' : 'text-gray-700 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'interactive': return <Calculator size={16} />;
      case 'document': return <FileText size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const tabs = [
    { id: 'tutorials', name: 'Tutorials', icon: Play },
    { id: 'examples', name: 'Examples', icon: Calculator },
    { id: 'references', name: 'References', icon: BookOpen },
    { id: 'assignments', name: 'Assignments', icon: Award }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-rose-900' : 'bg-rose-100'}`}>
            <BookOpen className={`${isDark ? 'text-rose-300' : 'text-rose-600'}`} size={24} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Educational Resources
            </h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Tutorials, Examples, and Academic References
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
            isDark 
              ? 'bg-rose-900 hover:bg-rose-800 text-rose-300' 
              : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
          }`}>
            <Download size={16} />
            <span>Download All</span>
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
              <Play className={`${isDark ? 'text-blue-300' : 'text-blue-600'}`} size={20} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {tutorials.filter(t => t.completed).length}/{tutorials.length}
              </div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Tutorials Completed
              </div>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-green-900' : 'bg-green-100'}`}>
              <Calculator className={`${isDark ? 'text-green-300' : 'text-green-600'}`} size={20} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {examples.length}
              </div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Worked Examples
              </div>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
              <BookOpen className={`${isDark ? 'text-purple-300' : 'text-purple-600'}`} size={20} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {references.length}
              </div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                References
              </div>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
              <Award className={`${isDark ? 'text-yellow-300' : 'text-yellow-600'}`} size={20} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                85%
              </div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Course Progress
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex space-x-1 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? isDark
                      ? 'bg-rose-900 text-rose-300'
                      : 'bg-rose-100 text-rose-700'
                    : isDark
                      ? 'text-slate-400 hover:bg-slate-700'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tutorials Tab */}
        {activeTab === 'tutorials' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={20} />
                  <input
                    type="text"
                    placeholder="Search tutorials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-rose-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-3 py-2 rounded-lg border transition-all ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tutorials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className={`p-6 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
                    isDark
                      ? 'border-slate-600 hover:border-slate-500 bg-slate-700'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                  onClick={() => setSelectedTutorial(tutorial)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(tutorial.type)}
                      <span className={`text-sm ${getDifficultyColor(tutorial.difficulty)} px-2 py-1 rounded-full`}>
                        {tutorial.difficulty}
                      </span>
                    </div>
                    {tutorial.completed && (
                      <CheckCircle className="text-green-500" size={20} />
                    )}
                  </div>
                  
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {tutorial.title}
                  </h4>
                  
                  <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {tutorial.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(tutorial.rating)}
                      <span className={`text-sm ml-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        {tutorial.rating}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} className={isDark ? 'text-slate-400' : 'text-gray-600'} />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        {tutorial.duration}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {tutorial.topics.slice(0, 3).map((topic, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 rounded ${
                          isDark ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {topic}
                      </span>
                    ))}
                    {tutorial.topics.length > 3 && (
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        +{tutorial.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Examples Tab */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            {examples.map((example) => (
              <div
                key={example.id}
                className={`p-6 rounded-lg border ${
                  isDark ? 'border-slate-600 bg-slate-700' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {example.title}
                    </h4>
                    <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      {example.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                        Process: <strong>{example.process}</strong>
                      </span>
                      <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                        Material: <strong>{example.material}</strong>
                      </span>
                    </div>
                  </div>
                  <button className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    isDark 
                      ? 'bg-rose-900 hover:bg-rose-800 text-rose-300' 
                      : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                  }`}>
                    <span>Open Example</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Parameters
                    </h5>
                    <div className="space-y-2">
                      {Object.entries(example.parameters).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className={isDark ? 'text-slate-400' : 'text-gray-600'}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <span className={isDark ? 'text-white' : 'text-gray-900'}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Results
                    </h5>
                    <div className="space-y-2">
                      {Object.entries(example.results).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className={isDark ? 'text-slate-400' : 'text-gray-600'}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <span className={`font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Learning Objectives
                  </h5>
                  <ul className="space-y-1">
                    {example.learningObjectives.map((objective, index) => (
                      <li key={index} className={`text-sm flex items-start space-x-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        <span className="text-rose-500 mt-1">•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* References Tab */}
        {activeTab === 'references' && (
          <div className="space-y-4">
            {references.map((reference) => (
              <div
                key={reference.id}
                className={`p-6 rounded-lg border ${
                  isDark ? 'border-slate-600 bg-slate-700' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {reference.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        isDark ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {reference.type}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      {reference.author} • {reference.year}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      {reference.description}
                    </p>
                  </div>
                  
                  {reference.downloadUrl && (
                    <button className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      isDark 
                        ? 'bg-rose-900 hover:bg-rose-800 text-rose-300' 
                        : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                    }`}>
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="text-center py-12">
            <Award className={`mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={48} />
            <h4 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Assignments Coming Soon
            </h4>
            <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} mb-4`}>
              Interactive assignments and assessments will be available soon to test your knowledge.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm max-w-2xl mx-auto">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-600' : 'bg-white'} shadow`}>
                <div className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Problem Sets</div>
                <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
                  Structured problem sets with step-by-step solutions
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-600' : 'bg-white'} shadow`}>
                <div className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quizzes</div>
                <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
                  Interactive quizzes to test understanding
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-600' : 'bg-white'} shadow`}>
                <div className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Projects</div>
                <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
                  Comprehensive design projects
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Information Panel */}
      <div className={`${isDark ? 'bg-rose-900/30' : 'bg-rose-50'} rounded-xl p-6 border ${isDark ? 'border-rose-800' : 'border-rose-200'}`}>
        <div className="flex items-start space-x-3">
          <GraduationCap className={`${isDark ? 'text-rose-300' : 'text-rose-700'} mt-1`} size={20} />
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>
              Educational Resources Features
            </h4>
            <div className={`text-sm space-y-1 ${isDark ? 'text-rose-200' : 'text-rose-600'}`}>
              <p>• Interactive tutorials with step-by-step guidance</p>
              <p>• Worked examples from real industrial applications</p>
              <p>• Comprehensive reference library with downloadable resources</p>
              <p>• Progress tracking and completion certificates</p>
              <p>• Instructor tools for creating custom assignments</p>
              <p>• Student performance analytics and reporting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}