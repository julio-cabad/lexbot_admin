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
} from '../types';

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }
  
  return null;
};

// Password validation
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

// Display name validation
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

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
  }
  
  return null;
};

// Terms acceptance validation
export const validateTermsAcceptance = (accepted: boolean): string | null => {
  if (!accepted) {
    return ERROR_MESSAGES.TERMS_NOT_ACCEPTED;
  }
  
  return null;
};

// Password strength checker
export const checkPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return PasswordStrength.WEAK;
  
  const requirements = getPasswordRequirements(password);
  const score = Object.values(requirements).filter(Boolean).length;
  
  if (score < 2) return PasswordStrength.WEAK;
  if (score < 3) return PasswordStrength.FAIR;
  if (score < 4) return PasswordStrength.GOOD;
  return PasswordStrength.STRONG;
};

// Get password requirements status
export const getPasswordRequirements = (password: string): PasswordRequirements => {
  return {
    minLength: password.length >= AUTH_CONSTANTS.PASSWORD_MIN_LENGTH,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password)
  };
};

// Login form validation
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

// Register form validation
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
  
  const displayNameError = validateDisplayName(data.displayName);
  if (displayNameError) {
    errors.push({ field: 'displayName', message: displayNameError, value: data.displayName });
  }
  
  const termsError = validateTermsAcceptance(data.acceptTerms);
  if (termsError) {
    errors.push({ field: 'acceptTerms', message: termsError });
  }
  
  return errors;
};

// Password reset form validation
export const validatePasswordResetForm = (data: PasswordResetData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError, value: data.email });
  }
  
  return errors;
};

// New password form validation
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

// Generic field validation
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

// Check if form has errors
export const hasValidationErrors = (errors: ValidationError[]): boolean => {
  return errors.length > 0;
};

// Convert validation errors to form error object
export const validationErrorsToFormErrors = (errors: ValidationError[]): Record<string, string> => {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
};