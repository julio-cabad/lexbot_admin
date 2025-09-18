# Sistema de Redirección de Autenticación

Este sistema proporciona hooks reutilizables para manejar la navegación basada en el estado de autenticación de manera profesional y escalable.

## Hooks Disponibles

### `useAuthRedirect(options)`

Hook principal que maneja la redirección basada en el estado de autenticación.

**Opciones:**
- `redirectTo`: Ruta de destino (default: dashboard)
- `replace`: Usar replace en lugar de push (default: true)
- `waitForInitialization`: Esperar a que auth esté inicializada (default: true)
- `shouldRedirect`: Función personalizada para determinar si redirigir

**Retorna:**
- `redirectTo(path, options)`: Función para redirección manual
- `canRedirect`: Si puede redirigir actualmente
- `isAuthenticated`: Estado de autenticación
- `isInitialized`: Estado de inicialización

### `usePublicPageRedirect(redirectTo?)`

Hook especializado para páginas públicas que deben redirigir usuarios autenticados.

**Uso típico:** Páginas de login, register, landing page

```typescript
export const LoginPage = () => {
  usePublicPageRedirect(); // Redirige a dashboard si está autenticado
  return <LoginForm />;
};
```

### `useProtectedPageRedirect()`

Hook para páginas que requieren autenticación.

**Uso típico:** Dashboard, perfil, configuraciones

```typescript
export const Dashboard = () => {
  useProtectedPageRedirect(); // Redirige a login si no está autenticado
  return <DashboardContent />;
};
```

### `usePostLoginRedirect()`

Hook para manejar redirección después de login exitoso.

**Uso típico:** Páginas de procesamiento, callbacks de OAuth

```typescript
export const LoginCallback = () => {
  usePostLoginRedirect(); // Redirige después de login exitoso
  return <LoadingSpinner />;
};
```

## Ventajas del Sistema

### 1. **Centralización**
- Toda la lógica de redirección en un lugar
- Fácil mantenimiento y actualización
- Consistencia en toda la aplicación

### 2. **Reutilización**
- Hooks especializados para casos comunes
- Configuración flexible para casos específicos
- No duplicación de código

### 3. **Robustez**
- Manejo del estado de inicialización
- Prevención de redirecciones prematuras
- Soporte para lógica condicional compleja

### 4. **Testabilidad**
- Hooks aislados y testeable
- Mocking fácil para pruebas
- Lógica separada de componentes

### 5. **Escalabilidad**
- Fácil agregar nuevos tipos de redirección
- Soporte para roles y permisos
- Configuración declarativa

## Ejemplos de Uso

### Página Pública Básica
```typescript
export const LoginPage = () => {
  usePublicPageRedirect();
  return <LoginForm />;
};
```

### Página Protegida Básica
```typescript
export const Dashboard = () => {
  useProtectedPageRedirect();
  return <DashboardContent />;
};
```

### Redirección Condicional
```typescript
export const AdminPage = () => {
  useAuthRedirect({
    redirectTo: '/login',
    shouldRedirect: (auth) => !auth.isAuthenticated || !auth.user?.isAdmin
  });
  return <AdminPanel />;
};
```

### Redirección Manual
```typescript
export const RoleSelector = () => {
  const { redirectTo } = useAuthRedirect({
    shouldRedirect: () => false // No redirigir automáticamente
  });

  const handleRoleSelect = (role: string) => {
    redirectTo(`/${role}-dashboard`);
  };

  return <RoleButtons onSelect={handleRoleSelect} />;
};
```

### Redirección con Estado de Carga
```typescript
export const ProtectedPage = () => {
  const { canRedirect, isInitialized } = useProtectedPageRedirect();

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return <ProtectedContent />;
};
```

## Migración desde el Sistema Anterior

### Antes:
```typescript
export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return <LoginForm />;
};
```

### Después:
```typescript
export const LoginPage = () => {
  usePublicPageRedirect();
  return <LoginForm />;
};
```

## Mejores Prácticas

1. **Usar hooks específicos** cuando sea posible (`usePublicPageRedirect`, `useProtectedPageRedirect`)
2. **Esperar inicialización** para evitar redirecciones prematuras
3. **Usar replace** para navegación de autenticación (evita botón atrás)
4. **Lógica condicional** en `shouldRedirect` para casos complejos
5. **Redirección manual** cuando necesites control total

## Consideraciones de Rendimiento

- Los hooks usan `useEffect` con dependencias optimizadas
- Solo se ejecutan cuando cambia el estado relevante
- No causan re-renders innecesarios
- Compatibles con React.StrictMode

## Compatibilidad

- React Router v6+
- Redux Toolkit
- TypeScript
- Compatible con SSR (con configuración adicional)