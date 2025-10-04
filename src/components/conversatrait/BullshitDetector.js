const BullshitDetector = React.forwardRef(({
  content = '',
  className = '',
  ...props
}, ref) => {
  // Analysis state
  const [analysis, setAnalysis] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Import service instances
  const contentAnalyzer = window.contentAnalyzer;

  // Get categories and ratings from the service
  const CATEGORIES = contentAnalyzer.getCategories();
  const RATINGS = contentAnalyzer.getRatings();

  // Icon definitions
  const categoryIcons = {
    LOGICAL_FALLACIES: React.createElement(
      'svg',
      {
        className: 'w-5 h-5',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      },
      React.createElement('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
      })
    ),
    EMOTIONAL_MANIPULATION: React.createElement(
      'svg',
      {
        className: 'w-5 h-5',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      },
      React.createElement('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
      })
    ),
    CREDIBILITY_ISSUES: React.createElement(
      'svg',
      {
        className: 'w-5 h-5',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      },
      React.createElement('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
      })
    ),
    FACTUAL_ACCURACY: React.createElement(
      'svg',
      {
        className: 'w-5 h-5',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      },
      React.createElement('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
      })
    ),
    BIAS_INDICATORS: React.createElement(
      'svg',
      {
        className: 'w-5 h-5',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      },
      React.createElement('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
      })
    )
  };

  // Analyze content using the service
  const analyzeContent = React.useCallback(async () => {
    if (!content.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await contentAnalyzer.analyzeContent(content);
      setAnalysis(result);
    } catch (err) {
      setError(err.message || 'Failed to analyze content');
    } finally {
      setLoading(false);
    }
  }, [content, loading]);

  // Trigger analysis when content changes
  React.useEffect(() => {
    analyzeContent();
  }, [content, analyzeContent]);

  // Render component
  return React.createElement(
    Card,
    {
      ref,
      variant: 'default',
      className: `space-y-6 ${className}`,
      ...props
    },
    [
      // Loading state
      loading && React.createElement(
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
            'Analyzing credibility...'
          )
        ]
      ),

      // Error state
      error && React.createElement(
        'div',
        {
          key: 'error',
          className: 'p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400'
        },
        error
      ),

      // Analysis results
      !loading && !error && analysis && [
        // Credibility rating
        React.createElement(
          'div',
          {
            key: 'rating',
            className: 'space-y-4'
          },
          [
            React.createElement(
              'h3',
              {
                key: 'title',
                className: 'text-lg font-semibold'
              },
              'Credibility Assessment'
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
                        key: 'badge',
                        className: 'px-3 py-1 rounded-full text-sm font-medium',
                        style: {
                          backgroundColor: `${RATINGS[analysis.credibility.rating].color}20`,
                          color: RATINGS[analysis.credibility.rating].color
                        }
                      },
                      RATINGS[analysis.credibility.rating].label
                    ),
                    React.createElement(
                      'div',
                      {
                        key: 'confidence',
                        className: 'text-sm text-gray-400'
                      },
                      `${Math.round(analysis.credibility.confidence * 100)}% confidence`
                    )
                  ]
                ),
                React.createElement(
                  'p',
                  {
                    key: 'description',
                    className: 'text-sm text-gray-300'
                  },
                  RATINGS[analysis.credibility.rating].description
                ),
                React.createElement(
                  'p',
                  {
                    key: 'summary',
                    className: 'text-sm text-gray-400'
                  },
                  analysis.credibility.summary
                )
              ]
            )
          ]
        ),

        // Categories analysis
        React.createElement(
          'div',
          {
            key: 'categories',
            className: 'space-y-4'
          },
          Object.entries(analysis.categories).map(([category, data]) =>
            React.createElement(
              'div',
              {
                key: category,
                className: 'p-4 rounded-lg border border-white/10 space-y-3'
              },
              [
                React.createElement(
                  'div',
                  {
                    key: 'header',
                    className: 'flex items-center space-x-3'
                  },
                  [
                    categoryIcons[category],
                    React.createElement(
                      'h4',
                      {
                        key: 'title',
                        className: 'font-medium'
                      },
                      CATEGORIES[category].label
                    ),
                    React.createElement(
                      'div',
                      {
                        key: 'score',
                        className: 'text-sm ml-auto',
                        style: { color: CATEGORIES[category].color }
                      },
                      `${Math.round(data.score * 100)}%`
                    )
                  ]
                ),
                data.issues.length > 0 && React.createElement(
                  'ul',
                  {
                    key: 'issues',
                    className: 'text-sm text-gray-400 space-y-2'
                  },
                  data.issues.map((issue, i) =>
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
                          issue
                        )
                      ]
                    )
                  )
                )
              ]
            )
          )
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
                className: 'text-lg font-semibold'
              },
              'Recommendations'
            ),
            React.createElement(
              'ul',
              {
                key: 'list',
                className: 'text-sm text-gray-400 space-y-2'
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
      ]
    ]
  );
});

BullshitDetector.displayName = 'BullshitDetector';

// Register component
try {
  window.BullshitDetector = BullshitDetector;
  window.componentLoadMonitor?.log('BullshitDetector');
} catch (error) {
  console.error('Failed to register BullshitDetector component:', error);
  window.componentLoadMonitor?.log('BullshitDetector', false);
}