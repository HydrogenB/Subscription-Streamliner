import { NetflixIcon } from "@/components/icons/netflix-icon";
import { YouTubeIcon } from "@/components/icons/youtube-icon";
import { ViuIcon } from "@/components/icons/viu-icon";
import { WeTVIcon } from "@/components/icons/wetv-icon";
import { IQIYIIcon } from "@/components/icons/iqiyi-icon";
import { OneDIcon } from "@/components/icons/oned-icon";
import { TrueIDIcon } from "@/components/icons/trueid-icon";
import type { SubscriptionService, OfferGroup } from "@/lib/types";

export const subscriptionServices: SubscriptionService[] = [
  { id: 'viu', name: 'Viu', logo: ViuIcon, description: 'Asian dramas, movies, and originals.', plans: [{ id: 'viu-premium', name: 'Premium', price: 119, features: ['Ad-free', 'Full HD'] }] },
  { id: 'wetv', name: 'WeTV', logo: WeTVIcon, description: 'Binge-watch original & exclusive content.', plans: [{ id: 'wetv-vip', name: 'VIP', price: 139, features: ['Ad-free', 'Early access'] }] },
  { id: 'iqiyi', name: 'iQIYI VIP Standard', logo: IQIYIIcon, description: 'Popular Asian dramas, variety shows, and animes.', plans: [{ id: 'iqiyi-standard', name: 'VIP Standard', price: 119, features: ['Full HD', '2 screens'] }] },
  { id: 'oned', name: 'oneD', logo: OneDIcon, description: 'Thai dramas and exclusive content.', plans: [{ id: 'oned-premium', name: 'Premium', price: 59, features: ['Ad-free', 'Early access'] }] },
  { id: 'trueplus', name: 'True Plus', logo: TrueIDIcon, description: 'Movies, series, and sports from True.', plans: [{ id: 'trueplus-monthly', name: 'Monthly', price: 199, features: ['Live TV', 'VOD content'] }] },
  { id: 'trueidshort', name: 'True ID Short', logo: TrueIDIcon, description: 'Short-form video content from True ID.', plans: [{ id: 'trueidshort-access', name: 'Access', price: 49, features: ['Exclusive short clips'] }] },
  { id: 'youtube', name: 'YouTube Premium', logo: YouTubeIcon, description: 'Ad-free YouTube and YouTube Music.', plans: [{ id: 'yt-premium', name: 'Premium', price: 179, features: ['Ad-free', 'Background play'] }] },
  { id: 'netflix-mobile', name: 'Netflix Mobile', logo: NetflixIcon, description: 'Watch on your mobile device.', plans: [{ id: 'n-mobile', name: 'Mobile', price: 99, features: ['480p', 'Mobile/Tablet'] }] },
  { id: 'netflix-basic', name: 'Netflix Basic', logo: NetflixIcon, description: 'Basic plan for all devices.', plans: [{ id: 'n-basic', name: 'Basic', price: 169, features: ['720p', 'All devices'] }] },
  { id: 'netflix-standard', name: 'Netflix Standard', logo: NetflixIcon, description: 'Standard HD plan.', plans: [{ id: 'n-standard', name: 'Standard', price: 349, features: ['1080p', '2 screens'] }] },
  { id: 'netflix-premium', name: 'Netflix Premium', logo: NetflixIcon, description: 'Premium 4K+HDR plan.', plans: [{ id: 'n-premium', name: 'Premium', price: 419, features: ['4K+HDR', '4 screens'] }] },
];

