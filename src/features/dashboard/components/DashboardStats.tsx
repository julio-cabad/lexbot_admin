/**
 * 📊 DASHBOARD STATS COMPONENT
 * Displays statistical information with trend indicators
 */

import React from 'react';

interface DashboardStatsProps {
  title: string;
  description: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  title,
  description,
  value,
  change,
  trend,
  icon,
}) => {
  return (
    <div className="dashboard-stats">
      <div className="dashboard-stats__header">
        <span className="dashboard-stats__icon">{icon}</span>
        <h3 className="dashboard-stats__title">{title}</h3>
      </div>
      <div className="dashboard-stats__content">
        <div className="dashboard-stats__value">{value}</div>
        <div className="dashboard-stats__description">{description}</div>
        <div className={`dashboard-stats__change dashboard-stats__change--${trend}`}>
          {change}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;