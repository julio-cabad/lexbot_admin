import { User } from 'firebase/auth';

// Auth slice state interface
export interface AuthState {
  // User data
  user: User | null;
  
  // Loading states for different operations
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
  
  // Error states for different operations
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
  
  // Success states for different operations
  success: {
    login: boolean;
    register: boolean;
    logout: boolean;
    forgotPassword: boolean;
    resetPassword: boolean;
    updateProfile: boolean;
    emailVerification: boolean;
  };
  
  // Authentication status
  isAuthenticated: boolean;
  isInitialized: boolean;
  
  // Session info
  sessionInfo: {
    rememberMe: boolean;
    lastActivity: string | null;
    expiresAt: string | null;
  };
  
  // UI states
  ui: {
    showPasswordResetSuccess: boolean;
    showEmailVerificationPrompt: boolean;
    redirectAfterLogin: string | null;
  };
}

// Initial state
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
    checkAuth: true, // Start as true since we check auth on app load
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