/**
 * Validation Utilities
 * Comprehensive validation functions for the DEX aggregator
 */

import { REGEX_PATTERNS, WELL_KNOWN_TOKENS } from './constants';
import type { Token, Network } from '../types';

// Address validation
export const isValidAddress = (address: string): boolean => {
  if (!address || typeof address !== 'string') return false;
  return REGEX_PATTERNS.ETHEREUM_ADDRESS.test(address);
};

// Transaction hash validation
export const isValidTxHash = (hash: string): boolean => {
  if (!hash || typeof hash !== 'string') return false;
  return REGEX_PATTERNS.TRANSACTION_HASH.test(hash);
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  return REGEX_PATTERNS.EMAIL.test(email);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  return REGEX_PATTERNS.URL.test(url);
};

// Numeric validation
export const isValidNumber = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false;
  return REGEX_PATTERNS.POSITIVE_NUMBER.test(value) && !isNaN(parseFloat(value));
};

// Amount validation
export const isValidAmount = (
  amount: string,
  options: {
    min?: number;
    max?: number;
    decimals?: number;
  } = {}
): { isValid: boolean; error?: string } => {
  const { min = 0, max, decimals = 18 } = options;

  if (!amount || amount.trim() === '') {
    return { isValid: false, error: 'Amount is required' };
  }

  if (!isValidNumber(amount)) {
    return { isValid: false, error: 'Invalid number format' };
  }

  const num = parseFloat(amount);

  if (num <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }

  if (num < min) {
    return { isValid: false, error: `Amount must be at least ${min}` };
  }

  if (max && num > max) {
    return { isValid: false, error: `Amount cannot exceed ${max}` };
  }

  // Check decimal places
  const decimalParts = amount.split('.');
  if (decimalParts.length > 1 && decimalParts[1].length > decimals) {
    return { isValid: false, error: `Maximum ${decimals} decimal places allowed` };
  }

  return { isValid: true };
};

// Token validation
export const isValidToken = (token: any): token is Token => {
  if (!token || typeof token !== 'object') return false;

  const requiredFields = ['address', 'symbol', 'name', 'decimals', 'chainId'];
  for (const field of requiredFields) {
    if (!(field in token)) return false;
  }

  // Validate address
  if (!isValidAddress(token.address)) return false;

  // Validate symbol
  if (!token.symbol || typeof token.symbol !== 'string' || token.symbol.length > 20) {
    return false;
  }

  // Validate name
  if (!token.name || typeof token.name !== 'string' || token.name.length > 100) {
    return false;
  }

  // Validate decimals
  if (typeof token.decimals !== 'number' || token.decimals < 0 || token.decimals > 30) {
    return false;
  }

  // Validate chainId
  if (typeof token.chainId !== 'number' || token.chainId <= 0) {
    return false;
  }

  return true;
};

// Network validation
export const isValidNetwork = (network: any): network is Network => {
  if (!network || typeof network !== 'object') return false;

  const requiredFields = ['chainId', 'name', 'shortName', 'rpcUrl', 'blockExplorer', 'nativeCurrency'];
  for (const field of requiredFields) {
    if (!(field in network)) return false;
  }

  // Validate chainId
  if (typeof network.chainId !== 'number' || network.chainId <= 0) {
    return false;
  }

  // Validate URLs
  if (!isValidUrl(network.rpcUrl) || !isValidUrl(network.blockExplorer)) {
    return false;
  }

  // Validate native currency
  const { nativeCurrency } = network;
  if (!nativeCurrency || typeof nativeCurrency !== 'object') return false;
  
  const currencyFields = ['name', 'symbol', 'decimals'];
  for (const field of currencyFields) {
    if (!(field in nativeCurrency)) return false;
  }

  if (typeof nativeCurrency.decimals !== 'number' || nativeCurrency.decimals !== 18) {
    return false;
  }

  return true;
};

// Slippage validation
export const isValidSlippage = (
  slippage: number | string
): { isValid: boolean; error?: string } => {
  const num = typeof slippage === 'string' ? parseFloat(slippage) : slippage;

  if (isNaN(num)) {
    return { isValid: false, error: 'Invalid slippage value' };
  }

  if (num < 0) {
    return { isValid: false, error: 'Slippage cannot be negative' };
  }

  if (num > 50) {
    return { isValid: false, error: 'Slippage cannot exceed 50%' };
  }

  if (num > 10) {
    return { 
      isValid: true, 
      error: 'High slippage tolerance may result in unfavorable trades' 
    };
  }

  return { isValid: true };
};

