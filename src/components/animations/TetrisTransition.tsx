import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TetrisBlock {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  startX: number;
  startY: number;
  finalX: number;
  finalY: number;
  shape: 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
}

interface TetrisTransitionProps {
  fromSection: string;
  toSection: string;
  triggerRef: React.RefObject<HTMLElement>;
  onComplete?: () => void;
  backgroundColor?: string;
}

const TetrisTransition: React.FC<TetrisTransitionProps> = ({
  fromSection,
  toSection,
  triggerRef,
  onComplete,
  backgroundColor = '#dc2626'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<TetrisBlock[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Tetris block shapes and colors - ONLY BLACK, WHITE, RED as specified
  const blockShapes = {
    I: { width: 4, height: 1, color: '#FF0000' }, // RED
    O: { width: 2, height: 2, color: '#000000' }, // BLACK
    T: { width: 3, height: 2, color: '#FFFFFF' }, // WHITE
    S: { width: 3, height: 2, color: '#FF0000' }, // RED
    Z: { width: 3, height: 2, color: '#000000' }, // BLACK
    J: { width: 3, height: 2, color: '#FFFFFF' }, // WHITE
    L: { width: 3, height: 2, color: '#FF0000' }  // RED
  };

  const createTetrisBlocks = (): TetrisBlock[] => {
    const blocks: TetrisBlock[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const gridSize = 40;
    
    // Create fishbone pattern in center
    const fishbonePattern = [
      // Center spine
      { x: 0, y: -3 }, { x: 0, y: -2 }, { x: 0, y: -1 }, { x: 0, y: 0 }, 
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 },
      // Left ribs
      { x: -1, y: -2 }, { x: -2, y: -1 }, { x: -3, y: 0 },
      { x: -2, y: 1 }, { x: -1, y: 2 },
      // Right ribs
      { x: 1, y: -2 }, { x: 2, y: -1 }, { x: 3, y: 0 },
      { x: 2, y: 1 }, { x: 1, y: 2 },
      // Additional decorative blocks
      { x: -1, y: -3 }, { x: 1, y: -3 },
      { x: -1, y: 3 }, { x: 1, y: 3 },
    ];

    fishbonePattern.forEach((pos, index) => {
      const shapeKeys = Object.keys(blockShapes) as Array<keyof typeof blockShapes>;
      const randomShape = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
      const shape = blockShapes[randomShape];
      
      // Final position in fishbone pattern
      const finalX = centerX + (pos.x * gridSize);
      const finalY = centerY + (pos.y * gridSize);
      
      // Random starting position from sides
      const fromLeft = Math.random() > 0.5;
      const startX = fromLeft ? -200 : window.innerWidth + 200;
      const startY = Math.random() * window.innerHeight;
      
      blocks.push({
        id: `block-${index}`,
        x: startX,
        y: startY,
        width: shape.width * (gridSize / 4),
        height: shape.height * (gridSize / 4),
        color: shape.color,
        startX,
        startY,
        finalX,
        finalY,
        shape: randomShape
      });
    });

    return blocks;
  };

  const animateBlocks = () => {
    if (!containerRef.current) return;

    const blocks = createTetrisBlocks();
    blocksRef.current = blocks;
    setIsActive(true);

    // Clear container
    containerRef.current.innerHTML = '';

    // Create DOM elements for blocks
    const blockElements = blocks.map(block => {
      const element = document.createElement('div');
      element.id = block.id;
      element.style.position = 'absolute';
      element.style.width = `${block.width}px`;
      element.style.height = `${block.height}px`;
      element.style.backgroundColor = block.color;
      element.style.borderRadius = '4px';
      // Add visible borders based on block color
      if (block.color === '#FFFFFF') {
        element.style.border = '2px solid #000000'; // Black border for white blocks
      } else {
        element.style.border = '2px solid rgba(255,255,255,0.3)';
      }
      element.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
      element.style.left = `${block.startX}px`;
      element.style.top = `${block.startY}px`;
      element.style.zIndex = '1000';
      
      containerRef.current?.appendChild(element);
      return element;
    });

    // Animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Form background after locking together
        setTimeout(() => {
          formBackground();
        }, 1000); // Give more time to see the locking
      }
    });

    // Phase 1: Blocks fly in from sides
    blockElements.forEach((element, index) => {
      const block = blocks[index];
      
      tl.to(element, {
        x: block.finalX - block.startX,
        y: block.finalY - block.startY,
        duration: 1.5 + Math.random() * 0.5,
        ease: "power2.out",
        rotation: Math.random() * 360,
      }, index * 0.1);
    });

    // Phase 2: Blocks lock together with magnetic effect
    tl.to(blockElements, {
      scale: 1.1,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.03,
    }, "-=0.5");

    tl.to(blockElements, {
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
      stagger: 0.03,
    });

    // Additional locking effect - snap into precise positions
    tl.to(blockElements, {
      x: '+=0', // Force precise positioning
      y: '+=0',
      duration: 0.2,
      ease: "power2.out"
    });

    // Phase 3: Pulse effect to show locking
    tl.to(blockElements, {
      boxShadow: '0 0 30px rgba(255, 0, 0, 0.8)',
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      stagger: 0.02
    });
  };

  const formBackground = () => {
    if (!containerRef.current) return;
    
    const blockElements = Array.from(containerRef.current.children);
    
    // Animation to form background - KEEP BLOCKS VISIBLE
    const tl = gsap.timeline({
      onComplete: () => {
        // Keep blocks visible as the background pattern
        setIsActive(false);
        onComplete?.();
      }
    });

    // Blocks stay locked together and become the background
    tl.to(blockElements, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power2.inOut"
    });

    // Add a subtle glow to show they're locked
    tl.to(blockElements, {
      boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
      duration: 1,
      ease: "power2.inOut"
    }, "-=0.3");

    // Blocks remain visible as the section background
    // They don't disappear - they become part of the design
  };

  useEffect(() => {
    if (!triggerRef.current) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => {
        if (!isActive) {
          animateBlocks();
        }
      },
      onLeave: () => {
        // Optional: trigger reverse animation
      },
      onEnterBack: () => {
        // Optional: re-trigger animation when scrolling back up
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [triggerRef, isActive]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 999 }}
    />
  );
};

export default TetrisTransition;