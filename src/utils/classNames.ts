// Utility for combining class names (similar to clsx/classnames)
type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassArray
  | ClassDictionary;
type ClassArray = ClassValue[];
type ClassDictionary = Record<string, any>;

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}

// Variant utility for component styling
export function createVariants<
  T extends Record<string, Record<string, string>>
>(variants: T) {
  return function getVariant<K extends keyof T>(
    variant: K,
    value: keyof T[K]
  ): string {
    return variants[variant]?.[value] || "";
  };
}

// Responsive utility
export function responsive(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string
): string {
  const classes = [base];

  if (sm) classes.push(`sm:${sm}`);
  if (md) classes.push(`md:${md}`);
  if (lg) classes.push(`lg:${lg}`);
  if (xl) classes.push(`xl:${xl}`);

  return classes.join(" ");
}

// Focus ring utility
export function focusRing(color: string = "blue"): string {
  return `focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2`;
}

// Transition utility
export function transition(
  property: string = "all",
  duration: string = "300",
  timing: string = "ease"
): string {
  return `transition-${property} duration-${duration} ${timing}`;
}

// Hover scale utility
export function hoverScale(scale: string = "105"): string {
  return `transform transition-transform hover:scale-${scale}`;
}

// Glass effect utility
export function glassEffect(opacity: string = "10"): string {
  return `bg-white/${opacity} backdrop-blur-md`;
}

// Gradient text utility
export function gradientText(from: string, to: string): string {
  return `bg-gradient-to-r from-${from} to-${to} bg-clip-text text-transparent`;
}
