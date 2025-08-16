import { useEffect, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../common";
import {
  selectSessionInfo,
  selectIsAuthenticated,
  selectSessionTimeRemaining,
  selectIsSessionExpired,
  extendSession,
  logoutUser,
} from "../../store";
import { sessionService } from "../../services";

/**
 * Hook para manejo de sesiones de usuario
 */
export const useSession = () => {
  const dispatch = useAppDispatch();
  const sessionInfo = useAppSelector(selectSessionInfo);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const timeRemaining = useAppSelector(selectSessionTimeRemaining);
  const isExpired = useAppSelector(selectIsSessionExpired);

  // Extender sesión manualmente
  const extendSessionManually = useCallback(() => {
    if (isAuthenticated && sessionInfo.rememberMe) {
      dispatch(extendSession());
    }
  }, [dispatch, isAuthenticated, sessionInfo.rememberMe]);

  // Logout por expiración
  const logoutDueToExpiration = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  // Configurar auto-logout por inactividad
  useEffect(() => {
    if (!isAuthenticated) return;

    const cleanup = sessionService.setupAutoLogout(() => {
      logoutDueToExpiration();
    }, 30); // 30 minutos de inactividad

    return cleanup;
  }, [isAuthenticated, logoutDueToExpiration]);

  // Verificar expiración de sesión
  useEffect(() => {
    if (isExpired && isAuthenticated) {
      logoutDueToExpiration();
    }
  }, [isExpired, isAuthenticated, logoutDueToExpiration]);

  // Auto-extender sesión cuando esté cerca de expirar
  useEffect(() => {
    if (!isAuthenticated || !sessionInfo.rememberMe || !timeRemaining) return;

    const fiveMinutes = 5 * 60 * 1000; // 5 minutos en ms

    if (timeRemaining < fiveMinutes && timeRemaining > 0) {
      extendSessionManually();
    }
  }, [
    timeRemaining,
    isAuthenticated,
    sessionInfo.rememberMe,
    extendSessionManually,
  ]);

  // Datos computados de la sesión
  const sessionData = useMemo(() => {
    if (!isAuthenticated) {
      return {
        isActive: false,
        isPersistent: false,
        expiresAt: null,
        lastActivity: null,
        timeRemaining: null,
        timeRemainingFormatted: null,
        isExpiringSoon: false,
      };
    }

    const expiresAt = sessionInfo.expiresAt
      ? new Date(sessionInfo.expiresAt)
      : null;
    const lastActivity = sessionInfo.lastActivity
      ? new Date(sessionInfo.lastActivity)
      : null;

    // Formatear tiempo restante
    let timeRemainingFormatted = null;
    if (timeRemaining && timeRemaining > 0) {
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );

      if (hours > 0) {
        timeRemainingFormatted = `${hours}h ${minutes}m`;
      } else {
        timeRemainingFormatted = `${minutes}m`;
      }
    }

    // Verificar si la sesión expira pronto (menos de 15 minutos)
    const fifteenMinutes = 15 * 60 * 1000;
    const isExpiringSoon =
      timeRemaining !== null &&
      timeRemaining < fifteenMinutes &&
      timeRemaining > 0;

    return {
      isActive: true,
      isPersistent: sessionInfo.rememberMe,
      expiresAt,
      lastActivity,
      timeRemaining,
      timeRemainingFormatted,
      isExpiringSoon,
    };
  }, [isAuthenticated, sessionInfo, timeRemaining]);

  // Función para obtener información detallada de la sesión
  const getSessionDetails = useCallback(() => {
    return sessionService.getSessionInfo();
  }, []);

  // Función para limpiar datos de sesión
  const clearSessionData = useCallback(() => {
    sessionService.clearAllSessionData();
  }, []);

  return {
    // Datos de la sesión
    ...sessionData,

    // Estados
    isExpired,

    // Funciones
    extendSession: extendSessionManually,
    logout: logoutDueToExpiration,
    getSessionDetails,
    clearSessionData,

    // Información raw
    sessionInfo,
  };
};
