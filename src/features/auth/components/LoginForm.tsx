import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useLoginForm } from "../hooks";
import { usePostLoginRedirect } from "../hooks";
import { PATHS } from "../../../config/routes";
import { useTexts } from "../../../core/hooks/useTexts";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string | null) => void;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  showRegisterLink?: boolean;
}

/**
 * Componente de formulario de login con validación y manejo de estado
 */

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  showForgotPassword = true,
  showRegisterLink = true,
}) => {
  // Usar textos centralizados con valores por defecto para evitar problemas de tipo
  const { auth, common } = useTexts();

  // Hook for post-login redirection
  usePostLoginRedirect();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    formError,
    handleChange,
    handleBlur,
    handleSubmit,
    clearFormError,
  } = useLoginForm(onSuccess);

  // Notificar error al padre (LoginPage) para mostrar toast
  React.useEffect(() => {
    if (typeof onError === "function") {
      // Asegurarnos de que formError sea string o null
      const errorMessage = formError
        ? typeof formError === "string"
          ? formError
          : JSON.stringify(formError)
        : null;
      onError(errorMessage);
    }
  }, [formError, onError]);

  // Limpiar errores cuando el usuario empiece a escribir
  const handleInputChange = (field: keyof typeof values) => (value: any) => {
    if (formError) {
      clearFormError();
    }
    handleChange(field)(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 sm:space-y-7 md:space-y-8 auth-form"
      noValidate
      role="form"
      aria-label={auth.loginTitle}
    >
      {/* El error se maneja a través de toasts */}

      {/* Campo Email - accesibilidad mejorada */}
      <Input
        label={auth.emailPlaceholder}
        inputType="email"
        placeholder={auth.emailPlaceholder}
        value={values.email}
        onChange={(e) => handleInputChange("email")(e.target.value)}
        onBlur={handleBlur("email")}
        error={touched.email ? errors.email : undefined}
        disabled={!!isSubmitting}
        required
        autoComplete="email"
        aria-describedby={
          touched.email && errors.email ? "email-error" : undefined
        }
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

      {/* Campo Contraseña - accesibilidad mejorada */}
      <Input
        label={auth.passwordPlaceholder}
        inputType="password"
        placeholder={auth.passwordPlaceholder}
        value={values.password}
        onChange={(e) => handleInputChange("password")(e.target.value)}
        onBlur={handleBlur("password")}
        error={touched.password ? errors.password : undefined}
        disabled={!!isSubmitting}
        required
        autoComplete="current-password"
        showPasswordToggle
        aria-describedby={
          touched.password && errors.password ? "password-error" : undefined
        }
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        }
      />

      {/* Opciones adicionales - responsive y accesibilidad mejorada */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 sm:gap-2">
        {/* Checkbox Recordarme */}

        {/* Link Olvidé mi contraseña */}
        {showForgotPassword && (
          <Link
            to={PATHS.public.forgotPassword}
            className="text-sm sm:text-sm text-cyan-400 hover:text-cyan-300 focus:text-cyan-300 transition-colors font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-md px-1 py-1"
            aria-label="Ir a la página de recuperación de contraseña"
          >
            {auth.forgotPassword}
          </Link>
        )}
      </div>

      {/* Botón de envío */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={!!isSubmitting}
        disabled={!!isSubmitting}
      >
        {isSubmitting ? common.loading : auth.loginButton}
      </Button>

      {/* Link para registro - accesibilidad mejorada */}
      {showRegisterLink && (
        <div className="text-center pt-6 sm:pt-4 border-t border-white/10">
          <p className="text-gray-400 text-sm sm:text-base">
            {auth.noAccount}{" "}
            <Link
              to={PATHS.public.register}
              className="text-cyan-400 hover:text-cyan-300 focus:text-cyan-300 transition-colors font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-md px-1 py-1"
              aria-label="Ir a la página de registro para crear una nueva cuenta"
            >
              {auth.createAccount}
            </Link>
          </p>
        </div>
      )}
    </form>
  );
};
