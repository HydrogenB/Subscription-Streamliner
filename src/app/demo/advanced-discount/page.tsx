'use client';

import { useState, useMemo } from 'react';
import { AdvancedDiscountEngine } from '@/components/subscriptions/AdvancedDiscountEngine';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ServiceCategory = 'streaming' | 'music' | 'gaming' | 'productivity' | 'education';

type Service = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  category: ServiceCategory;
  isSelected: boolean;
  popularity: number;
  seasonalDiscount?: number;
  bundleEligible: boolean;
  loyaltyMultiplier: number;
};

type UserProfile = {
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  subscriptionHistory: number;
  totalSpent: number;
  preferredCategories: ServiceCategory[];
  isNewCustomer: boolean;
  lastPurchaseDate: Date;
};

type PromotionalRule = {
  id: string;
  name: string;
  description: string;
  conditions: {
    minServices: number;
    maxServices: number;
    minTotal: number;
    categories?: ServiceCategory[];
    loyaltyTier?: string[];
  };
  discount: {
    type: 'percentage' | 'fixed' | 'tiered';
    value: number | number[];
    maxAmount?: number;
  };
  priority: number;
  seasonal?: {
    startDate: Date;
    endDate: Date;
    multiplier: number;
  };
};

export default function AdvancedDiscountDemoPage() {
  // Sample services with intelligent data
  const [services, setServices] = useState<Service[]>([
    {
      id: 'netflix',
      name: 'Netflix Premium',
      price: 419,
      originalPrice: 419,
      category: 'streaming',
      isSelected: false,
      popularity: 9,
      seasonalDiscount: undefined,
      bundleEligible: true,
      loyaltyMultiplier: 1.0,
    },
    {
      id: 'youtube',
      name: 'YouTube Premium',
      price: 119,
      originalPrice: 119,
      category: 'streaming',
      isSelected: false,
      popularity: 8,
      seasonalDiscount: 10, // 10% seasonal discount
      bundleEligible: true,
      loyaltyMultiplier: 1.0,
    },
    {
      id: 'spotify',
      name: 'Spotify Premium',
      price: 129,
      originalPrice: 129,
      category: 'music',
      isSelected: false,
      popularity: 9,
      seasonalDiscount: undefined,
      bundleEligible: true,
      loyaltyMultiplier: 1.0,
    },
    {
      id: 'disney',
      name: 'Disney+',
      price: 279,
      originalPrice: 279,
      category: 'streaming',
      isSelected: false,
      popularity: 7,
      seasonalDiscount: 15, // 15% seasonal discount
      bundleEligible: true,
      loyaltyMultiplier: 1.0,
    },
    {
      id: 'hbo',
      name: 'HBO Max',
      price: 199,
      originalPrice: 199,
      category: 'streaming',
      isSelected: false,
      popularity: 6,
      seasonalDiscount: undefined,
      bundleEligible: true,
      loyaltyMultiplier: 1.0,
    },
    {
      id: 'apple-music',
      name: 'Apple Music',
      price: 149,
      originalPrice: 149,
      category: 'music',
      isSelected: false,
      popularity: 7,
      seasonalDiscount: undefined,
      bundleEligible: true,
      loyaltyMultiplier: 1.0,
    },
    {
      id: 'xbox-gamepass',
      name: 'Xbox Game Pass',
      price: 199,
      originalPrice: 199,
      category: 'gaming',
      isSelected: false,
      popularity: 8,
      seasonalDiscount: 20, // 20% seasonal discount
      bundleEligible: false,
      loyaltyMultiplier: 1.0,
    },
    {
      id: 'notion',
      name: 'Notion Premium',
      price: 89,
      originalPrice: 89,
      category: 'productivity',
      isSelected: false,
      popularity: 6,
      seasonalDiscount: undefined,
      bundleEligible: false,
      loyaltyMultiplier: 1.0,
    },
  ]);

  // Sample user profiles
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>({
    loyaltyTier: 'gold',
    subscriptionHistory: 18,
    totalSpent: 8500,
    preferredCategories: ['streaming', 'music'],
    isNewCustomer: false,
    lastPurchaseDate: new Date('2024-01-15'),
  });

  // Sample promotional rules
  const promotionalRules: PromotionalRule[] = [
    {
      id: 'new-customer',
      name: 'ส่วนลดลูกค้าใหม่',
      description: 'ส่วนลดพิเศษ 20% สำหรับลูกค้าใหม่',
      conditions: {
        minServices: 1,
        maxServices: 3,
        minTotal: 100,
        loyaltyTier: ['bronze'],
      },
      discount: {
        type: 'percentage',
        value: 20,
        maxAmount: 200,
      },
      priority: 100,
    },
    {
      id: 'streaming-bundle',
      name: 'แพ็กเกจสตรีมมิ่ง',
      description: 'ส่วนลด 15% เมื่อเลือกบริการสตรีมมิ่ง 3+ รายการ',
      conditions: {
        minServices: 3,
        maxServices: 6,
        minTotal: 500,
        categories: ['streaming'],
      },
      discount: {
        type: 'percentage',
        value: 15,
        maxAmount: 300,
      },
      priority: 80,
    },
    {
      id: 'music-bundle',
      name: 'แพ็กเกจเพลง',
      description: 'ส่วนลด 20% เมื่อเลือกบริการเพลง 2+ รายการ',
      conditions: {
        minServices: 2,
        maxServices: 4,
        minTotal: 200,
        categories: ['music'],
      },
      discount: {
        type: 'percentage',
        value: 20,
        maxAmount: 150,
      },
      priority: 70,
    },
    {
      id: 'loyalty-gold',
      name: 'ส่วนลดลูกค้าประจำ',
      description: 'ส่วนลดเพิ่มเติม 5% สำหรับลูกค้า Gold',
      conditions: {
        minServices: 2,
        maxServices: 8,
        minTotal: 300,
        loyaltyTier: ['gold', 'platinum'],
      },
      discount: {
        type: 'percentage',
        value: 5,
        maxAmount: 100,
      },
      priority: 60,
    },
    {
      id: 'seasonal-summer',
      name: 'ส่วนลดฤดูร้อน',
      description: 'ส่วนลดพิเศษ 10% สำหรับบริการที่เลือก',
      conditions: {
        minServices: 1,
        maxServices: 8,
        minTotal: 100,
      },
      discount: {
        type: 'percentage',
        value: 10,
        maxAmount: 250,
      },
      priority: 50,
      seasonal: {
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        multiplier: 1.2,
      },
    },
  ];

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

  const selectPopularServices = () => {
    setServices(prev => 
      prev.map(service => ({
        ...service, 
        isSelected: service.popularity >= 8
      }))
    );
  };

  const selectStreamingBundle = () => {
    setServices(prev => 
      prev.map(service => ({
        ...service, 
        isSelected: service.category === 'streaming' && service.popularity >= 7
      }))
    );
  };

  const selectMusicBundle = () => {
    setServices(prev => 
      prev.map(service => ({
        ...service, 
        isSelected: service.category === 'music'
      }))
    );
  };

  const changeUserProfile = (tier: 'bronze' | 'silver' | 'gold' | 'platinum') => {
    setCurrentUserProfile(prev => ({
      ...prev,
      loyaltyTier: tier,
      isNewCustomer: tier === 'bronze',
    }));
  };

  // Calculate current totals for display
  const currentTotals = useMemo(() => {
    const selected = services.filter(s => s.isSelected);
    const totalOriginal = selected.reduce((sum, s) => sum + s.originalPrice, 0);
    const totalCurrent = selected.reduce((sum, s) => sum + s.price, 0);
    
    return {
      selectedCount: selected.length,
      totalOriginal,
      totalCurrent,
      savings: totalOriginal - totalCurrent,
    };
  }, [services]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Advanced Discount Engine Demo
          </h1>
          <p className="text-gray-300 text-lg">
            Intelligent pricing with dynamic discounts, loyalty tiers, and AI-powered recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content - Advanced Discount Engine */}
          <div className="xl:col-span-2">
            <AdvancedDiscountEngine
              services={services}
              userProfile={currentUserProfile}
              promotionalRules={promotionalRules}
              onServiceToggle={handleServiceToggle}
              showAdvancedOptions={true}
            />
          </div>

          {/* Right Sidebar - Controls and Analytics */}
          <div className="space-y-6">
            {/* User Profile Controls */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">User Profile</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Loyalty Tier:</span>
                  <span className="text-white font-semibold capitalize">{currentUserProfile.loyaltyTier}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">History:</span>
                  <span className="text-white">{currentUserProfile.subscriptionHistory} months</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Spent:</span>
                  <span className="text-white">{currentUserProfile.totalSpent.toLocaleString()} บาท</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    currentUserProfile.isNewCustomer 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white'
                  )}>
                    {currentUserProfile.isNewCustomer ? 'New Customer' : 'Returning Customer'}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <h4 className="text-white font-semibold mb-2">Change Tier:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {(['bronze', 'silver', 'gold', 'platinum'] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => changeUserProfile(tier)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        currentUserProfile.loyaltyTier === tier
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      )}
                    >
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={selectPopularServices}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Select Popular (8+ Rating)
                </Button>
                <Button 
                  onClick={selectStreamingBundle}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Select Streaming Bundle
                </Button>
                <Button 
                  onClick={selectMusicBundle}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Select Music Bundle
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

            {/* Current Selection Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Current Selection</h3>
              <div className="space-y-3 text-white">
                <div className="flex justify-between">
                  <span>Selected:</span>
                  <span className="font-semibold">{currentTotals.selectedCount}/8</span>
                </div>
                <div className="flex justify-between">
                  <span>Original Total:</span>
                  <span className="font-semibold">{currentTotals.totalOriginal} บาท</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Total:</span>
                  <span className="font-semibold">{currentTotals.totalCurrent} บาท</span>
                </div>
                <div className="flex justify-between text-green-400 pt-2 border-t border-white/20">
                  <span>Immediate Savings:</span>
                  <span className="font-semibold">{currentTotals.savings} บาท</span>
                </div>
              </div>
            </div>

            {/* Promotional Rules Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Active Promotions</h3>
              <div className="space-y-3">
                {promotionalRules.map((rule) => (
                  <div key={rule.id} className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-white font-medium text-sm mb-1">{rule.name}</h4>
                    <p className="text-gray-300 text-xs mb-2">{rule.description}</p>
                    <div className="text-xs text-gray-400">
                      Min: {rule.conditions.minServices} services, 
                      Min Total: {rule.conditions.minTotal} บาท
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Service Grid */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6">Available Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div 
                key={service.id}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer group',
                  service.isSelected 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                )}
                onClick={() => handleServiceToggle(service.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white capitalize">
                    {service.category}
                  </span>
                  {service.seasonalDiscount && (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white">
                      -{service.seasonalDiscount}%
                    </span>
                  )}
                </div>
                
                <h4 className="font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                  {service.name}
                </h4>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">{service.price} บาท</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className={cn(
                          'w-2 h-2 rounded-full',
                          i < Math.ceil(service.popularity / 2) ? 'bg-yellow-400' : 'bg-gray-600'
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Popularity: {service.popularity}/10
                  </span>
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
