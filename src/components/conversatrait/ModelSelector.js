/**
 * @class ModelSelector
 * @description Dynamic model selection component with OpenRouter API integration
 */
const ModelSelector = React.forwardRef(({
  selectedModel,
  onModelChange,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const [models, setModels] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [lastUpdated, setLastUpdated] = React.useState(null);

  // Load models on component mount
  React.useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    setError(null);
    
    try {
        console.log('ModelSelector: Fetching available models from /api/models...');
        
        const response = await fetch('/api/models');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch models' }));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const modelsResponse = await response.json();
        console.log('ModelSelector: Received response from /api/models:', JSON.stringify(modelsResponse, null, 2));
        
        // Extract the models array from the response (OpenRouter API format: {data: [...models]})
        const fetchedModels = modelsResponse.data || [];
        
        setModels(fetchedModels);
        setLastUpdated(new Date());
        
        // Cache the results
        cacheModels(fetchedModels);
        
        console.log(`ModelSelector: Loaded ${fetchedModels.length} models from API`);
        // If no model selected, choose a sensible default and notify parent
        try {
          if ((!selectedModel || selectedModel === '') && fetchedModels.length > 0) {
            const prefer = (list) => {
              return (
                list.find(m => /openai.*gpt.*(free|oss)/i.test((m.id || '') + ' ' + (m.name || ''))) ||
                list.find(m => /openai.*gpt/i.test((m.id || '') + ' ' + (m.name || ''))) ||
                list.find(m => /gpt/i.test((m.id || '') + ' ' + (m.name || ''))) ||
                list.find(m => /:free$/i.test(m.id || '')) ||
                list[0]
              );
            };
            const preferred = prefer(fetchedModels);
            onModelChange?.(preferred);
          }
        } catch (selErr) {
          console.warn('ModelSelector: Failed to auto-select default model:', selErr);
        }
        
    } catch (err) {
        console.error('ModelSelector: Failed to load models from API:', err);
        setError(`API Error: ${err.message}`);
        
        // Try to use cached models as fallback
        const cached = getCachedModels();
        if (cached && cached.models) {
            console.log('ModelSelector: Using cached models as fallback');
            setModels(cached.models);
            setLastUpdated(new Date(cached.timestamp));
        }
    } finally {
        setLoading(false);
    }
  };

  const getCachedModels = () => {
    try {
      const cached = localStorage.getItem('openrouter_models_cache');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Failed to load cached models:', error);
      return null;
    }
  };

  const cacheModels = (modelList) => {
    try {
      const cacheData = {
        models: modelList,
        timestamp: Date.now()
      };
      localStorage.setItem('openrouter_models_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache models:', error);
    }
  };


  const getModelDisplayName = (model) => {
    if (!model) return 'Select a model...';
    return model.name;
  };

  const getModelInfo = (model) => {
    if (!model) return null;
    
    const contextLength = model.context_length ? `${(model.context_length / 1000).toFixed(0)}K context` : '';
    const pricing = model.pricing?.prompt ?
      `$${(parseFloat(model.pricing.prompt) * 1000000).toFixed(4)}/M tokens` : 'Price N/A';
    
    return [contextLength, pricing].filter(Boolean).join(' • ');
  };

  return React.createElement(
    'div',
    {
      ref,
      className: `relative ${className}`,
      ...props
    },
    [
      // Model selector dropdown
      React.createElement(
        'div',
        {
          key: 'selector',
          className: 'relative'
        },
        [
          React.createElement(
            'select',
            {
              key: 'select',
              value: selectedModel || '',
              onChange: (e) => {
                const model = models.find(m => m.id === e.target.value);
                onModelChange?.(model);
              },
              disabled: disabled || loading,
              className: `
                w-full bg-gray-700 border border-gray-600 rounded-lg p-3 pr-10
                text-white text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed
                appearance-none cursor-pointer
              `
            },
            [
              React.createElement(
                'option',
                {
                  key: 'placeholder',
                  value: '',
                  disabled: true
                },
                loading ? 'Loading models...' : 'Select a model...'
              ),
              ...models.map(model =>
                React.createElement(
                  'option',
                  {
                    key: model.id,
                    value: model.id,
                    title: getModelInfo(model)
                  },
                  getModelDisplayName(model)
                )
              )
            ]
          ),
          
          // Dropdown arrow
          React.createElement(
            'div',
            {
              key: 'arrow',
              className: 'absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'
            },
            React.createElement(
              'svg',
              {
                className: 'w-4 h-4 text-gray-400',
                fill: 'none',
                stroke: 'currentColor',
                viewBox: '0 0 24 24'
              },
              React.createElement(
                'path',
                {
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  d: 'M19 9l-7 7-7-7'
                }
              )
            )
          )
        ]
      ),

      // Model info and controls
      React.createElement(
        'div',
        {
          key: 'info',
          className: 'mt-2 flex items-center justify-between text-xs text-gray-400'
        },
        [
          React.createElement(
            'div',
            {
              key: 'model-info',
              className: 'flex-1'
            },
            [
              selectedModel && React.createElement(
                'div',
                {
                  key: 'selected-info'
                },
                getModelInfo(models.find(m => m.id === selectedModel))
              ),
              lastUpdated && React.createElement(
                'div',
                {
                  key: 'updated',
                  className: 'mt-1'
                },
                `Updated: ${lastUpdated.toLocaleTimeString()}`
              )
            ]
          ),
          
          React.createElement(
            'button',
            {
              key: 'refresh',
              onClick: loadModels,
              disabled: loading,
              className: `
                px-2 py-1 rounded text-xs
                ${loading ? 'text-gray-500' : 'text-indigo-400 hover:text-indigo-300'}
                transition-colors
              `,
              title: 'Refresh model list'
            },
            loading ? '🔄' : '↻'
          )
        ]
      ),

      // Error state
      error && React.createElement(
        'div',
        {
          key: 'error',
          className: 'mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-300'
        },
        [
          React.createElement(
            'strong',
            {
              key: 'title'
            },
            'Error loading models: '
          ),
          error
        ]
      )
    ]
  );
});

ModelSelector.displayName = 'ModelSelector';

// Register component
try {
  window.ModelSelector = ModelSelector;
  window.componentLoadMonitor?.log('ModelSelector');
} catch (error) {
  console.error('Failed to register ModelSelector component:', error);
  window.componentLoadMonitor?.log('ModelSelector', false);
}