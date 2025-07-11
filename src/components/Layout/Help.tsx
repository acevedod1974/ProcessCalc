import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  HelpCircle, 
  Book, 
  Video, 
  MessageCircle,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  articles: Array<{
    title: string;
    description: string;
    link: string;
  }>;
}

export function Help() {
  const { state } = useApp();
  const isDark = state.theme.mode === 'dark';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I calculate rolling forces for different materials?',
      answer: 'Rolling forces are calculated using the material flow stress, contact area, and friction conditions. Select your material from the database, input the initial and final thickness, roll diameter, and process parameters. The system will calculate the required force using established metal forming equations.',
      category: 'calculations'
    },
    {
      id: '2',
      question: 'What unit systems are supported?',
      answer: 'ProcessCalc supports both Metric (SI) and Imperial (US) unit systems. You can switch between them in Settings. The system automatically converts all calculations and displays results in your selected units.',
      category: 'general'
    },
    {
      id: '3',
      question: 'How accurate are the material properties in the database?',
      answer: 'Material properties are sourced from standard engineering handbooks and databases including ASM Metals Handbook, ASTM standards, and peer-reviewed research. Properties include temperature dependencies and are regularly updated.',
      category: 'materials'
    },
    {
      id: '4',
      question: 'Can I save and export my calculations?',
      answer: 'Yes! All calculations can be saved to your calculation history, organized into projects, and exported in multiple formats (JSON, CSV, Excel, PDF). Use the Export button in any module or access the full history in the Calculation History section.',
      category: 'data'
    },
    {
      id: '5',
      question: 'What machining operations are supported?',
      answer: 'ProcessCalc supports turning, milling, and drilling operations with comprehensive tool life predictions, cutting force calculations, and optimization recommendations. Each operation includes material-specific cutting parameters.',
      category: 'calculations'
    },
    {
      id: '6',
      question: 'How do I interpret the quality indicators?',
      answer: 'Quality indicators show the expected outcome quality based on your process parameters. Green indicates excellent quality, blue is good, yellow is fair, and red indicates poor quality. Recommendations are provided to improve quality.',
      category: 'results'
    }
  ];

  const helpTopics: HelpTopic[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of ProcessCalc',
      icon: Book,
      articles: [
        {
          title: 'Quick Start Guide',
          description: 'Get up and running in 5 minutes',
          link: '#'
        },
        {
          title: 'Interface Overview',
          description: 'Understanding the ProcessCalc interface',
          link: '#'
        },
        {
          title: 'Your First Calculation',
          description: 'Step-by-step tutorial',
          link: '#'
        }
      ]
    },
    {
      id: 'calculations',
      title: 'Calculation Modules',
      description: 'Detailed guides for each process',
      icon: Video,
      articles: [
        {
          title: 'Volumetric Deformation Guide',
          description: 'Rolling, forging, drawing, and extrusion',
          link: '#'
        },
        {
          title: 'Metal Cutting Analysis',
          description: 'Punching and shearing operations',
          link: '#'
        },
        {
          title: 'Machining Operations',
          description: 'Turning, milling, and drilling',
          link: '#'
        }
      ]
    },
    {
      id: 'materials',
      title: 'Material Database',
      description: 'Working with material properties',
      icon: MessageCircle,
      articles: [
        {
          title: 'Understanding Material Properties',
          description: 'Flow stress, hardness, and thermal properties',
          link: '#'
        },
        {
          title: 'Adding Custom Materials',
          description: 'How to add your own material data',
          link: '#'
        },
        {
          title: 'Temperature Effects',
          description: 'How temperature affects calculations',
          link: '#'
        }
      ]
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'calculations', label: 'Calculations' },
    { value: 'materials', label: 'Materials' },
    { value: 'data', label: 'Data Management' },
    { value: 'results', label: 'Results & Analysis' }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
            <HelpCircle className={`${isDark ? 'text-indigo-300' : 'text-indigo-600'}`} size={24} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Help & Support
            </h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Get help with ProcessCalc features and calculations
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-center`}>
          <Book className={`mx-auto mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={32} />
          <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Documentation
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Comprehensive guides and tutorials
          </p>
          <button className={`px-4 py-2 rounded-lg transition-colors ${
            isDark 
              ? 'bg-blue-900 hover:bg-blue-800 text-blue-300' 
              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
          }`}>
            Browse Docs
          </button>
        </div>

        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-center`}>
          <Video className={`mx-auto mb-3 ${isDark ? 'text-green-400' : 'text-green-600'}`} size={32} />
          <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Video Tutorials
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Step-by-step video guides
          </p>
          <button className={`px-4 py-2 rounded-lg transition-colors ${
            isDark 
              ? 'bg-green-900 hover:bg-green-800 text-green-300' 
              : 'bg-green-100 hover:bg-green-200 text-green-700'
          }`}>
            Watch Videos
          </button>
        </div>

        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-center`}>
          <MessageCircle className={`mx-auto mb-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} size={32} />
          <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Contact Support
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Get help from our team
          </p>
          <button className={`px-4 py-2 rounded-lg transition-colors ${
            isDark 
              ? 'bg-purple-900 hover:bg-purple-800 text-purple-300' 
              : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
          }`}>
            Contact Us
          </button>
        </div>
      </div>

      {/* Help Topics */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Help Topics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {helpTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div key={topic.id} className={`p-4 rounded-lg border ${
                isDark ? 'border-slate-600 bg-slate-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} size={20} />
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {topic.title}
                  </h4>
                </div>
                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {topic.description}
                </p>
                <div className="space-y-2">
                  {topic.articles.map((article, index) => (
                    <a
                      key={index}
                      href={article.link}
                      className={`block text-sm hover:underline ${
                        isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{article.title}</span>
                        <ExternalLink size={12} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Frequently Asked Questions
        </h3>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={20} />
              <input
                type="text"
                placeholder="Search FAQs..."
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
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition-all ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFAQs.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg ${
                isDark ? 'border-slate-600' : 'border-gray-200'
              }`}
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                  expandedFAQ === item.id ? 'rounded-t-lg' : 'rounded-lg'
                }`}
              >
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.question}
                </span>
                {expandedFAQ === item.id ? (
                  <ChevronDown className={`${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={20} />
                ) : (
                  <ChevronRight className={`${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={20} />
                )}
              </button>
              {expandedFAQ === item.id && (
                <div className={`px-4 pb-3 border-t ${isDark ? 'border-slate-600' : 'border-gray-200'}`}>
                  <p className={`text-sm mt-2 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <HelpCircle className={`mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={48} />
            <h4 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No FAQs found
            </h4>
            <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Try adjusting your search terms or browse all categories.
            </p>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Mail className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
            <div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Email Support</div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>support@processcalc.edu</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className={`${isDark ? 'text-green-400' : 'text-green-600'}`} size={20} />
            <div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Phone Support</div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>+1 (555) 123-4567</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Globe className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`} size={20} />
            <div>
              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Website</div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>www.processcalc.edu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}