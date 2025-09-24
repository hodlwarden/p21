'use client';

import { TrendingUp, Layers, Zap, Shield, Clock, Code } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Best Price Execution',
      description: 'Fibrous scans all DEXs and liquidity pools to configure the optimal route for the intended trade, providing you with the best possible swap execution.',
    },
    {
      icon: Layers,
      title: 'Multi Token Swaps',
      description: 'Fibrous allows users to swap multiple input and output tokens in a single, top-rated transaction. This makes it easier to manage your DeFi portfolio and reduces your need for transactions.',
    },
    {
      icon: Zap,
      title: 'Fast & Secure Transactions',
      description: 'Fibrous presents complex swap routes to you in a reliable and transparent manner with a single interaction. Its algorithm technology is customized to deliver large-scale transactions in the fastest and most secure way possible.',
    },
    {
      icon: Clock,
      title: 'Limit Orders',
      description: 'Set and Forget! With its Limit Order protocol, Fibrous offers the most optimal trading at desired prices in a safe and permissionless way.',
    },
    {
      icon: Shield,
      title: 'Flash Accounting',
      description: 'No matter how complex your trade execution becomes, Fibrous technology ensures that your transaction fees remain low by recursively optimizing each new step.',
    },
    {
      icon: Code,
      title: 'API',
      description: 'With Public and Business APIs, you can explore Fibrous\' aggregation technology on any interface you desire.',
    },
  ];

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">
          Advanced Features
        </h2>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Powerful tools and innovative features to enhance your DeFi trading experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="card">
            <div className="card-content">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-secondary-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
