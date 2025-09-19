/**
 * 🪝 USE BREADCRUMBS HOOK
 * React hook for managing breadcrumbs with route integration
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateBreadcrumbs } from '../../../core/store/slices/admin/slice';
import { generateBreadcrumbs, generateBreadcrumbsFromSegments } from '../utils/breadcrumbGenerator';
import type { Breadcrumb } from '../types';

interface UseBreadcrumbsOptions {
  autoUpdate?: boolean;
  includeHome?: boolean;
  maxItems?: number;
  customLabels?: Record<string, string>;
  routeConfig?: Array<{
    path: string;
    label: string;
    icon?: string;
    parent?: string;
  }>;
}

interface UseBreadcrumbsReturn {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  addBreadcrumb: (breadcrumb: Breadcrumb) => void;
  clearBreadcrumbs: () => void;
}

/**
 * 🎯 USE BREADCRUMBS HOOK
 * Manages breadcrumbs with automatic route-based generation
 */
export const useBreadcrumbs = (options: UseBreadcrumbsOptions = {}): UseBreadcrumbsReturn => {
  const {
    autoUpdate = true,
    includeHome = true,
    maxItems = 5,
    customLabels = {},
    routeConfig
  } = options;

  const location = useLocation();
  const dispatch = useDispatch();

  /**
   * 🎯 Generate breadcrumbs based on current location
   */
  const breadcrumbs = useMemo(() => {
    if (!autoUpdate) return [];

    // Try route config first if provided
    if (routeConfig) {
      const configBreadcrumbs = generateBreadcrumbs(
        location.pathname,
        routeConfig,
        { includeHome, maxItems, currentAsActive: true }
      );
      
      if (configBreadcrumbs.length > 0) {
        return configBreadcrumbs;
      }
    }

    // Fallback to segment-based generation
    return generateBreadcrumbsFromSegments(
      location.pathname,
      customLabels,
      { includeHome }
    );
  }, [location.pathname, autoUpdate, includeHome, maxItems, customLabels, routeConfig]);

  /**
   * 🎯 Set breadcrumbs manually
   */
  const setBreadcrumbs = (newBreadcrumbs: Breadcrumb[]) => {
    dispatch(updateBreadcrumbs({ breadcrumbs: newBreadcrumbs }));
  };

  /**
   * 🎯 Add single breadcrumb
   */
  const addBreadcrumb = (breadcrumb: Breadcrumb) => {
    const updatedBreadcrumbs = [...breadcrumbs, breadcrumb];
    dispatch(updateBreadcrumbs({ breadcrumbs: updatedBreadcrumbs }));
  };

  /**
   * 🎯 Clear all breadcrumbs
   */
  const clearBreadcrumbs = () => {
    dispatch(updateBreadcrumbs({ breadcrumbs: [] }));
  };

  // Auto-update Redux store when breadcrumbs change
  useMemo(() => {
    if (autoUpdate && breadcrumbs.length > 0) {
      dispatch(updateBreadcrumbs({ breadcrumbs }));
    }
  }, [breadcrumbs, autoUpdate, dispatch]);

  return {
    breadcrumbs,
    setBreadcrumbs,
    addBreadcrumb,
    clearBreadcrumbs,
  };
};

/**
 * 🎯 USE MANUAL BREADCRUMBS HOOK
 * For pages that need custom breadcrumb control
 */
export const useManualBreadcrumbs = () => {
  const dispatch = useDispatch();

  const setBreadcrumbs = (breadcrumbs: Breadcrumb[]) => {
    dispatch(updateBreadcrumbs({ breadcrumbs }));
  };

  const clearBreadcrumbs = () => {
    dispatch(updateBreadcrumbs({ breadcrumbs: [] }));
  };

  return {
    setBreadcrumbs,
    clearBreadcrumbs,
  };
};

export default useBreadcrumbs;