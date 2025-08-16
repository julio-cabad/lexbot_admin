// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Nullable<T> = T | null;

export type Maybe<T> = T | undefined;

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  "data-testid"?: string;
}

// Form component props
export interface FormComponentProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  required?: boolean;
}

// Button variants and sizes
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

// Input types
export type InputType = "text" | "email" | "password" | "tel" | "url";

// Theme types
export interface ThemeColors {
  primary: Record<string, string>;
  secondary: Record<string, string>;
  accent: Record<string, string>;
  background: Record<string, string>;
  text: Record<string, string>;
  status: Record<string, string>;
}

// Device types for responsive design
export type DeviceType = "mobile" | "tablet" | "desktop";

// Event handler types
export type ChangeHandler<T = string> = (value: T) => void;
export type ClickHandler = (event: React.MouseEvent) => void;
export type SubmitHandler<T = any> = (data: T) => void | Promise<void>;

// Async operation states
export interface AsyncState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Pagination types
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Sort types
export type SortDirection = "asc" | "desc";
export interface SortState {
  field: string;
  direction: SortDirection;
}
