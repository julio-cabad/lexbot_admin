import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { PATHS } from "../../../config/routes";

interface UseAuthRedirectOptions {
  /**
   * Ruta a la que redirigir cuando el usuario esté autenticado
   * Por defecto: dashboard
   */
  redirectTo?: string;

  /**
   * Si debe usar replace en lugar de push para la navegación
   * Por defecto: true (para evitar que el usuario regrese con el botón atrás)
   */
  replace?: boolean;

  /**
   * Si debe esperar a que la autenticación esté completamente inicializada
   * Por defecto: true (más seguro)
   */
  waitForInitialization?: boolean;

  /**
   * Condición personalizada para determinar si debe redirigir
   * Por defecto: isAuthenticated
   */
  shouldRedirect?: (authState: ReturnType<typeof useAuth>) => boolean;
}

/**
 * Hook para manejar redirección automática basada en el estado de autenticación
 *
 * Casos de uso:
 * - Redirigir usuarios autenticados desde páginas públicas (login/register)
 * - Redirigir a rutas específicas después del login
 * - Manejar redirección con estado de carga
 *
 * @param options Opciones de configuración para la redirección
 */
export const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const {
    redirectTo = PATHS.private.dashboard,
    replace = true,
    waitForInitialization = true,
    shouldRedirect,
  } = options;

  const navigate = useNavigate();
  const authState = useAuth();
  const { isAuthenticated, isInitialized } = authState;

  useEffect(() => {
    // Si debe esperar inicialización y aún no está inicializada, no hacer nada
    if (waitForInitialization && !isInitialized) {
      return;
    }

    // Determinar si debe redirigir usando condición personalizada o por defecto
    const shouldPerformRedirect = shouldRedirect
      ? shouldRedirect(authState)
      : isAuthenticated;

    if (shouldPerformRedirect) {
      navigate(redirectTo, { replace });
    }
  }, [
    isAuthenticated,
    isInitialized,
    navigate,
    redirectTo,
    replace,
    waitForInitialization,
    shouldRedirect,
    authState,
  ]);

  return {
    /**
     * Función para redirigir manualmente
     */
    redirectTo: (path: string, options?: { replace?: boolean }) => {
      navigate(path, { replace: options?.replace ?? replace });
    },

    /**
     * Estado actual de la redirección
     */
    canRedirect: waitForInitialization ? isInitialized : true,
    isAuthenticated,
    isInitialized,
  };
};

/**
 * Hook específico para páginas públicas que deben redirigir usuarios autenticados
 * (como login y register)
 */
export const usePublicPageRedirect = (redirectTo?: string) => {
  return useAuthRedirect({
    redirectTo: redirectTo || PATHS.private.dashboard,
    replace: true,
    waitForInitialization: true,
  });
};

/**
 * Hook para redirigir a una ruta específica después del login exitoso
 * Utiliza el sistema de redirectAfterLogin del store
 */
export const usePostLoginRedirect = () => {
  const authState = useAuth();
  const { user } = authState;

  return useAuthRedirect({
    redirectTo: PATHS.private.dashboard, // Fallback por defecto
    replace: true,
    waitForInitialization: true,
    shouldRedirect: (auth) => {
      // Solo redirigir si hay un usuario y está autenticado
      return auth.isAuthenticated && !!auth.user;
    },
  });
};

/**
 * Hook para páginas que requieren autenticación
 * Redirige a login si no está autenticado
 */
export const useProtectedPageRedirect = () => {
  return useAuthRedirect({
    redirectTo: PATHS.public.login,
    replace: true,
    waitForInitialization: true,
    shouldRedirect: (auth) => {
      // Redirigir si está inicializado pero NO autenticado
      return auth.isInitialized && !auth.isAuthenticated;
    },
  });
};

/**
 * 🎯 HOOK INTELIGENTE PARA REDIRECCIÓN BASADA EN COMPLETITUD DEL PERFIL
 * Redirige a completar perfil si no está completo, o al dashboard si está completo
 */
export const useSmartAuthRedirect = () => {
  const navigate = useNavigate();
  const authState = useAuth();
  const { isAuthenticated, isInitialized, user } = authState;

  useEffect(() => {
    const handleSmartRedirect = async () => {
      // Esperar a que esté inicializado
      if (!isInitialized) return;

      // Si no está autenticado, no hacer nada
      if (!isAuthenticated || !user) return;

      try {
        // Importar dinámicamente para evitar dependencias circulares
        const { userService } = await import('../../../core/services');
        
        // Verificar si el perfil está completo
        const isComplete = await userService.isProfileComplete(user.uid);
        
        if (isComplete) {
          // Perfil completo → Dashboard
          navigate(PATHS.private.dashboard, { replace: true });
        } else {
          // Perfil incompleto → Completar perfil
          navigate('/complete-profile', { replace: true });
        }
      } catch (error) {
        console.error('❌ Error en redirección inteligente:', error);
        // En caso de error, redirigir al dashboard por defecto
        navigate(PATHS.private.dashboard, { replace: true });
      }
    };

    handleSmartRedirect();
  }, [isAuthenticated, isInitialized, user, navigate]);

  return {
    isRedirecting: isInitialized && isAuthenticated && !!user,
  };
};