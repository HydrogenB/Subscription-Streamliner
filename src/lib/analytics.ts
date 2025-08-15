// Firebase Analytics service
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let analytics: any;

if (typeof window !== 'undefined') {
  const app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
}

// Track discount unlocked event
export const trackDiscountUnlocked = (savings: number, bundleId: string) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  logEvent(analytics, 'discount_unlocked', {
    newSavings: savings,
    bundleId,
    timestamp: new Date().toISOString(),
    // Add any additional context here
  });

  // Also track with gtag if it exists (for backward compatibility)
  if (window.gtag) {
    window.gtag('event', 'discount_unlocked', {
      newSavings: savings,
      bundleId,
      event_label: 'discount_achieved',
      value: savings,
    });
  }
};

// Track other events
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window === 'undefined' || !analytics) return;
  
  logEvent(analytics, eventName, {
    ...params,
    timestamp: new Date().toISOString(),
  });

  // Also track with gtag if it exists
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
};
