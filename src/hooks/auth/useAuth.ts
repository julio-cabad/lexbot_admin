import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../common/useRedux';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsInitialized,
  selectAuthStatus,
  selectIsLoginLoading,
  selectIsRegisterLoading,
  selectIsLogoutLoading,
  selectLoginError,
  selectRegisterError,
  selectLogoutError,
  selectLoginSuccess,
  selectRegisterSuccess,
  selectLogoutSuccess,
  selectSessionInfo,
  selectIsEmailVerified,
  loginUser,
  registerUser,
  logoutUser,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updateUserProfile,
  sendEmailVerification,
  refreshUserData,
  checkAuthStatus,
  clearError,
  clearSuccess,
  setRedirectAfterLogin
} from '../../store';
import { LoginCredentials, RegisterData, PasswordResetData, NewPasswordData } from '../../types';

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

  // Funciones de autenticación
  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await dispatch(loginUser(credentials));
    return result;
  }, [dispatch]);

  const register = useCallback(async (userData: RegisterData) => {
    const result = await dispatch(registerUser(userData));
    return result;
  }, [dispatch]);

  const logout = useCallback(async () => {
    const result = await dispatch(logoutUser());
    return result;
  }, [dispatch]);

  const sendPasswordReset = useCallback(async (data: PasswordResetData) => {
    const result = await dispatch(sendPasswordResetEmail(data));
    return result;
  }, [dispatch]);

  const confirmPasswordResetAction = useCallback(async (data: NewPasswordData) => {
    const result = await dispatch(confirmPasswordReset(data));
    return result;
  }, [dispatch]);

  const updateProfile = useCallback(async (updates: { displayName?: string; photoURL?: string }) => {
    const result = await dispatch(updateUserProfile(updates));
    return result;
  }, [dispatch]);

  const sendVerificationEmail = useCallback(async () => {
    const result = await dispatch(sendEmailVerification());
    return result;
  }, [dispatch]);

  const refreshUser = useCallback(async () => {
    const result = await dispatch(refreshUserData());
    return result;
  }, [dispatch]);

  const checkAuth = useCallback(async () => {
    const result = await dispatch(checkAuthStatus());
    return result;
  }, [dispatch]);

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