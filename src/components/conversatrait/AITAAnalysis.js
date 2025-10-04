// ui_assets/web_ui/components/AITAAnalysis.js
window.AITAAnalysis = ({ analysisResults }) => {
    if (!analysisResults || !analysisResults.verdict) {
        return React.createElement('div', { className: 'text-gray-400' }, 'No valid AITA analysis data found.');
    }

    const {
        verdict,
        reasoning,
        score
    } = analysisResults;

    return React.createElement('div', { className: 'bg-gray-800/50 border border-gray-600/50 rounded-lg p-6' },
        React.createElement('h3', { className: 'text-2xl font-bold text-white mb-4' }, 'AITA Analysis'),
        React.createElement('p', { className: 'text-gray-300' }, `Verdict: ${verdict}`),
        React.createElement('p', { className: 'text-gray-300' }, `Score: ${score}`),
        React.createElement('p', { className: 'text-gray-300' }, `Reasoning: ${reasoning}`)
    );
};