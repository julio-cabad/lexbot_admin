/**
 * 🏛️ ADMIN LAYOUT COMPONENT
 * Root layout container that orchestrates the entire admin interface
 * Built with CSS Grid for optimal performance and responsive behavior
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTexts } from '../../../../core/hooks';
import { RootState } from '../../../../core/store';
import { 
  setResponsiveBreakpoint, 
  setSidebarCollapsed,
  setMobileSidebarOpen 
} from '../../../../core/store/slices/admin/slice';
import { AdminLayoutProps } from '../../types';
import { layoutConfig } from '../../config/layoutConfig';
import { AdminLayoutErrorBoundary } from './AdminLayoutErrorBoundary';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminMain } from './AdminMain';

/**
 * 🏗️ ADMIN LAYOUT COMPONENT
 * Provides the main grid-based layout structure for the admin interface
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  className = '',
  sidebarCollapsed,
  onSidebarToggle,
}) => {
  const dispatch = useDispatch();
  const { admin } = useTexts();
  
  // Redux state selectors
  const {
    sidebar,
    responsive,
    animation
  } = useSelector((state: RootState) => state.admin.ui);
  
  const { activeRoute } = useSelector((state: RootState) => state.admin.navigation);

  // Determine current sidebar state
  const isSidebarCollapsed = sidebarCollapsed !== undefined ? sidebarCollapsed : sidebar.collapsed;
  const isMobileSidebarOpen = sidebar.mobileOpen;

  /**
   * 📱 Handle responsive breakpoint detection
   */
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const config = layoutConfig.getConfig();
    
    let newBreakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    
    if (width < config.responsive.breakpoints.mobile) {
      newBreakpoint = 'mobile';
    } else if (width < config.responsive.breakpoints.tablet) {
      newBreakpoint = 'tablet';
    }
    
    // Only dispatch if breakpoint actually changed
    if (newBreakpoint !== responsive.breakpoint) {
      dispatch(setResponsiveBreakpoint(newBreakpoint));
    }
  }, [dispatch, responsive.breakpoint]);

  /**
   * 🎯 Handle sidebar toggle
   */
  const handleSidebarToggle = useCallback(() => {
    if (onSidebarToggle) {
      onSidebarToggle();
    } else {
      if (responsive.isMobile) {
        dispatch(setMobileSidebarOpen(!isMobileSidebarOpen));
      } else {
        dispatch(setSidebarCollapsed(!isSidebarCollapsed));
      }
    }
  }, [
    onSidebarToggle,
    dispatch,
    responsive.isMobile,
    isSidebarCollapsed,
    isMobileSidebarOpen
  ]);

  /**
   * 🔄 Handle mobile sidebar close (overlay click)
   */
  const handleMobileSidebarClose = useCallback(() => {
    if (responsive.isMobile && isMobileSidebarOpen) {
      dispatch(setMobileSidebarOpen(false));
    }
  }, [dispatch, responsive.isMobile, isMobileSidebarOpen]);

  /**
   * ⌨️ Handle keyboard navigation
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // ESC key closes mobile sidebar
    if (event.key === 'Escape' && responsive.isMobile && isMobileSidebarOpen) {
      dispatch(setMobileSidebarOpen(false));
    }
    
    // Alt + S toggles sidebar (accessibility shortcut)
    if (event.altKey && event.key === 's') {
      event.preventDefault();
      handleSidebarToggle();
    }
  }, [dispatch, responsive.isMobile, isMobileSidebarOpen, handleSidebarToggle]);

  /**
   * 🎨 Generate CSS custom properties for dynamic theming
   */
  const cssVariables = useMemo(() => {
    const theme = layoutConfig.getTheme();
    const variables = layoutConfig.generateCSSVariables(theme);
    
    // Add dynamic sidebar width based on current state
    variables['--admin-sidebar-width'] = isSidebarCollapsed 
      ? theme.layout.sidebarWidth.collapsed 
      : theme.layout.sidebarWidth.expanded;
    
    return variables;
  }, [isSidebarCollapsed]);

  /**
   * 🔧 Setup effects
   */
  useEffect(() => {
    // Initial breakpoint detection
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Add keyboard listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleResize, handleKeyDown]);

  /**
   * 💾 Persist sidebar state to localStorage
   */
  useEffect(() => {
    if (sidebar.persistCollapsed && !responsive.isMobile) {
      try {
        localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(isSidebarCollapsed));
      } catch (error) {
        console.warn('Failed to persist sidebar state:', error);
      }
    }
  }, [isSidebarCollapsed, sidebar.persistCollapsed, responsive.isMobile]);

  /**
   * 🎨 Generate layout classes
   */
  const layoutClasses = useMemo(() => {
    const classes = ['admin-layout'];
    
    // Sidebar state classes
    if (isSidebarCollapsed) {
      classes.push('admin-layout--sidebar-collapsed');
    } else {
      classes.push('admin-layout--sidebar-expanded');
    }
    
    // Mobile sidebar state
    if (responsive.isMobile && isMobileSidebarOpen) {
      classes.push('admin-layout--mobile-sidebar-open');
    }
    
    // Responsive classes
    classes.push(`admin-layout--${responsive.breakpoint}`);
    
    // Animation classes
    if (animation.sidebarTransition) {
      classes.push('admin-layout--animated');
    }
    
    // Custom className
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [
    isSidebarCollapsed,
    responsive.isMobile,
    responsive.breakpoint,
    isMobileSidebarOpen,
    animation.sidebarTransition,
    className
  ]);

  return (
    <AdminLayoutErrorBoundary>
      <div 
        className={layoutClasses}
        style={cssVariables}
        role="application"
        aria-label={admin.sidebar.adminPanel}
      >
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="admin-skip-link"
          tabIndex={1}
        >
          {admin.layout.skipToContent}
        </a>

        {/* Header */}
        <AdminHeader
          className="admin-layout__header"
          showSidebarToggle={true}
          onSidebarToggle={handleSidebarToggle}
        />

        {/* Sidebar */}
        <AdminSidebar
          className="admin-layout__sidebar"
          collapsed={isSidebarCollapsed}
          mobileOpen={isMobileSidebarOpen}
          activeRoute={activeRoute}
          onToggle={handleSidebarToggle}
          onMobileToggle={handleMobileSidebarClose}
        />

        {/* Main Content Area */}
        <AdminMain
          className="admin-layout__main"
          id="main-content"
        >
          {children}
        </AdminMain>

        {/* Mobile overlay */}
        {responsive.isMobile && isMobileSidebarOpen && (
          <div
            className="admin-layout__overlay"
            onClick={handleMobileSidebarClose}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleMobileSidebarClose();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={admin.layout.closeSidebar}
          />
        )}
      </div>
    </AdminLayoutErrorBoundary>
  );
};

/**
 * 🎯 Default export
 */
export default AdminLayout;