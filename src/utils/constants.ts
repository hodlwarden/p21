/**
 * Application Constants
 * Centralized constants for the DEX aggregator
 */

// Common token addresses
export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// Common token symbols
export const NATIVE_TOKEN_SYMBOLS = {
  1: 'ETH',      // Ethereum
  137: 'MATIC',  // Polygon
  56: 'BNB',     // BSC
  43114: 'AVAX', // Avalanche
  250: 'FTM',    // Fantom
  42161: 'ETH',  // Arbitrum
  10: 'ETH',     // Optimism
  8453: 'ETH',   // Base
} as const;

// Well-known tokens
export const WELL_KNOWN_TOKENS = {
  // Ethereum Mainnet
  1: {
    USDC: '0xA0b86a33E6441a8C3c863C2b1e31D39B6E7Ca8e9',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  },
  // Polygon
  137: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  },
  // Base
  8453: {
    USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    WETH: '0x4200000000000000000000000000000000000006',
    DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  },
} as const;

// Gas limits
export const GAS_LIMITS = {
  ERC20_APPROVAL: 60000,
  SIMPLE_SWAP: 200000,
  COMPLEX_SWAP: 400000,
  MULTI_HOP_SWAP: 600000,
  BATCH_SWAP: 800000,
  LIMIT_ORDER: 300000,
} as const;

// Slippage presets (in percentage)
export const SLIPPAGE_PRESETS = [0.1, 0.5, 1.0, 3.0, 5.0] as const;

// Deadline presets (in minutes)
export const DEADLINE_PRESETS = [10, 20, 30, 60] as const;

// Price impact thresholds (in percentage)
export const PRICE_IMPACT_THRESHOLDS = {
  LOW: 1,      // < 1% - green
  MEDIUM: 3,   // 1-3% - yellow
  HIGH: 5,     // 3-5% - orange
  CRITICAL: 5, // > 5% - red
} as const;

// Transaction status colors
export const STATUS_COLORS = {
  PENDING: '#f59e0b',    // amber-500
  CONFIRMED: '#10b981',  // emerald-500
  FAILED: '#ef4444',     // red-500
  CANCELLED: '#6b7280',  // gray-500
} as const;

// API endpoints
export const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3',
  DEFIPULSE: 'https://data-api.defipulse.com/api/v1',
  ETHERSCAN: 'https://api.etherscan.io/api',
  POLYGONSCAN: 'https://api.polygonscan.com/api',
  ARBITRUM_SCAN: 'https://api.arbiscan.io/api',
  OPTIMISM_SCAN: 'https://api-optimistic.etherscan.io/api',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'fibrous_user_preferences',
  WALLET_CONNECTION: 'fibrous_wallet_connection',
  RECENT_TOKENS: 'fibrous_recent_tokens',
  TRANSACTION_HISTORY: 'fibrous_transaction_history',
  SLIPPAGE_SETTING: 'fibrous_slippage_setting',
  DEADLINE_SETTING: 'fibrous_deadline_setting',
  THEME_PREFERENCE: 'fibrous_theme_preference',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  NETWORK_NOT_SUPPORTED: 'This network is not supported',
  TOKEN_NOT_FOUND: 'Token not found',
  INVALID_AMOUNT: 'Please enter a valid amount',
  SLIPPAGE_TOO_HIGH: 'Slippage tolerance is too high',
  PRICE_IMPACT_TOO_HIGH: 'Price impact is too high for this swap',
  TRANSACTION_FAILED: 'Transaction failed. Please try again',
  USER_REJECTED: 'Transaction was rejected by user',
  NETWORK_ERROR: 'Network error. Please check your connection',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  TRANSACTION_SUBMITTED: 'Transaction submitted successfully',
  TRANSACTION_CONFIRMED: 'Transaction confirmed',
  SETTINGS_SAVED: 'Settings saved successfully',
  TOKEN_APPROVED: 'Token approval successful',
} as const;

// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// Regex patterns
export const REGEX_PATTERNS = {
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  TRANSACTION_HASH: /^0x[a-fA-F0-9]{64}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  NUMERIC: /^\d*\.?\d*$/,
  POSITIVE_NUMBER: /^(?:[1-9]\d*|0)?(?:\.\d+)?$/,
} as const;

// Time constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

// Chart colors
export const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#f97316', // orange-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#ec4899', // pink-500
  '#6b7280', // gray-500
] as const;

// Feature flags (for development)
export const FEATURE_FLAGS = {
  ENABLE_DEBUGGING: process.env.NODE_ENV === 'development',
  ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
  ENABLE_ERROR_REPORTING: process.env.NODE_ENV === 'production',
  ENABLE_EXPERIMENTAL_FEATURES: false,
} as const;

// API rate limits
export const RATE_LIMITS = {
  QUOTES_PER_MINUTE: 60,
  TOKENS_PER_MINUTE: 100,
  TRANSACTIONS_PER_MINUTE: 30,
  PRICE_UPDATES_PER_MINUTE: 120,
} as const;

// Cache durations (in milliseconds)
export const CACHE_DURATIONS = {
  TOKEN_LIST: 5 * TIME.MINUTE,
  TOKEN_PRICES: 30 * TIME.SECOND,
  GAS_PRICES: 15 * TIME.SECOND,
  QUOTE: 10 * TIME.SECOND,
  TRANSACTION_STATUS: 5 * TIME.SECOND,
  USER_BALANCE: 30 * TIME.SECOND,
} as const;
