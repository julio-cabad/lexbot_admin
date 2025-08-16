import React, { forwardRef } from 'react';
import { cn } from '../../utils/classNames';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'solid' | 'hover';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: boolean;
  children: React.ReactNode;
}

/**
 * Componente Card reutilizable con efectos glassmorphism
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      padding = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Estilos base
    const baseStyles = 'rounded-2xl border shadow-2xl transition-all duration-300';

    // Estilos por variante
    const variantStyles = {
      default: 'bg-white/10 backdrop-blur-md border-white/10',
      glass: 'bg-white/5 backdrop-blur border-white/5',
      solid: 'bg-white border-gray-200',
      hover: 'bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/15 hover:shadow-3xl cursor-pointer'
    };

    // Estilos de padding por tamaño
    const paddingStyles = padding ? {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    }[size] : '';

    // Combinar todas las clases
    const cardClasses = cn(
      baseStyles,
      variantStyles[variant],
      paddingStyles,
      className
    );

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Componente CardHeader para encabezados de tarjetas
 */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('mb-6', className)}
      {...props}
    >
      {children || (
        <div className="text-center">
          {title && (
            <h2 className="text-2xl font-bold text-white mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-300">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Componente CardBody para contenido de tarjetas
 */
interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex-1', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Componente CardFooter para pie de tarjetas
 */
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('mt-6 pt-6 border-t border-white/10', className)}
      {...props}
    >
      {children}
    </div>
  );
};