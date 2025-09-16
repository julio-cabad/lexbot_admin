import { LoginPage, DashboardPage } from '@/pages';

interface RouteMeta {
  title: string;
  requiresAuth: boolean;
  breadcrumb?: string;
}

interface RouteConfig {
  path: string;
  component: React.ComponentType;
  meta: RouteMeta;
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
type RoutePaths = {
  [K in keyof typeof ROUTES]: {
    [P in keyof typeof ROUTES[K]]: typeof ROUTES[K][P]['path']
  }
};

export const PATHS: RoutePaths = Object.entries(ROUTES).reduce(
  (acc, [category, routes]) => {
    acc[category] = Object.entries(routes).reduce(
      (catAcc, [name, route]) => {
        catAcc[name] = route.path;
        return catAcc;
      },
      {} as Record<string, string>
    );
    return acc;
  },
  {} as RoutePaths
);
