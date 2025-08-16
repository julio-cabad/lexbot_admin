import React from 'react';
import { cn } from '../../utils/classNames';
import { PasswordStrength } from '../../types';
import { usePasswordStrength } from '../../hooks';

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

/**
 * Componente para mostrar la fuerza de una contraseña
 */
export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showRequirements = true,
  className
}) => {
  const {
    strength,
    strengthColor,
    strengthText,
    strengthPercentage,
    requirementsList,
    isEmpty
  } = usePasswordStrength(password);

  // No mostrar nada si la contraseña está vacía
  if (isEmpty) {
    return null;
  }

  // Colores por fuerza
  const colorClasses = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500'
  };

  // Colores de texto por fuerza
  const textColorClasses = {
    red: 'text-red-400',
    orange: 'text-orange-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400'
  };

  return (
    <div className={cn('mt-3', className)}>
      {/* Barra de progreso */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-300">Fuerza de contraseña</span>
          <span className={cn('text-sm font-medium', textColorClasses[strengthColor])}>
            {strengthText}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              colorClasses[strengthColor]
            )}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Lista de requisitos */}
      {showRequirements && (
        <div className="space-y-1">
          {requirementsList.map((requirement, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-sm"
            >
              <div className={cn(
                'w-4 h-4 rounded-full flex items-center justify-center',
                requirement.met
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-600 text-gray-400'
              )}>
                {requirement.met ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <span className={cn(
                requirement.met ? 'text-green-400' : 'text-gray-400',
                requirement.optional && 'opacity-75'
              )}>
                {requirement.text}
                {requirement.optional && ' (opcional)'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;