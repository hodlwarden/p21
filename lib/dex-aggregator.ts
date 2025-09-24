import { ethers } from 'ethers';
import { Token, SwapRoute, SwapQuote, SwapParams } from '../types';

// DEX Router Addresses
const DEX_ROUTERS = {
  uniswap_v2: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  uniswap_v3: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  sushiswap: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
  pancakeswap: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
};

// Common Token Addresses
export const COMMON_TOKENS = {
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  USDC: '0xA0b86a33E6441b8C4C8C0E4A8e4A0b86a33E6441b',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
};

export class FrontendDEXAggregator {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;

  constructor(provider: ethers.Provider, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async getSwapQuote(params: SwapParams): Promise<SwapQuote> {
    const routes: SwapRoute[] = [];

    // Get quotes from multiple DEXes
    const quotePromises = Object.entries(DEX_ROUTERS).map(([dexName, routerAddress]) =>
      this.getQuoteFromDEX(dexName, routerAddress, params).catch(error => {
        console.warn(`Failed to get quote from ${dexName}:`, error.message);
        return null;
      })
    );

    const dexQuotes = await Promise.all(quotePromises);
    const validQuotes = dexQuotes.filter(quote => quote !== null) as SwapRoute[];

    routes.push(...validQuotes);

    if (routes.length === 0) {
      throw new Error('No valid routes found');
    }

    // Find the best route (highest output amount)
    const bestRoute = routes.reduce((best, current) => {
      const bestOutput = parseFloat(best.outputAmount);
      const currentOutput = parseFloat(current.outputAmount);
      return currentOutput > bestOutput ? current : best;
    });

    // Calculate total gas estimate
    const totalGasEstimate = routes.reduce((total, route) => {
      return (parseInt(total) + parseInt(route.gasEstimate)).toString();
    }, '0');

    // Calculate total price impact
    const totalPriceImpact = routes.reduce((total, route) => total + route.priceImpact, 0);

    return {
      routes,
      bestRoute,
      totalGasEstimate,
      totalPriceImpact,
      timestamp: Date.now(),
    };
  }

  private async getQuoteFromDEX(
    dexName: string,
    routerAddress: string,
    params: SwapParams
  ): Promise<SwapRoute> {
    try {
      // Get current gas price
      const gasPrice = await this.provider.getFeeData();
      
      // Estimate gas for swap
      const gasEstimate = await this.estimateSwapGas(routerAddress, params);
      
      // Calculate output amount (simplified - in reality you'd call the DEX contract)
      const outputAmount = await this.calculateOutputAmount(routerAddress, params);
      
      // Calculate price impact (simplified)
      const priceImpact = this.calculatePriceImpact(params.inputAmount, outputAmount);

      const route: SwapRoute = {
        id: `${dexName}_${Date.now()}`,
        inputToken: params.inputToken,
        outputToken: params.outputToken,
        inputAmount: params.inputAmount,
        outputAmount,
        priceImpact,
        gasEstimate: gasEstimate.toString(),
        gasPrice: gasPrice.gasPrice?.toString() || '20000000000',
        steps: [{
          dex: dexName,
          pool: `${params.inputToken.symbol}/${params.outputToken.symbol}`,
          inputToken: params.inputToken,
          outputToken: params.outputToken,
          inputAmount: params.inputAmount,
          outputAmount,
          fee: this.getDEXFee(dexName),
        }],
        dex: dexName,
        executionTime: this.getDEXExecutionTime(dexName),
      };

      return route;
    } catch (error) {
      throw new Error(`Failed to get quote from ${dexName}: ${error.message}`);
    }
  }

  private async estimateSwapGas(routerAddress: string, params: SwapParams): Promise<number> {
    try {
      // Create a mock transaction to estimate gas
      const mockTx = {
        to: routerAddress,
        data: '0x', // Mock data - in reality you'd encode the swap function call
        value: params.inputToken.address === COMMON_TOKENS.WETH ? ethers.parseEther(params.inputAmount) : 0,
      };

      const gasEstimate = await this.provider.estimateGas(mockTx);
      return Number(gasEstimate);
    } catch (error) {
      // Return default gas estimate if estimation fails
      return 150000;
    }
  }

  private async calculateOutputAmount(routerAddress: string, params: SwapParams): Promise<string> {
    try {
      // This is a simplified calculation
      // In reality, you would call the DEX contract's getAmountsOut function
      
      // Mock calculation based on token pair
      const inputAmount = parseFloat(params.inputAmount);
      let outputAmount = inputAmount;

      // Apply mock exchange rates
      if (params.inputToken.symbol === 'WETH' && params.outputToken.symbol === 'USDC') {
        outputAmount = inputAmount * 2000; // Mock ETH price
      } else if (params.inputToken.symbol === 'USDC' && params.outputToken.symbol === 'WETH') {
        outputAmount = inputAmount / 2000; // Mock ETH price
      } else if (params.inputToken.symbol === 'USDC' && params.outputToken.symbol === 'USDT') {
        outputAmount = inputAmount * 0.999; // Small spread
      } else {
        outputAmount = inputAmount * (0.95 + Math.random() * 0.1); // Random rate
      }

      // Apply DEX fee
      const dexFee = this.getDEXFee(routerAddress);
      outputAmount = outputAmount * (1 - dexFee / 100);

      return outputAmount.toString();
    } catch (error) {
      throw new Error(`Failed to calculate output amount: ${error.message}`);
    }
  }

  private calculatePriceImpact(inputAmount: string, outputAmount: string): number {
    // Simplified price impact calculation
    const input = parseFloat(inputAmount);
    const output = parseFloat(outputAmount);
    
    // Mock liquidity pool size
    const mockLiquidity = 1000000;
    const priceImpact = (input / mockLiquidity) * 100;
    
    return Math.min(priceImpact, 10); // Cap at 10%
  }

  private getDEXFee(dexName: string): number {
    const fees: Record<string, number> = {
      uniswap_v2: 0.3,
      uniswap_v3: 0.3,
      sushiswap: 0.25,
      pancakeswap: 0.25,
    };
    return fees[dexName] || 0.3;
  }

  private getDEXExecutionTime(dexName: string): number {
    const times: Record<string, number> = {
      uniswap_v2: 1000,
      uniswap_v3: 1200,
      sushiswap: 1500,
      pancakeswap: 2000,
    };
    return times[dexName] || 1000;
  }

  async executeSwap(params: SwapParams, route: SwapRoute): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer required for transaction execution');
    }

