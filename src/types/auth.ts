import { User as FirebaseUser } from 'firebase/auth';

// Extended User interface with additional properties
export interface User extends FirebaseUser {
  displayName: string;
  createdAt?: Date;
  lastLoginAt?: Date;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Registration data interface
export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  acceptTerms: boolean;
}

// Password reset data
export interface PasswordResetData {
  email: string;
}

// New password data for reset
export interface NewPasswordData {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Form validation state
export interface FormValidationState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
}

// Password strength levels
export enum PasswordStrength {
  WEAK = 'weak',
  FAIR = 'fair',
  GOOD = 'good',
  STRONG = 'strong'
}

// Password requirements
export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar?: boolean;
}

// Auth form types
export type AuthFormType = 'login' | 'register' | 'forgot-password' | 'reset-password';