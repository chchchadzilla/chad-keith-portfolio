// MainMenu.js - Main menu component for analysis type selection
console.log("MainMenu.js: file loaded");

// Analysis type configurations based on enhanced_prompts.py
const ANALYSIS_TYPES = [
  {
    id: 'simple_text_analysis',
    title: 'Simple Text Analysis',
    description: 'Analyze any long-form text with optional short context. Uses XML-like tags (<diary>, <transcript>, <emails>, etc.) to improve accuracy and produces a full psyche/career report + action steps.',
    icon: '📝',
    category: 'Analysis',
    color: 'from-teal-500 to-emerald-600',
    hoverColor: 'from-teal-600 to-emerald-700',
    popularity: 5
  },
  {
    id: 'personality_analysis',
    title: 'Big Five Personality',
    description: 'Comprehensive personality analysis including Big Five traits, emotional intelligence, and psychological insights',
    icon: '🧠',
    category: 'Psychology',
    color: 'from-purple-500 to-indigo-600',
    hoverColor: 'from-purple-600 to-indigo-700',
    popularity: 5
  },
  {
    id: 'mbti_analysis',
    title: 'MBTI Analysis',
    description: 'Myers-Briggs Type Indicator analysis with cognitive functions and personality type assessment',
    icon: '🎭',
    category: 'Psychology',
    color: 'from-blue-500 to-cyan-600',
    hoverColor: 'from-blue-600 to-cyan-700',
    popularity: 5
  },
  {
    id: 'candidate_comparison',
    title: 'Candidate Comparison',
    description: 'Compare job candidates against requirements using resumes, conversations, and other materials with XML tag support',
    icon: '👥',
    category: 'Career',
    color: 'from-green-500 to-blue-600',
    hoverColor: 'from-green-600 to-blue-700',
    popularity: 5
  },
  {
    id: 'career_guidance',
    title: 'Career Guidance',
    description: 'Comprehensive career counseling based on personality traits, communication patterns, and professional fit analysis',
    icon: '🎯',
    category: 'Career',
    color: 'from-emerald-500 to-teal-600',
    hoverColor: 'from-emerald-600 to-teal-700',
    popularity: 4
  },
  {
    id: 'aita',
    title: 'AITA Detector',
    description: 'Social reasoning analysis to determine if someone is "the asshole" in a given situation',
    icon: '⚖️',
    category: 'Social',
    color: 'from-orange-500 to-red-600',
    hoverColor: 'from-orange-600 to-red-700',
    popularity: 4
  },
  {
    id: 'bullshit_detector',
    title: 'Bullshit Detector',
    description: 'Identify logical inconsistencies, exaggerations, and unsupported claims in text',
    icon: '🕵️',
    category: 'Analysis',
    color: 'from-red-500 to-pink-600',
    hoverColor: 'from-red-600 to-pink-700',
    popularity: 4
  },
  {
    id: 'argument',
    title: 'Argument Analysis',
    description: 'Analyze argument structure, logical fallacies, and rhetorical strategies',
    icon: '💭',
    category: 'Analysis',
    color: 'from-yellow-500 to-orange-600',
    hoverColor: 'from-yellow-600 to-orange-700',
    popularity: 3
  },
  {
    id: 'not_legal_advice',
    title: '(NOT) Legal Advice',
    description: 'Judicial-style educational evaluation of briefs, motions, and arguments with likelihood scores (not legal advice).',
    icon: '⚖️',
    category: 'Analysis',
    color: 'from-slate-600 to-zinc-700',
    hoverColor: 'from-slate-500 to-zinc-600',
    popularity: 4
  },
  {
    id: 'romance_indicator',
    title: 'Romance Indicator',
    description: 'Detect romantic interest and analyze interpersonal dynamics in conversations',
    icon: '💕',
    category: 'Relationships',
    color: 'from-pink-500 to-rose-600',
    hoverColor: 'from-pink-600 to-rose-700',
    popularity: 4
  },
  {
    id: 'emotion_analysis',
    title: 'Emotion Analysis',
    description: 'Comprehensive emotional intelligence and emotional pattern analysis',
    icon: '😊',
    category: 'Psychology',
    color: 'from-violet-500 to-purple-600',
    hoverColor: 'from-violet-600 to-purple-700',
    popularity: 3
  },
  {
    id: 'hidden_talent',
    title: 'Hidden Talent Finder',
    description: 'Discover unique, rare, or underappreciated talents and skills from conversation patterns',
    icon: '✨',
    category: 'Discovery',
    color: 'from-amber-500 to-yellow-600',
    hoverColor: 'from-amber-600 to-yellow-700',
    popularity: 3
  },
  {
    id: 'iq_estimation',
    title: 'IQ Estimation',
    description: 'Comprehensive cognitive ability assessment including verbal intelligence, reasoning patterns, and estimated IQ range',
    icon: '🧮',
    category: 'Psychology',
    color: 'from-indigo-500 to-purple-600',
    hoverColor: 'from-indigo-600 to-purple-700',
    popularity: 4
  },
  {
    id: 'conflict_resolution',
    title: 'Conflict Resolution',
    description: 'Analyze personality dynamics and provide conflict resolution strategies',
    icon: '🤝',
    category: 'Relationships',
    color: 'from-green-500 to-emerald-600',
    hoverColor: 'from-green-600 to-emerald-700',
    popularity: 3
  },
  {
    id: 'cultural_compatibility',
    title: 'Cultural Compatibility',
    description: 'Assess personality compatibility with different cultural environments',
    icon: '🌍',
    category: 'Culture',
    color: 'from-teal-500 to-cyan-600',
    hoverColor: 'from-teal-600 to-cyan-700',
    popularity: 2
  },
  {
    id: 'comparative_analysis',
    title: 'Comparative Analysis',
    description: 'Compare personalities and interaction patterns between multiple participants',
    icon: '📊',
    category: 'Analysis',
    color: 'from-slate-500 to-gray-600',
    hoverColor: 'from-slate-600 to-gray-700',
    popularity: 2
  },
  {
    id: 'evolution_tracking',
    title: 'Evolution Tracking',
    description: 'Track personality development and changes over time periods',
    icon: '📈',
    category: 'Analysis',
    color: 'from-indigo-500 to-blue-600',
    hoverColor: 'from-indigo-600 to-blue-700',
    popularity: 2
  },
  {
    id: 'mmpi',
    title: 'MMPI Analysis',
    description: 'Minnesota Multiphasic Personality Inventory psychological pattern analysis',
    icon: '🔬',
    category: 'Psychology',
    color: 'from-cyan-500 to-blue-600',
    hoverColor: 'from-cyan-600 to-blue-700',
    popularity: 2
  },
  {
    id: 'live_interview',
    title: 'Live Interview',
    description: 'Adaptive personality interview with real-time assessment across multiple modes',
    icon: '🎙️',
    category: 'Interactive',
    color: 'from-rose-500 to-pink-600',
    hoverColor: 'from-rose-600 to-pink-700',
    popularity: 3
  },
  {
    id: 'comprehensive',
    title: 'Comprehensive Analysis',
    description: 'Complete personality assessment combining multiple psychological frameworks and deep behavioral analysis',
    icon: '🔬',
    category: 'Psychology',
    color: 'from-purple-500 to-indigo-600',
    hoverColor: 'from-purple-600 to-indigo-700',
    popularity: 5
  },
  {
    id: 'psychological_patterns',
    title: 'Psychological Patterns',
    description: 'Advanced pattern recognition analysis using clinical psychological assessment methodologies',
    icon: '🧩',
    category: 'Psychology',
    color: 'from-blue-500 to-cyan-600',
    hoverColor: 'from-blue-600 to-cyan-700',
    popularity: 4
  },
  {
    id: 'argument_referee',
    title: 'Argument Referee',
    description: 'Impartial analysis of debate quality, logical consistency, and argumentative effectiveness',
    icon: '⚖️',
    category: 'Analysis',
    color: 'from-yellow-500 to-orange-600',
    hoverColor: 'from-yellow-600 to-orange-700',
    popularity: 3
  }
];

