'use client';

import { useState } from 'react';
import { ServiceCard } from '@/components/subscriptions/ServiceCard';

type Service = {
  id: string;
  name: string;
  logo: string;
  logoBgColor: string;
  incrementalPrice: number;
  originalPrice: number;
  isAdded: boolean;
};

export default function ServiceCardsDemoPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 'viu',
      name: 'VIU',
      logo: 'viu',
      logoBgColor: 'bg-yellow-500',
      incrementalPrice: 90,
      originalPrice: 89,
      isAdded: false,
    },
    {
      id: 'wetv',
      name: 'WeTV',
      logo: 'WeTV',
      logoBgColor: 'bg-gradient-to-r from-blue-500 to-green-500',
      incrementalPrice: 59,
      originalPrice: 59,
      isAdded: false,
    },
    {
      id: 'netflix',
      name: 'Netflix',
      logo: 'N',
      logoBgColor: 'bg-red-600',
      incrementalPrice: 419,
      originalPrice: 419,
      isAdded: false,
    },
    {
      id: 'youtube',
      name: 'YouTube Premium',
      logo: 'YT',
      logoBgColor: 'bg-red-500',
      incrementalPrice: 119,
      originalPrice: 119,
      isAdded: false,
    },
    {
      id: 'spotify',
      name: 'Spotify Premium',
      logo: 'S',
      logoBgColor: 'bg-green-500',
      incrementalPrice: 129,
      originalPrice: 129,
      isAdded: false,
    },
    {
      id: 'disney',
      name: 'Disney+',
      logo: 'D',
      logoBgColor: 'bg-blue-600',
      incrementalPrice: 279,
      originalPrice: 279,
      isAdded: false,
    },
  ]);

  const handleToggleService = (serviceId: string) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, isAdded: !service.isAdded }
          : service
      )
    );
  };

  const resetAll = () => {
    setServices(prev => prev.map(service => ({ ...service, isAdded: false })));
  };

  const addAll = () => {
    setServices(prev => prev.map(service => ({ ...service, isAdded: true })));
  };

  const addedCount = services.filter(s => s.isAdded).length;
  const totalIncremental = services
    .filter(s => s.isAdded)
    .reduce((sum, s) => sum + s.incrementalPrice, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Service Cards Demo
          </h1>
          <p className="text-gray-600">
            Click on services to add/remove them. Prices are hidden when services are added.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800">{addedCount}</div>
              <div className="text-gray-600">Services Added</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">+{totalIncremental}</div>
              <div className="text-gray-600">Total Incremental</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{services.length}</div>
              <div className="text-gray-600">Total Available</div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={resetAll}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={addAll}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add All
            </button>
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              name={service.name}
              logo={service.logo}
              logoBgColor={service.logoBgColor}
              incrementalPrice={service.incrementalPrice}
              originalPrice={service.originalPrice}
              isAdded={service.isAdded}
              onToggle={handleToggleService}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">How it works:</h3>
          <ul className="text-blue-700 space-y-2">
            <li>• <strong>When NOT added:</strong> Shows incremental price (+X THB) and original price (struck-through)</li>
            <li>• <strong>When ADDED:</strong> Hides all price information and shows "Added" button with checkmark</li>
            <li>• <strong>Click any card</strong> to toggle between added/not added states</li>
            <li>• <strong>Visual feedback:</strong> Added services have red borders and shadows</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
