/**
 * Token Logo Component
 * Professional token logo display with fallbacks
 */

'use client';

import React, { useState } from 'react';
import type { Token } from '../../types';
import Image from 'next/image';

interface TokenLogoProps {
  token: Token;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export const TokenLogo: React.FC<TokenLogoProps> = ({
  token,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  // Generate fallback avatar based on token symbol
  const generateFallback = () => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500',
    ];
    
    const colorIndex = token.symbol.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];

    return (
      <div
        className={`
          sizeClasses[size],
          bgColor,
          'rounded-full flex items-center justify-center text-white font-bold',
          className
        `}
      >
        <span className={size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-base'}>
          {token.symbol.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  };

  // If no logo URI or image error, show fallback
  if (!token.logoURI || imageError) {
    return generateFallback();
  }

  return (
    <div >
      {isLoading && (
        <div
          className={
            'absolute inset-0 bg-gray-700 rounded-full animate-pulse'
          }
        />
      )}
      <Image
        src={token.logoURI}
        alt={`${token.name} logo`}
        className={`
            'rounded-full object-cover',
            isLoading ? 'opacity-0' : 'opacity-100',
            'transition-opacity duration-200'
          `
        }
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};
