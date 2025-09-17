/**
 * Tipos para el sistema de textos
 */
export interface AuthTexts {
  loginTitle: string;
  loginSubtitle: string;
  loginButton: string;
  registerTitle: string;
  registerSubtitle: string;
  registerButton: string;
  forgotPasswordTitle: string;
  forgotPasswordSubtitle: string;
  forgotPasswordButton: string;
  resetPasswordTitle: string;
  resetPasswordSubtitle: string;
  resetPasswordButton: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  displayNamePlaceholder: string;
  forgotPassword: string;
  rememberMe: string;
  noAccount: string;
  createAccount: string;
  alreadyHaveAccount: string;
  backToLogin: string;
  verifyEmailTitle: string;
  verifyEmailMessage: string;
  verifyEmailButton: string;
  errors: {
    invalidCredentials: string;
    emailRequired: string;
    passwordRequired: string;
    passwordMismatch: string;
    weakPassword: string;
    emailExists: string;
    invalidEmail: string;
    displayNameRequired: string;
    termsNotAccepted: string;
    tooManyAttempts: string;
  };
  success: {
    loginSuccess: string;
    registerSuccess: string;
    passwordResetEmailSent: string;
    passwordResetSuccess: string;
    emailVerificationSent: string;
  };
}

export interface CommonTexts {
  loading: string;
  error: string;
  success: string;
  confirm: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  view: string;
  search: string;
  filter: string;
  sortBy: string;
  actions: string;
  noResults: string;
  required: string;
  optional: string;
  close: string;
  back: string;
  next: string;
  finish: string;
}

export interface DashboardTexts {
  title: string;
  welcome: string;
  summary: string;
  recentActivity: string;
  statistics: string;
  noActivity: string;
  quickActions: string;
  viewAll: string;
  profile: string;
  settings: string;
  logout: string;
  notifications: string;
  noNotifications: string;
}

export interface ErrorTexts {
  pageNotFound: string;
  pageNotFoundMessage: string;
  serverError: string;
  serverErrorMessage: string;
  networkError: string;
  networkErrorMessage: string;
  accessDenied: string;
  accessDeniedMessage: string;
  sessionExpired: string;
  sessionExpiredMessage: string;
  unexpectedError: string;
  tryAgain: string;
  contactSupport: string;
}

export interface SuccessTexts {
  operationSuccess: string;
  dataSaved: string;
  profileUpdated: string;
  settingsUpdated: string;
  itemCreated: string;
  itemUpdated: string;
  itemDeleted: string;
}

export interface ValidationTexts {
  required: string;
  minLength: string;
  maxLength: string;
  invalidEmail: string;
  invalidPassword: string;
  invalidPhone: string;
  invalidUrl: string;
  invalidDate: string;
  invalidNumber: string;
  passwordsMustMatch: string;
}

export interface AppTexts {
  appName: string;
  appDescription: string;
  copyright: string;
  version: string;
  poweredBy: string;
  termsOfService: string;
  privacyPolicy: string;
  cookiePolicy: string;
  help: string;
  support: string;
  contactUs: string;
  feedback: string;
}

export interface Texts {
  auth: AuthTexts;
  common: CommonTexts;
  dashboard: DashboardTexts;
  errors: ErrorTexts;
  success: SuccessTexts;
  validation: ValidationTexts;
  app: AppTexts;
  [key: string]: any; // Para permitir acceso dinámico
}

/**
 * Textos centralizados de la aplicación
 */
