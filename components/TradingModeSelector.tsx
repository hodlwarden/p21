'use client';

import { useState } from 'react';
import { ArrowLeftRight, Layers, Target, Zap } from 'lucide-react';

export type TradingMode = 'swap' | 'batch' | 'limit';

interface TradingModeSelectorProps {
  selectedMode: TradingMode;
  onModeChange: (mode: TradingMode) => void;
}

export function TradingModeSelector({ selectedMode, onModeChange }: TradingModeSelectorProps) {
  const modes = [
    {
      id: 'swap' as TradingMode,
      name: 'Swap',
      description: 'Single token swap',
      icon: ArrowLeftRight,
      color: 'blue'
    },
    {
      id: 'batch' as TradingMode,
      name: 'Batch Swap',
      description: 'Multiple tokens to one',
      icon: Layers,
      color: 'green'
    },
    {
      id: 'limit' as TradingMode,
      name: 'Limit Order',
      description: 'Set price targets',
      icon: Target,
      color: 'purple'
    }
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;
        
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex-1 flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
              isSelected
                ? `bg-white text-${mode.color}-600 shadow-sm`
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <div className="text-left">
              <div className="font-medium text-sm">{mode.name}</div>
              <div className="text-xs opacity-75">{mode.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
