/**
 * 🧭 NAVIGATION MENU COMPONENT
 * Main navigation menu that renders configurable menu items
 * Supports nested navigation, active states, and responsive behavior
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../../../core/store';
import { setActiveRoute, toggleMenuGroup } from '../../../../core/store/slices/admin/slice';
import { MenuItem as MenuItemComponent } from './MenuItem';
import { MenuGroup } from './MenuGroup';
import type { MenuItem } from '../../types';

interface NavigationMenuProps {
  className?: string;
  menuItems?: MenuItem[];
  collapsed?: boolean;
  onItemClick?: (item: MenuItem) => void;
}

/**
 * 🎯 NAVIGATION MENU COMPONENT
 * Renders the complete navigation menu with items and groups
 */
export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  className = '',
  menuItems: propMenuItems,
  collapsed = false,
  onItemClick,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redux state
  const { 
    menuItems: stateMenuItems, 
    activeRoute, 
    expandedGroups 
  } = useSelector((state: RootState) => state.admin.navigation);
  
  // Use prop items or state items
  const menuItems = propMenuItems || stateMenuItems;

  /**
   * 🎯 Handle menu item click
   */
  const handleItemClick = (item: MenuItem) => {
    // Update active route in Redux
    dispatch(setActiveRoute(item.route));
    
    // Navigate to route
    if (item.route && !item.external) {
      navigate(item.route);
    } else if (item.route && item.external) {
      window.open(item.route, item.target || '_blank');
    }
    
    // Call custom handler if provided
    if (onItemClick) {
      onItemClick(item);
    }
  };

  /**
   * 🔄 Handle menu group toggle
   */
  const handleGroupToggle = (groupId: string) => {
    dispatch(toggleMenuGroup(groupId));
  };

  /**
   * 🎨 Check if item is active
   */
  const isItemActive = (item: MenuItem): boolean => {
    const currentPath = location.pathname;
    
    // Exact match for the route
    if (item.route === currentPath) return true;
    
    // Check for active route from Redux state
    if (item.route === activeRoute) {
      // Only consider it active if it's an exact match or we're on a subpage
      return currentPath === item.route || currentPath.startsWith(`${item.route}/`);
    }
    
    // For dashboard, only be active when exactly on dashboard
    if (item.id === 'dashboard') {
      return currentPath === '/admin/dashboard';
    }
    
    // For other items, check if we're on a subpage
    if (currentPath.startsWith(`${item.route}/`)) return true;
    
    // Check if any child is active
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    
    return false;
  };

  /**
   * 🎨 Check if group is expanded
   */
  const isGroupExpanded = (groupId: string): boolean => {
    return expandedGroups.includes(groupId);
  };

  /**
   * 🎨 Render menu items recursively
   */
  const renderMenuItems = (items: MenuItem[], level: number = 0): React.ReactNode => {
    return items.map((item) => {
      // If item has children, render as group
      if (item.children && item.children.length > 0) {
        return (
          <MenuGroup
            key={item.id}
            item={item}
            level={level}
            collapsed={collapsed}
            expanded={isGroupExpanded(item.id)}
            onToggle={() => handleGroupToggle(item.id)}
            onItemClick={handleItemClick}
          >
            {renderMenuItems(item.children, level + 1)}
          </MenuGroup>
        );
      }

      // Render as regular menu item
      return (
        <MenuItemComponent
          key={item.id}
          item={item}
          level={level}
          collapsed={collapsed}
          active={isItemActive(item)}
          onClick={() => handleItemClick(item)}
        />
      );
    });
  };

  /**
   * 🎨 Filter items by permissions (placeholder for future implementation)
   */
  const filterItemsByPermissions = (items: MenuItem[]): MenuItem[] => {
    // TODO: Implement permission filtering when user permissions are available
    // For now, return all items
    return items.filter(item => {
      // Basic visibility check
      if (item.permissions && item.permissions.length > 0) {
        // In the future, check against user permissions
        // return userPermissions.some(permission => item.permissions!.includes(permission));
        return true; // For now, show all items
      }
      return true;
    });
  };

  // Filter menu items
  const visibleItems = filterItemsByPermissions(menuItems);

  if (visibleItems.length === 0) {
    return (
      <div className={`navigation-menu navigation-menu--empty ${className}`}>
        <div className="navigation-menu__empty-state">
          {!collapsed && (
            <p className="navigation-menu__empty-text">
              No menu items available
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <nav 
      className={`navigation-menu ${collapsed ? 'navigation-menu--collapsed' : ''} ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navigation-menu__container">
        {renderMenuItems(visibleItems)}
      </div>
    </nav>
  );
};

export default NavigationMenu;