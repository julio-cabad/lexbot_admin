/**
 * 🏛️ LAYOUT CONFIGURATION
 * Configuración del layout administrativo
 * Siguiendo el patrón de configuración centralizada
 */

import { LayoutConfig, AdminTheme } from '../types';

/**
 * 🎯 CONFIGURACIÓN POR DEFECTO DEL LAYOUT
 */
export const defaultLayoutConfig: LayoutConfig = {
  sidebar: {
    defaultCollapsed: false,
    persistState: true,
    showToggle: true,
    width: {
      expanded: '280px',
      collapsed: '60px',
    },
  },
  header: {
    height: '64px',
    showLogo: true,
    showUserProfile: true,
    showBreadcrumbs: true,
  },
  main: {
    padding: '24px',
    scrollable: true,
  },
  responsive: {
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1200,
    },
    behavior: {
      autoCollapseSidebar: true,
      hideSidebarOnMobile: true,
    },
  },
};

/**
 * 🎨 TEMA POR DEFECTO DEL ADMIN
 */
export const defaultAdminTheme: AdminTheme = {
  name: 'default',
  layout: {
    headerHeight: '64px',
    sidebarWidth: {
      expanded: '280px',
      collapsed: '60px',
    },
    mainPadding: '24px',
    borderRadius: '12px',
  },
  colors: {
    background: 'rgba(15, 23, 42, 0.95)',
    surface: 'rgba(30, 41, 59, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.5)',
    },
    accent: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
    },
  },
  effects: {
    glassmorphism: 'rgba(255, 255, 255, 0.1)',
    backdropBlur: 'blur(16px)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
};

/**
 * 🔧 CONFIGURACIÓN PERSONALIZABLE DEL LAYOUT
 */
export const layoutConfig = {
  /**
   * Obtener configuración del layout
   */
  getConfig(): LayoutConfig {
    // En el futuro, esto podría venir de localStorage o API
    const savedConfig = this.getSavedConfig();
    return savedConfig || defaultLayoutConfig;
  },

  /**
   * Obtener tema del admin
   */
  getTheme(): AdminTheme {
    // En el futuro, esto podría ser dinámico
    return defaultAdminTheme;
  },

  /**
   * Guardar configuración en localStorage
   */
  saveConfig(config: Partial<LayoutConfig>): void {
    try {
      const currentConfig = this.getConfig();
      const newConfig = { ...currentConfig, ...config };
      localStorage.setItem('admin-layout-config', JSON.stringify(newConfig));
    } catch (error) {
      console.warn('No se pudo guardar la configuración del layout:', error);
    }
  },

  /**
   * Obtener configuración guardada
   */
  getSavedConfig(): LayoutConfig | null {
    try {
      const saved = localStorage.getItem('admin-layout-config');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('No se pudo cargar la configuración guardada:', error);
      return null;
    }
  },

  /**
   * Restablecer configuración por defecto
   */
  resetConfig(): LayoutConfig {
    try {
      localStorage.removeItem('admin-layout-config');
    } catch (error) {
      console.warn('No se pudo limpiar la configuración:', error);
    }
    return defaultLayoutConfig;
  },

  /**
   * Actualizar configuración del sidebar
   */
  updateSidebarConfig(sidebarConfig: Partial<LayoutConfig['sidebar']>): void {
    const currentConfig = this.getConfig();
    this.saveConfig({
      ...currentConfig,
      sidebar: {
        ...currentConfig.sidebar,
        ...sidebarConfig,
      },
    });
  },

  /**
   * Actualizar configuración del header
   */
  updateHeaderConfig(headerConfig: Partial<LayoutConfig['header']>): void {
    const currentConfig = this.getConfig();
    this.saveConfig({
      ...currentConfig,
      header: {
        ...currentConfig.header,
        ...headerConfig,
      },
    });
  },

  /**
   * Obtener breakpoint actual
   */
  getCurrentBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    const config = this.getConfig();

    if (width < config.responsive.breakpoints.mobile) {
      return 'mobile';
    } else if (width < config.responsive.breakpoints.tablet) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  },

  /**
   * Verificar si es mobile
   */
  isMobile(): boolean {
    return this.getCurrentBreakpoint() === 'mobile';
  },

  /**
   * Verificar si es tablet
   */
  isTablet(): boolean {
    return this.getCurrentBreakpoint() === 'tablet';
  },

  /**
   * Verificar si es desktop
   */
  isDesktop(): boolean {
    return this.getCurrentBreakpoint() === 'desktop';
  },

  /**
   * Generar variables CSS para el tema
   */
  generateCSSVariables(theme: AdminTheme = defaultAdminTheme): Record<string, string> {
    return {
      '--admin-header-height': theme.layout.headerHeight,
      '--admin-sidebar-width-expanded': theme.layout.sidebarWidth.expanded,
      '--admin-sidebar-width-collapsed': theme.layout.sidebarWidth.collapsed,
      '--admin-main-padding': theme.layout.mainPadding,
      '--admin-border-radius': theme.layout.borderRadius,
      
      '--admin-bg-primary': theme.colors.background,
      '--admin-bg-surface': theme.colors.surface,
      '--admin-border-color': theme.colors.border,
      '--admin-text-primary': theme.colors.text.primary,
      '--admin-text-secondary': theme.colors.text.secondary,
      '--admin-text-muted': theme.colors.text.muted,
      '--admin-accent-primary': theme.colors.accent.primary,
      '--admin-accent-secondary': theme.colors.accent.secondary,
      
      '--admin-glass-bg': theme.effects.glassmorphism,
      '--admin-backdrop-blur': theme.effects.backdropBlur,
      '--admin-shadow': theme.effects.shadow,
    };
  },
};