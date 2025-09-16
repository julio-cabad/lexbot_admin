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
 * Componente Input reutilizable con estilos glassmorphism y accesibilidad optimizada
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
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    // Generar ID único si no se proporciona
    const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

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

    // Estilos de padding considerando iconos - responsive mejorado
    const paddingStyles = cn(
      "px-3 py-3 sm:px-4 sm:py-3 md:px-5 md:py-4", // Padding escalado para diferentes pantallas
      leftIcon ? "pl-10 sm:pl-12 md:pl-14" : "",
      rightIcon || (inputType === "password" && showPasswordToggle)
        ? "pr-10 sm:pr-12 md:pr-14"
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

    // Estilos del label - responsive y accesible mejorado
    const labelStyles = cn(
      "block text-sm sm:text-base md:text-lg font-medium mb-2 sm:mb-2 md:mb-3 transition-colors duration-200",
      error ? "text-red-400" : isFocused ? "text-cyan-400" : "text-gray-200",
      disabled && "opacity-50"
    );

    // Icono de toggle de contraseña - accesibilidad mejorada
    const PasswordToggleIcon = () => (
      <button
        type="button"
        className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-md p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white/10 focus:bg-white/10"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Ocultar contraseña. Actualmente visible." : "Mostrar contraseña. Actualmente oculta."}
        aria-pressed={showPassword}
        tabIndex={0}
        title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
        {label && (
          <label htmlFor={inputId} className={labelStyles}>
            {label}
            {props.required && <span className="text-red-400 ml-1" aria-label="requerido">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-2 sm:left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true">
              <div className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center">
                {leftIcon}
              </div>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={inputStyles}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={cn(
              error && errorId,
              helperText && helperId
            ).trim() || undefined}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && !showPasswordToggle && (
            <div className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true">
              <div className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center">
                {rightIcon}
              </div>
            </div>
          )}

          {/* Password Toggle */}
          {inputType === "password" && showPasswordToggle && (
            <PasswordToggleIcon />
          )}
        </div>

        {/* Helper Text or Error - responsive mejorado */}
        {error && (
          <p
            id={errorId}
            className="text-sm sm:text-base md:text-base mt-2 text-red-400 flex items-start gap-2"
            role="alert"
            aria-live="polite"
          >
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </p>
        )}
        {helperText && !error && (
          <p
            id={helperId}
            className="text-xs sm:text-sm md:text-base mt-2 text-gray-400 flex items-start gap-2"
          >
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{helperText}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
