'use client';

import { useState } from 'react';
import { MonthlySummaryBottomSheet } from '@/components/subscriptions/MonthlySummaryBottomSheet';
import { Button } from '@/components/ui/button';

export default function MonthlySummaryDemoPage() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-4">
            Monthly Summary
          </h1>
          <p className="text-gray-300 mb-6">
            Bottom Sheet Component Demo
          </p>
          
          <Button 
            onClick={() => setIsBottomSheetOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Open Bottom Sheet
          </Button>
        </div>
        
        <div className="text-gray-400 text-sm space-y-2">
          <p>• Click the button above to open the bottom sheet</p>
          <p>• Tap outside or the chevron to close</p>
          <p>• Fully responsive mobile-first design</p>
        </div>
        
        <MonthlySummaryBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
        />
      </div>
    </div>
  );
}
