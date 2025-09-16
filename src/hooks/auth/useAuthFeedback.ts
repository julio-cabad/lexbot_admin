import { useEffect } from "react";
import { useToast } from "../ui";

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

  useEffect(() => {
    if (success) {
      switch (context) {
        case "login":
          authToasts.loginSuccess();
          break;
        case "register":
          authToasts.registerSuccess();
          break;
        case "forgot-password":
          authToasts.passwordResetSent();
          break;
        case "reset-password":
          authToasts.passwordResetSuccess();
          break;
      }
    }
  }, [success, context, authToasts]);

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
