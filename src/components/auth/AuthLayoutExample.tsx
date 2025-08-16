import React from 'react';
import { AuthLayout } from './AuthLayout';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

/**
 * Componente de ejemplo para mostrar el uso del AuthLayout
 * Este archivo es solo para demostración y puede ser eliminado
 */
export const AuthLayoutExample: React.FC = () => {
  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Ingresa tus credenciales para acceder"
    >
      <form className="space-y-6">
        <Input
          label="Email"
          inputType="email"
          placeholder="tu@email.com"
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />
        
        <Input
          label="Contraseña"
          inputType="password"
          placeholder="••••••••"
          showPasswordToggle
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-300">Recordarme</span>
          </label>
          
          <button
            type="button"
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          type="submit"
        >
          Iniciar Sesión
        </Button>

        <div className="text-center">
          <span className="text-gray-400 text-sm">¿No tienes cuenta? </span>
          <button
            type="button"
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
          >
            Crear cuenta
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};