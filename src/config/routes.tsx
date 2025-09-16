import LoginPage from '@/features/auth/pages/LoginPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';

interface RouteMeta {
  title: string;
  requiresAuth: boolean;
  breadcrumb?: string;
}

export const ROUTES = {
  public: {
    login: {
      path: '/login',
      component: LoginPage,
      meta: {
        title: 'Inicio de Sesión',
        requiresAuth: false
      }
    }
  },
  private: {
    dashboard: {
      path: '/dashboard',
      component: DashboardPage,
      meta: {
        title: 'Panel Principal',
        requiresAuth: true,
        breadcrumb: 'Dashboard'
      }
    }
  }
} as const;

// Helper para generar paths con TypeScript
export type RoutePaths = {
  [Category in keyof typeof ROUTES]: {
    [RouteName in keyof typeof ROUTES[Category]]: 
      typeof ROUTES[Category][RouteName]['path']
  }
};

export const PATHS: RoutePaths = {} as RoutePaths;

// Initialize PATHS
(Object.entries(ROUTES) as [keyof RoutePaths, any][]).forEach(
  ([category, routes]) => {
    PATHS[category] = {} as any;
    (Object.entries(routes) as [keyof typeof routes, any][]).forEach(
      ([routeName, route]) => {
        PATHS[category][routeName] = route.path;
      }
    );
  }
);
