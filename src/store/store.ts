import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { sessionMiddleware } from './middleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Firebase User objects and Date objects in actions and state
        ignoredActions: [
          'auth/checkAuthStatus/fulfilled',
          'auth/loginUser/fulfilled',
          'auth/registerUser/fulfilled',
          'auth/updateUserProfile/fulfilled',
          'auth/refreshUserData/fulfilled',
          'auth/extendSession/fulfilled',
        ],
        ignoredPaths: [
          'auth.user',
          'auth.sessionInfo.lastActivity',
          'auth.sessionInfo.expiresAt',
        ],
      },
    }).concat(sessionMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;