import { useState, useCallback } from "react";
import { useForm } from "../forms";
import { authService } from "../../services";
import {
  LoginCredentials,
  RegisterData,
  PasswordResetData,
  NewPasswordData,
  AuthFormType,
} from "../../types";
import {
  validateLoginForm,
  validateRegisterForm,
  validatePasswordResetForm,
  validateNewPasswordForm,
  validationErrorsToFormErrors,
} from "../../utils";

/**
 * Hook especializado para formularios de autenticación
 * Combina validación, manejo de estado y acciones de auth
 */
export const useAuthForm = <
  T extends
    | LoginCredentials
    | RegisterData
    | PasswordResetData
    | NewPasswordData
>(
  formType: AuthFormType,
  initialValues: T,
  onSuccess?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Configurar validación según el tipo de formulario
  const validateForm = useCallback(
    (values: T) => {
      switch (formType) {
        case "login":
          return validateLoginForm(values as LoginCredentials);
        case "register":
          return validateRegisterForm(values as RegisterData);
        case "forgot-password":
          return validatePasswordResetForm(values as PasswordResetData);
        case "reset-password":
          return validateNewPasswordForm(values as NewPasswordData);
        default:
          return [];
      }
    },
    [formType]
  );

  // Hook de formulario con validación personalizada
  const form = useForm<T>({
    initialValues,
    validate: (values) => {
      const errors = validateForm(values);
      return validationErrorsToFormErrors(errors) as Partial<
        Record<keyof T, string>
      >;
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Función de envío según el tipo de formulario
  const handleSubmit = useCallback(
    async (values: T) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      setFormError(null);

      try {
        switch (formType) {
          case "login":
            await authService.login(values as LoginCredentials);
            break;
          case "register":
            await authService.register(values as RegisterData);
            break;
          case "forgot-password":
            await authService.sendPasswordResetEmail(
              values as PasswordResetData
            );
            break;
          case "reset-password":
            await authService.confirmPasswordReset(values as NewPasswordData);
            break;
          default:
            throw new Error(`Tipo de formulario no soportado: ${formType}`);
        }

        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        console.error(`Error en ${formType}:`, error);
        setFormError(error.message || "Ocurrió un error inesperado.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formType, isSubmitting, onSuccess]
  );

  const clearFormError = () => {
    setFormError(null);
  };

  return {
    // Propiedades del formulario
    ...form,

    // Estados específicos del formulario de auth
    isSubmitting,
    formError,

    // Funciones
    handleSubmit: form.handleSubmit(handleSubmit),
    clearFormError,
  };
};

/**
 * Hook específico para formulario de login
 */
export const useLoginForm = (onSuccess?: () => void) => {
  return useAuthForm<LoginCredentials>(
    "login",
    {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSuccess
  );
};

/**
 * Hook específico para formulario de registro
 */
export const useRegisterForm = (onSuccess?: () => void) => {
  return useAuthForm<RegisterData>(
    "register",
    {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      acceptTerms: false,
    },
    onSuccess
  );
};

/**
 * Hook específico para formulario de recuperación de contraseña
 */
export const useForgotPasswordForm = (onSuccess?: () => void) => {
  return useAuthForm<PasswordResetData>(
    "forgot-password",
    {
      email: "",
    },
    onSuccess
  );
};

/**
 * Hook específico para formulario de nueva contraseña
 */
export const useResetPasswordForm = (code: string, onSuccess?: () => void) => {
  return useAuthForm<NewPasswordData>(
    "reset-password",
    {
      code,
      newPassword: "",
      confirmPassword: "",
    },
    onSuccess
  );
};
