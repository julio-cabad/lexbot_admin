/**
 * 🏛️ ADMIN SLICE
 * Estado global del layout administrativo
 * Siguiendo el patrón establecido en auth/slice.ts
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, initialAdminState } from './types';
import { MenuItem, Breadcrumb, ResponsiveBreakpoint } from '../../../../features/admin/types';

/**
 * ⚔️ SLICE DE REDUX PARA ADMIN
 * Maneja el estado del layout y navegación administrativa
 */
const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  reducers: {
    // ========================================
    // 🏛️ SIDEBAR ACTIONS
    // ========================================
    
    /**
     * Toggle del sidebar (expandir/colapsar)
     */
    toggleSidebar: (state) => {
      state.ui.sidebar.collapsed = !state.ui.sidebar.collapsed;
      
      // Persistir estado si está habilitado
      if (state.ui.sidebar.persistCollapsed) {
        state.preferences.sidebarCollapsed = state.ui.sidebar.collapsed;
      }
    },

    /**
     * Establecer estado del sidebar
     */
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.ui.sidebar.collapsed = action.payload;
      
      if (state.ui.sidebar.persistCollapsed) {
        state.preferences.sidebarCollapsed = action.payload;
      }
    },

    /**
     * Toggle del sidebar móvil
     */
    toggleMobileSidebar: (state) => {
      state.ui.sidebar.mobileOpen = !state.ui.sidebar.mobileOpen;
    },

    /**
     * Establecer estado del sidebar móvil
     */
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.ui.sidebar.mobileOpen = action.payload;
    },

    // ========================================
    // 🧭 NAVIGATION ACTIONS
    // ========================================

    /**
     * Establecer ruta activa
     */
    setActiveRoute: (state, action: PayloadAction<string>) => {
      const route = action.payload;
      state.navigation.activeRoute = route;
      
      // Agregar a historial si no es la misma ruta
      if (state.navigation.routeHistory[state.navigation.routeHistory.length - 1] !== route) {
        state.navigation.routeHistory.push(route);
        
        // Mantener solo las últimas 10 rutas
        if (state.navigation.routeHistory.length > 10) {
          state.navigation.routeHistory = state.navigation.routeHistory.slice(-10);
        }
      }
    },
    
    /**
     * Limpiar historial de rutas
     */
    clearRouteHistory: (state) => {
      state.navigation.routeHistory = [];
    },

    /**
     * Establecer items del menú
     */
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.navigation.menuItems = action.payload;
    },

    /**
     * Actualizar breadcrumbs
     */
    setBreadcrumbs: (state, action: PayloadAction<Breadcrumb[]>) => {
      state.navigation.breadcrumbs = action.payload;
    },

    /**
     * Expandir/colapsar grupo del menú
     */
    toggleMenuGroup: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      const index = state.navigation.expandedGroups.indexOf(groupId);
      
      if (index > -1) {
        // Remover si ya está expandido
        state.navigation.expandedGroups.splice(index, 1);
      } else {
        // Agregar si no está expandido
        state.navigation.expandedGroups.push(groupId);
      }
    },

    // ========================================
    // 📱 RESPONSIVE ACTIONS
    // ========================================

    /**
     * Establecer breakpoint responsivo
     */
    setResponsiveBreakpoint: (state, action: PayloadAction<ResponsiveBreakpoint>) => {
      const breakpoint = action.payload;
      state.ui.responsive.breakpoint = breakpoint;
      state.ui.responsive.isMobile = breakpoint === 'mobile';
      state.ui.responsive.isTablet = breakpoint === 'tablet';
      state.ui.responsive.isDesktop = breakpoint === 'desktop';

      // Auto-colapsar sidebar en mobile/tablet si no está configurado para persistir
      if (breakpoint === 'mobile') {
        state.ui.sidebar.collapsed = true;
        state.ui.sidebar.mobileOpen = false;
      } else if (breakpoint === 'tablet') {
        state.ui.sidebar.collapsed = true;
      } else if (breakpoint === 'desktop' && state.ui.sidebar.persistCollapsed) {
        // Restaurar estado persistido en desktop
        state.ui.sidebar.collapsed = state.preferences.sidebarCollapsed;
      }
    },

    // ========================================
    // ⚙️ PREFERENCES ACTIONS
    // ========================================

    /**
     * Actualizar preferencias
     */
    updatePreferences: (state, action: PayloadAction<Partial<AdminState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    /**
     * Establecer tema
     */
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.preferences.theme = action.payload;
    },

    /**
     * Toggle de animaciones
     */
    toggleAnimations: (state) => {
      state.preferences.animations = !state.preferences.animations;
    },

    // ========================================
    // 🧹 CLEANUP ACTIONS
    // ========================================

    /**
     * Limpiar error específico
     */
    clearError: (state, action: PayloadAction<keyof AdminState['errors']>) => {
      state.errors[action.payload] = null;
    },

    /**
     * Limpiar todos los errores
     */
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key as keyof AdminState['errors']] = null;
      });
    },

    /**
     * Restablecer estado del admin
     */
    resetAdminState: () => initialAdminState,

    /**
     * Establecer estado de carga
     */
    setLoading: (state, action: PayloadAction<{ key: keyof AdminState['loading']; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },

    /**
     * Establecer error
     */
    setError: (state, action: PayloadAction<{ key: keyof AdminState['errors']; value: string | null }>) => {
      state.errors[action.payload.key] = action.payload.value;
    },
  },
});

// Exportar actions
export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  setActiveRoute,
  clearRouteHistory,
  setMenuItems,
  setBreadcrumbs,
  toggleMenuGroup,
  setResponsiveBreakpoint,
  updatePreferences,
  setTheme,
  toggleAnimations,
  clearError,
  clearAllErrors,
  resetAdminState,
  setLoading,
  setError,
} = adminSlice.actions;

// Exportar slice y reducer
export { adminSlice };
export default adminSlice.reducer;