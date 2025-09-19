/**
 * 🧭 useNavigation Hook
 * Custom hook for route management and breadcrumb generation
 * Provides navigation utilities and route-based state management
 */

import { useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../../core/store";
import {
  setActiveRoute,
  setMenuItems,
  setBreadcrumbs,
  toggleMenuGroup,
} from "../../../core/store/slices/admin/slice";
import { defaultMenuItems } from "../config/menuConfig";
import type { MenuItem, Breadcrumb } from "../types";

interface UseNavigationReturn {
  // State
  activeRoute: string;
  menuItems: MenuItem[];
  breadcrumbs: Breadcrumb[];
  routeHistory: string[];
  expandedGroups: string[];

  // Navigation actions
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
  findMenuItem: (route: string) => MenuItem | null;
  getActiveMenuItem: () => MenuItem | null;

  // Breadcrumb management
  generateBreadcrumbs: (route?: string) => Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;

  // Utilities
  isRouteActive: (route: string) => boolean;
  getRouteTitle: (route: string) => string;
  clearHistory: () => void;
}

/**
 * 🎯 useNavigation Hook
 * Manages navigation state, breadcrumbs, and route-based functionality
 */
export const useNavigation = (): UseNavigationReturn => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Redux state selectors
  const navigation = useSelector((state: RootState) => state.admin.navigation);
  const { activeRoute, menuItems, breadcrumbs, routeHistory, expandedGroups } =
    navigation;

  /**
   * 🔄 Initialize menu items if empty
   */
  useEffect(() => {
    if (menuItems.length === 0) {
      dispatch(setMenuItems(defaultMenuItems));
    }
  }, [dispatch, menuItems.length]);

  /**
   * 🔄 Update active route when location changes
   */
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath !== activeRoute) {
      dispatch(setActiveRoute(currentPath));
    }
  }, [location.pathname, activeRoute, dispatch]);

  /**
   * 🎯 Navigate to a specific route
   */
  const navigateTo = useCallback(
    (route: string, options: { replace?: boolean; state?: any } = {}) => {
      const { replace = false, state } = options;

      navigate(route, { replace, state });
      dispatch(setActiveRoute(route));
    },
    [navigate, dispatch]
  );

  /**
   * 🎯 Set active route manually
   */
  const handleSetActiveRoute = useCallback(
    (route: string) => {
      dispatch(setActiveRoute(route));
    },
    [dispatch]
  );

  /**
   * 🎯 Go back in history
   */
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  /**
   * 🎯 Go forward in history
   */
  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  /**
   * 🎯 Set menu items
   */
  const handleSetMenuItems = useCallback(
    (items: MenuItem[]) => {
      dispatch(setMenuItems(items));
    },
    [dispatch]
  );

  /**
   * 🎯 Toggle menu group expanded state
   */
  const handleToggleMenuGroup = useCallback(
    (groupId: string) => {
      dispatch(toggleMenuGroup(groupId));
    },
    [dispatch]
  );

  /**
   * 🔍 Find menu item by route (recursive search)
   */
  const findMenuItem = useCallback(
    (route: string): MenuItem | null => {
      const searchInItems = (items: MenuItem[]): MenuItem | null => {
        for (const item of items) {
          if (item.route === route) {
            return item;
          }
          if (item.children) {
            const found = searchInItems(item.children);
            if (found) return found;
          }
        }
        return null;
      };

      return searchInItems(menuItems);
    },
    [menuItems]
  );

  /**
   * 🎯 Get currently active menu item
   */
  const getActiveMenuItem = useCallback((): MenuItem | null => {
    return findMenuItem(activeRoute);
  }, [findMenuItem, activeRoute]);

  /**
   * 🍞 Generate breadcrumbs for a route
   */
  const generateBreadcrumbsForRoute = useCallback(
    (route: string): Breadcrumb[] => {
      const breadcrumbs: Breadcrumb[] = [];

      // Always start with Home/Dashboard
      breadcrumbs.push({
        label: "Dashboard",
        route: "/dashboard",
        isActive: route === "/dashboard",
      });

      // If we're not on dashboard, find the menu item and build path
      if (route !== "/dashboard") {
        const menuItem = findMenuItem(route);

        if (menuItem) {
          // Build breadcrumb path by finding parent items
          const buildPath = (
            targetRoute: string,
            items: MenuItem[],
            path: MenuItem[] = []
          ): MenuItem[] => {
            for (const item of items) {
              const currentPath = [...path, item];

              if (item.route === targetRoute) {
                return currentPath;
              }

              if (item.children) {
                const childPath = buildPath(
                  targetRoute,
                  item.children,
                  currentPath
                );
                if (childPath.length > 0) {
                  return childPath;
                }
              }
            }
            return [];
          };

          const pathItems = buildPath(route, menuItems);

          // Convert path items to breadcrumbs (skip first if it's dashboard)
          pathItems.forEach((item, index) => {
            if (item.route !== "/dashboard") {
              breadcrumbs.push({
                label: item.label,
                route: item.route,
                isActive: index === pathItems.length - 1,
              });
            }
          });
        } else {
          // Fallback: generate breadcrumbs from route segments
          const segments = route.split("/").filter(Boolean);
          segments.forEach((segment, index) => {
            const segmentRoute = "/" + segments.slice(0, index + 1).join("/");
            const isLast = index === segments.length - 1;

            breadcrumbs.push({
              label:
                segment.charAt(0).toUpperCase() +
                segment.slice(1).replace(/-/g, " "),
              route: isLast ? undefined : segmentRoute,
              isActive: isLast,
            });
          });
        }
      }

      return breadcrumbs;
    },
    [findMenuItem, menuItems]
  );

  /**
   * 🍞 Generate breadcrumbs (public method)
   */
  const generateBreadcrumbs = useCallback(
    (route?: string): Breadcrumb[] => {
      return generateBreadcrumbsForRoute(route || activeRoute);
    },
    [generateBreadcrumbsForRoute, activeRoute]
  );

  /**
   * 🔄 Auto-generate breadcrumbs when route changes
   * DISABLED: Manual breadcrumb management per page to avoid conflicts
   */
  // useEffect(() => {
  //   // Only generate breadcrumbs if we have menu items to avoid empty breadcrumbs
  //   if (menuItems.length > 0) {
  //     const newBreadcrumbs = generateBreadcrumbsForRoute(location.pathname);
  //     dispatch(setBreadcrumbs(newBreadcrumbs));
  //   }
  // }, [
  //   location.pathname,
  //   menuItems.length,
  //   generateBreadcrumbsForRoute,
  //   dispatch,
  // ]);

  /**
   * 🍞 Set breadcrumbs manually
   */
  const handleSetBreadcrumbs = useCallback(
    (breadcrumbs: Breadcrumb[]) => {
      dispatch(setBreadcrumbs(breadcrumbs));
    },
    [dispatch]
  );

  /**
   * 🎯 Check if a route is active
   */
  const isRouteActive = useCallback(
    (route: string): boolean => {
      return activeRoute === route || activeRoute.startsWith(route + "/");
    },
    [activeRoute]
  );

  /**
   * 🏷️ Get title for a route
   */
  const getRouteTitle = useCallback(
    (route: string): string => {
      const menuItem = findMenuItem(route);
      if (menuItem) {
        return menuItem.label;
      }

      // Fallback: generate title from route
      const segments = route.split("/").filter(Boolean);
      const lastSegment = segments[segments.length - 1];
      return lastSegment
        ? lastSegment.charAt(0).toUpperCase() +
            lastSegment.slice(1).replace(/-/g, " ")
        : "Page";
    },
    [findMenuItem]
  );

  /**
   * 🧹 Clear route history
   */
  const clearHistory = useCallback(() => {
    // Implementación manual ya que no existe la acción clearRouteHistory
    // Podemos usar setActiveRoute con la ruta actual para reiniciar el historial
    const currentRoute = location.pathname;
    dispatch(setActiveRoute(currentRoute));
    // Nota: Esto no limpia completamente el historial, solo lo reinicia
    // Para una limpieza completa, necesitaríamos implementar la acción clearRouteHistory
  }, [dispatch, location.pathname]);

  return {
    // State
    activeRoute,
    menuItems,
    breadcrumbs,
    routeHistory,
    expandedGroups,

    // Navigation actions
    navigateTo,
    setActiveRoute: handleSetActiveRoute,
    goBack,
    goForward,

    // Menu management
    setMenuItems: handleSetMenuItems,
    toggleMenuGroup: handleToggleMenuGroup,
    findMenuItem,
    getActiveMenuItem,

    // Breadcrumb management
    generateBreadcrumbs,
    setBreadcrumbs: handleSetBreadcrumbs,

    // Utilities
    isRouteActive,
    getRouteTitle,
    clearHistory,
  };
};

export default useNavigation;
