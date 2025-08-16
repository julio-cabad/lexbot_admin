import { useState, useCallback, useMemo } from "react";
import { FormValidationState, ChangeHandler, SubmitHandler } from "../../types";

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: SubmitHandler<T>;
}

/**
 * Hook genérico para manejo de formularios con validación
 */
export const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
  validateOnChange = false,
  validateOnBlur = true,
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar formulario
  const validateForm = useCallback(
    (formValues: T) => {
      if (!validate) return {};
      return validate(formValues);
    },
    [validate]
  );

  // Validar campo específico
  const validateField = useCallback(
    (fieldName: keyof T, fieldValue: any) => {
      if (!validate) return null;
      const formErrors = validate({ ...values, [fieldName]: fieldValue });
      return formErrors[fieldName] || null;
    },
    [validate, values]
  );

  // Cambiar valor de campo
  const handleChange = useCallback(
    (fieldName: keyof T) => (value: any) => {
      setValues((prev) => ({ ...prev, [fieldName]: value }));

      // Validar en tiempo real si está habilitado
      if (validateOnChange && touched[fieldName]) {
        const fieldError = validateField(fieldName, value);
        setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
      }
    },
    [validateOnChange, touched, validateField]
  );

  // Manejar blur de campo
  const handleBlur = useCallback(
    (fieldName: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));

      // Validar en blur si está habilitado
      if (validateOnBlur) {
        const fieldError = validateField(fieldName, values[fieldName]);
        setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
      }
    },
    [validateOnBlur, validateField, values]
  );

  // Establecer valor de campo
  const setFieldValue = useCallback((fieldName: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  // Establecer error de campo
  const setFieldError = useCallback(
    (fieldName: keyof T, error: string | null) => {
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    },
    []
  );

  // Establecer touched de campo
  const setFieldTouched = useCallback(
    (fieldName: keyof T, isTouched: boolean = true) => {
      setTouched((prev) => ({ ...prev, [fieldName]: isTouched }));
    },
    []
  );

  // Limpiar errores
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Limpiar touched
  const clearTouched = useCallback(() => {
    setTouched({});
  }, []);

  // Resetear formulario
  const resetForm = useCallback(
    (newValues?: T) => {
      setValues(newValues || initialValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues]
  );

  // Manejar envío del formulario
  const handleSubmit = useCallback(
    (submitHandler?: SubmitHandler<T>) => {
      return async (e?: React.FormEvent) => {
        if (e) {
          e.preventDefault();
        }

        setIsSubmitting(true);

        // Validar todo el formulario
        const formErrors = validateForm(values);
        setErrors(formErrors);

        // Marcar todos los campos como touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        }, {} as Partial<Record<keyof T, boolean>>);
        setTouched(allTouched);

        // Si hay errores, no enviar
        const hasErrors = Object.values(formErrors).some((error) => error);
        if (hasErrors) {
          setIsSubmitting(false);
          return;
        }

        try {
          // Usar el handler pasado como parámetro o el de las opciones
          const handler = submitHandler || onSubmit;
          if (handler) {
            await handler(values);
          }
        } catch (error) {
          console.error("Error en envío de formulario:", error);
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [values, validateForm, onSubmit]
  );

  // Estado de validación
  const isValid = useMemo(() => {
    const formErrors = validateForm(values);
    return !Object.values(formErrors).some((error) => error);
  }, [values, validateForm]);

  // Verificar si el formulario ha sido modificado
  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  // Obtener props para un campo específico
  const getFieldProps = useCallback(
    (fieldName: keyof T) => {
      return {
        name: fieldName as string,
        value: values[fieldName],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
          handleChange(fieldName)(value);
        },
        onBlur: handleBlur(fieldName),
        error: touched[fieldName] ? errors[fieldName] : undefined,
      };
    },
    [values, errors, touched, handleChange, handleBlur]
  );

  // Obtener props para un campo de tipo específico
  const getFieldPropsWithType = useCallback(
    (
      fieldName: keyof T,
      type: "text" | "email" | "password" | "checkbox" = "text"
    ) => {
      const baseProps = getFieldProps(fieldName);

      if (type === "checkbox") {
        return {
          ...baseProps,
          type,
          checked: values[fieldName] as boolean,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(fieldName)(e.target.checked);
          },
        };
      }

      return {
        ...baseProps,
        type,
      };
    },
    [getFieldProps, values, handleChange]
  );

  return {
    // Valores y estado
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,

    // Funciones de cambio
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setFieldTouched,

    // Funciones de limpieza
    clearErrors,
    clearTouched,
    resetForm,

    // Función de envío
    handleSubmit,

    // Utilidades
    getFieldProps,
    getFieldPropsWithType,
    validateField,
    validateForm: () => validateForm(values),
  };
};
