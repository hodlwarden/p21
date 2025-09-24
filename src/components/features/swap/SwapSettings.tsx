/**
 * Swap Settings Component
 * Advanced swap configuration panel
 */

'use client';

import React, { useState } from 'react';
import { Settings, Clock, AlertTriangle, Info } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { isValidSlippage, isValidDeadline } from '../../../utils/validators';

interface SwapSettingsProps {
  slippage: number;
  deadline: number;
  onSlippageChange: (value: number) => void;
  onDeadlineChange: (value: number) => void;
  className?: string;
}

const SLIPPAGE_PRESETS = [0.1, 0.5, 1.0, 3.0];
const DEADLINE_PRESETS = [10, 20, 30, 60];

export const SwapSettings: React.FC<SwapSettingsProps> = ({
  slippage,
  deadline,
  onSlippageChange,
  onDeadlineChange,
  className = '',
}) => {
  const [customSlippage, setCustomSlippage] = useState('');
  const [customDeadline, setCustomDeadline] = useState('');

  const slippageValidation = isValidSlippage(slippage);
  const deadlineValidation = isValidDeadline(deadline);

  const handleSlippagePreset = (value: number) => {
    onSlippageChange(value);
    setCustomSlippage('');
  };

  const handleCustomSlippage = (value: string) => {
    setCustomSlippage(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onSlippageChange(numValue);
    }
  };

  const handleDeadlinePreset = (value: number) => {
    onDeadlineChange(value);
    setCustomDeadline('');
  };

  const handleCustomDeadline = (value: string) => {
    setCustomDeadline(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onDeadlineChange(numValue);
    }
  };

  return (
    <Card className={`bg-gray-700/50 border-gray-600 ${className}`}>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-200">Swap Settings</h3>
        </div>

        {/* Slippage Tolerance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-200">Slippage Tolerance</span>
              <div className="group relative">
                <Info className="w-3 h-3 text-gray-500 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-gray-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Maximum price movement before transaction fails
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-gray-400">{slippage}%</span>
              {slippage > 5 && (
                <AlertTriangle className="w-3 h-3 text-yellow-400" />
              )}
            </div>
          </div>

          {/* Slippage Presets */}
          <div className="flex items-center space-x-2">
            {SLIPPAGE_PRESETS.map((preset) => (
              <Button
                key={preset}
                type="button"
                size="sm"
                variant={slippage === preset && !customSlippage ? 'default' : 'outline'}
                onClick={() => handleSlippagePreset(preset)}
                className="text-xs px-3 py-1"
              >
                {preset}%
              </Button>
            ))}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Custom"
                value={customSlippage}
                onChange={(e) => handleCustomSlippage(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {customSlippage && (
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  %
                </span>
              )}
            </div>
          </div>

          {/* Slippage Warning */}
          {!slippageValidation.isValid && (
            <div className="flex items-center space-x-2 text-xs text-red-400">
              <AlertTriangle className="w-3 h-3" />
              <span>{slippageValidation.error}</span>
            </div>
          )}
          {slippage > 5 && slippageValidation.isValid && (
            <div className="flex items-center space-x-2 text-xs text-yellow-400">
              <AlertTriangle className="w-3 h-3" />
              <span>High slippage tolerance may result in unfavorable trades</span>
            </div>
          )}
        </div>

        {/* Transaction Deadline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-200">Transaction Deadline</span>
              <div className="group relative">
                <Info className="w-3 h-3 text-gray-500 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-gray-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Time limit for transaction execution
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400">{deadline}m</span>
            </div>
          </div>

          {/* Deadline Presets */}
          <div className="flex items-center space-x-2">
            {DEADLINE_PRESETS.map((preset) => (
              <Button
                key={preset}
                type="button"
                size="sm"
                variant={deadline === preset && !customDeadline ? 'default' : 'outline'}
                onClick={() => handleDeadlinePreset(preset)}
                className="text-xs px-3 py-1"
              >
                {preset}m
              </Button>
            ))}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Custom"
                value={customDeadline}
                onChange={(e) => handleCustomDeadline(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {customDeadline && (
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  m
                </span>
              )}
            </div>
          </div>

          {/* Deadline Warning */}
          {!deadlineValidation.isValid && (
            <div className="flex items-center space-x-2 text-xs text-red-400">
              <AlertTriangle className="w-3 h-3" />
              <span>{deadlineValidation.error}</span>
            </div>
          )}
        </div>

        {/* Advanced Options */}
        <div className="pt-3 border-t border-gray-600">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">MEV Protection</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="text-xs px-3 py-1"
              >
                Enabled
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Gas Priority</span>
              <select className="px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="standard">Standard</option>
                <option value="fast">Fast</option>
                <option value="instant">Instant</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
