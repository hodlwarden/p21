'use client';

import { ArrowRight, Zap, Layers, Target, Shield, Cpu, Code } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: 'Best Price Execution',
      description: 'Fibrous scans all DEXs and liquidity pools to configure the optimal route for the intended trade, providing you with the best possible swap execution.',
    },
    {
      icon: Layers,
      title: 'Multi Token Swaps',
      description: 'Fibrous allows users to swap multiple input and output tokens in a single, top-rated transaction. This makes it easier to manage your DeFi portfolio.',
    },
    {
      icon: Shield,
      title: 'Fast & Secure Transactions',
      description: 'Fibrous presents complex swap routes to you in a reliable and transparent manner with a single interaction.',
    },
    {
      icon: Target,
      title: 'Limit Orders',
      description: 'Set and Forget! With its Limit Order protocol, Fibrous offers the most optimal trading at desired prices in a safe and permissionless way.',
    },
    {
      icon: Cpu,
      title: 'Flash Accounting',
      description: 'No matter how complex your trade execution becomes, Fibrous technology ensures that your transaction fees remain low by recursively optimizing each new step.',
    },
    {
      icon: Code,
      title: 'API',
      description: 'With Public and Business APIs, you can explore Fibrous\' aggregation technology on any interface you desire.',
    },
  ];

  const stats = [
    { value: '$350M+', label: 'Volume' },
    { value: '875K+', label: 'Unique Users' },
    { value: '2.05M+', label: 'Total Trade' },
  ];

  const partners = [
    'Starknet', 'Scroll', 'Nethermind', 'Ekubo', 'Haiko', 'Alchemy',
    'GoPlus', 'Nostra', 'OpenOcean', 'SyncSwap', 'Base', 'HyperEVM', 'Citrea'
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-100">Fibrous</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-400 hover:text-gray-100">Features</a>
              <a href="#stats" className="text-gray-400 hover:text-gray-100">Stats</a>
              <a href="#partners" className="text-gray-400 hover:text-gray-100">Partners</a>
            </nav>
            <Link href="/app" className="btn btn-primary">
              Launch App
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold text-gray-100 mb-6">
            JUST SWAP WITH{' '}
            <span className="text-blue-400">THE BEST RATES</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Fibrous delivers the best trade execution with advanced aggregation, 
            innovative features, and low fees—powering seamless DeFi trading on its interface and APIs.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/app" className="btn btn-primary btn-lg">
              Launch App
            </Link>
            <button className="btn btn-outline btn-lg">
              Get More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Statistics</h2>
            <p className="text-gray-600">Trusted by thousands of users worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Integrations & Ecosystem Partners
            </h2>
            <p className="text-gray-600">
              Elevate your institutional trading with Fibrous. Enhance your swap environment by integrating with our API.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {partners.map((partner, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
                <span className="text-gray-700 font-medium">{partner}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Contact us to explore your enterprise API requirements and discover our solutions.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="btn btn-primary">Get Started</button>
              <button className="btn btn-outline">Contact Us</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-bold">Fibrous</span>
              </div>
              <p className="text-gray-400">
                Advanced DEX aggregator with AI-powered trading features.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Brand Assets</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Tutorials</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms and Conditions</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Fibrous. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
