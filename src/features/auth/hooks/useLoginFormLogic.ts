import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../index';
import { useToast } from '../../../hooks/ui';
import { PATHS } from '../../../config/routes';
import { storage } from '../../../core/utils/helpers';

// Constantes para claves de almacenamiento
const STORAGE_KEYS = {
  LAST_EMAIL: 'auth.lastEmail',
  REMEMBER_ME: 'auth.rememberMe',
  AUTH_TOKEN: 'auth.token',
  USER_DATA: 'auth.userData',
  THEME: 'app.theme',
  LANGUAGE: 'app.language'
};

interface UseLoginFormLogicOptions {
  redirectAfterLogin?: string;
  rememberLastEmail?: boolean;
  maxLoginAttempts?: number;
  lockoutDuration?: number;
}

/**
 * Hook especializado para la lógica del LoginForm
 * Maneja intentos fallidos, redirecciones, y persistencia de datos
 */
export const useLoginFormLogic = ({
  redirectAfterLogin,
  rememberLastEmail = true,
  maxLoginAttempts = 5,
  lockoutDuration = 15 * 60 * 1000 // 15 minutos
}: UseLoginFormLogicOptions = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setRedirect } = useAuth();
  const { showWarning, showError } = useToast();

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);
  const [lastEmail, setLastEmail] = useState('');

  // Cargar último email usado si está habilitado
  useEffect(() => {
    if (rememberLastEmail) {
      const savedEmail = storage.get<string>(STORAGE_KEYS.LAST_EMAIL);
      if (savedEmail) {
        setLastEmail(savedEmail);
      }
    }
  }, [rememberLastEmail]);

  // Verificar si hay lockout activo
  useEffect(() => {
    const lockoutData = storage.get<{ endTime: string; attempts: number }>('login_lockout');
    if (lockoutData) {
      const endTime = new Date(lockoutData.endTime);
      if (new Date() < endTime) {
        setIsLockedOut(true);
        setLockoutEndTime(endTime);
        setLoginAttempts(lockoutData.attempts);
      } else {
        // Lockout expirado, limpiar datos
        storage.remove('login_lockout');
      }
    }
  }, []);

  // Countdown para lockout
  useEffect(() => {
    if (!isLockedOut || !lockoutEndTime) return;

    const interval = setInterval(() => {
      if (new Date() >= lockoutEndTime) {
        setIsLockedOut(false);
        setLockoutEndTime(null);
        setLoginAttempts(0);
        storage.remove('login_lockout');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLockedOut, lockoutEndTime]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || redirectAfterLogin || PATHS.private.dashboard;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state, redirectAfterLogin]);

  // Manejar intento de login fallido
  const handleLoginFailure = useCallback((error: string) => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

    if (newAttempts >= maxLoginAttempts) {
      // Activar lockout
      const endTime = new Date(Date.now() + lockoutDuration);
      setIsLockedOut(true);
      setLockoutEndTime(endTime);
      
      storage.set('login_lockout', {
        endTime: endTime.toISOString(),
        attempts: newAttempts
      });

      showWarning(
        `Demasiados intentos fallidos. Cuenta bloqueada por ${lockoutDuration / (60 * 1000)} minutos.`
      );
    } else {
      const remainingAttempts = maxLoginAttempts - newAttempts;
      showError(
        `${error}. Te quedan ${remainingAttempts} intentos.`
      );
    }
  }, [loginAttempts, maxLoginAttempts, lockoutDuration, showWarning, showError]);

  // Manejar login exitoso
  const handleLoginSuccess = useCallback(() => {
    // Limpiar intentos fallidos
    setLoginAttempts(0);
    storage.remove('login_lockout');
    
    // Establecer redirección si es necesaria
    if (redirectAfterLogin) {
      setRedirect(redirectAfterLogin);
    }
  }, [redirectAfterLogin, setRedirect]);

  // Guardar último email usado
  const saveLastEmail = useCallback((email: string) => {
    if (rememberLastEmail && email) {
      storage.set(STORAGE_KEYS.LAST_EMAIL, email);
      setLastEmail(email);
    }
  }, [rememberLastEmail]);

  // Obtener tiempo restante de lockout
  const getLockoutTimeRemaining = useCallback(() => {
    if (!isLockedOut || !lockoutEndTime) return 0;
    return Math.max(0, lockoutEndTime.getTime() - Date.now());
  }, [isLockedOut, lockoutEndTime]);

  // Formatear tiempo restante
  const getFormattedLockoutTime = useCallback(() => {
    const timeRemaining = getLockoutTimeRemaining();
    if (timeRemaining <= 0) return '';
    
    const minutes = Math.floor(timeRemaining / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [getLockoutTimeRemaining]);

  // Limpiar lockout manualmente (para testing o admin)
  const clearLockout = useCallback(() => {
    setIsLockedOut(false);
    setLockoutEndTime(null);
    setLoginAttempts(0);
    storage.remove('login_lockout');
  }, []);

  return {
    // Estados
    loginAttempts,
    isLockedOut,
    lockoutEndTime,
    lastEmail,
    maxLoginAttempts,
    
    // Funciones
    handleLoginFailure,
    handleLoginSuccess,
    saveLastEmail,
    clearLockout,
    
    // Utilidades
    getLockoutTimeRemaining,
    getFormattedLockoutTime,
    remainingAttempts: Math.max(0, maxLoginAttempts - loginAttempts),
    
    // Estados computados
    canAttemptLogin: !isLockedOut && loginAttempts < maxLoginAttempts,
    isNearLockout: loginAttempts >= maxLoginAttempts - 2,
  };
};