// ui_assets/web_ui/components/BullshitDetectorAnalysis.js
window.BullshitDetectorAnalysis = ({ analysisResults }) => {
    if (!analysisResults || !analysisResults.bullshit_detected) {
        return React.createElement('div', { className: 'text-gray-400' }, 'No valid Bullshit Detector analysis data found.');
    }

    const {
        bullshit_detected,
        confidence_score,
        explanation,
        problematic_statements
    } = analysisResults;

    const renderSection = (title, content) => {
        if (!content || (Array.isArray(content) && content.length === 0)) {
            return null;
        }
        return React.createElement('div', { className: 'mb-6' },
            React.createElement('h4', { className: 'text-lg font-semibold text-blue-300 mb-2' }, title),
            typeof content === 'string'
                ? React.createElement('p', { className: 'text-gray-300' }, content)
                : React.createElement('ul', { className: 'list-disc list-inside text-gray-300' },
                    content.map((item, index) => React.createElement('li', { key: index }, item.statement))
                )
        );
    };

    return React.createElement('div', { className: 'bg-gray-800/50 border border-gray-600/50 rounded-lg p-6' },
        React.createElement('h3', { className: 'text-2xl font-bold text-white mb-4' }, 'Bullshit Detector Analysis'),
        React.createElement('p', { className: 'text-gray-300' }, `Bullshit Detected: ${bullshit_detected}`),
        React.createElement('p', { className: 'text-gray-300' }, `Confidence Score: ${confidence_score}`),
        renderSection('Explanation', explanation),
        renderSection('Problematic Statements', problematic_statements)
    );
};