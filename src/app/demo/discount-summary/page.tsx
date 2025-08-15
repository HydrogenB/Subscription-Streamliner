'use client';

import { useState, useMemo } from 'react';
import { DiscountSummaryCard } from '@/components/subscriptions/DiscountSummaryCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Service = {
  id: string;
  name: string;
  price: number;
  isSelected: boolean;
};

export default function DiscountSummaryDemoPage() {
  const [services, setServices] = useState<Service[]>([
    { id: 'youtube', name: 'Youtube Premium', price: 119, isSelected: false },
    { id: 'netflix', name: 'Netflix', price: 419, isSelected: false },
    { id: 'spotify', name: 'Spotify Premium', price: 129, isSelected: false },
    { id: 'disney', name: 'Disney+', price: 279, isSelected: false },
    { id: 'hbo', name: 'HBO Max', price: 199, isSelected: false },
    { id: 'apple', name: 'Apple TV+', price: 149, isSelected: false },
  ]);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Calculate totals for display
  const totals = useMemo(() => {
    const selected = services.filter(s => s.isSelected);
    const totalOriginal = selected.reduce((sum, s) => sum + s.price, 0);
    
    let discountPercentage = 0;
    if (selected.length >= 2) discountPercentage = 0.1;
    if (selected.length >= 3) discountPercentage = 0.15;
    if (selected.length >= 4) discountPercentage = 0.25;
    
    const discount = Math.min(Math.round(totalOriginal * discountPercentage), 497);
    const finalPrice = totalOriginal - discount;
    
    return {
      totalOriginal,
      discount,
      finalPrice,
      discountPercentage: discountPercentage * 100,
      servicesCount: selected.length,
    };
  }, [services]);

  const handleServiceToggle = (serviceId: string) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, isSelected: !service.isSelected }
          : service
      )
    );
  };

  const resetSelection = () => {
    setServices(prev => prev.map(service => ({ ...service, isSelected: false })));
  };

  const selectAll = () => {
    setServices(prev => prev.map(service => ({ ...service, isSelected: true })));
  };

  const selectRecommended = () => {
    setServices(prev => 
      prev.map(service => ({
        ...service, 
        isSelected: ['youtube', 'netflix', 'spotify', 'disney'].includes(service.id)
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Intelligent Discount Summary
          </h1>
          <p className="text-gray-300 text-lg">
            Smart pricing logic with dynamic discounts and real-time calculations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Discount Summary Card */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Discount Summary</h2>
            <DiscountSummaryCard
              services={services}
              maxServicesForDiscount={4}
              maxDiscountAmount={497}
              onServiceToggle={handleServiceToggle}
              className="w-full"
            />
          </div>

          {/* Right Column - Controls and Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={selectRecommended}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Select Recommended (4 Apps)
                </Button>
                <Button 
                  onClick={selectAll}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Select All Services
                </Button>
                <Button 
                  onClick={resetSelection}
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                >
                  Reset Selection
                </Button>
              </div>
            </div>

            {/* Real-time Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Real-time Statistics</h3>
              <div className="space-y-3 text-white">
                <div className="flex justify-between">
                  <span>Selected Services:</span>
                  <span className="font-semibold">{totals.servicesCount}/6</span>
                </div>
                <div className="flex justify-between">
                  <span>Original Total:</span>
                  <span className="font-semibold">{totals.totalOriginal} บาท</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Discount ({totals.discountPercentage}%):</span>
                  <span className="font-semibold">-{totals.discount} บาท</span>
                </div>
                <div className="flex justify-between text-red-400 text-lg font-bold pt-2 border-t border-white/20">
                  <span>Final Price:</span>
                  <span>{totals.finalPrice} บาท</span>
                </div>
              </div>
            </div>

            {/* Discount Tiers */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Discount Tiers</h3>
              <div className="space-y-3 text-white">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-3" />
                    <span>2+ Services</span>
                  </div>
                  <span className="text-green-400 font-semibold">10% Off</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3" />
                    <span>3+ Services</span>
                  </div>
                  <span className="text-green-400 font-semibold">15% Off</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-3" />
                    <span>4+ Services</span>
                  </div>
                  <span className="text-green-400 font-semibold">25% Off</span>
                </div>
                <div className="text-center text-sm text-gray-300 mt-3">
                  Maximum discount: 497 บาท
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service List */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Available Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div 
                key={service.id}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer',
                  service.isSelected 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                )}
                onClick={() => handleServiceToggle(service.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{service.name}</h4>
                    <p className="text-gray-300 text-sm">{service.price} บาท/เดือน</p>
                  </div>
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    service.isSelected 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-white/40'
                  )}>
                    {service.isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
