import React from 'react';
import { usePasswordStrength } from '../../features/auth/hooks';

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

/**
 * Componente medidor de fuerza de contraseña reutilizable
 */
export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showRequirements = true,
  className = ''
}) => {
  const passwordStrength = usePasswordStrength(password);

  if (!password) return null;

  return (
    <div className={`space-y-2 animate-fade-in ${className}`}>
      {/* Barra de progreso */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              passwordStrength.strengthColor === 'red' ? 'bg-red-500' :
              passwordStrength.strengthColor === 'orange' ? 'bg-orange-500' :
              passwordStrength.strengthColor === 'yellow' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${passwordStrength.strengthPercentage}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${
          passwordStrength.strengthColor === 'red' ? 'text-red-400' :
          passwordStrength.strengthColor === 'orange' ? 'text-orange-400' :
          passwordStrength.strengthColor === 'yellow' ? 'text-yellow-400' :
          'text-green-400'
        }`}>
          {passwordStrength.strengthText}
        </span>
      </div>

      {/* Lista de requisitos */}
      {showRequirements && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
          {passwordStrength.requirementsList.map((req, index) => (
            <div key={index} className={`flex items-center space-x-1 ${
              req.met ? 'text-green-400' : 'text-gray-400'
            }`}>
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {req.met ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              <span className={`${req.optional ? 'opacity-70' : ''} truncate`}>
                {req.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-gray-400">
        <span>Progreso: {passwordStrength.metRequirements}/{passwordStrength.totalRequirements} requisitos</span>
      </div>
    </div>
  );
};