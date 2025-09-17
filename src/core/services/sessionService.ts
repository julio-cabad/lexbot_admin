/**
 * Servicio para gestión de sesiones
 * Integrado con el sistema de configuración centralizada
 */
import { User } from 'firebase/auth';
import { storage, sessionStorage } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';
import { APP_CONFIG } from '../../config/app';

/**
 * Clase de servicio para gestión de sesiones de usuario
 * - Integrada con el sistema de configuración centralizada
 * - Manejo de sesiones persistentes y temporales
 * - Seguimiento de actividad y auto-cierre de sesión
 * - Gestión de preferencias de usuario
 */
class SessionService {
  private readonly SESSION_TIMEOUT = APP_CONFIG.auth.sessionTimeout;
  private readonly REMEMBER_ME_DURATION = APP_CONFIG.auth.rememberMeDuration;

  /**
   * Guarda los datos de sesión del usuario
   */
  saveUserSession(user: User, rememberMe: boolean = false): void {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      lastLoginAt: new Date().toISOString(),
      rememberMe
    };

    if (rememberMe) {
      // Guardar en localStorage para sesión persistente
      storage.set(STORAGE_KEYS.AUTH_TOKEN, userData);
      storage.set(STORAGE_KEYS.REMEMBER_ME, true);
      
      // Establecer tiempo de expiración
      const expirationTime = Date.now() + this.REMEMBER_ME_DURATION;
      storage.set('auth_expiration', expirationTime);
    } else {
      // Guardar en sessionStorage solo para la sesión actual
      sessionStorage.set(STORAGE_KEYS.AUTH_TOKEN, userData);
      storage.remove(STORAGE_KEYS.REMEMBER_ME);
    }

