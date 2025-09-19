/**
 * 🎯 DASHBOARD DEMO
 * Demo completo del dashboard administrativo integrado con AdminLayout
 */

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../../core/store';
import { AdminLayout } from '../components/layout/AdminLayout';
import { DashboardPage } from './DashboardPage';

/**
 * Demo component content
 */
const DashboardDemoContent: React.FC = () => {
  return (
    <AdminLayout>
      <DashboardPage />
    </AdminLayout>
  );
};

/**
 * Main demo component with providers
 */
export const DashboardDemo: React.FC = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <DashboardDemoContent />
      </Provider>
    </BrowserRouter>
  );
};

export default DashboardDemo;