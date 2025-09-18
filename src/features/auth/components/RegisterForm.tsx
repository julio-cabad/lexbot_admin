import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { PasswordStrengthMeter } from '../../../components/ui/PasswordStrengthMeter';
import { useRegisterForm, usePasswordStrength } from '../hooks';
import { PATHS } from '../../../config/routes';
import { useTexts } from '../../../core/hooks/useTexts';
import { useToast } from '../../../hooks';

interface RegisterFormProps {
  onSuccess?: () => void;
  showLoginLink?: boolean;
}

/**
 * Componente de formulario de registro con validación y medidor de fuerza de contraseña
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  showLoginLink = true
}) => {
  // Usar textos centralizados directamente
  const { auth } = useTexts();
  const { authToasts } = useToast();
  
  // Función que maneja el éxito del registro
  const handleRegisterSuccess = () => {
    authToasts.registerSuccess();
    if (onSuccess) {
      onSuccess();
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    formError,
    handleChange,
    handleBlur,
    handleSubmit,
    clearFormError
  } = useRegisterForm(handleRegisterSuccess);

  // Hook para evaluar la fuerza de la contraseña
  const passwordStrength = usePasswordStrength(values.password);

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
      role="form"
      aria-label={auth.registerTitle}
    >
      {/* Mostrar error del formulario si existe */}
      {formError && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-white text-sm">
          {formError}
        </div>
      )}


      {/* Campo Email - accesibilidad mejorada */}
      <Input
        label={auth.emailPlaceholder}
        inputType="email"
        placeholder={auth.emailPlaceholder}
        value={values.email}
        onChange={(e) => handleInputChange('email')(e.target.value)}
        onBlur={handleBlur('email')}
        error={touched.email ? errors.email : undefined}
        disabled={!!isSubmitting}
        required
        autoComplete="email"
        aria-describedby={touched.email && errors.email ? "email-error" : undefined}
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        }
      />

      {/* Campo Contraseña */}
      <div className="space-y-2">
        <Input
          label={auth.passwordPlaceholder}
          inputType="password"
          placeholder={auth.passwordPlaceholder}
          value={values.password}
          onChange={(e) => handleInputChange('password')(e.target.value)}
          onBlur={handleBlur('password')}
          error={touched.password ? errors.password : undefined}
          disabled={!!isSubmitting}
          showPasswordToggle
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        {/* Medidor de fuerza de contraseña */}
        <PasswordStrengthMeter password={values.password} />
      </div>

      {/* Campo Confirmar Contraseña */}
      <Input
        label={auth.confirmPasswordPlaceholder}
        inputType="password"
        placeholder={auth.confirmPasswordPlaceholder}
        value={values.confirmPassword}
        onChange={(e) => handleInputChange('confirmPassword')(e.target.value)}
        onBlur={handleBlur('confirmPassword')}
        error={touched.confirmPassword ? errors.confirmPassword : undefined}
        disabled={!!isSubmitting}
        showPasswordToggle
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      {/* Checkbox Términos y Condiciones - accesibilidad mejorada */}
      <div className="space-y-4">
        <fieldset className="border border-white/10 rounded-lg p-4 sm:p-5">
          <legend className="text-base font-medium text-white px-2">
            Términos y condiciones
          </legend>
          <div className="flex flex-row items center">
            {/* Checkbox en su propio contenedor */}
            <div className="flex justify-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.acceptTerms}
                  onChange={(e) => handleChange('acceptTerms')(e.target.checked)}
                  disabled={!!isSubmitting}
                  required
                  className="sr-only"
                  aria-describedby="terms-description terms-error"
                />
                <div className={`w-5 h-5 rounded border transition-all duration-200 ${values.acceptTerms
                    ? 'bg-purple-500 border-purple-500'
                    : 'bg-white/10 border-white/20 hover:border-white/40'
                  }`}>
                  {values.acceptTerms && (
                    <svg className="w-3 h-3 text-white absolute top-1 left-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </label>
            </div>

            {/* Texto en su propio contenedor */}
            <div className="ml-2">
              <span id="terms-description" className="text-base text-white">
                Acepto los{' '}
                <button
                  type="button"
                  className="text-cyan-400 hover:text-cyan-300 focus:text-cyan-300 transition-colors underline hover:no-underline"
                  aria-label="Abrir términos y condiciones en nueva ventana"
                >
                  términos y condiciones
                </button>
                {' '}y la{' '}
                <button
                  type="button"
                  className="text-cyan-400 hover:text-cyan-300 focus:text-cyan-300 transition-colors underline hover:no-underline"
                  aria-label="Abrir política de privacidad en nueva ventana"
                >
                  política de privacidad
                </button>
              </span>
            </div>

            {/* Mensaje de error */}
            {touched.acceptTerms && errors.acceptTerms && (
              <p id="terms-error" className="text-red-400 text-xs text-center mt-1" role="alert">
                {errors.acceptTerms}
              </p>
            )}
          </div>
        </fieldset>
      </div>

      {/* Botón de envío */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={!!isSubmitting}
        disabled={!!isSubmitting || !passwordStrength.isValid}
      >
        {isSubmitting ? 'Creando cuenta...' : auth.registerButton}
      </Button>

      {/* Link para login */}
      {showLoginLink && (
        <div className="text-center pt-4 border-t border-white/10">
          <span className="text-gray-400 text-sm">{auth.alreadyHaveAccount} </span>
          <Link
            to={PATHS.public.login}
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
          >
            {auth.loginButton}
          </Link>
        </div>
      )}
    </form>
  );
};