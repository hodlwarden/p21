'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  downloadUrl: string;
  isInstalled?: boolean;
}

interface WalletSelectorProps {
  onWalletSelect: (wallet: WalletOption) => void;
  onClose: () => void;
}

// Base wallet options without installation status (to avoid hydration issues)
const baseWalletOptions: Omit<WalletOption, 'isInstalled'>[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'Connect using browser extension',
    downloadUrl: 'https://metamask.io/download/'
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '👻',
    description: 'Multi-chain wallet for SOL, ETH, Bitcoin and more',
    downloadUrl: 'https://phantom.app/'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🔵',
    description: 'Connect using Coinbase Wallet',
    downloadUrl: 'https://www.coinbase.com/wallet'
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '🛡️',
    description: 'Connect using Trust Wallet',
    downloadUrl: 'https://trustwallet.com/'
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: '🌈',
    description: 'Connect using Rainbow Wallet',
    downloadUrl: 'https://rainbow.me/'
  },
  {
    id: 'argent',
    name: 'Argent',
    icon: '🛡️',
    description: 'Connect using Argent Wallet',
    downloadUrl: 'https://www.argent.xyz/'
  },
  {
    id: 'braavos',
    name: 'Braavos',
    icon: '⚔️',
    description: 'Connect using Braavos Wallet',
    downloadUrl: 'https://braavos.app/'
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    icon: '⭕',
    description: 'Connect using OKX Wallet',
    downloadUrl: 'https://www.okx.com/web3'
  },
  {
    id: 'bitget',
    name: 'Bitget Wallet',
    icon: '🟡',
    description: 'Connect using Bitget Wallet',
    downloadUrl: 'https://web3.bitget.com/'
  },
  {
    id: 'rabby',
    name: 'Rabby Wallet',
    icon: '🐰',
    description: 'Connect using Rabby Wallet',
    downloadUrl: 'https://rabby.io/'
  }
];

// Enhanced function to check if wallet is installed (client-side only)
const checkWalletInstallation = () => {
  if (typeof window === 'undefined') return {};
  
  const detection = {
    metamask: false,
    phantom: false,
    coinbase: false,
    trust: false,
    rainbow: false,
    okx: false,
    bitget: false,
    rabby: false,
    argent: false,
    braavos: false,
  };

  // Check for Ethereum wallets
  if (window.ethereum) {
    const ethereum = window.ethereum as any;
    detection.metamask = !!ethereum.isMetaMask;
    detection.coinbase = !!ethereum.isCoinbaseWallet;
    detection.trust = !!ethereum.isTrust;
    detection.rainbow = !!ethereum.isRainbow;
    detection.okx = !!ethereum.isOkxWallet;
    detection.bitget = !!ethereum.isBitKeep;
    detection.rabby = !!ethereum.isRabby;
    
    // Check for additional wallet identifiers
    if (ethereum.providers) {
      // Handle multiple wallet extensions
      ethereum.providers.forEach((provider: any) => {
        if (provider.isMetaMask) detection.metamask = true;
        if (provider.isCoinbaseWallet) detection.coinbase = true;
        if (provider.isTrust) detection.trust = true;
        if (provider.isRainbow) detection.rainbow = true;
        if (provider.isOkxWallet) detection.okx = true;
        if (provider.isBitKeep) detection.bitget = true;
        if (provider.isRabby) detection.rabby = true;
      });
    }
  }

  // Check for Phantom wallet (multi-chain support)
  if ((window as any).phantom?.solana || (window as any).phantom?.ethereum) {
    detection.phantom = true;
  }

  // Check for Argent wallet (Starknet)
  if ((window as any).starknet_argent) {
    detection.argent = true;
  }

  // Check for Braavos wallet (Starknet)
  if ((window as any).starknet_braavos) {
    detection.braavos = true;
  }


  return detection;
};

export function WalletSelector({ onWalletSelect, onClose }: WalletSelectorProps) {
  const [allWallets, setAllWallets] = useState<WalletOption[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleWalletSelect = (wallet: WalletOption) => {
    // Call the parent's wallet select handler
    onWalletSelect(wallet);
  };

  useEffect(() => {
    // Add a delay to ensure hydration is complete
    const timer = setTimeout(() => {
      const installationStatus = checkWalletInstallation();
      
      // Create wallet options with installation status
      const walletsWithStatus: WalletOption[] = baseWalletOptions.map(wallet => ({
        ...wallet,
        isInstalled: installationStatus[wallet.id as keyof typeof installationStatus] || false
      }));
      
      setAllWallets(walletsWithStatus);
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-blue-500 rounded-xl shadow-xl z-50 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">Connect Wallet</h3>
            <p className="text-sm text-gray-400 mt-1">Choose your preferred wallet to connect</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          {!isLoaded ? (
            // Show loading state during hydration
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-500">Loading wallets...</span>
            </div>
          ) : (
            <>
              {/* Show all wallets */}
              <div className="text-sm font-medium text-gray-300 mb-2">Available Wallets</div>
              {allWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet)}
                  className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 border border-transparent group ${
                    wallet.isInstalled 
                      ? 'hover:bg-blue-900/20 hover:border-blue-600 hover:shadow-sm' 
                      : 'hover:bg-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <span className={`text-3xl transition-transform duration-200 ${
                      wallet.isInstalled ? 'group-hover:scale-110' : ''
                    }`}>{wallet.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`font-semibold transition-colors ${
                            wallet.isInstalled 
                              ? 'text-gray-100 group-hover:text-blue-300' 
                              : 'text-gray-300 group-hover:text-gray-100'
                          }`}>{wallet.name}</span>
                      {wallet.isInstalled && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          ✓ Installed
                        </span>
                      )}
                    </div>
                        <p className={`text-sm transition-colors ${
                          wallet.isInstalled 
                            ? 'text-gray-400 group-hover:text-gray-300' 
                            : 'text-gray-500 group-hover:text-gray-400'
                        }`}>{wallet.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {wallet.isInstalled ? (
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    ) : (
                      <Download className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    )}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-600">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              New to Web3? Learn more about wallets
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://ethereum.org/en/wallets/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                Wallet Guide
              </a>
              <span className="text-gray-600">•</span>
              <a 
                href="https://ethereum.org/en/security/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                Security Tips
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
