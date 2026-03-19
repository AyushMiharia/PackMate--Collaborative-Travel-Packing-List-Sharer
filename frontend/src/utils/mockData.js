// src/utils/mockData.js

export const mockUser = {
  _id: 'u1',
  name: 'Rachit Patel',
  email: 'rachit@example.com',
  submittedTips: ['tip1', 'tip6'],
  upvotedTips: ['tip2', 'tip3'],
  currentActiveTripId: 't1',
};

export const mockTrips = [
  {
    _id: 't1',
    tripName: 'Tokyo Winter Escape',
    destination: 'Tokyo',
    country: 'Japan',
    climate: 'cold',
    tripType: 'city',
    luggageType: 'checked',
    durationDays: 10,
    startDate: '2026-12-20',
    endDate: '2026-12-30',
    status: 'planning',
    items: [
      { itemId: 'i1', isChecked: true,  isCustom: false, customName: null },
      { itemId: 'i2', isChecked: true,  isCustom: false, customName: null },
      { itemId: 'i3', isChecked: false, isCustom: false, customName: null },
      { itemId: 'i4', isChecked: false, isCustom: false, customName: null },
      { itemId: 'i5', isChecked: false, isCustom: true,  customName: 'Pocket WiFi' },
    ],
  },
  {
    _id: 't2',
    tripName: 'Bali Beach Retreat',
    destination: 'Bali',
    country: 'Indonesia',
    climate: 'tropical',
    tripType: 'beach',
    luggageType: 'carry-on',
    durationDays: 7,
    startDate: '2026-04-10',
    endDate: '2026-04-17',
    status: 'planning',
    items: [
      { itemId: 'i6', isChecked: true,  isCustom: false, customName: null },
      { itemId: 'i7', isChecked: false, isCustom: false, customName: null },
      { itemId: 'i8', isChecked: false, isCustom: false, customName: null },
    ],
  },
  {
    _id: 't3',
    tripName: 'Swiss Alps Hike',
    destination: 'Zermatt',
    country: 'Switzerland',
    climate: 'cold',
    tripType: 'hiking',
    luggageType: 'checked',
    durationDays: 5,
    startDate: '2025-08-15',
    endDate: '2025-08-20',
    status: 'completed',
    items: [
      { itemId: 'i9',  isChecked: true, isCustom: false, customName: null },
      { itemId: 'i10', isChecked: true, isCustom: false, customName: null },
      { itemId: 'i11', isChecked: true, isCustom: false, customName: null },
      { itemId: 'i1',  isChecked: true, isCustom: false, customName: null },
    ],
  },
];

export const mockPackingItems = [
  { _id: 'i1',  name: 'Thermal Underlayer',      category: 'Clothing',        climateTags: ['cold'],                       tripTypeTags: ['hiking','city','business'],                 isEssential: true  },
  { _id: 'i2',  name: 'Winter Coat',              category: 'Clothing',        climateTags: ['cold'],                       tripTypeTags: ['city','business'],                          isEssential: true  },
  { _id: 'i3',  name: 'Wool Socks (5 pairs)',     category: 'Clothing',        climateTags: ['cold'],                       tripTypeTags: ['hiking','city'],                            isEssential: true  },
  { _id: 'i4',  name: 'Gloves & Scarf',           category: 'Clothing',        climateTags: ['cold'],                       tripTypeTags: ['city','hiking'],                            isEssential: false },
  { _id: 'i5',  name: 'Travel Adapter',           category: 'Electronics',     climateTags: ['tropical','cold','desert','mediterranean'], tripTypeTags: ['city','business','beach','hiking','backpacking'], isEssential: true },
  { _id: 'i6',  name: 'Swimsuit',                 category: 'Clothing',        climateTags: ['tropical','mediterranean'],   tripTypeTags: ['beach'],                                   isEssential: true  },
  { _id: 'i7',  name: 'Reef-Safe Sunscreen',      category: 'Toiletries',      climateTags: ['tropical','mediterranean'],   tripTypeTags: ['beach'],                                   isEssential: true  },
  { _id: 'i8',  name: 'Waterproof Sandals',       category: 'Footwear',        climateTags: ['tropical','mediterranean'],   tripTypeTags: ['beach'],                                   isEssential: false },
  { _id: 'i9',  name: 'Hiking Boots',             category: 'Footwear',        climateTags: ['cold','desert','mediterranean'], tripTypeTags: ['hiking'],                              isEssential: true  },
  { _id: 'i10', name: 'Trekking Poles',           category: 'Activity Gear',   climateTags: ['cold','mediterranean'],       tripTypeTags: ['hiking'],                                  isEssential: false },
  { _id: 'i11', name: 'First Aid Kit',            category: 'Health & Safety', climateTags: ['tropical','cold','desert','mediterranean'], tripTypeTags: ['hiking','beach','backpacking'], isEssential: true },
  { _id: 'i12', name: 'Passport & Copies',        category: 'Documents',       climateTags: ['tropical','cold','desert','mediterranean'], tripTypeTags: ['city','business','beach','hiking','backpacking'], isEssential: true },
  { _id: 'i13', name: 'Travel Insurance Docs',    category: 'Documents',       climateTags: ['tropical','cold','desert','mediterranean'], tripTypeTags: ['city','business','beach','hiking','backpacking'], isEssential: true },
  { _id: 'i14', name: 'Laptop & Charger',         category: 'Electronics',     climateTags: ['tropical','cold','desert','mediterranean'], tripTypeTags: ['business'],                isEssential: true  },
  { _id: 'i15', name: 'Business Cards',           category: 'Documents',       climateTags: ['tropical','cold','desert','mediterranean'], tripTypeTags: ['business'],                isEssential: false },
  { _id: 'i16', name: 'Linen Shirts (3)',         category: 'Clothing',        climateTags: ['tropical','mediterranean'],   tripTypeTags: ['beach','city'],                            isEssential: false },
  { _id: 'i17', name: 'Insect Repellent',         category: 'Toiletries',      climateTags: ['tropical'],                   tripTypeTags: ['beach','hiking'],                          isEssential: true  },
  { _id: 'i18', name: 'Reusable Water Bottle',    category: 'Activity Gear',   climateTags: ['tropical','cold','desert','mediterranean'], tripTypeTags: ['hiking','city','beach','backpacking'], isEssential: true },
  { _id: 'i19', name: 'Noise-Cancelling Headphones', category: 'Electronics', climateTags: ['tropical','cold','desert','mediterranean'], tripTypeTags: ['city','business','backpacking'], isEssential: false },
  { _id: 'i20', name: 'Lightweight Rain Jacket',  category: 'Clothing',        climateTags: ['tropical','cold','mediterranean'], tripTypeTags: ['hiking','city','backpacking'],      isEssential: true  },
  { _id: 'i21', name: 'Portable Power Bank',      category: 'Electronics',     climateTags: ['tropical','cold','desert','mediterranean'], tripTypeTags: ['city','hiking','backpacking'], isEssential: true },
  { _id: 'i22', name: 'Packing Cubes (set)',      category: 'Activity Gear',   climateTags: ['tropical','cold','desert','mediterranean'], tripTypeTags: ['city','business','beach','hiking','backpacking'], isEssential: false },
  { _id: 'i23', name: 'Quick-Dry Towel',          category: 'Activity Gear',   climateTags: ['tropical','mediterranean'],   tripTypeTags: ['beach','backpacking'],                     isEssential: false },
  { _id: 'i24', name: 'Prescription Medications', category: 'Health & Safety', climateTags: ['tropical','cold','desert','mediterranean'], tripTypeTags: ['city','business','beach','hiking','backpacking'], isEssential: true },
  { _id: 'i25', name: 'Formal Dress Shoes',       category: 'Footwear',        climateTags: ['cold','mediterranean'],       tripTypeTags: ['business'],                                isEssential: true  },
];

