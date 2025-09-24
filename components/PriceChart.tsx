'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceChartProps {
  tokenPair?: string;
  height?: number;
}

export function PriceChart({ tokenPair = 'ETH/USDC', height = 256 }: PriceChartProps) {
  const [priceData, setPriceData] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  // Mock price data generation
  useEffect(() => {
    const generateMockData = () => {
      const basePrice = 2000; // Base price for ETH
      const data = [];
      let currentPrice = basePrice;
      
      for (let i = 0; i < 24; i++) {
        // Generate random price movement
        const change = (Math.random() - 0.5) * 100;
        currentPrice += change;
        data.push(Math.max(currentPrice, 100)); // Ensure price doesn't go below $100
      }
      
      setPriceData(data);
      setCurrentPrice(data[data.length - 1]);
      setPriceChange(data[data.length - 1] - data[0]);
    };

    generateMockData();
    
    // Update price every 30 seconds
    const interval = setInterval(generateMockData, 30000);
    return () => clearInterval(interval);
  }, []);

  const minPrice = Math.min(...priceData);
  const maxPrice = Math.max(...priceData);
  const priceRange = maxPrice - minPrice;

  const getYPosition = (price: number) => {
    return ((maxPrice - price) / priceRange) * (height - 40) + 20;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{tokenPair}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(currentPrice)}
            </span>
            <span className={`text-sm flex items-center ${
              priceChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {priceChange >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {formatChange(priceChange)}
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          24h
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          width="100%"
          height={height}
          className="overflow-visible"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              y1={ratio * (height - 40) + 20}
              x2="100%"
              y2={ratio * (height - 40) + 20}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          {/* Price line */}
          {priceData.length > 1 && (
            <polyline
              fill="none"
              stroke={priceChange >= 0 ? "#10b981" : "#ef4444"}
              strokeWidth="2"
              points={priceData.map((price, index) => {
                const x = (index / (priceData.length - 1)) * 100;
                const y = getYPosition(price);
                return `${x},${y}`;
              }).join(' ')}
            />
          )}

          {/* Price area fill */}
          {priceData.length > 1 && (
            <polygon
              fill={priceChange >= 0 ? "url(#greenGradient)" : "url(#redGradient)"}
              fillOpacity="0.1"
              points={`0,${height - 20} ${priceData.map((price, index) => {
                const x = (index / (priceData.length - 1)) * 100;
                const y = getYPosition(price);
                return `${x},${y}`;
              }).join(' ')} ${100},${height - 20}`}
            />
          )}

          {/* Gradients */}
          <defs>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Price labels */}
        <div className="absolute left-0 top-0 text-xs text-gray-500">
          {formatPrice(maxPrice)}
        </div>
        <div className="absolute left-0 bottom-0 text-xs text-gray-500">
          {formatPrice(minPrice)}
        </div>
      </div>

      {/* Time labels */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>
    </div>
  );
}
