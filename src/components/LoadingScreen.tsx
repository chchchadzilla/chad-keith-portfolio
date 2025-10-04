import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onEnter: () => void;
  isVisible: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onEnter, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-chad-black via-chad-black/95 to-chad-red/20"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-chad-red/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="text-center z-10 space-y-8">
          {/* Chad Keith branding */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-chad-white to-chad-red bg-clip-text text-transparent font-futura">
              CHAD KEITH
            </h1>
            <p className="text-xl text-chad-white/80 font-light">
              AI Researcher • Musician • Innovator
            </p>
          </motion.div>

          {/* Parallax block preview */}
          <motion.div
            className="flex justify-center items-center space-x-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {['#FF0000', '#000000', '#FFFFFF', '#FF0000', '#000000'].map((color, i) => (
              <motion.div
                key={i}
                className="w-6 h-12 border border-chad-white/30"
                style={{ backgroundColor: color }}
                animate={{
                  x: [i % 2 === 0 ? -20 : 20, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>

          {/* Enter button */}
          <motion.button
            onClick={onEnter}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative px-12 py-4 bg-gradient-to-r from-chad-red to-chad-red/80 hover:from-chad-red/80 hover:to-chad-red text-white font-semibold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-chad-red/25"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Enter Experience</span>
            
            {/* Button glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-chad-red/40 to-chad-red/60 rounded-lg blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
              animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>

          {/* Hint text */}
          <motion.p
            className="text-chad-white/50 text-sm font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            Click to experience the future of AI
          </motion.p>
        </div>

        {/* Bottom Credits */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <p className="text-chad-white/40 text-xs">
            Built with React, Three.js, GSAP & ❤️ • © 2025 Chad Keith
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;