// Deadline validation
export const isValidDeadline = (
  deadline: number | string
): { isValid: boolean; error?: string } => {
  const num = typeof deadline === 'string' ? parseFloat(deadline) : deadline;

  if (isNaN(num)) {
    return { isValid: false, error: 'Invalid deadline value' };
  }

  if (num <= 0) {
    return { isValid: false, error: 'Deadline must be greater than 0' };
  }

  if (num > 120) {
    return { isValid: false, error: 'Deadline cannot exceed 120 minutes' };
  }

  return { isValid: true };
};

// Price impact validation
export const isPriceImpactAcceptable = (
  priceImpact: number,
  threshold = 5
): { isAcceptable: boolean; severity: 'low' | 'medium' | 'high' | 'critical' } => {
  const impact = Math.abs(priceImpact);

  if (impact < 1) {
    return { isAcceptable: true, severity: 'low' };
  } else if (impact < 3) {
    return { isAcceptable: true, severity: 'medium' };
  } else if (impact < threshold) {
    return { isAcceptable: true, severity: 'high' };
  } else {
    return { isAcceptable: false, severity: 'critical' };
  }
};

// Gas price validation
export const isValidGasPrice = (gasPrice: number | string): boolean => {
  const num = typeof gasPrice === 'string' ? parseFloat(gasPrice) : gasPrice;
  return !isNaN(num) && num > 0 && num < 1000; // Reasonable gas price range (gwei)
};

// Balance validation
export const hasSufficientBalance = (
  balance: string,
  amount: string,
  gasEstimate?: string
): { hasSufficient: boolean; shortfall?: string } => {
  try {
    const balanceNum = parseFloat(balance);
    const amountNum = parseFloat(amount);
    const gasNum = gasEstimate ? parseFloat(gasEstimate) : 0;

    const required = amountNum + gasNum;

    if (balanceNum >= required) {
      return { hasSufficient: true };
    } else {
      const shortfall = (required - balanceNum).toString();
      return { hasSufficient: false, shortfall };
    }
  } catch (error) {
    return { hasSufficient: false };
  }
};

// Token list validation
export const isValidTokenList = (tokenList: any[]): boolean => {
  if (!Array.isArray(tokenList)) return false;
  return tokenList.every(token => isValidToken(token));
};

// Swap parameters validation
export const validateSwapParams = (params: {
  tokenIn?: Token;
  tokenOut?: Token;
  amountIn?: string;
  slippage?: number;
  deadline?: number;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate tokens
  if (!params.tokenIn) {
    errors.push('Input token is required');
  } else if (!isValidToken(params.tokenIn)) {
    errors.push('Invalid input token');
  }

  if (!params.tokenOut) {
    errors.push('Output token is required');
  } else if (!isValidToken(params.tokenOut)) {
    errors.push('Invalid output token');
  }

  // Check if tokens are different
  if (params.tokenIn && params.tokenOut && 
      params.tokenIn.address.toLowerCase() === params.tokenOut.address.toLowerCase()) {
    errors.push('Input and output tokens must be different');
  }

  // Validate amount
  if (!params.amountIn) {
    errors.push('Input amount is required');
  } else {
    const amountValidation = isValidAmount(params.amountIn);
    if (!amountValidation.isValid) {
      errors.push(amountValidation.error || 'Invalid input amount');
    }
  }

  // Validate slippage
  if (params.slippage !== undefined) {
    const slippageValidation = isValidSlippage(params.slippage);
    if (!slippageValidation.isValid) {
      errors.push(slippageValidation.error || 'Invalid slippage');
    }
  }

  // Validate deadline
  if (params.deadline !== undefined) {
    const deadlineValidation = isValidDeadline(params.deadline);
    if (!deadlineValidation.isValid) {
      errors.push(deadlineValidation.error || 'Invalid deadline');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Chain ID validation
export const isValidChainId = (chainId: number): boolean => {
  return Number.isInteger(chainId) && chainId > 0;
};

// Token approval validation
export const needsApproval = (
  allowance: string,
  amount: string
): boolean => {
  try {
    const allowanceNum = parseFloat(allowance);
    const amountNum = parseFloat(amount);
    return allowanceNum < amountNum;
  } catch (error) {
    return true; // Default to requiring approval if parsing fails
  }
};

// ENS name validation
export const isValidENS = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  return name.endsWith('.eth') && name.length > 4;
};

// Private key validation (for development/testing)
export const isValidPrivateKey = (key: string): boolean => {
  if (!key || typeof key !== 'string') return false;
  const cleanKey = key.startsWith('0x') ? key.slice(2) : key;
  return /^[a-fA-F0-9]{64}$/.test(cleanKey);
};
