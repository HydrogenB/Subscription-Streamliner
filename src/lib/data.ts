import { NetflixIcon } from "@/components/icons/netflix-icon";
import { SpotifyIcon } from "@/components/icons/spotify-icon";
import { DisneyPlusIcon } from "@/components/icons/disney-plus-icon";
import type { SubscriptionService } from "@/lib/types";

export const subscriptionServices: SubscriptionService[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    logo: NetflixIcon,
    description: 'Watch TV shows, movies, and more on-demand.',
    plans: [
      { id: 'n-basic', name: 'Basic with Ads', price: 6.99, features: ['720p', 'Some ads', 'Limited library'] },
      { id: 'n-standard', name: 'Standard', price: 15.49, features: ['1080p', 'No ads', 'Full library', '2 screens'] },
      { id: 'n-premium', name: 'Premium', price: 22.99, features: ['4K+HDR', 'No ads', 'Full library', '4 screens', 'Spatial audio'] },
    ],
    addons: [],
    promotion: 'Save 10% on annual plan'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    logo: SpotifyIcon,
    description: 'Music for everyone. Millions of songs and podcasts.',
    plans: [
      { id: 's-free', name: 'Free', price: 0.00, features: ['Ads', 'Shuffle play'] },
      { id: 's-premium', name: 'Premium', price: 10.99, features: ['No ads', 'Listen offline', 'On-demand playback'] },
      { id: 's-family', name: 'Family', price: 16.99, features: ['6 accounts', 'Block explicit music', 'Spotify Kids'] },
    ],
    addons: [
      { id: 'sa-audiobooks', name: 'Audiobooks Access', price: 9.99, description: 'Access to a library of over 150,000 audiobooks.' },
    ],
  },
  {
    id: 'disneyplus',
    name: 'Disney+',
    logo: DisneyPlusIcon,
    description: 'The best stories in the world, all in one place.',
    plans: [
      { id: 'd-basic', name: 'Basic with Ads', price: 7.99, features: ['With Ads', 'Stereo sound'] },
      { id: 'd-premium', name: 'Premium', price: 13.99, features: ['No Ads*', 'Dolby Atmos', '4K UHD & HDR'] },
    ],
    addons: [
      { id: 'da-hulu', name: 'Hulu (With Ads)', price: 2.00, description: 'Add Hulu to your Disney+ plan.' },
      { id: 'da-espn', name: 'ESPN+ (With Ads)', price: 10.99, description: 'Live sports and exclusive originals.' },
    ],
    promotion: 'Bundle with Hulu and save!'
  },
];

export const userSubscriptions = [
    {
      id: 'sub1',
      serviceName: 'Spotify Premium',
      status: 'Active',
      renewalDate: '2024-08-15',
      price: 10.99,
    },
    {
      id: 'sub2',
      serviceName: 'Netflix Standard',
      status: 'Active',
      renewalDate: '2024-08-22',
      price: 15.49,
    },
];

export const billingHistory = [
    {
      id: 'bill1',
      date: '2024-07-15',
      description: 'Spotify Premium',
      amount: 10.99,
    },
    {
      id: 'bill2',
      date: '2024-07-22',
      description: 'Netflix Standard',
      amount: 15.49,
    },
    {
      id: 'bill3',
      date: '2024-06-15',
      description: 'Spotify Premium',
      amount: 10.99,
    },
    {
      id: 'bill4',
      date: '2024-06-22',
      description: 'Netflix Standard',
      amount: 15.49,
    },
];
