import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";
import { useTexts } from "../../../core/hooks/useTexts";
import { useAuth, usePublicPageRedirect } from "../hooks";
import { useAuthFeedback } from "../hooks/useAuthFeedback";
import { useToast } from "../../../hooks";

/**
 * Página de inicio de sesión
 */
export const LoginPage: React.FC = () => {
  const { loginSuccess, loginError } = useAuth();
  const { auth } = useTexts();
  const location = useLocation();
  const { showInfo } = useToast();
  
  // Hook centralizado para manejar redirección de páginas públicas
  usePublicPageRedirect();
  
  // Hook centralizado para feedback de autenticación
  useAuthFeedback({ 
    success: !!loginSuccess, 
    error: loginError as string | null, 
    context: "login" 
  });

  // Mostrar mensaje si viene del registro
  useEffect(() => {
    const state = location.state as { message?: string; fromRegister?: boolean } | null;
    if (state?.fromRegister && state?.message) {
      showInfo(state.message, { autoClose: 7000 });
    }
  }, [location.state, showInfo]);

  return (
    <AuthLayout
      title={auth.loginTitle}
      subtitle={auth.loginSubtitle}
    >
      <LoginForm />
    </AuthLayout>
  );
};
