/**
 * 🏛️ ADMIN HEADER COMPONENT
 * Professional top navigation bar with branding, controls, and user information
 * Complete implementation with responsive design and user profile integration
 */

import React from "react";
import { useSelector } from "react-redux";
import { useTexts } from "../../../../core/hooks";
import { RootState } from "../../../../core/store";
import { AdminHeaderProps } from "../../types";
import { SidebarToggle } from "../ui/SidebarToggle";
import { UserProfileDropdown } from "../ui/UserProfileDropdown";

/**
 * 🎯 ADMIN HEADER COMPONENT
 * Complete header implementation with logo, navigation, and user profile
 */
export const AdminHeader: React.FC<AdminHeaderProps> = ({
  className = "",
  showLogo = true,
  showUserProfile = true,
  showSidebarToggle = true,
  onSidebarToggle,
  onLogout,
}) => {
  const { admin } = useTexts();
  // Get responsive and sidebar state from Redux
  const { responsive, sidebar } = useSelector((state: RootState) => ({
    responsive: state.admin.ui.responsive,
    sidebar: state.admin.ui.sidebar,
  }));

  return (
    <header className={`admin-header ${className}`}>
      <div className="admin-header__container">
        {/* Left Section: Sidebar Toggle + Logo */}
        <div className="admin-header__left">
          {/* Sidebar Toggle */}
          {showSidebarToggle && onSidebarToggle && (
            <SidebarToggle
              onClick={onSidebarToggle}
              className="admin-header__sidebar-toggle"
              isCollapsed={sidebar.collapsed}
              isMobile={responsive.isMobile}
            />
          )}

          {/* Logo/Branding */}
          {showLogo && (
            <div className="admin-header__logo">
              <div className="admin-header__logo-icon">
                {/* LexBot Logo Icon */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  className="admin-header__logo-svg"
                >
                  <rect
                    width="32"
                    height="32"
                    rx="8"
                    fill="url(#logoGradient)"
                  />
                  <path
                    d="M8 12h6l2 4 2-4h6l-4 8 4 8h-6l-2-4-2 4H8l4-8-4-8z"
                    fill="white"
                  />
                  <defs>
                    <linearGradient
                      id="logoGradient"
                      x1="0"
                      y1="0"
                      x2="32"
                      y2="32"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Logo Text - Hidden on mobile */}
              {!responsive.isMobile && (
                <div className="admin-header__logo-text">
                  <h1 className="admin-header__logo-title">LexBot</h1>
                  <span className="admin-header__logo-subtitle">Admin</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center Section: Breadcrumbs (Future Implementation) */}
        <div className="admin-header__center">
          {/* Breadcrumbs will be implemented in AdminMain component */}
        </div>

        {/* Right Section: User Profile + Actions */}
        <div className="admin-header__right">
          {/* Notifications (Future Implementation) */}
          <div className="admin-header__notifications">
            <button
              className="admin-header__notification-btn"
              aria-label={admin.header.notifications}
              title={admin.header.notifications}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {/* Notification Badge */}
              <span className="admin-header__notification-badge">3</span>
            </button>
          </div>

          {/* User Profile Dropdown */}
          {showUserProfile && (
            <UserProfileDropdown
              className="admin-header__user-profile"
              onLogout={onLogout}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
