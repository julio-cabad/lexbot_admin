/**
 * 🧪 DASHBOARD PAGE TESTS
 * Unit tests for DashboardPage component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { DashboardPage } from '../pages/DashboardPage';
import { adminSlice } from '../../../core/store/slices/admin/slice';
import { authSlice } from '../../../core/store/slices/auth/slice';

// Mock hooks
jest.mock('../../admin/hooks/useAdminLayoutManager', () => ({
  useAdminLayoutManager: () => ({
    actions: {
      setBreadcrumbs: jest.fn(),
      setActiveRoute: jest.fn(),
      navigateTo: jest.fn(),
    },
    responsive: {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'desktop',
    },
    utils: {
      getOptimalColumns: jest.fn(() => 3),
      getResponsiveValue: jest.fn((values) => values.desktop),
    },
  }),
}));

jest.mock('../../auth', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
    userProfile: { role: 'admin', firstName: 'Test', lastName: 'User' },
    userFullName: 'Test User',
    userDisplayName: 'Test',
  }),
}));

jest.mock('../../../core/hooks/useTexts', () => ({
  useTexts: () => ({
    dashboard: {
      statistics: 'Statistics',
      summary: 'Summary',
      recentActivity: 'Recent Activity',
      noActivity: 'No activity',
      quickActions: 'Quick Actions',
    },
    withUserName: jest.fn((text) => text),
  }),
}));

// Test store setup
const createTestStore = () => {
  return configureStore({
    reducer: {
      admin: adminSlice.reducer,
      auth: authSlice.reducer,
    },
    preloadedState: {
      admin: {
        ui: {
          sidebar: {
            collapsed: false,
            mobileOpen: false,
            persistCollapsed: true,
            width: { expanded: 280, collapsed: 80 },
          },
          header: {
            height: 64,
            showBreadcrumbs: true,
            showUserProfile: true,
            showSidebarToggle: true,
          },
          main: {
            padding: '2rem',
            scrollable: true,
          },
          responsive: {
            breakpoint: 'desktop',
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            windowWidth: 1200,
            windowHeight: 800,
          },
          animation: {
            sidebarTransition: true,
            contentTransition: true,
            reducedMotion: false,
          },
        },
        navigation: {
          activeRoute: '/admin/dashboard',
          menuItems: [],
          breadcrumbs: [],
          routeHistory: [],
          expandedGroups: [],
        },
        isInitialized: true,
        loading: {
          layout: false,
          navigation: false,
          menu: false,
        },
        errors: {
          layout: null,
          navigation: null,
          menu: null,
        },
        preferences: {
          sidebarCollapsed: false,
          theme: 'dark',
          animations: true,
        },
      },
      auth: {
        user: { email: 'test@example.com' },
        userProfile: { role: 'admin', firstName: 'Test', lastName: 'User' },
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard page correctly', () => {
    renderWithProviders(<DashboardPage />);
    
    expect(screen.getByText(/Good/)).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('displays welcome card with user information', () => {
    renderWithProviders(<DashboardPage />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('displays dashboard statistics', () => {
    renderWithProviders(<DashboardPage />);
    
    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Messages Sent')).toBeInTheDocument();
  });

  it('displays recent activity section', () => {
    renderWithProviders(<DashboardPage />);
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('displays quick actions section', () => {
    renderWithProviders(<DashboardPage />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Manage Recipients')).toBeInTheDocument();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });

  it('handles refresh button click', () => {
    renderWithProviders(<DashboardPage />);
    
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    // Should show loading state briefly
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('applies correct responsive classes', () => {
    renderWithProviders(<DashboardPage />);
    
    const dashboard = document.querySelector('.dashboard');
    expect(dashboard).toHaveClass('dashboard--desktop');
  });
});