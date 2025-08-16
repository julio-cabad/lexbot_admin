import React, { forwardRef, useState } from "react";
import { cn } from "../../utils/classNames";
import { InputType } from "../../types";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputType?: InputType;
  showPasswordToggle?: boolean;
  fullWidth?: boolean;
}

/**
 * Componente Input reutilizable con estilos glassmorphism
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      inputType = "text",
      showPasswordToggle = false,
      fullWidth = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Determinar el tipo de input
    const type = inputType === "password" && showPassword ? "text" : inputType;

    // Estilos base del contenedor
    const containerStyles = fullWidth ? "w-full" : "";

    // Estilos base del input
    const baseInputStyles =
      "w-full rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 placeholder-gray-400";

    // Estilos por estado
    const stateStyles = error
      ? "bg-white/10 backdrop-blur-md border-red-400 text-white focus:border-red-400 focus:ring-red-400/20"
      : "bg-white/10 backdrop-blur-md border-white/20 text-white focus:border-cyan-400 focus:ring-cyan-400/20";

    // Estilos de padding considerando iconos
    const paddingStyles = cn(
      "px-4 py-3",
      leftIcon ? "pl-12" : "",
      rightIcon || (inputType === "password" && showPasswordToggle)
        ? "pr-12"
        : ""
    );

    // Estilos del input completo
    const inputStyles = cn(
      baseInputStyles,
      stateStyles,
      paddingStyles,
      disabled && "opacity-50 cursor-not-allowed",
      className
    );

    // Estilos del label
    const labelStyles = cn(
      "block text-sm font-medium mb-2 transition-colors duration-200",
      error ? "text-red-400" : isFocused ? "text-cyan-400" : "text-gray-200"
    );

    // Icono de toggle de contraseña
    const PasswordToggleIcon = () => (
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
      >
        {showPassword ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    );

    return (
      <div className={containerStyles}>
        {/* Label */}
        {label && <label className={labelStyles}>{label}</label>}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={type}
            className={inputStyles}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && !showPasswordToggle && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}

          {/* Password Toggle */}
          {inputType === "password" && showPasswordToggle && (
            <PasswordToggleIcon />
          )}
        </div>

        {/* Helper Text or Error */}
        {(error || helperText) && (
          <p
            className={cn(
              "text-sm mt-1",
              error ? "text-red-400" : "text-gray-400"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
