/**
 * 🪝 useMailAuth Hook
 * Hook para manejar autorización de correo electrónico
 */

import { useState, useCallback } from 'react';
import { mailAuthService } from '../services';
import type { MailAuthStatus, AuthorizeMailResponse, RevokeMailResponse } from '../types';

interface UseMailAuthReturn {
  status: MailAuthStatus;
  error: string | null;
  authorizeEmail: (email: string) => Promise<AuthorizeMailResponse>;
  revokeEmail: (email: string) => Promise<RevokeMailResponse>;
  checkEmailStatus: (email: string) => Promise<boolean>;
  clearError: () => void;
}

export const useMailAuth = (): UseMailAuthReturn => {
  const [status, setStatus] = useState<MailAuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  /**
   * 📧 Autorizar correo electrónico
   */
  const authorizeEmail = useCallback(async (email: string): Promise<AuthorizeMailResponse> => {
    setStatus('authorizing');
    setError(null);

    try {
      const response = await mailAuthService.authorizeEmail({ email });
      
      if (response.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(response.error || 'Error al autorizar correo');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error inesperado';
      setStatus('error');
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  /**
   * 🚫 Revocar autorización
   */
  const revokeEmail = useCallback(async (email: string): Promise<RevokeMailResponse> => {
    setStatus('revoking');
    setError(null);

    try {
      const response = await mailAuthService.revokeEmail({ email });
      
      if (response.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(response.error || 'Error al revocar autorización');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error inesperado';
      setStatus('error');
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  /**
   * ✅ Verificar estado del email
   */
  const checkEmailStatus = useCallback(async (email: string): Promise<boolean> => {
    try {
      return await mailAuthService.isEmailAuthorized(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar estado');
      return false;
    }
  }, []);

  /**
   * 🧹 Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
    setStatus('idle');
  }, []);

  return {
    status,
    error,
    authorizeEmail,
    revokeEmail,
    checkEmailStatus,
    clearError,
  };
};

export default useMailAuth;