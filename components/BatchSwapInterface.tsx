'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { TokenSelector } from './TokenSelector';
import { SwapButton } from './SwapButton';
import { Token } from '../types';

interface BatchSwapFormData {
  inputTokens: Array<{
    token: Token;
    amount: string;
  }>;
  outputToken: Token;
}

interface BatchSwapInterfaceProps {
  tokens: Token[];
}

export function BatchSwapInterface({ tokens }: BatchSwapInterfaceProps) {
  const [inputTokens, setInputTokens] = useState([
    { token: tokens[0] || { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, chainId: 8453 }, amount: '' }
  ]);

  const addInputToken = () => {
    setInputTokens([...inputTokens, { token: tokens[0] || { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, chainId: 8453 }, amount: '' }]);
  };

  const removeInputToken = (index: number) => {
    if (inputTokens.length > 1) {
      setInputTokens(inputTokens.filter((_, i) => i !== index));
    }
  };

  const updateInputToken = (index: number, field: 'token' | 'amount', value: any) => {
    const updated = [...inputTokens];
    updated[index] = { ...updated[index], [field]: value };
    setInputTokens(updated);
  };

  const [outputToken, setOutputToken] = useState(tokens[1] || { symbol: 'USDC', name: 'USD Coin', address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', decimals: 6, chainId: 8453 });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Batch Swap</h3>
        <p className="text-sm text-gray-600">
          Swap multiple tokens for a single token in one transaction
        </p>
      </div>

      {/* Input Tokens */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Input Tokens</h4>
        {inputTokens.map((inputToken, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-1">
              <TokenSelector
                selectedToken={inputToken.token}
                onTokenSelect={(token) => updateInputToken(index, 'token', token)}
                tokens={tokens}
              />
            </div>
            <div className="w-32">
              <input
                type="number"
                placeholder="0.0"
                value={inputToken.amount}
                onChange={(e) => updateInputToken(index, 'amount', e.target.value)}
                className="input w-full"
              />
            </div>
            {inputTokens.length > 1 && (
              <button
                onClick={() => removeInputToken(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={addInputToken}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Token</span>
        </button>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <ArrowRight className="w-6 h-6 text-gray-400" />
      </div>

      {/* Output Token */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Output Token</h4>
        <TokenSelector
          selectedToken={outputToken}
          onTokenSelect={setOutputToken}
          tokens={tokens}
        />
      </div>

      {/* Swap Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={() => {
            // Batch swap logic here
            console.log('Batch swap:', { inputTokens, outputToken });
          }}
          disabled={inputTokens.some(token => !token.amount || parseFloat(token.amount) <= 0)}
          className="w-full btn btn-primary btn-lg"
        >
          Execute Batch Swap
        </button>
      </div>
    </div>
  );
}
