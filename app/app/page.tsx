'use client';

import { useState } from 'react';
import { ProfessionalSwapInterface } from '../../components/ProfessionalSwapInterface';
import { BatchSwapInterface } from '../../components/BatchSwapInterface';
import { LimitOrderInterface } from '../../components/LimitOrderInterface';
import { TradingModeSelector, TradingMode } from '../../components/TradingModeSelector';
import { NetworkSelector } from '../../components/NetworkSelector';
import { WalletConnect } from '../../components/WalletConnect';
import { ArrowLeft, Settings, History, Wallet } from 'lucide-react';
import { PriceChart } from '../../components/PriceChart';
import { Token } from '../../types';
import Link from 'next/link';

export default function TradingApp() {
  const [tradingMode, setTradingMode] = useState<TradingMode>('swap');
  const [selectedNetwork, setSelectedNetwork] = useState('base');
  
  // Mock tokens data for Base network
  const tokens: Token[] = [
    { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, chainId: 8453 },
    { symbol: 'USDC', name: 'USD Coin', address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', decimals: 6, chainId: 8453 },
    { symbol: 'USDT', name: 'Tether USD', address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 6, chainId: 8453 },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18, chainId: 8453 },
    { symbol: 'WETH', name: 'Wrapped Ethereum', address: '0x4200000000000000000000000000000000000006', decimals: 18, chainId: 8453 },
  ];

  const renderTradingInterface = () => {
    switch (tradingMode) {
      case 'batch':
        return <BatchSwapInterface tokens={tokens} />;
      case 'limit':
        return <LimitOrderInterface tokens={tokens} />;
      default:
        return <ProfessionalSwapInterface tokens={tokens} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/landing" className="flex items-center space-x-2 text-gray-400 hover:text-gray-100">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Home</span>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-bold text-gray-100">Fibrous</span>
              </div>
            </div>

            {/* Network Selector */}
            <NetworkSelector 
              selectedNetwork={selectedNetwork} 
              onNetworkChange={setSelectedNetwork} 
            />

            {/* Wallet Connect */}
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
                  {/* Trading Mode Selector */}
                  <div className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
                    <TradingModeSelector 
                      selectedMode={tradingMode} 
                      onModeChange={setTradingMode} 
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
                    <h3 className="text-sm font-medium text-gray-100 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:bg-gray-700 rounded-md transition-colors">
                        <History className="w-4 h-4" />
                        <span>Transaction History</span>
                      </button>
                      <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:bg-gray-700 rounded-md transition-colors">
                        <Wallet className="w-4 h-4" />
                        <span>Portfolio</span>
                      </button>
                      <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:bg-gray-700 rounded-md transition-colors">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                    </div>
              </div>
            </div>
          </div>

              {/* Main Trading Interface */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                  <div className="p-6">
                    {renderTradingInterface()}
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Price Chart */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
                  <PriceChart tokenPair="ETH/USDC" height={256} />
                </div>
              </div>
        </div>
      </main>
    </div>
  );
}
