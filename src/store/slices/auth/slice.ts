import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { AuthState, initialAuthState } from './types';
import { sessionService } from '../../../services';
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

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    // Clear specific error
    clearError: (state, action: PayloadAction<keyof AuthState['errors']>) => {
      state.errors[action.payload] = null;
    },
    
    // Clear all errors
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key as keyof AuthState['errors']] = null;
      });
    },
    
    // Clear specific success state
    clearSuccess: (state, action: PayloadAction<keyof AuthState['success']>) => {
      state.success[action.payload] = false;
    },
    
    // Clear all success states
    clearAllSuccess: (state) => {
      Object.keys(state.success).forEach(key => {
        state.success[key as keyof AuthState['success']] = false;
      });
    },
    
    // Set redirect path after login
    setRedirectAfterLogin: (state, action: PayloadAction<string | null>) => {
      state.ui.redirectAfterLogin = action.payload;
    },
    
    // Show/hide password reset success message
    setShowPasswordResetSuccess: (state, action: PayloadAction<boolean>) => {
      state.ui.showPasswordResetSuccess = action.payload;
    },
    
    // Show/hide email verification prompt
    setShowEmailVerificationPrompt: (state, action: PayloadAction<boolean>) => {
      state.ui.showEmailVerificationPrompt = action.payload;
    },
    
    // Update session activity
    updateSessionActivity: (state) => {
      state.sessionInfo.lastActivity = new Date().toISOString();
    },
    
    // Set general error
    setGeneralError: (state, action: PayloadAction<string | null>) => {
      state.errors.general = action.payload;
    },
    
    // Reset auth state (for testing or complete reset)
    resetAuthState: () => initialAuthState,

    // Set user and authentication state directly
    setAuth: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isInitialized = true;
    },
  },
  
  extraReducers: (builder) => {
    // Check Auth Status
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
        
        // Update session info if user exists
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

    // Login User
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

    // Register User
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading.register = true;
        state.errors.register = null;
        state.success.register = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.register = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.success.register = true;
        state.sessionInfo.rememberMe = action.payload.rememberMe;
        state.sessionInfo.lastActivity = new Date().toISOString();
        // Show email verification prompt for new users
        state.ui.showEmailVerificationPrompt = !action.payload.user.emailVerified;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.register = false;
        state.errors.register = action.payload as string;
        state.success.register = false;
      });

    // Logout User
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading.logout = true;
        state.errors.logout = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // Reset to initial state but keep initialization status
        const newState = { ...initialAuthState };
        newState.isInitialized = true;
        newState.success.logout = true;
        return newState;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading.logout = false;
        state.errors.logout = action.payload as string;
      });

    // Send Password Reset Email
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

    // Confirm Password Reset
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

    // Update User Profile
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

    // Send Email Verification
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

    // Refresh User Data
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

    // Extend Session
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