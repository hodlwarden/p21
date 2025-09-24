export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
}

export interface TokenAmount {
  token: Token;
  amount: string;
  formatted: string;
}

export interface SwapRoute {
  id: string;
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  priceImpact: number;
  gasEstimate: string;
  gasPrice: string;
  steps: SwapStep[];
  dex: string;
  executionTime: number;
}

export interface SwapStep {
  dex: string;
  pool: string;
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  fee: number;
}

export interface SwapQuote {
  routes: SwapRoute[];
  bestRoute: SwapRoute;
  totalGasEstimate: string;
  totalPriceImpact: number;
  timestamp: number;
}

export interface SwapParams {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  slippageTolerance: number;
  recipient: string;
  deadline: number;
  maxGasPrice?: string;
}

export interface LimitOrder {
  id: string;
  user: string;
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  price: string;
  status: 'pending' | 'filled' | 'cancelled' | 'expired';
  createdAt: number;
  expiresAt: number;
  filledAt?: number;
  txHash?: string;
}

export interface MultiTokenSwap {
  id: string;
  user: string;
  inputTokens: TokenAmount[];
  outputTokens: TokenAmount[];
  routes: SwapRoute[];
  totalGasEstimate: string;
  status: 'pending' | 'executed' | 'failed';
  createdAt: number;
  executedAt?: number;
  txHash?: string;
}

export interface DEXInfo {
  name: string;
  id: string;
  chainId: number;
  routerAddress: string;
  factoryAddress: string;
  fee: number;
  isActive: boolean;
  apiEndpoint?: string;
}

export interface PriceData {
  token: Token;
  price: string;
  timestamp: number;
  source: string;
}

export interface GasEstimate {
  gasLimit: string;
  gasPrice: string;
  totalCost: string;
  currency: string;
}

export interface TransactionResult {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  gasUsed: string;
  gasPrice: string;
  blockNumber: number;
  timestamp: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
