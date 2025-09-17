import React, { forwardRef } from "react";
import { ButtonVariant, ButtonSize } from "../../types";
import { cn } from "../../core/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Componente Button reutilizable con estilos glassmorphism y accesibilidad optimizada
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      className,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Estilos base con mejoras de accesibilidad y responsive
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden min-h-[44px] sm:min-h-[48px] md:min-h-[52px] touch-manipulation select-none";

    // Estilos por variante
    const variantStyles = {
      primary:
        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 focus:ring-purple-500",
      secondary:
        "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 focus:ring-white/50",
      ghost:
        "text-cyan-400 hover:text-cyan-300 hover:bg-white/5 focus:ring-cyan-400",
      danger:
        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
    };

    // Estilos por tamaño - responsive y accesible mejorado
    const sizeStyles = {
      sm: "px-4 py-2 text-sm sm:px-5 sm:py-2.5 md:px-6 md:py-3 md:text-base min-w-[88px] sm:min-w-[96px] md:min-w-[104px]",
      md: "px-5 py-3 text-sm sm:px-6 sm:py-3.5 sm:text-base md:px-8 md:py-4 md:text-lg min-w-[100px] sm:min-w-[112px] md:min-w-[128px]",
      lg: "px-6 py-4 text-base sm:px-8 sm:py-5 sm:text-lg md:px-10 md:py-6 md:text-xl min-w-[120px] sm:min-w-[140px] md:min-w-[160px]",
    };

    // Estilos de ancho completo
    const widthStyles = fullWidth ? "w-full" : "";

    // Combinar todas las clases
    const buttonClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      widthStyles,
      className
    );

    // Renderizar icono de loading con accesibilidad
    const LoadingIcon = () => (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // Renderizar contenido del botón
    const renderContent = () => {
      if (loading) {
        return (
          <>
            <LoadingIcon />
            {children}
          </>
        );
      }

      if (icon) {
        return iconPosition === "left" ? (
          <>
            <span className="mr-2" aria-hidden="true">{icon}</span>
            {children}
          </>
        ) : (
          <>
            {children}
            <span className="ml-2" aria-hidden="true">{icon}</span>
          </>
        );
      }

      return children;
    };

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {renderContent()}
        {loading && <span className="sr-only">Cargando...</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
