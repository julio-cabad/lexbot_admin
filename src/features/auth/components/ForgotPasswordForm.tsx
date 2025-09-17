import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useToast } from "../../../hooks/ui";
import { PATHS } from "../../../config/routes";
import { useForgotPasswordForm } from "../hooks";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  showBackToLogin?: boolean;
}

/**
 * Componente de formulario para recuperación de contraseña
 */
export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  showBackToLogin = true,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useForgotPasswordForm();

  // Manejar envío del formulario
  const onSubmit = (formValues: typeof values) => {
    setIsLoading(true);
    setError(null);

    // Usar Promise para manejar la operación async
    (async () => {
      try {
        // Simular llamada a la API de recuperación de contraseña
        // En una implementación real, esto llamaría a authService.sendPasswordResetEmail
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simular delay

        setIsSubmitted(true);
        showSuccess("Email de recuperación enviado correctamente");

        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al enviar el email de recuperación";
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  // Si ya se envió el email, mostrar mensaje de confirmación
  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        {/* Icono de éxito */}
        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-scale-in">
          <svg
            className="w-8 h-8 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Mensaje de éxito */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">¡Email Enviado!</h3>
          <p className="text-gray-300 text-sm">
            Hemos enviado un enlace de recuperación a{" "}
            <strong>{values.email}</strong>
          </p>
          <p className="text-gray-400 text-xs">
            Revisa tu bandeja de entrada y sigue las instrucciones para
            restablecer tu contraseña.
          </p>
        </div>

        {/* Instrucciones adicionales */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-left">
              <p className="text-blue-300 text-sm font-medium">
                ¿No recibiste el email?
              </p>
              <ul className="text-blue-200 text-xs mt-1 space-y-1">
                <li>• Revisa tu carpeta de spam</li>
                <li>• Verifica que el email sea correcto</li>
                <li>• El enlace expira en 1 hora</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => {
              setIsSubmitted(false);
              setError(null);
            }}
          >
            Enviar Otro Email
          </Button>

          {showBackToLogin && (
            <Link to={PATHS.public.login}>
              <Button variant="ghost" size="lg" fullWidth>
                Volver al Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Handler para el evento de submit del formulario
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-6 sm:space-y-7 md:space-y-8"
      role="form"
      aria-label="Formulario de recuperación de contraseña"
    >
      {/* Descripción - accesibilidad mejorada */}
      <div className="text-center space-y-3 mb-6 sm:mb-8">
        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Recuperar contraseña
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Ingresa tu dirección de correo electrónico y te enviaremos un enlace
            seguro para restablecer tu contraseña.
          </p>
        </div>
      </div>

      {/* Error general */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Campo Email - accesibilidad mejorada */}
      <Input
        label="Dirección de correo electrónico"
        inputType="email"
        placeholder="ejemplo@correo.com"
        value={values.email}
        onChange={(e) => handleChange("email")(e.target.value)}
        onBlur={handleBlur("email")}
        error={touched.email ? errors.email : undefined}
        disabled={isLoading}
        required
        autoComplete="email"
        aria-describedby={
          touched.email && errors.email ? "email-error" : "email-help"
        }
        helperText="Ingresa el email asociado a tu cuenta"
        leftIcon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
          </svg>
        }
      />

      {/* Botón de envío */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "Enviar Email de Recuperación"}
      </Button>

      {/* Link para volver al login - accesibilidad mejorada */}
      {showBackToLogin && (
        <div className="text-center pt-6 sm:pt-4 border-t border-white/10">
          <p className="text-gray-400 text-sm sm:text-base">
            ¿Recordaste tu contraseña?{" "}
            <Link
              to={PATHS.public.login}
              className="text-cyan-400 hover:text-cyan-300 focus:text-cyan-300 transition-colors font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-md px-1 py-1"
              aria-label="Volver a la página de inicio de sesión"
            >
              Volver al login
            </Link>
          </p>
        </div>
      )}
    </form>
  );
};
