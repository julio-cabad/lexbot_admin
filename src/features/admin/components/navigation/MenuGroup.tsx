/**
 * 📁 MENU GROUP COMPONENT
 * Collapsible menu group that contains nested menu items
 * Supports expand/collapse functionality and nested navigation
 */

import React, { useState } from 'react';
import type { MenuItem } from '../../types';

interface MenuGroupProps {
  item: MenuItem;
  level?: number;
  collapsed?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  onItemClick?: (item: MenuItem) => void;
  children?: React.ReactNode;
  className?: string;
}

/**
 * 🎯 MENU GROUP COMPONENT
 * Renders expandable menu groups with nested items
 */
export const MenuGroup: React.FC<MenuGroupProps> = ({
  item,
  level = 0,
  collapsed = false,
  expanded = false,
  onToggle,
  onItemClick,
  children,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  /**
   * 🎨 Generate group classes
   */
  const getGroupClasses = (): string => {
    const classes = ['menu-group'];
    
    if (expanded) classes.push('menu-group--expanded');
    if (collapsed) classes.push('menu-group--collapsed');
    if (level > 0) classes.push(`menu-group--level-${level}`);
    if (className) classes.push(className);
    
    return classes.join(' ');
  };

  /**
   * 🎨 Render icon
   */
  const renderIcon = (): React.ReactNode => {
    if (!item.icon) return null;

    // Icon mapping (same as MenuItem)
    const iconMap: Record<string, string> = {
      dashboard: '📊',
      users: '👥',
      user: '👤',
      recipients: '📧',
      settings: '⚙️',
      profile: '👤',
      preferences: '🔧',
      analytics: '📈',
      reports: '📋',
      notifications: '🔔',
      security: '🔒',
      help: '❓',
      logout: '🚪',
    };

    const iconContent = iconMap[item.icon] || '📁';

    return (
      <span 
        className="menu-group__icon"
        aria-hidden="true"
      >
        {iconContent}
      </span>
    );
  };

  /**
   * 🎨 Render label
   */
  const renderLabel = (): React.ReactNode => {
    if (collapsed && level === 0) return null;

    return (
      <span className="menu-group__label">
        {item.label}
      </span>
    );
  };

  /**
   * 🎨 Render expand/collapse arrow
   */
  const renderArrow = (): React.ReactNode => {
    if (collapsed && level === 0) return null;

    return (
      <span 
        className={`menu-group__arrow ${expanded ? 'menu-group__arrow--expanded' : ''}`}
        aria-hidden="true"
      >
        ▶
      </span>
    );
  };

  /**
   * 🎨 Render badge
   */
  const renderBadge = (): React.ReactNode => {
    if (!item.badge || (collapsed && level === 0)) return null;

    return (
      <span 
        className="menu-group__badge"
        aria-label={`${item.badge} items`}
      >
        {item.badge}
      </span>
    );
  };

  /**
   * 🎨 Render tooltip for collapsed state
   */
  const renderTooltip = (): React.ReactNode => {
    if (!collapsed || level > 0 || !isHovered) return null;

    return (
      <div className="menu-group__tooltip">
        <span className="menu-group__tooltip-text">
          {item.label}
          {item.badge && (
            <span className="menu-group__tooltip-badge">
              {item.badge}
            </span>
          )}
        </span>
      </div>
    );
  };

  /**
   * 🎯 Handle toggle
   */
  const handleToggle = () => {
    if (onToggle) onToggle();
  };

  /**
   * 🎯 Handle group header click
   */
  const handleHeaderClick = () => {
    // If group has a route, navigate to it
    if (item.route && onItemClick) {
      onItemClick(item);
    }
    
    // Always toggle the group
    handleToggle();
  };

  /**
   * 🎯 Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleHeaderClick();
    }
    
    // Arrow keys for navigation
    if (event.key === 'ArrowRight' && !expanded) {
      event.preventDefault();
      handleToggle();
    } else if (event.key === 'ArrowLeft' && expanded) {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div 
      className={getGroupClasses()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Group Header */}
      <button
        className="menu-group__header"
        onClick={handleHeaderClick}
        onKeyDown={handleKeyDown}
        aria-expanded={expanded}
        aria-controls={`menu-group-${item.id}`}
        aria-label={`${item.label} menu group`}
        title={collapsed ? item.label : undefined}
      >
        {renderIcon()}
        {renderLabel()}
        {renderBadge()}
        {renderArrow()}
      </button>

      {/* Group Content */}
      <div
        id={`menu-group-${item.id}`}
        className={`menu-group__content ${expanded ? 'menu-group__content--expanded' : ''}`}
        role="group"
        aria-labelledby={`menu-group-header-${item.id}`}
      >
        <div className="menu-group__items">
          {children}
        </div>
      </div>

      {renderTooltip()}

      {/* Divider */}
      {item.divider && (
        <div className="menu-group__divider" role="separator" />
      )}
    </div>
  );
};

export default MenuGroup;