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
  // Importar formError desde el formulario de login
  // Para esto, necesitamos exponer el error del formulario a la página
  // Usaremos un estado local para capturarlo desde el LoginForm
  const [loginFormError, setLoginFormError] = React.useState<string | null>(null);
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

  // Mostrar toast de error cuando ocurra un error en el login
  useEffect(() => {
    if (loginFormError) {
      authToasts.loginError(loginFormError);
    }
  }, [loginFormError, authToasts]);

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Ingresa tus credenciales para acceder al panel de administración"
    >
      <LoginForm onError={setLoginFormError} />
    </AuthLayout>
  );
};
