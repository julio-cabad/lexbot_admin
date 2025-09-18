/**
 * Tipos específicos para la funcionalidad de autenticación
 */

// Credenciales de inicio de sesión
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Datos de registro
export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  displayName?: string; // Opcional
}

// Datos para recuperación de contraseña
export interface PasswordResetData {
  email: string;
}

// Datos para nueva contraseña
export interface NewPasswordData {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

// Tipos de formularios de autenticación
export type AuthFormType = 'login' | 'register' | 'forgot-password' | 'reset-password';

// Error de validación
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Definir el tipo User directamente aquí
import { User as FirebaseUser } from 'firebase/auth';

// Extended User interface with additional properties
export interface User extends FirebaseUser {
  // No redefinimos displayName para mantener la compatibilidad con FirebaseUser
  // donde displayName es string | null
  createdAt?: Date;
  lastLoginAt?: Date;
}
