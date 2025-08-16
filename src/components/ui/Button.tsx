import React, { forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import { ButtonVariant, ButtonSize } from '../../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Componente Button reutilizable con estilos glassmorphism
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Estilos base
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

    // Estilos por variante
    const variantStyles = {
      primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 focus:ring-purple-500',
      secondary: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 focus:ring-white/50',
      ghost: 'text-cyan-400 hover:text-cyan-300 hover:bg-white/5 focus:ring-cyan-400',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500'
    };

    // Estilos por tamaño
    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };

    // Estilos de ancho completo
    const widthStyles = fullWidth ? 'w-full' : '';

    // Combinar todas las clases
    const buttonClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      widthStyles,
      className
    );

    // Renderizar icono de loading
    const LoadingIcon = () => (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
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
        return iconPosition === 'left' ? (
          <>
            <span className="mr-2">{icon}</span>
            {children}
          </>
        ) : (
          <>
            {children}
            <span className="ml-2">{icon}</span>
          </>
        );
      }

      return children;
    };

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

Button.displayName = 'Button';