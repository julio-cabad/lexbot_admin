/**
 * ⚡ QUICK ACTIONS COMPONENT
 * Displays quick action buttons for common admin tasks
 */

import React from 'react';
import { Button } from '../../../../components/ui/Button';
import type { ButtonVariant } from '../../../../types/common';

interface QuickAction {
  label: string;
  description: string;
  icon: string;
  onClick: () => void;
  variant: ButtonVariant;
}

interface QuickActionsProps {
  title: string;
  actions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  title,
  actions,
}) => {
  return (
    <div className="quick-actions">
      <div className="quick-actions__header">
        <h3 className="quick-actions__title">{title}</h3>
      </div>
      
      <div className="quick-actions__content">
        <div className="quick-actions__grid">
          {actions.map((action, index) => (
            <div key={index} className="quick-actions__item">
              <Button
                variant={action.variant}
                onClick={action.onClick}
                className="quick-actions__button"
                icon={action.icon}
              >
                <div className="quick-actions__button-content">
                  <span className="quick-actions__button-label">
                    {action.label}
                  </span>
                  <span className="quick-actions__button-description">
                    {action.description}
                  </span>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;