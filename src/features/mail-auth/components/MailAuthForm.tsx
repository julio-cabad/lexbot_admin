/**
 * 📧 MAIL AUTH FORM COMPONENT
 * Formulario simple para autorizar/revocar correo electrónico
 */

import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface MailAuthFormProps {
  onSuccess?: (email: string, action: 'authorize' | 'revoke') => void;
  onError?: (error: string) => void;
  className?: string;
}

export const MailAuthForm: React.FC<MailAuthFormProps> = ({
  onSuccess,
  onError,
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 📧 Validar formato de email
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * 📧 Manejar cambio de email
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Validación inmediata
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError('Por favor ingresa un email válido');
    } else {
      setEmailError('');
    }
    
    // Simular verificación de estado
    if (newEmail && validateEmail(newEmail)) {
      const isAlreadyAuthorized = newEmail.includes('authorized') || newEmail.includes('admin');
      setIsAuthorized(isAlreadyAuthorized);
    } else {
      setIsAuthorized(null);
    }
  };

  /**
   * ✅ Autorizar correo
   */
  const handleAuthorize = async () => {
    if (!email) {
      setEmailError('Por favor ingresa un email');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsAuthorized(true);
      onSuccess?.(email, 'authorize');
      
      // Simular apertura de ventana OAuth
      const authUrl = `https://accounts.google.com/oauth/authorize?email=${encodeURIComponent(email)}`;
      window.open(authUrl, '_blank');
      
    } catch (err) {
      onError?.('Error al autorizar correo');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🚫 Revocar autorización
   */
  const handleRevoke = async () => {
    if (!email) {
      setEmailError('Por favor ingresa un email');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsAuthorized(false);
      onSuccess?.(email, 'revoke');
      
    } catch (err) {
      onError?.('Error al revocar autorización');
    } finally {
      setIsLoading(false);
    }
  };

  const hasValidEmail = email && validateEmail(email) && !emailError;

  return (
    <form className={`flex flex-col gap-6 w-full ${className}`} autoComplete="off" onSubmit={e => e.preventDefault()}>
      {/* Email Input Section */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1" htmlFor="mail-auth-email">Correo Electrónico</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </span>
          <input
            id="mail-auth-email"
            type="email"
            className={`pl-10 pr-3 py-2 w-full rounded-lg bg-slate-800/80 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition ${emailError ? 'border-red-500' : ''}`}
            placeholder="ejemplo@gmail.com"
            value={email}
            onChange={handleEmailChange}
            disabled={isLoading}
            required
            autoComplete="off"
          />
        </div>
        {emailError && <p className="mt-1 text-xs text-red-400 font-medium">{emailError}</p>}
      </div>

      {/* Status Indicator */}
      {hasValidEmail && isAuthorized !== null && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mt-1 font-medium text-sm ${isAuthorized ? 'bg-green-900/70 text-green-300 border border-green-700' : 'bg-yellow-900/70 text-yellow-200 border border-yellow-700'}`}>
          {isAuthorized ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
          <span>{isAuthorized ? '✅ Correo autorizado' : '❌ Correo no autorizado'}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-1">
        {isAuthorized === false || isAuthorized === null ? (
          <button
            type="button"
            onClick={handleAuthorize}
            disabled={!hasValidEmail || isLoading}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-base transition bg-primary-600 hover:bg-primary-700 text-white shadow ${(!hasValidEmail || isLoading) ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {isLoading ? 'Autorizando...' : 'Autorizar Correo'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRevoke}
            disabled={!hasValidEmail || isLoading}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-base transition bg-red-600 hover:bg-red-700 text-white shadow ${(!hasValidEmail || isLoading) ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
            {isLoading ? 'Revocando...' : 'Revocar Autorización'}
          </button>
        )}
      </div>

      <div className="flex items-start gap-2 mt-2 bg-slate-800/60 rounded-md px-3 py-2 text-xs text-slate-300">
        <span className="mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <span>
          {isAuthorized 
            ? 'Este correo está autorizado para enviar mensajes. Puedes revocar la autorización en cualquier momento.'
            : 'Al autorizar, podrás enviar correos desde esta cuenta. Se abrirá una ventana para completar la autorización con Google.'
          }
        </span>
      </div>
    </form>
  );
};

export default MailAuthForm;