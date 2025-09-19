/**
 * Configuración centralizada de Redux Store
 * Integrada con el sistema de configuración
 */
import { configureStore } from "@reduxjs/toolkit";
import { APP_CONFIG } from "../../config/app";

// Importamos los reducers necesarios
import { authReducer } from "./slices/auth";
import { adminReducer } from "./slices/admin";
import { sessionMiddleware } from "./middleware";

/**
 * Configuración de la tienda Redux
 * - Integrada con el sistema de configuración
 * - Middleware optimizado
 * - DevTools configurados según entorno
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer, // 🏛️ NUEVO: Admin state management
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar objetos Firebase User y objetos Date en acciones y estado
        ignoredActions: [
          "auth/checkAuthStatus/fulfilled",
          "auth/loginUser/fulfilled",
          "auth/registerUser/fulfilled",
          "auth/updateUserProfile/fulfilled",
          "auth/refreshUserData/fulfilled",
          "auth/extendSession/fulfilled",
        ],
        ignoredPaths: [
          "auth.user",
          "auth.sessionInfo.lastActivity",
          "auth.sessionInfo.expiresAt",
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
export const selectAdmin = (state: RootState) => state.admin;
