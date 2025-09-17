/**
 * Exportaciones centralizadas para el slice de autenticación
 */

// Exportar tipos
export * from './types';

// Exportar selectores
export * from './selectors';

// Nota: Las siguientes exportaciones se implementarán cuando
// se completen los archivos correspondientes

// Stub temporal para el reducer de autenticación
import { AuthState, initialAuthState } from './types';
export const authReducer = (state: AuthState = initialAuthState, _action: any) => state;

// Stubs temporales para las acciones
export const clearError = (field: string) => ({ type: 'auth/clearError', payload: field });
export const clearAllErrors = () => ({ type: 'auth/clearAllErrors' });
export const clearSuccess = (field: string) => ({ type: 'auth/clearSuccess', payload: field });
export const clearAllSuccess = () => ({ type: 'auth/clearAllSuccess' });
export const setRedirectAfterLogin = (path: string | null) => ({ type: 'auth/setRedirectAfterLogin', payload: path });
export const setShowPasswordResetSuccess = (show: boolean) => ({ type: 'auth/setShowPasswordResetSuccess', payload: show });
export const setShowEmailVerificationPrompt = (show: boolean) => ({ type: 'auth/setShowEmailVerificationPrompt', payload: show });
export const updateSessionActivity = () => ({ type: 'auth/updateSessionActivity' });
export const setGeneralError = (error: string | null) => ({ type: 'auth/setGeneralError', payload: error });
export const resetAuthState = () => ({ type: 'auth/resetAuthState' });
export const setAuth = (user: any | null) => ({ type: 'auth/setAuth', payload: user });

// Stubs temporales para los thunks
export const checkAuthStatus = () => ({ type: 'auth/checkAuthStatus' });
export const loginUser = (credentials: any) => ({ type: 'auth/loginUser', payload: credentials });
export const registerUser = (data: any) => ({ type: 'auth/registerUser', payload: data });
export const logoutUser = () => ({ type: 'auth/logoutUser' });
export const sendPasswordResetEmail = (data: any) => ({ type: 'auth/sendPasswordResetEmail', payload: data });
export const confirmPasswordReset = (data: any) => ({ type: 'auth/confirmPasswordReset', payload: data });
export const updateUserProfile = (updates: any) => ({ type: 'auth/updateUserProfile', payload: updates });
export const sendEmailVerification = () => ({ type: 'auth/sendEmailVerification' });
export const refreshUserData = () => ({ type: 'auth/refreshUserData' });
export const extendSession = () => ({ type: 'auth/extendSession' });
