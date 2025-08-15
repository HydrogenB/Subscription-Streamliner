import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type ServiceCategory = 'streaming' | 'music' | 'gaming' | 'productivity' | 'education';

type Service = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  category: ServiceCategory;
  isSelected: boolean;
  popularity: number; // 1-10 scale
  seasonalDiscount?: number; // percentage
  bundleEligible: boolean;
  loyaltyMultiplier: number; // for returning customers
};

type UserProfile = {
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  subscriptionHistory: number; // months
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
  priority: number; // higher = more important
  seasonal?: {
    startDate: Date;
    endDate: Date;
    multiplier: number;
  };
};

type AdvancedDiscountEngineProps = {
  services: Service[];
  userProfile: UserProfile;
  promotionalRules: PromotionalRule[];
  className?: string;
  onServiceToggle?: (serviceId: string) => void;
  showAdvancedOptions?: boolean;
};

export function AdvancedDiscountEngine({
  services,
  userProfile,
  promotionalRules,
  className,
  onServiceToggle,
  showAdvancedOptions = false,
}: AdvancedDiscountEngineProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activePromotions, setActivePromotions] = useState<PromotionalRule[]>([]);

  // Update selected services when prop changes
  useEffect(() => {
    setSelectedServices(services.filter(s => s.isSelected).map(s => s.id));
  }, [services]);

  // Intelligent discount calculation engine
  const discountAnalysis = useMemo(() => {
    const selected = services.filter(s => s.isSelected);
    const totalOriginal = selected.reduce((sum, s) => sum + s.originalPrice, 0);
    const totalCurrent = selected.reduce((sum, s) => sum + s.price, 0);

    // Apply seasonal discounts
    const seasonalAdjusted = selected.map(service => ({
      ...service,
      seasonalPrice: service.seasonalDiscount 
        ? service.price * (1 - service.seasonalDiscount / 100)
        : service.price
    }));

    // Calculate loyalty benefits
    const loyaltyMultiplier = getUserLoyaltyMultiplier(userProfile.loyaltyTier);
    const loyaltyDiscount = totalCurrent * (loyaltyMultiplier - 1);

    // Apply promotional rules
    const applicablePromotions = promotionalRules
      .filter(rule => isPromotionApplicable(rule, selected, userProfile))
      .sort((a, b) => b.priority - a.priority);

    // Calculate promotional discounts
    let promotionalDiscount = 0;
    let appliedPromotions: PromotionalRule[] = [];

    for (const promotion of applicablePromotions) {
      const discount = calculatePromotionalDiscount(promotion, selected, totalCurrent);
      if (discount > 0) {
        promotionalDiscount += discount;
        appliedPromotions.push(promotion);
      }
    }

    // Bundle discounts
    const bundleDiscount = calculateBundleDiscount(selected, userProfile);

    // Total savings
    const totalSavings = (totalOriginal - totalCurrent) + loyaltyDiscount + promotionalDiscount + bundleDiscount;
    const finalPrice = Math.max(0, totalCurrent - promotionalDiscount - bundleDiscount - loyaltyDiscount);

    // ROI analysis
    const roi = selected.length > 0 ? (totalSavings / totalOriginal) * 100 : 0;

    return {
      selectedServices: selected,
      totalOriginal,
      totalCurrent,
      seasonalAdjusted,
      loyaltyDiscount,
      promotionalDiscount,
      bundleDiscount,
      totalSavings,
      finalPrice,
      roi,
      appliedPromotions,
      applicablePromotions,
      recommendations: generateRecommendations(selected, services, userProfile, promotionalRules),
    };
  }, [services, userProfile, promotionalRules]);

  // Generate intelligent recommendations
  const recommendations = useMemo(() => {
    const unselected = services.filter(s => !s.isSelected);
    const selected = services.filter(s => s.isSelected);

    return unselected.map(service => {
      const potentialSavings = calculatePotentialSavings(service, selected, userProfile, promotionalRules);
      const urgency = calculateUrgency(service, userProfile);
      
      return {
        service,
        potentialSavings,
        urgency,
        priority: (potentialSavings * 0.7) + (urgency * 0.3),
        reason: getRecommendationReason(service, selected, userProfile, promotionalRules),
      };
    }).sort((a, b) => b.priority - a.priority);
  }, [services, userProfile, promotionalRules]);

  // Dynamic pricing suggestions
  const pricingInsights = useMemo(() => {
    const insights = [];
    
    if (discountAnalysis.roi < 15) {
      insights.push({
        type: 'warning',
        message: 'คุณสามารถประหยัดได้มากขึ้นโดยเลือกบริการเพิ่มเติม',
        action: 'เพิ่มบริการเพื่อรับส่วนลดมากขึ้น',
      });
    }

    if (discountAnalysis.appliedPromotions.length === 0) {
      insights.push({
        type: 'info',
        message: 'คุณยังไม่ได้รับส่วนลดพิเศษ ลองเลือกบริการในหมวดหมู่ที่คุณชื่นชอบ',
        action: 'ดูหมวดหมู่ที่แนะนำ',
      });
    }

    if (userProfile.isNewCustomer) {
      insights.push({
        type: 'success',
        message: 'ยินดีต้อนรับ! คุณได้รับส่วนลดพิเศษสำหรับลูกค้าใหม่',
        action: 'ดูข้อเสนอพิเศษ',
      });
    }

    return insights;
  }, [discountAnalysis, userProfile]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Discount Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              สรุปค่าบริการรายเดือน
            </h2>
            <p className="text-gray-600">
              {userProfile.loyaltyTier !== 'bronze' && `ระดับ ${getLoyaltyTierName(userProfile.loyaltyTier)}`}
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-green-600 font-semibold text-sm mb-1">
              ประหยัดได้ {discountAnalysis.totalSavings.toFixed(0)} บาท
            </div>
            <div className="text-red-500 font-bold text-3xl">
              {discountAnalysis.finalPrice.toFixed(0)}
            </div>
            <div className="text-red-500 font-semibold text-sm">บาท</div>
          </div>
        </div>

        {/* Progress and Savings Visualization */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>ความคืบหน้า</span>
            <span>{selectedServices.length}/{services.length} บริการ</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${(selectedServices.length / services.length) * 100}%` }}
            />
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              ROI: {discountAnalysis.roi.toFixed(1)}% | ประหยัดได้ {discountAnalysis.totalSavings.toFixed(0)} บาท
            </span>
          </div>
        </div>

        {/* Applied Promotions */}
        {discountAnalysis.appliedPromotions.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">ส่วนลดที่ได้รับ</h3>
            <div className="space-y-2">
              {discountAnalysis.appliedPromotions.map((promotion) => (
                <div key={promotion.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <span className="font-medium text-green-800">{promotion.name}</span>
                    <p className="text-sm text-green-600">{promotion.description}</p>
                  </div>
                  <span className="text-green-600 font-semibold">
                    -{calculatePromotionalDiscount(promotion, discountAnalysis.selectedServices, discountAnalysis.totalCurrent).toFixed(0)} บาท
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Insights */}
        {pricingInsights.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">คำแนะนำ</h3>
            <div className="space-y-2">
              {pricingInsights.map((insight, index) => (
                <div 
                  key={index}
                  className={cn(
                    'p-3 rounded-lg border-l-4',
                    insight.type === 'warning' && 'bg-yellow-50 border-yellow-400',
                    insight.type === 'info' && 'bg-blue-50 border-blue-400',
                    insight.type === 'success' && 'bg-green-50 border-green-400'
                  )}
                >
                  <p className="text-sm text-gray-700">{insight.message}</p>
                  <button className="text-xs text-blue-600 hover:underline mt-1">
                    {insight.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Service Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">บริการที่แนะนำ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((rec) => (
              <div 
                key={rec.service.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => onServiceToggle?.(rec.service.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{rec.service.name}</h4>
                  <span className="text-sm text-gray-500">{rec.service.price} บาท</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-green-600">
                    ประหยัดได้ {rec.potentialSavings.toFixed(0)} บาท
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className={cn(
                          'w-2 h-2 rounded-full',
                          i < Math.ceil(rec.urgency) ? 'bg-yellow-400' : 'bg-gray-200'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Options */}
      {showAdvancedOptions && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">ตัวเลือกขั้นสูง</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">แสดงรายละเอียดส่วนลด</span>
              <button className="text-blue-600 hover:underline text-sm">ดูเพิ่มเติม</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">เปรียบเทียบราคา</span>
              <button className="text-blue-600 hover:underline text-sm">เปรียบเทียบ</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">ประวัติการสั่งซื้อ</span>
              <button className="text-blue-600 hover:underline text-sm">ดูประวัติ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility functions
function getUserLoyaltyMultiplier(tier: string): number {
  const multipliers = {
    bronze: 1.0,
    silver: 1.05,
    gold: 1.1,
    platinum: 1.15,
  };
  return multipliers[tier as keyof typeof multipliers] || 1.0;
}

function getLoyaltyTierName(tier: string): string {
  const names = {
    bronze: 'บรอนซ์',
    silver: 'ซิลเวอร์',
    gold: 'โกลด์',
    platinum: 'แพลทินัม',
  };
  return names[tier as keyof typeof names] || tier;
}

function isPromotionApplicable(
  rule: PromotionalRule, 
  services: Service[], 
  userProfile: UserProfile
): boolean {
  if (services.length < rule.conditions.minServices) return false;
  if (services.length > rule.conditions.maxServices) return false;
  
  const total = services.reduce((sum, s) => sum + s.price, 0);
  if (total < rule.conditions.minTotal) return false;
  
  if (rule.conditions.categories && 
      !services.some(s => rule.conditions.categories!.includes(s.category))) {
    return false;
  }
  
  if (rule.conditions.loyaltyTier && 
      !rule.conditions.loyaltyTier.includes(userProfile.loyaltyTier)) {
    return false;
  }
  
  if (rule.seasonal) {
    const now = new Date();
    if (now < rule.seasonal.startDate || now > rule.seasonal.endDate) return false;
  }
  
  return true;
}

function calculatePromotionalDiscount(
  rule: PromotionalRule, 
  services: Service[], 
  total: number
): number {
  if (rule.discount.type === 'percentage') {
    const discount = total * (rule.discount.value as number / 100);
    return rule.discount.maxAmount ? Math.min(discount, rule.discount.maxAmount) : discount;
  }
  
  if (rule.discount.type === 'fixed') {
    return rule.discount.value as number;
  }
  
  if (rule.discount.type === 'tiered') {
    const values = rule.discount.value as number[];
    const serviceCount = services.length;
    if (serviceCount <= values.length) {
      return values[serviceCount - 1];
    }
    return values[values.length - 1];
  }
  
  return 0;
}

function calculateBundleDiscount(services: Service[], userProfile: UserProfile): number {
  const streamingServices = services.filter(s => s.category === 'streaming');
  const musicServices = services.filter(s => s.category === 'music');
  
  let bundleDiscount = 0;
  
  // Streaming bundle discount
  if (streamingServices.length >= 3) {
    bundleDiscount += streamingServices.reduce((sum, s) => sum + s.price, 0) * 0.1;
  }
  
  // Music bundle discount
  if (musicServices.length >= 2) {
    bundleDiscount += musicServices.reduce((sum, s) => sum + s.price, 0) * 0.15;
  }
  
  // Loyalty bonus
  if (userProfile.loyaltyTier === 'platinum' && services.length >= 4) {
    bundleDiscount += 50; // Fixed bonus for platinum users
  }
  
  return bundleDiscount;
}

function calculatePotentialSavings(
  service: Service, 
  selectedServices: Service[], 
  userProfile: UserProfile, 
  promotionalRules: PromotionalRule[]
): number {
  const potentialServices = [...selectedServices, service];
  const potentialTotal = potentialServices.reduce((sum, s) => sum + s.price, 0);
  
  // Find applicable promotions
  const applicablePromotions = promotionalRules
    .filter(rule => isPromotionApplicable(rule, potentialServices, userProfile))
    .sort((a, b) => b.priority - a.priority);
  
  let potentialDiscount = 0;
  for (const promotion of applicablePromotions) {
    potentialDiscount += calculatePromotionalDiscount(promotion, potentialServices, potentialTotal);
  }
  
  return potentialDiscount;
}

function calculateUrgency(service: Service, userProfile: UserProfile): number {
  let urgency = 5; // Base urgency
  
  // Popularity factor
  urgency += service.popularity * 0.3;
  
  // Seasonal factor
  if (service.seasonalDiscount) {
    urgency += 2;
  }
  
  // User preference factor
  if (userProfile.preferredCategories.includes(service.category)) {
    urgency += 1;
  }
  
  // New customer factor
  if (userProfile.isNewCustomer) {
    urgency += 1;
  }
  
  return Math.min(urgency, 10);
}

function generateRecommendations(
  selectedServices: Service[], 
  allServices: Service[], 
  userProfile: UserProfile, 
  promotionalRules: PromotionalRule[]
): string[] {
  const recommendations = [];
  
  if (selectedServices.length === 0) {
    recommendations.push('เริ่มต้นด้วยบริการที่คุณชื่นชอบเพื่อรับส่วนลดแรก');
  }
  
  if (selectedServices.length === 1) {
    recommendations.push('เพิ่มบริการอีก 1 รายการเพื่อรับส่วนลด 10%');
  }
  
  if (selectedServices.length === 2) {
    recommendations.push('เพิ่มบริการอีก 1 รายการเพื่อรับส่วนลด 15%');
  }
  
  if (selectedServices.length === 3) {
    recommendations.push('เพิ่มบริการอีก 1 รายการเพื่อรับส่วนลดสูงสุด 25%');
  }
  
  // Category-specific recommendations
  const categories = selectedServices.map(s => s.category);
  const unselectedCategories = allServices
    .filter(s => !s.isSelected && !categories.includes(s.category))
    .map(s => s.category);
  
  if (unselectedCategories.length > 0) {
    recommendations.push(`ลองบริการในหมวดหมู่ ${unselectedCategories.slice(0, 2).join(', ')}`);
  }
  
  return recommendations;
}

function getRecommendationReason(
  service: Service, 
  selectedServices: Service[], 
  userProfile: UserProfile, 
  promotionalRules: PromotionalRule[]
): string {
  if (userProfile.preferredCategories.includes(service.category)) {
    return 'ตรงกับหมวดหมู่ที่คุณชื่นชอบ';
  }
  
  if (service.seasonalDiscount) {
    return `ส่วนลดพิเศษ ${service.seasonalDiscount}%`;
  }
  
  if (service.popularity >= 8) {
    return 'บริการยอดนิยม';
  }
  
  const potentialServices = [...selectedServices, service];
  if (potentialServices.length >= 4) {
    return 'ช่วยให้คุณได้รับส่วนลดสูงสุด';
  }
  
  return 'เพิ่มมูลค่าให้กับแพ็กเกจของคุณ';
}
