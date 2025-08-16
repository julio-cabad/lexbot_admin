import { createAsyncThunk } from "@reduxjs/toolkit";
import { User, UserCredential } from "firebase/auth";
import {
  LoginCredentials,
  RegisterData,
  PasswordResetData,
  NewPasswordData,
} from "../../../types";
import { authService, sessionService, errorService } from "../../../services";

// Async thunk for checking authentication status on app load
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

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const userCredential: UserCredential = await authService.login(
        credentials
      );

      // Save session data
      sessionService.saveUserSession(
        userCredential.user,
        credentials.rememberMe || false
      );

      errorService.logInfo("User logged in successfully", "loginUser");

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

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const userCredential: UserCredential = await authService.register(
        userData
      );

      // Save session data (don't remember by default for new users)
      sessionService.saveUserSession(userCredential.user, false);

      errorService.logInfo("User registered successfully", "registerUser");

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

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();

      // Clear session data
      sessionService.clearAllSessionData();

      errorService.logInfo("User logged out successfully", "logoutUser");

      return null;
    } catch (error) {
      errorService.logError(error as Error, "logoutUser");
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for sending password reset email
export const sendPasswordResetEmail = createAsyncThunk(
  "auth/sendPasswordResetEmail",
  async (data: PasswordResetData, { rejectWithValue }) => {
    try {
      await authService.sendPasswordResetEmail(data);

      errorService.logInfo(
        "Password reset email sent",
        "sendPasswordResetEmail"
      );

      return data.email;
    } catch (error) {
      errorService.logError(error as Error, "sendPasswordResetEmail");
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for confirming password reset
export const confirmPasswordReset = createAsyncThunk(
  "auth/confirmPasswordReset",
  async (data: NewPasswordData, { rejectWithValue }) => {
    try {
      await authService.confirmPasswordReset(data);

      errorService.logInfo("Password reset confirmed", "confirmPasswordReset");

      return true;
    } catch (error) {
      errorService.logError(error as Error, "confirmPasswordReset");
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (
    updates: { displayName?: string; photoURL?: string },
    { rejectWithValue }
  ) => {
    try {
      await authService.updateUserProfile(updates);

      // Reload user to get updated data
      await authService.reloadUser();
      const updatedUser = authService.getCurrentUser();

      errorService.logInfo("User profile updated", "updateUserProfile");

      return updatedUser;
    } catch (error) {
      errorService.logError(error as Error, "updateUserProfile");
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for sending email verification
export const sendEmailVerification = createAsyncThunk(
  "auth/sendEmailVerification",
  async (_, { rejectWithValue }) => {
    try {
      await authService.sendEmailVerification();

      errorService.logInfo("Email verification sent", "sendEmailVerification");

      return true;
    } catch (error) {
      errorService.logError(error as Error, "sendEmailVerification");
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for refreshing user data
export const refreshUserData = createAsyncThunk(
  "auth/refreshUserData",
  async (_, { rejectWithValue }) => {
    try {
      await authService.reloadUser();
      const user = authService.getCurrentUser();

      if (user) {
        // Update session data
        const sessionInfo = sessionService.getSessionInfo();
        sessionService.saveUserSession(user, sessionInfo.isPersistent);
      }

      errorService.logInfo("User data refreshed", "refreshUserData");

      return user;
    } catch (error) {
      errorService.logError(error as Error, "refreshUserData");
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for extending session
export const extendSession = createAsyncThunk(
  "auth/extendSession",
  async (_, { rejectWithValue }) => {
    try {
      sessionService.extendSession();
      const sessionInfo = sessionService.getSessionInfo();

      errorService.logInfo("Session extended", "extendSession");

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
