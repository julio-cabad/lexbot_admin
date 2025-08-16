// App constants
export const APP_NAME = 'LexBot Admin';
export const APP_VERSION = '1.0.0';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile'
} as const;

// Auth constants
export const AUTH_CONSTANTS = {
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  DISPLAY_NAME_MIN_LENGTH: 2,
  DISPLAY_NAME_MAX_LENGTH: 50,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes in milliseconds
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s-()]+$/,
  NAME: /^[a-zA-ZÀ-ÿ\s]{2,50}$/
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'Por favor ingresa un email válido',
  INVALID_PASSWORD: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden',
  WEAK_PASSWORD: 'La contraseña es muy débil',
  EMAIL_ALREADY_EXISTS: 'Este email ya está registrado',
  USER_NOT_FOUND: 'Usuario no encontrado',
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
  NETWORK_ERROR: 'Error de conexión. Por favor intenta de nuevo',
  TOO_MANY_REQUESTS: 'Demasiados intentos. Por favor espera antes de intentar de nuevo',
  GENERIC_ERROR: 'Ha ocurrido un error. Por favor intenta de nuevo',
  TERMS_NOT_ACCEPTED: 'Debes aceptar los términos y condiciones',
  DISPLAY_NAME_TOO_SHORT: 'El nombre debe tener al menos 2 caracteres',
  DISPLAY_NAME_TOO_LONG: 'El nombre no puede tener más de 50 caracteres'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '¡Bienvenido de vuelta!',
  REGISTER_SUCCESS: '¡Cuenta creada exitosamente!',
  LOGOUT_SUCCESS: '¡Hasta luego!',
  PASSWORD_RESET_EMAIL_SENT: 'Email de recuperación enviado',
  PASSWORD_RESET_SUCCESS: 'Contraseña actualizada exitosamente',
  PROFILE_UPDATED: 'Perfil actualizado exitosamente'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  REMEMBER_ME: 'remember_me',
  LAST_EMAIL: 'last_email'
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000
} as const;

// Toast notification durations
export const TOAST_DURATION = {
  SHORT: 3000,
  NORMAL: 5000,
  LONG: 8000
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
} as const;