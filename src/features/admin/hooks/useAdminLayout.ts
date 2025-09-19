/**
 * 🏛️ useAdminLayout Hook
 * Custom hook for managing admin layout state and sidebar behavior
 * Provides centralized layout management with localStorage persistence
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../core/store';
import {
  toggleSidebar,
  toggleMobileSidebar,
  setSidebarCollapsed,
  setMobileSidebarOpen,
  resetAdminState,
} from '../../../core/store/slices/admin/slice';
import type { LayoutConfig } from '../types';

interface UseAdminLayoutReturn {
  // State
  isInitialized: boolean;
  sidebar: {
    collapsed: boolean;
    mobileOpen: boolean;
    persistCollapsed: boolean;
    width: {
      expanded: number;
      collapsed: number;
    };
  };
  header: {
    height: number;
    showBreadcrumbs: boolean;
    showUserProfile: boolean;
  };
  main: {
    padding: string;
    maxWidth?: string;
    scrollable: boolean;
  };
  responsive: {
    breakpoint: 'mobile' | 'tablet' | 'desktop';
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    screenWidth: number;
    screenHeight: number;
  };
  
  // Actions
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  updateHeaderConfig: (config: Partial<LayoutConfig['header']>) => void;
  updateMainConfig: (config: Partial<LayoutConfig['main']>) => void;
  resetLayout: () => void;
  
  // Utilities
  getSidebarWidth: () => number;
  getLayoutClasses: () => string[];
  isLayoutReady: () => boolean;
}

/**
 * 🎯 useAdminLayout Hook
 * Manages admin layout state, sidebar behavior, and responsive configuration
 */
export const useAdminLayout = (): UseAdminLayoutReturn => {
  const dispatch = useDispatch();
  
  // Redux state selectors
  const adminState = useSelector((state: RootState) => state.admin);
  const { ui, navigation, isInitialized } = adminState;
  const { sidebar, header, main, responsive } = ui;
  
  // Map windowWidth/Height to screenWidth/Height for compatibility
  const responsiveWithScreenSize = useMemo(() => ({
    ...responsive,
    screenWidth: responsive.windowWidth,
    screenHeight: responsive.windowHeight,
  }), [responsive]);

  // Note: Initialization is handled by the initial state, no need for separate action

  /**
   * 💾 Persist sidebar state to localStorage
   */
  useEffect(() => {
    if (sidebar.persistCollapsed && !responsive.isMobile) {
      try {
        const sidebarState = {
          collapsed: sidebar.collapsed,
          timestamp: Date.now(),
        };
        localStorage.setItem('admin-sidebar-state', JSON.stringify(sidebarState));
      } catch (error) {
        console.warn('Failed to persist sidebar state:', error);
      }
    }
  }, [sidebar.collapsed, sidebar.persistCollapsed, responsive.isMobile]);

  /**
   * 🔄 Load persisted sidebar state
   */
  const loadPersistedState = useCallback(() => {
    try {
      const saved = localStorage.getItem('admin-sidebar-state');
      if (saved) {
        const { collapsed, timestamp } = JSON.parse(saved);
        
        // Check if state is not too old (7 days)
        const isRecent = Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000;
        
        // Only load if different from current state to prevent loops
        if (isRecent && typeof collapsed === 'boolean' && !responsive.isMobile && collapsed !== sidebar.collapsed) {
          dispatch(setSidebarCollapsed(collapsed));
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted sidebar state:', error);
    }
  }, [dispatch, responsive.isMobile, sidebar.collapsed]);

  /**
   * 🎯 Toggle sidebar collapsed state
   */
  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  /**
   * 🎯 Toggle mobile sidebar open state
   */
  const handleToggleMobileSidebar = useCallback(() => {
    dispatch(toggleMobileSidebar());
  }, [dispatch]);

  /**
   * 🎯 Set sidebar collapsed state
   */
  const handleSetSidebarCollapsed = useCallback((collapsed: boolean) => {
    dispatch(setSidebarCollapsed(collapsed));
  }, [dispatch]);

  /**
   * 🎯 Set mobile sidebar open state
   */
  const handleSetMobileSidebarOpen = useCallback((open: boolean) => {
    dispatch(setMobileSidebarOpen(open));
  }, [dispatch]);

  /**
   * 🎯 Update header configuration (placeholder - not implemented in slice yet)
   */
  const handleUpdateHeaderConfig = useCallback((config: Partial<LayoutConfig['header']>) => {
    console.warn('updateHeaderConfig not implemented yet:', config);
    // TODO: Implement updateHeaderConfig action in admin slice
  }, []);

  /**
   * 🎯 Update main content configuration (placeholder - not implemented in slice yet)
   */
  const handleUpdateMainConfig = useCallback((config: Partial<LayoutConfig['main']>) => {
    console.warn('updateMainConfig not implemented yet:', config);
    // TODO: Implement updateMainConfig action in admin slice
  }, []);

  /**
   * 🎯 Reset layout to default state
   */
  const handleResetLayout = useCallback(() => {
    dispatch(resetAdminState());
    
    // Clear localStorage
    try {
      localStorage.removeItem('admin-sidebar-state');
    } catch (error) {
      console.warn('Failed to clear sidebar state from localStorage:', error);
    }
  }, [dispatch]);

  /**
   * 🎨 Get current sidebar width
   */
  const getSidebarWidth = useCallback((): number => {
    if (responsive.isMobile) return 0;
    return sidebar.collapsed ? sidebar.width.collapsed : sidebar.width.expanded;
  }, [sidebar.collapsed, sidebar.width, responsive.isMobile]);

  /**
   * 🎨 Generate layout CSS classes
   */
  const getLayoutClasses = useCallback((): string[] => {
    const classes = ['admin-layout'];
    
    // Sidebar state classes
    if (sidebar.collapsed) {
      classes.push('admin-layout--sidebar-collapsed');
    } else {
      classes.push('admin-layout--sidebar-expanded');
    }
    
    // Mobile sidebar state
    if (responsive.isMobile && sidebar.mobileOpen) {
      classes.push('admin-layout--mobile-sidebar-open');
    }
    
    // Responsive classes
    classes.push(`admin-layout--${responsive.breakpoint}`);
    
    // Always initialized
    classes.push('admin-layout--initialized');
    
    return classes;
  }, [
    sidebar.collapsed,
    sidebar.mobileOpen,
    responsive.breakpoint,
    responsive.isMobile,
  ]);

  /**
   * 🎯 Check if layout is ready for use
   */
  const isLayoutReady = useCallback((): boolean => {
    return navigation.menuItems.length > 0;
  }, [navigation.menuItems.length]);

  /**
   * 🔄 Load persisted state on mount only
   */
  useEffect(() => {
    if (!responsive.isMobile) {
      loadPersistedState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only on mount

  return {
    // State
    isInitialized,
    sidebar,
    header,
    main,
    responsive: responsiveWithScreenSize,
    
    // Actions
    toggleSidebar: handleToggleSidebar,
    toggleMobileSidebar: handleToggleMobileSidebar,
    setSidebarCollapsed: handleSetSidebarCollapsed,
    setMobileSidebarOpen: handleSetMobileSidebarOpen,
    updateHeaderConfig: handleUpdateHeaderConfig,
    updateMainConfig: handleUpdateMainConfig,
    resetLayout: handleResetLayout,
    
    // Utilities
    getSidebarWidth,
    getLayoutClasses,
    isLayoutReady,
  };
};

export default useAdminLayout;