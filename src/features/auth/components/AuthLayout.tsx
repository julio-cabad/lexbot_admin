import React from 'react';
import { cn } from '../../../core/utils/classNames';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  className?: string;
}

/**
 * Layout común para páginas de autenticación
 * Incluye gradiente de fondo, efectos glassmorphism y animaciones
 * Optimizado para responsive design y accesibilidad
 */
export const AuthLayout: React.FC<AuthLayoutProps> = React.memo(({
  children,
  title,
  subtitle,
  showLogo = true,
  className
}) => {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-3 sm:p-4 md:p-6" role="main">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content container */}
      <div className={cn(
        "relative w-full max-w-sm sm:max-w-md mx-auto",
        className
      )}>
        {/* Glass card container */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10" role="dialog" aria-labelledby="auth-title">
          {/* Logo section */}
          {showLogo && (
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3 sm:mb-4 shadow-lg">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                LexBot Admin
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm">
                Sistema de Administración
              </p>
            </div>
          )}

          {/* Header section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-300 text-base">
                {subtitle}
              </p>
            )}
          </div>

          {/* Content section */}
          <div>
            {children}
          </div>

          {/* Footer section */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 LexBot Admin. Todos los derechos reservados.
            </p>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -top-1 -right-3 w-2 h-2 bg-pink-400 rounded-full opacity-80 animate-pulse animation-delay-1000"></div>
        <div className="absolute -bottom-2 -right-1 w-3 h-3 bg-purple-400 rounded-full opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-1 -left-4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse animation-delay-3000"></div>
      </div>
    </div>
  );
});