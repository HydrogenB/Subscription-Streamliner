import { NetflixIcon } from "@/components/icons/netflix-icon";
import { YouTubeIcon } from "@/components/icons/youtube-icon";
import { ViuIcon } from "@/components/icons/viu-icon";
import { WeTVIcon } from "@/components/icons/wetv-icon";
import { IQIYIIcon } from "@/components/icons/iqiyi-icon";
import { OneDIcon } from "@/components/icons/oned-icon";
import { TrueIDIcon } from "@/components/icons/trueid-icon";
import type { SubscriptionService } from "@/lib/types";

export const subscriptionServices: SubscriptionService[] = [
  {
    id: 'viu',
    name: 'Viu',
    logo: ViuIcon,
    description: 'Asian dramas, movies, and originals.',
    plans: [
      { id: 'viu-premium', name: 'Premium', price: 119, features: ['Ad-free', 'Full HD', 'Offline viewing'] },
    ],
    addons: [],
    promotion: 'Part of special bundles'
  },
  {
    id: 'wetv',
    name: 'WeTV',
    logo: WeTVIcon,
    description: 'Binge-watch original & exclusive content.',
    plans: [
      { id: 'wetv-vip', name: 'VIP', price: 139, features: ['Ad-free', 'Early access', 'Full HD'] },
    ],
    addons: [],
  },
    {
    id: 'iqiyi',
    name: 'iQIYI',
    logo: IQIYIIcon,
    description: 'Popular Asian dramas, variety shows, and animes.',
    plans: [
      { id: 'iqiyi-standard', name: 'VIP Standard', price: 119, features: ['Full HD', '2 screens', 'Ad-free'] },
    ],
    addons: [],
  },
  {
    id: 'oned',
    name: 'oneD',
    logo: OneDIcon,
    description: 'Thai dramas and exclusive content.',
    plans: [
      { id: 'oned-premium', name: 'Premium', price: 59, features: ['Ad-free', 'Early access'] },
    ],
    addons: [],
  },
  {
    id: 'trueplus',
    name: 'True Plus',
    logo: TrueIDIcon,
    description: 'Movies, series, and sports from True.',
    plans: [
      { id: 'trueplus-monthly', name: 'Monthly', price: 199, features: ['Live TV', 'VOD content'] },
    ],
    addons: [],
  },
  {
    id: 'trueidshort',
    name: 'True ID Short',
    logo: TrueIDIcon,
    description: 'Short-form video content from True ID.',
    plans: [
        { id: 'trueidshort-access', name: 'Access', price: 49, features: ['Exclusive short clips'] },
    ],
    addons: [],
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    logo: YouTubeIcon,
    description: 'Ad-free YouTube and YouTube Music.',
    plans: [
      { id: 'yt-premium', name: 'Premium', price: 159, features: ['Ad-free videos', 'Background play', 'YouTube Music Premium'] },
    ],
    addons: [],
    promotion: 'Add to Viu + WeTV pack for only 110 THB'
  },
  {
    id: 'netflix',
    name: 'Netflix',
    logo: NetflixIcon,
    description: 'Watch TV shows, movies, and more on-demand.',
    plans: [
      { id: 'n-mobile', name: 'Mobile', price: 99, features: ['480p', 'Mobile/Tablet only', '1 screen'] },
      { id: 'n-basic', name: 'Basic', price: 169, features: ['720p', 'All devices', '1 screen'] },
      { id: 'n-standard', name: 'Standard', price: 349, features: ['1080p', 'All devices', '2 screens'] },
      { id: 'n-premium', name: 'Premium', price: 419, features: ['4K+HDR', 'All devices', '4 screens', 'Spatial audio'] },
    ],
    addons: [],
  },
];


export const userSubscriptions = [
    {
      id: 'sub1',
      serviceName: 'Viu Premium',
      status: 'Active',
      renewalDate: '2024-08-15',
      price: 119,
    },
    {
      id: 'sub2',
      serviceName: 'WeTV VIP',
      status: 'Active',
      renewalDate: '2024-08-22',
      price: 139,
    },
];

export const billingHistory = [
    {
      id: 'bill1',
      date: '2024-07-15',
      description: 'Viu Premium',
      amount: 119,
    },
    {
      id: 'bill2',
      date: '2024-07-22',
      description: 'WeTV VIP',
      amount: 139,
    },
    {
      id: 'bill3',
      date: '2024-06-15',
      description: 'Viu Premium',
      amount: 119,
    },
    {
      id: 'bill4',
      date: '2024-06-22',
      description: 'WeTV VIP',
      amount: 139,
    },
];
