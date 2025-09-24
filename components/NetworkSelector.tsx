'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Network {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const networks: Network[] = [
  { id: 'base', name: 'Base', icon: '🔵', color: 'bg-blue-500' },
  { id: 'starknet', name: 'Starknet', icon: '🔴', color: 'bg-red-500' },
  { id: 'scroll', name: 'Scroll', icon: '🟢', color: 'bg-green-500' },
  { id: 'hyperevm', name: 'HyperEVM', icon: '🟡', color: 'bg-yellow-500' },
];

interface NetworkSelectorProps {
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
}

export function NetworkSelector({ selectedNetwork, onNetworkChange }: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedNetworkData = networks.find(n => n.id === selectedNetwork) || networks[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <span className="text-lg">{selectedNetworkData.icon}</span>
        <span className="text-sm font-medium text-gray-700">{selectedNetworkData.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => {
                  onNetworkChange(network.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg">{network.icon}</span>
                <span className="flex-1 text-sm font-medium text-gray-700">{network.name}</span>
                {selectedNetwork === network.id && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
