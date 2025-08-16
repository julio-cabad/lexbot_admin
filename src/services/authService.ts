import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
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
} from '../types';
import { formatAuthError, sanitizeInput, formatDisplayName } from '../utils';

// Auth service class
class AuthService {
  private unsubscribe: Unsubscribe | null = null;

  // Set up auth state listener
  onAuthStateChange(callback: (user: User | null) => void): Unsubscribe {
    this.unsubscribe = onAuthStateChanged(auth, callback);
    return this.unsubscribe;
  }

  // Clean up auth state listener
  cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Login with email and password
  async login(credentials: LoginCredentials): Promise<UserCredential> {
    try {
      // Sanitize inputs
      const email = sanitizeInput(credentials.email.toLowerCase().trim());
      const password = credentials.password;

      // Set persistence based on "remember me"
      const persistence = credentials.rememberMe 
        ? browserLocalPersistence 
        : browserSessionPersistence;
      
      await setPersistence(auth, persistence);

      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      return userCredential;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<UserCredential> {
    try {
      // Sanitize inputs
      const email = sanitizeInput(userData.email.toLowerCase().trim());
      const password = userData.password;
      const displayName = formatDisplayName(sanitizeInput(userData.displayName));

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      return userCredential;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(data: PasswordResetData): Promise<void> {
    try {
      const email = sanitizeInput(data.email.toLowerCase().trim());
      
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false
      });
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  // Confirm password reset with code
  async confirmPasswordReset(data: NewPasswordData): Promise<void> {
    try {
      await confirmPasswordReset(auth, data.code, data.newPassword);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  // Update user profile
  async updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado');
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

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  // Get user token
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

  // Check if email is verified
  isEmailVerified(): boolean {
    const user = auth.currentUser;
    return user?.emailVerified || false;
  }

  // Send email verification
  async sendEmailVerification(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      const { sendEmailVerification } = await import('firebase/auth');
      await sendEmailVerification(user, {
        url: `${window.location.origin}/dashboard`,
        handleCodeInApp: false
      });
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  // Reload user data
  async reloadUser(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      await user.reload();
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }

  // Delete user account
  async deleteAccount(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      await user.delete();
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(formatAuthError(authError.code));
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;