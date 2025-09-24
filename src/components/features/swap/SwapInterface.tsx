/**
 * Professional Swap Interface
 * Recreation of Fibrous Finance swap interface with advanced features
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { 
  ArrowUpDown, 
  Settings, 
  Info, 
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import { TokenSelector } from './TokenSelector';
import { SwapSettings } from './SwapSettings';
import { RouteDisplay } from './RouteDisplay';
import { PriceImpactIndicator } from './PriceImpactIndicator';
import { useAppStore } from '../../../store/app-store';
import { useWalletStore } from '../../../store/wallet-store';
import { formatTokenAmount, formatCurrency, formatPercentage } from '../../../utils/formatters';
import { validateSwapParams } from '../../../utils/validators';
import type { Token, Quote } from '../../../types';

interface SwapFormData {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  slippage: number;
  deadline: number;
}

interface SwapInterfaceProps {
  defaultTokenIn?: Token;
  defaultTokenOut?: Token;
  className?: string;
}

export const SwapInterface: React.FC<SwapInterfaceProps> = ({
  defaultTokenIn,
  defaultTokenOut,
  className = '',
}) => {
  // Store hooks
  const { currentNetwork, tokens } = useAppStore();
  const { connection, connectWallet } = useWalletStore();

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [priceImpact, setPriceImpact] = useState<number>(0);
  const [estimatedGas, setEstimatedGas] = useState<string>('0');
  const [refreshQuote, setRefreshQuote] = useState(0);

  // Form setup
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SwapFormData>({
    defaultValues: {
      tokenIn: defaultTokenIn || {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        chainId: currentNetwork.chainId,
      },
      tokenOut: defaultTokenOut || {
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        chainId: currentNetwork.chainId,
      },
      amountIn: '',
      slippage: 0.5,
      deadline: 20,
    },
  });

  const formData = watch();

  // Get quote when amount or tokens change
  const getQuote = useCallback(async () => {
    if (!formData.amountIn || !formData.tokenIn || !formData.tokenOut) {
      setQuote(null);
      return;
    }

    const validation = validateSwapParams({
      tokenIn: formData.tokenIn,
      tokenOut: formData.tokenOut,
      amountIn: formData.amountIn,
      slippage: formData.slippage,
      deadline: formData.deadline,
    });

    if (!validation.isValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock quote calculation (replace with actual DEX aggregator)
      const mockQuote: Quote = {
        id: `quote-${Date.now()}`,
        tokenIn: formData.tokenIn,
        tokenOut: formData.tokenOut,
        amountIn: formData.amountIn,
        amountOut: (parseFloat(formData.amountIn) * 1600).toString(), // Mock 1 ETH = 1600 USDC
        amountOutMin: (parseFloat(formData.amountIn) * 1600 * 0.995).toString(),
        priceImpact: Math.random() * 2, // Mock price impact
        fee: '0.003',
        gasEstimate: '150000',
        route: {
          path: [formData.tokenIn, formData.tokenOut],
          pools: [],
          distribution: [],
          gasEstimate: '150000',
          priceImpact: Math.random() * 2,
        },
        dex: {
          id: 'uniswap',
          name: 'Uniswap V3',
          router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
          factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
          logo: '/dex/uniswap.svg',
          website: 'https://uniswap.org',
          isActive: true,
          supportedNetworks: [1, 137, 42161, 8453],
        },
        timestamp: Date.now(),
        expiresAt: Date.now() + 30000, // 30 seconds
      };

      setQuote(mockQuote);
      setPriceImpact(mockQuote.priceImpact);
      setEstimatedGas(mockQuote.gasEstimate);
    } catch (error) {
      console.error('Failed to get quote:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  // Auto-refresh quote
  useEffect(() => {
    const timer = setTimeout(getQuote, 500);
    return () => clearTimeout(timer);
  }, [getQuote, refreshQuote]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshQuote(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle token swap
  const handleTokenSwap = () => {
    const tokenIn = formData.tokenIn;
    const tokenOut = formData.tokenOut;
    setValue('tokenIn', tokenOut);
    setValue('tokenOut', tokenIn);
    setValue('amountIn', '');
  };

  // Handle swap execution
  const onSubmit = async (data: SwapFormData) => {
    if (!connection) {
      await connectWallet("");
      return;
    }

    if (!quote) {
      return;
    }

    setIsLoading(true);

    try {
      // Execute swap logic here
      console.log('Executing swap:', data, quote);
      
      // Mock execution delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      useAppStore.getState().addNotification({
        type: 'success',
        title: 'Swap Successful',
        message: `Swapped ${formatTokenAmount(data.amountIn, data.tokenIn.decimals)} ${data.tokenIn.symbol} for ${formatTokenAmount(quote.amountOut, data.tokenOut.decimals)} ${data.tokenOut.symbol}`,
      });

      // Reset form
      setValue('amountIn', '');
      setQuote(null);
    } catch (error) {
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Swap Failed',
        message: 'Transaction failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = !!connection;
  const hasValidQuote = quote && parseFloat(formData.amountIn) > 0;

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-100">Swap</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRefreshQuote(prev => prev + 1)}
                disabled={isLoading}
              >
                <TrendingUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-6">
              <SwapSettings
                slippage={formData.slippage}
                deadline={formData.deadline}
                onSlippageChange={(value) => setValue('slippage', value)}
                onDeadlineChange={(value) => setValue('deadline', value)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Token In */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                From
              </label>
              <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="0.0"
                    className="bg-transparent text-2xl font-semibold text-gray-100 placeholder-gray-500 border-none outline-none flex-1"
                    {...register('amountIn', {
                      required: 'Amount is required',
                      pattern: {
                        value: /^\d*\.?\d*$/,
                        message: 'Invalid amount',
                      },
                    })}
                  />
                  <TokenSelector
                    selectedToken={formData.tokenIn}
                    onTokenSelect={(token) => setValue('tokenIn', token)}
                    tokens={tokens}
                  />
                </div>
                
                {connection && (
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Balance: {connection.balance || '0.00'} {formData.tokenIn.symbol}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setValue('amountIn', connection.balance || '0')}
                      className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                    >
                      MAX
                    </Button>
                  </div>
                )}
              </div>
              {errors.amountIn && (
                <p className="text-red-400 text-sm mt-1">{errors.amountIn.message}</p>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleTokenSwap}
                className="border-gray-600 hover:border-gray-500"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Token Out */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                To
              </label>
              <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-semibold text-gray-100">
                    {quote ? formatTokenAmount(quote.amountOut, formData.tokenOut.decimals, 6) : '0.0'}
                  </div>
                  <TokenSelector
                    selectedToken={formData.tokenOut}
                    onTokenSelect={(token) => setValue('tokenOut', token)}
                    tokens={tokens}
                  />
                </div>
                
                {quote && (
                  <div className="text-sm text-gray-400">
                    ≈ {formatCurrency(parseFloat(quote.amountOut) * (formData.tokenOut.symbol === 'USDC' ? 1 : 1600))}
                  </div>
                )}
              </div>
            </div>

            {/* Quote Information */}
            {hasValidQuote && quote && (
              <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Rate</span>
                  <span className="text-gray-100">
                    1 {formData.tokenIn.symbol} = {formatTokenAmount(
                      (parseFloat(quote.amountOut) / parseFloat(formData.amountIn)).toString(),
                      formData.tokenOut.decimals,
                      4
                    )} {formData.tokenOut.symbol}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400">Price Impact</span>
                  </div>
                  <PriceImpactIndicator impact={priceImpact} />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400">Est. Gas</span>
                  </div>
                  <span className="text-gray-100">
                    {formatTokenAmount(estimatedGas, 18, 6)} ETH
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Min. Received</span>
                  <span className="text-gray-100">
                    {formatTokenAmount(quote.amountOutMin, formData.tokenOut.decimals, 6)} {formData.tokenOut.symbol}
                  </span>
                </div>

                {/* Route Display */}
                <div className="border-t border-gray-600 pt-3">
                  <RouteDisplay route={quote.route} />
                </div>
              </div>
            )}

            {/* Warning for high price impact */}
            {priceImpact > 3 && (
              <div className="flex items-center space-x-2 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">
                  High price impact. You may lose value in this trade.
                </span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
              disabled={!hasValidQuote && isConnected}
              className="mt-6"
            >
              {!isConnected 
                ? 'Connect Wallet' 
                : !hasValidQuote 
                ? 'Enter Amount' 
                : `Swap ${formData.tokenIn.symbol} for ${formData.tokenOut.symbol}`
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
