import {
  Middleware,
  UnknownAction,
} from "@reduxjs/toolkit";
import { sessionService } from "../../services";
import { updateSessionActivity, extendSession } from "../slices/auth";

// Session middleware to track user activity and manage session expiration
export const sessionMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    const result = next(action);
    const state = store.getState();

    // Only track activity if user is authenticated
    if (state.auth.isAuthenticated && state.auth.user) {
      // Track activity for certain actions
      const activityActions = [
        "auth/loginUser/fulfilled",
        "auth/registerUser/fulfilled",
        "auth/updateUserProfile/fulfilled",
        "auth/refreshUserData/fulfilled",
      ];

      if (activityActions.includes((action as UnknownAction).type)) {
        (store.dispatch as any)(updateSessionActivity());
        sessionService.trackActivity();
      }

      // Auto-extend session if it's close to expiring (within 5 minutes)
      if (
        state.auth.sessionInfo.expiresAt &&
        state.auth.sessionInfo.rememberMe
      ) {
        const expiresAt = new Date(state.auth.sessionInfo.expiresAt);
        const now = new Date();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if (timeUntilExpiry > 0 && timeUntilExpiry < fiveMinutes) {
          (store.dispatch as any)(extendSession());
        }
      }
    }

    return result;
  };

export default sessionMiddleware;
