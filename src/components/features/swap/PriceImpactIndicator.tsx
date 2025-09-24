/**
 * Price Impact Indicator Component
 * Visual indicator for trade price impact with color coding
 */

'use client';

import React from 'react';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { formatPercentage } from '../../../utils/formatters';

interface PriceImpactIndicatorProps {
  impact: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const PriceImpactIndicator: React.FC<PriceImpactIndicatorProps> = ({
  impact,
  size = 'sm',
  showIcon = true,
  className = '',
}) => {
  // Determine severity and styling
  const getSeverity = (impact: number) => {
    const abs = Math.abs(impact);
    if (abs < 1) return 'low';
    if (abs < 3) return 'medium';
    if (abs < 5) return 'high';
    return 'critical';
  };

  const severity = getSeverity(impact);

  const severityStyles = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    critical: 'text-red-400',
  };

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={""}>
      {showIcon && (severity === 'high' || severity === 'critical') && (
        <AlertTriangle className={""} />
      )}
      {showIcon && severity === 'medium' && (
        <TrendingDown className={""} />
      )}
      <span className={""}>
        {formatPercentage(Math.abs(impact))}
      </span>
      {severity === 'critical' && (
        <span className="text-xs text-red-400 font-medium">(High)</span>
      )}
    </div>
  );
};
