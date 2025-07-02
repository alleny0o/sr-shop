import { useEffect, useState } from 'react';
import { CTAButton } from '~/components/buttons/CTAButton';

// Type definitions
type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type FontFamily = 'merriweather' | 'inter';
type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type LetterSpacing = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';

interface DeviceSettings {
  position: Position;
  headingSize: number;
  subheadingSize: number;
  buttonSize: number;
  maxWidth: number;
  paddingY: number; // rem
  peekHeight?: number; // pixels
  maxHeight: number; // pixels
}

interface OverlaySettings {
  enabled: boolean;
  color: string;
  opacity: number;
}

interface HeroConfig {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaUrl: string;
  backgroundImage: string;
  
  // Color Settings
  textColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  
  // Typography Settings
  headingFont: FontFamily;
  headingWeight: FontWeight;
  headingTracking: LetterSpacing;
  
  subheadingFont: FontFamily;
  subheadingWeight: FontWeight;
  subheadingTracking: LetterSpacing;
  
  buttonFont: FontFamily;
  buttonWeight: FontWeight;
  buttonTracking: LetterSpacing;
  
  desktop: DeviceSettings;
  mobile: DeviceSettings;
  desktopOverlay: OverlaySettings;
  mobileOverlay: OverlaySettings;
}

// Hero configuration object - will be replaced by Sanity CMS data later
const heroConfig: HeroConfig = {
  heading: "Your Vision, Engraved Forever",
  subheading: "Precision Laser Solutions for Your Custom Projects",
  ctaText: "Explore Our Work",
  ctaUrl: "/collections",
  backgroundImage: "/media/coaster.jpg",
  
  // Color Settings
  textColor: "#ffffff",
  buttonBackgroundColor: "#ffffff",
  buttonTextColor: "#000000",
  
  // Typography Settings
  headingFont: 'inter',
  headingWeight: 'bold',
  headingTracking: 'tight',
  
  subheadingFont: 'inter',
  subheadingWeight: 'normal',
  subheadingTracking: 'normal',
  
  buttonFont: 'inter',
  buttonWeight: 'medium',
  buttonTracking: 'normal',
  
  desktop: {
    position: 'bottom-left',
    headingSize: 2.5,
    subheadingSize: 1.25,
    buttonSize: 1,
    maxWidth: 48,
    paddingY: 2, // rem
    peekHeight: 0, // pixels - set to 0 for no peek
    maxHeight: 800, // pixels
  },
  
  mobile: {
    position: 'bottom-left',
    headingSize: 1.5,
    subheadingSize: 0.9,
    buttonSize: 0.8,
    maxWidth: 60,
    paddingY: 1.5, // rem
    peekHeight: 0, // pixels - set to 0 for no peek
    maxHeight: 600, // pixels
  },
  
  desktopOverlay: {
    enabled: true,
    color: '#000000',
    opacity: 0.4,
  },
  
  mobileOverlay: {
    enabled: true,
    color: '#000000',
    opacity: 0.5,
  },
};

