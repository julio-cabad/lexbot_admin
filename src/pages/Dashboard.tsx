import React from 'react';
import { useAuth } from '../hooks/auth';
import { Button } from '../components/ui/Button';

/**
 * Página temporal del dashboard para testing
 */
export const Dashboard: React.FC = () => {
  const { user, logout, userDisplayName } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              ¡Bienvenido al Dashboard!
            </h1>
            <p className="text-gray-300 text-lg">
              Hola, {userDisplayName}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Email: {user?.email}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                Estado de Sesión
              </h3>
              <p className="text-gray-300 text-sm">
                Sesión activa y funcionando correctamente
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-purple-400 mb-2">
                Autenticación
              </h3>
              <p className="text-gray-300 text-sm">
                Sistema de auth implementado con Firebase
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-pink-400 mb-2">
                UI Components
              </h3>
              <p className="text-gray-300 text-sm">
                Componentes con diseño glassmorphism
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={logout}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};