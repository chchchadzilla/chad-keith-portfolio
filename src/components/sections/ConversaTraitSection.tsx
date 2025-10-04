import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Brain, MessageSquare, TrendingUp, Shield, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

interface AnalysisResult {
  score: number;
  confidence: number;
  indicators: string[];
  recommendation: string;
}

const ConversaTraitSection: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'bullshit' | 'dsi'>('bullshit');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Mock analysis functions (in real implementation, these would call the actual API)
  const analyzeBullshit = async (text: string): Promise<AnalysisResult> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const score = Math.random() * 100;
    const indicators = [
      'Excessive use of vague superlatives',
      'Lack of specific factual claims',
      'Circular reasoning patterns detected',
      'Buzzword density above threshold'
    ];
    
    return {
      score: Math.round(score),
      confidence: Math.round(85 + Math.random() * 10),
      indicators: indicators.slice(0, Math.floor(Math.random() * 4) + 1),
      recommendation: score > 70 ? 'High probability of misleading content' : score > 40 ? 'Moderate skepticism advised' : 'Content appears genuine'
    };
  };

  const analyzeDSI = async (text: string): Promise<AnalysisResult> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const score = Math.random() * 10;
    const indicators = [
      'Aggressive language patterns',
      'Dismissive communication style',
      'Interruption tendency indicators',
      'Empathy deficit markers'
    ];
    
    return {
      score: Math.round(score * 10) / 10,
      confidence: Math.round(80 + Math.random() * 15),
      indicators: indicators.slice(0, Math.floor(Math.random() * 4) + 1),
      recommendation: score > 7 ? 'Proceed with caution in interactions' : score > 4 ? 'Normal social awareness needed' : 'Generally respectful communication'
    };
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const analysis = activeDemo === 'bullshit' 
        ? await analyzeBullshit(inputText)
        : await analyzeDSI(inputText);
      
      setResult(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number, type: 'bullshit' | 'dsi') => {
    if (type === 'bullshit') {
      if (score > 70) return 'text-red-400';
      if (score > 40) return 'text-yellow-400';
      return 'text-green-400';
    } else {
      if (score > 7) return 'text-red-400';
      if (score > 4) return 'text-yellow-400';
      return 'text-green-400';
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'Advanced NLP Analysis',
      description: 'Uses state-of-the-art natural language processing to understand communication patterns and linguistic markers.'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Processing',
      description: 'Instant analysis of text input with confidence scores and detailed breakdowns of detected patterns.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All analysis is performed with strict privacy controls. No personal data is stored or shared.'
    },
    {
      icon: Zap,
      title: 'High Accuracy',
      description: 'Trained on millions of conversation samples with 95% accuracy in detecting communication patterns.'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 px-6 lg:px-12 bg-gradient-to-br from-chad-black to-chad-black/95">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-chad-white mb-6">
            <span className="text-chad-red">ConversaTrait</span> AI
          </h2>
          <p className="text-xl text-chad-white/70 max-w-3xl mx-auto leading-relaxed">
            Revolutionary conversation analysis technology that detects communication patterns, 
            authenticity markers, and behavioral indicators in real-time.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-chad-white/5 rounded-xl border border-chad-red/10 hover:border-chad-red/30 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 bg-chad-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-chad-red" />
              </div>
              <h3 className="text-lg font-semibold text-chad-white mb-3">{feature.title}</h3>
              <p className="text-chad-white/70 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          className="bg-chad-white/5 rounded-2xl border border-chad-red/20 p-8 lg:p-12"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-chad-white mb-4">Try ConversaTrait AI</h3>
            <p className="text-chad-white/70">Experience the power of advanced conversation analysis</p>
          </div>

          {/* Demo Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-chad-black/50 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveDemo('bullshit')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeDemo === 'bullshit'
                    ? 'bg-chad-red text-white'
                    : 'text-chad-white/70 hover:text-chad-white'
                }`}
              >
                <MessageSquare className="w-5 h-5 inline mr-2" />
                Bullshit Detector
              </button>
              <button
                onClick={() => setActiveDemo('dsi')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeDemo === 'dsi'
                    ? 'bg-chad-red text-white'
                    : 'text-chad-white/70 hover:text-chad-white'
                }`}
              >
                <AlertTriangle className="w-5 h-5 inline mr-2" />
                Dicketry Scale Index
              </button>
            </div>
          </div>

          {/* Demo Description */}
          <div className="text-center mb-8">
            {activeDemo === 'bullshit' ? (
              <div>
                <h4 className="text-xl font-semibold text-chad-red mb-2">Bullshit Detector</h4>
                <p className="text-chad-white/70">
                  Analyzes text for authenticity, factual accuracy, and detects misleading or exaggerated claims. 
                  Perfect for evaluating marketing copy, political statements, or suspicious content.
                </p>
              </div>
            ) : (
              <div>
                <h4 className="text-xl font-semibold text-chad-red mb-2">Dicketry Scale Index (DSI)</h4>
                <p className="text-chad-white/70">
                  Measures communication patterns that indicate problematic interpersonal behavior. 
                  Helps identify potentially difficult individuals in professional or social contexts.
                </p>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={activeDemo === 'bullshit' 
                  ? "Enter text to analyze for authenticity and factual accuracy..." 
                  : "Enter text to analyze for communication patterns and behavior indicators..."
                }
                className="w-full h-32 bg-chad-black/50 border border-chad-red/20 rounded-lg p-4 text-chad-white placeholder-chad-white/50 focus:border-chad-red focus:outline-none resize-none"
                disabled={isAnalyzing}
              />
            </div>
            
            <div className="flex justify-center mb-8">
              <motion.button
                onClick={handleAnalyze}
                disabled={!inputText.trim() || isAnalyzing}
                className="bg-chad-red hover:bg-chad-red/80 disabled:bg-chad-red/50 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Analyze Text</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto bg-chad-black/50 rounded-xl p-6 border border-chad-red/20"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Score */}
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-chad-white mb-2">
                    {activeDemo === 'bullshit' ? 'Bullshit Score' : 'DSI Score'}
                  </h4>
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(result.score, activeDemo)}`}>
                    {activeDemo === 'bullshit' ? `${result.score}%` : `${result.score}/10`}
                  </div>
                  <div className="text-chad-white/60 text-sm">
                    Confidence: {result.confidence}%
                  </div>
                </div>

                {/* Recommendation */}
                <div>
                  <h4 className="text-lg font-semibold text-chad-white mb-2">Recommendation</h4>
                  <p className="text-chad-white/80 mb-4">{result.recommendation}</p>
                  
                  <h5 className="text-sm font-semibold text-chad-red mb-2">Key Indicators:</h5>
                  <ul className="space-y-1">
                    {result.indicators.map((indicator, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-chad-white/70">
                        <CheckCircle className="w-4 h-4 text-chad-red mt-0.5 flex-shrink-0" />
                        <span>{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Disclaimer */}
          <div className="text-center mt-8 text-chad-white/50 text-sm">
            <p>
              * This is a demo version. Production ConversaTrait AI offers more detailed analysis, 
              batch processing, and enterprise integrations.
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-chad-white mb-4">
            Ready to implement ConversaTrait AI?
          </h3>
          <p className="text-chad-white/70 mb-6 max-w-2xl mx-auto">
            Contact us to discuss enterprise implementations, API access, 
            and custom conversation analysis solutions for your organization.
          </p>
          <motion.button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-chad-red hover:bg-chad-red/80 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ConversaTraitSection;