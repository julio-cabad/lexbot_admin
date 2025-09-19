/**
 * 🍞 BREADCRUMB GENERATOR UTILITY
 * Generates breadcrumbs based on current route and configuration
 */

import type { Breadcrumb } from '../types';

interface RouteConfig {
  path: string;
  label: string;
  icon?: string;
  parent?: string;
}

/**
 * 🎯 Default route configuration
 */
const defaultRouteConfig: RouteConfig[] = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/dashboard', label: 'Dashboard', icon: '📊', parent: '/' },
  { path: '/admin', label: 'Admin', icon: '⚙️', parent: '/' },
  { path: '/admin/recipients', label: 'Recipients', icon: '👥', parent: '/admin' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️', parent: '/admin' },
  { path: '/admin/settings/profile', label: 'Profile', icon: '👤', parent: '/admin/settings' },
  { path: '/admin/settings/preferences', label: 'Preferences', icon: '🔧', parent: '/admin/settings' },
];

/**
 * 🎯 Generate breadcrumbs from current path
 */
export const generateBreadcrumbs = (
  currentPath: string,
  routeConfig: RouteConfig[] = defaultRouteConfig,
  options: {
    includeHome?: boolean;
    maxItems?: number;
    currentAsActive?: boolean;
  } = {}
): Breadcrumb[] => {
  const {
    includeHome = true,
    maxItems = 5,
    currentAsActive = true
  } = options;

  // Find current route config
  const currentRoute = routeConfig.find(route => route.path === currentPath);
  if (!currentRoute) {
    return [];
  }

  // Build breadcrumb chain by following parent relationships
  const breadcrumbs: Breadcrumb[] = [];
  let current: RouteConfig | undefined = currentRoute;

  while (current) {
    breadcrumbs.unshift({
      label: current.label,
      route: current.path,
      icon: current.icon,
      isActive: current.path === currentPath && currentAsActive,
    });

    // Find parent route
    current = current.parent 
      ? routeConfig.find(route => route.path === current!.parent)
      : undefined;
  }

  // Remove home if not wanted
  if (!includeHome && breadcrumbs.length > 0 && breadcrumbs[0].route === '/') {
    breadcrumbs.shift();
  }

  // Truncate if too many items
  if (breadcrumbs.length > maxItems) {
    const firstItem = breadcrumbs[0];
    const lastItems = breadcrumbs.slice(-(maxItems - 2));
    
    return [
      firstItem,
      { label: '...', route: undefined, isActive: false },
      ...lastItems
    ];
  }

  return breadcrumbs;
};

/**
 * 🎯 Generate breadcrumbs from route segments
 */
export const generateBreadcrumbsFromSegments = (
  pathname: string,
  segmentLabels: Record<string, string> = {},
  options: {
    includeHome?: boolean;
    homeLabel?: string;
    homeIcon?: string;
  } = {}
): Breadcrumb[] => {
  const {
    includeHome = true,
    homeLabel = 'Home',
    homeIcon = '🏠'
  } = options;

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [];

  // Add home if requested
  if (includeHome) {
    breadcrumbs.push({
      label: homeLabel,
      route: '/',
      icon: homeIcon,
      isActive: pathname === '/',
    });
  }

  // Build breadcrumbs from segments
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Get label from configuration or format segment
    const label = segmentLabels[segment] || formatSegmentLabel(segment);
    
    breadcrumbs.push({
      label,
      route: currentPath,
      isActive: isLast,
    });
  });

  return breadcrumbs;
};

/**
 * 🎯 Format segment label
 */
const formatSegmentLabel = (segment: string): string => {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * 🎯 Custom breadcrumb builder
 */
export class BreadcrumbBuilder {
  private breadcrumbs: Breadcrumb[] = [];

  add(label: string, route?: string, options?: { icon?: string; isActive?: boolean }): this {
    this.breadcrumbs.push({
      label,
      route,
      icon: options?.icon,
      isActive: options?.isActive || false,
    });
    return this;
  }

  addHome(label: string = 'Home', route: string = '/', icon?: string): this {
    return this.add(label, route, { icon });
  }

  addCurrent(label: string, icon?: string): this {
    return this.add(label, undefined, { icon, isActive: true });
  }

  build(): Breadcrumb[] {
    return [...this.breadcrumbs];
  }

  clear(): this {
    this.breadcrumbs = [];
    return this;
  }
}

/**
 * 🎯 Hook-like function for generating breadcrumbs
 */
export const useBreadcrumbs = (
  pathname: string,
  customConfig?: {
    routeConfig?: RouteConfig[];
    segmentLabels?: Record<string, string>;
    options?: {
      includeHome?: boolean;
      maxItems?: number;
      currentAsActive?: boolean;
    };
  }
): Breadcrumb[] => {
  const { routeConfig, segmentLabels, options } = customConfig || {};

  // Try route config first
  if (routeConfig) {
    const breadcrumbs = generateBreadcrumbs(pathname, routeConfig, options);
    if (breadcrumbs.length > 0) {
      return breadcrumbs;
    }
  }

  // Fallback to segment-based generation
  return generateBreadcrumbsFromSegments(pathname, segmentLabels, options);
};