/**
 * Utilidades para trabajar con el sistema de textos
 */
import { getText, interpolateText } from '../../config/texts';

/**
 * Obtiene un texto del sistema de textos con tipado fuerte
 * @param path Ruta al texto (ej: 'auth.loginTitle', 'common.loading')
 * @param variables Variables para interpolación
 * @param defaultValue Valor por defecto si el texto no existe
 */
export function getTextSafe(path: string, variables?: Record<string, any>, defaultValue: string = ''): string {
  try {
    const text = getText(path, variables);
    return text === path ? defaultValue : text; // Si devuelve la misma ruta, es que no encontró el texto
  } catch (error) {
    console.warn(`Error getting text for path: ${path}`, error);
    return defaultValue;
  }
}

/**
 * Obtiene textos de autenticación
 * @param key Clave del texto de autenticación
 * @param variables Variables para interpolación
 */
export function getAuthText(key: string, variables?: Record<string, any>): string {
  return getTextSafe(`auth.${key}`, variables);
}

/**
 * Obtiene textos comunes
 * @param key Clave del texto común
 * @param variables Variables para interpolación
 */
export function getCommonText(key: string, variables?: Record<string, any>): string {
  return getTextSafe(`common.${key}`, variables);
}

/**
 * Obtiene textos de dashboard
 * @param key Clave del texto de dashboard
 * @param variables Variables para interpolación
 */
export function getDashboardText(key: string, variables?: Record<string, any>): string {
  return getTextSafe(`dashboard.${key}`, variables);
}

/**
 * Obtiene textos de error
 * @param key Clave del texto de error
 * @param variables Variables para interpolación
 */
export function getErrorText(key: string, variables?: Record<string, any>): string {
  return getTextSafe(`errors.${key}`, variables);
}

/**
 * Obtiene textos de éxito
 * @param key Clave del texto de éxito
 * @param variables Variables para interpolación
 */
export function getSuccessText(key: string, variables?: Record<string, any>): string {
  return getTextSafe(`success.${key}`, variables);
}

/**
 * Obtiene textos de validación
 * @param key Clave del texto de validación
 * @param variables Variables para interpolación
 */
export function getValidationText(key: string, variables?: Record<string, any>): string {
  return getTextSafe(`validation.${key}`, variables);
}

/**
 * Obtiene textos de la aplicación
 * @param key Clave del texto de la aplicación
 * @param variables Variables para interpolación
 */
export function getAppText(key: string, variables?: Record<string, any>): string {
  return getTextSafe(`app.${key}`, variables);
}

/**
 * Formatea un texto con variables
 * @param text Texto base con placeholders {{variable}}
 * @param variables Objeto con variables para reemplazar
 */
export function formatText(text: string, variables: Record<string, any> = {}): string {
  return interpolateText(text, variables);
}

/**
 * Obtiene el mensaje de error para un código de error específico
 * @param errorCode Código de error
 * @param defaultMessage Mensaje por defecto
 */
export function getErrorMessage(errorCode: string, defaultMessage: string = 'Ha ocurrido un error'): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return getValidationText('invalidEmail');
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return getAuthText('errors.invalidCredentials');
    case 'auth/email-already-in-use':
      return getAuthText('errors.emailExists');
    case 'auth/weak-password':
      return getAuthText('errors.weakPassword');
    case 'auth/network-request-failed':
      return getErrorText('networkErrorMessage');
    case 'auth/too-many-requests':
      return getAuthText('errors.tooManyAttempts');
    default:
      return defaultMessage;
  }
}

/**
 * Obtiene el texto para un botón según su estado
 * @param baseText Texto base del botón
 * @param isLoading Si el botón está cargando
 * @param loadingText Texto a mostrar cuando está cargando
 */
export function getButtonText(baseText: string, isLoading: boolean, loadingText?: string): string {
  if (!isLoading) return baseText;
  return loadingText || `${baseText}...`;
}

/**
 * Genera un saludo según la hora del día
 * @param userName Nombre del usuario
 */
export function getGreeting(userName?: string): string {
  const hour = new Date().getHours();
  let greeting = '';
  
  if (hour < 12) {
    greeting = '¡Buenos días';
  } else if (hour < 18) {
    greeting = '¡Buenas tardes';
  } else {
    greeting = '¡Buenas noches';
  }
  
  return userName ? `${greeting}, ${userName}!` : `${greeting}!`;
}
