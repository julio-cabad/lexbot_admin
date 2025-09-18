import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";
import { useTexts } from "../../../core/hooks/useTexts";
import { useAuth } from "../hooks";
import { useAuthFeedback } from "../hooks/useAuthFeedback";
import { useToast } from "../../../hooks";

/**
 * Login page - Simple and direct
 * Always shows the login form - no unnecessary complexity
 */
export const LoginPage: React.FC = () => {
  const { loginSuccess, loginError } = useAuth();
  const { auth } = useTexts();
  const location = useLocation();
  const { showInfo } = useToast();

  // Centralized hook for authentication feedback
  useAuthFeedback({
    success: !!loginSuccess,
    error: loginError as string | null,
    context: "login",
  });

  // Show message if coming from registration
  useEffect(() => {
    const state = location.state as {
      message?: string;
      fromRegister?: boolean;
    } | null;
    if (state?.fromRegister && state?.message) {
      showInfo(state.message, { autoClose: 7000 });
    }
  }, [location.state, showInfo]);

  return (
    <AuthLayout title={auth.loginTitle} subtitle={auth.loginSubtitle}>
      <LoginForm />
    </AuthLayout>
  );
};
