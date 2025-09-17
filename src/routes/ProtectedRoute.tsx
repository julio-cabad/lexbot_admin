import React from 'react';
import { Navigate } from 'react-router-dom';
import { sessionService } from '../core/services';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para rutas protegidas
 * Verifica la autenticación y redirige al login si es necesario
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Verificar si hay una sesión válida directamente
  const isSessionValid = sessionService.isSessionValid();
  
  // Si no hay sesión válida, redirigir al login
  if (!isSessionValid) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};
