/**
 * Selectores para el slice de autenticación
 * Optimizados con memoización
 */
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { AuthState } from './types';

// Selector base de autenticación
// Forzamos el tipo para evitar errores de TypeScript
const selectAuth = (state: RootState) => state.auth as AuthState;

// Selectores de usuario
export const selectUser = createSelector(
  [selectAuth],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated
);

export const selectIsInitialized = createSelector(
  [selectAuth],
  (auth) => auth.isInitialized
);

export const selectUserDisplayName = createSelector(
  [selectUser],
  (user) => user?.displayName || 'Usuario'
);

export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email || ''
);

export const selectIsEmailVerified = createSelector(
  [selectUser],
  (user) => user?.emailVerified || false
);

export const selectUserPhotoURL = createSelector(
  [selectUser],
  (user) => user?.photoURL || null
);

// Selectores de carga
export const selectAuthLoading = createSelector(
  [selectAuth],
  (auth) => auth.loading
);

export const selectIsLoginLoading = createSelector(
  [selectAuthLoading],
  (loading) => loading.login
);

export const selectIsRegisterLoading = createSelector(
  [selectAuthLoading],
  (loading) => loading.register
);

export const selectIsLogoutLoading = createSelector(
  [selectAuthLoading],
  (loading) => loading.logout
);

export const selectIsForgotPasswordLoading = createSelector(
  [selectAuthLoading],
  (loading) => loading.forgotPassword
);

export const selectIsResetPasswordLoading = createSelector(
  [selectAuthLoading],
  (loading) => loading.resetPassword
);

export const selectIsUpdateProfileLoading = createSelector(
  [selectAuthLoading],
  (loading) => loading.updateProfile
);

export const selectIsEmailVerificationLoading = createSelector(
  [selectAuthLoading],
  (loading) => loading.emailVerification
);

export const selectIsCheckAuthLoading = createSelector(
  [selectAuthLoading],
  (loading) => loading.checkAuth
);

// Selector de cualquier carga
export const selectIsAnyAuthLoading = createSelector(
  [selectAuthLoading],
  (loading) => Object.values(loading).some(Boolean)
);

// Selectores de errores
export const selectAuthErrors = createSelector(
  [selectAuth],
  (auth) => auth.errors
);

export const selectLoginError = createSelector(
  [selectAuthErrors],
  (errors) => errors.login
);

export const selectRegisterError = createSelector(
  [selectAuthErrors],
  (errors) => errors.register
);

export const selectLogoutError = createSelector(
  [selectAuthErrors],
  (errors) => errors.logout
);

export const selectForgotPasswordError = createSelector(
  [selectAuthErrors],
  (errors) => errors.forgotPassword
);

export const selectResetPasswordError = createSelector(
  [selectAuthErrors],
  (errors) => errors.resetPassword
);

export const selectUpdateProfileError = createSelector(
  [selectAuthErrors],
  (errors) => errors.updateProfile
);

export const selectEmailVerificationError = createSelector(
  [selectAuthErrors],
  (errors) => errors.emailVerification
);

export const selectGeneralError = createSelector(
  [selectAuthErrors],
  (errors) => errors.general
);

// Selector de cualquier error
export const selectHasAnyAuthError = createSelector(
  [selectAuthErrors],
  (errors) => Object.values(errors).some(Boolean)
);

// Selectores de éxito
export const selectAuthSuccess = createSelector(
  [selectAuth],
  (auth) => auth.success
);

export const selectLoginSuccess = createSelector(
  [selectAuthSuccess],
  (success) => success.login
);

export const selectRegisterSuccess = createSelector(
  [selectAuthSuccess],
  (success) => success.register
);

export const selectLogoutSuccess = createSelector(
  [selectAuthSuccess],
  (success) => success.logout
);

export const selectForgotPasswordSuccess = createSelector(
  [selectAuthSuccess],
  (success) => success.forgotPassword
);

export const selectResetPasswordSuccess = createSelector(
  [selectAuthSuccess],
  (success) => success.resetPassword
);

export const selectUpdateProfileSuccess = createSelector(
  [selectAuthSuccess],
  (success) => success.updateProfile
);

export const selectEmailVerificationSuccess = createSelector(
  [selectAuthSuccess],
  (success) => success.emailVerification
);

// Selectores de sesión
export const selectSessionInfo = createSelector(
  [selectAuth],
  (auth) => auth.sessionInfo
);

export const selectIsRememberMeEnabled = createSelector(
  [selectSessionInfo],
  (sessionInfo) => sessionInfo.rememberMe
);

export const selectLastActivity = createSelector(
  [selectSessionInfo],
  (sessionInfo) => sessionInfo.lastActivity ? new Date(sessionInfo.lastActivity) : null
);

export const selectSessionExpiresAt = createSelector(
  [selectSessionInfo],
  (sessionInfo) => sessionInfo.expiresAt ? new Date(sessionInfo.expiresAt) : null
);

// Selectores de UI
export const selectAuthUI = createSelector(
  [selectAuth],
  (auth) => auth.ui
);

export const selectShowPasswordResetSuccess = createSelector(
  [selectAuthUI],
  (ui) => ui.showPasswordResetSuccess
);

export const selectShowEmailVerificationPrompt = createSelector(
  [selectAuthUI],
  (ui) => ui.showEmailVerificationPrompt
);

export const selectRedirectAfterLogin = createSelector(
  [selectAuthUI],
  (ui) => ui.redirectAfterLogin
);

// Selectores calculados
export const selectUserInitials = createSelector(
  [selectUserDisplayName],
  (displayName) => {
    return displayName
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
);

export const selectIsSessionExpired = createSelector(
  [selectSessionExpiresAt, selectIsAuthenticated],
  (expiresAt, isAuthenticated) => {
    if (!isAuthenticated || !expiresAt) return false;
    return new Date() > expiresAt;
  }
);

export const selectSessionTimeRemaining = createSelector(
  [selectSessionExpiresAt, selectIsAuthenticated],
  (expiresAt, isAuthenticated) => {
    if (!isAuthenticated || !expiresAt) return null;
    const now = new Date();
    const remaining = expiresAt.getTime() - now.getTime();
    return remaining > 0 ? remaining : 0;
  }
);

// Selector de estado de autenticación para enrutamiento
export const selectAuthStatus = createSelector(
  [selectIsAuthenticated, selectIsInitialized, selectIsCheckAuthLoading],
  (isAuthenticated, isInitialized, isLoading) => ({
    isAuthenticated,
    isInitialized,
    isLoading,
    canRender: isInitialized && !isLoading
  })
);
