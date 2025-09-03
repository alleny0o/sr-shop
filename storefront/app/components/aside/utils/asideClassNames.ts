import { cn } from '~/utils/cn';
import type { AsideConfig } from '../types/aside';

/**
 * Calculates the position for each breakpoint based on the config
 * Falls back to default if no specific breakpoint is defined
 */
export function getPositionAtBreakpoint(config: AsideConfig) {
  const mobilePosition = config.default;
  const smPosition = config.sm || config.default;
  const mdPosition = config.md || config.default;
  const lgPosition = config.lg || config.default;

  return { mobilePosition, smPosition, mdPosition, lgPosition };
}

/**
 * Generates responsive Tailwind classes for the aside element
 * Handles three position types with distinct animation behaviors:
 * - modal: Full-screen overlay with opacity fade transitions
 * - left: Left-side panel with horizontal slide transitions (no fade)
 * - right: Right-side panel with horizontal slide transitions (no fade)
 */
export function getAsideClasses(config: AsideConfig, expanded: boolean, closing: boolean): string {
  const { mobilePosition, smPosition, mdPosition, lgPosition } = getPositionAtBreakpoint(config);

  // Base classes applied to all positions - NO transition here to avoid conflicts
  const baseClasses = cn(
    'fixed z-50 bg-white shadow-[0_0_50px_rgba(0,0,0,0.3)]',
    closing && '!transition-none', // Disable transitions when closing for instant hide
  );

  const allClasses = [baseClasses];

  // === MOBILE (default) STYLES ===
  // Apply base mobile styles - each position type gets its own transition
  if (mobilePosition === 'modal') {
    allClasses.push(
      // Modal: Full screen overlay
      'inset-0 w-full h-full translate-x-0',
      // Modal uses opacity transition only
      'transition-opacity duration-300 ease-in-out',
      expanded ? 'opacity-100' : 'opacity-0',
    );
  } else if (mobilePosition === 'left') {
    allClasses.push(
      // Left panel: Positioned on left, slides horizontally
      'top-0 bottom-0 left-0 w-full max-w-[var(--aside-width)] h-full',
      // Always visible (opacity-100), uses transform transition only
      'opacity-100 transition-transform duration-500 ease-out',
      expanded ? 'translate-x-0' : '-translate-x-full',
    );
  } else {
    // right
    allClasses.push(
      // Right panel: Positioned on right, slides horizontally
      'top-0 bottom-0 right-0 w-full max-w-[var(--aside-width)] h-full',
      // Always visible (opacity-100), uses transform transition only
      'opacity-100 transition-transform duration-500 ease-out',
      expanded ? 'translate-x-0' : 'translate-x-full',
    );
  }

  // === SM BREAKPOINT (640px+) ===
  // Only add responsive classes when position changes from mobile
  if (smPosition !== mobilePosition) {
    if (smPosition === 'modal') {
      allClasses.push(
        // Override positioning to full screen
        'sm:inset-0 sm:w-full sm:h-full sm:max-w-none sm:translate-x-0 sm:left-0 sm:right-0',
        // Switch to opacity transition
        'sm:transition-opacity sm:duration-200 sm:ease-in-out',
        expanded ? 'sm:opacity-100' : 'sm:opacity-0',
      );
    } else if (smPosition === 'left') {
      allClasses.push(
        // Reset inset and position on left
        'sm:inset-auto sm:top-0 sm:bottom-0 sm:left-0 sm:right-auto',
        'sm:w-full sm:max-w-[var(--aside-width)] sm:h-full',
        // Always visible, use transform transition
        'sm:opacity-100 sm:transition-transform sm:duration-500 sm:ease-out',
        expanded ? 'sm:translate-x-0' : 'sm:-translate-x-full',
      );
    } else {
      // right
      allClasses.push(
        // Reset inset and position on right
        'sm:inset-auto sm:top-0 sm:bottom-0 sm:right-0 sm:left-auto',
        'sm:w-full sm:max-w-[var(--aside-width)] sm:h-full',
        // Always visible, use transform transition
        'sm:opacity-100 sm:transition-transform sm:duration-500 sm:ease-out',
        expanded ? 'sm:translate-x-0' : 'sm:translate-x-full',
      );
    }
  }

  // === MD BREAKPOINT (768px+) ===
  // Only add responsive classes when position changes from sm
  if (mdPosition !== smPosition) {
    if (mdPosition === 'modal') {
      allClasses.push(
        // Override positioning to full screen
        'md:inset-0 md:w-full md:h-full md:max-w-none md:translate-x-0 md:left-0 md:right-0',
        // Switch to opacity transition
        'md:transition-opacity md:duration-200 md:ease-in-out',
        expanded ? 'md:opacity-100' : 'md:opacity-0',
      );
    } else if (mdPosition === 'left') {
      allClasses.push(
        // Reset inset and position on left
        'md:inset-auto md:top-0 md:bottom-0 md:left-0 md:right-auto',
        'md:w-full md:max-w-[var(--aside-width)] md:h-full',
        // Always visible, use transform transition
        'md:opacity-100 md:transition-transform md:duration-500 md:ease-out',
        expanded ? 'md:translate-x-0' : 'md:-translate-x-full',
      );
    } else {
      // right
      allClasses.push(
        // Reset inset and position on right
        'md:inset-auto md:top-0 md:bottom-0 md:right-0 md:left-auto',
        'md:w-full md:max-w-[var(--aside-width)] md:h-full',
        // Always visible, use transform transition
        'md:opacity-100 md:transition-transform md:duration-500 md:ease-out',
        expanded ? 'md:translate-x-0' : 'md:translate-x-full',
      );
    }
  }

  // === LG BREAKPOINT (1024px+) ===
  // Only add responsive classes when position changes from md
  if (lgPosition !== mdPosition) {
    if (lgPosition === 'modal') {
      allClasses.push(
        // Override positioning to full screen
        'lg:inset-0 lg:w-full lg:h-full lg:max-w-none lg:translate-x-0 lg:left-0 lg:right-0',
        // Switch to opacity transition
        'lg:transition-opacity lg:duration-200 lg:ease-in-out',
        expanded ? 'lg:opacity-100' : 'lg:opacity-0',
      );
    } else if (lgPosition === 'left') {
      allClasses.push(
        // Reset inset and position on left
        'lg:inset-auto lg:top-0 lg:bottom-0 lg:left-0 lg:right-auto',
        'lg:w-full lg:max-w-[var(--aside-width)] lg:h-full',
        // Always visible, use transform transition
        'lg:opacity-100 lg:transition-transform lg:duration-500 lg:ease-out',
        expanded ? 'lg:translate-x-0' : 'lg:-translate-x-full',
      );
    } else {
      // right
      allClasses.push(
        // Reset inset and position on right
        'lg:inset-auto lg:top-0 lg:bottom-0 lg:right-0 lg:left-auto',
        'lg:w-full lg:max-w-[var(--aside-width)] lg:h-full',
        // Always visible, use transform transition
        'lg:opacity-100 lg:transition-transform lg:duration-500 lg:ease-out',
        expanded ? 'lg:translate-x-0' : 'lg:translate-x-full',
      );
    }
  }

  return allClasses.join(' ');
}
