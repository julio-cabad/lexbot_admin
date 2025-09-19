/**
 * 🎯 ADMIN SELECTORS
 * Selectores memoizados para el estado del admin
 * Siguiendo el patrón establecido en auth/selectors.ts
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { AdminState, MenuItem } from './types';

// ========================================
// 🏛️ BASE SELECTORS
// ========================================

/**
 * Selector base del admin
 */
const selectAdmin = (state: RootState) => state.admin as AdminState;

// ========================================
// 🎨 UI SELECTORS
// ========================================

/**
 * Selectores del estado de UI
 */
export const selectAdminUI = createSelector(
  [selectAdmin],
  (admin) => admin.ui
);

export const selectSidebarState = createSelector(
  [selectAdminUI],
  (ui) => ui.sidebar
);

export const selectIsSidebarCollapsed = createSelector(
  [selectSidebarState],
  (sidebar) => sidebar.collapsed
);

export const selectIsMobileSidebarOpen = createSelector(
  [selectSidebarState],
  (sidebar) => sidebar.mobileOpen
);

export const selectHeaderState = createSelector(
  [selectAdminUI],
  (ui) => ui.header
);

export const selectHeaderHeight = createSelector(
  [selectHeaderState],
  (header) => header.height
);

export const selectShowBreadcrumbs = createSelector(
  [selectHeaderState],
  (header) => header.showBreadcrumbs
);

export const selectMainState = createSelector(
  [selectAdminUI],
  (ui) => ui.main
);

export const selectMainPadding = createSelector(
  [selectMainState],
  (main) => main.padding
);

// ========================================
// 📱 RESPONSIVE SELECTORS
// ========================================

export const selectResponsiveState = createSelector(
  [selectAdminUI],
  (ui) => ui.responsive
);

export const selectCurrentBreakpoint = createSelector(
  [selectResponsiveState],
  (responsive) => responsive.breakpoint
);

export const selectIsMobile = createSelector(
  [selectResponsiveState],
  (responsive) => responsive.isMobile
);

export const selectIsTablet = createSelector(
  [selectResponsiveState],
  (responsive) => responsive.isTablet
);

export const selectIsDesktop = createSelector(
  [selectResponsiveState],
  (responsive) => responsive.isDesktop
);

// ========================================
// 🧭 NAVIGATION SELECTORS
// ========================================

export const selectNavigationState = createSelector(
  [selectAdmin],
  (admin) => admin.navigation
);

export const selectActiveRoute = createSelector(
  [selectNavigationState],
  (navigation) => navigation.activeRoute
);

export const selectMenuItems = createSelector(
  [selectNavigationState],
  (navigation) => navigation.menuItems
);

export const selectBreadcrumbs = createSelector(
  [selectNavigationState],
  (navigation) => navigation.breadcrumbs
);

export const selectRouteHistory = createSelector(
  [selectNavigationState],
  (navigation) => navigation.routeHistory
);

export const selectExpandedGroups = createSelector(
  [selectNavigationState],
  (navigation) => navigation.expandedGroups
);

// ========================================
// 🔧 LOADING & ERROR SELECTORS
// ========================================

export const selectAdminLoading = createSelector(
  [selectAdmin],
  (admin) => admin.loading
);

export const selectIsLayoutLoading = createSelector(
  [selectAdminLoading],
  (loading) => loading.layout
);

export const selectIsNavigationLoading = createSelector(
  [selectAdminLoading],
  (loading) => loading.navigation
);

export const selectIsAnyAdminLoading = createSelector(
  [selectAdminLoading],
  (loading) => Object.values(loading).some(Boolean)
);

export const selectAdminErrors = createSelector(
  [selectAdmin],
  (admin) => admin.errors
);

export const selectLayoutError = createSelector(
  [selectAdminErrors],
  (errors) => errors.layout
);

export const selectNavigationError = createSelector(
  [selectAdminErrors],
  (errors) => errors.navigation
);

