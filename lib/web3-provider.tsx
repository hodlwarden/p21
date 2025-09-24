import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { FrontendDEXAggregator } from './dex-aggregator';

interface Web3ContextType {
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  dexAggregator: FrontendDEXAggregator | null;
  connectWallet: (walletId?: string) => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  isLoading: boolean;
  connectedWallet: string | null;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [dexAggregator, setDexAggregator] = useState<FrontendDEXAggregator | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with default provider (for read-only operations)
    const defaultProvider = new ethers.JsonRpcProvider(
      'https://mainnet.infura.io/v3/YOUR_INFURA_KEY' // Replace with your Infura key
    );
    setProvider(defaultProvider);
    setDexAggregator(new FrontendDEXAggregator(defaultProvider));

    // Set up wallet event listeners for passive connection detection
    if (typeof window !== 'undefined' && window.ethereum) {
      // Listen for wallet connection events
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // Wallet connected, set up the connection
          setAccount(accounts[0]);
          
          // Detect wallet type
          let walletType = 'Unknown';
          const ethereum = window.ethereum as any;
          if (ethereum.isMetaMask) walletType = 'MetaMask';
          else if (ethereum.isCoinbaseWallet) walletType = 'Coinbase Wallet';
          else if (ethereum.isTrust) walletType = 'Trust Wallet';
          else if (ethereum.isRainbow) walletType = 'Rainbow';
          else if (ethereum.isOkxWallet) walletType = 'OKX Wallet';
          else if (ethereum.isBitKeep) walletType = 'Bitget Wallet';
          else if (ethereum.isRabby) walletType = 'Rabby Wallet';
          
          setConnectedWallet(walletType);
          
          // Create provider and signer
          const web3Provider = new ethers.BrowserProvider(window.ethereum!);
          web3Provider.getSigner().then(async (web3Signer) => {
            const network = await web3Provider.getNetwork();
            setProvider(web3Provider);
            setSigner(web3Signer);
            setChainId(Number(network.chainId));
            setDexAggregator(new FrontendDEXAggregator(web3Provider));
          }).catch(() => {
            // Silently handle signer creation errors
          });
        } else {
          // Wallet disconnected
          setAccount(null);
          setConnectedWallet(null);
          setProvider(defaultProvider);
          setSigner(null);
          setChainId(null);
          setDexAggregator(new FrontendDEXAggregator(defaultProvider));
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(Number(chainId));
      };

      // Add event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Only attempt silent connection check if wallet is detected
      let walletType = 'Unknown';
      const ethereum = window.ethereum as any;
      if (ethereum.isMetaMask) walletType = 'MetaMask';
      else if (ethereum.isCoinbaseWallet) walletType = 'Coinbase Wallet';
      else if (ethereum.isTrust) walletType = 'Trust Wallet';
      else if (ethereum.isRainbow) walletType = 'Rainbow';
      else if (ethereum.isOkxWallet) walletType = 'OKX Wallet';
      else if (ethereum.isBitKeep) walletType = 'Bitget Wallet';
      else if (ethereum.isRabby) walletType = 'Rabby Wallet';
      
      if (walletType !== 'Unknown') {
        // Add a longer delay to ensure wallet extensions are fully loaded
        const timer = setTimeout(() => {
          checkWalletConnection();
        }, 3000);

        return () => {
          clearTimeout(timer);
          window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum?.removeListener('chainChanged', handleChainChanged);
        };
      }

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Check if the wallet extension is properly initialized
        if (!window.ethereum.request) {
          return; // Silently return if wallet not ready
        }

