import { useMemo } from 'react';
import { TEXTS, getText, interpolateText } from '../../config/texts';

/**
 * Hook para acceder al sistema de textos centralizado
 * Proporciona acceso tipado a los textos y funciones de utilidad
 */
export function useTexts() {
  // Memoizamos el resultado para evitar recálculos innecesarios
  return useMemo(() => {
    return {
      /**
       * Todos los textos de la aplicación
       */
      texts: TEXTS,

      /**
       * Función para obtener un texto por su ruta
       * @param path Ruta al texto (ej: 'auth.loginTitle', 'common.loading')
       * @param variables Variables para interpolación
       */
      t: <T extends string>(path: T, variables?: Record<string, any>): string => 
        getText(path, variables),

      /**
       * Función para interpolar un texto con variables
       * @param text Texto base con placeholders {{variable}}
       * @param variables Variables para reemplazar
       */
      interpolate: (text: string, variables: Record<string, any> = {}): string =>
        interpolateText(text, variables),

      /**
       * Acceso directo a textos de autenticación
       */
      auth: TEXTS.auth,

      /**
       * Acceso directo a textos comunes
       */
      common: TEXTS.common,

      /**
       * Acceso directo a textos del dashboard
       */
      dashboard: TEXTS.dashboard,

      /**
       * Acceso directo a textos de errores
       */
      errors: TEXTS.errors,

      /**
       * Acceso directo a textos de éxito
       */
      success: TEXTS.success,

      /**
       * Acceso directo a textos de validación
       */
      validation: TEXTS.validation,

      /**
       * Acceso directo a textos de la aplicación
       */
      app: TEXTS.app,

      /**
       * Obtener texto con formato para año actual
       * @param textPath Ruta al texto que contiene {{year}}
       */
      withCurrentYear: (textPath: string): string => {
        const text = getText(textPath);
        return interpolateText(text, { year: new Date().getFullYear() });
      },

      /**
       * Obtener texto con formato para versión de la aplicación
       * @param textPath Ruta al texto que contiene {{version}}
       * @param version Versión de la aplicación (opcional, usa la del config por defecto)
       */
      withVersion: (textPath: string, version?: string): string => {
        const text = getText(textPath);
        return interpolateText(text, { 
          version: version || TEXTS.app.version 
        });
      },

      /**
       * Obtener texto con formato para nombre de usuario
       * @param textPath Ruta al texto que contiene {{userName}}
       * @param userName Nombre de usuario
       */
      withUserName: (textPath: string, userName: string): string => {
        const text = getText(textPath);
        return interpolateText(text, { userName });
      },
    };
  }, []);
}

/**
 * Exportamos también las funciones de utilidad para uso directo
 */
export { getText, interpolateText };