export const HomeHero = () => {
  const [heroHeight, setHeroHeight] = useState('100vh');

  useEffect(() => {
    const calculateHeight = () => {
      const announcement = document.getElementById('announcement-bar');
      const header = document.getElementById('header');
      const totalHeight = (announcement?.offsetHeight || 0) + (header?.offsetHeight || 0);
      
      // Add peek height based on device
      const isMobile = window.innerWidth < 768;
      const peekHeight = isMobile ? heroConfig.mobile.peekHeight || 0 : heroConfig.desktop.peekHeight || 0;
      
      setHeroHeight(`calc(100vh - ${totalHeight + peekHeight}px)`);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  const getPositionClasses = (position: Position): { container: string; text: string; button: string } => {
    const positions: Record<Position, { container: string; text: string; button: string }> = {
      'top-left': { 
        container: 'justify-start items-start', 
        text: 'text-left', 
        button: 'flex justify-start' 
      },
      'top-center': { 
        container: 'justify-center items-start', 
        text: 'text-center', 
        button: 'flex justify-center' 
      },
      'top-right': { 
        container: 'justify-end items-start', 
        text: 'text-right', 
        button: 'flex justify-end' 
      },
      'middle-left': { 
        container: 'justify-start items-center', 
        text: 'text-left', 
        button: 'flex justify-start' 
      },
      'middle-center': { 
        container: 'justify-center items-center', 
        text: 'text-center', 
        button: 'flex justify-center' 
      },
      'middle-right': { 
        container: 'justify-end items-center', 
        text: 'text-right', 
        button: 'flex justify-end' 
      },
      'bottom-left': { 
        container: 'justify-start items-end', 
        text: 'text-left', 
        button: 'flex justify-start' 
      },
      'bottom-center': { 
        container: 'justify-center items-end', 
        text: 'text-center', 
        button: 'flex justify-center' 
      },
      'bottom-right': { 
        container: 'justify-end items-end', 
        text: 'text-right', 
        button: 'flex justify-end' 
      },
    };
    return positions[position];
  };

  const getFontClass = (font: FontFamily): string => {
    return font === 'merriweather' ? 'font-merriweather' : 'font-inter';
  };

  const getWeightClass = (weight: FontWeight): string => {
    const weights: Record<FontWeight, string> = {
      'light': 'font-light',
      'normal': 'font-normal',
      'medium': 'font-medium',
      'semibold': 'font-semibold',
      'bold': 'font-bold',
      'extrabold': 'font-extrabold',
    };
    return weights[weight];
  };

  const getTrackingClass = (tracking: LetterSpacing): string => {
    const trackings: Record<LetterSpacing, string> = {
      'tighter': 'tracking-tighter',
      'tight': 'tracking-tight',
      'normal': 'tracking-normal',
      'wide': 'tracking-wide',
      'wider': 'tracking-wider',
      'widest': 'tracking-widest',
    };
    return trackings[tracking];
  };

  return (
    <section
      id="home-hero"
      aria-label="Welcome to SR LaserWorks"
      className="relative w-full max-w-10xl mx-auto overflow-hidden"
      style={{ 
        height: heroHeight,
        maxHeight: window.innerWidth < 768 ? `${heroConfig.mobile.maxHeight}px` : `${heroConfig.desktop.maxHeight}px`
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroConfig.backgroundImage}
          alt="Hero Background"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Desktop Overlay */}
      {heroConfig.desktopOverlay.enabled && (
        <div 
          className="hidden md:block absolute inset-0"
          style={{
            backgroundColor: heroConfig.desktopOverlay.color,
            opacity: heroConfig.desktopOverlay.opacity,
          }}
        />
      )}

      {/* Mobile Overlay */}
      {heroConfig.mobileOverlay.enabled && (
        <div 
          className="block md:hidden absolute inset-0"
          style={{
            backgroundColor: heroConfig.mobileOverlay.color,
            opacity: heroConfig.mobileOverlay.opacity,
          }}
        />
      )}

      {/* Content Container - Desktop */}
      <div 
        className={`hidden md:flex relative z-10 w-full h-full px-4 sm:px-6 lg:px-8 ${getPositionClasses(heroConfig.desktop.position).container}`}
        style={{ paddingTop: `${heroConfig.desktop.paddingY}rem`, paddingBottom: `${heroConfig.desktop.paddingY}rem` }}
      >
        <div 
          className={`flex flex-col ${getPositionClasses(heroConfig.desktop.position).text}`}
          style={{ maxWidth: `${heroConfig.desktop.maxWidth}rem` }}
        >
          {/* Main Heading - Desktop */}
          <h1 
            className={`${getFontClass(heroConfig.headingFont)} ${getWeightClass(heroConfig.headingWeight)} ${getTrackingClass(heroConfig.headingTracking)} mb-6 leading-tight`}
            style={{ 
              fontSize: `${heroConfig.desktop.headingSize}rem`,
              color: heroConfig.textColor
            }}
          >
            {heroConfig.heading}
          </h1>
          
          {/* Subheading - Desktop */}
          <p 
            className={`${getFontClass(heroConfig.subheadingFont)} ${getWeightClass(heroConfig.subheadingWeight)} ${getTrackingClass(heroConfig.subheadingTracking)} mb-8 leading-relaxed`}
            style={{ 
              fontSize: `${heroConfig.desktop.subheadingSize}rem`,
              color: heroConfig.textColor
            }}
          >
            {heroConfig.subheading}
          </p>
          
          {/* CTA Button - Desktop */}
          <div className={`${getPositionClasses(heroConfig.desktop.position).button} mt-4`}>
            <CTAButton
              to={heroConfig.ctaUrl}
              font={heroConfig.buttonFont}
              weight={heroConfig.buttonWeight}
              tracking={heroConfig.buttonTracking}
              size={heroConfig.desktop.buttonSize}
              backgroundColor={heroConfig.buttonBackgroundColor}
              textColor={heroConfig.buttonTextColor}
            >
              {heroConfig.ctaText}
            </CTAButton>
          </div>
        </div>
      </div>

      {/* Content Container - Mobile */}
      <div 
        className={`flex md:hidden relative z-10 w-full h-full px-4 ${getPositionClasses(heroConfig.mobile.position).container}`}
        style={{ paddingTop: `${heroConfig.mobile.paddingY}rem`, paddingBottom: `${heroConfig.mobile.paddingY}rem` }}
      >
        <div 
          className={`flex flex-col ${getPositionClasses(heroConfig.mobile.position).text}`}
          style={{ maxWidth: `${heroConfig.mobile.maxWidth}rem` }}
        >
          {/* Main Heading - Mobile */}
          <h1 
            className={`${getFontClass(heroConfig.headingFont)} ${getWeightClass(heroConfig.headingWeight)} ${getTrackingClass(heroConfig.headingTracking)} mb-4 leading-tight`}
            style={{ 
              fontSize: `${heroConfig.mobile.headingSize}rem`,
              color: heroConfig.textColor
            }}
          >
            {heroConfig.heading}
          </h1>
          
          {/* Subheading - Mobile */}
          <p 
            className={`${getFontClass(heroConfig.subheadingFont)} ${getWeightClass(heroConfig.subheadingWeight)} ${getTrackingClass(heroConfig.subheadingTracking)} mb-6 leading-relaxed`}
            style={{ 
              fontSize: `${heroConfig.mobile.subheadingSize}rem`,
              color: `${heroConfig.textColor}E6` // 90% opacity
            }}
          >
            {heroConfig.subheading}
          </p>
          
          {/* CTA Button - Mobile */}
          <div className={`${getPositionClasses(heroConfig.mobile.position).button} mt-4`}>
            <CTAButton
              to={heroConfig.ctaUrl}
              font={heroConfig.buttonFont}
              weight={heroConfig.buttonWeight}
              tracking={heroConfig.buttonTracking}
              size={heroConfig.mobile.buttonSize}
              backgroundColor={heroConfig.buttonBackgroundColor}
              textColor={heroConfig.buttonTextColor}
              className="px-6" // Mobile-specific padding override
            >
              {heroConfig.ctaText}
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
};