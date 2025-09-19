/**
 * 📧 MAIL AUTH TYPES
 * Tipos para la autorización de correo electrónico
 */

export interface MailAuthData {
  id: string;
  email: string;
  isAuthorized: boolean;
  authorizedAt?: string;
  revokedAt?: string;
  permissions: string[];
  status: 'pending' | 'authorized' | 'revoked' | 'error';
}

export interface AuthorizeMailRequest {
  email: string;
}

export interface AuthorizeMailResponse {
  success: boolean;
  data?: MailAuthData;
  error?: string;
  authUrl?: string; // URL para autorización con Google
}

export interface RevokeMailRequest {
  email: string;
}

export interface RevokeMailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export type MailAuthStatus = 'idle' | 'authorizing' | 'revoking' | 'success' | 'error';