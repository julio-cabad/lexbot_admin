import React from 'react';
import { cn } from '../../utils/classNames';

interface LoginFormStatusProps {
  isValid: boolean;
  isSubmitting: boolean;
  loginAttempts?: number;
  maxAttempts?: number;
  isLockedOut?: boolean;
  lockoutTimeRemaining?: string;
  className?: string;
}

/**
 * Componente para mostrar el estado del formulario de login
 */
export const LoginFormStatus: React.FC<LoginFormStatusProps> = ({
  isValid,
  isSubmitting,
  loginAttempts = 0,
  maxAttempts = 5,
  isLockedOut = false,
  lockoutTimeRemaining,
  className
}) => {
  if (isLockedOut) {
    return (
      <div className={cn(
        "bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4",
        className
      )}>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="text-red-400 font-medium">Cuenta temporalmente bloqueada</p>
            <p className="text-red-300 text-sm">
              Demasiados intentos fallidos. Intenta de nuevo en {lockoutTimeRemaining}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loginAttempts > 0 && loginAttempts < maxAttempts) {
    const remainingAttempts = maxAttempts - loginAttempts;
    const isNearLimit = remainingAttempts <= 2;
    
    return (
      <div className={cn(
        "border rounded-lg p-3 mb-4",
        isNearLimit 
          ? "bg-orange-500/10 border-orange-500/20" 
          : "bg-yellow-500/10 border-yellow-500/20",
        className
      )}>
        <div className="flex items-center">
          <svg 
            className={cn(
              "w-4 h-4 mr-2",
              isNearLimit ? "text-orange-400" : "text-yellow-400"
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className={cn(
            "text-sm",
            isNearLimit ? "text-orange-300" : "text-yellow-300"
          )}>
            {remainingAttempts} intento{remainingAttempts !== 1 ? 's' : ''} restante{remainingAttempts !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className={cn(
        "bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4",
        className
      )}>
        <div className="flex items-center">
          <svg className="animate-spin w-4 h-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-blue-300 text-sm">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  return null;
};