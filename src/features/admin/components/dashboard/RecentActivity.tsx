/**
 * 📋 RECENT ACTIVITY COMPONENT
 * Displays recent system activity and events
 */

import React from 'react';

interface RecentActivityProps {
  title: string;
  emptyMessage: string;
  onViewAll?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  title,
  emptyMessage,
  onViewAll,
}) => {
  // Mock activity data
  const activities = [
    {
      id: 1,
      type: 'user_registered',
      message: 'New user registered',
      timestamp: '2 minutes ago',
      icon: '👤',
    },
    {
      id: 2,
      type: 'message_sent',
      message: 'Message sent to 50 recipients',
      timestamp: '15 minutes ago',
      icon: '📧',
    },
    {
      id: 3,
      type: 'system_update',
      message: 'System updated successfully',
      timestamp: '1 hour ago',
      icon: '🔄',
    },
  ];

  return (
    <div className="recent-activity">
      <div className="recent-activity__header">
        <h3 className="recent-activity__title">{title}</h3>
        {onViewAll && (
          <button 
            className="recent-activity__view-all"
            onClick={onViewAll}
          >
            View All
          </button>
        )}
      </div>
      
      <div className="recent-activity__content">
        {activities.length > 0 ? (
          <div className="recent-activity__list">
            {activities.map((activity) => (
              <div key={activity.id} className="recent-activity__item">
                <span className="recent-activity__icon">{activity.icon}</span>
                <div className="recent-activity__details">
                  <p className="recent-activity__message">{activity.message}</p>
                  <span className="recent-activity__timestamp">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="recent-activity__empty">
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;