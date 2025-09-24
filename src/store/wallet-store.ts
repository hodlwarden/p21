/**
 * Wallet Store
 * State management for wallet connections and operations
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Wallet, WalletConnection, TokenBalance, AppError } from '../types';

export interface WalletState {
  // Connection state
  connection: WalletConnection | null;
  isConnecting: boolean;
  connectionError: AppError | null;
  
  // Available wallets
  availableWallets: Wallet[];
  installedWallets: Wallet[];
  
  // Balances
  balances: TokenBalance[];
  isLoadingBalances: boolean;
  balancesError: AppError | null;
  
  // Transaction state
  pendingTransactions: string[];
  
  // Settings
  autoConnect: boolean;
  lastConnectedWallet: string | null;
}

export interface WalletActions {
  // Connection actions
  connectWallet: (walletId: string) => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  
  // Wallet management
  setAvailableWallets: (wallets: Wallet[]) => void;
  updateWalletInstallStatus: () => void;
  
  // Balance actions
  loadBalances: () => Promise<void>;
  updateBalance: (tokenAddress: string, balance: string) => void;
  
  // Transaction actions
  addPendingTransaction: (hash: string) => void;
  removePendingTransaction: (hash: string) => void;
  clearPendingTransactions: () => void;
  
  // Settings
  setAutoConnect: (autoConnect: boolean) => void;
  
  // Error handling
  setConnectionError: (error: AppError | null) => void;
  clearConnectionError: () => void;
}

export type WalletStore = WalletState & WalletActions;

// Available wallets configuration
const baseWallets: Omit<Wallet, 'isInstalled'>[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'Connect using browser extension',
    downloadUrl: 'https://metamask.io/download/',
    supportsChains: [1, 137, 42161, 8453, 10],
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🔵',
    description: 'Connect using Coinbase Wallet',
    downloadUrl: 'https://www.coinbase.com/wallet',
    supportsChains: [1, 137, 42161, 8453, 10],
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    description: 'Connect using WalletConnect protocol',
    downloadUrl: 'https://walletconnect.network/',
    supportsChains: [1, 137, 42161, 8453, 10],
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '🛡️',
    description: 'Connect using Trust Wallet',
    downloadUrl: 'https://trustwallet.com/',
    supportsChains: [1, 137, 42161, 8453, 10],
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: '🌈',
    description: 'Connect using Rainbow Wallet',
    downloadUrl: 'https://rainbow.me/',
    supportsChains: [1, 137, 42161, 8453, 10],
  },
];

// Wallet detection functions
const detectWalletInstallation = (): Record<string, boolean> => {
  if (typeof window === 'undefined') return {};

  const ethereum = window.ethereum as any;
  
  return {
    metamask: !!(ethereum?.isMetaMask),
    coinbase: !!(ethereum?.isCoinbaseWallet),
    trust: !!(ethereum?.isTrust),
    rainbow: !!(ethereum?.isRainbow),
    phantom: !!((window as any).phantom?.ethereum),
    // Add more wallet detections as needed
  };
};

// Create the store
export const useWalletStore = create<WalletStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        connection: null,
        isConnecting: false,
        connectionError: null,
        availableWallets: baseWallets.map(wallet => ({ ...wallet, isInstalled: false })),
        installedWallets: [],
        balances: [],
        isLoadingBalances: false,
        balancesError: null,
        pendingTransactions: [],
        autoConnect: true,
        lastConnectedWallet: null,

        // Connection actions
        connectWallet: async (walletId: string) => {
          set((state) => {
            state.isConnecting = true;
            state.connectionError = null;
          });

          try {
            // Find the wallet
            const wallet = get().availableWallets.find(w => w.id === walletId);
            if (!wallet) {
              throw new Error(`Wallet ${walletId} not found`);
            }

            if (!wallet.isInstalled) {
              throw new Error(`${wallet.name} is not installed`);
            }

            // Connect logic here (would interface with actual wallet)
            // This is a placeholder implementation
            
            const mockConnection: WalletConnection = {
              wallet,
              account: '0x742d35Cc6634C0532925a3b8D82ac62d7C0a123', // Mock address
              chainId: 1,
              isConnected: true,
              balance: '1.5',
            };

            set((state) => {
              state.connection = mockConnection;
              state.isConnecting = false;
              state.lastConnectedWallet = walletId;
            });

            // Load balances after connecting
            get().loadBalances();

          } catch (error: any) {
            set((state) => {
              state.connectionError = {
                code: 'WALLET_CONNECTION_ERROR',
                message: error.message || 'Failed to connect wallet',
                details: error,
                timestamp: new Date(),
              };
              state.isConnecting = false;
            });
            throw error;
          }
        },

        disconnectWallet: () => {
          set((state) => {
            state.connection = null;
            state.balances = [];
            state.pendingTransactions = [];
            state.lastConnectedWallet = null;
          });
        },

        switchNetwork: async (chainId: number) => {
          const connection = get().connection;
          if (!connection) {
            throw new Error('No wallet connected');
          }

          try {
            // Network switching logic here
            set((state) => {
              if (state.connection) {
                state.connection.chainId = chainId;
                // Clear balances when switching networks
                state.balances = [];
              }
            });

            // Reload balances for new network
            get().loadBalances();

          } catch (error: any) {
            set((state) => {
              state.connectionError = {
                code: 'NETWORK_SWITCH_ERROR',
                message: error.message || 'Failed to switch network',
                details: error,
                timestamp: new Date(),
              };
            });
            throw error;
          }
        },

        // Wallet management
        setAvailableWallets: (wallets) => {
          set((state) => {
            state.availableWallets = wallets;
          });
        },

        updateWalletInstallStatus: () => {
          const installStatus = detectWalletInstallation();
          
          set((state) => {
            state.availableWallets = state.availableWallets.map(wallet => ({
              ...wallet,
              isInstalled: installStatus[wallet.id] || false,
            }));
            
            state.installedWallets = state.availableWallets.filter(w => w.isInstalled);
          });
        },

        // Balance actions
        loadBalances: async () => {
          const connection = get().connection;
          if (!connection) return;

          set((state) => {
            state.isLoadingBalances = true;
            state.balancesError = null;
          });

          try {
            // Load balances logic here
            // This would fetch balances for all tokens
            
            const mockBalances: TokenBalance[] = [
              {
                token: {
                  address: '0x0000000000000000000000000000000000000000',
                  symbol: 'ETH',
                  name: 'Ethereum',
                  decimals: 18,
                  chainId: connection.chainId,
                },
                balance: '1.5',
                balanceFormatted: '1.5',
                value: 2400,
                valueChange24h: 5.2,
              },
              // Add more mock balances
            ];

            set((state) => {
              state.balances = mockBalances;
              state.isLoadingBalances = false;
            });

          } catch (error: any) {
            set((state) => {
              state.balancesError = {
                code: 'BALANCE_LOAD_ERROR',
                message: error.message || 'Failed to load balances',
                details: error,
                timestamp: new Date(),
              };
              state.isLoadingBalances = false;
            });
          }
        },

        updateBalance: (tokenAddress, balance) => {
          set((state) => {
            const balanceIndex = state.balances.findIndex(b => 
              b.token.address.toLowerCase() === tokenAddress.toLowerCase()
            );
            
            if (balanceIndex !== -1) {
              state.balances[balanceIndex].balance = balance;
              state.balances[balanceIndex].balanceFormatted = balance; // Should format properly
            }
          });
        },

        // Transaction actions
        addPendingTransaction: (hash) => {
          set((state) => {
            if (!state.pendingTransactions.includes(hash)) {
              state.pendingTransactions.push(hash);
            }
          });
        },

        removePendingTransaction: (hash) => {
          set((state) => {
            state.pendingTransactions = state.pendingTransactions.filter(h => h !== hash);
          });
        },

        clearPendingTransactions: () => {
          set((state) => {
            state.pendingTransactions = [];
          });
        },

        // Settings
        setAutoConnect: (autoConnect) => {
          set((state) => {
            state.autoConnect = autoConnect;
          });
        },

        // Error handling
        setConnectionError: (error) => {
          set((state) => {
            state.connectionError = error;
          });
        },

        clearConnectionError: () => {
          set((state) => {
            state.connectionError = null;
          });
        },
      })),
      {
        name: 'fibrous-wallet-store',
        partialize: (state) => ({
          autoConnect: state.autoConnect,
          lastConnectedWallet: state.lastConnectedWallet,
        }),
      }
    ),
    {
      name: 'wallet-store',
    }
  )
);

// Selectors
export const useWalletConnection = () => useWalletStore((state) => state.connection);
export const useWalletBalances = () => useWalletStore((state) => state.balances);
export const useAvailableWallets = () => useWalletStore((state) => state.availableWallets);
export const useInstalledWallets = () => useWalletStore((state) => state.installedWallets);
export const useWalletError = () => useWalletStore((state) => state.connectionError);
export const useIsConnecting = () => useWalletStore((state) => state.isConnecting);
export const usePendingTransactions = () => useWalletStore((state) => state.pendingTransactions);
