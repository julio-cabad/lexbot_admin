/**
 * 📄 PAGE HEADER COMPONENT
 * Consistent page header with title, breadcrumbs, and actions
 */

import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import type { Breadcrumb as BreadcrumbType } from '../../types';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbType[];
  actions?: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
}

/**
 * 🎯 PAGE HEADER COMPONENT
 * Renders page header with title, breadcrumbs, and action buttons
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  className = '',
  showBreadcrumbs = true,
}) => {
  const hasContent = title || subtitle || breadcrumbs.length > 0 || actions;
  
  if (!hasContent) return null;

  return (
    <header className={`page-header ${className}`}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && breadcrumbs.length > 0 && (
        <div className="page-header__breadcrumbs">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      {/* Title and Actions Row */}
      {(title || subtitle || actions) && (
        <div className="page-header__main">
          <div className="page-header__content">
            {(title || subtitle) && (
              <div className="page-header__titles">
                {title && (
                  <h1 className="page-header__title">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="page-header__subtitle">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {actions && (
            <div className="page-header__actions">
              {actions}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default PageHeader;