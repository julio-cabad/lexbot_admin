import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { useToast } from "../../hooks/ui";
import { ROUTES } from "../../utils/constants";

/**
 * Página de registro de nuevos usuarios
 */
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { authToasts } = useToast();

  // Función que se ejecuta cuando el registro es exitoso
  const handleRegisterSuccess = () => {
    authToasts.registerSuccess();
    navigate(ROUTES.LOGIN);
  };

  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Únete a LexBot Admin y comienza a gestionar tu contenido"
    >
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </AuthLayout>
  );
};
