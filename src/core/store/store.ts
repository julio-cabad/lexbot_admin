/**
 * Configuración centralizada de Redux Store
 * Integrada con el sistema de configuración
 */
import { configureStore } from '@reduxjs/toolkit';
import { APP_CONFIG } from '../../config/app';

// Importamos los componentes necesarios
import { authReducer } from './slices/auth';

// Estos imports se implementarán cuando se completen los middleware
// Por ahora definimos stubs para evitar errores
const sessionMiddleware = (_store: any) => (next: any) => (action: any) => next(action);

/**
 * Configuración de la tienda Redux
 * - Integrada con el sistema de configuración
 * - Middleware optimizado
 * - DevTools configurados según entorno
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Aquí se pueden agregar más reducers a medida que se necesiten
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar objetos Firebase User y objetos Date en acciones y estado
        ignoredActions: [
          'auth/checkAuthStatus/fulfilled',
          'auth/loginUser/fulfilled',
          'auth/registerUser/fulfilled',
          'auth/updateUserProfile/fulfilled',
          'auth/refreshUserData/fulfilled',
          'auth/extendSession/fulfilled',
        ],
        ignoredPaths: [
          'auth.user',
          'auth.sessionInfo.lastActivity',
          'auth.sessionInfo.expiresAt',
        ],
      },
    }).concat(sessionMiddleware),
  devTools: APP_CONFIG.env.isDevelopment, // Usar la configuración centralizada
});

// Tipos para usar en toda la aplicación
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Hooks tipados para usar con React-Redux
 * Exportados aquí para facilitar su uso
 */
export const selectAuth = (state: RootState) => state.auth;
