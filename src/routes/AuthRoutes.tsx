import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from '../features/auth/pages';
import { PATHS } from '../config/routes';

/**
 * Rutas de autenticación
 * Maneja todas las rutas relacionadas con autenticación
 */
export const AuthRoutes: React.FC = () => {
  // Extraer las rutas base de autenticación
  const loginPath = PATHS.public.login.split('/').pop() || '';
  const registerPath = PATHS.public.register.split('/').pop() || '';
  const forgotPasswordPath = PATHS.public.forgotPassword.split('/').pop() || '';
  const resetPasswordPath = PATHS.public.resetPassword.split('/').pop() || '';
  
  return (
    <Routes>
      <Route path={loginPath} element={<LoginPage />} />
      <Route path={registerPath} element={<RegisterPage />} />
      <Route path={forgotPasswordPath} element={<ForgotPasswordPage />} />
      <Route path={resetPasswordPath} element={<ResetPasswordPage />} />
      {/* Redirigir cualquier ruta de auth no encontrada al login */}
      <Route path="*" element={<Navigate to={`/auth/${loginPath}`} replace />} />
    </Routes>
  );
};