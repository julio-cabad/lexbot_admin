/**
 * 🏛️ ADMIN DASHBOARD PAGE
 * Dashboard adaptado para el nuevo layout administrativo
 * Integrado con AdminMain, breadcrumbs y sistema de navegación
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth";
import { useTexts } from "../../../core/hooks/useTexts";
import { useAdminLayoutManager } from "../hooks/useAdminLayoutManager";
import { Button } from "../../../components/ui/Button";
import {
  DashboardStats,
  RecentActivity,
  QuickActions,
  WelcomeCard,
} from "../components";
import type { Breadcrumb } from "../types";

/**
 * 🎯 ADMIN DASHBOARD PAGE
 * Dashboard principal del área administrativa
 */
export const DashboardPage: React.FC = () => {
  const { user, userProfile, userFullName, userDisplayName } = useAuth();
  const { dashboard, withUserName } = useTexts();
  const { actions, responsive, utils } = useAdminLayoutManager();

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * 🍞 Setup breadcrumbs for dashboard
   */
  useEffect(() => {
    const breadcrumbs: Breadcrumb[] = [
      {
        label: "Dashboard",
        route: "/admin/dashboard",
        isActive: true,
      },
    ];

    actions.setBreadcrumbs(breadcrumbs);
    actions.setActiveRoute("/admin/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount to avoid infinite loops

  /**
   * 🔄 Simulate loading state
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [refreshKey]);

  /**
   * 🔄 Handle refresh
   */
  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  /**
   * 🎯 Handle navigation to recipients
   */
  const handleNavigateToRecipients = () => {
    actions.navigateTo("/admin/recipients");
  };

  /**
   * 🎯 Handle navigation to settings
   */
  const handleNavigateToSettings = () => {
    actions.navigateTo("/admin/settings");
  };

  /**
   * 🎨 Get responsive grid columns
   */
  const gridColumns = utils.getOptimalColumns(3);

  /**
   * 🎨 Get responsive card layout
   */
  const cardLayout = utils.getResponsiveValue({
    mobile: "single",
    tablet: "double",
    desktop: "triple",
  });

  if (isLoading) {
    return (
      <div className="admin-dashboard admin-dashboard--loading">
        <div className="admin-dashboard__loading">
          <div className="admin-dashboard__spinner" />
          <p className="admin-dashboard__loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard admin-dashboard--${responsive.breakpoint}`}>
      {/* Welcome Section */}
      <div className="admin-dashboard__welcome">
        <WelcomeCard
          user={user}
          userProfile={userProfile}
          userFullName={userFullName}
          userDisplayName={userDisplayName}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Stats Grid */}
      <div
        className={`admin-dashboard__stats admin-dashboard__stats--${cardLayout}`}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          gap: responsive.isMobile ? "1rem" : "1.5rem",
        }}
      >
        <DashboardStats
          title={dashboard.statistics}
          description={dashboard.summary}
          value="1,234"
          change="+12%"
          trend="up"
          icon="📊"
        />

        <DashboardStats
          title="Active Users"
          description="Users online now"
          value="89"
          change="+5%"
          trend="up"
          icon="👥"
        />

        <DashboardStats
          title="Messages Sent"
          description="This month"
          value="5,678"
          change="-2%"
          trend="down"
          icon="📧"
        />
      </div>

      {/* Content Grid */}
      <div
        className={`admin-dashboard__content admin-dashboard__content--${responsive.breakpoint}`}
        style={{
          display: "grid",
          gridTemplateColumns: responsive.isMobile
            ? "1fr"
            : responsive.isTablet
            ? "1fr 1fr"
            : "2fr 1fr",
          gap: responsive.isMobile ? "1rem" : "1.5rem",
        }}
      >
        {/* Recent Activity */}
        <div className="admin-dashboard__activity">
          <RecentActivity
            title={dashboard.recentActivity}
            emptyMessage={dashboard.noActivity}
            onViewAll={() => actions.navigateTo("/admin/activity")}
          />
        </div>

        {/* Quick Actions */}
        <div className="admin-dashboard__actions">
          <QuickActions
            title={dashboard.quickActions}
            actions={[
              {
                label: "Manage Recipients",
                description: "Add, edit, or remove recipients",
                icon: "👥",
                onClick: handleNavigateToRecipients,
                variant: "primary",
              },
              {
                label: "Send Message",
                description: "Send a new message",
                icon: "📧",
                onClick: () => actions.navigateTo("/admin/messages/new"),
                variant: "secondary",
              },
              {
                label: "View Reports",
                description: "Check analytics and reports",
                icon: "📊",
                onClick: () => actions.navigateTo("/admin/reports"),
                variant: "ghost",
              },
              {
                label: "Settings",
                description: "Configure system settings",
                icon: "⚙️",
                onClick: handleNavigateToSettings,
                variant: "ghost",
              },
            ]}
          />
        </div>
      </div>

      {/* Mobile-specific actions */}
      {responsive.isMobile && (
        <div className="admin-dashboard__mobile-actions">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNavigateToRecipients}
            icon="👥"
          >
            Manage Recipients
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
