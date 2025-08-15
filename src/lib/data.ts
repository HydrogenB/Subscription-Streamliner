import { NetflixIcon } from "@/components/icons/netflix-icon";
import { YouTubeIcon } from "@/components/icons/youtube-icon";
import { ViuIcon } from "@/components/icons/viu-icon";
import { WeTVIcon } from "@/components/icons/wetv-icon";
import { IQIYIIcon } from "@/components/icons/iqiyi-icon";
import { OneDIcon } from "@/components/icons/oned-icon";
import { TrueIDIcon } from "@/components/icons/trueid-icon";
import type { SubscriptionService, OfferGroup } from "@/lib/types";

export const subscriptionServices: SubscriptionService[] = [
  { id: 'viu', name: 'Viu', logo: ViuIcon, description: 'Asian dramas, movies, and originals.', plans: [{ id: 'viu-premium', name: 'Premium', price: 149, features: ['Ad-free', 'Full HD'] }] },
  { id: 'wetv', name: 'WeTV', logo: WeTVIcon, description: 'Binge-watch original & exclusive content.', plans: [{ id: 'wetv-vip', name: 'VIP', price: 129, features: ['Ad-free', 'Early access'] }] },
  { id: 'iqiyi', name: 'iQIYI VIP Standard', logo: IQIYIIcon, description: 'Popular Asian dramas, variety shows, and animes.', plans: [{ id: 'iqiyi-standard', name: 'VIP Standard', price: 119, features: ['Full HD', '2 screens'] }] },
  { id: 'oned', name: 'oneD', logo: OneDIcon, description: 'Thai dramas and exclusive content.', plans: [{ id: 'oned-premium', name: 'Premium', price: 99, features: ['Ad-free', 'Early access'] }] },
  { id: 'trueplus', name: 'True Plus', logo: TrueIDIcon, description: 'Movies, series, and sports from True.', plans: [{ id: 'trueplus-monthly', name: 'Monthly', price: 119, features: ['Live TV', 'VOD content'] }] },
  { id: 'trueidshort', name: 'True ID Short', logo: TrueIDIcon, description: 'Short-form video content from True ID.', plans: [{ id: 'trueidshort-access', name: 'Access', price: 349, features: ['Exclusive short clips'] }] },
  { id: 'youtube', name: 'YouTube Premium', logo: YouTubeIcon, description: 'Ad-free YouTube and YouTube Music.', plans: [{ id: 'yt-premium', name: 'Premium', price: 179, features: ['Ad-free', 'Background play'] }] },
  { id: 'netflix-mobile', name: 'Netflix Mobile', logo: NetflixIcon, description: 'Watch on your mobile device.', plans: [{ id: 'n-mobile', name: 'Mobile', price: 99, features: ['480p', 'Mobile/Tablet'] }] },
  { id: 'netflix-basic', name: 'Netflix Basic', logo: NetflixIcon, description: 'Basic plan for all devices.', plans: [{ id: 'n-basic', name: 'Basic', price: 169, features: ['720p', 'All devices'] }] },
  { id: 'netflix-standard', name: 'Netflix Standard', logo: NetflixIcon, description: 'Standard HD plan.', plans: [{ id: 'n-standard', name: 'Standard', price: 349, features: ['1080p', '2 screens'] }] },
  { id: 'netflix-premium', name: 'Netflix Premium', logo: NetflixIcon, description: 'Premium 4K+HDR plan.', plans: [{ id: 'n-premium', name: 'Premium', price: 419, features: ['4K+HDR', '4 screens'] }] },
];

