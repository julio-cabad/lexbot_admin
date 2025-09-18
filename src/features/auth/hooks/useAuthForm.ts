import { useState, useCallback, useEffect } from "react";
import { useAuth } from "./useAuth";
import { LoginCredentials, RegisterData, PasswordResetData, NewPasswordData, AuthFormType } from "../types";
import { validateLoginForm, validateRegisterForm, validatePasswordResetForm, validateNewPasswordForm, validationErrorsToFormErrors } from "../utils/validation";
import { useForm } from "../../../hooks";


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
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      
      try {
        let result;

        switch (formType) {
          case "login":
            result = await auth.login(values as LoginCredentials);
            break;
          case "register":
            result = await auth.register(values as RegisterData);
            break;
          case "forgot-password":
            result = await auth.sendPasswordReset(values as PasswordResetData);
            break;
          case "reset-password":
            result = await auth.confirmPasswordReset(values as NewPasswordData);
            break;
          default:
            throw new Error(`Tipo de formulario no soportado: ${formType}`);
        }


        // Si la operación fue exitosa, llamar callback de éxito
        // Verificar si result tiene la estructura esperada (para thunks reales)
        if (result?.meta?.requestStatus === "fulfilled" && onSuccess) {
          onSuccess();
        } else if (onSuccess) {
          // Para stubs temporales, asumimos éxito
          onSuccess();
        }
      } catch (error) {
        console.error(`Error en ${formType}:`, error);
        // Intentar mostrar un mensaje de error más descriptivo
        if (error instanceof Error) {
          console.error('Mensaje de error:', error.message);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formType, auth, isSubmitting, onSuccess, form.errors, form.isValid]
  );

  // Obtener error específico del tipo de formulario
  const getFormError = useCallback(() => {
    switch (formType) {
      case "login":
        return auth.loginError;
      case "register":
        return auth.registerError;
      case "forgot-password":
        return null; // Los errores de forgot password se manejan en el componente
      case "reset-password":
        return null; // Los errores de reset password se manejan en el componente
      default:
        return null;
    }
  }, [formType, auth]);

  // Obtener estado de loading específico del tipo de formulario
  const getFormLoading = useCallback(() => {
    switch (formType) {
      case "login":
        return auth.isLoginLoading;
      case "register":
        return auth.isRegisterLoading;
      case "forgot-password":
        return false; // Se maneja localmente
      case "reset-password":
        return false; // Se maneja localmente
      default:
        return false;
    }
  }, [formType, auth]);

  // Obtener estado de éxito específico del tipo de formulario
  const getFormSuccess = useCallback(() => {
    switch (formType) {
      case "login":
        return auth.loginSuccess;
      case "register":
        return auth.registerSuccess;
      case "forgot-password":
        return false; // Se maneja localmente
      case "reset-password":
        return false; // Se maneja localmente
      default:
        return false;
    }
  }, [formType, auth]);

  // Limpiar errores cuando el componente se desmonta o cambia el tipo
  useEffect(() => {
    return () => {
      switch (formType) {
        case "login":
          auth.clearLoginError();
          break;
        case "register":
          auth.clearRegisterError();
          break;
      }
    };
  }, [formType, auth]);

  // Función para limpiar errores manualmente
  const clearFormError = useCallback(() => {
    switch (formType) {
      case "login":
        auth.clearLoginError();
        break;
      case "register":
        auth.clearRegisterError();
        break;
    }
  }, [formType, auth]);

  return {
    // Propiedades del formulario
    ...form,

    // Estados específicos del formulario de auth
    isSubmitting: isSubmitting || getFormLoading(),
    formError: getFormError(),
    formSuccess: getFormSuccess(),

    // Funciones
    handleSubmit: form.handleSubmit(handleSubmit),
    clearFormError,

    // Datos del usuario (útil para formularios que necesitan mostrar info del usuario)
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
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