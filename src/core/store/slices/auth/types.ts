/**
 * Tipos para el slice de autenticación
 * 🏛️ EXPANDIDO PARA INCLUIR PERFIL DE USUARIO
 */
import { User, UserProfile } from '../../../../features/auth/types';

/**
 * Estado del slice de autenticación
 */
export interface AuthState {
  // Datos del usuario
  user: User | null;
  
  // 👑 PERFIL COMPLETO DEL USUARIO EN FIRESTORE
  userProfile: UserProfile | null;
  
  // Estados de carga para diferentes operaciones
  loading: {
    login: boolean;
    register: boolean;
    logout: boolean;
    forgotPassword: boolean;
    resetPassword: boolean;
    updateProfile: boolean;
    updateProfileFirestore: boolean; // ⚡ NUEVO: Actualizar perfil en Firestore
    emailVerification: boolean;
    checkAuth: boolean;
    loadProfile: boolean; // 🔥 NUEVO: Carga del perfil
  };
  
  // Estados de error para diferentes operaciones
  errors: {
    login: string | null;
    register: string | null;
    logout: string | null;
    forgotPassword: string | null;
    resetPassword: string | null;
    updateProfile: string | null;
    updateProfileFirestore: string | null; // ⚡ NUEVO: Error al actualizar perfil en Firestore
    emailVerification: string | null;
    general: string | null;
    loadProfile: string | null; // 🔥 NUEVO: Error al cargar perfil
  };
  
  // Estados de éxito para diferentes operaciones
  success: {
    login: boolean;
    register: boolean;
    logout: boolean;
    forgotPassword: boolean;
    resetPassword: boolean;
    updateProfile: boolean;
    updateProfileFirestore: boolean; // ⚡ NUEVO: Éxito al actualizar perfil en Firestore
    emailVerification: boolean;
  };
  
  // Estado de autenticación
  isAuthenticated: boolean;
  isInitialized: boolean;
  
  // Información de sesión
  sessionInfo: {
    rememberMe: boolean;
    lastActivity: string | null;
    expiresAt: string | null;
  };
  
  // Estados de UI
  ui: {
    showPasswordResetSuccess: boolean;
    showEmailVerificationPrompt: boolean;
    redirectAfterLogin: string | null;
  };
}

/**
 * Estado inicial para el slice de autenticación
 * Utiliza valores de la configuración centralizada
 */
export const initialAuthState: AuthState = {
  user: null,
  userProfile: null, // 👑 NUEVO: Perfil inicialmente nulo
  loading: {
    login: false,
    register: false,
    logout: false,
    forgotPassword: false,
    resetPassword: false,
    updateProfile: false,
    updateProfileFirestore: false, // ⚡ NUEVO: Estado de carga de actualización de perfil en Firestore
    emailVerification: false,
    checkAuth: true, // Comienza como true ya que verificamos la autenticación al cargar la app
    loadProfile: false, // 🔥 NUEVO: Estado de carga del perfil
  },
  errors: {
    login: null,
    register: null,
    logout: null,
    forgotPassword: null,
    resetPassword: null,
    updateProfile: null,
    updateProfileFirestore: null, // ⚡ NUEVO: Error al actualizar perfil en Firestore
    emailVerification: null,
    general: null,
    loadProfile: null, // 🔥 NUEVO: Error del perfil
  },
  success: {
    login: false,
    register: false,
    logout: false,
    forgotPassword: false,
    resetPassword: false,
    updateProfile: false,
    updateProfileFirestore: false, // ⚡ NUEVO: Éxito al actualizar perfil en Firestore
    emailVerification: false,
  },
  isAuthenticated: false,
  isInitialized: false,
  sessionInfo: {
    rememberMe: false,
    lastActivity: null,
    expiresAt: null,
  },
  ui: {
    showPasswordResetSuccess: false,
    showEmailVerificationPrompt: false,
    redirectAfterLogin: null,
  },
};
