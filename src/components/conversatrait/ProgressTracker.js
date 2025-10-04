/**
 * @class ProgressTracker
 * @description Real-time progress tracking component with WebSocket integration
 * Shows live analysis progress updates from the backend
 */
const ProgressTracker = React.forwardRef(({
  sessionId,
  onComplete,
  onError,
  onProgress,
  isVisible = true,
  className = '',
  ...props
}, ref) => {
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState('initializing');
  const [currentStep, setCurrentStep] = React.useState('');
  const [error, setError] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState('disconnected');

  // WebSocket connection effect
  React.useEffect(() => {
    if (!sessionId || !window.webSocketService) {
      console.warn('ProgressTracker: No session ID or WebSocket service available');
      return;
    }

    console.log('📊 ProgressTracker: Setting up WebSocket listeners for session:', sessionId);

    // Set up WebSocket listeners
    window.webSocketService.onProgress(sessionId, (data) => {
      console.log('📈 ProgressTracker: Progress update received:', data);
      setProgress(data.progress || 0);
      setStatus(data.status || 'processing');
      setCurrentStep(data.current_step || '');
      
      // Call external progress handler
      if (onProgress) {
        onProgress(data);
      }
    });

    window.webSocketService.onComplete(sessionId, (data) => {
      console.log('✅ ProgressTracker: Analysis completed:', data);
      setProgress(100);
      setStatus('completed');
      setCurrentStep('Analysis complete');
      
      // Call external completion handler
      if (onComplete) {
        onComplete(data);
      }
    });

    window.webSocketService.onError(sessionId, (data) => {
      console.error('❌ ProgressTracker: Analysis error:', data);
      setError(data.error || 'Analysis failed');
      setStatus('error');
      
      // Call external error handler
      if (onError) {
        onError(data);
      }
    });

    // Monitor connection status
    window.webSocketService.onConnectionChange((status, data) => {
      setConnectionStatus(status);
      setIsConnected(status === 'connected' || status === 'reconnected');
      
      if (status === 'error' || status === 'reconnect_error') {
        console.warn('🔌 ProgressTracker: Connection issue:', data);
      }
    });

    // Join the analysis session
    window.webSocketService.joinAnalysisSession(sessionId);

    // Cleanup function
    return () => {
      console.log('🧹 ProgressTracker: Cleaning up WebSocket listeners');
      window.webSocketService.removeSessionListeners(sessionId);
      window.webSocketService.leaveAnalysisSession(sessionId);
    };
  }, [sessionId, onComplete, onError, onProgress]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Progress bar color based on status
  const getProgressColor = () => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'error':
        return 'from-red-500 to-red-600';
      case 'processing':
      case 'analyzing':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Status icon based on current status
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return React.createElement(
          'svg',
          {
            className: 'w-5 h-5 text-green-500',
            fill: 'currentColor',
            viewBox: '0 0 20 20'
          },
          React.createElement('path', {
            fillRule: 'evenodd',
            d: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
            clipRule: 'evenodd'
          })
        );
      case 'error':
        return React.createElement(
          'svg',
          {
            className: 'w-5 h-5 text-red-500',
            fill: 'currentColor',
            viewBox: '0 0 20 20'
          },
          React.createElement('path', {
            fillRule: 'evenodd',
            d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z',
            clipRule: 'evenodd'
          })
        );
      default:
        return React.createElement(
          'svg',
          {
            className: 'w-5 h-5 text-blue-500 animate-spin',
            fill: 'none',
            viewBox: '0 0 24 24'
          },
          [
            React.createElement('circle', {
              key: 'circle',
              className: 'opacity-25',
              cx: '12',
              cy: '12',
              r: '10',
              stroke: 'currentColor',
              strokeWidth: '4'
            }),
            React.createElement('path', {
              key: 'path',
              className: 'opacity-75',
              fill: 'currentColor',
              d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
            })
          ]
        );
    }
  };

  return React.createElement(
    'div',
    {
      ref,
      className: `bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 space-y-4 ${className}`,
      ...props
    },
    [
      // Header with status
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
              key: 'status-section',
              className: 'flex items-center space-x-3'
            },
            [
              getStatusIcon(),
              React.createElement(
                'div',
                {
                  key: 'text'
                },
                [
                  React.createElement(
                    'h3',
                    {
                      key: 'title',
                      className: 'text-white font-semibold'
                    },
                    'Analysis Progress'
                  ),
                  React.createElement(
                    'p',
                    {
                      key: 'status-text',
                      className: 'text-sm text-gray-400'
                    },
                    status === 'completed' ? 'Analysis Complete' :
                    status === 'error' ? 'Analysis Failed' :
                    currentStep || 'Processing...'
                  )
                ]
              )
            ]
          ),
          React.createElement(
            'div',
            {
              key: 'progress-percent',
              className: 'text-right'
            },
            [
              React.createElement(
                'div',
                {
                  key: 'percentage',
                  className: 'text-2xl font-bold text-white'
                },
                `${Math.round(progress)}%`
              ),
              React.createElement(
                'div',
                {
                  key: 'connection-status',
                  className: `text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`
                },
                isConnected ? '🟢 Connected' : '🔴 Disconnected'
              )
            ]
          )
        ]
      ),

      // Progress bar
      React.createElement(
        'div',
        {
          key: 'progress-bar',
          className: 'space-y-2'
        },
        [
          React.createElement(
            'div',
            {
              key: 'bar-container',
              className: 'w-full bg-gray-700 rounded-full h-3 overflow-hidden'
            },
            React.createElement(
              'div',
              {
                className: `h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out`,
                style: { width: `${progress}%` }
              }
            )
          ),
          currentStep && React.createElement(
            'p',
            {
              key: 'current-step',
              className: 'text-sm text-gray-300'
            },
            `Current: ${currentStep}`
          )
        ]
      ),

      // Error display
      error && React.createElement(
        'div',
        {
          key: 'error-display',
          className: 'bg-red-900/20 border border-red-500/50 rounded-lg p-3'
        },
        [
          React.createElement(
            'h4',
            {
              key: 'error-title',
              className: 'text-red-400 font-semibold mb-1'
            },
            'Analysis Error'
          ),
          React.createElement(
            'p',
            {
              key: 'error-message',
              className: 'text-red-300 text-sm'
            },
            error
          )
        ]
      ),

      // Session info (debug)
      window.apiService?.debug && React.createElement(
        'div',
        {
          key: 'debug-info',
          className: 'text-xs text-gray-500 border-t border-gray-700 pt-2'
        },
        [
          React.createElement(
            'p',
            {
              key: 'session-id'
            },
            `Session: ${sessionId}`
          ),
          React.createElement(
            'p',
            {
              key: 'connection-details'
            },
            `WebSocket: ${connectionStatus}`
          )
        ]
      )
    ]
  );
});

ProgressTracker.displayName = 'ProgressTracker';

// Register component
try {
  window.ProgressTracker = ProgressTracker;
  window.componentLoadMonitor?.log('ProgressTracker');
  console.log('✅ ProgressTracker: Real-time progress tracking component registered successfully');
} catch (error) {
  console.error('❌ ProgressTracker: Registration failed:', error);
  window.componentLoadMonitor?.log('ProgressTracker', false);
}