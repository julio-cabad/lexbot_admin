import { User } from 'firebase/auth';
import { storage, sessionStorage } from '../utils/helpers';
import { STORAGE_KEYS, AUTH_CONSTANTS } from '../utils/constants';

// Session management service
class SessionService {
  // Save user session data
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
      // Save to localStorage for persistent session
      storage.set(STORAGE_KEYS.AUTH_TOKEN, userData);
      storage.set(STORAGE_KEYS.REMEMBER_ME, true);
      
      // Set expiration time
      const expirationTime = Date.now() + AUTH_CONSTANTS.REMEMBER_ME_DURATION;
      storage.set('auth_expiration', expirationTime);
    } else {
      // Save to sessionStorage for session-only
      sessionStorage.set(STORAGE_KEYS.AUTH_TOKEN, userData);
      storage.remove(STORAGE_KEYS.REMEMBER_ME);
    }

    // Save last used email for convenience
    storage.set(STORAGE_KEYS.LAST_EMAIL, user.email);
  }

  // Get saved user session
  getSavedUserSession(): any | null {
    // Check localStorage first (persistent session)
    const persistentSession = storage.get(STORAGE_KEYS.AUTH_TOKEN);
    if (persistentSession) {
      // Check if session has expired
      const expirationTime = storage.get<number>('auth_expiration');
      if (expirationTime && Date.now() > expirationTime) {
        this.clearUserSession();
        return null;
      }
      return persistentSession;
    }

    // Check sessionStorage (session-only)
    return sessionStorage.get(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Clear user session data
  clearUserSession(): void {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    storage.remove(STORAGE_KEYS.REMEMBER_ME);
    storage.remove('auth_expiration');
    sessionStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Check if user chose "remember me"
  isRememberMeEnabled(): boolean {
    return storage.get<boolean>(STORAGE_KEYS.REMEMBER_ME) || false;
  }

  // Get last used email
  getLastEmail(): string | null {
    return storage.get<string>(STORAGE_KEYS.LAST_EMAIL);
  }

  // Save user preferences
  saveUserPreferences(preferences: Record<string, any>): void {
    const currentPrefs = this.getUserPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    storage.set(STORAGE_KEYS.USER_PREFERENCES, updatedPrefs);
  }

  // Get user preferences
  getUserPreferences(): Record<string, any> {
    return storage.get(STORAGE_KEYS.USER_PREFERENCES) || {};
  }

  // Clear user preferences
  clearUserPreferences(): void {
    storage.remove(STORAGE_KEYS.USER_PREFERENCES);
  }

  // Check if session is valid
  isSessionValid(): boolean {
    const session = this.getSavedUserSession();
    if (!session) return false;

    // Check expiration for persistent sessions
    if (this.isRememberMeEnabled()) {
      const expirationTime = storage.get<number>('auth_expiration');
      if (expirationTime && Date.now() > expirationTime) {
        this.clearUserSession();
        return false;
      }
    }

    return true;
  }

  // Extend session expiration
  extendSession(): void {
    if (this.isRememberMeEnabled()) {
      const newExpirationTime = Date.now() + AUTH_CONSTANTS.REMEMBER_ME_DURATION;
      storage.set('auth_expiration', newExpirationTime);
    }
  }

  // Get session info
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

  // Track user activity
  trackActivity(): void {
    const session = this.getSavedUserSession();
    if (session) {
      session.lastActivity = new Date().toISOString();
      
      if (this.isRememberMeEnabled()) {
        storage.set(STORAGE_KEYS.AUTH_TOKEN, session);
      } else {
        sessionStorage.set(STORAGE_KEYS.AUTH_TOKEN, session);
      }
    }
  }

  // Auto-logout after inactivity
  setupAutoLogout(callback: () => void, timeoutMinutes: number = 30): () => void {
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback();
      }, timeoutMinutes * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const activityHandler = () => {
      this.trackActivity();
      resetTimeout();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });

    // Start the timeout
    resetTimeout();

    // Return cleanup function
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, activityHandler, true);
      });
    };
  }

  // Clear all session data (complete logout)
  clearAllSessionData(): void {
    this.clearUserSession();
    this.clearUserPreferences();
    
    // Clear any other app-specific data
    const keysToRemove = Object.values(STORAGE_KEYS);
    keysToRemove.forEach(key => {
      storage.remove(key);
      sessionStorage.remove(key);
    });
  }
}

// Create and export singleton instance
export const sessionService = new SessionService();
export default sessionService;