// Expose for other components (e.g., SplashScreen feature list)
try { window.ANALYSIS_TYPES = ANALYSIS_TYPES; } catch (_) {}

// Category configurations
const CATEGORIES = [
  { id: 'all', label: 'All Analyses', icon: '🔍' },
  { id: 'Psychology', label: 'Psychology', icon: '🧠' },
  { id: 'Analysis', label: 'Analysis', icon: '📊' },
  { id: 'Relationships', label: 'Relationships', icon: '💕' },
  { id: 'Social', label: 'Social', icon: '👥' },
  { id: 'Career', label: 'Career', icon: '💼' },
  { id: 'Culture', label: 'Culture', icon: '🌍' },
  { id: 'Discovery', label: 'Discovery', icon: '✨' },
  { id: 'Interactive', label: 'Interactive', icon: '🎙️' }
];

// Analysis card component
const COMING_SOON_IDS = new Set(['cultural_compatibility','comparative_analysis','live_interview']);

const AnalysisCard = window.React.memo(({ analysis, onSelect, isSelected }) => {
  const [isHovered, setIsHovered] = window.React.useState(false);
  const isComingSoon = COMING_SOON_IDS.has(analysis.id);
  
  const handleClick = window.React.useCallback(() => {
    console.log(`MainMenu: Analysis type selected: ${analysis.id}`);
    onSelect(analysis);
  }, [analysis, onSelect]);

  const handleMouseEnter = window.React.useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = window.React.useCallback(() => setIsHovered(false), []);

  return window.React.createElement(
    'div',
    {
      className: `
        relative group cursor-pointer transform transition-all duration-300 ease-out
        ${isHovered ? 'scale-105 -translate-y-2' : 'scale-100'}
        ${isSelected ? 'ring-2 ring-white/50' : ''}
        ${isComingSoon ? 'opacity-60' : ''}
      `,
      onClick: () => { if(!isComingSoon) handleClick(); },
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    },
    [
      // Card background with gradient
      window.React.createElement(
        'div',
        {
          key: 'card-bg',
          className: `
            relative overflow-hidden rounded-2xl p-6 h-48
            bg-gradient-to-br ${isHovered ? analysis.hoverColor : analysis.color}
            shadow-lg hover:shadow-2xl transition-all duration-300
            border border-white/10 hover:border-white/20
          `
        },
        [
          // Coming Soon ribbon
          isComingSoon && window.React.createElement(
            'div',
            { key: 'ribbon', className: 'absolute -rotate-6 top-4 right-[-20px] bg-yellow-400 text-black px-3 py-1 font-bold shadow z-10' },
            'COMING SOON'
          ),
          // Animated background effect
          window.React.createElement(
            'div',
            {
              key: 'bg-effect',
              className: `
                absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                bg-gradient-to-r from-white/20 to-transparent
              `
            }
          ),
          
          // Icon
          window.React.createElement(
            'div',
            {
              key: 'icon',
              className: 'text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300'
            },
            analysis.icon
          ),
          
          // Title
          window.React.createElement(
            'h3',
            {
              key: 'title',
              className: 'text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors'
            },
            analysis.title
          ),
          
          // Description
          window.React.createElement(
            'p',
            {
              key: 'description',
              className: 'text-sm text-white/80 leading-relaxed line-clamp-3'
            },
            analysis.description
          ),
          
          // Category badge
          window.React.createElement(
            'div',
            {
              key: 'category',
              className: 'absolute top-4 right-4'
            },
            window.React.createElement(
              'span',
              {
                className: 'px-2 py-1 text-xs font-medium bg-white/20 text-white rounded-full backdrop-blur-sm'
              },
              analysis.category
            )
          ),
          
          // (Removed popularity stars per request)
        ]
      )
    ]
  );
});

