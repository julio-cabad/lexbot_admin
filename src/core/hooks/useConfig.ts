import { useMemo } from 'react';
import { APP_CONFIG, getConfig, isFeatureEnabled, FeatureFlags, ThemeName } from '../../config/app';

/**
 * Hook para acceder a la configuración de la aplicación
 * Proporciona acceso tipado a la configuración y utilidades
 */
export function useConfig() {
  // Memoizamos el resultado para evitar recálculos innecesarios
  return useMemo(() => {
    return {
      /**
       * Configuración completa de la aplicación
       */
      config: APP_CONFIG,

      /**
       * Obtener un valor específico de la configuración
       * @param path Ruta al valor (ej: 'info.name', 'api.baseUrl')
       */
      get: <T>(path: string): T => getConfig<T>(path),

      /**
       * Comprobar si una feature está habilitada
       * @param featureName Nombre de la feature
       */
      isFeatureEnabled: (featureName: keyof FeatureFlags): boolean => 
        isFeatureEnabled(featureName),

      /**
       * Información de la aplicación
       */
      info: {
        name: APP_CONFIG.info.name,
        version: APP_CONFIG.info.version,
        description: APP_CONFIG.info.description,
        author: APP_CONFIG.info.author,
        copyright: APP_CONFIG.info.copyright,
        fullTitle: `${APP_CONFIG.info.name} v${APP_CONFIG.info.version}`,
      },

      /**
       * Configuración de la API
       */
      api: APP_CONFIG.api,

      /**
       * Configuración de Firebase
       */
      firebase: APP_CONFIG.firebase,

      /**
       * Configuración de UI
       */
      ui: APP_CONFIG.ui,

      /**
       * Configuración de autenticación
       */
      auth: APP_CONFIG.auth,

      /**
       * Información del entorno
       */
      env: {
        ...APP_CONFIG.env,
        isDev: APP_CONFIG.env.isDevelopment,
        isProd: APP_CONFIG.env.isProduction,
      },

      /**
       * Comprobar si estamos en modo desarrollo
       */
      isDev: APP_CONFIG.env.isDevelopment,

      /**
       * Comprobar si estamos en modo producción
       */
      isProd: APP_CONFIG.env.isProduction,

      /**
       * Obtener el tema actual
       */
      theme: APP_CONFIG.ui.defaultTheme,

      /**
       * Comprobar si el tema actual es el especificado
       * @param themeName Nombre del tema a comprobar
       */
      isTheme: (themeName: ThemeName): boolean => 
        APP_CONFIG.ui.defaultTheme === themeName,
    };
  }, []);
}

/**
 * Exportamos también las funciones de utilidad para uso directo
 */
export { getConfig, isFeatureEnabled };
