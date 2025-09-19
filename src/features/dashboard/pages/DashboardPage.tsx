/**
 * 📊 DASHBOARD PAGE
 * Dashboard principal del área administrativa
 * Feature independiente con sus propios componentes y lógica
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth";
import { useTexts } from "../../../core/hooks/useTexts";
import { useAdminLayoutManager } from "../../admin/hooks/useAdminLayoutManager";
import { Button } from "../../../components/ui/Button";
import {
  DashboardStats,
  RecentActivity,
  QuickActions,
  WelcomeCard,
} from "../components";
import type { Breadcrumb } from "../../admin/types";

/**
 * 🎯 DASHBOARD PAGE COMPONENT
 * Dashboard principal con estadísticas y acciones rápidas
 */
export const DashboardPage: React.FC = () => {
  const { user, userProfile, userFullName, userDisplayName } = useAuth();
  const { dashboard} = useTexts();
  const { actions, responsive, utils } = useAdminLayoutManager();

  // Extract specific functions to avoid dependency issues
  const { setBreadcrumbs, setActiveRoute, navigateTo } = actions;

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

    setBreadcrumbs(breadcrumbs);
    setActiveRoute("/admin/dashboard");
  }, [setBreadcrumbs, setActiveRoute]); // Use specific functions as dependencies

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
    navigateTo("/admin/recipients");
  };

  /**
   * 🎯 Handle navigation to settings
   */
  const handleNavigateToSettings = () => {
    navigateTo("/admin/settings");
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
      <div className="dashboard dashboard--loading">
        <div className="dashboard__loading">
          <div className="dashboard__spinner" />
          <p className="dashboard__loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard dashboard--${responsive.breakpoint}`}>
      {/* Welcome Section */}
      <div className="dashboard__welcome">
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
        className={`dashboard__stats dashboard__stats--${cardLayout}`}
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
        className={`dashboard__content dashboard__content--${responsive.breakpoint}`}
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
        <div className="dashboard__activity">
          <RecentActivity
            title={dashboard.recentActivity}
            emptyMessage={dashboard.noActivity}
            onViewAll={() => navigateTo("/admin/activity")}
          />
        </div>

        {/* Quick Actions */}
        <div className="dashboard__actions">
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
                onClick: () => navigateTo("/admin/messages/new"),
                variant: "secondary",
              },
              {
                label: "View Reports",
                description: "Check analytics and reports",
                icon: "📊",
                onClick: () => navigateTo("/admin/reports"),
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
        <div className="dashboard__mobile-actions">
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