    try {
      // Create the swap transaction
      const tx = await this.createSwapTransaction(params, route);
      
      // Send the transaction
      const response = await this.signer.sendTransaction(tx);
      
      // Wait for confirmation
      await response.wait();
      
      return response.hash;
    } catch (error) {
      throw new Error(`Swap execution failed: ${error.message}`);
    }
  }

  private async createSwapTransaction(params: SwapParams, route: SwapRoute) {
    // This is a simplified transaction creation
    // In reality, you would encode the specific DEX router function call
    
    const routerAddress = DEX_ROUTERS[route.dex as keyof typeof DEX_ROUTERS];
    
    return {
      to: routerAddress,
      value: params.inputToken.address === COMMON_TOKENS.WETH ? 
        ethers.parseEther(params.inputAmount) : 0,
      data: '0x', // Encoded swap function call
      gasLimit: route.gasEstimate,
      gasPrice: route.gasPrice,
    };
  }

  // Utility method to get token balance
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    try {
      if (tokenAddress === COMMON_TOKENS.WETH) {
        const balance = await this.provider.getBalance(userAddress);
        return ethers.formatEther(balance);
      } else {
        // For ERC20 tokens, you would call the balanceOf function
        // This is a simplified version
        return '0';
      }
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return '0';
    }
  }

  // Utility method to get token allowance
  async getTokenAllowance(
    tokenAddress: string,
    userAddress: string,
    spenderAddress: string
  ): Promise<string> {
    try {
      // For ERC20 tokens, you would call the allowance function
      // This is a simplified version
      return '0';
    } catch (error) {
      console.error('Failed to get token allowance:', error);
      return '0';
    }
  }
}
