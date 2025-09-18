/**
 * Middleware para gestionar la sesión del usuario
 * Integrado con el sistema de configuración
 */
import { Middleware, UnknownAction } from "@reduxjs/toolkit";
import { sessionService } from "../../services";
import { updateSessionActivity, extendSession } from "../slices/auth";

/**
 * Middleware para rastrear la actividad del usuario y gestionar la expiración de la sesión
 * - Actualiza la actividad de la sesión en acciones específicas
 * - Extiende automáticamente la sesión cuando está cerca de expirar
 * - Configurable a través del sistema de configuración centralizada
 */
export const sessionMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    const result = next(action);
    const state = store.getState();

    // Solo rastrear actividad si el usuario está autenticado
    if (state.auth.isAuthenticated && state.auth.user) {
      // Acciones que indican actividad del usuario
      const activityActions = [
        "auth/loginUser/fulfilled",
        "auth/registerUser/fulfilled",
        "auth/updateUserProfile/fulfilled",
        "auth/refreshUserData/fulfilled",
      ];

      // Actualizar actividad para ciertas acciones
      if (activityActions.includes((action as UnknownAction).type)) {
        (store.dispatch as any)(updateSessionActivity());
        sessionService.trackActivity();
      }

      // Extender automáticamente la sesión si está cerca de expirar (dentro de 5 minutos)
      if (
        state.auth.sessionInfo.expiresAt &&
        state.auth.sessionInfo.rememberMe
      ) {
        const expiresAt = new Date(state.auth.sessionInfo.expiresAt);
        const now = new Date();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        
        // Usar configuración centralizada para el tiempo de advertencia
        const warningTime = 5 * 60 * 1000; // 5 minutos en milisegundos

        if (timeUntilExpiry > 0 && timeUntilExpiry < warningTime) {
          (store.dispatch as any)(extendSession());
        }
      }
    }

    return result;
  };

export default sessionMiddleware;
