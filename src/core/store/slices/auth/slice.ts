/**
 * Slice de autenticación
 * Integrado con el sistema de configuración
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { AuthState, initialAuthState } from './types';

import {
  checkAuthStatus,
  loginUser,
  registerUser,
  logoutUser,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateUserProfile,
  sendEmailVerification,
  refreshUserData,
  extendSession
} from './thunks';
import { sessionService } from '../../../services';

/**
 * Slice de Redux para gestionar la autenticación
 * - Incluye reducers para acciones síncronas
 * - Incluye extraReducers para acciones asíncronas (thunks)
 * - Integrado con el sistema de configuración centralizada
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    // Limpiar error específico
    clearError: (state, action: PayloadAction<keyof AuthState['errors']>) => {
      state.errors[action.payload] = null;
    },
    
    // Limpiar todos los errores
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key as keyof AuthState['errors']] = null;
      });
    },
    
    // Limpiar estado de éxito específico
    clearSuccess: (state, action: PayloadAction<keyof AuthState['success']>) => {
      state.success[action.payload] = false;
    },
    
    // Limpiar todos los estados de éxito
    clearAllSuccess: (state) => {
      Object.keys(state.success).forEach(key => {
        state.success[key as keyof AuthState['success']] = false;
      });
    },
    
    // Establecer ruta de redirección después del login
    setRedirectAfterLogin: (state, action: PayloadAction<string | null>) => {
      state.ui.redirectAfterLogin = action.payload;
    },
    
    // Mostrar/ocultar mensaje de éxito de restablecimiento de contraseña
    setShowPasswordResetSuccess: (state, action: PayloadAction<boolean>) => {
      state.ui.showPasswordResetSuccess = action.payload;
    },
    
    // Mostrar/ocultar prompt de verificación de correo electrónico
    setShowEmailVerificationPrompt: (state, action: PayloadAction<boolean>) => {
      state.ui.showEmailVerificationPrompt = action.payload;
    },
    
    // Actualizar actividad de sesión
    updateSessionActivity: (state) => {
      state.sessionInfo.lastActivity = new Date().toISOString();
    },
    
    // Establecer error general
    setGeneralError: (state, action: PayloadAction<string | null>) => {
      state.errors.general = action.payload;
    },
    
    // Restablecer estado de autenticación (para pruebas o restablecimiento completo)
    resetAuthState: () => initialAuthState,

    // Establecer usuario y estado de autenticación directamente
    setAuth: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isInitialized = true;
    },
  },
  
  extraReducers: (builder) => {
    // Verificar estado de autenticación
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading.checkAuth = true;
        state.errors.general = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading.checkAuth = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isInitialized = true;
        
        // Actualizar información de sesión si existe usuario
        if (action.payload) {
          const sessionInfo = sessionService.getSessionInfo();
          state.sessionInfo = {
            rememberMe: sessionInfo.isPersistent,
            lastActivity: sessionInfo.lastActivity?.toISOString() || null,
            expiresAt: sessionInfo.expiresAt?.toISOString() || null,
          };
        }
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading.checkAuth = false;
        state.errors.general = action.payload as string;
        state.isInitialized = true;
      });

    // Iniciar sesión de usuario
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading.login = true;
        state.errors.login = null;
        state.success.login = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.login = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.success.login = true;
        state.sessionInfo.rememberMe = action.payload.rememberMe;
        state.sessionInfo.lastActivity = new Date().toISOString();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.login = false;
        state.errors.login = action.payload as string;
        state.success.login = false;
      });

    // Registrar usuario
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading.register = true;
        state.errors.register = null;
        state.success.register = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.register = false;
        // No establecer usuario ni autenticación - el usuario debe hacer login
        state.user = null;
        state.isAuthenticated = false;
        state.success.register = true;
        // Limpiar información de sesión
        state.sessionInfo = {
          rememberMe: false,
          lastActivity: null,
          expiresAt: null,
        };
        // No mostrar prompt de verificación ya que no está autenticado
        state.ui.showEmailVerificationPrompt = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.register = false;
        state.errors.register = action.payload as string;
        state.success.register = false;
      });

    // Cerrar sesión de usuario
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading.logout = true;
        state.errors.logout = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // Restablecer a estado inicial pero mantener estado de inicialización
        const newState = { ...initialAuthState };
        newState.isInitialized = true;
        newState.success.logout = true;
        return newState;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading.logout = false;
        state.errors.logout = action.payload as string;
      });

    // Enviar correo de restablecimiento de contraseña
    builder
      .addCase(sendPasswordResetEmail.pending, (state) => {
        state.loading.forgotPassword = true;
        state.errors.forgotPassword = null;
        state.success.forgotPassword = false;
      })
      .addCase(sendPasswordResetEmail.fulfilled, (state) => {
        state.loading.forgotPassword = false;
        state.success.forgotPassword = true;
        state.ui.showPasswordResetSuccess = true;
      })
      .addCase(sendPasswordResetEmail.rejected, (state, action) => {
        state.loading.forgotPassword = false;
        state.errors.forgotPassword = action.payload as string;
        state.success.forgotPassword = false;
      });

    // Confirmar restablecimiento de contraseña
    builder
      .addCase(confirmPasswordReset.pending, (state) => {
        state.loading.resetPassword = true;
        state.errors.resetPassword = null;
        state.success.resetPassword = false;
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.loading.resetPassword = false;
        state.success.resetPassword = true;
      })
      .addCase(confirmPasswordReset.rejected, (state, action) => {
        state.loading.resetPassword = false;
        state.errors.resetPassword = action.payload as string;
        state.success.resetPassword = false;
      });

    // Actualizar perfil de usuario
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading.updateProfile = true;
        state.errors.updateProfile = null;
        state.success.updateProfile = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading.updateProfile = false;
        state.user = action.payload;
        state.success.updateProfile = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading.updateProfile = false;
        state.errors.updateProfile = action.payload as string;
        state.success.updateProfile = false;
      });

    // Enviar verificación de correo electrónico
    builder
      .addCase(sendEmailVerification.pending, (state) => {
        state.loading.emailVerification = true;
        state.errors.emailVerification = null;
        state.success.emailVerification = false;
      })
      .addCase(sendEmailVerification.fulfilled, (state) => {
        state.loading.emailVerification = false;
        state.success.emailVerification = true;
      })
      .addCase(sendEmailVerification.rejected, (state, action) => {
        state.loading.emailVerification = false;
        state.errors.emailVerification = action.payload as string;
        state.success.emailVerification = false;
      });

    // Refrescar datos de usuario
    builder
      .addCase(refreshUserData.pending, (state) => {
        state.loading.checkAuth = true;
      })
      .addCase(refreshUserData.fulfilled, (state, action) => {
        state.loading.checkAuth = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(refreshUserData.rejected, (state, action) => {
        state.loading.checkAuth = false;
        state.errors.general = action.payload as string;
      });

    // Extender sesión
    builder
      .addCase(extendSession.fulfilled, (state, action) => {
        state.sessionInfo.expiresAt = action.payload.expiresAt;
        state.sessionInfo.lastActivity = action.payload.lastActivity;
      });
  },
});

export const {
  clearError,
  clearAllErrors,
  clearSuccess,
  clearAllSuccess,
  setRedirectAfterLogin,
  setShowPasswordResetSuccess,
  setShowEmailVerificationPrompt,
  updateSessionActivity,
  setGeneralError,
  resetAuthState,
  setAuth,
} = authSlice.actions;

export default authSlice.reducer;
