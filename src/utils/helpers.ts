import { AuthErrorCode, ToastType } from '../types';
import { ERROR_MESSAGES } from './constants';

// Format Firebase Auth errors to user-friendly messages
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

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .trim();
};

// Format display name
export const formatDisplayName = (name: string): string => {
  return name
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Generate random string for IDs
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Debounce function for input validation
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for API calls
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
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

// Format date for display
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time for display
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Check if email is valid format (simple check)
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};

// Check if device is mobile
export const isMobile = (): boolean => {
  return window.innerWidth < 768;
};

// Check if device is tablet
export const isTablet = (): boolean => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

// Check if device is desktop
export const isDesktop = (): boolean => {
  return window.innerWidth >= 1024;
};

// Get device type
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

// Local storage helpers
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

// Session storage helpers
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

// URL helpers
export const getQueryParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

export const setQueryParam = (param: string, value: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.set(param, value);
  window.history.replaceState({}, '', url.toString());
};

// Class name helper (similar to clsx)
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};