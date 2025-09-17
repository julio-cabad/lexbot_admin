/**
 * Exportaciones centralizadas para la tienda Redux
 */

// Exportar tienda y tipos
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Exportar selectores
export { selectAuth } from './store';

// Nota: Las exportaciones de slices y middleware se implementarán
// cuando se completen esos módulos
