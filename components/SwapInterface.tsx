'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowUpDown, Settings, Zap, TrendingUp } from 'lucide-react';
import { TokenSelector } from './TokenSelector';
import { SwapButton } from './SwapButton';
import { RouteDisplay } from './RouteDisplay';
import { WalletConnect } from './WalletConnect';
import { useSwapQuote } from '../hooks/useSwapQuote';
import { useWeb3 } from '../lib/web3-provider';
import { Token } from '../types';
import toast from 'react-hot-toast';

interface SwapFormData {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  slippageTolerance: number;
  recipient: string;
}

const defaultTokens: Token[] = [
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    chainId: 1,
  },
  {
    address: '0xA0b86a33E6441b8C4C8C0E4A8e4A0b86a33E6441b',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    chainId: 1,
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    chainId: 1,
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    chainId: 1,
  },
];

interface SwapInterfaceProps {
  tokens?: Token[];
}

export function SwapInterface({ tokens = defaultTokens }: SwapInterfaceProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const { dexAggregator, isConnected, account } = useWeb3();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SwapFormData>({
    defaultValues: {
      inputToken: defaultTokens[0],
      outputToken: defaultTokens[1],
      inputAmount: '',
      slippageTolerance: 1.0,
      recipient: '',
    },
  });

  const watchedValues = watch();
  const { data: quote, isLoading: isQuoteLoading, error: quoteError } = useSwapQuote({
    inputToken: watchedValues.inputToken,
    outputToken: watchedValues.outputToken,
    inputAmount: watchedValues.inputAmount,
    slippageTolerance: watchedValues.slippageTolerance,
  });

  const onSubmit = async (data: SwapFormData) => {
    if (!isConnected || !dexAggregator || !quote) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsExecuting(true);
    try {
      const swapParams = {
        ...data,
        recipient: data.recipient || account!,
        deadline: Math.floor(Date.now() / 1000) + (20 * 60), // 20 minutes from now
      };

      const txHash = await dexAggregator.executeSwap(swapParams, quote.bestRoute);
      
      toast.success(`Swap executed successfully! TX: ${txHash.slice(0, 10)}...`);
      
      // Reset form
      setValue('inputAmount', '');
      
    } catch (error: any) {
      toast.error(`Swap failed: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const swapTokens = () => {
    const inputToken = watchedValues.inputToken;
    const outputToken = watchedValues.outputToken;
    setValue('inputToken', outputToken);
    setValue('outputToken', inputToken);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <div className="flex justify-end">
        <WalletConnect />
      </div>

      {/* Swap Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary-700">From</label>
          <div className="relative">
            <TokenSelector
              selectedToken={watchedValues.inputToken}
              onTokenSelect={(token) => setValue('inputToken', token)}
              tokens={defaultTokens}
            />
            <input
              type="number"
              placeholder="0.0"
              className="input text-right pr-4"
              {...register('inputAmount', { 
                required: 'Amount is required',
                min: { value: 0.001, message: 'Minimum amount is 0.001' }
              })}
            />
          </div>
          {errors.inputAmount && (
            <p className="text-sm text-error-600">{errors.inputAmount.message}</p>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={swapTokens}
            className="p-2 rounded-full bg-secondary-100 hover:bg-secondary-200 transition-colors"
            aria-label="Swap tokens"
          >
            <ArrowUpDown className="w-4 h-4 text-secondary-600" />
          </button>
        </div>

        {/* Output Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary-700">To</label>
          <div className="relative">
            <TokenSelector
              selectedToken={watchedValues.outputToken}
              onTokenSelect={(token) => setValue('outputToken', token)}
              tokens={defaultTokens}
            />
            <div className="input text-right pr-4 bg-secondary-50 text-secondary-600">
              {isQuoteLoading ? (
                <div className="loading-spinner mx-auto" />
              ) : quote?.bestRoute?.outputAmount ? (
                parseFloat(quote.bestRoute.outputAmount).toFixed(6)
              ) : (
                '0.0'
              )}
            </div>
          </div>
        </div>

        {/* Route Information */}
        {quote && (
          <RouteDisplay route={quote.bestRoute} />
        )}

        {/* Quote Error */}
        {quoteError && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-md">
            <p className="text-sm text-error-600">
              Failed to get quote: {quoteError.message}
            </p>
          </div>
        )}

        {/* Advanced Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2 text-sm text-secondary-600 hover:text-secondary-900"
            >
              <Settings className="w-4 h-4" />
              <span>Advanced Settings</span>
            </button>
          </div>

          {showSettings && (
            <div className="space-y-4 p-4 bg-secondary-50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700">
                  Slippage Tolerance (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="50"
                  className="input"
                  {...register('slippageTolerance', { 
                    required: 'Slippage tolerance is required',
                    min: { value: 0.1, message: 'Minimum slippage is 0.1%' },
                    max: { value: 50, message: 'Maximum slippage is 50%' }
                  })}
                />
                {errors.slippageTolerance && (
                  <p className="text-sm text-error-600">{errors.slippageTolerance.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700">
                  Recipient Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="input"
                  {...register('recipient')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Swap Button */}
        <SwapButton
          isLoading={isExecuting || isQuoteLoading}
          disabled={!quote || !!quoteError || !isConnected}
          quote={quote}
        />
      </form>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-secondary-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Zap className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-medium text-secondary-900">Best Price Execution</h3>
            <p className="text-sm text-secondary-600">Aggregated from all DEXs</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-success-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-success-600" />
          </div>
          <div>
            <h3 className="font-medium text-secondary-900">Low Fees</h3>
            <p className="text-sm text-secondary-600">Optimized gas usage</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-warning-100 rounded-lg">
            <Settings className="w-5 h-5 text-warning-600" />
          </div>
          <div>
            <h3 className="font-medium text-secondary-900">Flash Accounting</h3>
            <p className="text-sm text-secondary-600">Recursive optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
}
