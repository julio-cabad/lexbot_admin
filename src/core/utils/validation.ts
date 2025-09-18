/**
 * Utilidades de validación para formularios
 * Integradas con el sistema de configuración
 */
import { 
  VALIDATION_PATTERNS, 
  AUTH_CONSTANTS, 
  ERROR_MESSAGES 
} from './constants';
import { 
  LoginCredentials, 
  RegisterData, 
  PasswordResetData, 
  NewPasswordData,
  PasswordStrength,
  PasswordRequirements,
  ValidationError 
} from '../../types';

/**
 * Validación de email
 */
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }
  
  return null;
};

/**
 * Validación de contraseña
 */
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  if (password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
    return ERROR_MESSAGES.INVALID_PASSWORD;
  }
  
  if (!VALIDATION_PATTERNS.PASSWORD.test(password)) {
    return ERROR_MESSAGES.INVALID_PASSWORD;
  }
  
  return null;
};

/**
 * Validación de nombre de usuario
 */
export const validateDisplayName = (displayName: string): string | null => {
  if (!displayName.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  if (displayName.trim().length < AUTH_CONSTANTS.DISPLAY_NAME_MIN_LENGTH) {
    return ERROR_MESSAGES.DISPLAY_NAME_TOO_SHORT;
  }
  
  if (displayName.trim().length > AUTH_CONSTANTS.DISPLAY_NAME_MAX_LENGTH) {
    return ERROR_MESSAGES.DISPLAY_NAME_TOO_LONG;
  }
  
  if (!VALIDATION_PATTERNS.NAME.test(displayName.trim())) {
    return 'El nombre solo puede contener letras y espacios';
  }
  
  return null;
};

/**
 * Validación de confirmación de contraseña
 */
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
  }
  
  return null;
};

/**
 * Validación de aceptación de términos
 */
export const validateTermsAcceptance = (accepted: boolean): string | null => {
  if (!accepted) {
    return ERROR_MESSAGES.TERMS_NOT_ACCEPTED;
  }
  
  return null;
};

/**
 * Verificador de fortaleza de contraseña
 */
export const checkPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return PasswordStrength.WEAK;
  
  const requirements = getPasswordRequirements(password);
  const score = Object.values(requirements).filter(Boolean).length;
  
  if (score < 2) return PasswordStrength.WEAK;
  if (score < 3) return PasswordStrength.FAIR;
  if (score < 4) return PasswordStrength.GOOD;
  return PasswordStrength.STRONG;
};

/**
 * Obtiene el estado de los requisitos de contraseña
 */
export const getPasswordRequirements = (password: string): PasswordRequirements => {
  return {
    minLength: password.length >= AUTH_CONSTANTS.PASSWORD_MIN_LENGTH,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password)
  };
};

/**
 * Validación de formulario de login
 */
export const validateLoginForm = (credentials: LoginCredentials): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(credentials.email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError, value: credentials.email });
  }
  
  const passwordError = validatePassword(credentials.password);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }
  
  return errors;
};

/**
 * Validación de formulario de registro
 */
export const validateRegisterForm = (data: RegisterData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError, value: data.email });
  }
  
  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }
  
  const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmPasswordError) {
    errors.push({ field: 'confirmPassword', message: confirmPasswordError });
  }
  
  // Validar displayName solo si está presente
  if (data.displayName !== undefined) {
    const displayNameError = validateDisplayName(data.displayName);
    if (displayNameError) {
      errors.push({ field: 'displayName', message: displayNameError, value: data.displayName });
    }
  }
  
  const termsError = validateTermsAcceptance(data.acceptTerms);
  if (termsError) {
    errors.push({ field: 'acceptTerms', message: termsError });
  }
  
  return errors;
};

/**
 * Validación de formulario de recuperación de contraseña
 */
export const validatePasswordResetForm = (data: PasswordResetData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError, value: data.email });
  }
  
  return errors;
};

/**
 * Validación de formulario de nueva contraseña
 */
export const validateNewPasswordForm = (data: NewPasswordData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.code.trim()) {
    errors.push({ field: 'code', message: ERROR_MESSAGES.REQUIRED_FIELD });
  }
  
  const passwordError = validatePassword(data.newPassword);
  if (passwordError) {
    errors.push({ field: 'newPassword', message: passwordError });
  }
  
  const confirmPasswordError = validateConfirmPassword(data.newPassword, data.confirmPassword);
  if (confirmPasswordError) {
    errors.push({ field: 'confirmPassword', message: confirmPasswordError });
  }
  
  return errors;
};

/**
 * Validación genérica de campos
 */
export const validateField = (fieldName: string, value: any, rules?: any): string | null => {
  switch (fieldName) {
    case 'email':
      return validateEmail(value);
    case 'password':
      return validatePassword(value);
    case 'displayName':
      return validateDisplayName(value);
    case 'confirmPassword':
      return validateConfirmPassword(rules?.password || '', value);
    case 'acceptTerms':
      return validateTermsAcceptance(value);
    default:
      return null;
  }
};

/**
 * Verifica si un formulario tiene errores
 */
export const hasValidationErrors = (errors: ValidationError[]): boolean => {
  return errors.length > 0;
};

/**
 * Convierte errores de validación a objeto de errores de formulario
 */
export const validationErrorsToFormErrors = (errors: ValidationError[]): Record<string, string> => {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Valida un objeto completo usando un esquema de validación
 */
export const validateObject = <T extends Record<string, any>>(
  object: T,
  schema: Record<keyof T, (value: any, object?: T) => string | null>
): Record<keyof T, string | null> => {
  const errors: Partial<Record<keyof T, string | null>> = {};
  
  for (const key in schema) {
    if (schema.hasOwnProperty(key)) {
      const error = schema[key](object[key], object);
      if (error) {
        errors[key] = error;
      }
    }
  }
  
  return errors as Record<keyof T, string | null>;
};
