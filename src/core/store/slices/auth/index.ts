/**
 * Exportaciones centralizadas para el slice de autenticación
 */

// Exportar tipos
export * from './types';

// Exportar selectores
export * from './selectors';

// Exportar thunks
export * from './thunks';

// Exportar reducer y acciones del slice
export { default as authReducer } from './slice';
export {
  clearError,
  clearAllErrors,
  clearSuccess,
  clearAllSuccess,
  setRedirectAfterLogin,
  setShowPasswordResetSuccess,
  setShowEmailVerificationPrompt,
  updateSessionActivity,
  setGeneralError,
  resetAuthState,
  setAuth,
} from './slice';
