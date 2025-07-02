import React from 'react';
import { Link } from 'react-router';

type FontFamily = 'merriweather' | 'inter';
type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type LetterSpacing = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';

interface CTAButtonProps {
  to: string;
  children: React.ReactNode;
  font?: FontFamily;
  weight?: FontWeight;
  tracking?: LetterSpacing;
  size?: number; // rem
  className?: string;
  variant?: 'primary' | 'secondary';
  backgroundColor?: string;
  textColor?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  to,
  children,
  font = 'inter',
  weight = 'medium',
  tracking = 'normal',
  size = 1.125,
  className = '',
  variant = 'primary',
  backgroundColor = '#10b981', // default green-500
  textColor = '#ffffff',
}) => {
  // Font family classes
  const getFontClass = (fontFamily: FontFamily): string => {
    return fontFamily === 'merriweather' ? 'font-merriweather' : 'font-inter';
  };

  const getWeightClass = (fontWeight: FontWeight): string => {
    const weights: Record<FontWeight, string> = {
      'light': 'font-light',
      'normal': 'font-normal',
      'medium': 'font-medium',
      'semibold': 'font-semibold',
      'bold': 'font-bold',
      'extrabold': 'font-extrabold',
    };
    return weights[fontWeight];
  };

  const getTrackingClass = (letterSpacing: LetterSpacing): string => {
    const trackings: Record<LetterSpacing, string> = {
      'tighter': 'tracking-tighter',
      'tight': 'tracking-tight',
      'normal': 'tracking-normal',
      'wide': 'tracking-wide',
      'wider': 'tracking-wider',
      'widest': 'tracking-widest',
    };
    return trackings[letterSpacing];
  };

  return (
    <Link
      to={to}
      className={`
        ${getFontClass(font)} 
        ${getWeightClass(weight)}
        ${getTrackingClass(tracking)}
        py-2 px-4 transition-opacity duration-200 inline-block
        hover:opacity-90
        ${className}
      `.trim()}
      style={{ 
        fontSize: `${size}rem`,
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      {children}
    </Link>
  );
};