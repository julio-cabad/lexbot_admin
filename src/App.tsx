import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./core/store";
import { AppRoutes } from "./routes";
import { ThemeManager } from "./core/providers/ThemeProvider";
import { DEFAULT_THEME } from "./config/theme";
import { sessionService } from "./core/services";
import "react-toastify/dist/ReactToastify.css";

/**
 * Componente principal de la aplicación
 * Configurado con:
 * - Redux para gestión de estado
 * - React Router para navegación
 * - Sistema de temas
 * - Notificaciones toast
 * - Verificación de sesión
 */
function App() {
  // Configurar el manejo de sesiones
  React.useEffect(() => {
    // Configurar el cierre automático de sesión por inactividad
    const cleanup = sessionService.setupAutoLogout(() => {
      console.info("Sesión expirada por inactividad");
      sessionService.clearUserSession();
      window.location.href = "/auth/login";
    });

    return cleanup;
  }, []);

  return (
    <Provider store={store}>
      <ThemeManager initialTheme={DEFAULT_THEME}>
        <Router>
          <AppRoutes />

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
      </ThemeManager>
    </Provider>
  );
}

export default App;
