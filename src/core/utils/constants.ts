/**
 * Constantes centralizadas para la aplicación
 * Integradas con el sistema de configuración
 */
import { APP_CONFIG } from '../../config/app';
import { getText } from '../../config/texts';

/**
 * Rutas de la aplicación
 * @deprecated Usar config/routes.ts en su lugar
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile'
} as const;

/**
 * Constantes de autenticación
 * Obtenidas de la configuración centralizada
 */
export const AUTH_CONSTANTS = {
  REMEMBER_ME_DURATION: APP_CONFIG.auth.rememberMeDuration,
  SESSION_TIMEOUT: APP_CONFIG.auth.sessionTimeout,
  PASSWORD_MIN_LENGTH: APP_CONFIG.auth.passwordMinLength,
  PASSWORD_MAX_LENGTH: APP_CONFIG.auth.passwordMaxLength,
  DISPLAY_NAME_MIN_LENGTH: 2,
  DISPLAY_NAME_MAX_LENGTH: 50,
  MAX_LOGIN_ATTEMPTS: APP_CONFIG.auth.maxLoginAttempts,
  LOCKOUT_DURATION: APP_CONFIG.auth.lockoutDuration
} as const;

/**
 * Patrones de validación
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s-()]+$/,
  NAME: /^[a-zA-ZÀ-ÿ\s]{2,50}$/
} as const;

/**
 * Mensajes de error
 * Obtenidos del sistema centralizado de textos
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: getText('validation.required'),
  INVALID_EMAIL: getText('validation.invalidEmail'),
  INVALID_PASSWORD: getText('validation.invalidPassword'),
  PASSWORDS_DONT_MATCH: getText('validation.passwordsMustMatch'),
  WEAK_PASSWORD: getText('auth.errors.weakPassword'),
  EMAIL_ALREADY_EXISTS: getText('auth.errors.emailExists'),
  USER_NOT_FOUND: 'Usuario no encontrado',
  INVALID_CREDENTIALS: getText('auth.errors.invalidCredentials'),
  NETWORK_ERROR: getText('errors.networkErrorMessage'),
  TOO_MANY_REQUESTS: getText('auth.errors.tooManyAttempts'),
  GENERIC_ERROR: getText('errors.unexpectedError'),
  TERMS_NOT_ACCEPTED: getText('auth.errors.termsNotAccepted'),
  DISPLAY_NAME_TOO_SHORT: getText('validation.minLength', { min: AUTH_CONSTANTS.DISPLAY_NAME_MIN_LENGTH }),
  DISPLAY_NAME_TOO_LONG: getText('validation.maxLength', { max: AUTH_CONSTANTS.DISPLAY_NAME_MAX_LENGTH })
} as const;

/**
 * Mensajes de éxito
 * Obtenidos del sistema centralizado de textos
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: getText('auth.success.loginSuccess'),
  REGISTER_SUCCESS: getText('auth.success.registerSuccess'),
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
  PASSWORD_RESET_EMAIL_SENT: getText('auth.success.passwordResetEmailSent'),
  PASSWORD_RESET_SUCCESS: getText('auth.success.passwordResetSuccess'),
  PROFILE_UPDATED: getText('success.profileUpdated')
} as const;

/**
 * Claves de almacenamiento local
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  REMEMBER_ME: 'remember_me',
  LAST_EMAIL: 'last_email',
  THEME: 'theme'
} as const;

/**
 * Duraciones de animaciones (en milisegundos)
 * Obtenidas de la configuración centralizada
 */
export const ANIMATION_DURATION = {
  FAST: APP_CONFIG.ui.animationDuration.fast,
  NORMAL: APP_CONFIG.ui.animationDuration.normal,
  SLOW: APP_CONFIG.ui.animationDuration.slow,
  EXTRA_SLOW: 1000
} as const;

/**
 * Duraciones de notificaciones toast
 * Obtenidas de la configuración centralizada
 */
export const TOAST_DURATION = {
  SHORT: APP_CONFIG.ui.toastDuration.short,
  NORMAL: APP_CONFIG.ui.toastDuration.normal,
  LONG: APP_CONFIG.ui.toastDuration.long
} as const;

/**
 * Breakpoints para diseño responsive
 * Obtenidos de la configuración centralizada
 */
export const BREAKPOINTS = APP_CONFIG.ui.breakpoints;
