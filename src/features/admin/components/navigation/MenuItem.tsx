/**
 * 📋 MENU ITEM COMPONENT
 * Individual menu item with icon, label, badge, and interaction support
 * Supports different states: active, hover, disabled, collapsed
 */

import React, { useState } from 'react';
import type { MenuItem as MenuItemType } from '../../types';

interface MenuItemProps {
  item: MenuItemType;
  level?: number;
  collapsed?: boolean;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * 🎯 MENU ITEM COMPONENT
 * Renders individual navigation menu items
 */
export const MenuItem: React.FC<MenuItemProps> = ({
  item,
  level = 0,
  collapsed = false,
  active = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  /**
   * 🎨 Generate item classes
   */
  const getItemClasses = (): string => {
    const classes = ['menu-item'];
    
    if (active) classes.push('menu-item--active');
    if (disabled) classes.push('menu-item--disabled');
    if (collapsed) classes.push('menu-item--collapsed');
    if (level > 0) classes.push(`menu-item--level-${level}`);
    if (item.external) classes.push('menu-item--external');
    if (className) classes.push(className);
    
    return classes.join(' ');
  };

  /**
   * 🎨 Render icon
   */
  const renderIcon = (): React.ReactNode => {
    if (!item.icon) return null;

    // For now, using emoji icons. In a real app, you'd use an icon library
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

    const iconContent = iconMap[item.icon] || '📄';

    return (
      <span 
        className="menu-item__icon"
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
      <span className="menu-item__label">
        {item.label}
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
        className="menu-item__badge"
        aria-label={`${item.badge} notifications`}
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
      <div className="menu-item__tooltip">
        <span className="menu-item__tooltip-text">
          {item.label}
          {item.badge && (
            <span className="menu-item__tooltip-badge">
              {item.badge}
            </span>
          )}
        </span>
      </div>
    );
  };

  /**
   * 🎯 Handle click
   */
  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
  };

  /**
   * 🎯 Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className={getItemClasses()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className="menu-item__button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-current={active ? 'page' : undefined}
        aria-label={item.label}
        title={collapsed ? item.label : undefined}
        tabIndex={disabled ? -1 : 0}
      >
        {renderIcon()}
        {renderLabel()}
        {renderBadge()}
        
        {/* External link indicator */}
        {item.external && !collapsed && (
          <span 
            className="menu-item__external-icon"
            aria-label="External link"
          >
            ↗
          </span>
        )}
      </button>
      
      {renderTooltip()}
      
      {/* Divider */}
      {item.divider && (
        <div className="menu-item__divider" role="separator" />
      )}
    </div>
  );
};

export default MenuItem;