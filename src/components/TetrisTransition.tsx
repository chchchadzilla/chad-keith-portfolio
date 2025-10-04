import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface TetrisTransitionProps {
  isActive: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
  blockCount?: number;
  duration?: number;
}

const TetrisTransition: React.FC<TetrisTransitionProps> = ({
  isActive,
  direction = 'left',
  blockCount = 40,
  duration = 2.5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitionComplete, setIsTransitionComplete] = useState(false);

  // Tetris-like block shapes for fishbone patterns
  const tetrisShapes = [
    // I-piece (horizontal)
    { pattern: [[1, 1, 1, 1]], width: 4, height: 1 },
    // I-piece (vertical) 
    { pattern: [[1], [1], [1], [1]], width: 1, height: 4 },
    // O-piece
    { pattern: [[1, 1], [1, 1]], width: 2, height: 2 },
    // T-piece variations
    { pattern: [[0, 1, 0], [1, 1, 1]], width: 3, height: 2 },
    { pattern: [[1, 0], [1, 1], [1, 0]], width: 2, height: 3 },
    // L-piece variations
    { pattern: [[1, 0, 0], [1, 1, 1]], width: 3, height: 2 },
    { pattern: [[1, 1], [1, 0], [1, 0]], width: 2, height: 3 },
    // S-piece
    { pattern: [[0, 1, 1], [1, 1, 0]], width: 3, height: 2 },
    // Z-piece  
    { pattern: [[1, 1, 0], [0, 1, 1]], width: 3, height: 2 }
  ];

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';
    setIsTransitionComplete(false);

    // Create fishbone formation coordinates
    const fishbonePositions = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const spineLength = Math.min(window.innerWidth, window.innerHeight) * 0.6;
    
    // Main spine (vertical center line)
    for (let i = 0; i < 8; i++) {
      const y = centerY - spineLength/2 + (i * spineLength/7);
      fishbonePositions.push({ x: centerX, y, isSpine: true });
    }
    
    // Ribs extending from spine (fishbone pattern)
    for (let i = 1; i < 7; i++) {
      const spineY = centerY - spineLength/2 + (i * spineLength/7);
      const ribLength = (spineLength * 0.3) * (1 - Math.abs(i - 3.5) / 3.5);
      
      // Left ribs
      for (let j = 1; j <= 3; j++) {
        fishbonePositions.push({
          x: centerX - (j * ribLength / 3),
          y: spineY - (j * 15), // Angled ribs
          isRib: true,
          side: 'left'
        });
      }
      
      // Right ribs 
      for (let j = 1; j <= 3; j++) {
        fishbonePositions.push({
          x: centerX + (j * ribLength / 3),
          y: spineY - (j * 15), // Angled ribs
          isRib: true,
          side: 'right'
        });
      }
    }

    // Generate tetris blocks
    const blocks = [];
    for (let i = 0; i < blockCount; i++) {
      const shape = tetrisShapes[Math.floor(Math.random() * tetrisShapes.length)];
      const blockSize = 25;
      const block = document.createElement('div');
      
      // Position blocks at screen edges initially
      const startPositions = {
        left: { x: -200, y: Math.random() * window.innerHeight },
        right: { x: window.innerWidth + 200, y: Math.random() * window.innerHeight },
        up: { x: Math.random() * window.innerWidth, y: -200 },
        down: { x: Math.random() * window.innerWidth, y: window.innerHeight + 200 }
      };
      
      const startPos = startPositions[direction];
      
      block.className = 'absolute z-50';
      block.style.left = `${startPos.x}px`;
      block.style.top = `${startPos.y}px`;
      block.style.width = `${shape.width * blockSize}px`;
      block.style.height = `${shape.height * blockSize}px`;
      
      // Create tetris pattern grid
      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = `repeat(${shape.width}, 1fr)`;
      grid.style.gridTemplateRows = `repeat(${shape.height}, 1fr)`;
      grid.style.width = '100%';
      grid.style.height = '100%';
      grid.style.gap = '2px';
      
      shape.pattern.forEach(row => {
        row.forEach(cell => {
          const cellDiv = document.createElement('div');
          if (cell) {
            cellDiv.style.backgroundColor = '#dc2626';
            cellDiv.style.border = '1px solid #ffffff20';
            cellDiv.style.borderRadius = '2px';
            cellDiv.style.boxShadow = '0 0 10px rgba(220, 38, 38, 0.5)';
          } else {
            cellDiv.style.backgroundColor = 'transparent';
          }
          grid.appendChild(cellDiv);
        });
      });
      
      block.appendChild(grid);
      container.appendChild(block);
      blocks.push({ element: block, targetPos: fishbonePositions[i % fishbonePositions.length] });
    }

    // Animate blocks into fishbone formation
    const timeline = gsap.timeline({
      onComplete: () => {
        // Hold the formation for a moment, then transform into background
        gsap.to(blocks.map(b => b.element), {
          scale: 2,
          rotation: 0,
          opacity: 0.1,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.02,
          onComplete: () => {
            setIsTransitionComplete(true);
            // Keep the pattern as background for a few seconds
            setTimeout(() => {
              gsap.to(container, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                  container.innerHTML = '';
                }
              });
            }, 1000);
          }
        });
      }
    });
    
    blocks.forEach((block, index) => {
      const delay = (index / blocks.length) * 0.8;
      const target = block.targetPos;
      
      // Phase 1: Fly to formation position
      timeline.to(block.element, {
        x: target.x - parseInt(block.element.style.left),
        y: target.y - parseInt(block.element.style.top),
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4,
        duration: duration * 0.6,
        delay: delay,
        ease: 'power2.out'
      }, 0);
      
      // Phase 2: Lock into place with slight vibration
      timeline.to(block.element, {
        rotation: target.isSpine ? 0 : (target.side === 'left' ? -25 : 25),
        scale: 1,
        duration: duration * 0.2,
        ease: 'back.out(1.7)'
      }, duration * 0.6);
    });

    return () => {
      timeline.kill();
    };
  }, [isActive, direction, blockCount, duration]);

  if (!isActive) return null;

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ overflow: 'hidden' }}
      />
      {/* Background overlay during transition */}
      {isTransitionComplete && (
        <div className="fixed inset-0 z-30 bg-gradient-to-br from-chad-red/5 via-chad-black/80 to-chad-black pointer-events-none" />
      )}
    </>
  );
};

export default TetrisTransition;