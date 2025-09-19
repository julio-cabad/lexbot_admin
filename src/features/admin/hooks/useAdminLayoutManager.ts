/**
 * 🎛️ useAdminLayoutManager Hook
 * Combined hook that provides complete admin layout management
 * Integrates layout, navigation, and responsive functionality
 */

import { useCallback, useMemo } from "react";
import { useAdminLayout } from "./useAdminLayout";
import { useNavigation } from "./useNavigation";
import { useResponsive } from "./useResponsive";
import type { MenuItem, Breadcrumb, LayoutConfig } from "../types";

interface UseAdminLayoutManagerReturn {
  // Layout state
  layout: {
    isInitialized: boolean;
    sidebar: {
      collapsed: boolean;
      mobileOpen: boolean;
      width: number;
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
    classes: string[];
    isReady: boolean;
  };

  // Navigation state
  navigation: {
    activeRoute: string;
    menuItems: MenuItem[];
    breadcrumbs: Breadcrumb[];
    routeHistory: string[];
    expandedGroups: string[];
    activeMenuItem: MenuItem | null;
  };

  // Responsive state
  responsive: {
    breakpoint: "mobile" | "tablet" | "desktop";
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isTouch: boolean;
    isLandscape: boolean;
    screenWidth: number;
    screenHeight: number;
  };

  // Layout actions
  actions: {
    // Sidebar management
    toggleSidebar: () => void;
    toggleMobileSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setMobileSidebarOpen: (open: boolean) => void;

    // Navigation management
    navigateTo: (
      route: string,
      options?: { replace?: boolean; state?: any }
    ) => void;
    setActiveRoute: (route: string) => void;
    goBack: () => void;
    goForward: () => void;

    // Menu management
    setMenuItems: (items: MenuItem[]) => void;
    toggleMenuGroup: (groupId: string) => void;

    // Breadcrumb management
    setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
    generateBreadcrumbs: (route?: string) => Breadcrumb[];

    // Configuration
    updateHeaderConfig: (config: Partial<LayoutConfig["header"]>) => void;
    updateMainConfig: (config: Partial<LayoutConfig["main"]>) => void;
    resetLayout: () => void;
  };

  // Utilities
  utils: {
    // Layout utilities
    getSidebarWidth: () => number;
    getLayoutClasses: () => string[];
    isLayoutReady: () => boolean;

    // Navigation utilities
    findMenuItem: (route: string) => MenuItem | null;
    isRouteActive: (route: string) => boolean;
    getRouteTitle: (route: string) => string;

    // Responsive utilities
    getResponsiveValue: <T>(values: {
      mobile?: T;
      tablet?: T;
      desktop: T;
    }) => T;
    getSidebarBehavior: () => "hidden" | "collapsed" | "expanded";
    getOptimalColumns: (maxColumns: number) => number;
    matchesMediaQuery: (query: string) => boolean;
  };
}

/**
 * 🎯 useAdminLayoutManager Hook
 * Comprehensive admin layout management with all features combined
 */
export const useAdminLayoutManager = (): UseAdminLayoutManagerReturn => {
  // Individual hooks
  const layout = useAdminLayout();
  const navigation = useNavigation();
  const responsive = useResponsive();

  /**
   * 🎯 Enhanced sidebar toggle that considers responsive state
   */
  const smartToggleSidebar = useCallback(() => {
    if (responsive.isMobile) {
      layout.toggleMobileSidebar();
    } else {
      layout.toggleSidebar();
    }
  }, [layout, responsive.isMobile]);

  /**
   * 🎯 Smart navigation that handles mobile sidebar
   */
  const smartNavigateTo = useCallback(
    (route: string, options: { replace?: boolean; state?: any } = {}) => {
      // Close mobile sidebar when navigating
      if (responsive.isMobile && layout.sidebar.mobileOpen) {
        layout.setMobileSidebarOpen(false);
      }

      navigation.navigateTo(route, options);
    },
    [navigation, responsive.isMobile, layout]
  );

  /**
   * 🎯 Get optimal sidebar state for current responsive context
   */
  const getOptimalSidebarState = useCallback(() => {
    const behavior = responsive.getSidebarBehavior();

    switch (behavior) {
      case "hidden":
        return { collapsed: true, mobileOpen: false };
      case "collapsed":
        return { collapsed: true, mobileOpen: false };
      case "expanded":
        return { collapsed: false, mobileOpen: false };
      default:
        return {
          collapsed: layout.sidebar.collapsed,
          mobileOpen: layout.sidebar.mobileOpen,
        };
    }
  }, [responsive, layout.sidebar]);

  /**
   * 🎯 Apply optimal layout for current responsive state
   */
  const applyOptimalLayout = useCallback(() => {
    const optimal = getOptimalSidebarState();

    if (responsive.isMobile) {
      layout.setMobileSidebarOpen(optimal.mobileOpen);
    } else {
      layout.setSidebarCollapsed(optimal.collapsed);
    }
  }, [getOptimalSidebarState, responsive.isMobile, layout]);

  /**
   * 🎨 Memoized combined state
   */
  const combinedState = useMemo(
    () => ({
      layout: {
        isInitialized: layout.isInitialized,
        sidebar: {
          collapsed: layout.sidebar.collapsed,
          mobileOpen: layout.sidebar.mobileOpen,
          width: layout.getSidebarWidth(),
        },
        header: layout.header,
        main: layout.main,
        classes: layout.getLayoutClasses(),
        isReady: layout.isLayoutReady(),
      },
      navigation: {
        activeRoute: navigation.activeRoute,
        menuItems: navigation.menuItems,
        breadcrumbs: navigation.breadcrumbs,
        routeHistory: navigation.routeHistory,
        expandedGroups: navigation.expandedGroups,
        activeMenuItem: navigation.getActiveMenuItem(),
      },
      responsive: {
        breakpoint: responsive.breakpoint,
        isMobile: responsive.isMobile,
        isTablet: responsive.isTablet,
        isDesktop: responsive.isDesktop,
        isTouch: responsive.isTouch,
        isLandscape: responsive.isLandscape,
        screenWidth: responsive.screenWidth,
        screenHeight: responsive.screenHeight,
      },
    }),
    [layout, navigation, responsive]
  );

  /**
   * 🎨 Memoized actions
   */
  const actions = useMemo(
    () => ({
      // Sidebar management
      toggleSidebar: smartToggleSidebar,
      toggleMobileSidebar: layout.toggleMobileSidebar,
      setSidebarCollapsed: layout.setSidebarCollapsed,
      setMobileSidebarOpen: layout.setMobileSidebarOpen,

      // Navigation management
      navigateTo: smartNavigateTo,
      setActiveRoute: navigation.setActiveRoute,
      goBack: navigation.goBack,
      goForward: navigation.goForward,

      // Menu management
      setMenuItems: navigation.setMenuItems,
      toggleMenuGroup: navigation.toggleMenuGroup,

      // Breadcrumb management
      setBreadcrumbs: navigation.setBreadcrumbs,
      generateBreadcrumbs: navigation.generateBreadcrumbs,

      // Configuration
      updateHeaderConfig: layout.updateHeaderConfig,
      updateMainConfig: layout.updateMainConfig,
      resetLayout: layout.resetLayout,

      // Advanced actions
      applyOptimalLayout,
    }),
    [
      smartToggleSidebar,
      smartNavigateTo,
      layout,
      navigation,
      applyOptimalLayout,
    ]
  );

  /**
   * 🎨 Memoized utilities
   */
  const utils = useMemo(
    () => ({
      // Layout utilities
      getSidebarWidth: layout.getSidebarWidth,
      getLayoutClasses: layout.getLayoutClasses,
      isLayoutReady: layout.isLayoutReady,

      // Navigation utilities
      findMenuItem: navigation.findMenuItem,
      isRouteActive: navigation.isRouteActive,
      getRouteTitle: navigation.getRouteTitle,

      // Responsive utilities
      getResponsiveValue: responsive.getResponsiveValue,
      getSidebarBehavior: responsive.getSidebarBehavior,
      getOptimalColumns: responsive.getOptimalColumns,
      matchesMediaQuery: responsive.matchesMediaQuery,

      // Combined utilities
      getOptimalSidebarState,
    }),
    [layout, navigation, responsive, getOptimalSidebarState]
  );

  return {
    ...combinedState,
    actions,
    utils,
  };
};

export default useAdminLayoutManager;
