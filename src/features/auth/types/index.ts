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
export type AuthFormType =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password";

// Error de validación
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Definir el tipo User directamente aquí
import { User as FirebaseUser } from "firebase/auth";

// Extended User interface with additional properties
export interface User extends FirebaseUser {
  // No redefinimos displayName para mantener la compatibilidad con FirebaseUser
  // donde displayName es string | null
  createdAt?: Date;
  lastLoginAt?: Date;
}

// ========================================
// 🏛️ TIPOS PARA PERFIL DE USUARIO
// ========================================

// Roles disponibles en el sistema
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator",
  GUEST = "guest",
}

// Ciudades disponibles (expandir según necesidad)
export enum Ciudad {
  BOGOTA = "bogota",
  MEDELLIN = "medellin",
  CALI = "cali",
  BARRANQUILLA = "barranquilla",
  CARTAGENA = "cartagena",
  BUCARAMANGA = "bucaramanga",
  PEREIRA = "pereira",
  MANIZALES = "manizales",
  OTRA = "otra",
}

// Perfil completo del usuario en Firestore
export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | string;
  phone: string;
  city: Ciudad | string;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Datos para crear perfil de usuario (sin campos auto-generados)
export interface CreateUserProfileData {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole | string;
  phone?: string;
  city?: Ciudad | string;
}

// Datos para actualizar perfil (todos opcionales excepto los requeridos)
export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  role?: UserRole | string;
  phone?: string;
  city?: Ciudad | string;
  isComplete?: boolean;
}

// Datos del formulario de completar perfil
export interface CompleteProfileData {
  firstName: string;
  lastName: string;
  role: UserRole | string;
  phone: string;
  city: Ciudad | string;
}

// Importar los tipos genéricos de Firestore desde la ubicación centralizada
import { 
  BaseDocument,
  QueryFilter,
  QueryOptions,
  FirestoreResult,
  FirestoreQueryResult
} from '../../../types/firestore';

// Re-exportar para mantener compatibilidad con código existente
export type {
  BaseDocument,
  QueryFilter,
  QueryOptions,
  FirestoreResult,
  FirestoreQueryResult
};
