import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';
import { useAuth } from '../../hooks/auth';
import { ROUTES } from '../../utils/constants';

/**
 * Página de recuperación de contraseña
 */
export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Función que se ejecuta cuando el envío es exitoso
  const handleSuccess = () => {
    // Aquí podríamos agregar lógica adicional si es necesaria
    console.log('Email de recuperación enviado exitosamente');
  };

  return (
    <AuthLayout
      title="Recuperar Contraseña"
      subtitle="Te ayudamos a recuperar el acceso a tu cuenta"
    >
      <ForgotPasswordForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
};