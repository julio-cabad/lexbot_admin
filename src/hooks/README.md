# Hooks Directory

Esta carpeta contiene todos los hooks personalizados de React organizados por funcionalidad y categoría.

## Estructura Organizada por Directorios

```
src/hooks/
├── auth/                   # Hooks relacionados con autenticación
│   ├── useAuth.ts         # Hook principal de autenticación
│   ├── useAuthForm.ts     # Hooks para formularios de auth
│   ├── usePasswordStrength.ts # Hook para validar fuerza de contraseña
│   ├── useSession.ts      # Hook para manejo de sesiones
│   └── index.ts           # Exportaciones de auth
├── forms/                  # Hooks para manejo de formularios
│   ├── useForm.ts         # Hook genérico para formularios
│   ├── useFormValidation.ts # Hook especializado en validación
│   └── index.ts           # Exportaciones de forms
├── common/                 # Hooks de uso común
│   ├── useRedux.ts        # Hooks tipados de Redux
│   ├── useDebounce.ts     # Hook para debounce
│   ├── useLocalStorage.ts # Hook para localStorage
│   ├── useToggle.ts       # Hook para valores booleanos
│   ├── useClickOutside.ts # Hook para detectar clicks fuera
│   ├── useMediaQuery.ts   # Hook para media queries
│   └── index.ts           # Exportaciones comunes
├── ui/                     # Hooks para interfaz de usuario
│   ├── useToast.ts        # Hook para notificaciones toast
│   └── index.ts           # Exportaciones de UI
├── index.ts               # Exportaciones principales
└── README.md              # Esta documentación
```

## Hooks por Categoría

### 🔐 Auth Hooks (`/auth`)

- **`useAuth`** - Hook principal para todas las operaciones de autenticación
- **`useAuthForm`** - Hooks especializados para formularios de auth (login, registro, etc.)
- **`usePasswordStrength`** - Evaluación de fuerza de contraseñas
- **`useSession`** - Manejo de sesiones y expiración

### 📝 Form Hooks (`/forms`)

- **`useForm`** - Hook genérico para manejo de formularios con validación
- **`useFormValidation`** - Hook especializado en validación de formularios

### 🔧 Common Hooks (`/common`)

- **`useRedux`** - Hooks tipados para Redux (`useAppDispatch`, `useAppSelector`)
- **`useDebounce`** - Debounce de valores
- **`useLocalStorage`** - Manejo reactivo de localStorage
- **`useToggle`** - Manejo de valores booleanos
- **`useClickOutside`** - Detección de clicks fuera de elementos
- **`useMediaQuery`** - Media queries responsivas

### 🎨 UI Hooks (`/ui`)

- **`useToast`** - Sistema completo de notificaciones toast

## Uso

### Importación Organizada

```typescript
// Importar por categoría
import { useAuth, useSession } from '../hooks/auth';
import { useForm } from '../hooks/forms';
import { useToast } from '../hooks/ui';
import { useDebounce, useToggle } from '../hooks/common';

// O importar desde el índice principal
import { 
  useAuth, 
  useForm, 
  useToast, 
  useDebounce 
} from '../hooks';
```

### Ejemplos de Uso

#### Hook de Autenticación
```typescript
const MyComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    isLoginLoading 
  } = useAuth();

  const handleLogin = async (credentials) => {
    await login(credentials);
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenido, {user?.displayName}</p>
      ) : (
        <button onClick={() => handleLogin(creds)}>
          {isLoginLoading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      )}
    </div>
  );
};
```

#### Hook de Formulario
```typescript
const LoginForm = () => {
  const { 
    values, 
    errors, 
    handleChange, 
    handleSubmit, 
    isValid 
  } = useForm({
    initialValues: { email: '', password: '' },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = 'Email requerido';
      return errors;
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        value={values.email}
        onChange={(e) => handleChange('email')(e.target.value)}
        error={errors.email}
      />
      <button type="submit" disabled={!isValid}>
        Enviar
      </button>
    </form>
  );
};
```

#### Hook de Toast
```typescript
const MyComponent = () => {
  const { showSuccess, showError, authToasts } = useToast();

  const handleSuccess = () => {
    showSuccess('¡Operación exitosa!');
    // O usar toasts específicos de auth
    authToasts.loginSuccess();
  };

  return <button onClick={handleSuccess}>Mostrar Toast</button>;
};
```

## Ventajas de esta Organización

1. **📁 Organización Clara**: Cada hook está en su categoría correspondiente
2. **🔍 Fácil Búsqueda**: Sabes exactamente dónde encontrar cada hook
3. **📦 Importaciones Limpias**: Puedes importar por categoría o individualmente
4. **🔧 Mantenimiento**: Fácil de mantener y extender
5. **📚 Documentación**: Cada categoría tiene su propósito bien definido
6. **🎯 Especialización**: Hooks especializados para casos de uso específicos

## Mejores Prácticas

1. **Usa hooks específicos**: Prefiere `useLoginForm` sobre `useForm` genérico para login
2. **Importa por categoría**: Mantén las importaciones organizadas
3. **Documenta nuevos hooks**: Añade JSDoc a todos los hooks nuevos
4. **Sigue la estructura**: Coloca nuevos hooks en la categoría correcta
5. **Reutiliza hooks**: Antes de crear uno nuevo, verifica si ya existe uno similar