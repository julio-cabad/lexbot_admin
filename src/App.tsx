import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store';
import { useAuth } from './hooks/auth';
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './pages/auth';
import { Dashboard } from './pages/Dashboard';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ROUTES } from './utils/constants';
import 'react-toastify/dist/ReactToastify.css';

// Componente para manejar la autenticación
const AuthWrapper: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const { checkAuth, isInitialized } = useAuth();

  useEffect(() => {
    // Solo verificar auth una vez al cargar la app
    if (!isInitialized) {
      checkAuth();
    }
  }, [checkAuth, isInitialized]);

  // Mostrar loading mientras se verifica la autenticación
  if (!isInitialized) {
    return <LoadingScreen message="Verificando autenticación..." />;
  }

  return <>{children}</>;
});

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  
  // Esperar a que se inicialice antes de redirigir
  if (!isInitialized) {
    return null;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
});

// Componente principal de la aplicación
function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthWrapper>
          <AppRoutes />
        </AuthWrapper>
        
        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="bg-white/10 backdrop-blur-md border border-white/20"
        />
      </Router>
    </Provider>
  );
}

// Componente para manejar redirección inicial
const AuthRedirect: React.FC = React.memo(() => {
  const { isAuthenticated, isInitialized } = useAuth();
  
  // Esperar a que se inicialice antes de redirigir
  if (!isInitialized) {
    return null;
  }
  
  return (
    <Navigate 
      to={isAuthenticated ? "/dashboard" : ROUTES.LOGIN} 
      replace 
    />
  );
});

// Componente de rutas optimizado
const AppRoutes: React.FC = React.memo(() => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = React.useState(location);
  const [transitionStage, setTransitionStage] = React.useState<'fadeIn' | 'fadeOut'>('fadeIn');

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
        
        {/* Rutas de autenticación */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
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
});

export default App;
