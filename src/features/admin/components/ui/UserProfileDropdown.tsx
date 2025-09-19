/**
 * 👤 USER PROFILE DROPDOWN COMPONENT
 * Dropdown menu with user information and profile actions
 * Integrates with existing authentication state
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../core/hooks';
import { RootState } from '../../../../core/store';
import { logoutUser } from '../../../../core/store/slices/auth/thunks';

interface UserProfileDropdownProps {
  className?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

/**
 * 🎯 USER PROFILE DROPDOWN
 * Complete user profile menu with avatar, info, and actions
 */
export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  className = '',
  onProfileClick,
  onSettingsClick,
  onLogout,
}) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get user data from Redux store
  const { user, userProfile } = useSelector((state: RootState) => ({
    user: state.auth.user,
    userProfile: state.auth.userProfile,
  }));

  /**
   * 🔄 Handle logout
   */
  const handleLogout = async () => {
    try {
      if (onLogout) {
        onLogout();
      } else {
        const result = dispatch(logoutUser());
        if ('unwrap' in result) {
          await result.unwrap();
        }
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsOpen(false);
  };

  /**
   * 👤 Handle profile click
   */
  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      // Default: navigate to profile page
      window.location.href = '/admin/profile';
    }
    setIsOpen(false);
  };

  /**
   * ⚙️ Handle settings click
   */
  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      // Default: navigate to settings page
      window.location.href = '/admin/settings';
    }
    setIsOpen(false);
  };

  /**
   * 🖱️ Handle click outside to close dropdown
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * ⌨️ Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  // Get user display information
  const displayName = userProfile?.firstName && userProfile?.lastName
    ? `${userProfile.firstName} ${userProfile.lastName}`
    : userProfile?.firstName
    ? userProfile.firstName
    : user?.email?.split('@')[0]
    || 'Usuario';

  const userEmail = user?.email || '';
  const userRole = userProfile?.role || 'Usuario';

  // Generate avatar initials
  const avatarInitials = displayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`user-profile-dropdown ${className}`} ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        className="user-profile-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="User profile menu"
      >
        {/* Avatar */}
        <div className="user-profile-dropdown__avatar">
          {avatarInitials}
        </div>
        
        {/* User Info */}
        <div className="user-profile-dropdown__info">
          <span className="user-profile-dropdown__name">{displayName}</span>
          <span className="user-profile-dropdown__role">{userRole}</span>
        </div>
        
        {/* Dropdown Arrow */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`user-profile-dropdown__arrow ${isOpen ? 'user-profile-dropdown__arrow--open' : ''}`}
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="user-profile-dropdown__menu" role="menu">
          {/* User Info Header */}
          <div className="user-profile-dropdown__header">
            <div className="user-profile-dropdown__avatar user-profile-dropdown__avatar--large">
              {avatarInitials}
            </div>
            <div className="user-profile-dropdown__details">
              <div className="user-profile-dropdown__name user-profile-dropdown__name--large">
                {displayName}
              </div>
              <div className="user-profile-dropdown__email">
                {userEmail}
              </div>
              <div className="user-profile-dropdown__role user-profile-dropdown__role--badge">
                {userRole}
              </div>
            </div>
          </div>

          {/* Menu Divider */}
          <div className="user-profile-dropdown__divider" />

          {/* Menu Items */}
          <div className="user-profile-dropdown__items">
            <button
              className="user-profile-dropdown__item"
              onClick={handleProfileClick}
              role="menuitem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Mi Perfil</span>
            </button>

            <button
              className="user-profile-dropdown__item"
              onClick={handleSettingsClick}
              role="menuitem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
              </svg>
              <span>Configuración</span>
            </button>

            {/* Divider */}
            <div className="user-profile-dropdown__divider" />

            <button
              className="user-profile-dropdown__item user-profile-dropdown__item--danger"
              onClick={handleLogout}
              role="menuitem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;