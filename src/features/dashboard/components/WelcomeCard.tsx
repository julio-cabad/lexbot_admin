/**
 * 👋 WELCOME CARD COMPONENT
 * Displays welcome message and user information
 */

import React from 'react';
import { Button } from '../../../components/ui/Button';

interface WelcomeCardProps {
  user: any;
  userProfile: any;
  userFullName: string;
  userDisplayName: string;
  onRefresh: () => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({
  user,
  userProfile,
  userFullName,
  userDisplayName,
  onRefresh,
}) => {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="welcome-card">
      <div className="welcome-card__content">
        <div className="welcome-card__greeting">
          <h1 className="welcome-card__title">
            {getGreeting()}, {userDisplayName || userFullName || 'Admin'}! 👋
          </h1>
          <p className="welcome-card__subtitle">
            Welcome to your admin dashboard. Here's what's happening today.
          </p>
        </div>
        
        <div className="welcome-card__user-info">
          {userProfile && (
            <div className="welcome-card__profile">
              <div className="welcome-card__avatar">
                {userDisplayName ? userDisplayName.charAt(0).toUpperCase() : '👤'}
              </div>
              <div className="welcome-card__details">
                <span className="welcome-card__name">{userFullName}</span>
                <span className="welcome-card__email">{user?.email}</span>
                <span className="welcome-card__role">
                  {userProfile?.role || 'Administrator'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="welcome-card__actions">
        <Button
          variant="ghost"
          onClick={onRefresh}
          icon="🔄"
          size="sm"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default WelcomeCard;