export const mockTips = [
  { _id: 'tip1', title: "Roll, don't fold your clothes", description: 'Rolling clothes instead of folding saves up to 30% more space and reduces wrinkles on most fabrics. Works especially well for t-shirts and jeans.', authorId: 'u1', authorName: 'Rachit P.', tripTypeTags: ['backpacking','beach','city'], climateTags: ['tropical','mediterranean'], upvoteCount: 142, isVerified: true, isFeatured: true,  createdAt: '2025-11-10' },
  { _id: 'tip2', title: 'Always bring a compact power strip', description: 'Hotel rooms rarely have enough outlets. A compact power strip means you can charge everything at once without fighting over sockets.', authorId: 'u2', authorName: 'Marcus T.', tripTypeTags: ['business','city'], climateTags: ['cold','mediterranean'], upvoteCount: 98, isVerified: true, isFeatured: true,  createdAt: '2025-10-22' },
  { _id: 'tip3', title: 'Pack a lightweight scarf', description: 'A thin scarf doubles as a blanket on cold flights, a towel at the beach, and a modesty cover in temples. Most versatile item I own.', authorId: 'u3', authorName: 'Priya M.', tripTypeTags: ['city','beach','backpacking'], climateTags: ['tropical','cold','mediterranean'], upvoteCount: 76, isVerified: true, isFeatured: false, createdAt: '2025-09-15' },
  { _id: 'tip4', title: 'Download offline maps before boarding', description: "Google Maps offline or Maps.me can save you when you have no data roaming. Download your destination city before boarding.", authorId: 'u4', authorName: 'Alex R.', tripTypeTags: ['backpacking','city','beach'], climateTags: ['tropical','cold','desert','mediterranean'], upvoteCount: 115, isVerified: true, isFeatured: true,  createdAt: '2025-08-30' },
  { _id: 'tip5', title: 'Sock liners prevent blisters', description: 'Wearing a thin liner sock under your hiking socks dramatically reduces friction and prevents blisters on long trails. Game changer.', authorId: 'u3', authorName: 'Priya M.', tripTypeTags: ['hiking'], climateTags: ['cold','mediterranean'], upvoteCount: 88, isVerified: true, isFeatured: false, createdAt: '2025-07-12' },
  { _id: 'tip6', title: 'Screenshot all important documents', description: "Screenshot your hotel confirmations, flight details, and insurance info. Works without internet and saves you at every checkpoint.", authorId: 'u1', authorName: 'Rachit P.', tripTypeTags: ['city','backpacking','hiking'], climateTags: ['tropical','cold','desert','mediterranean'], upvoteCount: 54, isVerified: true, isFeatured: false, createdAt: '2025-06-20' },
];

export const categories  = ['Clothing','Footwear','Electronics','Toiletries','Documents','Health & Safety','Activity Gear'];
export const climates    = ['tropical','cold','desert','mediterranean'];
export const tripTypes   = ['beach','hiking','business','backpacking','city'];
export const luggageTypes = ['carry-on','checked'];

export const climateEmoji = { tropical: '🌴', cold: '❄️', desert: '🏜️', mediterranean: '☀️' };
export const typeEmoji    = { beach: '🏖️', hiking: '🏔️', business: '💼', backpacking: '🎒', city: '🌆' };
