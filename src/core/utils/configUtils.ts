/**
 * Utilidades para trabajar con el sistema de configuración
 */
import { APP_CONFIG, getConfig, isFeatureEnabled, FeatureFlags } from '../../config/app';

/**
 * Obtiene un valor de configuración con tipado fuerte
 * @param path Ruta a la propiedad de configuración (ej: 'api.baseUrl', 'ui.defaultTheme')
 * @param defaultValue Valor por defecto si la configuración no existe
 */
export function getConfigValue<T>(path: string, defaultValue?: T): T {
  try {
    const value = getConfig<T>(path);
    return value !== undefined ? value : (defaultValue as T);
  } catch (error) {
    console.warn(`Error getting config value for path: ${path}`, error);
    return defaultValue as T;
  }
}

/**
 * Verifica si una característica está habilitada
 * @param featureName Nombre de la característica
 * @param defaultValue Valor por defecto si la característica no está definida
 */
export function checkFeature(featureName: keyof FeatureFlags, defaultValue: boolean = false): boolean {
  try {
    return isFeatureEnabled(featureName);
  } catch (error) {
    console.warn(`Error checking feature: ${featureName}`, error);
    return defaultValue;
  }
}

/**
 * Obtiene la URL base de la API
 */
export function getApiBaseUrl(): string {
  return getConfigValue<string>('api.baseUrl', '/api');
}

/**
 * Obtiene el timeout para peticiones API
 */
export function getApiTimeout(): number {
  return getConfigValue<number>('api.timeout', 30000);
}

/**
 * Obtiene la configuración de Firebase
 */
export function getFirebaseConfig() {
  return APP_CONFIG.firebase;
}

/**
 * Verifica si la aplicación está en modo de producción
 */
export function isProduction(): boolean {
  return getConfigValue<boolean>('env.isProduction', false);
}

/**
 * Verifica si la aplicación está en modo de desarrollo
 */
export function isDevelopment(): boolean {
  return getConfigValue<boolean>('env.isDevelopment', true);
}

/**
 * Obtiene el entorno actual de la aplicación
 */
export function getAppEnvironment(): 'development' | 'staging' | 'production' {
  return getConfigValue<'development' | 'staging' | 'production'>('env.appEnv', 'development');
}

/**
 * Obtiene la información básica de la aplicación
 */
export function getAppInfo() {
  return APP_CONFIG.info;
}

/**
 * Obtiene la versión de la aplicación
 */
export function getAppVersion(): string {
  return getConfigValue<string>('info.version', '1.0.0');
}

/**
 * Obtiene el nombre de la aplicación
 */
export function getAppName(): string {
  return getConfigValue<string>('info.name', 'LexBot Admin');
}

/**
 * Obtiene los breakpoints de la UI
 */
export function getBreakpoints() {
  return APP_CONFIG.ui.breakpoints;
}

/**
 * Obtiene la duración de las animaciones
 */
export function getAnimationDuration(type: 'fast' | 'normal' | 'slow' = 'normal'): number {
  return getConfigValue<number>(`ui.animationDuration.${type}`, 300);
}

/**
 * Obtiene la duración de los toasts
 */
export function getToastDuration(type: 'short' | 'normal' | 'long' = 'normal'): number {
  return getConfigValue<number>(`ui.toastDuration.${type}`, 5000);
}

/**
 * Obtiene el tema por defecto
 */
export function getDefaultTheme() {
  return getConfigValue<string>('ui.defaultTheme', 'light');
}
