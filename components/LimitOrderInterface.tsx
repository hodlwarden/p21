'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Clock, Target, Calendar } from 'lucide-react';
import { TokenSelector } from './TokenSelector';
import { Token } from '../types';

interface LimitOrderFormData {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  targetPrice: string;
  orderType: 'buy' | 'sell';
  expiryDate: string;
}

interface LimitOrderInterfaceProps {
  tokens: Token[];
}

export function LimitOrderInterface({ tokens }: LimitOrderInterfaceProps) {
  const [formData, setFormData] = useState<LimitOrderFormData>({
    inputToken: tokens[0] || { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, chainId: 8453 },
    outputToken: tokens[1] || { symbol: 'USDC', name: 'USD Coin', address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', decimals: 6, chainId: 8453 },
    inputAmount: '',
    targetPrice: '',
    orderType: 'buy',
    expiryDate: ''
  });

  const updateFormData = (field: keyof LimitOrderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Limit order:', formData);
    // Limit order logic here
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Limit Order</h3>
        <p className="text-sm text-gray-600">
          Set specific price targets for automatic trade execution
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Order Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="orderType"
                value="buy"
                checked={formData.orderType === 'buy'}
                onChange={(e) => updateFormData('orderType', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Buy {formData.outputToken.symbol}</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="orderType"
                value="sell"
                checked={formData.orderType === 'sell'}
                onChange={(e) => updateFormData('orderType', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Sell {formData.inputToken.symbol}</span>
            </label>
          </div>
        </div>

        {/* Input Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {formData.orderType === 'buy' ? 'Pay with' : 'Sell'}
          </label>
          <TokenSelector
            selectedToken={formData.inputToken}
            onTokenSelect={(token) => updateFormData('inputToken', token)}
            tokens={tokens}
          />
        </div>

        {/* Input Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            placeholder="0.0"
            value={formData.inputAmount}
            onChange={(e) => updateFormData('inputAmount', e.target.value)}
            className="input w-full"
            required
          />
        </div>

        {/* Output Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {formData.orderType === 'buy' ? 'Buy' : 'Receive'}
          </label>
          <TokenSelector
            selectedToken={formData.outputToken}
            onTokenSelect={(token) => updateFormData('outputToken', token)}
            tokens={tokens}
          />
        </div>

        {/* Target Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Target Price</label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.0"
              value={formData.targetPrice}
              onChange={(e) => updateFormData('targetPrice', e.target.value)}
              className="input w-full pr-20"
              required
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
              {formData.outputToken.symbol}
            </span>
          </div>
        </div>

        {/* Expiry Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Expiry Date (Optional)</label>
          <input
            type="datetime-local"
            value={formData.expiryDate}
            onChange={(e) => updateFormData('expiryDate', e.target.value)}
            className="input w-full"
          />
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h4 className="font-medium text-gray-900">Order Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              {formData.orderType === 'buy' ? 'Buy' : 'Sell'} {formData.inputAmount} {formData.inputToken.symbol}
            </p>
            <p>
              {formData.orderType === 'buy' ? 'For' : 'To receive'} {formData.outputToken.symbol}
            </p>
            <p>Target Price: {formData.targetPrice} {formData.outputToken.symbol}</p>
            {formData.expiryDate && (
              <p>Expires: {new Date(formData.expiryDate).toLocaleString()}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!formData.inputAmount || !formData.targetPrice}
        >
          <Target className="w-4 h-4 mr-2" />
          Place Limit Order
        </button>
      </form>
    </div>
  );
}
