/**
 * 🏛️ ADMIN STORE TYPES
 * Tipos épicos para el estado global del admin
 * Siguiendo el patrón arquitectónico establecido en auth/types.ts
 */

// Importar tipos del feature admin (cuando los creemos)
export type ResponsiveBreakpoint = 'mobile' | 'tablet' | 'desktop';

// Tipos para el estado de UI del admin
export interface AdminUIState {
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
    showSidebarToggle: boolean;
  };
  main: {
    padding: string;
    maxWidth?: string;
    scrollable: boolean;
  };
  responsive: {
    breakpoint: ResponsiveBreakpoint;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    windowWidth: number;
    windowHeight: number;
  };
  animation: {
    sidebarTransition: boolean;
    contentTransition: boolean;
    reducedMotion: boolean;
  };
}

// Tipos para el estado de navegación
export interface NavigationState {
  activeRoute: string;
  menuItems: MenuItem[];
  breadcrumbs: Breadcrumb[];
  routeHistory: string[];
  expandedGroups: string[];
}

// Tipos para items del menú
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  route: string;
  badge?: string | number;
  children?: MenuItem[];
  permissions?: string[];
  isActive?: boolean;
  isExpanded?: boolean;
}

// Tipos para breadcrumbs
export interface Breadcrumb {
  label: string;
  route?: string;
  isActive?: boolean;
}

// Configuración de breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
} as const;

// Configuración por defecto del layout
export const DEFAULT_LAYOUT_CONFIG = {
  header: {
    height: 64,
  },
  sidebar: {
    widthExpanded: 280,
    widthCollapsed: 60,
  },
  main: {
    padding: '24px',
  },
} as const;

/**
 * Estado completo del slice de admin
 */
export interface AdminState {
  // Estado de UI del admin
  ui: AdminUIState;
  
  // Estado de navegación
  navigation: NavigationState;
  
  // Estado de inicialización
  isInitialized: boolean;
  
  // Estados de carga para diferentes operaciones
  loading: {
    layout: boolean;
    navigation: boolean;
    menu: boolean;
  };
  
  // Estados de error
  errors: {
    layout: string | null;
    navigation: string | null;
    menu: string | null;
  };
  
  // Configuración persistente
  preferences: {
    sidebarCollapsed: boolean;
    theme: 'light' | 'dark' | 'auto';
    animations: boolean;
  };
}

/**
 * Estado inicial del admin
 */
export const initialAdminState: AdminState = {
  ui: {
    sidebar: {
      collapsed: false,
      mobileOpen: false,
      persistCollapsed: true,
      width: {
        expanded: DEFAULT_LAYOUT_CONFIG.sidebar.widthExpanded,
        collapsed: DEFAULT_LAYOUT_CONFIG.sidebar.widthCollapsed,
      },
    },
    header: {
      height: DEFAULT_LAYOUT_CONFIG.header.height,
      showBreadcrumbs: true,
      showUserProfile: true,
      showSidebarToggle: true,
    },
    main: {
      padding: DEFAULT_LAYOUT_CONFIG.main.padding,
      maxWidth: undefined,
      scrollable: true,
    },
    responsive: {
      breakpoint: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      windowWidth: 1200,
      windowHeight: 800,
    },
    animation: {
      sidebarTransition: true,
      contentTransition: true,
      reducedMotion: false,
    },
  },
  navigation: {
    activeRoute: '',
    menuItems: [],
    breadcrumbs: [],
    routeHistory: [],
    expandedGroups: [],
  },
  isInitialized: false, // Estado de inicialización añadido a la interfaz
  loading: {
    layout: false,
    navigation: false,
    menu: false,
  },
  errors: {
    layout: null,
    navigation: null,
    menu: null,
  },
  preferences: {
    sidebarCollapsed: false,
    theme: 'dark',
    animations: true,
  },
};