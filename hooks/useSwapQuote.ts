import { useQuery } from '@tanstack/react-query';
import { useWeb3 } from '../lib/web3-provider';
import { SwapQuote, Token } from '../types';

interface UseSwapQuoteParams {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  slippageTolerance: number;
}

export function useSwapQuote({
  inputToken,
  outputToken,
  inputAmount,
  slippageTolerance,
}: UseSwapQuoteParams) {
  const { dexAggregator } = useWeb3();

  return useQuery<SwapQuote, Error>({
    queryKey: ['swapQuote', inputToken.address, outputToken.address, inputAmount, slippageTolerance],
    queryFn: async () => {
      if (!dexAggregator) {
        throw new Error('DEX aggregator not initialized');
      }

      if (!inputAmount || parseFloat(inputAmount) <= 0) {
        throw new Error('Invalid input amount');
      }

      const swapParams = {
        inputToken,
        outputToken,
        inputAmount,
        slippageTolerance,
        recipient: '0x0000000000000000000000000000000000000000', // Will be set during execution
        deadline: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
      };

      return await dexAggregator.getSwapQuote(swapParams);
    },
    enabled: !!dexAggregator && !!inputToken && !!outputToken && !!inputAmount && parseFloat(inputAmount) > 0,
    staleTime: 10000, // 10 seconds
    cacheTime: 30000, // 30 seconds
    retry: 2,
  });
}
