/**
 * 🏛️ ADMIN SIDEBAR COMPONENT
 * Dynamic sidebar with configurable navigation system
 * Supports expandable/collapsible functionality and localStorage persistence
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTexts } from '../../../../core/hooks';
import { RootState } from '../../../../core/store';
import { setMenuItems, setSidebarCollapsed } from '../../../../core/store/slices/admin/slice';
import { NavigationMenu } from '../navigation/NavigationMenu';
import { defaultMenuItems } from '../../config/menuConfig';
import { AdminSidebarProps } from '../../types';

/**
 * 🎯 ADMIN SIDEBAR COMPONENT
 * Complete sidebar implementation with navigation menu
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  className = '',
  collapsed = false,
  mobileOpen = false,
  menuItems: propMenuItems,
  activeRoute: propActiveRoute, // Renombrado para evitar advertencia de lint
  onToggle,
  onMobileToggle,
  onItemClick,
}) => {
  const dispatch = useDispatch();
  const { admin } = useTexts();
  
  // Redux state
  const { 
    menuItems: stateMenuItems,
    // activeRoute: stateActiveRoute // No se utiliza por ahora
  } = useSelector((state: RootState) => state.admin.navigation);
  
  const { 
    sidebar: sidebarState,
    responsive 
  } = useSelector((state: RootState) => state.admin.ui);

  // Use props or state values
  const currentMenuItems = propMenuItems || stateMenuItems;
  // Nota: currentActiveRoute está disponible para uso futuro en la navegación
  // const currentActiveRoute = activeRoute || stateActiveRoute;
  const isCollapsed = collapsed !== undefined ? collapsed : sidebarState.collapsed;
  const isMobileOpen = mobileOpen !== undefined ? mobileOpen : sidebarState.mobileOpen;

  /**
   * 🔄 Initialize menu items if empty
   */
  useEffect(() => {
    if (currentMenuItems.length === 0) {
      dispatch(setMenuItems(defaultMenuItems));
    }
  }, [dispatch, currentMenuItems.length]);

  /**
   * 💾 Load sidebar state from localStorage on mount
   */
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('admin-sidebar-state');
      if (savedState) {
        const { collapsed: savedCollapsed } = JSON.parse(savedState);
        if (typeof savedCollapsed === 'boolean' && !responsive.isMobile) {
          dispatch(setSidebarCollapsed(savedCollapsed));
        }
      }
    } catch (error) {
      console.warn('Failed to load sidebar state from localStorage:', error);
    }
  }, [dispatch, responsive.isMobile]);

  /**
   * 💾 Save sidebar state to localStorage when it changes
   */
  useEffect(() => {
    if (sidebarState.persistCollapsed && !responsive.isMobile) {
      try {
        localStorage.setItem('admin-sidebar-state', JSON.stringify({
          collapsed: isCollapsed,
        }));
      } catch (error) {
        console.warn('Failed to save sidebar state to localStorage:', error);
      }
    }
  }, [isCollapsed, sidebarState.persistCollapsed, responsive.isMobile]);

  /**
   * 🎯 Handle sidebar toggle
   */
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      dispatch(setSidebarCollapsed(!isCollapsed));
    }
  };

  /**
   * 🎯 Handle mobile sidebar close
   */
  const handleMobileClose = () => {
    if (onMobileToggle) {
      onMobileToggle();
    }
  };

  /**
   * 🎯 Handle menu item click
   */
  const handleMenuItemClick = (item: any) => {
    // Close mobile sidebar when item is clicked
    if (responsive.isMobile && isMobileOpen) {
      handleMobileClose();
    }
    
    // Call custom handler if provided
    if (onItemClick) {
      onItemClick(item);
    }
  };

  /**
   * 🎨 Generate sidebar classes
   */
  const getSidebarClasses = (): string => {
    const classes = ['admin-sidebar'];
    
    if (isCollapsed) classes.push('admin-sidebar--collapsed');
    if (isMobileOpen) classes.push('admin-sidebar--mobile-open');
    if (responsive.isMobile) classes.push('admin-sidebar--mobile');
    if (responsive.isTablet) classes.push('admin-sidebar--tablet');
    if (className) classes.push(className);
    
    return classes.join(' ');
  };

  return (
    <aside 
      className={getSidebarClasses()}
      role="navigation"
      aria-label={admin.sidebar.adminPanel}
      aria-hidden={responsive.isMobile && !isMobileOpen}
    >
      <div className="admin-sidebar__container">
        {/* Sidebar Header */}
        <div className="admin-sidebar__header">
          {!isCollapsed && (
            <div className="admin-sidebar__brand">
              <h2 className="admin-sidebar__brand-text">
                {admin.sidebar.adminPanel}
              </h2>
            </div>
          )}
          
          {/* Mobile close button */}
          {responsive.isMobile && (
            <button
              className="admin-sidebar__mobile-close"
              onClick={handleMobileClose}
              aria-label={admin.layout.closeSidebar}
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="admin-sidebar__nav">
          <NavigationMenu
            menuItems={currentMenuItems}
            collapsed={isCollapsed}
            onItemClick={handleMenuItemClick}
          />
        </div>

        {/* Sidebar Footer */}
        <div className="admin-sidebar__footer">
          {/* Collapse Toggle (Desktop only) */}
          {!responsive.isMobile && (
            <button
              className="admin-sidebar__toggle"
              onClick={handleToggle}
              aria-label={isCollapsed ? admin.layout.expandSidebar : admin.layout.collapseSidebar}
              title={isCollapsed ? admin.layout.expandSidebar : admin.layout.collapseSidebar}
            >
              <span className="admin-sidebar__toggle-icon">
                {isCollapsed ? '▶' : '◀'}
              </span>
              {!isCollapsed && (
                <span className="admin-sidebar__toggle-text">
                  {admin.sidebar.collapse}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile backdrop */}
      {responsive.isMobile && isMobileOpen && (
        <div
          className="admin-sidebar__backdrop"
          onClick={handleMobileClose}
          aria-hidden="true"
        />
      )}
    </aside>
  );
};

export default AdminSidebar;