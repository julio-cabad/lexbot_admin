/**
 * Exportación centralizada de todas las utilidades
 */

// Exportar utilidades con nombres únicos
export * from './classNames';
export * from './constants';
export * from './helpers';
export * from './validation';

// Exportar accesibilidad con alias para evitar conflictos
import * as a11y from './accessibility';
export { a11y };

// Re-exportar funciones específicas de accesibilidad con nombres únicos
export { 
  announceToScreenReader,
  manageFocus,
  validateAccessibility,
  prefersReducedMotion,
  prefersHighContrast,
  getPreferredColorScheme,
  applyAriaAttributes,
  createAccessibleButton,
  // Renombrar para evitar conflictos
  generateId as generateAccessibilityId,
  combineAriaDescribedBy,
  TOUCH_TARGET,
  CONTRAST_RATIO,
  LIVE_REGION,
  ARIA_ROLES,
  ARIA_STATES,
  ARIA_PROPERTIES,
  // Renombrar para evitar conflictos
  BREAKPOINTS as A11Y_BREAKPOINTS
} from './accessibility';

// Nota: Las utilidades configUtils y textUtils se implementarán en una fase posterior
// cuando se complete la migración de todos los componentes
