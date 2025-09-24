'use client';

import { useWeb3 } from '../lib/web3-provider';
import { Wallet, LogOut, Copy, ExternalLink, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Dynamically import WalletSelector to avoid hydration issues
const WalletSelector = dynamic(() => import('./WalletSelector').then(mod => ({ default: mod.WalletSelector })), {
  ssr: false,
  loading: () => null // Don't show loading component unless explicitly requested
});

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  downloadUrl: string;
  isInstalled?: boolean;
}

export function WalletConnect() {
  const { account, isConnected, connectWallet, disconnectWallet, isLoading, connectedWallet } = useWeb3();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Set client-side flag to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Force close dialog when connecting
  useEffect(() => {
    if (isConnecting || isLoading) {
      setShowWalletSelector(false);
    }
  }, [isConnecting, isLoading]);

  const handleConnect = async (walletId?: string) => {
    try {
      await connectWallet(walletId);
      toast.success('Wallet connected successfully!');
      setShowWalletSelector(false);
    } catch (error) {
      toast.error('Failed to connect wallet');
      setShowWalletSelector(false);
    }
  };

  const connectWalletDirectly = async (walletId: string) => {
    // Use the enhanced connectWallet function with wallet ID
    await connectWallet(walletId);
  };

  const handleWalletSelect = async (wallet: WalletOption) => {
    if (wallet.isInstalled) {
      // Immediately close the selector and start connecting
      setShowWalletSelector(false);
      setIsConnecting(true);
      
      // Add timeout to prevent hanging connections
      const connectionTimeout = setTimeout(() => {
        setIsConnecting(false);
        toast.error('Connection timeout. Please try again.');
      }, 30000); // 30 second timeout
      
      try {
        // For MetaMask, Phantom, and other Ethereum wallets, use the standard connection
        if (wallet.id === 'metamask' || wallet.id === 'coinbase' || wallet.id === 'trust' || wallet.id === 'rainbow' || wallet.id === 'okx' || wallet.id === 'bitget' || wallet.id === 'rabby' || wallet.id === 'phantom') {
          await connectWalletDirectly(wallet.id);
        } else {
          // For other wallets, use standard connection
          await connectWalletDirectly(wallet.id);
        }
        toast.success(`${wallet.name} connected successfully!`);
      } catch (error: any) {
        // Check if this is a user rejection error - comprehensive detection
        const isUserRejection = 
          error.message?.includes('User rejected') || 
          error.message?.includes('rejected') ||
          error.message?.includes('denied') ||
          error.code === 4001 ||
          error.code === 'ACTION_REJECTED' ||
          (error.data && error.data.code === 4001) ||
          (typeof error === 'object' && error.code === 4001) ||
          // Additional checks for different error structures
          (error.error && error.error.code === 4001) ||
          (error.error && error.error.message?.includes('rejected')) ||
          // Check for string codes
          error.code === '4001' ||
          // Check for nested rejection messages
          (error.data && error.data.message?.includes('rejected')) ||
          (error.error && error.error.message?.includes('User rejected'));
        
        // Don't log user rejection errors to console
        if (!isUserRejection) {
          console.error('Wallet connection error:', error);
        }
        
        // Handle different types of errors
        if (isUserRejection) {
          // User cancelled the connection - don't show error, just close dialog
          // No toast message needed for user cancellation
          return; // Exit early, no error handling needed
        } else if (error.message?.includes('Already processing')) {
          toast.error('Please wait for the current connection to complete');
        } else if (error.message?.includes('No provider') ||
                   error.message?.includes('not found')) {
          toast.error(`${wallet.name} not detected. Please install the wallet extension.`);
        } else {
          const errorMessage = error.message || 'Unknown error occurred';
          toast.error(`Failed to connect ${wallet.name}: ${errorMessage}`);
        }
        
        // Don't reopen selector for user rejection or provider issues
        if (!isUserRejection && 
            !error.message?.includes('not found') &&
            !error.message?.includes('processing')) {
          // Only reopen for unexpected errors
          setTimeout(() => {
            setShowWalletSelector(true);
          }, 1000);
        }
      } finally {
        clearTimeout(connectionTimeout);
        setIsConnecting(false);
      }
    } else {
      window.open(wallet.downloadUrl, '_blank');
      toast.success(`Please install ${wallet.name} and try again`);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast.success('Wallet disconnected');
    setShowDropdown(false);
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast.success('Address copied to clipboard');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openEtherscan = () => {
    if (account) {
      window.open(`https://etherscan.io/address/${account}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => {
            if (!isLoading && !isConnecting && isClient) {
              setShowWalletSelector(!showWalletSelector);
            }
          }}
          disabled={isLoading || isConnecting}
          className="btn btn-primary btn-md relative overflow-hidden"
        >
          {(isLoading || isConnecting) ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              <span className="relative z-10">Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              <span className="relative z-10">Connect Wallet</span>
              <ChevronDown className="w-4 h-4 ml-2 relative z-10" />
            </>
          )}
          {(isLoading || isConnecting) && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-75 animate-pulse" />
          )}
        </button>

        {showWalletSelector && !isConnecting && !isLoading && isClient && (
          <WalletSelector
            onWalletSelect={handleWalletSelect}
            onClose={() => setShowWalletSelector(false)}
          />
        )}

        {/* Overlay to close dropdown */}
        {showWalletSelector && !isConnecting && !isLoading && isClient && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowWalletSelector(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="btn btn-outline btn-md hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <Wallet className="w-4 h-4" />
          <span className="font-medium">{formatAddress(account!)}</span>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-gray-900">Connected</span>
                </div>
                {connectedWallet && (
                  <div className="text-xs text-blue-600 font-medium">{connectedWallet}</div>
                )}
              </div>
              <button
                onClick={() => setShowDropdown(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Wallet Address</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                    {formatAddress(account!)}
                  </span>
                  <button
                    onClick={copyAddress}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy address"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={openEtherscan}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Explorer</span>
                </button>
                <button
                  onClick={copyAddress}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Address</span>
                </button>
              </div>

              <button
                onClick={handleDisconnect}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Wallet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
