import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PasswordStrengthMeter } from '../ui/PasswordStrengthMeter';
import { useRegisterForm } from '../../hooks/auth';
import { usePasswordStrength } from '../../hooks/auth';
import { ROUTES } from '../../utils/constants';

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
  } = useRegisterForm(onSuccess);

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
      className="space-y-6 sm:space-y-7 md:space-y-8"
      role="form"
      aria-label="Formulario de registro de nueva cuenta"
    >
      {/* Error general del formulario - accesibilidad mejorada */}
      {formError && (
        <div 
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 sm:p-5 md:p-6 animate-fade-in"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="flex items-start gap-3">
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-400 text-sm sm:text-base font-medium">Error en el registro</p>
              <p className="text-red-300 text-sm sm:text-base mt-1">{formError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Campo Nombre Completo - accesibilidad mejorada */}
      <Input
        label="Nombre completo"
        inputType="text"
        placeholder="Ingresa tu nombre y apellidos"
        value={values.displayName}
        onChange={(e) => handleInputChange('displayName')(e.target.value)}
        onBlur={handleBlur('displayName')}
        error={touched.displayName ? errors.displayName : undefined}
        disabled={isSubmitting}
        required
        autoComplete="name"
        aria-describedby={touched.displayName && errors.displayName ? "displayName-error" : undefined}
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      {/* Campo Email - accesibilidad mejorada */}
      <Input
        label="Dirección de correo electrónico"
        inputType="email"
        placeholder="ejemplo@correo.com"
        value={values.email}
        onChange={(e) => handleInputChange('email')(e.target.value)}
        onBlur={handleBlur('email')}
        error={touched.email ? errors.email : undefined}
        disabled={isSubmitting}
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
          label="Contraseña"
          inputType="password"
          placeholder="••••••••"
          value={values.password}
          onChange={(e) => handleInputChange('password')(e.target.value)}
          onBlur={handleBlur('password')}
          error={touched.password ? errors.password : undefined}
          disabled={isSubmitting}
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
        label="Confirmar Contraseña"
        inputType="password"
        placeholder="••••••••"
        value={values.confirmPassword}
        onChange={(e) => handleInputChange('confirmPassword')(e.target.value)}
        onBlur={handleBlur('confirmPassword')}
        error={touched.confirmPassword ? errors.confirmPassword : undefined}
        disabled={isSubmitting}
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
          <legend className="text-sm sm:text-base font-medium text-gray-200 px-2">
            Términos y condiciones
          </legend>
          <label className="flex items-start cursor-pointer group focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-transparent rounded-md p-2 -m-2">
            <div className="relative mt-1">
              <input
                type="checkbox"
                checked={values.acceptTerms}
                onChange={(e) => handleChange('acceptTerms')(e.target.checked)}
                disabled={isSubmitting}
                required
                className="sr-only"
                aria-describedby="terms-description terms-error"
              />
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 transition-all duration-200 ${
                values.acceptTerms 
                  ? 'bg-purple-500 border-purple-500' 
                  : 'bg-white/10 border-white/20 group-hover:border-white/40 group-focus-within:border-cyan-400'
              }`}>
                {values.acceptTerms && (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div className="ml-3 sm:ml-4">
              <span id="terms-description" className="text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors">
                Acepto los{' '}
                <button
                  type="button"
                  className="text-cyan-400 hover:text-cyan-300 focus:text-cyan-300 transition-colors font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-md px-1"
                  aria-label="Abrir términos y condiciones en nueva ventana"
                >
                  términos y condiciones
                </button>
                {' '}y la{' '}
                <button
                  type="button"
                  className="text-cyan-400 hover:text-cyan-300 focus:text-cyan-300 transition-colors font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-md px-1"
                  aria-label="Abrir política de privacidad en nueva ventana"
                >
                  política de privacidad
                </button>
              </span>
              {touched.acceptTerms && errors.acceptTerms && (
                <p id="terms-error" className="text-red-400 text-xs sm:text-sm mt-2 flex items-start gap-2" role="alert">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.acceptTerms}</span>
                </p>
              )}
            </div>
          </label>
        </fieldset>
      </div>

      {/* Botón de envío */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting || !passwordStrength.isValid}
      >
        {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>

      {/* Link para login */}
      {showLoginLink && (
        <div className="text-center pt-4 border-t border-white/10">
          <span className="text-gray-400 text-sm">¿Ya tienes cuenta? </span>
          <Link
            to={ROUTES.LOGIN}
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
          >
            Iniciar sesión
          </Link>
        </div>
      )}
    </form>
  );
};