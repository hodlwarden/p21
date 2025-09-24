/**
 * Formatting Utilities
 * Functions for formatting numbers, currencies, addresses, etc.
 */

import { NATIVE_TOKEN_SYMBOLS } from './constants';

// Number formatting
export const formatNumber = (
  value: number | string,
  options: {
    decimals?: number;
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const {
    decimals = 2,
    notation = 'standard',
    currency,
    minimumFractionDigits,
    maximumFractionDigits = decimals,
  } = options;

  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';

  const formatOptions: Intl.NumberFormatOptions = {
    notation,
    minimumFractionDigits: minimumFractionDigits ?? (num < 1 ? decimals : 0),
    maximumFractionDigits,
  };

  if (currency) {
    formatOptions.style = 'currency';
    formatOptions.currency = currency;
  }

  return new Intl.NumberFormat('en-US', formatOptions).format(num);
};

// Currency formatting
export const formatCurrency = (
  value: number | string,
  currency = 'USD',
  options: {
    decimals?: number;
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  } = {}
): string => {
  return formatNumber(value, { ...options, currency });
};

// Percentage formatting
export const formatPercentage = (
  value: number | string,
  decimals = 2
): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0%';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num / 100);
};

// Large number formatting with units
export const formatLargeNumber = (
  value: number | string,
  decimals = 2
): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum < 1000) {
    return `${sign}${formatNumber(absNum, { decimals })}`;
  } else if (absNum < 1000000) {
    return `${sign}${formatNumber(absNum / 1000, { decimals })}K`;
  } else if (absNum < 1000000000) {
    return `${sign}${formatNumber(absNum / 1000000, { decimals })}M`;
  } else if (absNum < 1000000000000) {
    return `${sign}${formatNumber(absNum / 1000000000, { decimals })}B`;
  } else {
    return `${sign}${formatNumber(absNum / 1000000000000, { decimals })}T`;
  }
};

// Token amount formatting
export const formatTokenAmount = (
  amount: string | number,
  decimals = 18,
  displayDecimals = 6,
  symbol?: string
): string => {
  try {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(num) || num === 0) {
      return `0${symbol ? ` ${symbol}` : ''}`;
    }

    // For very small amounts, show more decimals
    let finalDecimals = displayDecimals;
    if (num < 0.001) {
      finalDecimals = Math.max(displayDecimals, 8);
    } else if (num < 1) {
      finalDecimals = Math.max(displayDecimals, 4);
    }

    const formatted = formatNumber(num, { decimals: finalDecimals });
    
    return `${formatted}${symbol ? ` ${symbol}` : ''}`;
  } catch (error) {
    return `0${symbol ? ` ${symbol}` : ''}`;
  }
};

// Address formatting
export const formatAddress = (
  address: string,
  startChars = 6,
  endChars = 4
): string => {
  if (!address || address.length < startChars + endChars) {
    return address || '';
  }
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Transaction hash formatting
export const formatTxHash = (hash: string): string => {
  return formatAddress(hash, 8, 6);
};

// Time formatting
export const formatTime = (timestamp: number | Date): string => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
};

// Date formatting
export const formatDate = (
  timestamp: number | Date,
  options: {
    includeTime?: boolean;
    relative?: boolean;
  } = {}
): string => {
  const { includeTime = false, relative = false } = options;
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  if (relative) {
    return formatRelativeTime(date);
  }
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
    formatOptions.hour12 = false;
  }
  
  return new Intl.DateTimeFormat('en-US', formatOptions).format(date);
};

// Relative time formatting
export const formatRelativeTime = (timestamp: number | Date): string => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return rtf.format(-diffSeconds, 'second');
  } else if (diffMinutes < 60) {
    return rtf.format(-diffMinutes, 'minute');
  } else if (diffHours < 24) {
    return rtf.format(-diffHours, 'hour');
  } else if (diffDays < 7) {
    return rtf.format(-diffDays, 'day');
  } else {
    return formatDate(date);
  }
};

// Duration formatting
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

// Gas price formatting
export const formatGasPrice = (gwei: number | string): string => {
  const num = typeof gwei === 'string' ? parseFloat(gwei) : gwei;
  
  if (isNaN(num)) return '0 gwei';
  
  return `${formatNumber(num, { decimals: 1 })} gwei`;
};

// Native token symbol getter
export const getNativeTokenSymbol = (chainId: number): string => {
  return NATIVE_TOKEN_SYMBOLS[chainId as keyof typeof NATIVE_TOKEN_SYMBOLS] || 'ETH';
};

// Price impact formatting with color indication
export const formatPriceImpact = (
  impact: number | string
): { formatted: string; severity: 'low' | 'medium' | 'high' | 'critical' } => {
  const num = typeof impact === 'string' ? parseFloat(impact) : impact;
  
  if (isNaN(num)) {
    return { formatted: '0%', severity: 'low' };
  }
  
  const absImpact = Math.abs(num);
  let severity: 'low' | 'medium' | 'high' | 'critical';
  
  if (absImpact < 1) {
    severity = 'low';
  } else if (absImpact < 3) {
    severity = 'medium';
  } else if (absImpact < 5) {
    severity = 'high';
  } else {
    severity = 'critical';
  }
  
  return {
    formatted: formatPercentage(num),
    severity,
  };
};

// Slippage formatting
export const formatSlippage = (slippage: number | string): string => {
  const num = typeof slippage === 'string' ? parseFloat(slippage) : slippage;
  
  if (isNaN(num)) return '0%';
  
  return `${formatNumber(num, { decimals: 1 })}%`;
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${formatNumber(bytes / Math.pow(k, i), { decimals: 1 })} ${sizes[i]}`;
};

// Error message formatting
export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.reason) {
    return error.reason;
  }
  
  return 'An unknown error occurred';
};
