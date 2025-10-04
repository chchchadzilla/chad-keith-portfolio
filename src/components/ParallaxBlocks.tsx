import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface InterlockingBlock {
  id: string;
  color: string;
  height: number;
  width: number;
  x: number;
  y: number;
  fromLeft: boolean;
  targetX: number;
}

interface ParallaxBlocksProps {
  sectionIndex: number;
}

const ParallaxBlocks: React.FC<ParallaxBlocksProps> = ({ sectionIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Background colors for each section - blocks form these solid backgrounds
  const sectionBackgrounds = [
    '#000000', // Hero - Black background
    '#FFFFFF', // About - White background
    '#FF0000', // Projects - Red background
    '#1A1A1A', // ConversaTrait - Dark Gray background
    '#000000'  // Contact - Black background
  ];

  // Create jagged interlocking edge path for perfect puzzle-piece fit
  const createJaggedPath = (width: number, height: number, fromLeft: boolean) => {
    const jaggedDepth = 40;
    const pointCount = Math.floor(height / 100); // Larger, more defined interlocking pieces
    
    let path = `M 0 0`;
    
    if (fromLeft) {
      // Left block - slides from left edge to center, jagged right edge
      path += ` L ${width - jaggedDepth} 0`;
      
      // Create interlocking jagged points on right edge
      for (let i = 0; i <= pointCount; i++) {
        const y = (height / pointCount) * i;
        const isOut = i % 2 === 0;
        const x = isOut ? width : width - jaggedDepth;
        path += ` L ${x} ${y}`;
      }
      
      path += ` L 0 ${height} Z`;
    } else {
      // Right block - slides from right edge to center, jagged left edge that perfectly fits left block
      path += ` L ${width} 0 L ${width} ${height}`;
      
      // Create complementary jagged points on left edge
      for (let i = pointCount; i >= 0; i--) {
        const y = (height / pointCount) * i;
        const isOut = i % 2 === 0; // Same pattern as left block to interlock
        const x = isOut ? jaggedDepth : 0;
        path += ` L ${x} ${y}`;
      }
      
      path += ` Z`;
    }
    
    return path;
  };

  const createInterlockingBlocks = () => {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    const targetColor = sectionBackgrounds[sectionIndex % sectionBackgrounds.length];
    
    const blocks: InterlockingBlock[] = [];
    
    // For each section transition, create exactly TWO blocks that meet in middle
    // One from LEFT, one from RIGHT - they interlock horizontally
    
    // Left block - slides from left edge to center
    const leftBlock: InterlockingBlock = {
      id: `interlock-left-${sectionIndex}`,
      color: targetColor,
      height: screenHeight,
      width: (screenWidth / 2) + 30, // Reaches past center for interlocking
      x: -(screenWidth / 2) - 30, // Start completely off-screen left
      y: 0,
      fromLeft: true,
      targetX: 0 // Slide to left edge
    };
    
    // Right block - slides from right edge to center, interlocks with left
    const rightBlock: InterlockingBlock = {
      id: `interlock-right-${sectionIndex}`,
      color: targetColor,
      height: screenHeight,
      width: (screenWidth / 2) + 30, // Reaches past center for interlocking
      x: screenWidth, // Start completely off-screen right
      y: 0,
      fromLeft: false,
      targetX: (screenWidth / 2) - 30 // Slide to center-right, overlapping with left block
    };
    
    blocks.push(leftBlock, rightBlock);
    return blocks;
  };

  const animateInterlockingBackground = () => {
    if (!containerRef.current || isAnimating) return;
    
    setIsAnimating(true);
    const blocks = createInterlockingBlocks();
    
    // Clear previous content
    containerRef.current.innerHTML = '';
    
    // Create SVG for precise interlocking shapes
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100vh';
    svg.style.pointerEvents = 'none';
    
    containerRef.current.appendChild(svg);
    
    // Create block elements
    const blockElements = blocks.map(block => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const jaggedPath = createJaggedPath(block.width, block.height, block.fromLeft);
      
      path.setAttribute('d', jaggedPath);
      path.setAttribute('fill', block.color);
      path.setAttribute('transform', `translate(${block.x}, ${block.y})`);
      path.style.opacity = '0';
      
      svg.appendChild(path);
      
      return { path, block };
    });
    
    // Animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // After blocks interlock, set the solid background
        if (backgroundRef.current) {
          gsap.to(backgroundRef.current, {
            backgroundColor: sectionBackgrounds[sectionIndex % sectionBackgrounds.length],
            duration: 0.5,
            ease: 'power2.out'
          });
        }
        
        // Fade out the block shapes since background is now solid
        gsap.to(svg, {
          opacity: 0,
          duration: 0.8,
          delay: 0.3,
          onComplete: () => setIsAnimating(false)
        });
      }
    });
    
    // Animate blocks sliding in and interlocking
    blockElements.forEach(({ path, block }, index) => {
      tl.fromTo(path, 
        {
          attr: { transform: `translate(${block.x}, ${block.y})` },
          opacity: 0
        },
        {
          attr: { transform: `translate(${block.targetX}, ${block.y})` },
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out'
        },
        index * 0.1 // Left block starts first, right block follows 0.1s later for faster transition
      );
    });
  };

  // Reset and set immediate background for instant section changes
  const setImmediateBackground = () => {
    if (backgroundRef.current) {
      const targetColor = sectionBackgrounds[sectionIndex % sectionBackgrounds.length];
      backgroundRef.current.style.backgroundColor = targetColor;
    }
  };

  // Trigger animation when section changes
  useEffect(() => {
    // Small delay to ensure smooth transitions
    const timer = setTimeout(() => {
      animateInterlockingBackground();
    }, 100);

    return () => clearTimeout(timer);
  }, [sectionIndex]);

  // Set initial background
  useEffect(() => {
    setImmediateBackground();
  }, []);

  return (
    <>
      {/* Solid background layer - this IS the actual background */}
      <div
        ref={backgroundRef}
        className="fixed inset-0 pointer-events-none"
        style={{ 
          zIndex: -2,
          backgroundColor: sectionBackgrounds[0] // Initial background
        }}
      />
      
      {/* Animated interlocking blocks layer */}
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: -1 }}
      />
    </>
  );
};

export default ParallaxBlocks;