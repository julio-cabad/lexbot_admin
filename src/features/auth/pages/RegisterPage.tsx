import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";
import { useAuth } from "../../../hooks/auth";
import { useToast } from "../../../hooks/ui";
import { ROUTES } from "../../../utils/constants";
import { useTexts } from "../../../core/hooks/useTexts";

/**
 * Página de registro de nuevos usuarios
 */
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, registerSuccess } = useAuth();
  const { authToasts } = useToast();
  const { auth } = useTexts();

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
      title={auth.registerTitle}
      subtitle={auth.registerSubtitle}
    >
      <RegisterForm />
    </AuthLayout>
  );
};