export const offerGroups: OfferGroup[] = [
  // Standalone
  { id: 'offerGroup1', packName: 'Viu', services: ['viu'], fullPrice: 119, sellingPrice: 119 },
  { id: 'offerGroup2', packName: 'WeTV', services: ['wetv'], fullPrice: 139, sellingPrice: 139 },
  { id: 'offerGroup3', packName: 'iQIYI VIP Standard', services: ['iqiyi'], fullPrice: 119, sellingPrice: 119 },
  { id: 'offerGroup4', packName: 'oneD', services: ['oned'], fullPrice: 59, sellingPrice: 59 },
  { id: 'offerGroup5', packName: 'True Plus', services: ['trueplus'], fullPrice: 199, sellingPrice: 199 },
  { id: 'offerGroup6', packName: 'True ID Short', services: ['trueidshort'], fullPrice: 49, sellingPrice: 49 },
  { id: 'offerGroup7', packName: 'YouTube Premium', services: ['youtube'], fullPrice: 179, sellingPrice: 179 },
  { id: 'offerGroup8', packName: 'Netflix Mobile', services: ['netflix-mobile'], fullPrice: 99, sellingPrice: 99 },
  { id: 'offerGroup9', packName: 'Netflix Basic', services: ['netflix-basic'], fullPrice: 169, sellingPrice: 169 },
  { id: 'offerGroup10', packName: 'Netflix Standard', services: ['netflix-standard'], fullPrice: 349, sellingPrice: 349 },
  { id: 'offerGroup11', packName: 'Netflix Premium', services: ['netflix-premium'], fullPrice: 419, sellingPrice: 419 },

  // Pack1 - 2 services
  { id: 'offerGroup12', packName: 'Pack 1: Viu + WeTV', services: ['viu', 'wetv'], fullPrice: 258, sellingPrice: 119 },
  { id: 'offerGroup13', packName: 'Pack 1: Viu + iQIYI', services: ['viu', 'iqiyi'], fullPrice: 238, sellingPrice: 119 },
  { id: 'offerGroup14', packName: 'Pack 1: Viu + oneD', services: ['viu', 'oned'], fullPrice: 178, sellingPrice: 119 },
  { id: 'offerGroup15', packName: 'Pack 1: Viu + True Plus', services: ['viu', 'trueplus'], fullPrice: 318, sellingPrice: 119 },
  { id: 'offerGroup16', packName: 'Pack 1: Viu + True ID Short', services: ['viu', 'trueidshort'], fullPrice: 168, sellingPrice: 119 },
  { id: 'offerGroup17', packName: 'Pack 1: Viu + Netflix Mobile', services: ['viu', 'netflix-mobile'], fullPrice: 218, sellingPrice: 119 },
  { id: 'offerGroup18', packName: 'Pack 1: WeTV + iQIYI', services: ['wetv', 'iqiyi'], fullPrice: 258, sellingPrice: 119 },
  { id: 'offerGroup19', packName: 'Pack 1: WeTV + oneD', services: ['wetv', 'oned'], fullPrice: 198, sellingPrice: 119 },
  { id: 'offerGroup20', packName: 'Pack 1: WeTV + True Plus', services: ['wetv', 'trueplus'], fullPrice: 338, sellingPrice: 119 },
  { id: 'offerGroup21', packName: 'Pack 1: WeTV + True ID Short', services: ['wetv', 'trueidshort'], fullPrice: 188, sellingPrice: 119 },
  { id: 'offerGroup22', packName: 'Pack 1: WeTV + Netflix Mobile', services: ['wetv', 'netflix-mobile'], fullPrice: 238, sellingPrice: 119 },
  { id: 'offerGroup23', packName: 'Pack 1: iQIYI + oneD', services: ['iqiyi', 'oned'], fullPrice: 178, sellingPrice: 119 },
  { id: 'offerGroup24', packName: 'Pack 1: iQIYI + True Plus', services: ['iqiyi', 'trueplus'], fullPrice: 318, sellingPrice: 119 },
  { id: 'offerGroup25', packName: 'Pack 1: iQIYI + True ID Short', services: ['iqiyi', 'trueidshort'], fullPrice: 168, sellingPrice: 119 },
  { id: 'offerGroup26', packName: 'Pack 1: iQIYI + Netflix Mobile', services: ['iqiyi', 'netflix-mobile'], fullPrice: 218, sellingPrice: 119 },
  { id: 'offerGroup27', packName: 'Pack 1: oneD + True Plus', services: ['oned', 'trueplus'], fullPrice: 258, sellingPrice: 119 },
  { id: 'offerGroup28', packName: 'Pack 1: oneD + True ID Short', services: ['oned', 'trueidshort'], fullPrice: 108, sellingPrice: 119 },
  { id: 'offerGroup29', packName: 'Pack 1: oneD + Netflix Mobile', services: ['oned', 'netflix-mobile'], fullPrice: 158, sellingPrice: 119 },
  { id: 'offerGroup30', packName: 'Pack 1: True Plus + True ID Short', services: ['trueplus', 'trueidshort'], fullPrice: 248, sellingPrice: 119 },
  { id: 'offerGroup31', packName: 'Pack 1: True Plus + Netflix Mobile', services: ['trueplus', 'netflix-mobile'], fullPrice: 298, sellingPrice: 119 },
  { id: 'offerGroup32', packName: 'Pack 1: True ID Short + Netflix Mobile', services: ['trueidshort', 'netflix-mobile'], fullPrice: 148, sellingPrice: 119 },

  // Pack2 - 3 services
  { id: 'offerGroup33', packName: 'Pack 2: Viu, WeTV, Netflix Mobile', services: ['viu', 'wetv', 'netflix-mobile'], fullPrice: 357, sellingPrice: 229 },
  { id: 'offerGroup34', packName: 'Pack 2: Viu, WeTV, Netflix Basic', services: ['viu', 'wetv', 'netflix-basic'], fullPrice: 427, sellingPrice: 229 },
  { id: 'offerGroup35', packName: 'Pack 2: Viu, WeTV, YouTube Premium', services: ['viu', 'wetv', 'youtube'], fullPrice: 437, sellingPrice: 229, promotion: 'Add YouTube for only 110 THB!' },
  { id: 'offerGroup78', packName: 'Pack 3: Viu, WeTV, Netflix Mobile, YouTube Premium', services: ['viu', 'wetv', 'netflix-mobile', 'youtube'], fullPrice: 536, sellingPrice: 339 },
  { id: 'offerGroup108', packName: 'Pack 4: Viu, WeTV, iQIYI, Netflix Standard', services: ['viu', 'wetv', 'iqiyi', 'netflix-standard'], fullPrice: 726, sellingPrice: 449 },
  { id: 'offerGroup168', packName: 'Pack 5: Viu, Netflix Standard, YouTube', services: ['viu', 'netflix-standard', 'youtube'], fullPrice: 647, sellingPrice: 559 },
  
  // A representative sample of other packs
  { id: 'offerGroup50', packName: 'Pack 2: WeTV, iQIYI, YouTube', services: ['wetv', 'iqiyi', 'youtube'], fullPrice: 437, sellingPrice: 229 },
  { id: 'offerGroup96', packName: 'Pack 3: iQIYI, oneD, Netflix Mobile, YouTube', services: ['iqiyi', 'oned', 'netflix-mobile', 'youtube'], fullPrice: 456, sellingPrice: 339 },
  { id: 'offerGroup140', packName: 'Pack 4: WeTV, iQIYI, oneD, YouTube', services: ['wetv', 'iqiyi', 'oned', 'youtube'], fullPrice: 496, sellingPrice: 449 },
  { id: 'offerGroup173', packName: 'Pack 5: iQIYI, Netflix Premium, YouTube', services: ['iqiyi', 'netflix-premium', 'youtube'], fullPrice: 717, sellingPrice: 559 },
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
];