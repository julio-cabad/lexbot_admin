import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { PasswordStrengthMeter } from '../../../components/ui/PasswordStrengthMeter';
import { useResetPasswordForm, usePasswordStrength } from '../hooks';
import { useToast } from '../../../hooks/ui';
import { PATHS } from '../../../config/routes';

interface ResetPasswordFormProps {
  code: string;
  onSuccess?: () => void;
}

/**
 * Componente de formulario para establecer nueva contraseña
 */
export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  code,
  onSuccess
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showSuccess, showError } = useToast();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
  } = useResetPasswordForm(code);

  // Hook para evaluar la fuerza de la contraseña
  const passwordStrength = usePasswordStrength(values.newPassword);

  // Manejar envío del formulario
  const onSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular llamada a la API de reset de contraseña
      // En una implementación real, esto llamaría a authService.confirmPasswordReset
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular delay
      
      setIsSuccess(true);
      showSuccess('Contraseña actualizada correctamente');
      
      if (onSuccess) {
        onSuccess();
      }

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate(PATHS.public.login);
      }, 3000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la contraseña';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Si el reset fue exitoso, mostrar mensaje de confirmación
  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        {/* Icono de éxito */}
        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-scale-in">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Mensaje de éxito */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">
            ¡Contraseña Actualizada!
          </h3>
          <p className="text-gray-300 text-sm">
            Tu contraseña ha sido actualizada exitosamente.
          </p>
          <p className="text-gray-400 text-xs">
            Serás redirigido al login en unos segundos...
          </p>
        </div>

        {/* Botón para ir al login */}
        <Link to={PATHS.public.login}>
          <Button variant="primary" size="lg" fullWidth>
            Ir al Login
          </Button>
        </Link>
      </div>
    );
  }

  // Nota: En la implementación original, handleSubmit devuelve una función que maneja el evento submit
  // Pero en esta versión simplificada, lo manejamos directamente
  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={submitForm} className="space-y-6">
      {/* Descripción */}
      <div className="text-center space-y-2 mb-6">
        <p className="text-gray-300 text-sm">
          Ingresa tu nueva contraseña. Asegúrate de que sea segura y fácil de recordar.
        </p>
      </div>

      {/* Error general */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Campo Nueva Contraseña */}
      <div className="space-y-2">
        <Input
          label="Nueva Contraseña"
          inputType="password"
          placeholder="••••••••"
          value={values.newPassword}
          onChange={(e) => handleChange('newPassword')(e.target.value)}
          onBlur={handleBlur('newPassword')}
          error={touched.newPassword ? errors.newPassword : undefined}
          disabled={isLoading}
          showPasswordToggle
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        {/* Medidor de fuerza de contraseña */}
        <PasswordStrengthMeter password={values.newPassword} />
      </div>

      {/* Campo Confirmar Contraseña */}
      <Input
        label="Confirmar Nueva Contraseña"
        inputType="password"
        placeholder="••••••••"
        value={values.confirmPassword}
        onChange={(e) => handleChange('confirmPassword')(e.target.value)}
        onBlur={handleBlur('confirmPassword')}
        error={touched.confirmPassword ? errors.confirmPassword : undefined}
        disabled={isLoading}
        showPasswordToggle
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      {/* Información de seguridad */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div className="text-left">
            <p className="text-blue-300 text-sm font-medium">Consejos de seguridad:</p>
            <ul className="text-blue-200 text-xs mt-1 space-y-1">
              <li>• Usa una combinación de letras, números y símbolos</li>
              <li>• Evita información personal como nombres o fechas</li>
              <li>• No reutilices contraseñas de otras cuentas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Botón de envío */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading || !passwordStrength.isValid}
      >
        {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
      </Button>

      {/* Link para volver al login */}
      <div className="text-center pt-4 border-t border-white/10">
        <span className="text-gray-400 text-sm">¿Recordaste tu contraseña? </span>
        <Link
          to={PATHS.public.login}
          className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
        >
          Volver al login
        </Link>
      </div>
    </form>
  );
};