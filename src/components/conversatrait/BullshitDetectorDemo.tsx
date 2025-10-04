import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Brain, TrendingUp } from 'lucide-react';

interface AnalysisResult {
  credibilityScore: number;
  logicalFallacies: string[];
  emotionalManipulation: number;
  factualAccuracy: number;
  biasIndicators: string[];
  recommendation: string;
}

const BullshitDetectorDemo: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeText = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis based on input content
    const mockAnalysis: AnalysisResult = {
      credibilityScore: Math.max(20, 100 - inputText.length / 10 + Math.random() * 30),
      logicalFallacies: [
        'Ad hominem detected',
        'Strawman argument identified',
        'False dichotomy present'
      ].filter(() => Math.random() > 0.6),
      emotionalManipulation: Math.random() * 100,
      factualAccuracy: Math.random() * 100,
      biasIndicators: [
        'Confirmation bias',
        'Selection bias',
        'Anchoring bias'
      ].filter(() => Math.random() > 0.5),
      recommendation: 'Verify claims with primary sources and consider alternative perspectives.'
    };
    
    setResult(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCredibilityIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (score >= 40) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-chad-black-secondary/80 backdrop-blur-lg border border-chad-red/30 rounded-xl p-6"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-8 h-8 text-chad-red" />
          <div>
            <h2 className="text-2xl font-bold text-chad-white font-futura">
              ConversaTrait Bullshit Detector
            </h2>
            <p className="text-chad-white/70 text-sm">
              Advanced logical fallacy and credibility analysis
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-chad-white/80 text-sm font-medium mb-2">
            Analyze Text Content
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste any text content here to analyze its credibility, logical consistency, and potential manipulation tactics..."
            className="w-full h-32 p-4 bg-chad-black/50 border border-chad-red/20 rounded-lg text-chad-white placeholder-chad-white/40 focus:border-chad-red focus:outline-none resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-chad-white/50 text-xs">
              {inputText.length} characters
            </span>
            <motion.button
              onClick={analyzeText}
              disabled={!inputText.trim() || isAnalyzing}
              className="px-6 py-2 bg-chad-red hover:bg-chad-red-secondary disabled:opacity-50 disabled:cursor-not-allowed text-chad-white rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
            </motion.button>
          </div>
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 space-y-4"
          >
            <div className="w-12 h-12 border-4 border-chad-red/30 border-t-chad-red rounded-full animate-spin" />
            <p className="text-chad-white/70">Analyzing credibility patterns...</p>
          </motion.div>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Credibility Score */}
            <div className="bg-chad-black/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getCredibilityIcon(result.credibilityScore)}
                  <h3 className="text-lg font-semibold text-chad-white">Credibility Score</h3>
                </div>
                <span className={`text-2xl font-bold ${getCredibilityColor(result.credibilityScore)}`}>
                  {Math.round(result.credibilityScore)}/100
                </span>
              </div>
              <div className="w-full bg-chad-black-tertiary rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.credibilityScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-2 rounded-full ${
                    result.credibilityScore >= 70 ? 'bg-green-400' :
                    result.credibilityScore >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                />
              </div>
            </div>

            {/* Analysis Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Logical Fallacies */}
              <div className="bg-chad-black/30 rounded-lg p-4">
                <h4 className="font-semibold text-chad-white mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 text-chad-red mr-2" />
                  Logical Fallacies
                </h4>
                {result.logicalFallacies.length > 0 ? (
                  <ul className="space-y-2">
                    {result.logicalFallacies.map((fallacy, index) => (
                      <li key={index} className="text-chad-white/70 text-sm flex items-center">
                        <span className="w-1 h-1 bg-chad-red rounded-full mr-2" />
                        {fallacy}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-chad-white/50 text-sm">No major logical fallacies detected</p>
                )}
              </div>

              {/* Emotional Manipulation */}
              <div className="bg-chad-black/30 rounded-lg p-4">
                <h4 className="font-semibold text-chad-white mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 text-chad-red mr-2" />
                  Emotional Manipulation
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-chad-white/70 text-sm">Manipulation Level</span>
                  <span className={`font-bold ${
                    result.emotionalManipulation > 70 ? 'text-red-400' :
                    result.emotionalManipulation > 40 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {Math.round(result.emotionalManipulation)}%
                  </span>
                </div>
                <div className="w-full bg-chad-black-tertiary rounded-full h-1 mt-2">
                  <div 
                    className={`h-1 rounded-full ${
                      result.emotionalManipulation > 70 ? 'bg-red-400' :
                      result.emotionalManipulation > 40 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${result.emotionalManipulation}%` }}
                  />
                </div>
              </div>

              {/* Factual Accuracy */}
              <div className="bg-chad-black/30 rounded-lg p-4">
                <h4 className="font-semibold text-chad-white mb-3">Factual Accuracy</h4>
                <div className="flex items-center justify-between">
                  <span className="text-chad-white/70 text-sm">Accuracy Score</span>
                  <span className={`font-bold ${
                    result.factualAccuracy > 70 ? 'text-green-400' :
                    result.factualAccuracy > 40 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {Math.round(result.factualAccuracy)}%
                  </span>
                </div>
                <div className="w-full bg-chad-black-tertiary rounded-full h-1 mt-2">
                  <div 
                    className={`h-1 rounded-full ${
                      result.factualAccuracy > 70 ? 'bg-green-400' :
                      result.factualAccuracy > 40 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${result.factualAccuracy}%` }}
                  />
                </div>
              </div>

              {/* Bias Indicators */}
              <div className="bg-chad-black/30 rounded-lg p-4">
                <h4 className="font-semibold text-chad-white mb-3">Bias Indicators</h4>
                {result.biasIndicators.length > 0 ? (
                  <ul className="space-y-1">
                    {result.biasIndicators.map((bias, index) => (
                      <li key={index} className="text-chad-white/70 text-sm flex items-center">
                        <span className="w-1 h-1 bg-chad-red rounded-full mr-2" />
                        {bias}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-chad-white/50 text-sm">No significant biases detected</p>
                )}
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-chad-red/10 border border-chad-red/30 rounded-lg p-4">
              <h4 className="font-semibold text-chad-white mb-2">Recommendation</h4>
              <p className="text-chad-white/80 text-sm">{result.recommendation}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BullshitDetectorDemo;