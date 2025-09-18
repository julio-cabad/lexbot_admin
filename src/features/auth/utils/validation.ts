/**
 * Validaciones específicas para la funcionalidad de autenticación
 */
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword, 
  validateDisplayName, 
  validateTermsAcceptance
} from '../../../core/utils/validation';
import { 
  LoginCredentials, 
  RegisterData, 
  PasswordResetData, 
  NewPasswordData,
  ValidationError 
} from '../types';
import { ERROR_MESSAGES } from '../../../core/utils/constants';

/**
 * Validación de formulario de login
 */
export const validateLoginForm = (data: LoginCredentials): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError, value: data.email });
  }
  
  if (!data.password) {
    errors.push({ field: 'password', message: ERROR_MESSAGES.REQUIRED_FIELD });
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
 * Convierte errores de validación a objeto de errores de formulario
 */
export const validationErrorsToFormErrors = (errors: ValidationError[]): Record<string, string> => {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
};
