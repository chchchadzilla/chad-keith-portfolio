import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark theme for Chad's portfolio
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('chad-theme');
    if (savedTheme) {
      const isDarkMode = savedTheme === 'dark';
      setIsDark(isDarkMode);
      applyTheme(isDarkMode);
    } else {
      // Default to dark mode and apply it
      applyTheme(true);
    }
  }, []);

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    const body = document.body;
    
    if (dark) {
      root.classList.add('dark');
      body.classList.add('dark');
      body.style.backgroundColor = '#000000';
      body.style.color = '#ffffff';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#000000';
    }
    
    // Also apply to the main app container
    const appContainer = document.querySelector('#root');
    if (appContainer) {
      if (dark) {
        appContainer.classList.add('dark');
      } else {
        appContainer.classList.remove('dark');
      }
    }
  };

  const handleToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('chad-theme', newTheme ? 'dark' : 'light');
    
    // Dispatch a custom event so other components can react to theme changes
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { isDark: newTheme } }));
  };

  if (!mounted) return null;

  return (
    <motion.button
      onClick={handleToggle}
      className={`fixed top-6 right-6 z-50 w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
        isDark 
          ? 'border-chad-red/50 bg-chad-black/80 hover:border-chad-red hover:bg-chad-red/10' 
          : 'border-chad-red/50 bg-white/80 hover:border-chad-red hover:bg-chad-red/10'
      } ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      <motion.div
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-chad-red" />
        ) : (
          <Moon className="w-5 h-5 text-chad-red" />
        )}
      </motion.div>
      
      {/* Hover tooltip */}
      <div className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap text-xs ${
        isDark ? 'bg-chad-black/90 text-chad-white' : 'bg-white/90 text-chad-black'
      }`}>
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </div>
    </motion.button>
  );
};

export default ThemeToggle;