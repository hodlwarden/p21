/**
 * Route Display Component
 * Shows the swap route path and DEX distribution
 */

'use client';

import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { TokenLogo } from '../../ui/TokenLogo';
import { formatPercentage } from '../../../utils/formatters';
import type { Route } from '../../../types';

interface RouteDisplayProps {
  route: Route;
  className?: string;
}

export const RouteDisplay: React.FC<RouteDisplayProps> = ({
  route,
  className = '',
}) => {
  if (!route || route.path.length < 2) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Route Path */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">Route</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">
            {route.path.length - 1} hop{route.path.length > 2 ? 's' : ''}
          </span>
          <ExternalLink className="w-3 h-3 text-gray-500" />
        </div>
      </div>

      {/* Path Visualization */}
      <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
        {route.path.map((token, index) => (
          <React.Fragment key={token.address}>
            <div className="flex flex-col items-center space-y-1">
              <TokenLogo token={token} size="sm" />
              <span className="text-xs font-medium text-gray-300">
                {token.symbol}
              </span>
            </div>
            {index < route.path.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-500 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* DEX Distribution */}
      {route.distribution && route.distribution.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-300">Distribution</span>
          <div className="space-y-2">
            {route.distribution.map((dist, index) => (
              <div
                key={`${dist.dex.id}-${index}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  <span className="text-sm text-gray-300">{dist.dex.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-300">
                  {formatPercentage(dist.percentage)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Route Summary */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-600">
        <div className="text-center">
          <p className="text-xs text-gray-500">Gas Estimate</p>
          <p className="text-sm font-medium text-gray-300">
            {parseInt(route.gasEstimate).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Price Impact</p>
          <p className={`text-sm font-medium ${
            route.priceImpact < 1 
              ? 'text-green-400' 
              : route.priceImpact < 3 
              ? 'text-yellow-400' 
              : 'text-red-400'
          }`}>
            {formatPercentage(route.priceImpact)}
          </p>
        </div>
      </div>
    </div>
  );
};
