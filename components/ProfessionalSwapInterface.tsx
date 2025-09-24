'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowUpDown, Settings, Zap, TrendingUp, RefreshCw } from 'lucide-react';
import { TokenSelector } from './TokenSelector';
import { RouteDisplay } from './RouteDisplay';
import { Token } from '../types';
import toast from 'react-hot-toast';

interface SwapFormData {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  slippageTolerance: number;
  recipient: string;
}

interface ProfessionalSwapInterfaceProps {
  tokens: Token[];
}

export function ProfessionalSwapInterface({ tokens }: ProfessionalSwapInterfaceProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quote, setQuote] = useState<any>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SwapFormData>({
    defaultValues: {
      inputToken: tokens[0],
      outputToken: tokens[1],
      inputAmount: '',
      slippageTolerance: 0.5,
      recipient: '',
    },
  });

  const watchedValues = watch();

  // Mock quote fetching
  useEffect(() => {
    if (watchedValues.inputAmount && parseFloat(watchedValues.inputAmount) > 0) {
      setIsLoadingQuote(true);
      // Simulate API call
      setTimeout(() => {
        setQuote({
          inputAmount: watchedValues.inputAmount,
          outputAmount: (parseFloat(watchedValues.inputAmount) * 0.95).toFixed(6),
          priceImpact: 0.5,
          minimumReceived: (parseFloat(watchedValues.inputAmount) * 0.95 * 0.995).toFixed(6),
          routes: [
            {
              dex: 'Uniswap V3',
              percentage: 60,
              path: [watchedValues.inputToken.symbol, 'WETH', watchedValues.outputToken.symbol],
            },
            {
              dex: 'SushiSwap',
              percentage: 40,
              path: [watchedValues.inputToken.symbol, watchedValues.outputToken.symbol],
            },
          ],
        });
        setIsLoadingQuote(false);
      }, 1000);
    } else {
      setQuote(null);
    }
  }, [watchedValues.inputAmount, watchedValues.inputToken, watchedValues.outputToken]);

  const onSubmit = async (data: SwapFormData) => {
    if (!data.inputAmount || parseFloat(data.inputAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsExecuting(true);
    try {
      // Mock swap execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Swap executed successfully!');
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
    setValue('inputAmount', '');
    setQuote(null);
  };

  const refreshQuote = () => {
    if (watchedValues.inputAmount && parseFloat(watchedValues.inputAmount) > 0) {
      setIsLoadingQuote(true);
      setTimeout(() => {
        setIsLoadingQuote(false);
        toast.success('Quote refreshed');
      }, 500);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Professional Swap Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-100">Swap</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshQuote}
              disabled={isLoadingQuote}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
            >
            <RefreshCw className={`w-4 h-4 ${isLoadingQuote ? 'animate-spin' : ''}`} />
          </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Swap Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">From</label>
          <div className="relative">
            <TokenSelector
              selectedToken={watchedValues.inputToken}
              onTokenSelect={(token) => setValue('inputToken', token)}
              tokens={tokens}
            />
            <input
              type="number"
              placeholder="0.0"
              {...register('inputAmount', { required: true, min: 0 })}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-right text-lg font-medium bg-transparent border-none outline-none w-32"
            />
          </div>
          {errors.inputAmount && (
            <p className="text-sm text-red-500">Please enter a valid amount</p>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={swapTokens}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowUpDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Output Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">To</label>
          <div className="relative">
            <TokenSelector
              selectedToken={watchedValues.outputToken}
              onTokenSelect={(token) => setValue('outputToken', token)}
              tokens={tokens}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-right">
              {isLoadingQuote ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">Getting quote...</span>
                </div>
              ) : quote ? (
                <div className="text-right">
                  <div className="text-lg font-medium text-gray-900">
                    {quote.outputAmount}
                  </div>
                  <div className="text-sm text-gray-500">
                    ≈ ${(parseFloat(quote.outputAmount) * 1.5).toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400">0.0</div>
              )}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-gray-700/50 rounded-lg p-4 space-y-4 mb-6">
            <h3 className="text-sm font-medium text-gray-200">Transaction Settings</h3>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Slippage Tolerance</label>
              <div className="flex space-x-2">
                {[0.1, 0.5, 1.0].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue('slippageTolerance', value)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      watchedValues.slippageTolerance === value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {value}%
                  </button>
                ))}
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  {...register('slippageTolerance', { min: 0, max: 50 })}
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Recipient (Optional)</label>
              <input
                type="text"
                placeholder="0x..."
                {...register('recipient')}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Route Information */}
        {quote && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Price Impact</span>
              <span className="text-gray-900">{quote.priceImpact}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Minimum Received</span>
              <span className="text-gray-900">{quote.minimumReceived} {watchedValues.outputToken.symbol}</span>
            </div>
            
            <RouteDisplay route={quote.routes[0]} />
          </div>
        )}

        {/* Swap Button */}
        <button
          type="submit"
          disabled={!quote || !watchedValues.inputAmount || parseFloat(watchedValues.inputAmount) <= 0 || isExecuting}
          className="w-full btn btn-primary btn-lg"
        >
          {isExecuting ? 'Executing Swap...' : 'Execute Swap'}
        </button>
      </form>
      </div>
    </div>
  );
}
