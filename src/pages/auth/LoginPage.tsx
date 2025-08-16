import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { LoginForm } from "../../components/auth/LoginForm";
import { useAuth } from "../../hooks/auth";
import { useToast } from "../../hooks/ui";
import { ROUTES } from "../../utils/constants";

/**
 * Página de inicio de sesión
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginSuccess } = useAuth();
  const { authToasts } = useToast();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Mostrar toast de éxito cuando el login sea exitoso
  useEffect(() => {
    if (loginSuccess) {
      authToasts.loginSuccess();
    }
  }, [loginSuccess, authToasts]);

  // Función que se ejecuta cuando el login es exitoso
  const handleLoginSuccess = () => {
    // El hook useAuth ya maneja la redirección
    // Aquí podríamos agregar lógica adicional si es necesaria
    console.log("Login exitoso");
  };

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Ingresa tus credenciales para acceder al panel de administración"
    >
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
};
