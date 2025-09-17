import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoginFormStatus } from './LoginFormStatus';
import { useLoginForm, useLoginFormLogic, useToast } from '../../hooks';
import { cn } from '../../utils/classNames';

interface EnhancedLoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  showRememberMe?: boolean;
  showLinks?: boolean;
  showSocialLogin?: boolean;
  redirectAfterLogin?: string;
  className?: string;
}

/**
 * Versión mejorada del LoginForm con lógica avanzada
 * Incluye manejo de intentos fallidos, lockout, y persistencia
 */
export const EnhancedLoginForm: React.FC<EnhancedLoginFormProps> = ({
  onSuccess,
  onForgotPassword,
  onRegister,
  showRememberMe = true,
  showLinks = true,
  showSocialLogin = true,
  redirectAfterLogin,
  className
}) => {
  const { authToasts } = useToast();

  // Hook de lógica avanzada
  const {
    loginAttempts,
    isLockedOut,
    lastEmail,
    maxLoginAttempts,
    canAttemptLogin,
    isNearLockout,
    remainingAttempts,
    handleLoginFailure,
    handleLoginSuccess,
    saveLastEmail,
    getFormattedLockoutTime
  } = useLoginFormLogic({
    redirectAfterLogin,
    rememberLastEmail: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000
  });

  // Hook del formulario
  const {
    values,
    errors,
    touched,
    isSubmitting,
    formError,
    formSuccess,
    handleChange,
    handleBlur,
    handleSubmit,
    clearFormError,
    isValid,
    setFieldValue
  } = useLoginForm(() => {
    handleLoginSuccess();
    if (onSuccess) onSuccess();
  });

  // Establecer último email al cargar
  useEffect(() => {
    if (lastEmail && !values.email) {
      setFieldValue('email', lastEmail);
    }
  }, [lastEmail, values.email, setFieldValue]);

  // Manejar errores de login
  useEffect(() => {
    if (formError) {
      handleLoginFailure(formError);
    }
  }, [formError, handleLoginFailure]);

  // Manejar éxito de login
  useEffect(() => {
    if (formSuccess) {
      authToasts.loginSuccess();
      if (values.email) {
        saveLastEmail(values.email);
      }
    }
  }, [formSuccess, authToasts, values.email, saveLastEmail]);

  // Limpiar errores cuando el usuario empieza a escribir
  useEffect(() => {
    if (formError && (values.email || values.password)) {
      clearFormError();
    }
  }, [values.email, values.password, formError, clearFormError]);

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
    }
  };

  const isFormDisabled = isSubmitting || !canAttemptLogin;

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn("space-y-6", className)}
      noValidate
    >
      {/* Status del formulario */}
      <LoginFormStatus
        isValid={isValid}
        isSubmitting={isSubmitting}
        loginAttempts={loginAttempts}
        maxAttempts={maxLoginAttempts}
        isLockedOut={isLockedOut}
        lockoutTimeRemaining={getFormattedLockoutTime()}
      />

      {/* Email Field */}
      <div className="space-y-2">
        <Input
          label="Email"
          inputType="email"
          placeholder="tu@email.com"
          value={values.email}
          onChange={(e) => handleChange('email')(e.target.value)}
          onBlur={handleBlur('email')}
          error={touched.email ? errors.email : undefined}
          disabled={isFormDisabled}
          leftIcon={
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" 
              />
            </svg>
          }
          autoComplete="email"
          required
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Input
          label="Contraseña"
          inputType="password"
          placeholder="••••••••"
          value={values.password}
          onChange={(e) => handleChange('password')(e.target.value)}
          onBlur={handleBlur('password')}
          error={touched.password ? errors.password : undefined}
          disabled={isFormDisabled}
          showPasswordToggle
          leftIcon={
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          }
          autoComplete="current-password"
          required
        />
      </div>

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between">
        {showRememberMe && (
          <label className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              checked={values.rememberMe}
              onChange={(e) => handleChange('rememberMe')(e.target.checked)}
              disabled={isFormDisabled}
              className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-0 transition-colors"
            />
            <span className="ml-2 text-sm text-gray-300 group-hover:text-white transition-colors">
              Recordarme
            </span>
          </label>
        )}
        
        {showLinks && (
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={isFormDisabled}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}
      </div>

      {/* Warning para intentos restantes */}
      {isNearLockout && !isLockedOut && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-orange-300 text-sm">
              ⚠️ Solo te quedan {remainingAttempts} intentos antes del bloqueo
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
        disabled={!isValid || isFormDisabled}
        className="mt-8"
      >
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* Register Link */}
      {showLinks && (
        <div className="text-center pt-4 border-t border-white/10">
          <span className="text-gray-400 text-sm">¿No tienes cuenta? </span>
          <button
            type="button"
            onClick={handleRegister}
            disabled={isFormDisabled}
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crear cuenta
          </button>
        </div>
      )}

      {/* Social Login Options */}
      {showSocialLogin && (
        <div className="pt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">
                O continúa con
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={isFormDisabled}
              className="flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={isFormDisabled}
              className="flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};