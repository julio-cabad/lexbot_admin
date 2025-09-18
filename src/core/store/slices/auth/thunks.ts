/**
 * Thunks para el slice de autenticación
 * Integrados con el sistema de configuración
 */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User, UserCredential } from "firebase/auth";
import {
  LoginCredentials,
  RegisterData,
  PasswordResetData,
  NewPasswordData,
} from "../../../../features/auth/types";

import { getText } from "../../../../config/texts";
import { authService, errorService, sessionService } from "../../../services";

/**
 * Thunk para verificar el estado de autenticación al cargar la aplicación
 */
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      return new Promise<User | null>((resolve) => {
        const unsubscribe = authService.onAuthStateChange((user) => {
          unsubscribe();
          resolve(user);
        });
      });
    } catch (error) {
      errorService.logError(error as Error, "checkAuthStatus");
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Thunk para iniciar sesión de usuario
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const userCredential: UserCredential = await authService.login(
        credentials
      );

      // Guardar datos de sesión
      sessionService.saveUserSession(
        userCredential.user,
        credentials.rememberMe || false
      );

      errorService.logInfo(getText("auth.success.loginSuccess"), "loginUser");

      return {
        user: userCredential.user,
        rememberMe: credentials.rememberMe || false,
      };
    } catch (error) {
      errorService.logError(error as Error, "loginUser");
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Thunk para registro de usuario
 */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: RegisterData, { rejectWithValue }) => {
    console.log(userData)
    try {
      const userCredential: UserCredential = await authService.register(
        userData
      );

      // Guardar datos de sesión (no recordar por defecto para nuevos usuarios)
      sessionService.saveUserSession(userCredential.user, false);

      errorService.logInfo(getText("auth.success.registerSuccess"), "registerUser");

      return {
        user: userCredential.user,
        rememberMe: false,
      };
    } catch (error) {
      errorService.logError(error as Error, "registerUser");
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Thunk para cerrar sesión de usuario
 */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();

      // Limpiar datos de sesión
      sessionService.clearAllSessionData();

      errorService.logInfo("Usuario desconectado exitosamente", "logoutUser");

      return null;
    } catch (error) {
      errorService.logError(error as Error, "logoutUser");
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Thunk para enviar correo de recuperación de contraseña
 */
export const sendPasswordResetEmail = createAsyncThunk(
  "auth/sendPasswordResetEmail",
  async (data: PasswordResetData, { rejectWithValue }) => {
    try {
      await authService.sendPasswordResetEmail(data);

      errorService.logInfo(
        getText("auth.success.passwordResetEmailSent"),
        "sendPasswordResetEmail"
      );

      return data.email;
    } catch (error) {
      errorService.logError(error as Error, "sendPasswordResetEmail");
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Thunk para confirmar restablecimiento de contraseña
 */
export const confirmPasswordReset = createAsyncThunk(
  "auth/confirmPasswordReset",
  async (data: NewPasswordData, { rejectWithValue }) => {
    try {
      await authService.confirmPasswordReset(data);

      errorService.logInfo(getText("auth.success.passwordResetSuccess"), "confirmPasswordReset");

      return true;
    } catch (error) {
      errorService.logError(error as Error, "confirmPasswordReset");
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Thunk para actualizar perfil de usuario
 */
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (
    updates: { displayName?: string; photoURL?: string },
    { rejectWithValue }
  ) => {
    try {
      await authService.updateUserProfile(updates);

      // Recargar usuario para obtener datos actualizados
      await authService.reloadUser();
      const updatedUser = authService.getCurrentUser();

      errorService.logInfo(getText("success.profileUpdated"), "updateUserProfile");

      return updatedUser;
    } catch (error) {
      errorService.logError(error as Error, "updateUserProfile");
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Thunk para enviar verificación de correo electrónico
 */
export const sendEmailVerification = createAsyncThunk(
  "auth/sendEmailVerification",
  async (_, { rejectWithValue }) => {
    try {
      await authService.sendEmailVerification();

      errorService.logInfo(getText("auth.success.emailVerificationSent"), "sendEmailVerification");

      return true;
    } catch (error) {
      errorService.logError(error as Error, "sendEmailVerification");
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Thunk para refrescar datos de usuario
 */
export const refreshUserData = createAsyncThunk(
  "auth/refreshUserData",
  async (_, { rejectWithValue }) => {
    try {
      await authService.reloadUser();
      const user = authService.getCurrentUser();

      if (user) {
        // Actualizar datos de sesión
        const sessionInfo = sessionService.getSessionInfo();
        sessionService.saveUserSession(user, sessionInfo.isPersistent);
      }

      errorService.logInfo("Datos de usuario actualizados", "refreshUserData");

      return user;
    } catch (error) {
      errorService.logError(error as Error, "refreshUserData");
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Thunk para extender la sesión
 */
export const extendSession = createAsyncThunk(
  "auth/extendSession",
  async (_, { rejectWithValue }) => {
    try {
      sessionService.extendSession();
      const sessionInfo = sessionService.getSessionInfo();

      errorService.logInfo("Sesión extendida", "extendSession");

      return {
        expiresAt: sessionInfo.expiresAt?.toISOString() || null,
        lastActivity: new Date().toISOString(),
      };
    } catch (error) {
      errorService.logError(error as Error, "extendSession");
      return rejectWithValue((error as Error).message);
    }
  }
);
