/**
 * 📱 useResponsive Hook
 * Enhanced hook for responsive behavior and breakpoint detection
 * Provides comprehensive responsive utilities and device detection
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../core/store';
import { setResponsiveBreakpoint } from '../../../core/store/slices/admin/slice';
import type { ResponsiveBreakpoint } from '../../../core/store/slices/admin/types';

interface ResponsiveState {
  breakpoint: ResponsiveBreakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
}

interface UseResponsiveReturn extends ResponsiveState {
  // Breakpoint utilities
  isBreakpoint: (breakpoint: ResponsiveBreakpoint) => boolean;
  isMinBreakpoint: (breakpoint: ResponsiveBreakpoint) => boolean;
  isMaxBreakpoint: (breakpoint: ResponsiveBreakpoint) => boolean;
  
  // Device detection
  isTouch: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  devicePixelRatio: number;
  
  // Responsive utilities
  getResponsiveValue: <T>(values: { mobile?: T; tablet?: T; desktop: T }) => T;
  matchesMediaQuery: (query: string) => boolean;
  
  // Layout utilities
  getSidebarBehavior: () => 'hidden' | 'collapsed' | 'expanded';
  shouldShowMobileMenu: () => boolean;
  getOptimalColumns: (maxColumns: number) => number;
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
 * Enhanced custom hook for responsive behavior management
 */
export const useResponsive = (): UseResponsiveReturn => {
  const dispatch = useDispatch();
  
  // Get responsive state from Redux
  const responsiveState = useSelector((state: RootState) => state.admin.ui.responsive);
  
  const [localState, setLocalState] = useState<ResponsiveState>(() => {
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

  const [deviceInfo, setDeviceInfo] = useState(() => ({
    isTouch: false,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
  }));

  /**
   * 🔄 Handle window resize events
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
    
    setLocalState(newState);
    
    // Update Redux store only if breakpoint changed
    if (breakpoint !== responsiveState.breakpoint) {
      dispatch(setResponsiveBreakpoint(breakpoint));
    }
  }, [dispatch, responsiveState.breakpoint]);

  /**
   * 🔄 Detect device capabilities
   */
  useEffect(() => {
    const detectTouch = () => {
      const hasTouch = 'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0 ||
                     // @ts-ignore - Legacy property
                     navigator.msMaxTouchPoints > 0;
      
      setDeviceInfo(prev => ({
        ...prev,
        isTouch: hasTouch,
        devicePixelRatio: window.devicePixelRatio,
      }));
    };

    detectTouch();
    
    // Listen for device changes
    window.addEventListener('resize', detectTouch, { passive: true });
    
    return () => {
      window.removeEventListener('resize', detectTouch);
    };
  }, []);

  /**
   * 🔄 Initial dispatch to Redux (run only once on mount)
   */
  useEffect(() => {
    dispatch(setResponsiveBreakpoint(localState.breakpoint));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  /**
   * 🔄 Setup resize listener (run only once on mount)
   */
  useEffect(() => {
    // Add resize listener with debouncing
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount to avoid infinite loops

  /**
   * 🎯 Check if current breakpoint matches
   */
  const isBreakpoint = useCallback((breakpoint: ResponsiveBreakpoint): boolean => {
    return localState.breakpoint === breakpoint;
  }, [localState.breakpoint]);

  /**
   * 🎯 Check if current screen is at least the specified breakpoint
   */
  const isMinBreakpoint = useCallback((breakpoint: ResponsiveBreakpoint): boolean => {
    const currentWidth = localState.screenWidth;
    const targetWidth = BREAKPOINTS[breakpoint];
    return currentWidth >= targetWidth;
  }, [localState.screenWidth]);

  /**
   * 🎯 Check if current screen is at most the specified breakpoint
   */
  const isMaxBreakpoint = useCallback((breakpoint: ResponsiveBreakpoint): boolean => {
    const currentWidth = localState.screenWidth;
    const targetWidth = BREAKPOINTS[breakpoint];
    return currentWidth < targetWidth;
  }, [localState.screenWidth]);

  /**
   * 🎯 Get responsive value based on current breakpoint
   */
  const getResponsiveValue = useCallback(<T>(values: { mobile?: T; tablet?: T; desktop: T }): T => {
    if (localState.isMobile && values.mobile !== undefined) {
      return values.mobile;
    }
    if (localState.isTablet && values.tablet !== undefined) {
      return values.tablet;
    }
    return values.desktop;
  }, [localState.isMobile, localState.isTablet]);

  /**
   * 🎯 Check if media query matches
   */
  const matchesMediaQuery = useCallback((query: string): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, []);

  /**
   * 🎯 Get optimal sidebar behavior for current breakpoint
   */
  const getSidebarBehavior = useCallback((): 'hidden' | 'collapsed' | 'expanded' => {
    if (localState.isMobile) return 'hidden';
    if (localState.isTablet) return 'collapsed';
    return 'expanded';
  }, [localState.isMobile, localState.isTablet]);

  /**
   * 🎯 Check if mobile menu should be shown
   */
  const shouldShowMobileMenu = useCallback((): boolean => {
    return localState.isMobile;
  }, [localState.isMobile]);

  /**
   * 🎯 Get optimal number of columns for current breakpoint
   */
  const getOptimalColumns = useCallback((maxColumns: number): number => {
    if (localState.isMobile) return 1;
    if (localState.isTablet) return Math.min(2, maxColumns);
    return maxColumns;
  }, [localState.isMobile, localState.isTablet]);

  /**
   * 🎨 Computed orientation
   */
  const orientation = useMemo(() => ({
    isLandscape: localState.screenWidth > localState.screenHeight,
    isPortrait: localState.screenWidth <= localState.screenHeight,
  }), [localState.screenWidth, localState.screenHeight]);

  return {
    // State
    ...localState,
    
    // Device info
    isTouch: deviceInfo.isTouch,
    isLandscape: orientation.isLandscape,
    isPortrait: orientation.isPortrait,
    devicePixelRatio: deviceInfo.devicePixelRatio,
    
    // Breakpoint utilities
    isBreakpoint,
    isMinBreakpoint,
    isMaxBreakpoint,
    
    // Responsive utilities
    getResponsiveValue,
    matchesMediaQuery,
    
    // Layout utilities
    getSidebarBehavior,
    shouldShowMobileMenu,
    getOptimalColumns,
  };
};

export default useResponsive;