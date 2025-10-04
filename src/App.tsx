import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import CustomCursor from './components/CustomCursor';
import Background3D from './components/Background3D';
import ParallaxBlocks from './components/ParallaxBlocks';
import LoadingScreen from './components/LoadingScreen';
import ThemeToggle from './components/ThemeToggle';
import FloatingMusicPlayer from './components/FloatingMusicPlayer';
import FloatingGallery from './components/FloatingGallery';

// Sections
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ProjectsSection from './components/sections/ProjectsSection';
import ConversaTraitSection from './components/sections/ConversaTraitSection';
import ContactSection from './components/sections/ContactSection';

interface MousePosition {
  x: number;
  y: number;
}

interface AppState {
  currentSection: number;
  isTransitioning: boolean;
  mousePosition: MousePosition;
  isLoading: boolean;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentSection: 0,
    isTransitioning: false,
    mousePosition: { x: 0, y: 0 },
    isLoading: true
  });

  // Track mouse position for 3D background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setState(prev => ({
        ...prev,
        mousePosition: { x: e.clientX, y: e.clientY }
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Loading screen waits for user to click Enter - NO AUTO-LOADING

  // Intersection Observer for section tracking
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const options = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = Array.from(sections).indexOf(entry.target);
          if (sectionIndex !== state.currentSection) {
            setState(prev => ({
              ...prev,
              currentSection: sectionIndex,
              isTransitioning: true
            }));

            // Reset transition state after animation
            setTimeout(() => {
              setState(prev => ({ ...prev, isTransitioning: false }));
            }, 1500);
          }
        }
      });
    }, options);

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [state.currentSection]);

  // Navigation helper
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };



  return (
    <div className="relative min-h-screen text-chad-white overflow-x-hidden">
      {/* Loading Screen - LOADS FIRST AND ONLY */}
      <LoadingScreen 
        isVisible={state.isLoading}
        onEnter={() => setState(prev => ({ ...prev, isLoading: false }))} 
      />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* 3D Background - TEMPORARILY DISABLED FOR PERFORMANCE TESTING */}
      {/* <Background3D mousePosition={state.mousePosition} /> */}

      {/* Parallax Blocks - Slide in from edges to form section backgrounds */}
      <ParallaxBlocks sectionIndex={state.currentSection} />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Floating Elements */}
      <FloatingMusicPlayer />
      <FloatingGallery />

      {/* Navigation */}
      <nav className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50 space-y-4">
        {[
          { id: 'hero', label: 'Home' },
          { id: 'about', label: 'About' },
          { id: 'projects', label: 'Projects' },
          { id: 'conversatrait', label: 'ConversaTrait' },
          { id: 'contact', label: 'Contact' }
        ].map((section, index) => (
          <motion.button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 hover:scale-125 ${
              state.currentSection === index
                ? 'bg-chad-red border-chad-red'
                : 'border-chad-red/50 hover:border-chad-red'
            }`}
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
            title={section.label}
          />
        ))}
      </nav>

      {/* Main Content - Positioned above background */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section id="hero">
          <HeroSection />
        </section>

        {/* About Section */}
        <section id="about">
          <AboutSection />
        </section>

        {/* Projects Section */}
        <section id="projects">
          <ProjectsSection />
        </section>

        {/* ConversaTrait Section */}
        <section id="conversatrait">
          <ConversaTraitSection />
        </section>

        {/* Contact Section */}
        <section id="contact">
          <ContactSection />
        </section>
      </main>

      {/* Floating geometric elements - positioned above background but below content */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-4 h-4 border border-chad-red/20 rotate-45 animate-pulse" />
        <div className="absolute top-1/3 right-20 w-6 h-6 bg-chad-red/10 rounded-full animate-cursor-float" />
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-chad-red/30 rotate-12" />
        <div className="absolute bottom-40 right-1/3 w-5 h-5 border border-chad-white/10 rotate-45" />
        <div className="absolute top-2/3 left-1/6 w-3 h-3 bg-chad-red/20 rounded-full animate-glow-pulse" />
      </div>
    </div>
  );
};

export default App;