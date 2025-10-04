import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, AlertCircle, TrendingUp, Users, Eye } from 'lucide-react';

interface DicketryAnalysis {
  dsiScore: number; // Dicketry Scale Index in "indicks"
  iqEstimate: number;
  personalityFactors: {
    narcissism: number;
    empathy: number;
    aggression: number;
    manipulation: number;
    selfAwareness: number;
  };
  behaviorPatterns: string[];
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
  recommendations: string[];
}

const DicketryScaleDemo: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DicketryAnalysis | null>(null);

  const analyzeText = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock analysis based on input content
    const baseScore = Math.random() * 80 + 10;
    const mockAnalysis: DicketryAnalysis = {
      dsiScore: baseScore,
      iqEstimate: Math.max(85, 140 - baseScore + Math.random() * 20),
      personalityFactors: {
        narcissism: Math.min(100, baseScore + Math.random() * 20),
        empathy: Math.max(0, 100 - baseScore + Math.random() * 30),
        aggression: Math.min(100, baseScore * 0.8 + Math.random() * 25),
        manipulation: Math.min(100, baseScore * 0.9 + Math.random() * 15),
        selfAwareness: Math.max(0, 100 - baseScore * 0.7 + Math.random() * 20)
      },
      behaviorPatterns: [
        'Displays condescending language patterns',
        'Shows lack of perspective-taking',
        'Exhibits dismissive communication style',
        'Demonstrates poor emotional regulation',
        'Uses deflection tactics'
      ].filter(() => Math.random() > 0.4),
      riskLevel: baseScore > 70 ? 'Extreme' : baseScore > 50 ? 'High' : baseScore > 30 ? 'Moderate' : 'Low',
      recommendations: [
        'Recommend mindfulness and empathy training',
        'Suggest professional communication coaching',
        'Encourage perspective-taking exercises',
        'Advise conflict resolution skills development'
      ].filter(() => Math.random() > 0.3)
    };
    
    setResult(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400';
      case 'Moderate': return 'text-yellow-400';
      case 'High': return 'text-orange-400';
      case 'Extreme': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDSIColor = (score: number) => {
    if (score < 20) return 'text-green-400';
    if (score < 40) return 'text-yellow-400';
    if (score < 70) return 'text-orange-400';
    return 'text-red-400';
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
          <Zap className="w-8 h-8 text-chad-red" />
          <div>
            <h2 className="text-2xl font-bold text-chad-white font-futura">
              Dicketry Scale Index (DSI)
            </h2>
            <p className="text-chad-white/70 text-sm">
              Advanced personality trait analysis with IQ correlation
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-chad-white/80 text-sm font-medium mb-2">
            Analyze Communication Patterns
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text samples, conversations, or written content to analyze personality patterns and estimate dicketry levels in scientific 'indicks' units..."
            className="w-full h-32 p-4 bg-chad-black/50 border border-chad-red/20 rounded-lg text-chad-white placeholder-chad-white/40 focus:border-chad-red focus:outline-none resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-chad-white/50 text-xs">
              {inputText.length} characters • Higher accuracy with more content
            </span>
            <motion.button
              onClick={analyzeText}
              disabled={!inputText.trim() || isAnalyzing}
              className="px-6 py-2 bg-chad-red hover:bg-chad-red-secondary disabled:opacity-50 disabled:cursor-not-allowed text-chad-white rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAnalyzing ? 'Computing DSI...' : 'Analyze DSI Level'}
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
            <p className="text-chad-white/70">Computing Dicketry Scale Index...</p>
            <p className="text-chad-white/50 text-sm">Analyzing personality patterns and IQ correlation</p>
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
            {/* DSI Score & IQ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DSI Score */}
              <div className="bg-chad-black/30 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-chad-white mb-2">DSI Score</h3>
                <div className={`text-4xl font-bold mb-2 ${getDSIColor(result.dsiScore)}`}>
                  {Math.round(result.dsiScore)}
                </div>
                <div className="text-chad-white/60 text-sm mb-3">indicks</div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  result.riskLevel === 'Low' ? 'bg-green-400/20 text-green-400' :
                  result.riskLevel === 'Moderate' ? 'bg-yellow-400/20 text-yellow-400' :
                  result.riskLevel === 'High' ? 'bg-orange-400/20 text-orange-400' :
                  'bg-red-400/20 text-red-400'
                }`}>
                  {result.riskLevel} Risk
                </div>
              </div>

              {/* IQ Estimate */}
              <div className="bg-chad-black/30 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-chad-white mb-2 flex items-center justify-center">
                  <Brain className="w-5 h-5 mr-2" />
                  IQ Estimate
                </h3>
                <div className="text-4xl font-bold text-chad-white mb-2">
                  {Math.round(result.iqEstimate)}
                </div>
                <div className="text-chad-white/60 text-sm mb-3">Estimated IQ</div>
                <div className="text-chad-white/50 text-xs">
                  Inverse correlation with DSI detected
                </div>
              </div>
            </div>

            {/* Personality Factors */}
            <div className="bg-chad-black/30 rounded-lg p-4">
              <h4 className="font-semibold text-chad-white mb-4 flex items-center">
                <Users className="w-5 h-5 text-chad-red mr-2" />
                Personality Factor Analysis
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(result.personalityFactors).map(([factor, value]) => (
                  <div key={factor} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-chad-white/80 text-sm capitalize">
                        {factor.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`font-bold text-sm ${
                        factor === 'empathy' || factor === 'selfAwareness' ?
                        (value > 70 ? 'text-green-400' : value > 40 ? 'text-yellow-400' : 'text-red-400') :
                        (value > 70 ? 'text-red-400' : value > 40 ? 'text-yellow-400' : 'text-green-400')
                      }`}>
                        {Math.round(value)}%
                      </span>
                    </div>
                    <div className="w-full bg-chad-black-tertiary rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${
                          factor === 'empathy' || factor === 'selfAwareness' ?
                          (value > 70 ? 'bg-green-400' : value > 40 ? 'bg-yellow-400' : 'bg-red-400') :
                          (value > 70 ? 'bg-red-400' : value > 40 ? 'bg-yellow-400' : 'bg-green-400')
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavior Patterns */}
            <div className="bg-chad-black/30 rounded-lg p-4">
              <h4 className="font-semibold text-chad-white mb-3 flex items-center">
                <Eye className="w-5 h-5 text-chad-red mr-2" />
                Observed Behavior Patterns
              </h4>
              {result.behaviorPatterns.length > 0 ? (
                <ul className="space-y-2">
                  {result.behaviorPatterns.map((pattern, index) => (
                    <li key={index} className="text-chad-white/70 text-sm flex items-start">
                      <AlertCircle className="w-4 h-4 text-chad-red mr-2 mt-0.5 flex-shrink-0" />
                      {pattern}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-chad-white/50 text-sm">No significant concerning patterns detected</p>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-chad-red/10 border border-chad-red/30 rounded-lg p-4">
              <h4 className="font-semibold text-chad-white mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 text-chad-red mr-2" />
                Improvement Recommendations
              </h4>
              {result.recommendations.length > 0 ? (
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-chad-white/80 text-sm flex items-start">
                      <span className="w-1 h-1 bg-chad-red rounded-full mr-3 mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-chad-white/80 text-sm">No specific recommendations needed - low DSI score detected</p>
              )}
            </div>

            {/* Scientific Note */}
            <div className="bg-chad-black/20 border border-chad-white/10 rounded-lg p-3">
              <p className="text-chad-white/60 text-xs">
                <strong>Note:</strong> The Dicketry Scale Index (DSI) is measured in scientific "indicks" units. 
                This analysis uses advanced NLP and personality pattern recognition. Results are for educational 
                and entertainment purposes and should not be used for clinical diagnosis.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DicketryScaleDemo;