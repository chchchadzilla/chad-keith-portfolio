import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpertiseCard {
  title: string;
  description: string;
  color: string;
}

interface SpinState {
  isSpinning: boolean;
  targetCard: number;
  spinCount: number;
}

const RolodexExpertise: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [spinState, setSpinState] = useState<SpinState>({
    isSpinning: false,
    targetCard: 0,
    spinCount: 0
  });
  const [autoRotate, setAutoRotate] = useState(true);

  const expertiseCards: ExpertiseCard[] = [
    {
      title: 'Creative Problem Solving',
      description: 'Innovative approaches to complex challenges',
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Curiosity',
      description: 'Constant drive to learn and explore',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Quick Study',
      description: 'Rapid learning and adaptation',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Polymathic Tendencies',
      description: 'Expertise across multiple disciplines',
      color: 'from-purple-500 to-violet-500'
    },
    {
      title: 'Deep and Wide Breadth of Knowledge',
      description: 'Comprehensive understanding across domains',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Autodidactic',
      description: 'Self-directed learning and development',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Self Motivated',
      description: 'Internal drive and initiative',
      color: 'from-teal-500 to-green-500'
    },
    {
      title: 'Team Player',
      description: 'Collaborative and supportive approach',
      color: 'from-pink-500 to-red-500'
    },
    {
      title: 'Management',
      description: 'Leadership and organizational skills',
      color: 'from-gray-600 to-gray-800'
    },
    {
      title: 'C-Level Experience',
      description: 'Executive-level strategic thinking',
      color: 'from-amber-500 to-yellow-500'
    }
  ];

  useEffect(() => {
    if (!autoRotate) return;
    
    const interval = setInterval(() => {
      setIsFlipping(true);
      
      setTimeout(() => {
        setCurrentCard((prev) => (prev + 1) % expertiseCards.length);
        setIsFlipping(false);
      }, 300); // Half flip duration
    }, 3000); // Show each card for 3 seconds

    return () => clearInterval(interval);
  }, [expertiseCards.length, autoRotate]);

  const currentExpertise = expertiseCards[currentCard];

  // Dramatic spinning effect when clicked
  const triggerDramaticSpin = () => {
    if (spinState.isSpinning) return;
    
    setAutoRotate(false); // Stop auto rotation
    
    // Random target card (different from current)
    const availableCards = expertiseCards
      .map((_, index) => index)
      .filter(index => index !== currentCard);
    const targetCard = availableCards[Math.floor(Math.random() * availableCards.length)];
    
    // Calculate number of full rotations (3-6 spins) plus target position
    const baseSpins = 3 + Math.floor(Math.random() * 4); // 3-6 full rotations
    const totalRotations = baseSpins * expertiseCards.length + targetCard;
    
    setSpinState({
      isSpinning: true,
      targetCard,
      spinCount: totalRotations
    });
    
    // Start spinning animation
    setIsFlipping(true);
    
    // Spin through cards rapidly, then slow down
    let currentSpinCard = currentCard;
    let spinInterval = 100; // Start fast
    let spinsCompleted = 0;
    
    const spinStep = () => {
      if (spinsCompleted >= totalRotations) {
        // Final settlement
        setTimeout(() => {
          setCurrentCard(targetCard);
          setIsFlipping(false);
          setSpinState({ isSpinning: false, targetCard: 0, spinCount: 0 });
          
          // Resume auto rotation after 5 seconds
          setTimeout(() => setAutoRotate(true), 5000);
        }, 300);
        return;
      }
      
      currentSpinCard = (currentSpinCard + 1) % expertiseCards.length;
      setCurrentCard(currentSpinCard);
      spinsCompleted++;
      
      // Gradually slow down as we approach the target
      const remainingSpins = totalRotations - spinsCompleted;
      if (remainingSpins <= expertiseCards.length) {
        // Last rotation - slow down dramatically
        spinInterval = Math.min(spinInterval * 1.5, 500);
      } else if (remainingSpins <= expertiseCards.length * 2) {
        // Second to last rotation - start slowing
        spinInterval = Math.min(spinInterval * 1.3, 300);
      }
      
      setTimeout(spinStep, spinInterval);
    };
    
    spinStep();
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-64">
      {/* Rolodex Card Container - Clickable for dramatic spin */}
      <div 
        className="relative w-full h-full perspective-1000 cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={triggerDramaticSpin}
        title="Click to spin the rolodex!"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={spinState.isSpinning ? `spinning-${spinState.spinCount}` : currentCard}
            className="absolute inset-0 preserve-3d"
            initial={{ rotateX: isFlipping ? 90 : 0 }}
            animate={{ 
              rotateX: 0,
              scale: spinState.isSpinning ? [1, 1.1, 1] : 1,
              rotateY: spinState.isSpinning ? [0, 360] : 0
            }}
            exit={{ rotateX: -90 }}
            transition={{
              duration: spinState.isSpinning ? 0.3 : 0.6,
              ease: spinState.isSpinning ? 'easeInOut' : 'easeInOut',
              type: 'tween',
              scale: { duration: 0.3, repeat: spinState.isSpinning ? 1 : 0 },
              rotateY: { duration: 0.3, ease: 'linear' }
            }}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Front of Card */}
            <div
              className={`absolute inset-0 w-full h-full rounded-xl shadow-2xl transform-3d bg-gradient-to-br ${
                spinState.isSpinning ? 'from-red-500 to-pink-600' : currentExpertise.color
              } p-8 flex flex-col justify-center items-center text-center backface-hidden ${
                spinState.isSpinning ? 'ring-4 ring-red-300 ring-opacity-50' : ''
              }`}
              style={{
                transform: 'rotateX(0deg)',
                backfaceVisibility: 'hidden'
              }}
            >
              <motion.h3
                className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: spinState.isSpinning ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  delay: 0.3, 
                  duration: 0.5,
                  scale: { duration: 0.3, repeat: spinState.isSpinning ? 1 : 0 }
                }}
              >
                {spinState.isSpinning ? 'SPINNING!' : currentExpertise.title}
              </motion.h3>
              
              <motion.p
                className="text-white/90 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {spinState.isSpinning ? 'Finding your perfect match...' : currentExpertise.description}
              </motion.p>

              {/* Card decorative elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full" />
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/20 rounded-full" />
              <div className="absolute top-1/2 left-4 w-1 h-8 bg-white/10 rounded-full transform -translate-y-1/2" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 3D Shadow Effect */}
        <div className="absolute inset-0 bg-black/20 rounded-xl transform translate-y-2 translate-x-2 -z-10" />
      </div>

      {/* Card Navigation Dots */}
      <div className="flex justify-center space-x-2 mt-6">
        {expertiseCards.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the spin
              setIsFlipping(true);
              setTimeout(() => {
                setCurrentCard(index);
                setIsFlipping(false);
              }, 300);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentCard
                ? 'bg-chad-red scale-125'
                : 'bg-chad-black/30 hover:bg-chad-red/50'
            }`}
          />
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="absolute -bottom-8 left-0 right-0">
        <div className="w-full bg-chad-black/10 rounded-full h-1">
          <motion.div
            className="h-full bg-chad-red rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentCard + 1) / expertiseCards.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};

export default RolodexExpertise;