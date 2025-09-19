/**
 * 📱 useResponsive Hook
 * Custom hook for responsive behavior and breakpoint detection
 */

import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setResponsiveBreakpoint } from '../core/store/slices/admin/slice';
import type { ResponsiveBreakpoint } from '../core/store/slices/admin/types';

interface ResponsiveState {
  breakpoint: ResponsiveBreakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
}

interface UseResponsiveReturn extends ResponsiveState {
  isBreakpoint: (breakpoint: ResponsiveBreakpoint) => boolean;
  isMinBreakpoint: (breakpoint: ResponsiveBreakpoint) => boolean;
  isMaxBreakpoint: (breakpoint: ResponsiveBreakpoint) => boolean;
}

// Breakpoint values
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
} as const;

/**
 * Determine current breakpoint based on screen width
 */
const getBreakpoint = (width: number): ResponsiveBreakpoint => {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};

/**
 * Custom hook for responsive behavior management
 */
export const useResponsive = (): UseResponsiveReturn => {
  const dispatch = useDispatch();
  
  const [state, setState] = useState<ResponsiveState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    const breakpoint = getBreakpoint(width);
    
    return {
      breakpoint,
      isMobile: breakpoint === 'mobile',
      isTablet: breakpoint === 'tablet',
      isDesktop: breakpoint === 'desktop',
      screenWidth: width,
      screenHeight: height,
    };
  });

  /**
   * Handle window resize events
   */
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const breakpoint = getBreakpoint(width);
    
    const newState: ResponsiveState = {
      breakpoint,
      isMobile: breakpoint === 'mobile',
      isTablet: breakpoint === 'tablet',
      isDesktop: breakpoint === 'desktop',
      screenWidth: width,
      screenHeight: height,
    };
    
    setState(newState);
    
    // Update Redux store
    dispatch(setResponsiveBreakpoint(breakpoint));
  }, [dispatch]);

  /**
   * Setup resize listener
   */
  useEffect(() => {
    // Initial dispatch to Redux
    dispatch(setResponsiveBreakpoint(state.breakpoint));

    // Add resize listener
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch, handleResize, state.breakpoint, state.screenWidth, state.screenHeight]);

  /**
   * Check if current breakpoint matches
   */
  const isBreakpoint = useCallback((breakpoint: ResponsiveBreakpoint): boolean => {
    return state.breakpoint === breakpoint;
  }, [state.breakpoint]);

  /**
   * Check if current screen is at least the specified breakpoint
   */
  const isMinBreakpoint = useCallback((breakpoint: ResponsiveBreakpoint): boolean => {
    const currentWidth = state.screenWidth;
    const targetWidth = BREAKPOINTS[breakpoint];
    return currentWidth >= targetWidth;
  }, [state.screenWidth]);

  /**
   * Check if current screen is at most the specified breakpoint
   */
  const isMaxBreakpoint = useCallback((breakpoint: ResponsiveBreakpoint): boolean => {
    const currentWidth = state.screenWidth;
    const targetWidth = BREAKPOINTS[breakpoint];
    return currentWidth < targetWidth;
  }, [state.screenWidth]);

  return {
    ...state,
    isBreakpoint,
    isMinBreakpoint,
    isMaxBreakpoint,
  };
};

/**
 * Hook for media query matching
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
};

/**
 * Predefined media query hooks
 */
export const useIsMobile = () => useMediaQuery(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);
export const useIsTablet = () => useMediaQuery(`(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`);
export const useIsDesktop = () => useMediaQuery(`(min-width: ${BREAKPOINTS.tablet}px)`);
export const useIsLargeDesktop = () => useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`);

/**
 * Hook for detecting touch devices
 */
export const useIsTouchDevice = (): boolean => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - Legacy property
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouch();
    
    // Re-check on resize (for devices that can switch between touch/non-touch)
    window.addEventListener('resize', checkTouch, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkTouch);
    };
  }, []);

  return isTouch;
};

/**
 * Hook for detecting reduced motion preference
 */
export const usePrefersReducedMotion = (): boolean => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

/**
 * Hook for detecting dark mode preference
 */
export const usePrefersDarkMode = (): boolean => {
  return useMediaQuery('(prefers-color-scheme: dark)');
};

/**
 * Hook for detecting high contrast preference
 */
export const usePrefersHighContrast = (): boolean => {
  return useMediaQuery('(prefers-contrast: high)');
};