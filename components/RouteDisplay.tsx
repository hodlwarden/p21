'use client';

import { SwapRoute } from '../types';
import { TrendingUp, Clock, Zap } from 'lucide-react';

interface RouteDisplayProps {
  route: SwapRoute;
}

export function RouteDisplay({ route }: RouteDisplayProps) {
  const formatNumber = (num: string) => {
    const value = parseFloat(num);
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
    return value.toFixed(6);
  };

  return (
    <div className="space-y-3 p-4 bg-secondary-50 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-secondary-700">Route</span>
        <span className="text-sm text-secondary-600">{route.dex}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <span className="text-xs text-secondary-600">Price Impact</span>
          </div>
          <div className="text-sm font-medium text-secondary-900">
            {route.priceImpact.toFixed(2)}%
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Zap className="w-4 h-4 text-warning-600" />
            <span className="text-xs text-secondary-600">Gas</span>
          </div>
          <div className="text-sm font-medium text-secondary-900">
            {formatNumber(route.gasEstimate)}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Clock className="w-4 h-4 text-primary-600" />
            <span className="text-xs text-secondary-600">Time</span>
          </div>
          <div className="text-sm font-medium text-secondary-900">
            {(route.executionTime / 1000).toFixed(1)}s
          </div>
        </div>
      </div>

      {route.steps.length > 1 && (
        <div className="pt-3 border-t border-secondary-200">
          <div className="text-xs text-secondary-600 mb-2">Route Steps:</div>
          <div className="space-y-1">
            {route.steps.map((step, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-secondary-600">
                  {step.inputToken.symbol} → {step.outputToken.symbol}
                </span>
                <span className="text-secondary-500">{step.dex}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
