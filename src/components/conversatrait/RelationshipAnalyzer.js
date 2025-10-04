/**
 * RelationshipAnalyzer component for analyzing relationship dynamics
 */
const RelationshipAnalyzer = React.forwardRef(({
  content = '',
  className = '',
  onAnalysis,
  hasApiKey = true,
  ...props
}, ref) => {
  // Import service instance
  const relationshipAnalyzer = window.RelationshipAnalyzer ?
    new window.RelationshipAnalyzer() : null;

  // Component state
  const [analysis, setAnalysis] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Colors for different relationship aspects
  const COLORS = {
    positive: '#34D399', // Emerald
    neutral: '#F59E0B', // Amber
    negative: '#F87171', // Red
    accent: '#6366F1', // Indigo
    text: {
      primary: '#F9FAFB',
      secondary: '#9CA3AF'
    }
  };

  // Chart configurations
  const chartConfigs = {
    dimensions: {
      width: 300,
      height: 200,
      margin: { top: 20, right: 20, bottom: 30, left: 40 }
    },
    animation: {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  };

  // Analyze relationship dynamics
  const analyzeRelationship = React.useCallback(async () => {
  // API key gating removed; backend provides default key
    if (!content.trim() || !relationshipAnalyzer || loading) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const result = await relationshipAnalyzer.analyzeRelationship(content);
      setAnalysis(result);
      onAnalysis?.(result);
    } catch (err) {
      setError(err.message || 'Failed to analyze relationship dynamics');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, [content, relationshipAnalyzer, loading, onAnalysis]);

  // Trigger analysis when content changes
  React.useEffect(() => {
    analyzeRelationship();
  }, [content, analyzeRelationship]);

  // Render visualizations based on analysis data
  const renderVisualizations = () => {
    if (!analysis) return null;

    return [
      // Relationship Type
      React.createElement(
        'div',
        {
          key: 'type',
          className: 'space-y-4'
        },
        [
          React.createElement(
            'h3',
            {
              key: 'title',
              className: 'text-lg font-semibold text-white'
            },
            'Relationship Type'
          ),
          React.createElement(
            'div',
            {
              key: 'content',
              className: 'p-4 rounded-lg border border-white/10'
            },
            [
              React.createElement(
                'div',
                {
                  key: 'type-badge',
                  className: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  style: {
                    backgroundColor: `${COLORS.accent}20`,
                    color: COLORS.accent
                  }
                },
                analysis.type.label
              ),
              React.createElement(
                'div',
                {
                  key: 'confidence',
                  className: 'mt-2 text-sm text-gray-400'
                },
                `${Math.round(analysis.type.confidence * 100)}% confidence`
              )
            ]
          )
        ]
      ),

      // Dimensions Analysis
      React.createElement(
        'div',
        {
          key: 'dimensions',
          className: 'space-y-4'
        },
        [
          React.createElement(
            'h3',
            {
              key: 'title',
              className: 'text-lg font-semibold text-white'
            },
            'Relationship Dimensions'
          ),
          React.createElement(
            'div',
            {
              key: 'dimensions-grid',
              className: 'grid grid-cols-2 gap-4'
            },
            Object.entries(analysis.dimensions).map(([dimension, data]) =>
              React.createElement(
                'div',
                {
                  key: dimension,
                  className: 'p-4 rounded-lg border border-white/10'
                },
                [
                  React.createElement(
                    'div',
                    {
                      key: 'label',
                      className: 'font-medium mb-2'
                    },
                    dimension.charAt(0).toUpperCase() + dimension.slice(1)
                  ),
                  React.createElement(
                    'div',
                    {
                      key: 'score',
                      className: 'relative h-2 bg-white/10 rounded-full overflow-hidden'
                    },
                    React.createElement(
                      'div',
                      {
                        className: 'absolute inset-y-0 left-0 transition-all duration-500 rounded-full',
                        style: {
                          inlineSize: `${Math.round(data.score * 100)}%`,
                          backgroundColor: COLORS.accent
                        }
                      }
                    )
                  ),
                  React.createElement(
                    'div',
                    {
                      key: 'evidence',
                      className: 'mt-2 text-sm text-gray-400'
                    },
                    data.evidence.join(', ')
                  )
                ]
              )
            )
          )
        ]
      ),

      // Attachment Pattern
      React.createElement(
        'div',
        {
          key: 'attachment',
          className: 'space-y-4'
        },
        [
          React.createElement(
            'h3',
            {
              key: 'title',
              className: 'text-lg font-semibold text-white'
            },
            'Attachment Style'
          ),
          React.createElement(
            'div',
            {
              key: 'content',
              className: 'p-4 rounded-lg border border-white/10 space-y-4'
            },
            [
              React.createElement(
                'div',
                {
                  key: 'header',
                  className: 'flex items-center justify-between'
                },
                [
                  React.createElement(
                    'div',
                    {
                      key: 'pattern-badge',
                      className: 'px-3 py-1 rounded-full text-sm font-medium',
                      style: {
                        backgroundColor: `${COLORS.positive}20`,
                        color: COLORS.positive
                      }
                    },
                    analysis.attachment.label
                  ),
                  React.createElement(
                    'div',
                    {
                      key: 'confidence',
                      className: 'text-sm text-gray-400'
                    },
                    `${Math.round(analysis.attachment.confidence * 100)}% confidence`
                  )
                ]
              ),
              React.createElement(
                'ul',
                {
                  key: 'indicators',
                  className: 'space-y-2 text-sm text-gray-400'
                },
                analysis.attachment.indicators.map((indicator, i) =>
                  React.createElement(
                    'li',
                    {
                      key: i,
                      className: 'flex items-start space-x-2'
                    },
                    [
                      React.createElement(
                        'span',
                        {
                          key: 'bullet',
                          className: 'mt-1.5 w-1 h-1 rounded-full bg-gray-500'
                        }
                      ),
                      React.createElement(
                        'span',
                        {
                          key: 'text'
                        },
                        indicator
                      )
                    ]
                  )
                )
              )
            ]
          )
        ]
      ),

      // Communication Patterns
      React.createElement(
        'div',
        {
          key: 'communication',
          className: 'space-y-4'
        },
        [
          React.createElement(
            'h3',
            {
              key: 'title',
              className: 'text-lg font-semibold text-white'
            },
            'Communication Patterns'
          ),
          React.createElement(
            'div',
            {
              key: 'patterns-grid',
              className: 'grid grid-cols-2 gap-4'
            },
            Object.entries(analysis.communication).map(([pattern, data]) =>
              React.createElement(
                'div',
                {
                  key: pattern,
                  className: 'p-4 rounded-lg border border-white/10'
                },
                [
                  React.createElement(
                    'div',
                    {
                      key: 'header',
                      className: 'font-medium mb-2'
                    },
                    pattern.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' ')
                  ),
                  React.createElement(
                    'div',
                    {
                      key: 'score',
                      className: 'relative h-2 bg-white/10 rounded-full overflow-hidden'
                    },
                    React.createElement(
                      'div',
                      {
                        className: 'absolute inset-y-0 left-0 transition-all duration-500 rounded-full',
                        style: {
                          inlineSize: `${Math.round(data.score * 100)}%`,
                          backgroundColor: data.score > 0.7 ? COLORS.positive :
                            data.score > 0.4 ? COLORS.neutral : COLORS.negative
                        }
                      }
                    )
                  ),
                  data.matches.length > 0 && React.createElement(
                    'div',
                    {
                      key: 'evidence',
                      className: 'mt-2 text-sm text-gray-400'
                    },
                    data.matches.join(', ')
                  )
                ]
              )
            )
          )
        ]
      ),

      // Challenges & Strengths
      React.createElement(
        'div',
        {
          key: 'challenges-strengths',
          className: 'grid grid-cols-2 gap-6'
        },
        [
          // Challenges
          React.createElement(
            'div',
            {
              key: 'challenges',
              className: 'space-y-4'
            },
            [
              React.createElement(
                'h3',
                {
                  key: 'title',
                  className: 'text-lg font-semibold text-white'
                },
                'Challenges'
              ),
              React.createElement(
                'ul',
                {
                  key: 'list',
                  className: 'space-y-2 text-sm text-gray-400'
                },
                analysis.challenges.map((challenge, i) =>
                  React.createElement(
                    'li',
                    {
                      key: i,
                      className: 'flex items-start space-x-2'
                    },
                    [
                      React.createElement(
                        'span',
                        {
                          key: 'bullet',
                          className: 'mt-1.5 w-1 h-1 rounded-full bg-gray-500'
                        }
                      ),
                      React.createElement(
                        'span',
                        {
                          key: 'text'
                        },
                        `${challenge.type}: ${challenge.evidence}`
                      )
                    ]
                  )
                )
              )
            ]
          ),

          // Strengths
          React.createElement(
            'div',
            {
              key: 'strengths',
              className: 'space-y-4'
            },
            [
              React.createElement(
                'h3',
                {
                  key: 'title',
                  className: 'text-lg font-semibold text-white'
                },
                'Strengths'
              ),
              React.createElement(
                'ul',
                {
                  key: 'list',
                  className: 'space-y-2 text-sm text-gray-400'
                },
                analysis.strengths.map((strength, i) =>
                  React.createElement(
                    'li',
                    {
                      key: i,
                      className: 'flex items-start space-x-2'
                    },
                    [
                      React.createElement(
                        'span',
                        {
                          key: 'bullet',
                          className: 'mt-1.5 w-1 h-1 rounded-full bg-gray-500'
                        }
                      ),
                      React.createElement(
                        'span',
                        {
                          key: 'text'
                        },
                        `${strength.type}: ${strength.evidence}`
                      )
                    ]
                  )
                )
              )
            ]
          )
        ]
      ),

      // Recommendations
      React.createElement(
        'div',
        {
          key: 'recommendations',
          className: 'space-y-4'
        },
        [
          React.createElement(
            'h3',
            {
              key: 'title',
              className: 'text-lg font-semibold text-white'
            },
            'Recommendations'
          ),
          React.createElement(
            'ul',
            {
              key: 'list',
              className: 'space-y-2 text-sm text-gray-400'
            },
            analysis.recommendations.map((recommendation, i) =>
              React.createElement(
                'li',
                {
                  key: i,
                  className: 'flex items-start space-x-2'
                },
                [
                  React.createElement(
                    'span',
                    {
                      key: 'bullet',
                      className: 'mt-1.5 w-1 h-1 rounded-full bg-gray-500'
                    }
                  ),
                  React.createElement(
                    'span',
                    {
                      key: 'text'
                    },
                    recommendation
                  )
                ]
              )
            )
          )
        ]
      )
    ];
  };

  // Error component
  const renderError = () => {
    if (!error) return null;

    return React.createElement(
      'div',
      {
        key: 'error',
        className: 'p-4 rounded-lg bg-red-500/10 border border-red-500/20'
      },
      [
        React.createElement(
          'div',
          {
            key: 'title',
            className: 'font-medium text-red-400 mb-2'
          },
          'Analysis Failed'
        ),
        React.createElement(
          'p',
          {
            key: 'message',
            className: 'text-sm text-red-300'
          },
          error
        )
      ]
    );
  };

  // Loading component
  const renderLoading = () => {
    if (!loading) return null;

    return React.createElement(
      'div',
      {
        key: 'loading',
        className: 'flex flex-col items-center justify-center py-12 space-y-4'
      },
      [
        React.createElement(
          'div',
          {
            key: 'spinner',
            className: 'w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin'
          }
        ),
        React.createElement(
          'p',
          {
            key: 'text',
            className: 'text-gray-400'
          },
          'Analyzing relationship dynamics...'
        )
      ]
    );
  };

  return React.createElement(
    'div',
    {
      ref,
      className: `space-y-6 ${className}`,
      ...props
    },
    [
  // API key warning removed
      // Error state
      renderError(),
  
      // Loading state
      renderLoading(),
  
      // Analysis results
  !loading && !error && analysis && renderVisualizations()
    ]
  );
});

RelationshipAnalyzer.displayName = 'RelationshipAnalyzer';

// Register component
try {
  window.RelationshipAnalyzer = RelationshipAnalyzer;
  window.componentLoadMonitor?.log('RelationshipAnalyzer');
} catch (error) {
  console.error('Failed to register RelationshipAnalyzer component:', error);
  window.componentLoadMonitor?.log('RelationshipAnalyzer', false);
}