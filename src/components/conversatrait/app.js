(function(){
'use strict';

const e = React.createElement;

/**
 * A centralized and reactive container for the ConversaTrait application.
 * This component manages the application's state, view transitions, and WebSocket communication.
 * It replaces the previous imperative and non-reactive implementation with a modern React Hooks-based approach.
 *
 * @component
 */
function App() {
    // --- STATE MANAGEMENT ---
    // Manages the current view of the application ('mainMenu', 'analysis', 'apiConfig')
    const [currentView, setCurrentView] = React.useState('mainMenu');
    const [showSplash, setShowSplash] = React.useState(false);
    // Stores the configuration for the currently selected analysis type
    const [selectedAnalysisType, setSelectedAnalysisType] = React.useState(null);
    // Holds the results from the backend analysis
    const [analysisResults, setAnalysisResults] = React.useState(null);
    // Stores the type of analysis that was last run
    const [analysisType, setAnalysisType] = React.useState(null);
    // Tracks whether an analysis is currently in progress
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    // Stores the unique ID for the current analysis session
    const [currentSessionId, setCurrentSessionId] = React.useState(null);
    // Holds the user's API key status
    // FIX: Problem 3 - State Loss on Navigation
    // The `apiService` singleton is the source of truth. This state should reflect the service's status.
    const [hasApiKey, setHasApiKey] = React.useState((window.apiService && window.apiService.hasApiKey) || true);
    // Holds the latest API config error (for notification)
    const [apiConfigError, setApiConfigError] = React.useState(null);
    // Tracks the initial loading state of the application
    const [isInitializing, setIsInitializing] = React.useState(true);
    // Tracks the progress percentage of the analysis
    const [progress, setProgress] = React.useState(0);
    // Displays status messages during the analysis process
    const [statusMessage, setStatusMessage] = React.useState('');
    // Stores the ID of the client-side analysis timeout
    const [analysisTimeoutId, setAnalysisTimeoutId] = React.useState(null);
    // Keep the last submitted input text (for local persistence)
    const [lastInputText, setLastInputText] = React.useState('');
    // Keep the last selected model (for local persistence)
    const [lastSelectedModel, setLastSelectedModel] = React.useState('');
    // Track which sessions we've already persisted locally to avoid duplicates
    const savedSessionsRef = React.useRef(new Set());

    // --- LOCAL-ONLY API CONFIG LOGIC ---
    // Utility to determine if the user is local (localhost, 127.0.0.1, or ::1)
    const isLocalUser = React.useMemo(() => {
        const { hostname } = window.location;
        return (
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '[::1]'
        );
    }, []);

    // --- SERVICES ---
    // Memoize service instances to prevent re-initialization on re-renders
    const apiService = React.useMemo(() => window.apiService, []);

    // Decide whether to show splash once per session
    React.useEffect(() => {
        try {
            const seen = sessionStorage.getItem('ct_splash_seen');
            if (!seen && window.SplashScreen) {
                setShowSplash(true);
                sessionStorage.setItem('ct_splash_seen', '1');
            }
        } catch (_) {}
    }, []);

    // Persist a completed analysis locally (IndexedDB via window.storage, with localStorage fallback)
    const persistLocalAnalysis = React.useCallback((payload) => {
        try {
            if (!payload) return;
            // Build a rich record without hiding any data
            const record = {
                session_id: payload.session_id || null,
                analysis_type: payload.analysis_type || analysisType || (selectedAnalysisType && selectedAnalysisType.id) || 'unknown',
                text: lastInputText || '',
                model: payload.model || lastSelectedModel || null,
                results: payload.results || payload, // keep full payload if results not separated
                status: payload.status || 'completed',
                timestamp: new Date().toISOString()
            };

            if (window.storage && typeof window.storage.saveAnalysis === 'function') {
                window.storage.saveAnalysis(record).catch((err) => {
                    console.warn('IndexedDB saveAnalysis failed, falling back to localStorage:', err);
                    try {
                        const key = 'ct_analysis_history';
                        const existing = JSON.parse(localStorage.getItem(key) || '[]');
                        existing.unshift(record);
                        localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
                    } catch (e) {
                        console.warn('localStorage persistence failed:', e);
                    }
                });
            } else {
                // Fallback to localStorage if IndexedDB service not available
                const key = 'ct_analysis_history';
                const existing = JSON.parse(localStorage.getItem(key) || '[]');
                existing.unshift(record);
                localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
            }
        } catch (e) {
            console.warn('persistLocalAnalysis encountered an error:', e);
        }
    }, [lastInputText, lastSelectedModel, analysisType, selectedAnalysisType]);

    // --- EFFECTS ---
    
    /**
     * Effect to check the initial API key status when the component mounts.
     * Also listens for global apiKeyStatusChanged events to update hasApiKey reactively.
     */
    // FIX: Problem 3 - State Loss on Navigation
    // This effect ensures the component's state is always synchronized with the APIService singleton.
    React.useEffect(() => {
        const syncApiState = async () => {
            console.log('🔄 Synchronizing App state with APIService...');
            setIsInitializing(true);
            try {
                // Get the latest config from the service, which may hit the backend if needed.
                await apiService.getApiConfig();
                setHasApiKey(apiService.hasApiKey);
                setApiConfigError(null);
                console.log(`✅ Synchronization complete. API Key Status: ${apiService.hasApiKey}`);
            } catch (error) {
                console.error('Error synchronizing API state:', error);
                setHasApiKey(true);
                setApiConfigError(error.message || 'Failed to load API configuration.');
            } finally {
                setIsInitializing(false);
            }
        };

        syncApiState();

        // Listen for the custom event dispatched by APIService
        const handleApiKeyChange = () => {
            console.log('App detected apiKeyStatusChanged event. Re-syncing state.');
            syncApiState();
        };

        window.addEventListener('apiKeyStatusChanged', handleApiKeyChange);

        // Cleanup the event listener
        return () => {
            window.removeEventListener('apiKeyStatusChanged', handleApiKeyChange);
        };
    }, [apiService]); // Reruns only if the service instance itself changes, which it shouldn't.


    /**
     * Clears the client-side analysis timeout.
     */
    const clearAnalysisTimeout = React.useCallback(() => {
        if (analysisTimeoutId) {
            clearTimeout(analysisTimeoutId);
            setAnalysisTimeoutId(null);
        }
    }, [analysisTimeoutId]);

    /**
     * Effect to handle WebSocket event listeners for final analysis results.
     * This is the primary mechanism for receiving the final data from the backend.
     */
    React.useEffect(() => {
        const socket = apiService.webSocket;
        if (!socket || !currentSessionId) {
            return;
        }

        console.log(`🎧 App: Attaching final result listeners for session: ${currentSessionId}`);
        try {
            // Ensure we are joined to the session-specific room even if socket became ready later
            socket.emit('join_analysis', { session_id: currentSessionId });
            console.log('📡 App: Sent join_analysis for session', currentSessionId);
        } catch (err) {
            console.warn('⚠️ App: Failed to emit join_analysis:', err);
        }

        // FIX: Problem 2 - UI Race Condition & Failure to Display Results
        // This handler is now more robust, ensuring it correctly processes the final result payload
        // and updates state in a way that guarantees a re-render.
        const handleAnalysisProgress = (data) => {
            console.log('🔵 [DIAG] analysis_progress event:', {
                data,
                currentSessionId,
                dataSessionId: data.session_id,
                progress: data.progress,
                message: data.message
            });
            if (data.session_id === currentSessionId) {
                setProgress(data.progress || 0);
                setStatusMessage(data.message || 'Analysis in progress...');
                console.log('🔵 [DIAG] Progress updated:', { progress: data.progress, statusMessage: data.message });
            } else {
                console.warn('⚠️ [DIAG] Progress event session_id mismatch:', { expected: currentSessionId, got: data.session_id });
            }
        };
        
    const handleAnalysisResult = (data) => {
            console.log('✅ [DIAG] analysis_result event:', {
                data,
                currentSessionId,
                dataSessionId: data.session_id,
                analysisType: data.analysis_type,
                results: data.results
            });
            if (data.session_id === currentSessionId) {
                clearAnalysisTimeout();
        // Store the full payload so we can handle special statuses (e.g., intervention_required)
        setAnalysisResults(data || {});
    setAnalysisType(data.analysis_type || (selectedAnalysisType && selectedAnalysisType.id) || 'unknown');
                setIsAnalyzing(false);
                setProgress(100);
                setStatusMessage('Analysis complete!');
                // Persist locally once per session
                try {
                    if (data.session_id && !savedSessionsRef.current.has(data.session_id) && (data.results || data.status === 'completed')) {
                        savedSessionsRef.current.add(data.session_id);
                        persistLocalAnalysis(data);
                    }
                } catch (e) {
                    console.warn('Failed to persist analysis result locally:', e);
                }
                console.log('✅ [DIAG] Analysis results updated:', { analysisType: data.analysis_type });
            } else {
                console.warn('⚠️ [DIAG] Result event session_id mismatch:', { expected: currentSessionId, got: data.session_id });
            }
        };

        const handleAnalysisError = (data) => {
            console.error('❌ [DIAG] analysis_error event:', {
                data,
                currentSessionId,
                dataSessionId: data.session_id
            });
            if (data.session_id === currentSessionId) {
                clearAnalysisTimeout();
                setAnalysisResults({
                    error: true,
                    message: data.error || 'An unknown error occurred during analysis.',
                    details: data.details || ''
                });
                setIsAnalyzing(false);
                console.log('❌ [DIAG] Analysis error state updated.');
            } else {
                console.warn('⚠️ [DIAG] Error event session_id mismatch:', { expected: currentSessionId, got: data.session_id });
            }
        };

        socket.on('analysis_progress', handleAnalysisProgress);
        socket.on('analysis_result', handleAnalysisResult);
        socket.on('analysis_error', handleAnalysisError);

        // Cleanup function to prevent memory leaks
        return () => {
            console.log(`🧹 App: Cleaning up listeners for session: ${currentSessionId}`);
            socket.off('analysis_progress', handleAnalysisProgress);
            socket.off('analysis_result', handleAnalysisResult);
            socket.off('analysis_error', handleAnalysisError);
        };
    }, [currentSessionId, apiService, apiService.webSocket, clearAnalysisTimeout]);

    /**
     * REST fallback: Poll session status if we're analyzing but haven't received WS events.
     * Stops when completed, error, or intervention is reached.
     */
    React.useEffect(() => {
        let intervalId = null;
        let isActive = true;
        const shouldPoll = isAnalyzing && !!currentSessionId;
        if (!shouldPoll) return;

        const poll = async () => {
            try {
                const status = await apiService.getAnalysisSession(currentSessionId);
                console.log('🛰️ REST poll session status:', status);
                if (!isActive) return;

                // Update progress/status if present
                if (typeof status.progress === 'number') setProgress(status.progress);
                if (status.current_step) setStatusMessage(status.current_step);

                if (status.status === 'completed' || status.results) {
                    clearAnalysisTimeout();
                    setAnalysisResults({
                        session_id: currentSessionId,
                        analysis_type: status.analysis_type || (selectedAnalysisType && selectedAnalysisType.id) || 'unknown',
                        results: status.results,
                        status: status.status
                    });
                    setAnalysisType(status.analysis_type || (selectedAnalysisType && selectedAnalysisType.id) || 'unknown');
                    setIsAnalyzing(false);
                    setProgress(100);
                    setStatusMessage('Analysis complete!');
                    // Persist locally once per session
                    try {
                        if (currentSessionId && !savedSessionsRef.current.has(currentSessionId)) {
                            savedSessionsRef.current.add(currentSessionId);
                            persistLocalAnalysis({
                                session_id: currentSessionId,
                                analysis_type: status.analysis_type || (selectedAnalysisType && selectedAnalysisType.id) || 'unknown',
                                results: status.results,
                                status: status.status
                            });
                        }
                    } catch (e) {
                        console.warn('Failed to persist REST-polled analysis locally:', e);
                    }
                    if (intervalId) clearInterval(intervalId);
                } else if (status.status === 'intervention_required' && status.intervention) {
                    clearAnalysisTimeout();
                    setAnalysisResults({
                        session_id: currentSessionId,
                        status: 'intervention_required',
                        intervention: status.intervention
                    });
                    // Keep isAnalyzing true to allow resume after intervention, but stop polling to avoid spam
                    if (intervalId) clearInterval(intervalId);
                } else if (status.status === 'error' && status.error) {
                    clearAnalysisTimeout();
                    setAnalysisResults({ error: true, message: (status.error && status.error.message) || 'Analysis failed', details: status.error });
                    setIsAnalyzing(false);
                    if (intervalId) clearInterval(intervalId);
                }
            } catch (err) {
                console.warn('REST poll failed:', err);
                // Keep polling; transient errors can occur
            }
        };

        // Start polling every 2.5s
        poll();
        intervalId = setInterval(poll, 2500);

        return () => {
            isActive = false;
            if (intervalId) clearInterval(intervalId);
        };
    }, [isAnalyzing, currentSessionId, apiService, selectedAnalysisType, clearAnalysisTimeout]);


    /**
     * Initiates the analysis process by calling the APIService.
     * This function now only starts the analysis and sets the session ID.
     * The final result is handled by the WebSocket effect.
     */
    const handleAnalyze = React.useCallback(async (options) => {
    // API key gating removed; backend will use default configured key
        console.log('🚀 App: Initiating analysis with options:', options);
        clearAnalysisTimeout();
        setIsAnalyzing(true);
        setAnalysisResults(null);
        setProgress(0);
        setStatusMessage('Initiating analysis...');
        setCurrentSessionId(null);
        // Capture inputs for local persistence after completion
        try {
            setLastInputText((options && options.text) || '');
            setLastSelectedModel((options && options.model) || '');
        } catch (_) {}

        const timeoutId = setTimeout(() => {
            console.error('❌ Analysis timed out on client-side.');
            // This check is important to avoid setting a timeout error after a result has already been received.
            if (isAnalyzing) {
                setAnalysisResults({
                    error: true,
                    message: 'Analysis timed out. The server did not respond in time.',
                    details: `The analysis did not complete within the 150-second time limit.`
                });
                setIsAnalyzing(false);
            }
        }, 150000); // 150 seconds
        setAnalysisTimeoutId(timeoutId);

        try {
            // The onProgress callback is removed. All progress updates are now handled
            // exclusively by the central WebSocket listener effect, ensuring a single
            // source of truth and preventing race conditions.
            const initialResponse = await apiService.analyzeContent(options);

            if (initialResponse && initialResponse.session_id) {
                console.log('✅ App: Analysis session started successfully. Session ID:', initialResponse.session_id);
                setCurrentSessionId(initialResponse.session_id);
            } else {
                // This handles cases where analysis might fail to start or completes synchronously
                clearAnalysisTimeout();
                console.warn('✅ App: Analysis did not return a session_id. Handling as synchronous result.', initialResponse);
                setAnalysisResults(initialResponse);
                setIsAnalyzing(false);
                if (initialResponse && !initialResponse.error) {
                    setProgress(100);
                    setStatusMessage('Analysis complete!');
                    // Persist synchronous results immediately
                    try {
                        persistLocalAnalysis(initialResponse);
                    } catch (e) {
                        console.warn('Failed to persist synchronous analysis locally:', e);
                    }
                }
            }
        } catch (error) {
            clearAnalysisTimeout();
            console.error('❌ AppContainer: Failed to start analysis:', error);
            setAnalysisResults({
                error: true,
                message: error.message || 'Failed to start analysis',
                details: error.originalError ? JSON.stringify(error.originalError) : error.toString()
            });
            setIsAnalyzing(false);
        }
    }, [apiService, clearAnalysisTimeout, isAnalyzing, hasApiKey]);

    /**
     * Handles the selection of an analysis type from the main menu.
     */
    const handleSelectAnalysis = React.useCallback((analysis) => {
        console.log('App: Analysis selected:', analysis);
        setSelectedAnalysisType(analysis);
        // Navigate to the correct view based on the analysis ID
        if (analysis.id === 'relationship_dynamics_analysis') {
            setCurrentView('relationshipAnalysis');
        } else {
            setCurrentView('analysis');
        }
        setAnalysisResults(null); // Clear previous results when starting a new analysis
    }, []);

    /**
     * Navigates back to the main menu and resets analysis-related state.
     */
    const handleBackToMainMenu = React.useCallback(() => {
        setCurrentView(() => 'mainMenu');
        setSelectedAnalysisType(() => null);
        setAnalysisResults(() => null);
        setAnalysisType(() => null); // Reset analysis type
        setIsAnalyzing(() => false);
        setProgress(() => 0);
        setStatusMessage(() => '');
        setCurrentSessionId(() => null);
        clearAnalysisTimeout();
    }, [clearAnalysisTimeout]);

    /**
     * Handles changes to the API configuration and successful API key saves.
     */
    const handleConfigurationChange = React.useCallback(async (config) => {
        console.log('API config changed, re-validating and updating key status.');
        try {
            // Re-check the configuration from the backend to ensure it's valid
            await apiService.getApiConfig(true); // Force a refresh
            const newHasApiKey = apiService.hasApiKey;
            setHasApiKey(newHasApiKey);
            setApiConfigError(null);

            if (newHasApiKey) {
                console.log('✅ API key successfully configured, proceeding to main menu.');
                // Automatically navigate to main menu when API key is successfully saved
                setCurrentView('mainMenu');
            } else {
                console.warn('Configuration was saved, but no valid API key was found.');
            }
        } catch (error) {
            console.error('Error after configuration change:', error);
            setApiConfigError(error.message || 'Failed to update API configuration');
        }
    }, [apiService]);

    /**
     * Handles the manual navigation to main menu from API configuration.
     * Only works if API key is properly configured.
     */
    const handleProceedToMainMenu = React.useCallback(() => {
        // Allow navigation to main menu regardless of API key status
        console.log('Proceeding to main menu (API key status ignored).');
        setCurrentView('mainMenu');
    }, []);

    const handleOpenApiConfig = React.useCallback(() => {
        console.log('Opening API Configuration view.');
        setCurrentView('apiConfig');
    }, []);


    // --- RENDER LOGIC ---

    /**
     * Renders the main content of the application based on the current view.
     */
    const renderContent = () => {
        if (isInitializing) {
            return e('div', { className: 'flex justify-center items-center h-full' },
                e('div', { className: 'flex flex-col items-center space-y-4' }, [
                    e('div', {
                        key: 'spinner',
                        className: 'loading-spinner'
                    }),
                    e('div', {
                        key: 'text',
                        className: 'text-white text-lg'
                    }, 'Loading...')
                ])
            );
        }

    if (currentView === 'apiConfig') {
            return e(window.APIConfiguration, {
                onConfigurationChange: handleConfigurationChange,
                onProceedToMainMenu: handleProceedToMainMenu
            });
        }
    // apiConfigBlocked view no longer used (remote users allowed)

        switch (currentView) {
            case 'mainMenu':
                return e(window.MainMenu, { onSelectAnalysis: handleSelectAnalysis });
            case 'analysis':
                return e(window.AnalysisInterface, {
                    analysisType: selectedAnalysisType,
                    onAnalyze: handleAnalyze,
                    onBackToMainMenu: handleBackToMainMenu,
                    isAnalyzing: isAnalyzing,
                    results: analysisResults,
                    resultAnalysisType: analysisType,
                    progress: progress,
                    statusMessage: statusMessage,
                    hasApiKey: true
                });
            case 'relationshipAnalysis':
                return e(window.RelationshipAnalyzer, {
                    onAnalyze: handleAnalyze,
                    onBackToMainMenu: handleBackToMainMenu,
                    isAnalyzing: isAnalyzing,
                    results: analysisResults,
                    progress: progress,
                    statusMessage: statusMessage,
                    hasApiKey: true
                });
            default:
                return e(window.ErrorBoundary, {
                    location: 'App Unknown View',
                    fallback: e('div', { className: 'text-center text-white p-8' }, [
                        e('h2', { key: 'title', className: 'text-xl font-bold mb-4' }, 'Navigation Error'),
                        e('p', { key: 'message', className: 'text-gray-300 mb-4' }, `Unknown view: ${currentView}`),
                        e('button', {
                            key: 'home-btn',
                            onClick: handleBackToMainMenu,
                            className: 'px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition'
                        }, 'Return to Main Menu')
                    ])
                }, e('div', null, `Unknown view: ${currentView}`));
        }
    };

    // --- Keyboard Shortcut Effect (moved from renderContent) ---
    React.useEffect(() => {
        const handler = (e) => {
            if (e.ctrlKey && e.shiftKey) {
                const key = (e.key || '').toUpperCase();
                if (key === 'A') {
                    e.preventDefault();
                    setCurrentView('apiConfig');
                }
                if (key === 'M') {
                    e.preventDefault();
                    setCurrentView('mainMenu');
                }
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isLocalUser]);

    return e(
        'div',
        { key: 'app-wrapper', className: 'bg-gray-900 text-white min-h-screen' },
        [
            // Splash overlay (once per session)
            showSplash && window.SplashScreen && e(window.SplashScreen, { key: 'splash', onContinue: () => setShowSplash(false) }),
            // API key banner removed to provide a frictionless first-load experience
            e(
                'div',
                {
                    key: 'header',
            // Raise z-index above notifications so controls remain clickable
            className: 'fixed top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-sm p-4 z-[200] flex justify-between items-center border-b border-gray-700/50'
                },
                [
                    e('h1', { key: 'title', className: 'text-lg sm:text-xl font-bold text-white' }, 'ConversaTrait'),
                    e(
                        'div',
                        { key: 'header-actions', className: 'flex items-center gap-2' },
                        [
                            currentView !== 'mainMenu' && e(
                                'button',
                                {
                                    key: 'main-menu-btn',
                                    onClick: handleBackToMainMenu,
                                    className: 'px-3 py-2 text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors',
                                    'aria-label': 'Go to Main Menu'
                                },
                                'Main Menu'
                            ),
                            e(
                                'button',
                                {
                                    key: 'api-keys-btn',
                                    onClick: handleOpenApiConfig,
                                    className: 'px-3 py-2 text-sm sm:text-base bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors',
                                    'aria-label': 'Open API Keys settings',
                                    title: 'API Keys'
                                },
                                'API KEYS'
                            )
                        ]
                    )
                ]
            ),
            e(
                'div',
                { key: 'view-wrapper', className: 'pt-20' },
                renderContent()
            )
            ,
            // Mobile-only floating shortcut to API Keys in case header area is crowded on very small screens
        currentView !== 'apiConfig' && e(
                'button',
                {
                    key: 'api-keys-fab',
                    onClick: handleOpenApiConfig,
            className: 'fixed bottom-4 right-4 px-4 py-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white shadow-lg z-[250]',
                    'aria-label': 'Open API Keys settings (mobile)'
                },
                'API KEYS'
            )
        ]
    );
}

// --- INITIALIZATION ---
// Since app.js is loaded with defer, the DOM is already parsed when this executes
// No need for DOMContentLoaded listener
(function() {
    console.log('App.js: Initializing React application...');
    
    const appElement = document.getElementById('app');
    if (appElement) {
        console.log('App.js: Found #app element, creating React root...');
        try {
            // Create the React root and render the main App component.
            const root = ReactDOM.createRoot(appElement);
            root.render(e(App));
            console.log('App.js: React app rendered successfully');
        } catch (error) {
            console.error('App.js: Failed to render React app:', error);
            // Fallback error display
            appElement.innerHTML = `
                <div class="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
                    <div class="bg-red-900/50 border border-red-500/50 rounded-lg p-6 max-w-md text-center">
                        <h2 class="text-xl font-bold text-red-400 mb-4">Application Error</h2>
                        <p class="text-red-300 mb-4">Failed to start the React application.</p>
                        <p class="text-gray-400 text-sm mb-4">${error.message}</p>
                        <button onclick="window.location.reload()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                            Refresh Page
                        </button>
                    </div>
                </div>
            `;
        }
    } else {
        console.error('App.js: Failed to find the root element #app');
        // Fallback error display on body
        document.body.innerHTML = `
            <div class="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
                <div class="bg-red-900/50 border border-red-500/50 rounded-lg p-6 max-w-md text-center">
                    <h2 class="text-xl font-bold text-red-400 mb-4">Application Error</h2>
                    <p class="text-red-300 mb-4">Root element #app not found.</p>
                    <button onclick="window.location.reload()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
    }
})();

})();