import React, { forwardRef } from 'react';
import { cn } from '../../utils/classNames';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Componente Checkbox reutilizable con estilos glassmorphism
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      size = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Estilos por tamaño
    const sizeStyles = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    // Estilos del checkbox
    const checkboxStyles = cn(
      'rounded border-2 transition-all duration-200 focus:ring-2 focus:ring-offset-0',
      sizeStyles[size],
      error
        ? 'border-red-400 text-red-500 focus:ring-red-400/20'
        : 'border-white/30 text-cyan-500 focus:ring-cyan-400/20 bg-white/10 backdrop-blur-sm',
      'checked:bg-gradient-to-r checked:from-purple-500 checked:to-pink-500 checked:border-transparent',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    );

    // Estilos del label
    const labelStyles = cn(
      'font-medium transition-colors duration-200',
      size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base',
      error ? 'text-red-400' : 'text-gray-200',
      disabled && 'opacity-50 cursor-not-allowed'
    );

    // Estilos de la descripción
    const descriptionStyles = cn(
      'text-sm text-gray-400 mt-1',
      disabled && 'opacity-50'
    );

    return (
      <div className="flex flex-col">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              className={checkboxStyles}
              disabled={disabled}
              {...props}
            />
          </div>
          {(label || description) && (
            <div className="ml-3 text-sm">
              {label && (
                <label className={labelStyles}>
                  {label}
                </label>
              )}
              {description && (
                <p className={descriptionStyles}>
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-400 mt-1 ml-8">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';