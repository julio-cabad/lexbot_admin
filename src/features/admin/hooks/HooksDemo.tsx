/**
 * 🎯 ADMIN HOOKS DEMO
 * Demo component to showcase admin layout management hooks
 */

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../../core/store';
import { useAdminLayoutManager } from './useAdminLayoutManager';

/**
 * Demo component content
 */
const HooksDemoContent: React.FC = () => {
  const {
    layout,
    navigation,
    responsive,
    actions,
    utils,
  } = useAdminLayoutManager();

  return (
    <div style={{ 
      padding: '2rem', 
      background: 'rgba(15, 23, 42, 0.95)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ marginBottom: '2rem' }}>
        🪝 Admin Layout Hooks Demo
      </h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Layout State */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          backdropFilter: 'blur(16px)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#3b82f6' }}>
            🏛️ Layout State
          </h2>
          <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
            <p><strong>Initialized:</strong> {layout.isInitialized ? '✅' : '❌'}</p>
            <p><strong>Ready:</strong> {layout.isReady ? '✅' : '❌'}</p>
            <p><strong>Sidebar Collapsed:</strong> {layout.sidebar.collapsed ? '✅' : '❌'}</p>
            <p><strong>Mobile Sidebar Open:</strong> {layout.sidebar.mobileOpen ? '✅' : '❌'}</p>
            <p><strong>Sidebar Width:</strong> {layout.sidebar.width}px</p>
            <p><strong>Header Height:</strong> {layout.header.height}px</p>
          </div>
        </div>

        {/* Navigation State */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          backdropFilter: 'blur(16px)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#10b981' }}>
            🧭 Navigation State
          </h2>
          <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
            <p><strong>Active Route:</strong> {navigation.activeRoute}</p>
            <p><strong>Menu Items:</strong> {navigation.menuItems.length}</p>
            <p><strong>Breadcrumbs:</strong> {navigation.breadcrumbs.length}</p>
            <p><strong>Route History:</strong> {navigation.routeHistory.length}</p>
            <p><strong>Expanded Groups:</strong> {navigation.expandedGroups.length}</p>
            <p><strong>Active Item:</strong> {navigation.activeMenuItem?.label || 'None'}</p>
          </div>
        </div>

        {/* Responsive State */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          backdropFilter: 'blur(16px)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#f59e0b' }}>
            📱 Responsive State
          </h2>
          <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
            <p><strong>Breakpoint:</strong> {responsive.breakpoint}</p>
            <p><strong>Mobile:</strong> {responsive.isMobile ? '✅' : '❌'}</p>
            <p><strong>Tablet:</strong> {responsive.isTablet ? '✅' : '❌'}</p>
            <p><strong>Desktop:</strong> {responsive.isDesktop ? '✅' : '❌'}</p>
            <p><strong>Touch Device:</strong> {responsive.isTouch ? '✅' : '❌'}</p>
            <p><strong>Orientation:</strong> {responsive.isLandscape ? 'Landscape' : 'Portrait'}</p>
            <p><strong>Screen:</strong> {responsive.screenWidth} × {responsive.screenHeight}</p>
          </div>
        </div>
      </div>

      {/* Actions Demo */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        padding: '1.5rem', 
        borderRadius: '12px',
        backdropFilter: 'blur(16px)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>
          🎯 Actions Demo
        </h2>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          marginBottom: '1rem'
        }}>
          <button
            onClick={actions.toggleSidebar}
            style={{
              padding: '0.75rem 1rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Toggle Sidebar
          </button>
          
          <button
            onClick={() => actions.navigateTo('/dashboard')}
            style={{
              padding: '0.75rem 1rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => actions.navigateTo('/admin/recipients')}
            style={{
              padding: '0.75rem 1rem',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Go to Recipients
          </button>
          
          <button
            onClick={actions.goBack}
            style={{
              padding: '0.75rem 1rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Utilities Demo */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        padding: '1.5rem', 
        borderRadius: '12px',
        backdropFilter: 'blur(16px)'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#ef4444' }}>
          🔧 Utilities Demo
        </h2>
        <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
          <p><strong>Sidebar Behavior:</strong> {utils.getSidebarBehavior()}</p>
          <p><strong>Optimal Columns:</strong> {utils.getOptimalColumns(4)}</p>
          <p><strong>Route Active (dashboard):</strong> {utils.isRouteActive('/dashboard') ? '✅' : '❌'}</p>
          <p><strong>Route Title:</strong> {utils.getRouteTitle(navigation.activeRoute)}</p>
          <p><strong>Responsive Value:</strong> {utils.getResponsiveValue({
            mobile: 'Mobile Value',
            tablet: 'Tablet Value',
            desktop: 'Desktop Value'
          })}</p>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>
          📋 Test Instructions
        </h3>
        <ol style={{ lineHeight: 1.6, fontSize: '0.875rem' }}>
          <li>Try the action buttons to see state changes in real-time</li>
          <li>Resize your browser window to test responsive behavior</li>
          <li>Toggle the sidebar and observe the layout changes</li>
          <li>Navigate between routes and watch the breadcrumbs update</li>
          <li>Check the browser console for any errors</li>
          <li>Test on mobile devices for touch detection</li>
        </ol>
      </div>
    </div>
  );
};

/**
 * Main demo component with providers
 */
export const HooksDemo: React.FC = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <HooksDemoContent />
      </Provider>
    </BrowserRouter>
  );
};

export default HooksDemo;