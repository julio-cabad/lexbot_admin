/**
 * 🏛️ ADMIN FEATURE TYPES
 * Tipos específicos para la funcionalidad administrativa
 * Siguiendo el patrón establecido en auth/types/index.ts
 */

import { ReactNode } from "react";

// ========================================
// 🧭 NAVIGATION TYPES
// ========================================

// Propiedades de iconos para consistencia
export interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// Item individual del menú de navegación
export interface MenuItem {
  id: string; // Identificador único
  label: string; // Texto a mostrar
  icon?: string; // Nombre del icono (string para simplicidad)
  route: string; // Ruta de navegación
  badge?: string | number; // Badge opcional (notificaciones, contadores)
  children?: MenuItem[]; // Sub-items para menús anidados
  permissions?: string[]; // Permisos requeridos para ver el item
  isActive?: boolean; // Si está actualmente activo
  isExpanded?: boolean; // Si está expandido (para grupos)
  order?: number; // Orden de aparición
  divider?: boolean; // Si debe mostrar un divisor después
  external?: boolean; // Si es un enlace externo
  target?: "_blank" | "_self"; // Target del enlace
}

// Grupo de items del menú
export interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
  collapsed?: boolean;
  permissions?: string[];
}

// Breadcrumb para navegación
export interface Breadcrumb {
  label: string;
  route?: string;
  isActive?: boolean;
  icon?: string;
}

// ========================================
// 🎨 LAYOUT TYPES
// ========================================

// Configuración del layout
export interface LayoutConfig {
  header: {
    height: string;
    showLogo: boolean;
    showUserProfile: boolean;
    showBreadcrumbs: boolean;
  };
  sidebar: {
    width: {
      expanded: string;
      collapsed: string;
    };
    defaultCollapsed: boolean;
    persistState: boolean;
    showToggle: boolean;
  };
  main: {
    padding: string;
    maxWidth?: string;
    scrollable: boolean;
  };
  responsive: {
    breakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    behavior: {
      autoCollapseSidebar: boolean;
      hideSidebarOnMobile: boolean;
    };
  };
}

// Props para componentes de layout
export interface AdminLayoutProps {
  children: ReactNode;
  className?: string;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export interface AdminHeaderProps {
  className?: string;
  showLogo?: boolean;
  showUserProfile?: boolean;
  showSidebarToggle?: boolean;
  onSidebarToggle?: () => void;
  onLogout?: () => void;
}

export interface AdminSidebarProps {
  className?: string;
  collapsed?: boolean;
  mobileOpen?: boolean;
  menuItems?: MenuItem[];
  activeRoute?: string;
  onToggle?: () => void;
  onMobileToggle?: () => void;
  onItemClick?: (item: MenuItem) => void;
}

export interface AdminMainProps {
  children?: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  loading?: boolean;
  scrollable?: boolean;
  fullHeight?: boolean;
  padding?: boolean;
  id?: string;
}

// ========================================
// 📱 RESPONSIVE TYPES
// ========================================

export type ResponsiveBreakpoint = "mobile" | "tablet" | "desktop";

export interface ResponsiveConfig {
  breakpoint: ResponsiveBreakpoint;
  windowWidth: number;
  windowHeight: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// ========================================
// 🎨 THEME TYPES
// ========================================

export interface AdminTheme {
  name: string;
  colors: {
    background: string;
    surface: string;
    border: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    accent: {
      primary: string;
      secondary: string;
    };
  };
  layout: {
    headerHeight: string;
    sidebarWidth: {
      expanded: string;
      collapsed: string;
    };
    mainPadding: string;
    borderRadius: string;
  };
  effects: {
    glassmorphism: string;
    backdropBlur: string;
    shadow: string;
  };
}

// ========================================
// 🔧 UTILITY TYPES
// ========================================

// Resultado de operaciones del admin
export interface AdminOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Configuración de animaciones
export interface AnimationConfig {
  enabled: boolean;
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    default: string;
    bounce: string;
    smooth: string;
  };
}

// ========================================
// 📊 ADMIN PAGES TYPES
// ========================================

// Props para páginas administrativas
export interface AdminPageProps {
  title?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

// Configuración de tabla para páginas de gestión
export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
  sorting?: {
    field: keyof T;
    direction: "asc" | "desc";
  };
  filtering?: {
    field: keyof T;
    value: any;
  }[];
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T) => ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
}

// ========================================
// 🎯 CONSTANTS
// ========================================

// Breakpoints por defecto
export const DEFAULT_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
} as const;

// Configuración por defecto del layout
export const DEFAULT_ADMIN_LAYOUT_CONFIG: LayoutConfig = {
  header: {
    height: "64px",
    showLogo: true,
    showUserProfile: true,
    showBreadcrumbs: true,
  },
  sidebar: {
    width: {
      expanded: "280px",
      collapsed: "60px",
    },
    defaultCollapsed: false,
    persistState: true,
    showToggle: true,
  },
  main: {
    padding: "24px",
    scrollable: true,
  },
  responsive: {
    breakpoints: DEFAULT_BREAKPOINTS,
    behavior: {
      autoCollapseSidebar: true,
      hideSidebarOnMobile: true,
    },
  },
};
