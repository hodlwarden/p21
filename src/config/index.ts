/**
 * Application Configuration
 * Centralized configuration management for the DEX aggregator
 */

export const config = {
  // API Configuration
  api: {
    infuraKey: process.env.NEXT_PUBLIC_INFURA_KEY || '',
    alchemyKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY || '',
    moralisKey: process.env.NEXT_PUBLIC_MORALIS_KEY || '',
  },

  // Network Configuration
  networks: {
    ethereum: {
      chainId: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
      blockExplorer: 'https://etherscan.io',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
    },
    polygon: {
      chainId: 137,
      name: 'Polygon',
      rpcUrl: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
      blockExplorer: 'https://polygonscan.com',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
    },
    arbitrum: {
      chainId: 42161,
      name: 'Arbitrum One',
      rpcUrl: `https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
      blockExplorer: 'https://arbiscan.io',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
    },
    base: {
      chainId: 8453,
      name: 'Base',
      rpcUrl: 'https://mainnet.base.org',
      blockExplorer: 'https://basescan.org',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
    },
  },

  // DEX Configuration
  dexes: {
    uniswap: {
      name: 'Uniswap V3',
      router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      quoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    },
    sushiswap: {
      name: 'SushiSwap',
      router: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
      factory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
    },
    pancakeswap: {
      name: 'PancakeSwap',
      router: '0xEfF92A263d31888d860bD50809A8D171709b7b1c',
      factory: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
    },
  },

  // Application Settings
  app: {
    name: 'Fibrous Finance',
    description: 'Professional DEX Aggregator',
    version: '2.0.0',
    defaultSlippage: 0.5, // 0.5%
    maxSlippage: 50, // 50%
    refreshInterval: 30000, // 30 seconds
    maxRetries: 3,
    timeout: 10000, // 10 seconds
  },

  // UI Configuration
  ui: {
    theme: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      borderRadius: '0.75rem',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
    },
    animations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
  },

  // Feature Flags
  features: {
    enableBatchSwaps: true,
    enableLimitOrders: true,
    enablePriceAlerts: false,
    enablePortfolio: true,
    enableAnalytics: true,
  },
} as const;

// Type exports
export type NetworkConfig = typeof config.networks[keyof typeof config.networks];
export type DEXConfig = typeof config.dexes[keyof typeof config.dexes];
export type Config = typeof config;

// Validation
export const validateConfig = (): void => {
  if (!config.api.infuraKey && process.env.NODE_ENV === 'production') {
    console.warn('Warning: INFURA_KEY is not set for production');
  }
  
  if (!config.api.alchemyKey && process.env.NODE_ENV === 'production') {
    console.warn('Warning: ALCHEMY_KEY is not set for production');
  }
};

// Initialize configuration validation
if (typeof window === 'undefined') {
  validateConfig();
}
