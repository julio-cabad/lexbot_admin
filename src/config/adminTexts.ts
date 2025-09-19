/**
 * 🏛️ TEXTOS DEL PANEL ADMINISTRATIVO
 * Textos centralizados para el panel administrativo
 */

/**
 * Interfaz para los textos del panel administrativo
 */
export interface AdminTexts {
  // Layout y navegación
  layout: {
    skipToContent: string;
    sidebarToggle: string;
    expandSidebar: string;
    collapseSidebar: string;
    closeSidebar: string;
  };
  // Header
  header: {
    notifications: string;
    profile: string;
    settings: string;
    logout: string;
  };
  // Sidebar
  sidebar: {
    adminPanel: string;
    dashboard: string;
    recipients: string;
    settings: string;
    collapse: string;
  };
  // Main content
  main: {
    loading: string;
    noContent: string;
    noContentDescription: string;
    scrollToTop: string;
  };
  // Breadcrumbs
  breadcrumbs: {
    home: string;
    dashboard: string;
    recipients: string;
    settings: string;
    profile: string;
  };
  // Error boundary
  errorBoundary: {
    title: string;
    description: string;
    retry: string;
    goToDashboard: string;
    reload: string;
    helpText: string;
  };
}

/**
 * Textos del panel administrativo
 */
export const ADMIN_TEXTS: AdminTexts = {
  // Layout y navegación
  layout: {
    skipToContent: 'Saltar al contenido principal',
    sidebarToggle: 'Alternar menú lateral',
    expandSidebar: 'Expandir menú lateral',
    collapseSidebar: 'Colapsar menú lateral',
    closeSidebar: 'Cerrar menú lateral',
  },
  // Header
  header: {
    notifications: 'Notificaciones',
    profile: 'Mi Perfil',
    settings: 'Configuración',
    logout: 'Cerrar Sesión',
  },
  // Sidebar
  sidebar: {
    adminPanel: 'Panel Administrativo',
    dashboard: 'Dashboard',
    recipients: 'Destinatarios',
    settings: 'Configuración',
    collapse: 'Colapsar',
  },
  // Main content
  main: {
    loading: 'Cargando...',
    noContent: 'Sin Contenido',
    noContentDescription: 'Esta página no tiene contenido aún.',
    scrollToTop: 'Volver arriba',
  },
  // Breadcrumbs
  breadcrumbs: {
    home: 'Inicio',
    dashboard: 'Dashboard',
    recipients: 'Destinatarios',
    settings: 'Configuración',
    profile: 'Perfil',
  },
  // Error boundary
  errorBoundary: {
    title: 'Algo salió mal',
    description: 'Ha ocurrido un error al cargar esta sección. Por favor intenta nuevamente.',
    retry: 'Reintentar',
    goToDashboard: 'Ir al Dashboard',
    reload: 'Recargar página',
    helpText: 'Si el problema persiste, por favor contacta a soporte o intenta refrescar la página.'
  }
};
