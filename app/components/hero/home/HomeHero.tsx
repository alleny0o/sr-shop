import { useEffect, useState } from 'react';
import { CTAButton } from '~/components/buttons/CTAButton';

// Type definitions
type FontFamily = 'source-serif-4' | 'inter';
type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type LetterSpacing = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';

interface DeviceSettings {
  headingSize: number;
  subheadingSize: number;
  buttonSize: number;
}

interface HeroConfig {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaUrl: string;
  backgroundImage: string;


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
  tablet: DeviceSettings;
  mobile: DeviceSettings;
}

// Hero configuration object - will be replaced by Sanity CMS data later
const heroConfig: HeroConfig = {
  heading: 'Your Vision, Engraved Forever',
  subheading: "Handcrafted keepsakes that capture life's moments.",
  ctaText: 'Create Your Keepsake',
  ctaUrl: '/collections',
  backgroundImage: '/media/coaster.jpg',

  // Typography Settings
  headingFont: 'inter',
  headingWeight: 'medium',
  headingTracking: 'normal',

  subheadingFont: 'source-serif-4',
  subheadingWeight: 'light',
  subheadingTracking: 'normal',

  buttonFont: 'inter',
  buttonWeight: 'light',
  buttonTracking: 'normal',

  desktop: {
    headingSize: 2,
    subheadingSize: 1,
    buttonSize: 0.9,
  },

  tablet: {
    headingSize: 2,
    subheadingSize: 1,
    buttonSize: 0.9,
  },

  mobile: {
    headingSize: 1.5,
    subheadingSize: 0.8,
    buttonSize: 0.7,
  },
};

export const HomeHero = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const settings = heroConfig[screenSize];

  const getFontClass = (font: FontFamily): string => {
    return font === 'source-serif-4' ? 'font-source-serif-4' : 'font-inter';
  };

  const getWeightClass = (weight: FontWeight): string => {
    const weights: Record<FontWeight, string> = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    };
    return weights[weight];
  };

  const getTrackingClass = (tracking: LetterSpacing): string => {
    const trackings: Record<LetterSpacing, string> = {
      tighter: 'tracking-tighter',
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      wide: 'tracking-wide',
      wider: 'tracking-wider',
      widest: 'tracking-widest',
    };
    return trackings[tracking];
  };

  // Convert font family from HomeHero types to CTAButton types
  const getButtonFont = (font: FontFamily): 'merriweather' | 'inter' => {
    return font === 'source-serif-4' ? 'merriweather' : 'inter';
  };

  return (
    <section
      id="home-hero"
      aria-label="Welcome to SR LaserWorks"
      className="lg:max-h-[595px] max-h-[700px] flex relative w-full max-w-10xl mx-auto overflow-hidden"
    >
      <div className="lg:max-h-[595px] max-h-[700px] flex flex-col lg:flex-row-reverse">
        {/* Image Container - Right side on desktop, top on mobile */}
        <div className="grow-0 relative z-base max-h-[375px] md:max-h-[450px] lg:max-h-none basis-3/5">
          <img
            src={heroConfig.backgroundImage}
            alt="Featured laser engraving work"
            className="w-full h-full object-cover !rounded-none"
            loading="eager"
          />
        </div>

        {/* Content Container - Left side on desktop, bottom on mobile */}
        <div
          className="bg-pastel-green-medium flex flex-col h-auto w-full items-start justify-center basis-2/5 py-10 lg:py-12 px-4 sm:px-6 lg:px-8 pointer-events-none"
        >
          <div className="space-y-6 w-full">
            {/* Heading */}
            <h1
              className={`${getFontClass(heroConfig.headingFont)} ${getWeightClass(heroConfig.headingWeight)} ${getTrackingClass(heroConfig.headingTracking)} leading-tight`}
              style={{ fontSize: `${settings.headingSize}rem` }}
            >
              {heroConfig.heading}
            </h1>

            {/* Subheading */}
            <p
              className={`${getFontClass(heroConfig.subheadingFont)} ${getWeightClass(heroConfig.subheadingWeight)} ${getTrackingClass(heroConfig.subheadingTracking)} leading-relaxed`}
              style={{ fontSize: `${settings.subheadingSize}rem` }}
            >
              {heroConfig.subheading}
            </p>

            {/* CTA Button */}
            <div className="pt-4 !pointer-events-auto">
              <CTAButton
                to={heroConfig.ctaUrl}
                font={getButtonFont(heroConfig.buttonFont)}
                weight={heroConfig.buttonWeight}
                tracking={heroConfig.buttonTracking}
                size={settings.buttonSize}
              >
                {heroConfig.ctaText}
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};