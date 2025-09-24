'use client';

import { SwapQuote } from '../types';

interface SwapButtonProps {
  isLoading: boolean;
  disabled: boolean;
  quote?: SwapQuote;
}

export function SwapButton({ isLoading, disabled, quote }: SwapButtonProps) {
  const getButtonText = () => {
    if (isLoading) return 'Getting Quote...';
    if (!quote) return 'Enter Amount';
    if (disabled) return 'Insufficient Liquidity';
    return 'Swap';
  };

  const getButtonColor = () => {
    if (disabled) return 'btn-secondary';
    return 'btn-primary';
  };

  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={`btn ${getButtonColor()} btn-lg w-full`}
    >
      {isLoading && <div className="loading-spinner mr-2" />}
      {getButtonText()}
    </button>
  );
}
