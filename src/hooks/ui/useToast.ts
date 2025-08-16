import React, { useCallback } from "react";
import { toast, ToastOptions, Id } from "react-toastify";
import { ToastType, ToastMessage } from "../../types";

/**
 * Hook para manejo de notificaciones toast
 */
export const useToast = () => {
  // Mostrar toast genérico
  const showToast = (
    message: string | React.ReactNode,
    type: ToastType = ToastType.INFO,
    options?: ToastOptions
  ) => {
    const defaultOptions: ToastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    const toastOptions = { ...defaultOptions, ...options };

    switch (type) {
      case ToastType.SUCCESS:
        return toast.success(message, toastOptions);
      case ToastType.ERROR:
        return toast.error(message, toastOptions);
      case ToastType.WARNING:
        return toast.warning(message, toastOptions);
      case ToastType.INFO:
      default:
        return toast.info(message, toastOptions);
    }
  };

  // Mostrar toast de éxito
  const showSuccess = (message: string, options?: ToastOptions) => {
    return showToast(message, ToastType.SUCCESS, options);
  };

  // Mostrar toast de error
  const showError = (message: string, options?: ToastOptions) => {
    return showToast(message, ToastType.ERROR, options);
  };

  // Mostrar toast de advertencia
  const showWarning = (message: string, options?: ToastOptions) => {
    return showToast(message, ToastType.WARNING, options);
  };

  // Mostrar toast de información
  const showInfo = (message: string, options?: ToastOptions) => {
    return showToast(message, ToastType.INFO, options);
  };

  // Mostrar toast personalizado con título
  const showCustomToast = (
    toastMessage: ToastMessage,
    options?: ToastOptions
  ) => {
    const content = React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "font-semibold" },
        toastMessage.title
      ),
      toastMessage.message &&
        React.createElement(
          "div",
          { className: "text-sm opacity-90" },
          toastMessage.message
        )
    );

    const toastOptions: ToastOptions = {
      autoClose: toastMessage.duration || 5000,
      ...options,
    };

    return showToast(content, toastMessage.type, toastOptions);
  };

  // Cerrar toast específico
  const dismissToast = (toastId: Id) => {
    toast.dismiss(toastId);
  };

  // Cerrar todos los toasts
  const dismissAllToasts = () => {
    toast.dismiss();
  };

  // Verificar si hay toasts activos
  const isActive = (toastId: Id) => {
    return toast.isActive(toastId);
  };

  // Toasts específicos para autenticación
  const authToasts = {
    loginSuccess: () => showSuccess("¡Bienvenido de vuelta!"),
    loginError: (error: string) =>
      showError(`Error al iniciar sesión: ${error}`),
    registerSuccess: () => showSuccess("¡Cuenta creada exitosamente!"),
    registerError: (error: string) =>
      showError(`Error al registrarse: ${error}`),
    logoutSuccess: () => showInfo("¡Hasta luego!"),
    passwordResetSent: () => showSuccess("Email de recuperación enviado"),
    passwordResetError: (error: string) =>
      showError(`Error al enviar email: ${error}`),
    passwordResetSuccess: () =>
      showSuccess("Contraseña actualizada exitosamente"),
    emailVerificationSent: () => showSuccess("Email de verificación enviado"),
    profileUpdated: () => showSuccess("Perfil actualizado exitosamente"),
    sessionExpired: () =>
      showWarning("Tu sesión ha expirado. Por favor inicia sesión nuevamente."),
    sessionExtended: () => showInfo("Sesión extendida exitosamente"),
  };

  return {
    // Funciones básicas
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCustomToast,

    // Funciones de control
    dismissToast,
    dismissAllToasts,
    isActive,

    // Toasts específicos
    authToasts,
  };
};
