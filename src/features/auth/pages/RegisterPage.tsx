import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";
import { PATHS } from "../../../config/routes";
import { useTexts } from "../../../core/hooks/useTexts";
import { useAuth } from "../hooks";

/**
 * Página de registro de nuevos usuarios
 */
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { auth } = useTexts();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(PATHS.private.dashboard, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout
      title={auth.registerTitle}
      subtitle={auth.registerSubtitle}
    >
      <RegisterForm />
    </AuthLayout>
  );
};
