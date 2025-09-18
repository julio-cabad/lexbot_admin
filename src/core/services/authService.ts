/**
 * Servicio de autenticación
 * Integrado con el sistema de configuración centralizada
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  updateProfile,
  User,
  UserCredential,
  AuthError,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  Unsubscribe
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import {
  LoginCredentials,
  RegisterData,
  PasswordResetData,
  NewPasswordData,
} from '../../features/auth/types';
import { formatAuthError, sanitizeInput, formatDisplayName } from '../utils/helpers';
import { APP_CONFIG } from '../../config/app';
import { getText } from '../../config/texts';

/**
 * Clase de servicio de autenticación
 * - Integrada con el sistema de configuración centralizada
 * - Utiliza textos centralizados para mensajes
 * - Manejo de errores mejorado
 * - Soporte para diferentes flujos de autenticación
 */
class AuthService {
  private unsubscribe: Unsubscribe | null = null;
  private readonly AUTH_REDIRECT_URL = APP_CONFIG.env.isDevelopment
    ? 'http://localhost:5173'
    : window.location.origin;

  /**
   * Configura el listener de estado de autenticación
   */
  onAuthStateChange(callback: (user: User | null) => void): Unsubscribe {
    this.unsubscribe = onAuthStateChanged(auth, callback);
    return this.unsubscribe;
  }

  /**
   * Limpia el listener de estado de autenticación
   */
  cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Inicia sesión con email y contraseña
   */
  async login(credentials: LoginCredentials): Promise<UserCredential> {
    try {
      // Sanitizar entradas
      const email = sanitizeInput(credentials.email.toLowerCase().trim());
      const password = credentials.password;

      // Establecer persistencia según "recordarme"
      const persistence = credentials.rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;

      await setPersistence(auth, persistence);

      // Iniciar sesión del usuario
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado:', userCredential.user);

      return userCredential;
    } catch (error) {
      console.log(error)
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async register(userData: RegisterData): Promise<UserCredential> {
    console.log('Registrando usuario:', userData);
    try {
      // Sanitizar entradas
      const email = sanitizeInput(userData.email.toLowerCase().trim());
      const password = userData.password;

      // Crear cuenta de usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Actualizar perfil de usuario con nombre si se proporciona
      if (userData.displayName) {
        const displayName = formatDisplayName(sanitizeInput(userData.displayName));
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      } else {
        // Usar el email como nombre por defecto (solo la parte antes del @)
        const defaultName = email.split('@')[0];
        await updateProfile(userCredential.user, {
          displayName: defaultName
        });
      }
      return userCredential;
    } catch (error) {
      // Intentar obtener un mensaje de error más descriptivo
      let errorMessage = 'Error desconocido al registrar usuario';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if ((error as AuthError).code) {
        errorMessage = formatAuthError((error as AuthError).code);
      }

      console.error('Mensaje de error formateado:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Envía correo de restablecimiento de contraseña
   */
  async sendPasswordResetEmail(data: PasswordResetData): Promise<void> {
    try {
      const email = sanitizeInput(data.email.toLowerCase().trim());

      await firebaseSendPasswordResetEmail(auth, email, {
        url: `${this.AUTH_REDIRECT_URL}/login`,
        handleCodeInApp: false
      });
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  /**
   * Confirma restablecimiento de contraseña con código
   */
  async confirmPasswordReset(data: NewPasswordData): Promise<void> {
    try {
      await firebaseConfirmPasswordReset(auth, data.code, data.newPassword);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  /**
   * Actualiza perfil de usuario
   */
  async updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error(getText('errors.sessionExpiredMessage'));
      }

      const sanitizedUpdates: { displayName?: string; photoURL?: string } = {};

      if (updates.displayName) {
        sanitizedUpdates.displayName = formatDisplayName(sanitizeInput(updates.displayName));
      }

      if (updates.photoURL) {
        sanitizedUpdates.photoURL = sanitizeInput(updates.photoURL);
      }

      await updateProfile(user, sanitizedUpdates);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  /**
   * Cierra sesión del usuario
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  /**
   * Obtiene token de usuario
   */
  async getUserToken(forceRefresh: boolean = false): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      return await user.getIdToken(forceRefresh);
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  }

  /**
   * Verifica si el email está verificado
   */
  isEmailVerified(): boolean {
    const user = auth.currentUser;
    return user?.emailVerified || false;
  }

  /**
   * Envía verificación de email
   */
  async sendEmailVerification(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error(getText('errors.sessionExpiredMessage'));
      }

      const { sendEmailVerification } = await import('firebase/auth');
      await sendEmailVerification(user, {
        url: `${this.AUTH_REDIRECT_URL}/dashboard`,
        handleCodeInApp: false
      });
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  /**
   * Recarga datos de usuario
   */
  async reloadUser(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error(getText('errors.sessionExpiredMessage'));
      }

      await user.reload();
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  /**
   * Elimina cuenta de usuario
   */
  async deleteAccount(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error(getText('errors.sessionExpiredMessage'));
      }

      await user.delete();
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  /**
   * Verifica si el token de autenticación está a punto de expirar
   */
  async isTokenExpiringSoon(thresholdMinutes: number = 5): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) return false;

      // Decodificar el token para verificar su expiración
      const token = await user.getIdTokenResult();
      const expirationTime = new Date(token.expirationTime).getTime();
      const now = Date.now();
      const thresholdMs = thresholdMinutes * 60 * 1000;

      return expirationTime - now < thresholdMs;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return false;
    }
  }

  /**
   * Actualiza el token de autenticación
   */
  async refreshAuthToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      // Forzar actualización del token
      return await user.getIdToken(true);
    } catch (error) {
      console.error('Error refreshing auth token:', error);
      return null;
    }
  }
}

// Crear y exportar instancia singleton
export const authService = new AuthService();
export default authService;
