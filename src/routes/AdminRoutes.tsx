/**
 * 🏛️ ADMIN ROUTES
 * Admin panel specific routes using AdminLayout container
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../features/admin/components/layout/AdminLayout';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { MailAuthPage } from '../features/mail-auth/pages/MailAuthPage';
import { ProtectedRoute } from './ProtectedRoute';

/**
 * 🎯 ADMIN ROUTES COMPONENT
 * Configures admin panel routes within AdminLayout
 */
export const AdminRoutes: React.FC = () => {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes> 
          {/* Dashboard route (relative to /admin/*) */}
          <Route path="dashboard" element={<DashboardPage />} />
          
          {/* Admin specific routes */}
          <Route path="recipients" element={<div>Recipients Page (Coming Soon)</div>} />
          <Route path="mail-auth" element={<MailAuthPage />} />
          <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
          
          {/* Default redirect to dashboard */}
          <Route path="" element={<Navigate to="dashboard" replace />} />
          
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
