/**
 * Main Application Store
 * Central state management for global app state
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Network, AppError, Token } from '../types';
import { config } from '../config';

export interface AppState {
  // Global state
  isInitialized: boolean;
  isLoading: boolean;
  error: AppError | null;
  
  // Network state
  currentNetwork: Network;
  supportedNetworks: Network[];
  
  // Token state
  tokens: Token[];
  popularTokens: Token[];
  recentTokens: Token[];
  
  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'auto';
  notifications: AppNotification[];
}

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  autoClose?: boolean;
  duration?: number;
}

export interface AppActions {
  // Global actions
  initialize: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: AppError | null) => void;
  clearError: () => void;
  
  // Network actions
  setCurrentNetwork: (network: Network) => void;
  addSupportedNetwork: (network: Network) => void;
  
  // Token actions
  setTokens: (tokens: Token[]) => void;
  addToken: (token: Token) => void;
  updateToken: (address: string, updates: Partial<Token>) => void;
  addRecentToken: (token: Token) => void;
  clearRecentTokens: () => void;
  
  // UI actions
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  
  // Notification actions
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export type AppStore = AppState & AppActions;

// Default network (Ethereum)
const defaultNetwork: Network = {
  chainId: 1,
  name: 'Ethereum Mainnet',
  shortName: 'ethereum',
  rpcUrl: config.networks.ethereum.rpcUrl,
  blockExplorer: config.networks.ethereum.blockExplorer,
  nativeCurrency: config.networks.ethereum.nativeCurrency,
  logo: '/networks/ethereum.svg',
  isTestnet: false,
};

// Supported networks
const supportedNetworks: Network[] = [
  defaultNetwork,
  {
    chainId: 137,
    name: 'Polygon',
    shortName: 'polygon',
    rpcUrl: config.networks.polygon.rpcUrl,
    blockExplorer: config.networks.polygon.blockExplorer,
    nativeCurrency: config.networks.polygon.nativeCurrency,
    logo: '/networks/polygon.svg',
    isTestnet: false,
  },
  {
    chainId: 42161,
    name: 'Arbitrum One',
    shortName: 'arbitrum',
    rpcUrl: config.networks.arbitrum.rpcUrl,
    blockExplorer: config.networks.arbitrum.blockExplorer,
    nativeCurrency: config.networks.arbitrum.nativeCurrency,
    logo: '/networks/arbitrum.svg',
    isTestnet: false,
  },
  {
    chainId: 8453,
    name: 'Base',
    shortName: 'base',
    rpcUrl: config.networks.base.rpcUrl,
    blockExplorer: config.networks.base.blockExplorer,
    nativeCurrency: config.networks.base.nativeCurrency,
    logo: '/networks/base.svg',
    isTestnet: false,
  },
];

// Create the store
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        isInitialized: false,
        isLoading: false,
        error: null,
        currentNetwork: defaultNetwork,
        supportedNetworks,
        tokens: [],
        popularTokens: [],
        recentTokens: [],
        sidebarOpen: false,
        theme: 'dark',
        notifications: [],

        // Global actions
        initialize: async () => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            // Initialize the app
            // Load popular tokens, network data, etc.
            
            set((state) => {
              state.isInitialized = true;
              state.isLoading = false;
            });
          } catch (error) {
            set((state) => {
              state.error = {
                code: 'INITIALIZATION_ERROR',
                message: 'Failed to initialize application',
                details: error,
                timestamp: new Date(),
              };
              state.isLoading = false;
            });
          }
        },

        setLoading: (loading) => {
          set((state) => {
            state.isLoading = loading;
          });
        },

        setError: (error) => {
          set((state) => {
            state.error = error;
          });
        },

        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },

        // Network actions
        setCurrentNetwork: (network) => {
          set((state) => {
            state.currentNetwork = network;
            // Clear tokens when switching networks
            state.tokens = [];
            state.recentTokens = [];
          });
        },

        addSupportedNetwork: (network) => {
          set((state) => {
            const exists = state.supportedNetworks.find(n => n.chainId === network.chainId);
            if (!exists) {
              state.supportedNetworks.push(network);
            }
          });
        },

        // Token actions
        setTokens: (tokens) => {
          set((state) => {
            state.tokens = tokens;
          });
        },

        addToken: (token) => {
          set((state) => {
            const exists = state.tokens.find(t => 
              t.address.toLowerCase() === token.address.toLowerCase() && 
              t.chainId === token.chainId
            );
            if (!exists) {
              state.tokens.push(token);
            }
          });
        },

        updateToken: (address, updates) => {
          set((state) => {
            const tokenIndex = state.tokens.findIndex(t => 
              t.address.toLowerCase() === address.toLowerCase() && 
              t.chainId === state.currentNetwork.chainId
            );
            if (tokenIndex !== -1) {
              Object.assign(state.tokens[tokenIndex], updates);
            }
          });
        },

        addRecentToken: (token) => {
          set((state) => {
            // Remove if already exists
            state.recentTokens = state.recentTokens.filter(t => 
              !(t.address.toLowerCase() === token.address.toLowerCase() && 
                t.chainId === token.chainId)
            );
            // Add to beginning
            state.recentTokens.unshift(token);
            // Keep only last 10
            if (state.recentTokens.length > 10) {
              state.recentTokens = state.recentTokens.slice(0, 10);
            }
          });
        },

        clearRecentTokens: () => {
          set((state) => {
            state.recentTokens = [];
          });
        },

        // UI actions
        setSidebarOpen: (open) => {
          set((state) => {
            state.sidebarOpen = open;
          });
        },

        setTheme: (theme) => {
          set((state) => {
            state.theme = theme;
          });
        },

        // Notification actions
        addNotification: (notification) => {
          const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const timestamp = Date.now();
          
          set((state) => {
            state.notifications.push({
              ...notification,
              id,
              timestamp,
            });
          });

          // Auto-remove after duration
          if (notification.autoClose !== false) {
            const duration = notification.duration || 5000;
            setTimeout(() => {
              get().removeNotification(id);
            }, duration);
          }
        },

        removeNotification: (id) => {
          set((state) => {
            state.notifications = state.notifications.filter(n => n.id !== id);
          });
        },

        clearNotifications: () => {
          set((state) => {
            state.notifications = [];
          });
        },
      })),
      {
        name: 'fibrous-app-store',
        partialize: (state) => ({
          currentNetwork: state.currentNetwork,
          recentTokens: state.recentTokens,
          sidebarOpen: state.sidebarOpen,
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
);

// Selectors for optimized re-renders
export const useCurrentNetwork = () => useAppStore((state) => state.currentNetwork);
export const useTokens = () => useAppStore((state) => state.tokens);
export const useRecentTokens = () => useAppStore((state) => state.recentTokens);
export const useTheme = () => useAppStore((state) => state.theme);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useAppError = () => useAppStore((state) => state.error);
export const useAppLoading = () => useAppStore((state) => state.isLoading);
