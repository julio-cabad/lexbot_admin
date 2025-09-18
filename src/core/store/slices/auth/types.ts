/**
 * Tipos para el slice de autenticación
 * Integrados con el sistema de configuración
 */
import { User } from '../../../../features/auth/types';

/**
 * Estado del slice de autenticación
 */
export interface AuthState {
  // Datos del usuario
  user: User | null;
  
  // Estados de carga para diferentes operaciones
  loading: {
    login: boolean;
    register: boolean;
    logout: boolean;
    forgotPassword: boolean;
    resetPassword: boolean;
    updateProfile: boolean;
    emailVerification: boolean;
    checkAuth: boolean;
  };
  
  // Estados de error para diferentes operaciones
  errors: {
    login: string | null;
    register: string | null;
    logout: string | null;
    forgotPassword: string | null;
    resetPassword: string | null;
    updateProfile: string | null;
    emailVerification: string | null;
    general: string | null;
  };
  
  // Estados de éxito para diferentes operaciones
  success: {
    login: boolean;
    register: boolean;
    logout: boolean;
    forgotPassword: boolean;
    resetPassword: boolean;
    updateProfile: boolean;
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
  loading: {
    login: false,
    register: false,
    logout: false,
    forgotPassword: false,
    resetPassword: false,
    updateProfile: false,
    emailVerification: false,
    checkAuth: true, // Comienza como true ya que verificamos la autenticación al cargar la app
  },
  errors: {
    login: null,
    register: null,
    logout: null,
    forgotPassword: null,
    resetPassword: null,
    updateProfile: null,
    emailVerification: null,
    general: null,
  },
  success: {
    login: false,
    register: false,
    logout: false,
    forgotPassword: false,
    resetPassword: false,
    updateProfile: false,
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
