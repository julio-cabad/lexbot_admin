import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PATHS } from '../config/routes';
import { AuthRoutes } from './AuthRoutes';
import { Dashboard } from '../features/dashboard/pages';
import { ProtectedRoute } from './ProtectedRoute';
import { sessionService } from '../core/services';

/**
 * Componente principal de rutas de la aplicación
 * Maneja la navegación y transiciones entre páginas
 */
export const AppRoutes: React.FC = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = React.useState(location);
  const [transitionStage, setTransitionStage] = React.useState<'fadeIn' | 'fadeOut'>('fadeIn');

  // Efecto para manejar las transiciones entre páginas
  React.useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fadeOut');
    }
  }, [location.pathname, displayLocation.pathname]);

  React.useEffect(() => {
    if (transitionStage === 'fadeOut') {
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
      }, 100); // Transición muy rápida

      return () => clearTimeout(timer);
    }
  }, [transitionStage, location]);

  return (
    <div
      className={`transition-opacity duration-200 ${
        transitionStage === 'fadeOut' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <Routes location={displayLocation}>
        {/* Ruta raíz - redirige según autenticación */}
        <Route path="/" element={<AuthRedirect />} />
        
        {/* Rutas de autenticación directas */}
        <Route path={PATHS.public.login} element={<Navigate to="/auth/login" replace />} />
        <Route path={PATHS.public.register} element={<Navigate to="/auth/register" replace />} />
        <Route path={PATHS.public.forgotPassword} element={<Navigate to="/auth/forgot-password" replace />} />
        <Route path={PATHS.public.resetPassword} element={<Navigate to="/auth/reset-password" replace />} />
        
        {/* Rutas de autenticación anidadas */}
        <Route path="/auth/*" element={<AuthRoutes />} />
        
        {/* Rutas protegidas */}
        <Route 
          path={PATHS.private.dashboard} 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

/**
 * Componente para manejar redirección inicial
 * Redirige al dashboard o al login según el estado de autenticación
 */
const AuthRedirect: React.FC = () => {
  // Verificar si hay una sesión válida usando el servicio de sesión
  const isAuthenticated = sessionService.hasSession();
  
  // Redirigir según el estado de autenticación
  return (
    <Navigate 
      to={isAuthenticated ? PATHS.private.dashboard : '/auth/login'} 
      replace 
    />
  );
};
