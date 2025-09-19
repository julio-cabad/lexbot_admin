/**
 * 🎛️ SIDEBAR TOGGLE COMPONENT
 * Button component for toggling sidebar visibility
 * Responsive design for mobile/tablet navigation control
 */

import React from 'react';

interface SidebarToggleProps {
  onClick: () => void;
  className?: string;
  isCollapsed?: boolean;
  isMobile?: boolean;
  'aria-label'?: string;
}

/**
 * 🎯 SIDEBAR TOGGLE BUTTON
 * Responsive toggle button with animated hamburger/arrow icon
 */
export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  onClick,
  className = '',
  isCollapsed = false,
  isMobile = false,
  'aria-label': ariaLabel,
}) => {
  const defaultAriaLabel = isMobile 
    ? 'Toggle mobile menu'
    : isCollapsed 
      ? 'Expand sidebar' 
      : 'Collapse sidebar';

  return (
    <button
      className={`sidebar-toggle ${className}`}
      onClick={onClick}
      aria-label={ariaLabel || defaultAriaLabel}
      type="button"
    >
      {isMobile ? (
        // Hamburger icon for mobile
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sidebar-toggle__icon"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      ) : (
        // Arrow icon for desktop (changes direction based on collapsed state)
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`sidebar-toggle__icon ${isCollapsed ? 'sidebar-toggle__icon--collapsed' : ''}`}
        >
          <polyline points={isCollapsed ? "9,18 15,12 9,6" : "15,18 9,12 15,6"} />
        </svg>
      )}
    </button>
  );
};

export default SidebarToggle;