'use client';

import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react';

export function Stats() {
  const stats = [
    {
      icon: DollarSign,
      value: '$350M+',
      label: 'Volume',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      icon: Users,
      value: '875K+',
      label: 'Unique Users',
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      icon: Zap,
      value: '2.05M+',
      label: 'Total Trades',
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
    {
      icon: TrendingUp,
      value: '99.9%',
      label: 'Uptime',
      color: 'text-error-600',
      bgColor: 'bg-error-100',
    },
  ];

  return (
    <section className="mb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor} mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-secondary-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-secondary-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
