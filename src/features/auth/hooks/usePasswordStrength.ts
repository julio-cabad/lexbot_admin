import { useMemo } from 'react';

// Enums para la fuerza de la contraseña
enum PasswordStrength {
  WEAK = 'weak',
  FAIR = 'fair',
  GOOD = 'good',
  STRONG = 'strong'
}

// Interfaz para los requisitos de la contraseña
interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

/**
 * Verifica los requisitos de una contraseña
 */
const getPasswordRequirements = (password: string): PasswordRequirements => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password)
  };
};

/**
 * Evalua la fuerza de una contraseña
 */
const checkPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return PasswordStrength.WEAK;
  
  const requirements = getPasswordRequirements(password);
  const { minLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar } = requirements;
  
  // Contraseña débil: No cumple con los requisitos mínimos
  if (!minLength || (!hasUppercase && !hasLowercase) || !hasNumber) {
    return PasswordStrength.WEAK;
  }
  
  // Contraseña regular: Cumple con los requisitos mínimos
  if (minLength && (hasUppercase || hasLowercase) && hasNumber) {
    if (!hasUppercase || !hasLowercase || !hasSpecialChar) {
      return PasswordStrength.FAIR;
    }
  }
  
  // Contraseña buena: Cumple con todos los requisitos básicos
  if (minLength && hasUppercase && hasLowercase && hasNumber) {
    if (!hasSpecialChar || password.length < 10) {
      return PasswordStrength.GOOD;
    }
  }
  
  // Contraseña fuerte: Cumple con todos los requisitos y es larga
  return PasswordStrength.STRONG;
};

/**
 * Hook para evaluar la fuerza de una contraseña
 */
export const usePasswordStrength = (password: string) => {
  const strength = useMemo(() => {
    return checkPasswordStrength(password);
  }, [password]);

  const requirements = useMemo(() => {
    return getPasswordRequirements(password);
  }, [password]);

  const strengthScore = useMemo(() => {
    const scores = {
      [PasswordStrength.WEAK]: 1,
      [PasswordStrength.FAIR]: 2,
      [PasswordStrength.GOOD]: 3,
      [PasswordStrength.STRONG]: 4,
    };
    return scores[strength];
  }, [strength]);

  const strengthColor = useMemo(() => {
    const colors = {
      [PasswordStrength.WEAK]: 'red',
      [PasswordStrength.FAIR]: 'orange',
      [PasswordStrength.GOOD]: 'yellow',
      [PasswordStrength.STRONG]: 'green',
    };
    return colors[strength];
  }, [strength]);

  const strengthText = useMemo(() => {
    const texts = {
      [PasswordStrength.WEAK]: 'Débil',
      [PasswordStrength.FAIR]: 'Regular',
      [PasswordStrength.GOOD]: 'Buena',
      [PasswordStrength.STRONG]: 'Fuerte',
    };
    return texts[strength];
  }, [strength]);

  const strengthPercentage = useMemo(() => {
    return (strengthScore / 4) * 100;
  }, [strengthScore]);

  const isValid = useMemo(() => {
    return strength !== PasswordStrength.WEAK && password.length >= 8;
  }, [strength, password]);

  const requirementsList = useMemo(() => {
    return [
      {
        text: 'Al menos 8 caracteres',
        met: requirements.minLength,
      },
      {
        text: 'Una letra mayúscula',
        met: requirements.hasUppercase,
      },
      {
        text: 'Una letra minúscula',
        met: requirements.hasLowercase,
      },
      {
        text: 'Un número',
        met: requirements.hasNumber,
      },
      {
        text: 'Un carácter especial (opcional)',
        met: requirements.hasSpecialChar || false,
        optional: true,
      },
    ];
  }, [requirements]);

  const metRequirements = useMemo(() => {
    return requirementsList.filter(req => req.met && !req.optional).length;
  }, [requirementsList]);

  const totalRequirements = useMemo(() => {
    return requirementsList.filter(req => !req.optional).length;
  }, [requirementsList]);

  return {
    // Datos básicos
    strength,
    requirements,
    
    // Datos computados
    strengthScore,
    strengthColor,
    strengthText,
    strengthPercentage,
    isValid,
    
    // Lista de requisitos
    requirementsList,
    metRequirements,
    totalRequirements,
    
    // Estados útiles
    isEmpty: password.length === 0,
    isTooShort: password.length > 0 && password.length < 8,
    isWeak: strength === PasswordStrength.WEAK && password.length >= 8,
    isFair: strength === PasswordStrength.FAIR,
    isGood: strength === PasswordStrength.GOOD,
    isStrong: strength === PasswordStrength.STRONG,
  };
};