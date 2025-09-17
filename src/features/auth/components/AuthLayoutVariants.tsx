import React from "react";
import { AuthLayout } from "./AuthLayout";
import { cn } from "../../utils/classNames";

interface AuthLayoutVariantsProps {
  variant?: "default" | "compact" | "wide";
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

/**
 * Variantes del AuthLayout para diferentes casos de uso
 */
export const AuthLayoutVariants: React.FC<AuthLayoutVariantsProps> = ({
  variant = "default",
  children,
  title,
  subtitle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return "max-w-sm";
      case "wide":
        return "max-w-lg";
      case "default":
      default:
        return "max-w-md";
    }
  };

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      className={cn(getVariantStyles())}
    >
      {children}
    </AuthLayout>
  );
};

// Componentes específicos para cada variante
export const CompactAuthLayout: React.FC<
  Omit<AuthLayoutVariantsProps, "variant">
> = (props) => <AuthLayoutVariants {...props} variant="compact" />;

export const WideAuthLayout: React.FC<
  Omit<AuthLayoutVariantsProps, "variant">
> = (props) => <AuthLayoutVariants {...props} variant="wide" />;
