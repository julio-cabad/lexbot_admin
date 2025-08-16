# Redux Store Structure

Esta carpeta contiene toda la lógica de estado global de la aplicación usando Redux Toolkit.

## Estructura de Carpetas

```
src/store/
├── slices/                 # Slices de Redux organizados por feature
│   └── auth/              # Slice de autenticación
│       ├── index.ts       # Exportaciones principales
│       ├── types.ts       # Tipos e interfaces del estado
│       ├── slice.ts       # Slice principal con reducers
│       ├── thunks.ts      # Async thunks para operaciones async
│       └── selectors.ts   # Selectores memoizados
├── middleware/            # Middleware personalizado
│   ├── index.ts          # Exportaciones de middleware
│   └── sessionMiddleware.ts # Middleware para manejo de sesiones
├── store.ts              # Configuración principal del store
├── index.ts              # Exportaciones principales
└── README.md             # Esta documentación
```

## Auth Slice

### Estado (AuthState)

El estado de autenticación está organizado en las siguientes secciones:

- **user**: Datos del usuario actual (Firebase User)
- **loading**: Estados de carga para diferentes operaciones
- **errors**: Errores específicos para cada operación
- **success**: Estados de éxito para cada operación
- **isAuthenticated**: Estado de autenticación
- **isInitialized**: Si la app ha terminado de verificar el estado de auth
- **sessionInfo**: Información de la sesión (rememberMe, expiración, etc.)
- **ui**: Estados de UI específicos (modales, redirects, etc.)

### Thunks Disponibles

- `checkAuthStatus`: Verifica el estado de autenticación al cargar la app
- `loginUser`: Inicia sesión con email/contraseña
- `registerUser`: Registra un nuevo usuario
- `logoutUser`: Cierra sesión del usuario
- `sendPasswordResetEmail`: Envía email de recuperación de contraseña
- `confirmPasswordReset`: Confirma el reset de contraseña con código
- `updateUserProfile`: Actualiza el perfil del usuario
- `sendEmailVerification`: Envía email de verificación
- `refreshUserData`: Actualiza los datos del usuario
- `extendSession`: Extiende la sesión actual

### Selectores

Los selectores están organizados por categorías:

- **User selectors**: `selectUser`, `selectUserDisplayName`, etc.
- **Loading selectors**: `selectIsLoginLoading`, `selectIsRegisterLoading`, etc.
- **Error selectors**: `selectLoginError`, `selectRegisterError`, etc.
- **Success selectors**: `selectLoginSuccess`, `selectRegisterSuccess`, etc.
- **Session selectors**: `selectSessionInfo`, `selectIsRememberMeEnabled`, etc.
- **UI selectors**: `selectShowPasswordResetSuccess`, etc.
- **Computed selectors**: `selectUserInitials`, `selectIsSessionExpired`, etc.

### Acciones Síncronas

- `clearError`: Limpia un error específico
- `clearAllErrors`: Limpia todos los errores
- `clearSuccess`: Limpia un estado de éxito específico
- `clearAllSuccess`: Limpia todos los estados de éxito
- `setRedirectAfterLogin`: Establece la ruta de redirección después del login
- `setShowPasswordResetSuccess`: Muestra/oculta mensaje de éxito de reset
- `setShowEmailVerificationPrompt`: Muestra/oculta prompt de verificación
- `updateSessionActivity`: Actualiza la actividad de la sesión
- `setGeneralError`: Establece un error general
- `resetAuthState`: Resetea completamente el estado de auth

## Middleware

### Session Middleware

Middleware personalizado que:

- Rastrea la actividad del usuario
- Extiende automáticamente las sesiones que están por expirar
- Actualiza la información de sesión en el estado

## Uso

### En Componentes

```typescript
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { 
  selectUser, 
  selectIsLoginLoading, 
  selectLoginError,
  loginUser,
  clearError 
} from '../store';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoginLoading);
  const error = useAppSelector(selectLoginError);

  const handleLogin = async (credentials) => {
    await dispatch(loginUser(credentials));
  };

  const handleClearError = () => {
    dispatch(clearError('login'));
  };

  // ...resto del componente
};
```

### Hooks Personalizados

Se recomienda crear hooks personalizados para operaciones comunes:

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const login = useCallback((credentials) => {
    return dispatch(loginUser(credentials));
  }, [dispatch]);
  
  return { user, isAuthenticated, login };
};
```

## Mejores Prácticas

1. **Usa selectores**: Siempre usa selectores en lugar de acceder directamente al estado
2. **Maneja errores**: Siempre limpia errores después de mostrarlos al usuario
3. **Estados de carga**: Usa los estados de loading para mostrar indicadores visuales
4. **Thunks para async**: Todas las operaciones asíncronas deben usar thunks
5. **Middleware para efectos**: Usa middleware para efectos secundarios automáticos
6. **Tipos estrictos**: Mantén todos los tipos bien definidos

## Testing

Para testing, puedes usar el estado inicial exportado:

```typescript
import { initialAuthState } from '../store/slices/auth';

// En tus tests
const mockState = {
  auth: {
    ...initialAuthState,
    user: mockUser,
    isAuthenticated: true
  }
};
```