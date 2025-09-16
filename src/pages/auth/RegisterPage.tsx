import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { useAuth } from "../../hooks/auth";
import { useToast } from "../../hooks/ui";
import { ROUTES } from "../../utils/constants";

/**
 * Página de registro de nuevos usuarios
 */
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, registerSuccess } = useAuth();
  const { authToasts } = useToast();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Mostrar toast de éxito cuando el registro sea exitoso
  useEffect(() => {
    if (registerSuccess) {
      authToasts.registerSuccess();
    }
  }, [registerSuccess, authToasts]);

  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Únete a LexBot Admin y comienza a gestionar tu contenido"
    >
      <RegisterForm />
    </AuthLayout>
  );
};
