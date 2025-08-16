import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { Button } from '../ui/Button';

type FormType = 'login' | 'register' | 'forgot' | 'reset';

/**
 * Componente showcase para mostrar todos los formularios de autenticación
 * Útil para testing y desarrollo
 */
export const AuthFormsShowcase: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<FormType>('login');

  const forms = {
    login: {
      title: 'Iniciar Sesión',
      subtitle: 'Ingresa tus credenciales para acceder',
      component: <LoginForm showRegisterLink={false} showForgotPassword={false} />
    },
    register: {
      title: 'Crear Cuenta',
      subtitle: 'Únete a LexBot Admin',
      component: <RegisterForm showLoginLink={false} />
    },
    forgot: {
      title: 'Recuperar Contraseña',
      subtitle: 'Te ayudamos a recuperar el acceso',
      component: <ForgotPasswordForm showBackToLogin={false} />
    },
    reset: {
      title: 'Nueva Contraseña',
      subtitle: 'Establece una nueva contraseña segura',
      component: <ResetPasswordForm />
    }
  };

  const currentFormData = forms[currentForm];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Selector de formularios */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <h3 className="text-white text-sm font-medium mb-3">Formularios de Auth</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(forms).map(([key, form]) => (
              <Button
                key={key}
                variant={currentForm === key ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCurrentForm(key as FormType)}
              >
                {key === 'login' ? 'Login' :
                 key === 'register' ? 'Registro' :
                 key === 'forgot' ? 'Recuperar' : 'Reset'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Formulario actual */}
      <div className="flex items-center justify-center min-h-screen">
        <AuthLayout
          title={currentFormData.title}
          subtitle={currentFormData.subtitle}
        >
          {currentFormData.component}
        </AuthLayout>
      </div>
    </div>
  );
};