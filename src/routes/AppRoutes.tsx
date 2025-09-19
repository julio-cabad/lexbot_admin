import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PATHS } from '../config/routes';
import { AuthRoutes } from './AuthRoutes';
import { AdminRoutes } from './AdminRoutes';
import { CompleteProfilePage } from '../features/auth/pages';
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
      // Solo aplicar transición si cambiamos entre secciones principales (auth <-> admin)
      const currentSection = getRouteSection(displayLocation.pathname);
      const newSection = getRouteSection(location.pathname);
      
      if (currentSection !== newSection) {
        setTransitionStage('fadeOut');
      } else {
        // Si es la misma sección, actualizar inmediatamente sin transición
        setDisplayLocation(location);
      }
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

  // Determinar si debemos aplicar transición
  const shouldApplyTransition = React.useMemo(() => {
    const currentSection = getRouteSection(displayLocation.pathname);
    const newSection = getRouteSection(location.pathname);
    return currentSection !== newSection;
  }, [displayLocation.pathname, location.pathname]);

  return (
    <div
      className={`${shouldApplyTransition ? 'transition-opacity duration-200' : ''} ${
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
        
        {/* Rutas del panel administrativo */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Rutas protegidas */}
        <Route 
          path={PATHS.private.completeProfile} 
          element={
            <ProtectedRoute>
              <CompleteProfilePage />
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
 * Función helper para determinar la sección de una ruta
 */
const getRouteSection = (pathname: string): string => {
  if (pathname.startsWith('/auth')) return 'auth';
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/complete-profile')) return 'profile';
  return 'root';
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
      to={isAuthenticated ? '/admin/dashboard' : '/auth/login'} 
      replace 
    />
  );
};
