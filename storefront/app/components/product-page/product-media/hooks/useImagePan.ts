import { useState, useCallback, useRef, useEffect } from 'react';

interface UseImagePanOptions {
  enabled?: boolean;
  imageRef?: React.RefObject<HTMLImageElement>;
}

interface PanState {
  x: number;
  y: number;
}

export const useImagePan = (options: UseImagePanOptions = {}) => {
  const { enabled = true, imageRef } = options;
  
  const [panState, setPanState] = useState<PanState>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Calculate exact boundaries based on image vs viewport size
  const calculateBoundaries = useCallback(() => {
    if (!imageRef?.current) return { maxX: 0, maxY: 0 };
    
    const img = imageRef.current;
    const imgRect = img.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Your exact formula:
    const maxX = Math.max(0, (imgRect.width - viewportWidth) / 2);
    const maxY = Math.max(0, (imgRect.height - viewportHeight) / 2);
    
    return { maxX, maxY };
  }, [imageRef]);

  // Adjust pan position to stay within bounds
  const adjustPanToBounds = useCallback(() => {
    const { maxX, maxY } = calculateBoundaries();
    
    setPanState(prev => {
      const newX = Math.max(-maxX, Math.min(maxX, prev.x));
      const newY = Math.max(-maxY, Math.min(maxY, prev.y));
      
      // Only update if position actually changed (performance)
      if (newX !== prev.x || newY !== prev.y) {
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, [calculateBoundaries]);

  // Reset pan when disabled
  useEffect(() => {
    if (!enabled) {
      setPanState({ x: 0, y: 0 });
    }
  }, [enabled]);

  // Handle viewport resize - minimal performance impact
  useEffect(() => {
    if (!enabled) return;

    const handleResize = () => {
      // Use requestAnimationFrame for optimal performance
      requestAnimationFrame(() => {
        adjustPanToBounds();
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled, adjustPanToBounds]);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!enabled) return;
    
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartRef.current = {
      x: clientX - panState.x,
      y: clientY - panState.y
    };
  }, [enabled, panState.x, panState.y]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !enabled) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - dragStartRef.current.x;
    const newY = clientY - dragStartRef.current.y;
    
    // Calculate boundaries fresh on each move (only when dragging)
    const { maxX, maxY } = calculateBoundaries();
    
    // Apply your exact formula boundaries
    const boundedX = Math.max(-maxX, Math.min(maxX, newX));
    const boundedY = Math.max(-maxY, Math.min(maxY, newY));
    
    setPanState({ x: boundedX, y: boundedY });
  }, [isDragging, enabled, calculateBoundaries]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, handleMove, handleEnd]);

  const reset = useCallback(() => {
    setPanState({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  return {
    panState,
    isDragging,
    handlers: {
      onMouseDown: handleStart,
      onTouchStart: handleStart,
    },
    reset,
    transform: `translate3d(${panState.x}px, ${panState.y}px, 0px)`,
    cursor: isDragging ? 'grabbing' : 'grab'
  };
};