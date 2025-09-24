/**
 * Core Type Definitions
 * Comprehensive TypeScript interfaces for the DEX aggregator
 */

// Base Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Token Types
export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  logoURI?: string;
  tags?: string[];
  balance?: string;
  price?: number;
  priceChange24h?: number;
}

export interface TokenAmount {
  token: Token;
  amount: string;
  amountFormatted: string;
  amountUSD?: number;
}

// Network Types
export interface Network {
  chainId: number;
  name: string;
  shortName: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  logo?: string;
  isTestnet?: boolean;
}

// DEX Types
export interface DEX {
  id: string;
  name: string;
  router: string;
  factory: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  supportedNetworks: number[];
}

// Quote Types
export interface QuoteRequest {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  slippage: number;
  recipient?: string;
  deadline?: number;
}

export interface Quote {
  id: string;
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  amountOut: string;
  amountOutMin: string;
  priceImpact: number;
  fee: string;
  gasEstimate: string;
  route: Route;
  dex: DEX;
  timestamp: number;
  expiresAt: number;
}

export interface Route {
  path: Token[];
  pools: Pool[];
  distribution: RouteDistribution[];
  gasEstimate: string;
  priceImpact: number;
}

export interface Pool {
  address: string;
  token0: Token;
  token1: Token;
  fee: number;
  liquidity: string;
  reserve0: string;
  reserve1: string;
  dex: DEX;
}

export interface RouteDistribution {
  dex: DEX;
  percentage: number;
  amountIn: string;
  amountOut: string;
}

// Transaction Types
export interface Transaction extends BaseEntity {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasLimit: string;
  gasPrice: string;
  gasUsed?: string;
  status: TransactionStatus;
  blockNumber?: number;
  blockHash?: string;
  confirmations?: number;
  timestamp: number;
  type: TransactionType;
  data?: any;
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum TransactionType {
  SWAP = 'swap',
  APPROVAL = 'approval',
  LIMIT_ORDER = 'limit_order',
  BATCH_SWAP = 'batch_swap',
}

// Swap Types
export interface SwapParams {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  amountOutMin: string;
  route: Route;
  recipient: string;
  deadline: number;
  slippage: number;
}

export interface SwapResult {
  transaction: Transaction;
  quote: Quote;
  amountOut: string;
  priceImpact: number;
  gasUsed: string;
}

// Wallet Types
export interface Wallet {
  id: string;
  name: string;
  icon: string;
  description: string;
  downloadUrl: string;
  isInstalled: boolean;
  provider?: any;
  supportsChains: number[];
}

export interface WalletConnection {
  wallet: Wallet;
  account: string;
  chainId: number;
  isConnected: boolean;
  balance?: string;
  ens?: string;
}

// User Types
export interface User {
  address: string;
  ens?: string;
  avatar?: string;
  joinedAt: Date;
  preferences: UserPreferences;
  portfolio: Portfolio;
}

export interface UserPreferences {
  defaultSlippage: number;
  autoRefresh: boolean;
  showTestnets: boolean;
  currency: 'USD' | 'EUR' | 'GBP';
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  priceAlerts: boolean;
  transactionUpdates: boolean;
}

// Portfolio Types
export interface Portfolio {
  totalValue: number;
  totalValueChange24h: number;
  tokens: TokenBalance[];
  transactions: Transaction[];
  lastUpdated: Date;
}

export interface TokenBalance {
  token: Token;
  balance: string;
  balanceFormatted: string;
  value: number;
  valueChange24h: number;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userMessage?: string;
}

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  WALLET_ERROR = 'WALLET_ERROR',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  INVALID_INPUT = 'INVALID_INPUT',
  RATE_LIMIT = 'RATE_LIMIT',
  API_ERROR = 'API_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// API Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AppError;
  timestamp: number;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// State Types
export interface AppState {
  user: User | null;
  wallet: WalletConnection | null;
  network: Network;
  tokens: Token[];
  quotes: Quote[];
  transactions: Transaction[];
  isLoading: boolean;
  error: AppError | null;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

// Hook Types
export interface UseAsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export interface UseTokenBalanceResult {
  balance: string;
  balanceFormatted: string;
  value: number;
  isLoading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
}

// Utility Types
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type NonNullable<T> = T extends null | undefined ? never : T;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Export all types as a namespace for easier imports
export * from './window';
