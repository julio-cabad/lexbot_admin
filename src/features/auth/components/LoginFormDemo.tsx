import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { AuthLayout } from './AuthLayout';
import { Button } from '../ui/Button';

/**
 * Componente de demostración para mostrar diferentes variantes del LoginForm
 */
export const LoginFormDemo: React.FC = () => {
  const [variant, setVariant] = useState<'default' | 'minimal' | 'social'>('default');

  const handleSuccess = () => {
    console.log('Login exitoso!');
  };

  const handleForgotPassword = () => {
    console.log('Recuperar contraseña');
  };

  const handleRegister = () => {
    console.log('Ir a registro');
  };

  const renderVariant = () => {
    switch (variant) {
      case 'minimal':
        return (
          <LoginForm
            onSuccess={handleSuccess}
            showRememberMe={false}
            showLinks={false}
            className="space-y-4"
          />
        );
      
      case 'social':
        return (
          <LoginForm
            onSuccess={handleSuccess}
            onForgotPassword={handleForgotPassword}
            onRegister={handleRegister}
            showRememberMe={true}
            showLinks={true}
          />
        );
      
      case 'default':
      default:
        return (
          <LoginForm
            onSuccess={handleSuccess}
            onForgotPassword={handleForgotPassword}
            onRegister={handleRegister}
            showRememberMe={true}
            showLinks={true}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Selector de variantes */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-medium mb-3">Variantes del LoginForm</h3>
          <div className="space-y-2">
            <Button
              variant={variant === 'default' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setVariant('default')}
              fullWidth
            >
              Completo
            </Button>
            <Button
              variant={variant === 'minimal' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setVariant('minimal')}
              fullWidth
            >
              Mínimal
            </Button>
            <Button
              variant={variant === 'social' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setVariant('social')}
              fullWidth
            >
              Con Social
            </Button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <AuthLayout
            title="Demo Login"
            subtitle={`Variante: ${variant}`}
            showLogo={variant !== 'minimal'}
          >
            {renderVariant()}
          </AuthLayout>
        </div>
      </div>
    </div>
  );
};