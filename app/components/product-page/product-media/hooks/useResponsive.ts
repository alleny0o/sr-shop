import { useState, useEffect } from 'react';

type BreakpointConfig = {
  mobile: number;
  tablet: number;
  desktop: number;
};

type ScreenSize = 'mobile' | 'tablet' | 'desktop';

const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
};

const getScreenSize = (width: number, breakpoints: BreakpointConfig): ScreenSize => {
  if (width < breakpoints.mobile) return 'mobile';
  if (width < breakpoints.tablet) return 'tablet';
  if (width < breakpoints.desktop) return 'desktop';
  return 'desktop';
};

export const useResponsive = (breakpoints: BreakpointConfig = DEFAULT_BREAKPOINTS) => {
  const [screenSize, setScreenSize] = useState<ScreenSize>(() => {
    if (typeof window === 'undefined') return 'desktop';
    return getScreenSize(window.innerWidth, breakpoints);
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newSize = getScreenSize(width, breakpoints);

      // Only update if size actually changed to prevent unnecessary re-renders
      setScreenSize(current => (current !== newSize ? newSize : current));
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints.mobile, breakpoints.tablet, breakpoints.desktop]);

  return {
    screenSize,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    isMobileOrTablet: screenSize === 'mobile' || screenSize === 'tablet',
    isTabletOrDesktop: screenSize === 'tablet' || screenSize === 'desktop',
  };
};

// Utility hook specifically for modal behavior (mobile vs desktop)
export const useModalBreakpoint = () => {
  const { screenSize } = useResponsive();

  // For modal: treat tablet as mobile (pan-zoom), desktop as carousel
  const isDesktopModal = screenSize === 'desktop';
  const isMobileModal = screenSize === 'mobile' || screenSize === 'tablet';

  return {
    isDesktopModal,
    isMobileModal,
    screenSize,
  };
};
