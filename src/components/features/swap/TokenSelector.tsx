/**
 * Token Selector Component
 * Professional token selection with search and popular tokens
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Star, TrendingUp } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { TokenLogo } from '../../ui/TokenLogo';
import { useAppStore } from '../../../store/app-store';
import { formatTokenAmount, formatCurrency } from '../../../utils/formatters';
import { isValidAddress } from '../../../utils/validators';
import type { Token } from '../../../types';

interface TokenSelectorProps {
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
  tokens: Token[];
  disabled?: boolean;
  className?: string;
}

// Popular tokens on Base network
const POPULAR_TOKENS: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    chainId: 8453,
    logoURI: '/tokens/eth.svg',
  },
  {
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    chainId: 8453,
    logoURI: '/tokens/usdc.svg',
  },
  {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    chainId: 8453,
    logoURI: '/tokens/weth.svg',
  },
  {
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    chainId: 8453,
    logoURI: '/tokens/dai.svg',
  },
];

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onTokenSelect,
  tokens,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { recentTokens, addRecentToken } = useAppStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter tokens based on search
  const filteredTokens = React.useMemo(() => {
    if (!searchTerm) {
      return [...POPULAR_TOKENS, ...tokens];
    }

    const term = searchTerm.toLowerCase();
    return [...POPULAR_TOKENS, ...tokens].filter(token => 
      token.symbol.toLowerCase().includes(term) ||
      token.name.toLowerCase().includes(term) ||
      token.address.toLowerCase().includes(term)
    );
  }, [searchTerm, tokens]);

  // Handle token selection
  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token);
    addRecentToken(token);
    setIsOpen(false);
    setSearchTerm('');
    setCustomAddress('');
  };

  // Import custom token
  const handleCustomTokenImport = async () => {
    if (!isValidAddress(customAddress)) {
      return;
    }

    try {
      // Mock token import (replace with actual contract call)
      const customToken: Token = {
        address: customAddress,
        symbol: 'CUSTOM',
        name: 'Custom Token',
        decimals: 18,
        chainId: 8453,
      };

      handleTokenSelect(customToken);
    } catch (error) {
      console.error('Failed to import token:', error);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center space-x-2 border-gray-600 hover:border-gray-500 bg-gray-800 px-3 py-2"
      >
        <TokenLogo token={selectedToken} size="sm" />
        <span className="font-medium text-gray-100">{selectedToken.symbol}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border-gray-700 shadow-xl z-50 max-h-96 overflow-hidden">
          <div className="p-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tokens or paste address"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCustomAddress(e.target.value);
                }}
              />
            </div>

            {/* Custom Token Import */}
            {isValidAddress(customAddress) && (
              <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-400 font-medium">Import custom token</p>
                    <p className="text-xs text-gray-400 truncate">{customAddress}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleCustomTokenImport}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Import
                  </Button>
                </div>
              </div>
            )}

            {/* Token Categories */}
            <div className="space-y-3">
              {/* Recent Tokens */}
              {recentTokens.length > 0 && !searchTerm && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-300">Recent</h3>
                  </div>
                  <div className="space-y-1">
                    {recentTokens.slice(0, 3).map((token) => (
                      <TokenRow
                        key={token.address}
                        token={token}
                        onSelect={handleTokenSelect}
                        isSelected={token.address === selectedToken.address}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Tokens */}
              {!searchTerm && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-300">Popular</h3>
                  </div>
                  <div className="space-y-1">
                    {POPULAR_TOKENS.map((token) => (
                      <TokenRow
                        key={token.address}
                        token={token}
                        onSelect={handleTokenSelect}
                        isSelected={token.address === selectedToken.address}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Tokens */}
              <div className="max-h-48 overflow-y-auto">
                {searchTerm && (
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Search Results ({filteredTokens.length})
                  </h3>
                )}
                <div className="space-y-1">
                  {filteredTokens.map((token) => (
                    <TokenRow
                      key={token.address}
                      token={token}
                      onSelect={handleTokenSelect}
                      isSelected={token.address === selectedToken.address}
                    />
                  ))}
                </div>
                
                {filteredTokens.length === 0 && searchTerm && !isValidAddress(customAddress) && (
                  <div className="text-center py-6 text-gray-500">
                    <p>No tokens found</p>
                    <p className="text-xs mt-1">Try searching by name, symbol, or address</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Token row component
interface TokenRowProps {
  token: Token;
  onSelect: (token: Token) => void;
  isSelected: boolean;
}

const TokenRow: React.FC<TokenRowProps> = ({ token, onSelect, isSelected }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(token)}
      disabled={isSelected}
      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
        isSelected
          ? 'bg-blue-900/30 border border-blue-700'
          : 'hover:bg-gray-700 border border-transparent'
      }`}
    >
      <TokenLogo token={token} size="sm" />
      
      <div className="flex-1 text-left">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-100">{token.symbol}</span>
          {token.tags?.includes('verified') && (
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
          )}
        </div>
        <p className="text-sm text-gray-400 truncate">{token.name}</p>
      </div>

      <div className="text-right">
        {token.balance && (
          <p className="text-sm font-medium text-gray-100">
            {formatTokenAmount(token.balance, token.decimals, 4)}
          </p>
        )}
        {token.price && (
          <p className="text-sm text-gray-400">
            {formatCurrency(token.price)}
          </p>
        )}
      </div>
    </button>
  );
};
