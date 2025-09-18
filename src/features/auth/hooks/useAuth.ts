import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import { LoginCredentials, NewPasswordData, PasswordResetData, RegisterData } from '../types';
import {
  selectUser, selectIsAuthenticated, selectIsInitialized, selectAuthStatus, selectIsLoginLoading,
  selectIsRegisterLoading, selectIsLogoutLoading, selectLoginError, selectRegisterError, selectLogoutError,
  selectLoginSuccess, selectRegisterSuccess, selectLogoutSuccess, selectSessionInfo, selectIsEmailVerified,
  clearError, clearSuccess, setRedirectAfterLogin,
  checkAuthStatus,loginUser, registerUser, logoutUser, sendPasswordResetEmail, confirmPasswordReset,
  updateUserProfile, sendEmailVerification, refreshUserData
} from '../../../core/store/slices/auth';

/**
 * Hook principal para manejo de autenticación
 * Proporciona todas las funciones y estados relacionados con auth
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();

  // Selectores de estado
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitialized = useAppSelector(selectIsInitialized);
  const authStatus = useAppSelector(selectAuthStatus);
  const sessionInfo = useAppSelector(selectSessionInfo);
  const isEmailVerified = useAppSelector(selectIsEmailVerified);

  // Selectores de loading
  const isLoginLoading = useAppSelector(selectIsLoginLoading);
  const isRegisterLoading = useAppSelector(selectIsRegisterLoading);
  const isLogoutLoading = useAppSelector(selectIsLogoutLoading);

  // Selectores de errores
  const loginError = useAppSelector(selectLoginError);
  const registerError = useAppSelector(selectRegisterError);
  const logoutError = useAppSelector(selectLogoutError);

  // Selectores de éxito
  const loginSuccess = useAppSelector(selectLoginSuccess);
  const registerSuccess = useAppSelector(selectRegisterSuccess);
  const logoutSuccess = useAppSelector(selectLogoutSuccess);

  // Funciones de autenticación memoizadas
  const login = useCallback(async (credentials: LoginCredentials) => {
    return await dispatch(loginUser(credentials));
  }, [dispatch]);

  const register = useCallback(async (userData: RegisterData) => {
    return await dispatch(registerUser(userData));
  }, [dispatch]);

  const logout = useCallback(async () => {
    return await dispatch(logoutUser());
  }, [dispatch]);

  const sendPasswordReset = useCallback(async (data: PasswordResetData) => {
    return await dispatch(sendPasswordResetEmail(data));
  }, [dispatch]);

  const confirmPasswordResetAction = useCallback(async (data: NewPasswordData) => {
    return await dispatch(confirmPasswordReset(data));
  }, [dispatch]);

  const updateProfile = useCallback(async (updates: { displayName?: string; photoURL?: string }) => {
    return await dispatch(updateUserProfile(updates));
  }, [dispatch]);

  const sendVerificationEmail = useCallback(async () => {
    return await dispatch(sendEmailVerification());
  }, [dispatch]);

  const refreshUser = useCallback(async () => {
    return await dispatch(refreshUserData());
  }, [dispatch]);

  const checkAuth = useCallback(async () => {
    // Solo ejecutar si no está inicializado
    if (!isInitialized) {
      return await dispatch(checkAuthStatus());
    }
  }, [dispatch, isInitialized]);

  // Funciones de limpieza
  const clearLoginError = useCallback(() => {
    dispatch(clearError('login'));
  }, [dispatch]);

  const clearRegisterError = useCallback(() => {
    dispatch(clearError('register'));
  }, [dispatch]);

  const clearLogoutError = useCallback(() => {
    dispatch(clearError('logout'));
  }, [dispatch]);

  const clearLoginSuccess = useCallback(() => {
    dispatch(clearSuccess('login'));
  }, [dispatch]);

  const clearRegisterSuccess = useCallback(() => {
    dispatch(clearSuccess('register'));
  }, [dispatch]);

  const clearLogoutSuccess = useCallback(() => {
    dispatch(clearSuccess('logout'));
  }, [dispatch]);

  // Función para establecer redirección
  const setRedirect = useCallback((path: string | null) => {
    dispatch(setRedirectAfterLogin(path));
  }, [dispatch]);

  // Datos computados
  const userDisplayName = user?.displayName || 'Usuario';
  const userEmail = user?.email || '';
  const userInitials = userDisplayName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return {
    // Estado del usuario
    user,
    userDisplayName,
    userEmail,
    userInitials,
    isAuthenticated,
    isInitialized,
    isEmailVerified,
    authStatus,
    sessionInfo,

    // Estados de loading
    isLoginLoading,
    isRegisterLoading,
    isLogoutLoading,
    isLoading: isLoginLoading || isRegisterLoading || isLogoutLoading,

    // Estados de error
    loginError,
    registerError,
    logoutError,
    hasError: !!(loginError || registerError || logoutError),

    // Estados de éxito
    loginSuccess,
    registerSuccess,
    logoutSuccess,
    hasSuccess: !!(loginSuccess || registerSuccess || logoutSuccess),

    // Funciones de autenticación
    login,
    register,
    logout,
    sendPasswordReset,
    confirmPasswordReset: confirmPasswordResetAction,
    updateProfile,
    sendVerificationEmail,
    refreshUser,
    checkAuth,

    // Funciones de limpieza
    clearLoginError,
    clearRegisterError,
    clearLogoutError,
    clearLoginSuccess,
    clearRegisterSuccess,
    clearLogoutSuccess,

    // Utilidades
    setRedirect,
  };
};