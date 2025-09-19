/**
 * 🍞 BREADCRUMB COMPONENT
 * Route-based breadcrumb navigation with dynamic generation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Breadcrumb as BreadcrumbType } from '../../types';

interface BreadcrumbProps {
  items: BreadcrumbType[];
  className?: string;
  separator?: string;
  maxItems?: number;
}

/**
 * 🎯 BREADCRUMB COMPONENT
 * Renders navigation breadcrumbs with click handling
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  separator = '/',
  maxItems = 5,
}) => {
  const navigate = useNavigate();

  /**
   * 🎯 Handle breadcrumb click
   */
  const handleClick = (item: BreadcrumbType) => {
    if (item.route && !item.isActive) {
      navigate(item.route);
    }
  };

  /**
   * 🎯 Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent, item: BreadcrumbType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(item);
    }
  };

  /**
   * 🎨 Truncate items if too many
   */
  const getDisplayItems = (): BreadcrumbType[] => {
    if (items.length <= maxItems) return items;
    
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 2));
    
    return [
      firstItem,
      { label: '...', route: undefined, isActive: false },
      ...lastItems
    ];
  };

  const displayItems = getDisplayItems();

  if (displayItems.length === 0) return null;

  return (
    <nav 
      className={`breadcrumb ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <ol className="breadcrumb__list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isClickable = item.route && !item.isActive && item.label !== '...';
          
          return (
            <li key={`${item.label}-${index}`} className="breadcrumb__item">
              {isClickable ? (
                <button
                  className="breadcrumb__link"
                  onClick={() => handleClick(item)}
                  onKeyDown={(e) => handleKeyDown(e, item)}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {item.icon && (
                    <span className="breadcrumb__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              ) : (
                <span 
                  className={`breadcrumb__text ${item.isActive ? 'breadcrumb__text--active' : ''}`}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {item.icon && (
                    <span className="breadcrumb__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <span 
                  className="breadcrumb__separator" 
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;