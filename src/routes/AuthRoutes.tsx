import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth';
import { ROUTES } from '../utils/constants';

/**
 * Rutas de autenticación
 */
export const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Redirigir cualquier ruta de auth no encontrada al login */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
};