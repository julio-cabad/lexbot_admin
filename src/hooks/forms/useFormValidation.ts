import { useState, useCallback, useMemo } from "react";
import { ValidationError } from "../../types";
import { debounce } from "../../utils";

interface UseFormValidationOptions<T> {
  validationRules: Record<
    keyof T,
    (value: any, allValues?: T) => string | null
  >;
  debounceMs?: number;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Hook especializado para validación de formularios
 */
export const useFormValidation = <T extends Record<string, any>>({
  validationRules,
  debounceMs = 300,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormValidationOptions<T>) => {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isValidating, setIsValidating] = useState<
    Partial<Record<keyof T, boolean>>
  >({});

  // Validar un campo específico
  const validateField = useCallback(
    async (
      fieldName: keyof T,
      value: any,
      allValues?: T
    ): Promise<string | null> => {
      const rule = validationRules[fieldName];
      if (!rule) return null;

      setIsValidating((prev) => ({ ...prev, [fieldName]: true }));

      try {
        const error = await rule(value, allValues);
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
        return error;
      } catch (error) {
        const errorMessage = "Error de validación";
        setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
        return errorMessage;
      } finally {
        setIsValidating((prev) => ({ ...prev, [fieldName]: false }));
      }
    },
    [validationRules]
  );

  // Validar todos los campos
  const validateAllFields = useCallback(
    async (values: T): Promise<Record<keyof T, string | null>> => {
      const validationPromises = Object.keys(validationRules).map(
        async (fieldName) => {
          const error = await validateField(
            fieldName as keyof T,
            values[fieldName as keyof T],
            values
          );
          return { fieldName: fieldName as keyof T, error };
        }
      );

      const results = await Promise.all(validationPromises);

      const validationResults = results.reduce((acc, { fieldName, error }) => {
        acc[fieldName] = error;
        return acc;
      }, {} as Record<keyof T, string | null>);

      return validationResults;
    },
    [validationRules, validateField]
  );

  // Validación con debounce para onChange
  const debouncedValidateField = useMemo(() => {
    return debounce(validateField, debounceMs);
  }, [validateField, debounceMs]);

  // Manejar validación en onChange
  const handleChangeValidation = useCallback(
    (fieldName: keyof T, value: any, allValues?: T) => {
      if (validateOnChange) {
        debouncedValidateField(fieldName, value, allValues);
      }
    },
    [validateOnChange, debouncedValidateField]
  );

  // Manejar validación en onBlur
  const handleBlurValidation = useCallback(
    (fieldName: keyof T, value: any, allValues?: T) => {
      if (validateOnBlur) {
        validateField(fieldName, value, allValues);
      }
    },
    [validateOnBlur, validateField]
  );

  // Limpiar error de un campo
  const clearFieldError = useCallback((fieldName: keyof T) => {
    setErrors((prev) => ({ ...prev, [fieldName]: null }));
  }, []);

  // Limpiar todos los errores
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Establecer error personalizado
  const setFieldError = useCallback(
    (fieldName: keyof T, error: string | null) => {
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    },
    []
  );

  // Verificar si hay errores
  const hasErrors = useMemo(() => {
    return Object.values(errors).some(
      (error) => error !== null && error !== undefined
    );
  }, [errors]);

  // Verificar si está validando algún campo
  const isValidatingAny = useMemo(() => {
    return Object.values(isValidating).some(Boolean);
  }, [isValidating]);

  // Obtener errores como array de ValidationError
  const getValidationErrors = useCallback((): ValidationError[] => {
    return Object.entries(errors)
      .filter(([, error]) => error)
      .map(([field, message]) => ({
        field,
        message: message as string,
      }));
  }, [errors]);

  // Verificar si un campo específico es válido
  const isFieldValid = useCallback(
    (fieldName: keyof T) => {
      return !errors[fieldName];
    },
    [errors]
  );

  // Verificar si todos los campos son válidos
  const isFormValid = useMemo(() => {
    return !hasErrors;
  }, [hasErrors]);

  return {
    // Estado
    errors,
    isValidating,
    hasErrors,
    isValidatingAny,
    isFormValid,

    // Funciones de validación
    validateField,
    validateAllFields,
    handleChangeValidation,
    handleBlurValidation,

    // Funciones de manejo de errores
    clearFieldError,
    clearAllErrors,
    setFieldError,

    // Utilidades
    getValidationErrors,
    isFieldValid,
  };
};
