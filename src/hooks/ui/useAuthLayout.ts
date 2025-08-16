import { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from '../common';

interface UseAuthLayoutOptions {
  enableAnimations?: boolean;
  animationDelay?: number;
  showLoadingState?: boolean;
}

/**
 * Hook para manejar el estado y comportamiento del AuthLayout
 */
export const useAuthLayout = ({
  enableAnimations = true,
  animationDelay = 200,
  showLoadingState = false
}: UseAuthLayoutOptions = {}) => {
  const [isLoaded, setIsLoaded] = useState(!enableAnimations);
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Manejar la secuencia de animaciones
  useEffect(() => {
    if (!enableAnimations) return;

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [enableAnimations, animationDelay]);

  // Función para avanzar al siguiente paso (útil para formularios multi-paso)
  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  // Función para retroceder al paso anterior
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  // Función para ir a un paso específico
  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  // Función para resetear el layout
  const resetLayout = useCallback(() => {
    setCurrentStep(0);
    if (enableAnimations) {
      setIsLoaded(false);
      setTimeout(() => setIsLoaded(true), animationDelay);
    }
  }, [enableAnimations, animationDelay]);

  // Clases CSS dinámicas basadas en el estado
  const getLayoutClasses = useCallback(() => {
    const baseClasses = 'transition-all duration-300';
    const animationClasses = isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';
    const responsiveClasses = isMobile ? 'px-4' : 'px-8';
    
    return `${baseClasses} ${animationClasses} ${responsiveClasses}`;
  }, [isLoaded, isMobile]);

  // Función para obtener el delay de animación para un elemento específico
  const getAnimationDelay = useCallback((index: number) => {
    return enableAnimations ? `${animationDelay * (index + 1)}ms` : '0ms';
  }, [enableAnimations, animationDelay]);

  return {
    // Estados
    isLoaded,
    currentStep,
    isMobile,
    
    // Funciones de navegación
    nextStep,
    prevStep,
    goToStep,
    resetLayout,
    
    // Utilidades de estilo
    getLayoutClasses,
    getAnimationDelay,
    
    // Configuración
    enableAnimations,
    showLoadingState
  };
};