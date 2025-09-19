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
import { PATHS } from "../../../../config/routes";
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
 * ⚔️ THUNK ÉPICO PARA INICIAR SESIÓN
 * Login + Carga de perfil + Redirección inteligente
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue, dispatch }) => {
    try {
      console.log(credentials)
      // 1️⃣ Autenticar con Firebase Auth
      const userCredential: UserCredential = await authService.login(
        credentials
      );

      const { user } = userCredential;

      // 2️⃣ Guardar datos de sesión
      sessionService.saveUserSession(
        user,
        credentials.rememberMe || false
      );

      // 3️⃣ Cargar perfil de usuario desde Firestore
      try {
        const profileResult = await dispatch(loadUserProfile(user.uid));
        
        if (loadUserProfile.fulfilled.match(profileResult)) {
          // Perfil cargado exitosamente
          const profile = profileResult.payload;
          
          errorService.logInfo(
            `Login exitoso para: ${user.email} - Perfil: ${profile.isComplete ? 'Completo' : 'Incompleto'}`, 
            "loginUser"
          );

          // 4️⃣ Redirección simple basada en completitud del perfil
          setTimeout(() => {
            if (profile.isComplete) {
              window.location.href = PATHS.private.dashboard;
            } else {
              window.location.href = PATHS.private.completeProfile;
            }
          }, 100);

          return {
            user,
            userProfile: profile,
            rememberMe: credentials.rememberMe || false,
          };
        } else {
          // Error cargando perfil - continuar sin perfil
          errorService.logError(
            new Error(`Error cargando perfil: ${profileResult.payload}`), 
            "loginUser"
          );
          
          return {
            user,
            userProfile: null,
            rememberMe: credentials.rememberMe || false,
          };
        }
      } catch (profileError) {
        // Error cargando perfil - continuar sin perfil
        errorService.logError(profileError as Error, "loginUser-profile");
        
        return {
          user,
          userProfile: null,
          rememberMe: credentials.rememberMe || false,
        };
      }

    } catch (error) {
      console.log(error)
      errorService.logError(error as Error, "loginUser");
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Thunk para registro de usuario
 * ⚔️ Registra al usuario Y crea su perfil en Firestore
 * Luego cierra sesión para que haga login manualmente
 */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: RegisterData, { rejectWithValue }) => {
    console.log(userData)
    try {
      // 1️⃣ Crear cuenta en Firebase Auth
      const userCredential: UserCredential = await authService.register(
        userData
      );

      const { user } = userCredential;

      try {
        // 2️⃣ Crear perfil en Firestore usando nuestro servicio épico
        const { userService } = await import('../../../services');
        
        const profileResult = await userService.createUserProfile(
          user.uid,
          user.email!,
          {
            // Datos adicionales si los hay en el futuro
            firstName: userData.displayName?.split(' ')[0] || '',
            lastName: userData.displayName?.split(' ').slice(1).join(' ') || '',
          }
        );

        if (!profileResult.success) {
          // 💀 Si falla la creación del perfil, eliminar la cuenta Auth
          await user.delete();
          throw new Error(`Error creando perfil: ${profileResult.error}`);
        }

        // 3️⃣ Cerrar la sesión inmediatamente después del registro
        await authService.logout();

        errorService.logInfo(getText("auth.success.registerSuccess"), "registerUser");

        return {
          user: null, // No devolver usuario para que no quede autenticado
          rememberMe: false,
          registered: true, // Flag para indicar que el registro fue exitoso
          profileCreated: true, // Flag para indicar que el perfil fue creado
        };

      } catch (profileError) {
        // 🔥 ROLLBACK: Si algo falla después de crear la cuenta Auth
        try {
          await user.delete();
          errorService.logError(new Error('Rollback: Cuenta eliminada debido a error en perfil'), "registerUser");
        } catch (deleteError) {
          errorService.logError(deleteError as Error, "registerUser-rollback");
        }
        
        throw profileError;
      }

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

/**
 * 👑 THUNK ÉPICO PARA CARGAR PERFIL DE USUARIO
 * Obtiene el perfil completo desde Firestore
 */
export const loadUserProfile = createAsyncThunk(
  "auth/loadUserProfile",
  async (uid: string, { rejectWithValue }) => {
    try {
      const { userService } = await import('../../../services');
      
      const result = await userService.getUserProfile(uid);
      
      if (result.success && result.data) {
        errorService.logInfo(`Perfil cargado para usuario: ${uid}`, "loadUserProfile");
        return result.data;
      } else {
        throw new Error(result.error || 'Error desconocido al cargar perfil');
      }
    } catch (error) {
      errorService.logError(error as Error, "loadUserProfile");
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * ⚡ THUNK ÉPICO PARA ACTUALIZAR PERFIL DE USUARIO
 * Actualiza el perfil en Firestore y en el estado global
 */
export const updateUserProfileThunk = createAsyncThunk(
  "auth/updateUserProfileFirestore",
  async (
    { uid, updates }: { uid: string; updates: any },
    { rejectWithValue }
  ) => {
    try {
      const { userService } = await import('../../../services');
      
      const result = await userService.updateUserProfile(uid, updates);
      
      if (result.success && result.data) {
        errorService.logInfo(`Perfil actualizado para usuario: ${uid}`, "updateUserProfile");
        return result.data;
      } else {
        throw new Error(result.error || 'Error desconocido al actualizar perfil');
      }
    } catch (error) {
      errorService.logError(error as Error, "updateUserProfile");
      return rejectWithValue((error as Error).message);
    }
  }
);
