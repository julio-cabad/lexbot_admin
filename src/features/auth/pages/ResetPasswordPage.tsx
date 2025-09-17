import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { useAuth } from '../../../hooks/auth';
import { ROUTES } from '../../../utils/constants';
import { useTexts } from '../../../core/hooks/useTexts';

/**
 * Página para establecer nueva contraseña
 */
export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { auth } = useTexts();
  const [code, setCode] = useState<string>('');
  const [isValidCode, setIsValidCode] = useState<boolean>(true);

  // Obtener el código de la URL
  useEffect(() => {
    const resetCode = searchParams.get('oobCode') || searchParams.get('code') || '';
    
    if (!resetCode) {
      setIsValidCode(false);
      return;
    }

    setCode(resetCode);
    
    // Aquí podrías validar el código con Firebase
    // Por ahora asumimos que es válido si existe
    setIsValidCode(true);
  }, [searchParams]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Función que se ejecuta cuando el reset es exitoso
  const handleSuccess = () => {
    console.log('Contraseña actualizada exitosamente');
  };

  // Si no hay código válido, mostrar error
  if (!isValidCode) {
    return (
      <AuthLayout
        title={auth.resetPasswordTitle}
        subtitle={auth.resetPasswordSubtitle}
      >
        <div className="text-center space-y-6">
          {/* Icono de error */}
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Mensaje de error */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Enlace No Válido
            </h3>
            <p className="text-gray-300 text-sm">
              El enlace de recuperación de contraseña no es válido o ha expirado.
            </p>
          </div>

          {/* Información adicional */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-left">
                <p className="text-yellow-300 text-sm font-medium">Posibles causas:</p>
                <ul className="text-yellow-200 text-xs mt-1 space-y-1">
                  <li>• El enlace ha expirado (válido por 1 hora)</li>
                  <li>• El enlace ya fue utilizado</li>
                  <li>• El enlace está incompleto o dañado</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition-all hover:scale-105 active:scale-95"
            >
              Solicitar Nuevo Enlace
            </button>
            
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all py-3 px-8 rounded-full"
            >
              Volver al Login
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={auth.resetPasswordTitle}
      subtitle={auth.resetPasswordSubtitle}
    >
      <ResetPasswordForm code={code} onSuccess={handleSuccess} />
    </AuthLayout>
  );
};