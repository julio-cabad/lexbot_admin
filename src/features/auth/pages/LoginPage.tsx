import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";
import { PATHS } from "../../../config/routes";
import { useTexts } from "../../../core/hooks/useTexts";
import { useAuth } from "../hooks";
import { useAuthFeedback } from "../hooks/useAuthFeedback";

/**
 * Página de inicio de sesión
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginSuccess, loginError } = useAuth();
  const { auth } = useTexts();
  useAuthFeedback({ success: !!loginSuccess, error: loginError as string | null, context: "login" });
  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(PATHS.private.dashboard, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout
      title={auth.loginTitle}
      subtitle={auth.loginSubtitle}
    >
      <LoginForm />
    </AuthLayout>
  );
};
