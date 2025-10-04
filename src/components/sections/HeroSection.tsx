import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronDown, Github, Linkedin, Mail, Music } from 'lucide-react';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.fromTo(
        '.hero-title',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.2 }
      )
      .fromTo(
        '.hero-subtitle',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo(
        '.hero-description',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(
        '.hero-cta',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
        '-=0.2'
      )
      .fromTo(
        '.hero-image',
        { scale: 0.8, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'power3.out' },
        '-=1'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/chadkeith', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/chadkeith', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:chad@chadkeith.com', label: 'Email' },
    { icon: Music, href: '#music', label: 'Music' }
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 overflow-hidden"
    >
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text Content */}
        <div ref={textRef} className="space-y-8">
          {/* Main Title */}
          <div className="space-y-4">
            <motion.h1 className="hero-title text-6xl lg:text-8xl font-bold leading-tight">
              <span className="text-chad-white">Chad</span>
              <br />
              <span className="text-chad-red font-futura">Keith</span>
            </motion.h1>
            
            <motion.h2 className="hero-subtitle text-2xl lg:text-3xl text-chad-white/80 font-light">
              AI Researcher & Business Leader
            </motion.h2>
          </div>

          {/* Description */}
          <motion.p className="hero-description text-lg lg:text-xl text-chad-white/70 leading-relaxed max-w-lg">
            Combining 33 years of musical experience with 3 studio albums (2006-2014 touring), 
            and explosive business success including $2M+ in sales/retention, 13x top agency salesman, 
            7x top corporation salesman, and BBB rating transformation C- to A+ in 6 months.
          </motion.p>

          {/* Key Achievements */}
          <motion.div className="hero-description space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-chad-red rounded-full" />
              <span className="text-chad-white/80">13x Top Agency Salesman + 7x Top Corporation Salesman</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-chad-red rounded-full" />
              <span className="text-chad-white/80">BBB Rating: C- to A+ in 6 months (66% cancellation reduction)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-chad-red rounded-full" />
              <span className="text-chad-white/80">$2M+ sales/retention + Director of 5 departments by 2019</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div className="hero-cta flex flex-wrap gap-4 pt-4">
            <motion.button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-chad-red hover:bg-chad-red/80 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
            </motion.button>
            
            <motion.button
              onClick={() => document.getElementById('conversatrait')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-chad-red text-chad-red hover:bg-chad-red hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try ConversaTrait AI
            </motion.button>
          </motion.div>

          {/* Social Links */}
          <motion.div className="hero-cta flex space-x-6 pt-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="w-12 h-12 border border-chad-red/50 rounded-full flex items-center justify-center text-chad-red hover:border-chad-red hover:bg-chad-red/10 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                title={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Image/Visual Content */}
        <div ref={imageRef} className="relative">
          <motion.div className="hero-image relative">
            {/* Main Profile Image */}
            <div className="relative w-80 h-80 lg:w-96 lg:h-96 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-chad-red/20 to-transparent rounded-full" />
              <div className="absolute inset-4 border-2 border-chad-red/30 rounded-full" />
              <img
                src="/images/chad-headshot.png"
                alt="Chad Keith"
                className="w-full h-full object-cover rounded-full border-4 border-chad-red/20"
              />
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-chad-red/20 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              
              <motion.div
                className="absolute -bottom-6 -left-6 w-6 h-6 border-2 border-chad-red/40 rotate-45"
                animate={{
                  rotate: [45, 225, 45],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </div>

            {/* Background Tech Elements */}
            <div className="absolute inset-0 -z-10">
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-chad-red/10 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.5, 0.1]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToNext}
        animate={{
          y: [0, 10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center space-y-2 text-chad-white/60 hover:text-chad-red transition-colors">
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </motion.div>

      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-10 w-16 h-16 border border-chad-red/10 rotate-45"
          animate={{ rotate: [45, 405, 45] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-20 w-12 h-12 bg-chad-red/5 rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-8 h-8 border border-chad-white/5 rotate-12"
          animate={{ rotate: [12, 372, 12] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </section>
  );
};

export default HeroSection;