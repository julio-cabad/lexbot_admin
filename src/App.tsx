import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store';
import { useAuth } from './hooks/auth';
import { LoginPage } from './pages/auth';
import { Dashboard } from './pages/Dashboard';
import { ROUTES } from './utils/constants';
import 'react-toastify/dist/ReactToastify.css';

// Componente para manejar la autenticación
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { checkAuth, isInitialized, isAuthenticated } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Mostrar loading mientras se verifica la autenticación
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <p className="text-white text-lg">Verificando autenticación...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

// Componente principal de la aplicación
function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthWrapper>
          <Routes>
            {/* Ruta raíz - redirige según autenticación */}
            <Route 
              path="/" 
              element={
                <AuthRedirect />
              } 
            />
            
            {/* Rutas de autenticación */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            
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
const AuthRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Navigate 
      to={isAuthenticated ? "/dashboard" : ROUTES.LOGIN} 
      replace 
    />
  );
};

export default App;