export const TEXTS: Texts = {
  // Sección de autenticación
  auth: {
    loginTitle: 'Iniciar Sesión',
    loginSubtitle: 'Ingresa tus credenciales para acceder al panel de administración',
    loginButton: 'Acceder',
    registerTitle: 'Crear Cuenta',
    registerSubtitle: 'Completa el formulario para registrarte en la plataforma',
    registerButton: 'Registrarse',
    forgotPasswordTitle: 'Recuperar Contraseña',
    forgotPasswordSubtitle: 'Ingresa tu correo electrónico para recibir instrucciones',
    forgotPasswordButton: 'Enviar Instrucciones',
    resetPasswordTitle: 'Establecer Nueva Contraseña',
    resetPasswordSubtitle: 'Ingresa tu nueva contraseña para continuar',
    resetPasswordButton: 'Cambiar Contraseña',
    emailPlaceholder: 'Correo Electrónico',
    passwordPlaceholder: 'Contraseña',
    confirmPasswordPlaceholder: 'Confirmar Contraseña',
    displayNamePlaceholder: 'Nombre Completo',
    forgotPassword: '¿Olvidaste tu contraseña?',
    rememberMe: 'Mantener sesión iniciada',
    noAccount: '¿No tienes cuenta?',
    createAccount: 'Crear cuenta nueva',
    alreadyHaveAccount: '¿Ya tienes cuenta?',
    backToLogin: 'Volver al inicio de sesión',
    verifyEmailTitle: 'Verifica tu Correo Electrónico',
    verifyEmailMessage: 'Hemos enviado un correo de verificación a tu dirección de email',
    verifyEmailButton: 'Reenviar Correo de Verificación',
    errors: {
      invalidCredentials: 'Credenciales inválidas',
      emailRequired: 'El correo electrónico es obligatorio',
      passwordRequired: 'La contraseña es obligatoria',
      passwordMismatch: 'Las contraseñas no coinciden',
      weakPassword: 'La contraseña es muy débil',
      emailExists: 'Este correo ya está registrado',
      invalidEmail: 'Por favor ingresa un email válido',
      displayNameRequired: 'El nombre es obligatorio',
      termsNotAccepted: 'Debes aceptar los términos y condiciones',
      tooManyAttempts: 'Demasiados intentos. Por favor espera antes de intentar de nuevo'
    },
    success: {
      loginSuccess: '¡Bienvenido de vuelta!',
      registerSuccess: '¡Cuenta creada exitosamente!',
      passwordResetEmailSent: 'Email de recuperación enviado',
      passwordResetSuccess: 'Contraseña actualizada exitosamente',
      emailVerificationSent: 'Correo de verificación enviado'
    }
  },
  
  // Sección común
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: '¡Éxito!',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    save: 'Guardar',
    edit: 'Editar',
    delete: 'Eliminar',
    view: 'Ver',
    search: 'Buscar',
    filter: 'Filtrar',
    sortBy: 'Ordenar por',
    actions: 'Acciones',
    noResults: 'No se encontraron resultados',
    required: 'Obligatorio',
    optional: 'Opcional',
    close: 'Cerrar',
    back: 'Atrás',
    next: 'Siguiente',
    finish: 'Finalizar'
  },
  
  // Sección de dashboard
  dashboard: {
    title: 'Panel Principal',
    welcome: 'Bienvenido, {{userName}}',
    summary: 'Resumen de actividad',
    recentActivity: 'Actividad reciente',
    statistics: 'Estadísticas',
    noActivity: 'No hay actividad reciente',
    quickActions: 'Acciones rápidas',
    viewAll: 'Ver todo',
    profile: 'Mi Perfil',
    settings: 'Configuración',
    logout: 'Cerrar Sesión',
    notifications: 'Notificaciones',
    noNotifications: 'No tienes notificaciones'
  },
  
  // Sección de errores
  errors: {
    pageNotFound: 'Página no encontrada',
    pageNotFoundMessage: 'La página que estás buscando no existe o ha sido movida',
    serverError: 'Error del servidor',
    serverErrorMessage: 'Ha ocurrido un error en el servidor. Por favor intenta más tarde',
    networkError: 'Error de conexión',
    networkErrorMessage: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
    accessDenied: 'Acceso denegado',
    accessDeniedMessage: 'No tienes permisos para acceder a esta página',
    sessionExpired: 'Sesión expirada',
    sessionExpiredMessage: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente',
    unexpectedError: 'Error inesperado',
    tryAgain: 'Intentar nuevamente',
    contactSupport: 'Contactar soporte'
  },
  
  // Sección de mensajes de éxito
  success: {
    operationSuccess: 'Operación completada con éxito',
    dataSaved: 'Datos guardados correctamente',
    profileUpdated: 'Perfil actualizado correctamente',
    settingsUpdated: 'Configuración actualizada correctamente',
    itemCreated: 'Elemento creado correctamente',
    itemUpdated: 'Elemento actualizado correctamente',
    itemDeleted: 'Elemento eliminado correctamente'
  },
  
  // Sección de validación
  validation: {
    required: 'Este campo es obligatorio',
    minLength: 'Este campo debe tener al menos {{min}} caracteres',
    maxLength: 'Este campo no puede tener más de {{max}} caracteres',
    invalidEmail: 'Por favor ingresa un email válido',
    invalidPassword: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
    invalidPhone: 'Por favor ingresa un número de teléfono válido',
    invalidUrl: 'Por favor ingresa una URL válida',
    invalidDate: 'Por favor ingresa una fecha válida',
    invalidNumber: 'Por favor ingresa un número válido',
    passwordsMustMatch: 'Las contraseñas deben coincidir'
  },
  
  // Sección de la aplicación
  app: {
    appName: 'LexBot Admin',
    appDescription: 'Panel de administración para LexBot',
    copyright: '© {{year}} LexBot. Todos los derechos reservados.',
    version: 'Versión {{version}}',
    poweredBy: 'Desarrollado por LexBot Team',
    termsOfService: 'Términos de Servicio',
    privacyPolicy: 'Política de Privacidad',
    cookiePolicy: 'Política de Cookies',
    help: 'Ayuda',
    support: 'Soporte',
    contactUs: 'Contáctanos',
    feedback: 'Enviar comentarios'
  }
};

/**
 * Función de interpolación para textos
 * @param text - Texto base con placeholders {{variable}}
 * @param variables - Objeto con variables para reemplazar
 * @returns Texto interpolado
 */
export const interpolateText = (text: string, variables: Record<string, any> = {}): string => {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, 'g'), String(value)),
    text
  );
};

/**
 * Obtiene un texto del sistema de textos por su ruta
 * @param path - Ruta al texto (ej: 'auth.loginTitle', 'common.loading')
 * @param variables - Variables para interpolación
 * @returns Texto interpolado
 */
export function getText(path: string, variables?: Record<string, any>): string {
  const parts = path.split('.');
  let result = TEXTS;
  
  for (const part of parts) {
    if (result[part] === undefined) {
      console.warn(`Text not found: ${path}`);
      return path;
    }
    result = result[part];
  }
  
  if (typeof result !== 'string') {
    console.warn(`Path does not point to a string: ${path}`);
    return path;
  }
  
  return variables ? interpolateText(result, variables) : result;
}