    // Guardar último email utilizado para comodidad
    storage.set(STORAGE_KEYS.LAST_EMAIL, user.email);
  }

  /**
   * Obtiene la sesión guardada del usuario
   */
  getSavedUserSession(): any | null {
    // Verificar localStorage primero (sesión persistente)
    const persistentSession = storage.get(STORAGE_KEYS.AUTH_TOKEN);
    if (persistentSession) {
      // Verificar si la sesión ha expirado
      const expirationTime = storage.get<number>('auth_expiration');
      if (expirationTime && Date.now() > expirationTime) {
        this.clearUserSession();
        return null;
      }
      return persistentSession;
    }

    // Verificar sessionStorage (solo sesión)
    return sessionStorage.get(STORAGE_KEYS.AUTH_TOKEN);
  }
  
  /**
   * Verifica si existe una sesión (para uso directo sin validación completa)
   */
  hasSession(): boolean {
    return !!storage.get(STORAGE_KEYS.AUTH_TOKEN) || !!sessionStorage.get(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Limpia los datos de sesión del usuario
   */
  clearUserSession(): void {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    storage.remove(STORAGE_KEYS.REMEMBER_ME);
    storage.remove('auth_expiration');
    sessionStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Verifica si el usuario eligió "recordarme"
   */
  isRememberMeEnabled(): boolean {
    return storage.get<boolean>(STORAGE_KEYS.REMEMBER_ME) || false;
  }

  /**
   * Obtiene el último email utilizado
   */
  getLastEmail(): string | null {
    return storage.get<string>(STORAGE_KEYS.LAST_EMAIL);
  }

  /**
   * Guarda las preferencias del usuario
   */
  saveUserPreferences(preferences: Record<string, any>): void {
    const currentPrefs = this.getUserPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    storage.set(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);
  }

  /**
   * Obtiene las preferencias del usuario
   */
  getUserPreferences(): Record<string, any> {
    return storage.get(STORAGE_KEYS.USER_PREFERENCES) || {};
  }

  /**
   * Limpia las preferencias del usuario
   */
  clearUserPreferences(): void {
    storage.remove(STORAGE_KEYS.USER_PREFERENCES);
  }

  /**
   * Verifica si la sesión es válida
   */
  isSessionValid(): boolean {
    const session = this.getSavedUserSession();
    if (!session) return false;

    // Verificar expiración para sesiones persistentes
    if (this.isRememberMeEnabled()) {
      const expirationTime = storage.get<number>('auth_expiration');
      if (expirationTime && Date.now() > expirationTime) {
        this.clearUserSession();
        return false;
      }
    }

    // Verificar tiempo de inactividad
    if (session.lastActivity) {
      const lastActivityTime = new Date(session.lastActivity).getTime();
      const inactivityTime = Date.now() - lastActivityTime;
      
      // Si ha pasado más tiempo que el SESSION_TIMEOUT, la sesión ha expirado
      if (inactivityTime > this.SESSION_TIMEOUT) {
        console.log(`Sesión expirada por inactividad: ${inactivityTime / 1000 / 60} minutos`);
        this.clearUserSession();
        return false;
      }
    }

    return true;
  }

  /**
   * Extiende la expiración de la sesión
   */
  extendSession(): void {
    if (this.isRememberMeEnabled()) {
      const newExpirationTime = Date.now() + this.REMEMBER_ME_DURATION;
      storage.set('auth_expiration', newExpirationTime);
    }
  }

  /**
   * Obtiene información de la sesión
   */
  getSessionInfo(): {
    isActive: boolean;
    isPersistent: boolean;
    expiresAt: Date | null;
    lastActivity: Date | null;
  } {
    const session = this.getSavedUserSession();
    const isPersistent = this.isRememberMeEnabled();
    const expirationTime = storage.get<number>('auth_expiration');

    return {
      isActive: !!session,
      isPersistent,
      expiresAt: expirationTime ? new Date(expirationTime) : null,
      lastActivity: session?.lastLoginAt ? new Date(session.lastLoginAt) : null
    };
  }

  /**
   * Rastrea la actividad del usuario
   */
  trackActivity(): void {
    const session = this.getSavedUserSession();
    if (session) {
      // Actualizar el tiempo de última actividad
      session.lastActivity = new Date().toISOString();
      
      // Guardar la sesión actualizada
      if (this.isRememberMeEnabled()) {
        storage.set(STORAGE_KEYS.AUTH_TOKEN, session);
        
        // Extender el tiempo de expiración si es una sesión persistente
        const currentTime = Date.now();
        const newExpirationTime = currentTime + this.REMEMBER_ME_DURATION;
        storage.set('auth_expiration', newExpirationTime);
      } else {
        sessionStorage.set(STORAGE_KEYS.AUTH_TOKEN, session);
      }
      
      // Registrar actividad para depuración en desarrollo
      if (APP_CONFIG.env.isDevelopment) {
        console.debug('Actividad de usuario registrada:', new Date().toLocaleTimeString());
      }
    }
  }

  /**
   * Configura el cierre automático de sesión después de inactividad
   * @param callback Función a ejecutar cuando expire la sesión
   * @param timeoutOverride Tiempo de espera personalizado (en minutos)
   */
  setupAutoLogout(callback: () => void, timeoutOverride?: number): () => void {
    let timeoutId: NodeJS.Timeout;
    
    // Usar el tiempo de sesión de la configuración o el valor personalizado
    const timeoutMs = timeoutOverride ? timeoutOverride * 60 * 1000 : this.SESSION_TIMEOUT;
    const timeoutMinutes = timeoutMs / (60 * 1000);
    
    if (APP_CONFIG.env.isDevelopment) {
      console.info(`Configurando cierre automático de sesión: ${timeoutMinutes} minutos`);
    }

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (APP_CONFIG.env.isDevelopment) {
          console.warn('Sesión expirada por inactividad');
        }
        callback();
      }, timeoutMs);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const activityHandler = () => {
      this.trackActivity();
      resetTimeout();
    };

    // Agregar event listeners
    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });

    // Iniciar el timeout
    resetTimeout();

    // Devolver función de limpieza
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, activityHandler, true);
      });
    };
  }

  /**
   * Limpia todos los datos de sesión (cierre de sesión completo)
   */
  clearAllSessionData(): void {
    this.clearUserSession();
    this.clearUserPreferences();
    
    // Limpiar cualquier otro dato específico de la aplicación
    const keysToRemove = Object.values(STORAGE_KEYS);
    keysToRemove.forEach(key => {
      storage.remove(key);
      sessionStorage.remove(key);
    });
  }

  /**
   * Guarda el tema seleccionado por el usuario
   */
  saveThemePreference(themeName: string): void {
    this.saveUserPreferences({ theme: themeName });
  }

  /**
   * Obtiene el tema preferido del usuario
   */
  getThemePreference(): string | null {
    const prefs = this.getUserPreferences();
    return prefs.theme || null;
  }
}

// Crear y exportar instancia singleton
export const sessionService = new SessionService();
export default sessionService;
