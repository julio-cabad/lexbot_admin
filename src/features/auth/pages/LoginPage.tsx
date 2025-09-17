import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../../../hooks/auth";
import { useAuthFeedback } from "../../../hooks/auth/useAuthFeedback";
import { ROUTES } from "../../../utils/constants";
import { useTexts } from "../../../core/hooks/useTexts";

/**
 * Página de inicio de sesión
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginSuccess, loginError } = useAuth();
  const { auth } = useTexts();
  useAuthFeedback({ success: loginSuccess, error: loginError, context: "login" });
  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
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
