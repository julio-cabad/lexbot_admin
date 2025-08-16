import React, { forwardRef } from 'react';
import { Input } from './Input';
import { cn } from '../../utils/classNames';
import { InputType } from '../../types';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputType?: InputType;
  showPasswordToggle?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

/**
 * Componente FormField que combina Input con manejo completo de errores y estados
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      className,
      ...inputProps
    },
    ref
  ) => {
    // Agregar asterisco al label si es requerido
    const displayLabel = required ? `${label} *` : label;

    return (
      <div className={cn('w-full', className)}>
        <Input
          ref={ref}
          label={displayLabel}
          error={error}
          helperText={helperText}
          {...inputProps}
        />
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;