export const selectHasAnyAdminError = createSelector(
  [selectAdminErrors],
  (errors) => Object.values(errors).some(Boolean)
);

// ========================================
// ⚙️ PREFERENCES SELECTORS
// ========================================

export const selectAdminPreferences = createSelector(
  [selectAdmin],
  (admin) => admin.preferences
);

export const selectPreferredTheme = createSelector(
  [selectAdminPreferences],
  (preferences) => preferences.theme
);

export const selectAnimationsEnabled = createSelector(
  [selectAdminPreferences],
  (preferences) => preferences.animations
);

// ========================================
// 🎯 COMPUTED SELECTORS
// ========================================

/**
 * Selector para determinar si el sidebar debe mostrarse
 */
export const selectShouldShowSidebar = createSelector(
  [selectIsMobile, selectIsMobileSidebarOpen, selectIsSidebarCollapsed],
  (isMobile, mobileOpen, collapsed) => {
    if (isMobile) {
      return mobileOpen;
    }
    return true; // Siempre mostrar en tablet/desktop (puede estar colapsado)
  }
);

/**
 * Selector para el ancho actual del sidebar
 */
export const selectSidebarWidth = createSelector(
  [selectIsSidebarCollapsed, selectIsMobile],
  (collapsed, isMobile) => {
    if (isMobile) return '0px';
    return collapsed ? '60px' : '280px';
  }
);

/**
 * Selector para clases CSS del layout
 */
export const selectLayoutClasses = createSelector(
  [selectIsSidebarCollapsed, selectIsMobile, selectCurrentBreakpoint],
  (collapsed, isMobile, breakpoint) => {
    const classes = ['admin-layout'];
    
    if (collapsed) classes.push('admin-layout--sidebar-collapsed');
    else classes.push('admin-layout--sidebar-expanded');
    
    if (isMobile) classes.push('admin-layout--mobile');
    else if (breakpoint === 'tablet') classes.push('admin-layout--tablet');
    else classes.push('admin-layout--desktop');
    
    return classes.join(' ');
  }
);

/**
 * Selector para item de menú activo
 */
export const selectActiveMenuItem = createSelector(
  [selectMenuItems, selectActiveRoute],
  (menuItems, activeRoute) => {
    const findActiveItem = (items: MenuItem[]): MenuItem | null => {
      for (const item of items) {
        if (item.route === activeRoute) {
          return item;
        }
        if (item.children) {
          const childActive = findActiveItem(item.children);
          if (childActive) return childActive;
        }
      }
      return null;
    };
    
    return findActiveItem(menuItems);
  }
);

/**
 * Selector para verificar si un grupo está expandido
 */
export const selectIsGroupExpanded = createSelector(
  [selectExpandedGroups],
  (expandedGroups) => (groupId: string) => expandedGroups.includes(groupId)
);

/**
 * Selector para configuración CSS variables
 */
export const selectCSSVariables = createSelector(
  [selectSidebarWidth, selectHeaderHeight, selectMainPadding],
  (sidebarWidth, headerHeight, mainPadding) => ({
    '--admin-sidebar-width': sidebarWidth,
    '--admin-header-height': `${headerHeight}px`,
    '--admin-main-padding': mainPadding,
  })
);

/**
 * Selector para estado completo del layout
 */
export const selectLayoutState = createSelector(
  [
    selectIsSidebarCollapsed,
    selectIsMobileSidebarOpen,
    selectCurrentBreakpoint,
    selectActiveRoute,
    selectBreadcrumbs,
    selectShouldShowSidebar
  ],
  (collapsed, mobileOpen, breakpoint, activeRoute, breadcrumbs, shouldShow) => ({
    sidebar: {
      collapsed,
      mobileOpen,
      shouldShow,
    },
    responsive: {
      breakpoint,
      isMobile: breakpoint === 'mobile',
      isTablet: breakpoint === 'tablet',
      isDesktop: breakpoint === 'desktop',
    },
    navigation: {
      activeRoute,
      breadcrumbs,
    },
  })
);