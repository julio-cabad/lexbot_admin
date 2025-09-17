/**
 * Utilidades generales para la aplicación
 * Integradas con el sistema de configuración
 */
import { AuthErrorCode } from '../../types';
import { ERROR_MESSAGES, ANIMATION_DURATION } from './constants';
import { APP_CONFIG } from '../../config/app';

/**
 * Formatea errores de autenticación de Firebase a mensajes amigables
 */
export const formatAuthError = (errorCode: string): string => {
  switch (errorCode as AuthErrorCode) {
    case AuthErrorCode.INVALID_CREDENTIALS:
      return ERROR_MESSAGES.INVALID_CREDENTIALS;
    case AuthErrorCode.USER_NOT_FOUND:
      return ERROR_MESSAGES.USER_NOT_FOUND;
    case AuthErrorCode.EMAIL_ALREADY_IN_USE:
      return ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
    case AuthErrorCode.WEAK_PASSWORD:
      return ERROR_MESSAGES.WEAK_PASSWORD;
    case AuthErrorCode.NETWORK_ERROR:
      return ERROR_MESSAGES.NETWORK_ERROR;
    case AuthErrorCode.TOO_MANY_REQUESTS:
      return ERROR_MESSAGES.TOO_MANY_REQUESTS;
    case AuthErrorCode.INVALID_EMAIL:
      return ERROR_MESSAGES.INVALID_EMAIL;
    case AuthErrorCode.USER_DISABLED:
      return 'Esta cuenta ha sido deshabilitada';
    case AuthErrorCode.OPERATION_NOT_ALLOWED:
      return 'Esta operación no está permitida';
    case AuthErrorCode.EXPIRED_ACTION_CODE:
      return 'El código de verificación ha expirado';
    case AuthErrorCode.INVALID_ACTION_CODE:
      return 'El código de verificación es inválido';
    case AuthErrorCode.MISSING_EMAIL:
      return ERROR_MESSAGES.REQUIRED_FIELD;
    case AuthErrorCode.MISSING_PASSWORD:
      return ERROR_MESSAGES.REQUIRED_FIELD;
    default:
      return ERROR_MESSAGES.GENERIC_ERROR;
  }
};

/**
 * Sanitiza input para prevenir XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .trim();
};

/**
 * Formatea nombres para mostrar
 */
export const formatDisplayName = (name: string): string => {
  return name
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Genera un ID aleatorio
 */
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Función debounce para validación de inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number = ANIMATION_DURATION.NORMAL
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Función throttle para llamadas API
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number = ANIMATION_DURATION.NORMAL
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Formatea fecha para mostrar
 */
export const formatDate = (date: Date | string, locale: string = 'es-ES'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea hora para mostrar
 */
export const formatTime = (date: Date | string, locale: string = 'es-ES'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Verifica si un email tiene formato válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Obtiene iniciales de un nombre
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Copia texto al portapapeles
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback para navegadores antiguos
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};

/**
 * Detecta si el dispositivo es móvil
 */
export const isMobile = (): boolean => {
  return window.innerWidth < parseInt(APP_CONFIG.ui.breakpoints.md);
};

/**
 * Detecta si el dispositivo es tablet
 */
export const isTablet = (): boolean => {
  return window.innerWidth >= parseInt(APP_CONFIG.ui.breakpoints.md) && 
         window.innerWidth < parseInt(APP_CONFIG.ui.breakpoints.lg);
};

/**
 * Detecta si el dispositivo es desktop
 */
export const isDesktop = (): boolean => {
  return window.innerWidth >= parseInt(APP_CONFIG.ui.breakpoints.lg);
};

/**
 * Obtiene el tipo de dispositivo
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

/**
 * Helpers para localStorage
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

/**
 * Helpers para sessionStorage
 */
export const sessionStorage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): boolean => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to sessionStorage:', error);
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
      return false;
    }
  }
};

/**
 * Helpers para URL
 */
export const url = {
  /**
   * Obtiene un parámetro de la URL
   */
  getQueryParam: (param: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  /**
   * Establece un parámetro en la URL
   */
  setQueryParam: (param: string, value: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url.toString());
  },

  /**
   * Elimina un parámetro de la URL
   */
  removeQueryParam: (param: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.replaceState({}, '', url.toString());
  },

  /**
   * Construye una URL con parámetros
   */
  buildUrl: (base: string, params: Record<string, string>): string => {
    const url = new URL(base, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  }
};

/**
 * Función para obtener el texto de un error
 */
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error?.code) {
    return formatAuthError(error.code);
  }
  
  return ERROR_MESSAGES.GENERIC_ERROR;
};
