import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { LoginForm } from "../../components/auth/LoginForm";
import { useToast } from "../../hooks/ui";
import { ROUTES } from "../../utils/constants";

/**
 * Página de inicio de sesión
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { authToasts } = useToast();

  // Función que se ejecuta cuando el login es exitoso
  const handleLoginSuccess = () => {
    authToasts.loginSuccess();
    navigate(ROUTES.HOME, { replace: true });
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
