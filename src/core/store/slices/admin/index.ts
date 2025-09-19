/**
 * 🏛️ ADMIN SLICE EXPORTS
 * Exportación centralizada del estado admin
 * Siguiendo el patrón establecido en auth/index.ts
 */

// Exportar reducer principal
export { default as adminReducer } from './slice';

// Exportar todas las actions
export * from './slice';

// Exportar todos los selectores
export * from './selectors';

// Exportar tipos
export * from './types';

// Exportar configuraciones
export { BREAKPOINTS, DEFAULT_LAYOUT_CONFIG } from './types';