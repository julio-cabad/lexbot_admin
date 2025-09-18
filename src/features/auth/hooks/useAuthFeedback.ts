import { useEffect } from "react";
import { useToast } from "../../../hooks";
import { useAuth } from "./useAuth";

interface AuthFeedbackOptions {
  success?: boolean;
  error?: string | null;
  context: "login" | "register" | "forgot-password" | "reset-password";
}

/**
 * Hook centralizado para mostrar feedback de autenticación (toasts personalizados)
 * según el contexto (login, registro, recuperación, etc.)
 */
export function useAuthFeedback({ success, error, context }: AuthFeedbackOptions) {
  const { authToasts } = useToast();
  const { clearLoginSuccess, clearRegisterSuccess } = useAuth();

  useEffect(() => {
    if (success) {
      switch (context) {
        case "login":
          authToasts.loginSuccess();
          // Limpiar el estado de éxito después de mostrar el toast
          setTimeout(() => clearLoginSuccess(), 100);
          break;
        case "register":
          authToasts.registerSuccess();
          // Limpiar el estado de éxito después de mostrar el toast
          setTimeout(() => clearRegisterSuccess(), 100);
          break;
        case "forgot-password":
          authToasts.passwordResetSent();
          break;
        case "reset-password":
          authToasts.passwordResetSuccess();
          break;
      }
    }
  }, [success, context, authToasts, clearLoginSuccess, clearRegisterSuccess]);

  useEffect(() => {
    if (error) {
      switch (context) {
        case "login":
          authToasts.loginError(error);
          break;
        case "register":
          authToasts.registerError(error);
          break;
        case "forgot-password":
          authToasts.passwordResetError(error);
          break;
        case "reset-password":
          authToasts.passwordResetError(error);
          break;
      }
    }
  }, [error, context, authToasts]);
}