export const offerGroups: OfferGroup[] = [
  // Standalone Offers (Pack0)
  { id: 'offerGroup1', packName: 'Pack0', services: ['viu'], fullPrice: 149, sellingPrice: 59 },
  { id: 'offerGroup2', packName: 'Pack0', services: ['wetv'], fullPrice: 129, sellingPrice: 59 },
  { id: 'offerGroup3', packName: 'Pack0', services: ['iqiyi'], fullPrice: 119, sellingPrice: 59 },
  { id: 'offerGroup4', packName: 'Pack0', services: ['oned'], fullPrice: 99, sellingPrice: 59 },
  { id: 'offerGroup5', packName: 'Pack0', services: ['trueplus'], fullPrice: 119, sellingPrice: 59 },
  { id: 'offerGroup6', packName: 'Pack0', services: ['trueidshort'], fullPrice: 349, sellingPrice: 69 },
  { id: 'offerGroup7', packName: 'Pack0', services: ['youtube'], fullPrice: 179, sellingPrice: 159 },
  { id: 'offerGroup8', packName: 'Pack0', services: ['netflix-mobile'], fullPrice: 99, sellingPrice: 99 },
  { id: 'offerGroup9', packName: 'Pack0', services: ['netflix-basic'], fullPrice: 169, sellingPrice: 169 },
  { id: 'offerGroup10', packName: 'Pack0', services: ['netflix-standard'], fullPrice: 349, sellingPrice: 349 },
  { id: 'offerGroup11', packName: 'Pack0', services: ['netflix-premium'], fullPrice: 419, sellingPrice: 419 },

  // 2-Service Bundles (Pack1)
  { id: 'offerGroup12', packName: 'Pack1', services: ['viu', 'wetv'], fullPrice: 278, sellingPrice: 119 },
  { id: 'offerGroup13', packName: 'Pack1', services: ['viu', 'iqiyi'], fullPrice: 268, sellingPrice: 119 },
  { id: 'offerGroup14', packName: 'Pack1', services: ['viu', 'oned'], fullPrice: 248, sellingPrice: 119 },
  { id: 'offerGroup15', packName: 'Pack1', services: ['viu', 'trueplus'], fullPrice: 268, sellingPrice: 119 },
  { id: 'offerGroup16', packName: 'Pack1', services: ['wetv', 'iqiyi'], fullPrice: 248, sellingPrice: 119 },
  { id: 'offerGroup17', packName: 'Pack1', services: ['wetv', 'oned'], fullPrice: 228, sellingPrice: 119 },
  { id: 'offerGroup18', packName: 'Pack1', services: ['wetv', 'trueplus'], fullPrice: 248, sellingPrice: 119 },
  { id: 'offerGroup19', packName: 'Pack1', services: ['iqiyi', 'oned'], fullPrice: 218, sellingPrice: 119 },
  { id: 'offerGroup20', packName: 'Pack1', services: ['iqiyi', 'trueplus'], fullPrice: 238, sellingPrice: 119 },
  { id: 'offerGroup21', packName: 'Pack1', services: ['oned', 'trueplus'], fullPrice: 218, sellingPrice: 119 },
  { id: 'offerGroup22', packName: 'Pack1', services: ['viu', 'netflix-mobile'], fullPrice: 248, sellingPrice: 119 },
  { id: 'offerGroup23', packName: 'Pack1', services: ['wetv', 'netflix-mobile'], fullPrice: 228, sellingPrice: 119 },
  { id: 'offerGroup24', packName: 'Pack1', services: ['iqiyi', 'netflix-mobile'], fullPrice: 218, sellingPrice: 119 },
  { id: 'offerGroup25', packName: 'Pack1', services: ['oned', 'netflix-mobile'], fullPrice: 198, sellingPrice: 119 },
  { id: 'offerGroup26', packName: 'Pack1', services: ['trueplus', 'netflix-mobile'], fullPrice: 218, sellingPrice: 119 },

  // 3-Service Bundles (Pack2)
  { id: 'offerGroup27', packName: 'Pack2', services: ['viu', 'wetv', 'netflix-basic'], fullPrice: 447, sellingPrice: 229 },
  { id: 'offerGroup28', packName: 'Pack2', services: ['viu', 'iqiyi', 'netflix-basic'], fullPrice: 437, sellingPrice: 229 },
  { id: 'offerGroup29', packName: 'Pack2', services: ['viu', 'oned', 'netflix-basic'], fullPrice: 417, sellingPrice: 229 },
  { id: 'offerGroup30', packName: 'Pack2', services: ['viu', 'trueplus', 'netflix-basic'], fullPrice: 437, sellingPrice: 229 },
  { id: 'offerGroup31', packName: 'Pack2', services: ['viu', 'trueidshort', 'netflix-basic'], fullPrice: 667, sellingPrice: 229 },
  { id: 'offerGroup32', packName: 'Pack2', services: ['wetv', 'iqiyi', 'netflix-basic'], fullPrice: 417, sellingPrice: 229 },
  { id: 'offerGroup33', packName: 'Pack2', services: ['wetv', 'oned', 'netflix-basic'], fullPrice: 397, sellingPrice: 229 },
  { id: 'offerGroup34', packName: 'Pack2', services: ['wetv', 'trueplus', 'netflix-basic'], fullPrice: 417, sellingPrice: 229 },
  { id: 'offerGroup35', packName: 'Pack2', services: ['wetv', 'trueidshort', 'netflix-basic'], fullPrice: 647, sellingPrice: 229 },
  { id: 'offerGroup36', packName: 'Pack2', services: ['iqiyi', 'oned', 'netflix-basic'], fullPrice: 387, sellingPrice: 229 },
  { id: 'offerGroup37', packName: 'Pack2', services: ['iqiyi', 'trueplus', 'netflix-basic'], fullPrice: 407, sellingPrice: 229 },
  { id: 'offerGroup38', packName: 'Pack2', services: ['iqiyi', 'trueidshort', 'netflix-basic'], fullPrice: 637, sellingPrice: 229 },
  { id: 'offerGroup39', packName: 'Pack2', services: ['oned', 'trueplus', 'netflix-basic'], fullPrice: 387, sellingPrice: 229 },
  { id: 'offerGroup40', packName: 'Pack2', services: ['oned', 'trueidshort', 'netflix-basic'], fullPrice: 617, sellingPrice: 229 },
  { id: 'offerGroup41', packName: 'Pack2', services: ['trueplus', 'trueidshort', 'netflix-basic'], fullPrice: 637, sellingPrice: 229 },
  { id: 'offerGroup42', packName: 'Pack2', services: ['viu', 'wetv', 'youtube'], fullPrice: 457, sellingPrice: 229 },
  { id: 'offerGroup43', packName: 'Pack2', services: ['viu', 'iqiyi', 'youtube'], fullPrice: 447, sellingPrice: 229 },
  { id: 'offerGroup44', packName: 'Pack2', services: ['viu', 'oned', 'youtube'], fullPrice: 427, sellingPrice: 229 },
  { id: 'offerGroup45', packName: 'Pack2', services: ['viu', 'trueplus', 'youtube'], fullPrice: 447, sellingPrice: 229 },
  { id: 'offerGroup46', packName: 'Pack2', services: ['viu', 'trueidshort', 'youtube'], fullPrice: 677, sellingPrice: 229 },
  { id: 'offerGroup47', packName: 'Pack2', services: ['wetv', 'iqiyi', 'youtube'], fullPrice: 427, sellingPrice: 229 },
  { id: 'offerGroup48', packName: 'Pack2', services: ['wetv', 'oned', 'youtube'], fullPrice: 407, sellingPrice: 229 },
  { id: 'offerGroup49', packName: 'Pack2', services: ['wetv', 'trueplus', 'youtube'], fullPrice: 427, sellingPrice: 229 },
  { id: 'offerGroup50', packName: 'Pack2', services: ['wetv', 'trueidshort', 'youtube'], fullPrice: 657, sellingPrice: 229 },
  { id: 'offerGroup51', packName: 'Pack2', services: ['iqiyi', 'oned', 'youtube'], fullPrice: 397, sellingPrice: 229 },
  { id: 'offerGroup52', packName: 'Pack2', services: ['iqiyi', 'trueplus', 'youtube'], fullPrice: 417, sellingPrice: 229 },
  { id: 'offerGroup53', packName: 'Pack2', services: ['iqiyi', 'trueidshort', 'youtube'], fullPrice: 647, sellingPrice: 229 },
  { id: 'offerGroup54', packName: 'Pack2', services: ['oned', 'trueplus', 'youtube'], fullPrice: 397, sellingPrice: 229 },
  { id: 'offerGroup55', packName: 'Pack2', services: ['oned', 'trueidshort', 'youtube'], fullPrice: 627, sellingPrice: 229 },
  { id: 'offerGroup56', packName: 'Pack2', services: ['trueplus', 'trueidshort', 'youtube'], fullPrice: 647, sellingPrice: 229 },

  // 4-Service Bundles (Pack3)
  { id: 'offerGroup57', packName: 'Pack3', services: ['viu', 'wetv', 'netflix-basic', 'youtube'], fullPrice: 626, sellingPrice: 339 },
  { id: 'offerGroup58', packName: 'Pack3', services: ['viu', 'iqiyi', 'netflix-basic', 'youtube'], fullPrice: 616, sellingPrice: 339 },
  { id: 'offerGroup59', packName: 'Pack3', services: ['viu', 'oned', 'netflix-basic', 'youtube'], fullPrice: 596, sellingPrice: 339 },
  { id: 'offerGroup60', packName: 'Pack3', services: ['viu', 'trueplus', 'netflix-basic', 'youtube'], fullPrice: 616, sellingPrice: 339 },
  { id: 'offerGroup61', packName: 'Pack3', services: ['viu', 'trueidshort', 'netflix-basic', 'youtube'], fullPrice: 846, sellingPrice: 339 },
  { id: 'offerGroup62', packName: 'Pack3', services: ['wetv', 'iqiyi', 'netflix-basic', 'youtube'], fullPrice: 596, sellingPrice: 339 },
  { id: 'offerGroup63', packName: 'Pack3', services: ['wetv', 'oned', 'netflix-basic', 'youtube'], fullPrice: 576, sellingPrice: 339 },
  { id: 'offerGroup64', packName: 'Pack3', services: ['wetv', 'trueplus', 'netflix-basic', 'youtube'], fullPrice: 596, sellingPrice: 339 },
  { id: 'offerGroup65', packName: 'Pack3', services: ['wetv', 'trueidshort', 'netflix-basic', 'youtube'], fullPrice: 826, sellingPrice: 339 },
  { id: 'offerGroup66', packName: 'Pack3', services: ['iqiyi', 'oned', 'netflix-basic', 'youtube'], fullPrice: 566, sellingPrice: 339 },
  { id: 'offerGroup67', packName: 'Pack3', services: ['iqiyi', 'trueplus', 'netflix-basic', 'youtube'], fullPrice: 586, sellingPrice: 339 },
  { id: 'offerGroup68', packName: 'Pack3', services: ['iqiyi', 'trueidshort', 'netflix-basic', 'youtube'], fullPrice: 816, sellingPrice: 339 },
  { id: 'offerGroup69', packName: 'Pack3', services: ['oned', 'trueplus', 'netflix-basic', 'youtube'], fullPrice: 566, sellingPrice: 339 },
  { id: 'offerGroup70', packName: 'Pack3', services: ['oned', 'trueidshort', 'netflix-basic', 'youtube'], fullPrice: 796, sellingPrice: 339 },
  { id: 'offerGroup71', packName: 'Pack3', services: ['trueplus', 'trueidshort', 'netflix-basic', 'youtube'], fullPrice: 816, sellingPrice: 339 },

  // 4-Service Bundles (Pack4)
  { id: 'offerGroup72', packName: 'Pack4', services: ['viu', 'wetv', 'iqiyi', 'netflix-standard'], fullPrice: 746, sellingPrice: 449 },
  { id: 'offerGroup73', packName: 'Pack4', services: ['viu', 'wetv', 'oned', 'netflix-standard'], fullPrice: 726, sellingPrice: 449 },
  { id: 'offerGroup74', packName: 'Pack4', services: ['viu', 'wetv', 'trueplus', 'netflix-standard'], fullPrice: 746, sellingPrice: 449 },
  { id: 'offerGroup75', packName: 'Pack4', services: ['viu', 'wetv', 'trueidshort', 'netflix-standard'], fullPrice: 976, sellingPrice: 449 },
  { id: 'offerGroup76', packName: 'Pack4', services: ['viu', 'iqiyi', 'oned', 'netflix-standard'], fullPrice: 716, sellingPrice: 449 },
  { id: 'offerGroup77', packName: 'Pack4', services: ['viu', 'iqiyi', 'trueplus', 'netflix-standard'], fullPrice: 736, sellingPrice: 449 },
  { id: 'offerGroup78', packName: 'Pack4', services: ['viu', 'iqiyi', 'trueidshort', 'netflix-standard'], fullPrice: 966, sellingPrice: 449 },
  { id: 'offerGroup79', packName: 'Pack4', services: ['viu', 'oned', 'trueplus', 'netflix-standard'], fullPrice: 716, sellingPrice: 449 },
  { id: 'offerGroup80', packName: 'Pack4', services: ['viu', 'oned', 'trueidshort', 'netflix-standard'], fullPrice: 946, sellingPrice: 449 },
  { id: 'offerGroup81', packName: 'Pack4', services: ['viu', 'trueplus', 'trueidshort', 'netflix-standard'], fullPrice: 966, sellingPrice: 449 },
  { id: 'offerGroup82', packName: 'Pack4', services: ['wetv', 'iqiyi', 'oned', 'netflix-standard'], fullPrice: 696, sellingPrice: 449 },
  { id: 'offerGroup83', packName: 'Pack4', services: ['wetv', 'iqiyi', 'trueplus', 'netflix-standard'], fullPrice: 716, sellingPrice: 449 },
  { id: 'offerGroup84', packName: 'Pack4', services: ['wetv', 'iqiyi', 'trueidshort', 'netflix-standard'], fullPrice: 946, sellingPrice: 449 },
  { id: 'offerGroup85', packName: 'Pack4', services: ['wetv', 'oned', 'trueplus', 'netflix-standard'], fullPrice: 696, sellingPrice: 449 },
  { id: 'offerGroup86', packName: 'Pack4', services: ['wetv', 'oned', 'trueidshort', 'netflix-standard'], fullPrice: 926, sellingPrice: 449 },
  { id: 'offerGroup87', packName: 'Pack4', services: ['wetv', 'trueplus', 'trueidshort', 'netflix-standard'], fullPrice: 946, sellingPrice: 449 },
  { id: 'offerGroup88', packName: 'Pack4', services: ['iqiyi', 'oned', 'trueplus', 'netflix-standard'], fullPrice: 686, sellingPrice: 449 },
  { id: 'offerGroup89', packName: 'Pack4', services: ['iqiyi', 'oned', 'trueidshort', 'netflix-standard'], fullPrice: 916, sellingPrice: 449 },
  { id: 'offerGroup90', packName: 'Pack4', services: ['iqiyi', 'trueplus', 'trueidshort', 'netflix-standard'], fullPrice: 936, sellingPrice: 449 },
  { id: 'offerGroup91', packName: 'Pack4', services: ['oned', 'trueplus', 'trueidshort', 'netflix-standard'], fullPrice: 916, sellingPrice: 449 },
  { id: 'offerGroup92', packName: 'Pack4', services: ['viu', 'wetv', 'iqiyi', 'youtube'], fullPrice: 576, sellingPrice: 449 },
  { id: 'offerGroup93', packName: 'Pack4', services: ['viu', 'wetv', 'oned', 'youtube'], fullPrice: 556, sellingPrice: 449 },
  { id: 'offerGroup94', packName: 'Pack4', services: ['viu', 'wetv', 'trueplus', 'youtube'], fullPrice: 576, sellingPrice: 449 },
  { id: 'offerGroup95', packName: 'Pack4', services: ['viu', 'wetv', 'trueidshort', 'youtube'], fullPrice: 806, sellingPrice: 449 },
  { id: 'offerGroup96', packName: 'Pack4', services: ['viu', 'iqiyi', 'oned', 'youtube'], fullPrice: 546, sellingPrice: 449 },
  { id: 'offerGroup97', packName: 'Pack4', services: ['viu', 'iqiyi', 'trueplus', 'youtube'], fullPrice: 566, sellingPrice: 449 },
  { id: 'offerGroup98', packName: 'Pack4', services: ['viu', 'iqiyi', 'trueidshort', 'youtube'], fullPrice: 796, sellingPrice: 449 },
  { id: 'offerGroup99', packName: 'Pack4', services: ['viu', 'oned', 'trueplus', 'youtube'], fullPrice: 546, sellingPrice: 449 },
  { id: 'offerGroup100', packName: 'Pack4', services: ['viu', 'oned', 'trueidshort', 'youtube'], fullPrice: 776, sellingPrice: 449 },
  { id: 'offerGroup101', packName: 'Pack4', services: ['viu', 'trueplus', 'trueidshort', 'youtube'], fullPrice: 796, sellingPrice: 449 },
  { id: 'offerGroup102', packName: 'Pack4', services: ['wetv', 'iqiyi', 'oned', 'youtube'], fullPrice: 526, sellingPrice: 449 },
  { id: 'offerGroup103', packName: 'Pack4', services: ['wetv', 'iqiyi', 'trueplus', 'youtube'], fullPrice: 546, sellingPrice: 449 },
  { id: 'offerGroup104', packName: 'Pack4', services: ['wetv', 'iqiyi', 'trueidshort', 'youtube'], fullPrice: 776, sellingPrice: 449 },
  { id: 'offerGroup105', packName: 'Pack4', services: ['wetv', 'oned', 'trueplus', 'youtube'], fullPrice: 526, sellingPrice: 449 },
  { id: 'offerGroup106', packName: 'Pack4', services: ['wetv', 'oned', 'trueidshort', 'youtube'], fullPrice: 756, sellingPrice: 449 },
  { id: 'offerGroup107', packName: 'Pack4', services: ['wetv', 'trueplus', 'trueidshort', 'youtube'], fullPrice: 776, sellingPrice: 449 },
  { id: 'offerGroup108', packName: 'Pack4', services: ['iqiyi', 'oned', 'trueplus', 'youtube'], fullPrice: 516, sellingPrice: 449 },
  { id: 'offerGroup109', packName: 'Pack4', services: ['iqiyi', 'oned', 'trueidshort', 'youtube'], fullPrice: 746, sellingPrice: 449 },
  { id: 'offerGroup110', packName: 'Pack4', services: ['iqiyi', 'trueplus', 'trueidshort', 'youtube'], fullPrice: 766, sellingPrice: 449 },
  { id: 'offerGroup111', packName: 'Pack4', services: ['oned', 'trueplus', 'trueidshort', 'youtube'], fullPrice: 746, sellingPrice: 449 },

  // 3-Service Bundles (Pack5)
  { id: 'offerGroup112', packName: 'Pack5', services: ['viu', 'netflix-premium', 'youtube'], fullPrice: 747, sellingPrice: 559 },
  { id: 'offerGroup113', packName: 'Pack5', services: ['wetv', 'netflix-premium', 'youtube'], fullPrice: 727, sellingPrice: 559 },
  { id: 'offerGroup114', packName: 'Pack5', services: ['iqiyi', 'netflix-premium', 'youtube'], fullPrice: 717, sellingPrice: 559 },
  { id: 'offerGroup115', packName: 'Pack5', services: ['oned', 'netflix-premium', 'youtube'], fullPrice: 697, sellingPrice: 559 },
  { id: 'offerGroup116', packName: 'Pack5', services: ['trueplus', 'netflix-premium', 'youtube'], fullPrice: 717, sellingPrice: 559 },
  { id: 'offerGroup117', packName: 'Pack5', services: ['trueidshort', 'netflix-premium', 'youtube'], fullPrice: 947, sellingPrice: 559 },

  // Special bundles (Pack6 & Pack7)
  { id: 'offerGroup118', packName: 'Pack6', services: ['viu', 'wetv', 'iqiyi'], fullPrice: 248, sellingPrice: 159 },
  { id: 'offerGroup119', packName: 'Pack7', services: ['netflix-premium', 'youtube'], fullPrice: 598, sellingPrice: 555 },
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
