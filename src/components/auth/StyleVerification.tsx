import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

interface StyleCheck {
  name: string;
  selector: string;
  expectedStyles: string[];
  status: 'checking' | 'passed' | 'failed';
  details: string;
}

/**
 * Componente para verificar que todos los estilos glassmorphism y animaciones funcionen correctamente
 */
export const StyleVerification: React.FC = () => {
  const [checks, setChecks] = useState<StyleCheck[]>([
    {
      name: 'Efectos Glassmorphism',
      selector: '.backdrop-blur-md',
      expectedStyles: ['backdrop-filter', 'background-color'],
      status: 'checking',
      details: ''
    },
    {
      name: 'Gradientes de Fondo',
      selector: '.bg-gradient-to-r',
      expectedStyles: ['background-image'],
      status: 'checking',
      details: ''
    },
    {
      name: 'Animaciones de Entrada',
      selector: '.animate-fade-in',
      expectedStyles: ['animation-name', 'animation-duration'],
      status: 'checking',
      details: ''
    },
    {
      name: 'Transiciones Suaves',
      selector: '.transition-all',
      expectedStyles: ['transition-property', 'transition-duration'],
      status: 'checking',
      details: ''
    },
    {
      name: 'Bordes Transparentes',
      selector: '.border-white\\/10',
      expectedStyles: ['border-color'],
      status: 'checking',
      details: ''
    },
    {
      name: 'Sombras y Profundidad',
      selector: '.shadow-2xl',
      expectedStyles: ['box-shadow'],
      status: 'checking',
      details: ''
    }
  ]);

  const runStyleChecks = () => {
    setChecks(prevChecks => 
      prevChecks.map(check => ({ ...check, status: 'checking' as const }))
    );

    setTimeout(() => {
      const updatedChecks = checks.map(check => {
        const elements = document.querySelectorAll(check.selector);
        
        if (elements.length === 0) {
          return {
            ...check,
            status: 'failed' as const,
            details: `No se encontraron elementos con selector: ${check.selector}`
          };
        }

        const element = elements[0] as HTMLElement;
        const computedStyles = window.getComputedStyle(element);
        const missingStyles: string[] = [];
        
        check.expectedStyles.forEach(styleProp => {
          const styleValue = computedStyles.getPropertyValue(styleProp);
          if (!styleValue || styleValue === 'none' || styleValue === 'initial') {
            missingStyles.push(styleProp);
          }
        });

        if (missingStyles.length === 0) {
          return {
            ...check,
            status: 'passed' as const,
            details: `✅ Encontrados ${elements.length} elementos con estilos correctos`
          };
        } else {
          return {
            ...check,
            status: 'failed' as const,
            details: `❌ Estilos faltantes: ${missingStyles.join(', ')}`
          };
        }
      });

      setChecks(updatedChecks);
    }, 1000);
  };

  useEffect(() => {
    // Ejecutar verificación automáticamente al montar
    runStyleChecks();
  }, []);

  const getStatusColor = (status: StyleCheck['status']) => {
    switch (status) {
      case 'passed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status: StyleCheck['status']) => {
    switch (status) {
      case 'passed':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-yellow-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
    }
  };

  const passedChecks = checks.filter(check => check.status === 'passed').length;
  const totalChecks = checks.length;
  const successRate = Math.round((passedChecks / totalChecks) * 100);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            🎨 Verificación de Estilos
          </h3>
          <p className="text-gray-300 text-sm">
            Comprobando efectos glassmorphism y animaciones
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={runStyleChecks}>
          Verificar Nuevamente
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Progreso de verificación</span>
          <span className={`text-sm font-medium ${successRate >= 80 ? 'text-green-400' : successRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
            {passedChecks}/{totalChecks} ({successRate}%)
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              successRate >= 80 ? 'bg-green-500' : successRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>

      {/* Checks */}
      <div className="space-y-3">
        {checks.map((check, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 transition-all duration-200 hover:bg-white/10"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(check.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-white">{check.name}</h4>
                <span className={`text-xs font-medium ${getStatusColor(check.status)}`}>
                  {check.status === 'checking' ? 'Verificando...' : 
                   check.status === 'passed' ? 'Correcto' : 'Error'}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-1">
                Selector: <code className="bg-black/20 px-1 rounded text-cyan-300">{check.selector}</code>
              </p>
              <p className="text-xs text-gray-400">
                {check.details || 'Esperando verificación...'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className={`text-center p-4 rounded-lg ${
          successRate >= 80 ? 'bg-green-500/10 border border-green-500/20' :
          successRate >= 60 ? 'bg-yellow-500/10 border border-yellow-500/20' :
          'bg-red-500/10 border border-red-500/20'
        }`}>
          <div className={`text-lg font-bold mb-1 ${
            successRate >= 80 ? 'text-green-400' :
            successRate >= 60 ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {successRate >= 80 ? '🎉 Excelente!' :
             successRate >= 60 ? '⚠️ Aceptable' :
             '❌ Necesita Atención'}
          </div>
          <p className="text-sm text-gray-300">
            {successRate >= 80 ? 'Todos los estilos están funcionando correctamente' :
             successRate >= 60 ? 'La mayoría de estilos funcionan, pero hay algunos problemas' :
             'Varios estilos necesitan ser corregidos'}
          </p>
        </div>
      </div>
    </div>
  );
};