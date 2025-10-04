/**
 * @class APIConfiguration
 * @description Comprehensive API configuration component for managing providers, keys, and models
 */
const APIConfiguration = React.forwardRef(({
  onConfigurationChange,
  className = '',
  onProceedToMainMenu,
  ...props
}, ref) => {
  console.log('APIConfiguration props:', { onConfigurationChange, onProceedToMainMenu });
  const [config, setConfig] = React.useState({
    provider: 'openrouter',
    selectedModel: '',
    apiKeys: {
      openrouter: '',
      openai: '',
      anthropic: '',
      google: '',
      deepseek: '',
      perplexity: '',
      grok: '',
      meta: ''
    }
  });
  
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  // Provider configurations
  const PROVIDERS = {
    openrouter: {
      name: 'OpenRouter',
      description: 'Access to multiple AI models through one API',
      website: 'https://openrouter.ai',
      keyFormat: 'sk-or-v1-...',
      icon: '🔀'
    },
    openai: {
      name: 'OpenAI',
      description: 'GPT models (GPT-4, GPT-3.5, etc.)',
      website: 'https://platform.openai.com',
      keyFormat: 'sk-...',
      icon: '🤖'
    },
    anthropic: {
      name: 'Anthropic',
      description: 'Claude models (Claude-3, Claude-2, etc.)',
      website: 'https://console.anthropic.com',
      keyFormat: 'sk-ant-...',
      icon: '🧠'
    },
    google: {
      name: 'Google AI',
      description: 'Gemini models (Gemini Pro, Ultra, etc.)',
      website: 'https://ai.google.dev',
      keyFormat: 'AIza...',
      icon: '🔍'
    },
    deepseek: {
      name: 'DeepSeek',
      description: 'DeepSeek models for coding and reasoning',
      website: 'https://platform.deepseek.com',
      keyFormat: 'sk-...',
      icon: '🔬'
    },
    perplexity: {
      name: 'Perplexity',
      description: 'Perplexity models for search and reasoning',
      website: 'https://www.perplexity.ai',
      keyFormat: 'pplx-...',
      icon: '🔎'
    },
    grok: {
      name: 'Grok (xAI)',
      description: 'Grok models by xAI',
      website: 'https://x.ai',
      keyFormat: 'xai-...',
      icon: '❌'
    },
    meta: {
      name: 'Meta',
      description: 'Llama models by Meta',
      website: 'https://llama.meta.com',
      keyFormat: 'meta-...',
      icon: '📘'
    }
  };

  // Load configuration on mount
  React.useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      console.log('APIConfiguration: Loading real configuration from backend...');
      
      // Try to load from localStorage first
      const localConfig = localStorage.getItem('conversatrait_api_config');
      if (localConfig) {
        const parsed = JSON.parse(localConfig);
        setConfig(prev => ({ ...prev, ...parsed }));
      }

      // Load from real backend using APIService
      const serverConfig = await window.apiService.getApiConfig();
      
      if (serverConfig.llm_credentials || serverConfig.settings) {
        const newConfig = {
          provider: serverConfig.settings?.default_provider || 'openrouter',
          selectedModel: serverConfig.settings?.default_model || '',
          apiKeys: {
            openrouter: serverConfig.llm_credentials?.openrouter?.api_key || '',
            openai: serverConfig.llm_credentials?.openai?.api_key || '',
            anthropic: serverConfig.llm_credentials?.anthropic?.api_key || '',
            google: serverConfig.llm_credentials?.google?.api_key || '',
            deepseek: serverConfig.llm_credentials?.deepseek?.api_key || '',
            perplexity: serverConfig.llm_credentials?.perplexity?.api_key || '',
            grok: serverConfig.llm_credentials?.grok?.api_key || '',
            meta: serverConfig.llm_credentials?.meta?.api_key || ''
          }
        };
        setConfig(newConfig);
        console.log('✅ Real configuration loaded from backend successfully');
      }
    } catch (error) {
      console.error('❌ Failed to load real configuration from backend:', error);
      setError('Failed to load configuration from server: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('APIConfiguration: Saving real configuration to backend...');
      
      // Save to localStorage
      localStorage.setItem('conversatrait_api_config', JSON.stringify(config));
      
      // Prepare configuration for real backend
      const serverConfig = {
        llm_credentials: {},
        settings: {
          default_provider: config.provider,
          default_model: config.selectedModel
        }
      };

      // Add API keys for each provider
      Object.entries(config.apiKeys).forEach(([provider, apiKey]) => {
        if (apiKey.trim()) {
          serverConfig.llm_credentials[provider] = {
            provider: provider,
            api_key: apiKey.trim()
          };
        }
      });

      // Send to real backend using APIService
      const response = await window.apiService.updateApiConfig(serverConfig);

      // Validate API key for the selected provider after saving
      const selectedProvider = config.provider;
      const selectedApiKey = config.apiKeys[selectedProvider];
      let validationPassed = true;
      try {
        if (selectedApiKey && selectedApiKey.trim()) {
          await window.apiService.validateApiKey(selectedApiKey.trim());
        }
      } catch (validationError) {
        validationPassed = false;
        setError('API key validation failed: ' + (validationError.message || 'Invalid API key.'));
        setSuccess(null);
        return;
      }

      if (validationPassed) {
        setSuccess('Configuration saved and API key validated!');
        
        // CRITICAL FIX: Update the global APIService instance with the new config
        if (window.apiService) {
          console.log('APIConfiguration: Updating global apiService instance.');
          window.apiService.updateConfiguration(config);
        }

        onConfigurationChange?.(config);
        setTimeout(() => setSuccess(null), 3000);
        console.log('✅ Real configuration saved and API key validated.');
      }
      
    } catch (error) {
      console.error('❌ Failed to save real configuration to backend:', error);
      setError(error.message || 'Failed to save configuration to backend');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateApiKey = (provider, apiKey) => {
    setConfig(prev => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [provider]: apiKey
      }
    }));
  };

  const validateApiKey = (provider, apiKey) => {
    if (!apiKey.trim()) return true; // Empty is valid (optional)
    
    const expected = PROVIDERS[provider]?.keyFormat;
    if (!expected) return true;
    
    // Basic format validation
    if (expected.includes('...')) {
      const prefix = expected.split('...')[0];
      return apiKey.startsWith(prefix);
    }
    
    return true;
  };

  const getProviderStatus = (provider) => {
    const apiKey = config.apiKeys[provider];
    if (!apiKey) return 'not-configured';
    if (!validateApiKey(provider, apiKey)) return 'invalid';
    return 'configured';
  };

  const renderProviderCard = (providerId) => {
    const provider = PROVIDERS[providerId];
    const status = getProviderStatus(providerId);
    const apiKey = config.apiKeys[providerId] || '';
    
    return React.createElement(
      'div',
      {
        key: providerId,
        className: `
          border rounded-lg p-4 space-y-3
          ${status === 'configured' ? 'border-green-500/50 bg-green-500/5' : ''}
          ${status === 'invalid' ? 'border-red-500/50 bg-red-500/5' : ''}
          ${status === 'not-configured' ? 'border-gray-600 bg-gray-800/50' : ''}
        `
      },
      [
        // Provider header
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
                key: 'info',
                className: 'flex items-center space-x-3'
              },
              [
                React.createElement(
                  'span',
                  {
                    key: 'icon',
                    className: 'text-2xl'
                  },
                  provider.icon
                ),
                React.createElement(
                  'div',
                  {
                    key: 'details'
                  },
                  [
                    React.createElement(
                      'h3',
                      {
                        key: 'name',
                        className: 'font-semibold text-white'
                      },
                      provider.name
                    ),
                    React.createElement(
                      'p',
                      {
                        key: 'description',
                        className: 'text-sm text-gray-400'
                      },
                      provider.description
                    )
                  ]
                )
              ]
            ),
            
            React.createElement(
              'div',
              {
                key: 'status',
                className: `
                  px-2 py-1 rounded text-xs font-medium
                  ${status === 'configured' ? 'bg-green-500/20 text-green-300' : ''}
                  ${status === 'invalid' ? 'bg-red-500/20 text-red-300' : ''}
                  ${status === 'not-configured' ? 'bg-gray-500/20 text-gray-400' : ''}
                `
              },
              status === 'configured' ? '✓ Configured' :
              status === 'invalid' ? '✗ Invalid' :
              'Not Configured'
            )
          ]
        ),

        // API key input
        React.createElement(
          'div',
          {
            key: 'input',
            className: 'space-y-2'
          },
          [
            React.createElement(
              'label',
              {
                key: 'label',
                className: 'block text-sm font-medium text-gray-300'
              },
              `API Key (format: ${provider.keyFormat})`
            ),
            React.createElement(
              'input',
              {
                key: 'key-input',
                type: 'password',
                value: apiKey,
                onChange: (e) => updateApiKey(providerId, e.target.value),
                placeholder: `Enter your ${provider.name} API key...`,
                className: `
                  w-full bg-gray-700 border rounded-lg p-3 text-white text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${status === 'invalid' ? 'border-red-500' : 'border-gray-600'}
                `
              }
            ),
            React.createElement(
              'div',
              {
                key: 'help',
                className: 'flex items-center justify-between text-xs'
              },
              [
                React.createElement(
                  'a',
                  {
                    key: 'link',
                    href: provider.website,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: 'text-indigo-400 hover:text-indigo-300'
                  },
                  'Get API key →'
                ),
                status === 'invalid' && React.createElement(
                  'span',
                  {
                    key: 'error',
                    className: 'text-red-400'
                  },
                  'Invalid format'
                )
              ]
            )
          ]
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
      // Header
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
              key: 'title'
            },
            [
              React.createElement(
                'h2',
                {
                  key: 'h2',
                  className: 'text-2xl font-bold text-white'
                },
                'API Configuration'
              ),
              React.createElement(
                'p',
                {
                  key: 'desc',
                  className: 'text-gray-400 mt-1'
                },
                'Configure your AI provider credentials and model preferences'
              )
            ]
          ),
          
          React.createElement(
            'div',
            { key: 'actions', className: 'flex items-center space-x-4' },
            [
              React.createElement(
                'button',
                {
                  key: 'save',
                  onClick: saveConfiguration,
                  disabled: saving,
                  className: `
                    px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800
                    text-white rounded-lg font-medium transition-colors
                    disabled:cursor-not-allowed
                  `
                },
                saving ? 'Saving...' : 'Save Configuration'
              ),
              React.createElement(
                'button',
                {
                  key: 'proceed',
                  onClick: onProceedToMainMenu,
                  className: `
                    px-4 py-2 bg-gray-600 hover:bg-gray-700
                    text-white rounded-lg font-medium transition-colors
                  `,
                  title: "Go to Main Menu"
                },
                'Go to Main Menu →'
              )
            ]
          )
        ]
      ),
  // Removed prominent warning about missing API keys; backend provides defaults

      // Status messages
      success && React.createElement(
        'div',
        {
          key: 'success',
          className: 'p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300'
        },
        success
      ),

      error && React.createElement(
        'div',
        {
          key: 'error',
          className: 'p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300'
        },
        error
      ),

      // Provider selection
      React.createElement(
        'div',
        {
          key: 'provider-selection',
          className: 'space-y-4'
        },
        [
          React.createElement(
            'h3',
            {
              key: 'title',
              className: 'text-lg font-semibold text-white'
            },
            'Primary Provider'
          ),
          React.createElement(
            'select',
            {
              key: 'select',
              value: config.provider,
              onChange: (e) => updateConfig({ provider: e.target.value }),
              className: 'w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white'
            },
            Object.entries(PROVIDERS).map(([id, provider]) =>
              React.createElement(
                'option',
                {
                  key: id,
                  value: id
                },
                `${provider.icon} ${provider.name}`
              )
            )
          )
        ]
      ),

      // Model selection (only for OpenRouter)
      config.provider === 'openrouter' && React.createElement(
        'div',
        {
          key: 'model-selection',
          className: 'space-y-4'
        },
        [
          React.createElement(
            'h3',
            {
              key: 'title',
              className: 'text-lg font-semibold text-white'
            },
            'Model Selection'
          ),
          React.createElement(window.ModelSelector, {
            key: 'selector',
            selectedModel: config.selectedModel,
            onModelChange: (model) => updateConfig({ selectedModel: model?.id || '' }),
            disabled: !config.apiKeys.openrouter
          })
        ]
      ),

      // API Keys section
      React.createElement(
        'div',
        {
          key: 'api-keys',
          className: 'space-y-4'
        },
        [
          React.createElement(
            'h3',
            {
              key: 'title',
              className: 'text-lg font-semibold text-white'
            },
            'API Keys'
          ),
          React.createElement(
            'div',
            {
              key: 'grid',
              className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
            },
            Object.keys(PROVIDERS).map(providerId => renderProviderCard(providerId))
          )
        ]
      ),

      // Configuration preview
      React.createElement(
        'div',
        {
          key: 'preview',
          className: 'space-y-4'
        },
        [
          React.createElement(
            'h3',
            {
              key: 'title',
              className: 'text-lg font-semibold text-white'
            },
            'Current Configuration'
          ),
          React.createElement(
            'div',
            {
              key: 'content',
              className: 'bg-gray-800 border border-gray-700 rounded-lg p-4'
            },
            [
              React.createElement(
                'pre',
                {
                  key: 'json',
                  className: 'text-sm text-gray-300 overflow-x-auto'
                },
                JSON.stringify({
                  provider: config.provider,
                  model: config.selectedModel || 'Auto-select',
                  configured_providers: Object.entries(config.apiKeys)
                    .filter(([_, key]) => key.trim())
                    .map(([provider]) => provider)
                }, null, 2)
              )
            ]
          )
        ]
      )
    ]
  );
});

APIConfiguration.displayName = 'APIConfiguration';

// Register the component with the window object
window.APIConfiguration = APIConfiguration;

// Notify the ComponentLoadMonitor that the component has loaded
if (window.componentLoadMonitor) {
  window.componentLoadMonitor.log('APIConfiguration');
}