        // Try to get accounts without triggering user prompts
        // This should only work if the wallet is already connected
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        }).catch(() => []); // Return empty array if rejected
        
        if (accounts && accounts.length > 0) {
          // Wallet is already connected, set up the connection
          setAccount(accounts[0]);
          
          // Detect wallet type
          let walletType = 'Unknown';
          const ethereum = window.ethereum as any;
          if (ethereum.isMetaMask) walletType = 'MetaMask';
          else if (ethereum.isCoinbaseWallet) walletType = 'Coinbase Wallet';
          else if (ethereum.isTrust) walletType = 'Trust Wallet';
          else if (ethereum.isRainbow) walletType = 'Rainbow';
          else if (ethereum.isOkxWallet) walletType = 'OKX Wallet';
          else if (ethereum.isBitKeep) walletType = 'Bitget Wallet';
          else if (ethereum.isRabby) walletType = 'Rabby Wallet';
          
          setConnectedWallet(walletType);
          
          // Create provider and signer
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const web3Signer = await web3Provider.getSigner();
          const network = await web3Provider.getNetwork();
          
          setProvider(web3Provider);
          setSigner(web3Signer);
          setChainId(Number(network.chainId));
          setDexAggregator(new FrontendDEXAggregator(web3Provider));
        }
      } catch (error: any) {
        // Silently handle all wallet connection check errors
        // This includes user rejection, timeouts, and other expected errors
        // No logging to avoid console noise
        return;
      }
    }
  };

  const connectWallet = async (walletId?: string) => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Please install a Web3 wallet');
    }

    setIsLoading(true);
    try {
      let accounts: string[] = [];
      
      if (walletId) {
        // Try to connect to specific wallet extension using direct approach
        const ethereum = window.ethereum as any;
        
        // Special handling for MetaMask - completely bypass wallet selection dialog
        if (walletId === 'metamask') {
          // Store original ethereum object
          const originalEthereum = window.ethereum;
          
          try {
            if (ethereum.providers && Array.isArray(ethereum.providers)) {
              // Find MetaMask provider
              const metaMaskProvider = ethereum.providers.find((p: any) => p.isMetaMask);
              if (metaMaskProvider) {
                // Temporarily replace window.ethereum with MetaMask provider
                (window as any).ethereum = metaMaskProvider;
                
                // Now request accounts - this should bypass the selection dialog
                accounts = await metaMaskProvider.request({
                  method: 'eth_requestAccounts'
                });
              } else {
                // MetaMask not found, use original ethereum
                accounts = await originalEthereum.request({
                  method: 'eth_requestAccounts'
                });
              }
            } else if (ethereum.isMetaMask) {
              // MetaMask is already the primary provider
              accounts = await originalEthereum.request({
                method: 'eth_requestAccounts'
              });
            } else {
              // Fallback to original ethereum
              accounts = await originalEthereum.request({
                method: 'eth_requestAccounts'
              });
            }
          } finally {
            // Always restore original ethereum object
            (window as any).ethereum = originalEthereum;
          }
        } else if (walletId === 'phantom') {
          // Special handling for Phantom - completely bypass wallet selection dialog
          const originalEthereum = window.ethereum;
          
          try {
            if ((window as any).phantom?.ethereum) {
              // Temporarily replace window.ethereum with Phantom provider
              (window as any).ethereum = (window as any).phantom.ethereum;
              
              // Now request accounts - this should bypass the selection dialog
              accounts = await (window as any).phantom.ethereum.request({
                method: 'eth_requestAccounts'
              });
            } else {
              // Phantom Ethereum provider not available, use original ethereum
              accounts = await originalEthereum.request({
                method: 'eth_requestAccounts'
              });
            }
          } finally {
            // Always restore original ethereum object
            (window as any).ethereum = originalEthereum;
          }
        } else {
          // For other wallets, completely bypass wallet selection dialog
          const originalEthereum = window.ethereum;
          
          try {
            if (ethereum.providers && Array.isArray(ethereum.providers)) {
              let targetProvider = null;
              
              switch (walletId) {
                case 'coinbase':
                  targetProvider = ethereum.providers.find((p: any) => p.isCoinbaseWallet);
                  break;
                case 'trust':
                  targetProvider = ethereum.providers.find((p: any) => p.isTrust);
                  break;
                case 'rainbow':
                  targetProvider = ethereum.providers.find((p: any) => p.isRainbow);
                  break;
                case 'okx':
                  targetProvider = ethereum.providers.find((p: any) => p.isOkxWallet);
                  break;
                case 'bitget':
                  targetProvider = ethereum.providers.find((p: any) => p.isBitKeep);
                  break;
                case 'rabby':
                  targetProvider = ethereum.providers.find((p: any) => p.isRabby);
                  break;
              }
              
              if (targetProvider) {
                // Temporarily replace window.ethereum with target provider
                (window as any).ethereum = targetProvider;
                
                // Now request accounts - this should bypass the selection dialog
                accounts = await targetProvider.request({
                  method: 'eth_requestAccounts'
                });
              } else {
                // Target provider not found, use original ethereum
                accounts = await originalEthereum.request({
                  method: 'eth_requestAccounts'
                });
              }
            } else {
              // No providers array, use original ethereum
              accounts = await originalEthereum.request({
                method: 'eth_requestAccounts'
              });
            }
          } finally {
            // Always restore original ethereum object
            (window as any).ethereum = originalEthereum;
          }
        }
      } else {
        // No specific wallet requested, use default
        accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
      }

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Enhanced wallet type detection based on walletId or auto-detection
      let walletType = 'Unknown';
      const ethereum = window.ethereum as any;
      
      if (walletId) {
        // Use the provided wallet ID to determine wallet type
        switch (walletId) {
          case 'metamask':
            walletType = 'MetaMask';
            break;
          case 'coinbase':
            walletType = 'Coinbase Wallet';
            break;
          case 'trust':
            walletType = 'Trust Wallet';
            break;
          case 'rainbow':
            walletType = 'Rainbow';
            break;
          case 'okx':
            walletType = 'OKX Wallet';
            break;
          case 'bitget':
            walletType = 'Bitget Wallet';
            break;
          case 'rabby':
            walletType = 'Rabby Wallet';
            break;
          case 'phantom':
            walletType = 'Phantom';
            break;
          case 'argent':
            walletType = 'Argent';
            break;
          case 'braavos':
            walletType = 'Braavos';
            break;
          default:
            walletType = walletId.charAt(0).toUpperCase() + walletId.slice(1);
        }
      } else {
        // Auto-detect wallet type
        if (ethereum.isMetaMask) walletType = 'MetaMask';
        else if (ethereum.isCoinbaseWallet) walletType = 'Coinbase Wallet';
        else if (ethereum.isTrust) walletType = 'Trust Wallet';
        else if (ethereum.isRainbow) walletType = 'Rainbow';
        else if (ethereum.isOkxWallet) walletType = 'OKX Wallet';
        else if (ethereum.isBitKeep) walletType = 'Bitget Wallet';
        else if (ethereum.isRabby) walletType = 'Rabby Wallet';
        else if ((window as any).phantom?.solana || (window as any).phantom?.ethereum) walletType = 'Phantom';
        else if ((window as any).starknet_argent) walletType = 'Argent';
        else if ((window as any).starknet_braavos) walletType = 'Braavos';
      }
      
      setConnectedWallet(walletType);

      // Create provider and signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      
      // Get account and chain info
      const address = await web3Signer.getAddress();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(address);
      setChainId(Number(network.chainId));
      setDexAggregator(new FrontendDEXAggregator(web3Provider, web3Signer));

    } catch (error: any) {
      // Check if this is a user rejection error - comprehensive detection
      const isUserRejection = 
        error.code === 4001 || 
        error.code === 'ACTION_REJECTED' ||
        error.message?.includes('User rejected') ||
        error.message?.includes('rejected') ||
        error.message?.includes('denied') ||
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
      
      // Only log non-user-rejection errors
      if (!isUserRejection) {
        console.error('Failed to connect wallet:', error);
      }
      
      // Handle specific error types
      if (isUserRejection) {
        throw new Error('User rejected the request');
      } else if (error.message?.includes('Already processing')) {
        throw new Error('Another connection is in progress');
      } else if (error.message?.includes('No provider') ||
                 error.message?.includes('not found')) {
        throw new Error('Wallet not found');
      } else {
        throw new Error(error.message || 'Connection failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setDexAggregator(null);
    setConnectedWallet(null);
  };

  const value: Web3ContextType = {
    provider,
    signer,
    account,
    chainId,
    dexAggregator,
    connectWallet,
    disconnectWallet,
    isConnected: !!account,
    isLoading,
    connectedWallet,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
