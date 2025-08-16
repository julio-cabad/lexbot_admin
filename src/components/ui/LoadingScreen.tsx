import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

/**
 * Componente de pantalla de carga optimizado para evitar parpadeo
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Cargando..." 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <p className="text-white text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
};