import React from 'react';
import { cn } from '../../utils/classNames';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Componente Loading con diferentes variantes de animación
 */
export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
  className
}) => {
  // Estilos por tamaño
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Componente Spinner
  const Spinner = () => (
    <svg
      className={cn('animate-spin', sizeStyles[size])}
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

  // Componente Dots
  const Dots = () => {
    const dotSize = {
      sm: 'w-1 h-1',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4'
    };

    return (
      <div className="flex space-x-1">
        <div className={cn(dotSize[size], 'bg-current rounded-full animate-bounce')} style={{ animationDelay: '0ms' }} />
        <div className={cn(dotSize[size], 'bg-current rounded-full animate-bounce')} style={{ animationDelay: '150ms' }} />
        <div className={cn(dotSize[size], 'bg-current rounded-full animate-bounce')} style={{ animationDelay: '300ms' }} />
      </div>
    );
  };

  // Componente Pulse
  const Pulse = () => (
    <div className={cn(sizeStyles[size], 'bg-current rounded-full animate-pulse opacity-75')} />
  );

  // Renderizar variante
  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return <Dots />;
      case 'pulse':
        return <Pulse />;
      case 'spinner':
      default:
        return <Spinner />;
    }
  };

  // Contenido del loading
  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center space-y-3 text-white',
      className
    )}>
      <div className="text-cyan-400">
        {renderVariant()}
      </div>
      {text && (
        <p className="text-sm text-gray-300 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  // Si es fullScreen, renderizar con overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

/**
 * Componente LoadingOverlay para superponer sobre contenido existente
 */
interface LoadingOverlayProps extends LoadingProps {
  show: boolean;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  show,
  children,
  ...loadingProps
}) => {
  return (
    <div className="relative">
      {children}
      {show && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <Loading {...loadingProps} />
        </div>
      )}
    </div>
  );
};

/**
 * Componente LoadingButton para botones con estado de carga
 */
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loading size="sm" variant="spinner" className="mr-2" />
      )}
      {loading && loadingText ? loadingText : children}
    </button>
  );
};

export default Loading;