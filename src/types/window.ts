/**
 * Window Type Extensions
 * Enhanced TypeScript declarations for browser wallet APIs
 */

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    phantom?: PhantomProvider;
    solana?: any;
    starknet_argent?: any;
    starknet_braavos?: any;
    coinbaseWalletExtension?: any;
    trustWallet?: any;
    okxwallet?: any;
    bitkeep?: any;
    rabbby?: any;
    web3?: any;
  }
}

export interface EthereumProvider {
  // Standard Ethereum Provider
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isTrust?: boolean;
  isRainbow?: boolean;
  isOkxWallet?: boolean;
  isBitKeep?: boolean;
  isRabby?: boolean;
  isTalisman?: boolean;
  isFrame?: boolean;
  isBraveWallet?: boolean;
  
  // Multi-provider support
  providers?: EthereumProvider[];
  
  // Core methods
  request: (args: {
    method: string;
    params?: any[] | Record<string, any>;
  }) => Promise<any>;
  
  // Event listeners
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  removeAllListeners?: (event?: string) => void;
  
  // Connection state
  isConnected?: () => boolean;
  
  // Network switching (EIP-3326)
  wallet_switchEthereumChain?: (params: { chainId: string }) => Promise<void>;
  wallet_addEthereumChain?: (params: AddEthereumChainParams) => Promise<void>;
  
  // Permissions (EIP-2255)
  wallet_requestPermissions?: (params: any) => Promise<any>;
  wallet_getPermissions?: () => Promise<any>;
  
  // Legacy properties
  selectedAddress?: string;
  chainId?: string;
  networkVersion?: string;
  
  // Experimental/deprecated
  enable?: () => Promise<string[]>;
  send?: (method: string, params?: any[]) => Promise<any>;
  sendAsync?: (
    request: { method: string; params?: any[] },
    callback: (error: any, response: any) => void
  ) => void;
}

export interface PhantomProvider {
  isPhantom?: boolean;
  
  // Solana provider
  solana?: {
    isPhantom: boolean;
    connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: any }>;
    disconnect: () => Promise<void>;
    signTransaction: (transaction: any) => Promise<any>;
    signAllTransactions: (transactions: any[]) => Promise<any[]>;
    signMessage: (message: Uint8Array, display?: string) => Promise<{ signature: Uint8Array }>;
    request: (args: { method: string; params?: any }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    isConnected: boolean;
    publicKey: any | null;
  };
  
  // Ethereum provider (if available)
  ethereum?: {
    isPhantom: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    isConnected: () => boolean;
  };
}

export interface AddEthereumChainParams {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}

export interface WalletError extends Error {
  code: number;
  message: string;
  data?: any;
}

// Common error codes
export enum WalletErrorCode {
  USER_REJECTED = 4001,
  UNAUTHORIZED = 4100,
  UNSUPPORTED_METHOD = 4200,
  DISCONNECTED = 4900,
  CHAIN_DISCONNECTED = 4901,
  CHAIN_NOT_ADDED = 4902,
  RESOURCE_NOT_FOUND = -32001,
  RESOURCE_UNAVAILABLE = -32002,
  TRANSACTION_REJECTED = -32003,
  METHOD_NOT_SUPPORTED = -32004,
  LIMIT_EXCEEDED = -32005,
  PARSE_ERROR = -32700,
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,
}

// Provider events
export type ProviderEvent = 
  | 'connect'
  | 'disconnect'
  | 'accountsChanged'
  | 'chainChanged'
  | 'networkChanged'
  | 'message';

export interface ProviderConnectInfo {
  chainId: string;
}

export interface ProviderMessage {
  type: string;
  data: unknown;
}

// Type guards
export const isEthereumProvider = (provider: any): provider is EthereumProvider => {
  return provider && typeof provider.request === 'function';
};

export const isPhantomProvider = (provider: any): provider is PhantomProvider => {
  return provider && (provider.isPhantom || provider.solana?.isPhantom);
};

export const isWalletError = (error: any): error is WalletError => {
  return error && typeof error.code === 'number' && typeof error.message === 'string';
};

export {};