// Category filter component
const CategoryFilter = window.React.memo(({ categories, selectedCategory, onCategorySelect }) => {
  return window.React.createElement(
    'div',
    { className: 'flex flex-wrap gap-2 mb-8 justify-center' },
    categories.map(category =>
      window.React.createElement(
        'button',
        {
          key: category.id,
          onClick: () => onCategorySelect(category.id),
          className: `
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${selectedCategory === category.id
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }
            border border-gray-600/30 hover:border-gray-500/50
            backdrop-blur-sm
          `
        },
        [
          window.React.createElement('span', { key: 'icon', className: 'mr-2' }, category.icon),
          window.React.createElement('span', { key: 'label' }, category.label)
        ]
      )
    )
  );
});

// Search component
const SearchInput = window.React.memo(({ searchTerm, onSearchChange }) => {
  const handleChange = window.React.useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return window.React.createElement(
    'div',
    { className: 'relative max-w-md mx-auto mb-8' },
    [
      window.React.createElement(
        'div',
        {
          key: 'search-icon',
          className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'
        },
        window.React.createElement(
          'svg',
          {
            className: 'h-5 w-5 text-gray-400',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          },
          window.React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          })
        )
      ),
      window.React.createElement('input', {
        key: 'search-input',
        type: 'text',
        placeholder: 'Search analysis types...',
        value: searchTerm,
        onChange: handleChange,
        className: `
          w-full pl-10 pr-4 py-3 
          bg-gray-800/50 border border-gray-600/30 
          rounded-xl text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          backdrop-blur-sm transition-all duration-200
        `
      })
    ]
  );
});

