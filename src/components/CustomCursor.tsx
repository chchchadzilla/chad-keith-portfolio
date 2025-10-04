import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  cursorType: 'default' | 'hover' | 'drag' | 'click';
}

const CustomCursor: React.FC = () => {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    cursorType: 'default'
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursor(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY
      }));
    };

    const handleMouseEnter = () => {
      setCursor(prev => ({ ...prev, isHovering: true, cursorType: 'hover' }));
    };

    const handleMouseLeave = () => {
      setCursor(prev => ({ ...prev, isHovering: false, cursorType: 'default' }));
    };

    const handleMouseDown = () => {
      setCursor(prev => ({ ...prev, cursorType: 'click' }));
    };

    const handleMouseUp = () => {
      setCursor(prev => ({ ...prev, cursorType: cursor.isHovering ? 'hover' : 'default' }));
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, textarea, .cursor-hover');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [cursor.isHovering]);

  // Hide default cursor
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  const getCursorSize = () => {
    switch (cursor.cursorType) {
      case 'hover':
        return { width: 50, height: 50 };
      case 'click':
        return { width: 30, height: 30 };
      case 'drag':
        return { width: 60, height: 60 };
      default:
        return { width: 40, height: 40 };
    }
  };

  const getCursorColor = () => {
    switch (cursor.cursorType) {
      case 'hover':
        return '#dc2626'; // Chad red
      case 'click':
        return '#ffffff';
      default:
        return '#dc2626';
    }
  };

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: cursor.x - getCursorSize().width / 2,
          y: cursor.y - getCursorSize().height / 2,
          scale: cursor.cursorType === 'click' ? 0.8 : 1
        }}
        transition={{
          type: 'tween',
          ease: 'linear',
          duration: 0
        }}
      >
        <div
          className="rounded-full border-2 border-current"
          style={{
            width: getCursorSize().width,
            height: getCursorSize().height,
            backgroundColor: cursor.cursorType === 'hover' ? getCursorColor() + '20' : 'transparent',
            borderColor: getCursorColor()
          }}
        >
          {/* Inner dot for precision */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
            style={{
              backgroundColor: getCursorColor(),
              opacity: cursor.cursorType === 'hover' ? 1 : 0.6
            }}
          />
        </div>
      </motion.div>

      {/* Trailing effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: cursor.x - 3,
          y: cursor.y - 3
        }}
        transition={{
          type: 'tween',
          ease: 'linear',
          duration: 0
        }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: getCursorColor(),
            opacity: 0.4
          }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;