import React from 'react';

/**
 * Tipos para el sistema de rutas
 */

// Roles de usuario para control de acceso
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

// Metadatos de ruta extendidos
export interface RouteMeta {
  title: string;                  // Título de la página para SEO y breadcrumbs
  requiresAuth: boolean;          // Si la ruta requiere autenticación
  roles?: UserRole[];            // Roles permitidos para acceder a la ruta
  breadcrumb?: string;           // Texto para breadcrumb (si es diferente del título)
  description?: string;          // Descripción para SEO
  icon?: string;                 // Icono para menús y navegación
  showInMenu?: boolean;          // Si la ruta debe mostrarse en el menú principal
  menuOrder?: number;            // Orden en el menú (menor = primero)
  parent?: string;               // Ruta padre para jerarquía de menú
  isIndex?: boolean;             // Si es la ruta índice de un grupo
  layout?: 'default' | 'auth' | 'admin' | 'minimal'; // Layout a utilizar
}

// Parámetros de ruta tipados
export interface RouteParams {
  [key: string]: string | number;
}

// Configuración completa de una ruta
export interface RouteConfig<P = {}> {
  path: string;                  // Ruta URL (puede incluir parámetros como :id)
  component: React.ComponentType<any>; // Componente a renderizar
  meta: RouteMeta;              // Metadatos de la ruta
  children?: RouteConfig<P>[];   // Rutas hijas (para rutas anidadas)
  params?: P;                    // Tipo de parámetros para esta ruta
}

// Tipo para rutas con parámetros
export type RouteWithParams<P extends RouteParams = {}> = RouteConfig<P>;

/**
 * Importación de componentes de página
 * Importamos desde las ubicaciones actuales, pero en el futuro se moverán a features/
 */
// Importación de componentes (lazy loading)
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = React.lazy(() => import('../pages/auth/RegisterPage').then(module => ({ default: module.RegisterPage })));
const ForgotPasswordPage = React.lazy(() => import('../pages/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = React.lazy(() => import('../pages/auth/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })));
const DashboardPage = React.lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })));

// Componentes temporales para rutas que aún no existen
const ProfilePage: React.FC = () => React.createElement('div', null, 'Página de Perfil (Placeholder)');
const NotFoundPage: React.FC = () => React.createElement('div', null, 'Página no encontrada (404)');

// Definición de rutas con metadatos completos
export const ROUTES = {
  // Rutas públicas (no requieren autenticación)
  public: {
    home: {
      path: '/',
      component: LoginPage,
      meta: {
        title: 'Inicio',
        requiresAuth: false,
        layout: 'minimal',
        description: 'Página de inicio de LexBot Admin'
      }
    },
    login: {
      path: '/login',
      component: LoginPage,
      meta: {
        title: 'Iniciar Sesión',
        requiresAuth: false,
        layout: 'auth',
        description: 'Inicia sesión en LexBot Admin'
      }
    },
    register: {
      path: '/register',
      component: RegisterPage,
      meta: {
        title: 'Crear Cuenta',
        requiresAuth: false,
        layout: 'auth',
        description: 'Registra una nueva cuenta en LexBot Admin'
      }
    },
    forgotPassword: {
      path: '/forgot-password',
      component: ForgotPasswordPage,
      meta: {
        title: 'Recuperar Contraseña',
        requiresAuth: false,
        layout: 'auth',
        description: 'Recupera tu contraseña de LexBot Admin'
      }
    },
    resetPassword: {
      path: '/reset-password',
      component: ResetPasswordPage,
      meta: {
        title: 'Establecer Nueva Contraseña',
        requiresAuth: false,
        layout: 'auth',
        description: 'Establece una nueva contraseña para tu cuenta'
      }
    },
    notFound: {
      path: '*',
      component: NotFoundPage,
      meta: {
        title: 'Página no encontrada',
        requiresAuth: false,
        layout: 'minimal',
        description: 'La página que buscas no existe'
      }
    }
  },
  
  // Rutas privadas (requieren autenticación)
  private: {
    dashboard: {
      path: '/dashboard',
      component: DashboardPage,
      meta: {
        title: 'Panel Principal',
        requiresAuth: true,
        roles: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
        breadcrumb: 'Dashboard',
        icon: 'dashboard',
        showInMenu: true,
        menuOrder: 1,
        layout: 'default',
        description: 'Panel principal de LexBot Admin'
      }
    },
    profile: {
      path: '/profile',
      component: ProfilePage,
      meta: {
        title: 'Mi Perfil',
        requiresAuth: true,
        roles: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
        breadcrumb: 'Perfil',
        icon: 'user',
        showInMenu: true,
        menuOrder: 2,
        layout: 'default',
        description: 'Gestiona tu perfil de usuario'
      }
    }
  },
  
  // Rutas de administración (requieren rol de admin)
  admin: {
    // Aquí irían rutas de administración con roles restringidos
  }
} as const;

// Tipo para acceder a las rutas con autocompletado
export type RouteKeys = {
  [Category in keyof typeof ROUTES]: {
    [Route in keyof typeof ROUTES[Category]]: string
  }
};

// Crear un objeto con las rutas planas
const buildPathsObject = (): RouteKeys => {
  const result: Record<string, Record<string, string>> = {};
  
  // Inicializar las categorías
  Object.keys(ROUTES).forEach(category => {
    result[category] = {};
  });
  
  // Llenar con las rutas
  Object.entries(ROUTES).forEach(([category, routes]) => {
    Object.entries(routes).forEach(([name, route]) => {
      result[category][name] = route.path;
    });
  });
  
  return result as RouteKeys;
};

// Objeto con solo las rutas (paths) para uso fácil
export const PATHS: RouteKeys = buildPathsObject();

/**
 * Genera una ruta con parámetros
 * @param path Ruta base (ej: '/users/:id')
 * @param params Parámetros a reemplazar
 * @returns Ruta con parámetros reemplazados
 */
export function generatePath<P extends RouteParams>(path: string, params?: P): string {
  if (!params) return path;
  
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`:${key}`, String(value)),
    path
  );
}

/**
 * Obtiene todas las rutas en formato plano para React Router
 * @returns Array de rutas planas
 */
export function getFlatRoutes(): Array<RouteConfig> {
  const flatRoutes: RouteConfig[] = [];
  
  Object.values(ROUTES).forEach(categoryRoutes => {
    Object.values(categoryRoutes).forEach(route => {
      flatRoutes.push(route as RouteConfig);
    });
  });
  
  return flatRoutes;
}

/**
 * Obtiene todas las rutas que deben mostrarse en el menú
 * @returns Array de rutas para el menú
 */
export function getMenuRoutes(): Array<RouteConfig> {
  return getFlatRoutes()
    .filter(route => route.meta.showInMenu)
    .sort((a, b) => (a.meta.menuOrder || 99) - (b.meta.menuOrder || 99));
}

/**
 * Verifica si un usuario tiene acceso a una ruta
 * @param route Ruta a verificar
 * @param userRoles Roles del usuario
 * @returns Boolean indicando si tiene acceso
 */
export function hasRouteAccess(route: RouteConfig, userRoles: UserRole[]): boolean {
  // Si la ruta no requiere autenticación, siempre tiene acceso
  if (!route.meta.requiresAuth) return true;
  
  // Si la ruta no especifica roles, cualquier usuario autenticado tiene acceso
  if (!route.meta.roles || route.meta.roles.length === 0) return true;
  
  // Verificar si el usuario tiene al menos uno de los roles requeridos
  return userRoles.some(role => route.meta.roles?.includes(role));
}