// Main menu component
const MainMenu = window.React.memo(({ onSelectAnalysis }) => {
  console.log("MainMenu: rendering main menu component");
  
  const [selectedCategory, setSelectedCategory] = window.React.useState('all');
  const [searchTerm, setSearchTerm] = window.React.useState('');
  const [selectedAnalysis, setSelectedAnalysis] = window.React.useState(null);

  // Global entrance animation trigger so SplashScreen can call it
  const animateGridEntrance = window.React.useCallback(() => {
    try {
      const grid = document.querySelector('#analysis-grid');
      if (!grid) return;
      const cards = Array.from(grid.children);
      cards.forEach((el, idx) => {
        try {
          el.style.willChange = 'transform, opacity';
          el.style.transition = 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms ease';
          el.style.transform = 'translateY(16px)';
          el.style.opacity = '0';
          setTimeout(() => {
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
          }, 120 + idx * 60);
        } catch (_) {}
      });
    } catch (e) {
      console.warn('MainMenu entrance animation error:', e);
    }
  }, []);

  window.React.useEffect(() => {
    // expose globally
    window.__animateMainMenu = animateGridEntrance;
    // Run if splash signaled it
    if (window.__shouldAnimateMainMenu) {
      animateGridEntrance();
      window.__shouldAnimateMainMenu = false;
    }
    return () => { if (window.__animateMainMenu === animateGridEntrance) window.__animateMainMenu = null; };
  }, [animateGridEntrance]);

  // Filter analyses based on category and search
  const filteredAnalyses = window.React.useMemo(() => {
    let filtered = ANALYSIS_TYPES;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(analysis => analysis.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(analysis =>
        analysis.title.toLowerCase().includes(searchLower) ||
        analysis.description.toLowerCase().includes(searchLower) ||
        analysis.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by popularity then alphabetically
    return filtered.sort((a, b) => {
      if (a.popularity !== b.popularity) {
        return b.popularity - a.popularity;
      }
      return a.title.localeCompare(b.title);
    });
  }, [selectedCategory, searchTerm]);

  // Handle analysis selection
  const handleAnalysisSelect = window.React.useCallback((analysis) => {
    console.log("MainMenu: Analysis selected:", analysis.id);
    setSelectedAnalysis(analysis);
    
    // Call parent handler with the correct prop name
    if (onSelectAnalysis) {
      console.log("MainMenu: Calling onSelectAnalysis with:", analysis);
      onSelectAnalysis(analysis);
    } else {
      console.error("MainMenu: onSelectAnalysis callback not provided!");
    }
  }, [onSelectAnalysis]);

  // Handle category selection
  const handleCategorySelect = window.React.useCallback((categoryId) => {
    console.log("MainMenu: Category selected:", categoryId);
    setSelectedCategory(categoryId);
  }, []);

  // Handle search change
  const handleSearchChange = window.React.useCallback((term) => {
    setSearchTerm(term);
  }, []);

  return window.React.createElement(
    'div',
    { className: 'min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' },
    [
      // Background effects
      window.React.createElement(
        'div',
        {
          key: 'bg-effects',
          className: 'fixed inset-0 overflow-hidden pointer-events-none'
        },
        [
          window.React.createElement(
            'div',
            {
              key: 'gradient-1',
              className: 'absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse'
            }
          ),
          window.React.createElement(
            'div',
            {
              key: 'gradient-2',
              className: 'absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000'
            }
          )
        ]
      ),

      // Main content
      window.React.createElement(
        'div',
        {
          key: 'main-content',
          className: 'relative z-10 container mx-auto px-4 py-12'
        },
        [
          // Header
          window.React.createElement(
            'div',
            {
              key: 'header',
              className: 'text-center mb-12'
            },
            [
              window.React.createElement(
                'h1',
                {
                  key: 'title',
                  className: 'text-5xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'
                },
                'ConversaTrait Analysis Hub'
              ),
              window.React.createElement(
                'p',
                {
                  key: 'subtitle',
                  className: 'text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed'
                },
                'Choose your analysis type to unlock deep personality insights from conversation data'
              ),
              window.React.createElement(
                'div',
                {
                  key: 'stats',
                  className: 'flex justify-center space-x-8 mt-8 text-sm text-gray-400'
                },
                [
                  window.React.createElement(
                    'div',
                    { key: 'total-analyses', className: 'flex items-center' },
                    [
                      window.React.createElement('span', { key: 'icon', className: 'mr-2' }, '🔬'),
                      window.React.createElement('span', { key: 'text' }, `${ANALYSIS_TYPES.length} Analysis Types`)
                    ]
                  ),
                  window.React.createElement(
                    'div',
                    { key: 'categories', className: 'flex items-center' },
                    [
                      window.React.createElement('span', { key: 'icon', className: 'mr-2' }, '📁'),
                      window.React.createElement('span', { key: 'text' }, `${CATEGORIES.length - 1} Categories`)
                    ]
                  )
                ]
              )
            ]
          ),

          // Search
          window.React.createElement(SearchInput, {
            key: 'search',
            searchTerm: searchTerm,
            onSearchChange: handleSearchChange
          }),

          // Category filter
          window.React.createElement(CategoryFilter, {
            key: 'category-filter',
            categories: CATEGORIES,
            selectedCategory: selectedCategory,
            onCategorySelect: handleCategorySelect
          }),

          // Results count
          window.React.createElement(
            'div',
            {
              key: 'results-count',
              className: 'text-center mb-8'
            },
            window.React.createElement(
              'p',
              { className: 'text-gray-400' },
              `Showing ${filteredAnalyses.length} analysis type${filteredAnalyses.length !== 1 ? 's' : ''}`
            )
          ),

          // Analysis cards grid
          window.React.createElement(
            'div',
            {
              key: 'analysis-grid',
              id: 'analysis-grid',
              className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto'
            },
            filteredAnalyses.map(analysis =>
              window.React.createElement(AnalysisCard, {
                key: analysis.id,
                analysis: analysis,
                onSelect: handleAnalysisSelect,
                isSelected: selectedAnalysis?.id === analysis.id
              })
            )
          ),

          // No results message
          filteredAnalyses.length === 0 && window.React.createElement(
            'div',
            {
              key: 'no-results',
              className: 'text-center py-16'
            },
            [
              window.React.createElement(
                'div',
                {
                  key: 'icon',
                  className: 'text-6xl text-gray-600 mb-4'
                },
                '🔍'
              ),
              window.React.createElement(
                'h3',
                {
                  key: 'title',
                  className: 'text-xl font-semibold text-gray-400 mb-2'
                },
                'No analyses found'
              ),
              window.React.createElement(
                'p',
                {
                  key: 'message',
                  className: 'text-gray-500'
                },
                'Try adjusting your search or category filter'
              )
            ]
          ),

          // Footer
          window.React.createElement(
            'div',
            {
              key: 'footer',
              className: 'text-center mt-16 pt-8 border-t border-gray-800'
            },
            window.React.createElement(
              'p',
              { className: 'text-gray-500 text-sm' },
              'Select an analysis type to begin your personality exploration journey'
            )
          )
        ]
      )
    ]
  );
});

// Set display name for debugging
MainMenu.displayName = 'MainMenu';

// Component registration
try {
  console.log("MainMenu: Registering component...");
  window.MainMenu = MainMenu;
  window.componentLoadMonitor?.log('MainMenu');
  console.log('✅ MainMenu: Component registered successfully');
} catch (error) {
  console.error('❌ MainMenu: Registration failed:', error);
}

console.log("MainMenu.js: file parsed and executed successfully");
