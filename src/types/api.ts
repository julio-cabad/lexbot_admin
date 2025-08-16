// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

// API Error interface
export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// Firebase Auth Error Codes
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'auth/invalid-credential',
  USER_NOT_FOUND = 'auth/user-not-found',
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  WEAK_PASSWORD = 'auth/weak-password',
  NETWORK_ERROR = 'auth/network-request-failed',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  INVALID_EMAIL = 'auth/invalid-email',
  USER_DISABLED = 'auth/user-disabled',
  OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed',
  EXPIRED_ACTION_CODE = 'auth/expired-action-code',
  INVALID_ACTION_CODE = 'auth/invalid-action-code',
  MISSING_EMAIL = 'auth/missing-email',
  MISSING_PASSWORD = 'auth/missing-password'
}

// Custom Auth Error
export interface AuthError extends ApiError {
  code: AuthErrorCode;
}

// Validation Error
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Form Error State
export interface FormErrorState {
  [key: string]: string | undefined;
}

// Loading states
export interface LoadingState {
  login: boolean;
  register: boolean;
  forgotPassword: boolean;
  resetPassword: boolean;
  logout: boolean;
}

// Toast notification types
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface ToastMessage {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}