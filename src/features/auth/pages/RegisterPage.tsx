import React from "react";
import { AuthLayout } from "../components/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";
import { useTexts } from "../../../core/hooks/useTexts";
import { usePublicPageRedirect } from "../hooks";

/**
 * Página de registro de nuevos usuarios
 */
export const RegisterPage: React.FC = () => {
  const { auth } = useTexts();

  // Hook centralizado para manejar redirección de páginas públicas
  // Ahora funciona correctamente porque el registro no autentica al usuario
  usePublicPageRedirect();

  return (
    <AuthLayout title={auth.registerTitle} subtitle={auth.registerSubtitle}>
      <RegisterForm />
    </AuthLayout>
  );
};
