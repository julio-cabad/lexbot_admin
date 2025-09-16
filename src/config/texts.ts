export const TEXTS = {
  // Sección de autenticación
  auth: {
    loginTitle: 'Iniciar Sesión',
    loginButton: 'Acceder',
    emailPlaceholder: 'Correo Electrónico',
    passwordPlaceholder: 'Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    errors: {
      invalidCredentials: 'Credenciales inválidas',
      emailRequired: 'El correo electrónico es obligatorio'
    }
  },
  
  // Sección común
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito!'
  },
  
  // Interpolación de ejemplo
  welcomeMessage: 'Bienvenido, {{userName}}!'
};

/**
 * Función de interpolación para textos
 * @param text - Texto base con placeholders {{variable}}
 * @param variables - Objeto con variables para reemplazar
 * @returns Texto interpolado
 */
export const interpolateText = (text: string, variables: Record<string, string> = {}): string => {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, 'g'), value),
    text
  );
};
