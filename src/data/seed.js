// ============================================================
// SEED DATA – Cities, Activities, Demo Trips
// ============================================================

export const cities = [
  {
    id: 'c1', name: 'Paris', country: 'France', region: 'Europe',
    emoji: '🗼', costIndex: 'High', popularity: 98,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80',
    description: 'The City of Light, renowned for art, fashion, gastronomy, and culture.',
    avgDailyCost: 180,
    tags: ['Romance', 'Art', 'Food', 'History'],
  },
  {
    id: 'c2', name: 'Tokyo', country: 'Japan', region: 'Asia',
    emoji: '🗾', costIndex: 'Medium', popularity: 95,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
    description: 'A city where ancient tradition meets futuristic innovation.',
    avgDailyCost: 150,
    tags: ['Tech', 'Food', 'Culture', 'Shopping'],
  },
  {
    id: 'c3', name: 'Bali', country: 'Indonesia', region: 'Asia',
    emoji: '🌴', costIndex: 'Low', popularity: 90,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
    description: 'Island of Gods – breathtaking rice terraces, temples, and beaches.',
    avgDailyCost: 60,
    tags: ['Beach', 'Spiritual', 'Nature', 'Adventure'],
  },
  {
    id: 'c4', name: 'New York', country: 'USA', region: 'Americas',
    emoji: '🗽', costIndex: 'High', popularity: 97,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80',
    description: 'The city that never sleeps – skyscrapers, art, and vibrant culture.',
    avgDailyCost: 220,
    tags: ['Shopping', 'Art', 'Food', 'Nightlife'],
  },
  {
    id: 'c5', name: 'Rome', country: 'Italy', region: 'Europe',
    emoji: '🏛️', costIndex: 'Medium', popularity: 93,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80',
    description: 'The Eternal City with millennia of history at every corner.',
    avgDailyCost: 130,
    tags: ['History', 'Food', 'Art', 'Architecture'],
  },
  {
    id: 'c6', name: 'Dubai', country: 'UAE', region: 'Middle East',
    emoji: '🏙️', costIndex: 'High', popularity: 88,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80',
    description: 'Ultra-modern marvel with luxury shopping and record-breaking architecture.',
    avgDailyCost: 200,
    tags: ['Luxury', 'Shopping', 'Adventure', 'Architecture'],
  },
  {
    id: 'c7', name: 'Barcelona', country: 'Spain', region: 'Europe',
    emoji: '🎨', costIndex: 'Medium', popularity: 91,
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80',
    description: 'Gaudí\'s masterpieces, beach, tapas, and vibrant nightlife.',
    avgDailyCost: 120,
    tags: ['Art', 'Beach', 'Food', 'Architecture'],
  },
  {
    id: 'c8', name: 'Santorini', country: 'Greece', region: 'Europe',
    emoji: '🏝️', costIndex: 'High', popularity: 89,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80',
    description: 'Iconic white-washed cliffs, volcanic beaches, and stunning sunsets.',
    avgDailyCost: 190,
    tags: ['Romance', 'Beach', 'Photography', 'Scenic'],
  },
  {
    id: 'c9', name: 'Bangkok', country: 'Thailand', region: 'Asia',
    emoji: '🙏', costIndex: 'Low', popularity: 87,
    image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&q=80',
    description: 'Vibrant street life, ornate temples, and incredible street food.',
    avgDailyCost: 50,
    tags: ['Food', 'Culture', 'Nightlife', 'Shopping'],
  },
  {
    id: 'c10', name: 'Cape Town', country: 'South Africa', region: 'Africa',
    emoji: '🦁', costIndex: 'Medium', popularity: 85,
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80',
    description: 'Table Mountain, wine country, and stunning coastline.',
    avgDailyCost: 90,
    tags: ['Nature', 'Adventure', 'Scenic', 'Wine'],
  },
  {
    id: 'c11', name: 'Kyoto', country: 'Japan', region: 'Asia',
    emoji: '⛩️', costIndex: 'Medium', popularity: 92,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80',
    description: 'Ancient temples, geisha districts, and bamboo forests.',
    avgDailyCost: 130,
    tags: ['History', 'Culture', 'Nature', 'Spiritual'],
  },
  {
    id: 'c12', name: 'Amsterdam', country: 'Netherlands', region: 'Europe',
    emoji: '🌷', costIndex: 'Medium', popularity: 88,
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=80',
    description: 'Canal rings, world-class museums, and cycling culture.',
    avgDailyCost: 140,
    tags: ['History', 'Art', 'Nature', 'Cycling'],
  },
]

export const activities = [
  { id: 'a1', cityId: 'c1', name: 'Eiffel Tower Visit', category: 'Sightseeing', cost: 28, duration: '3h', emoji: '🗼', description: 'Ascend the iconic iron tower for panoramic views of Paris.' },
  { id: 'a2', cityId: 'c1', name: 'Louvre Museum', category: 'Museum', cost: 20, duration: '4h', emoji: '🎨', description: 'Explore the world\'s largest art museum, home to the Mona Lisa.' },
  { id: 'a3', cityId: 'c1', name: 'Seine River Cruise', category: 'Tour', cost: 35, duration: '2h', emoji: '🚢', description: 'Glide past Paris\' iconic landmarks on a scenic river cruise.' },
  { id: 'a4', cityId: 'c1', name: 'Montmartre Food Walk', category: 'Food', cost: 55, duration: '3h', emoji: '🥐', description: 'Taste crepes, croissants, and wine in charming Montmartre.' },

  { id: 'a5', cityId: 'c2', name: 'Shibuya Crossing', category: 'Sightseeing', cost: 0, duration: '1h', emoji: '🚦', description: 'Experience the world\'s busiest pedestrian crossing.' },
  { id: 'a6', cityId: 'c2', name: 'Tsukiji Market Tour', category: 'Food', cost: 40, duration: '3h', emoji: '🍣', description: 'Fresh sushi breakfast at the famous outer Tsukiji market.' },
  { id: 'a7', cityId: 'c2', name: 'teamLab Borderless', category: 'Art', cost: 32, duration: '3h', emoji: '💡', description: 'Immersive digital art museum with walk-through light installations.' },
  { id: 'a8', cityId: 'c2', name: 'Meiji Shrine', category: 'Cultural', cost: 0, duration: '2h', emoji: '⛩️', description: 'Tranquil Shinto shrine in the heart of Tokyo\'s busiest district.' },

  { id: 'a9',  cityId: 'c3', name: 'Ubud Rice Terraces', category: 'Nature', cost: 15, duration: '4h', emoji: '🌾', description: 'Trek through stunning emerald-green rice paddies.' },
  { id: 'a10', cityId: 'c3', name: 'Tanah Lot Temple', category: 'Cultural', cost: 5, duration: '2h', emoji: '🛕', description: 'Sea temple perched on a rock, beautiful at sunset.' },
  { id: 'a11', cityId: 'c3', name: 'Bali Surf Lesson', category: 'Adventure', cost: 30, duration: '3h', emoji: '🏄', description: 'Learn to surf on Kuta Beach with expert instructors.' },

  { id: 'a12', cityId: 'c4', name: 'Central Park Walk', category: 'Nature', cost: 0, duration: '2h', emoji: '🌳', description: 'Stroll through 843 acres of urban park in Manhattan.' },
  { id: 'a13', cityId: 'c4', name: 'Metropolitan Museum', category: 'Museum', cost: 25, duration: '4h', emoji: '🖼️', description: 'One of the world\'s largest art collections spanning 5,000 years.' },
  { id: 'a14', cityId: 'c4', name: 'Broadway Show', category: 'Entertainment', cost: 120, duration: '3h', emoji: '🎭', description: 'Experience the magic of a live Broadway performance.' },

  { id: 'a15', cityId: 'c5', name: 'Colosseum Tour', category: 'Sightseeing', cost: 18, duration: '3h', emoji: '🏛️', description: 'Step inside the ancient Roman amphitheater, active 2,000 years ago.' },
  { id: 'a16', cityId: 'c5', name: 'Vatican Museums', category: 'Museum', cost: 30, duration: '4h', emoji: '🕍', description: 'Home to the Sistine Chapel and millennia of religious art.' },
  { id: 'a17', cityId: 'c5', name: 'Roman Food Tour', category: 'Food', cost: 65, duration: '4h', emoji: '🍝', description: 'Pasta, gelato, and espresso walking tour through Trastevere.' },

  { id: 'a18', cityId: 'c6', name: 'Burj Khalifa Observation', category: 'Sightseeing', cost: 35, duration: '2h', emoji: '🏙️', description: 'View Dubai from the world\'s tallest building.' },
  { id: 'a19', cityId: 'c6', name: 'Desert Safari', category: 'Adventure', cost: 80, duration: '6h', emoji: '🐪', description: 'Dune bashing, camel riding, and a traditional Bedouin dinner.' },

  { id: 'a20', cityId: 'c7', name: 'Sagrada Familia', category: 'Sightseeing', cost: 26, duration: '3h', emoji: '⛪', description: 'Gaudí\'s masterpiece — a UNESCO World Heritage basilica.' },
  { id: 'a21', cityId: 'c7', name: 'La Barceloneta Beach', category: 'Beach', cost: 0, duration: '3h', emoji: '🏖️', description: 'Relax on Barcelona\'s famous city beach.' },
  { id: 'a22', cityId: 'c7', name: 'Tapas Bar Crawl', category: 'Food', cost: 45, duration: '4h', emoji: '🥘', description: 'Sample patatas bravas, jamón, and local wines.' },
]

// ── Demo Users ──────────────────────────────────────────────
export const demoUsers = [
  { id: 'u1', name: 'Alex Rivera', email: 'alex@demo.com', password: 'demo123', avatar: null, role: 'admin', joinDate: '2025-01-15' },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@demo.com', password: 'demo123', avatar: null, role: 'user', joinDate: '2025-03-10' },
]

// ── Demo Trips ───────────────────────────────────────────────
export const seedTrips = [
  {
    id: 'trip1',
    userId: 'u1',
    name: 'European Dream',
    description: 'A 2-week journey through the heart of Europe',
    startDate: '2026-09-01',
    endDate: '2026-09-15',
    coverColor: '#6C63FF',
    isPublic: true,
    totalBudget: 3000,
    stops: [
      {
        id: 's1', cityId: 'c1', cityName: 'Paris', emoji: '🗼',
        startDate: '2026-09-01', endDate: '2026-09-05',
        accommodation: 'Hotel Le Marais', accommodationCost: 160,
        transportCost: 250,
        activities: [
          { ...activities.find(a => a.id === 'a1'), scheduledDate: '2026-09-02', time: '10:00', notes: 'Book tickets in advance!' },
          { ...activities.find(a => a.id === 'a2'), scheduledDate: '2026-09-03', time: '09:00', notes: '' },
          { ...activities.find(a => a.id === 'a3'), scheduledDate: '2026-09-04', time: '18:00', notes: 'Sunset cruise' },
        ]
      },
      {
        id: 's2', cityId: 'c5', cityName: 'Rome', emoji: '🏛️',
        startDate: '2026-09-05', endDate: '2026-09-10',
        accommodation: 'Airbnb near Trastevere', accommodationCost: 120,
        transportCost: 200,
        activities: [
          { ...activities.find(a => a.id === 'a15'), scheduledDate: '2026-09-06', time: '09:00', notes: '' },
          { ...activities.find(a => a.id === 'a16'), scheduledDate: '2026-09-07', time: '10:00', notes: 'Pre-book entry!' },
          { ...activities.find(a => a.id === 'a17'), scheduledDate: '2026-09-08', time: '17:00', notes: '' },
        ]
      },
      {
        id: 's3', cityId: 'c7', cityName: 'Barcelona', emoji: '🎨',
        startDate: '2026-09-10', endDate: '2026-09-15',
        accommodation: 'Boutique Hotel Gothic Quarter', accommodationCost: 140,
        transportCost: 180,
        activities: [
          { ...activities.find(a => a.id === 'a20'), scheduledDate: '2026-09-11', time: '10:00', notes: '' },
          { ...activities.find(a => a.id === 'a21'), scheduledDate: '2026-09-12', time: '14:00', notes: '' },
          { ...activities.find(a => a.id === 'a22'), scheduledDate: '2026-09-13', time: '19:00', notes: 'Evening crawl' },
        ]
      }
    ],
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'trip2',
    userId: 'u1',
    name: 'Asian Adventure',
    description: 'Exploring the best of Southeast & East Asia',
    startDate: '2026-11-10',
    endDate: '2026-11-25',
    coverColor: '#FF6584',
    isPublic: false,
    totalBudget: 2500,
    stops: [
      {
        id: 's4', cityId: 'c2', cityName: 'Tokyo', emoji: '🗾',
        startDate: '2026-11-10', endDate: '2026-11-15',
        accommodation: 'Shinjuku Capsule Hotel', accommodationCost: 60,
        transportCost: 120,
        activities: [
          { ...activities.find(a => a.id === 'a5'), scheduledDate: '2026-11-11', time: '10:00', notes: '' },
          { ...activities.find(a => a.id === 'a6'), scheduledDate: '2026-11-12', time: '07:00', notes: 'Wake up early!' },
          { ...activities.find(a => a.id === 'a7'), scheduledDate: '2026-11-13', time: '14:00', notes: '' },
        ]
      },
      {
        id: 's5', cityId: 'c3', cityName: 'Bali', emoji: '🌴',
        startDate: '2026-11-15', endDate: '2026-11-25',
        accommodation: 'Villa Ubud', accommodationCost: 80,
        transportCost: 200,
        activities: [
          { ...activities.find(a => a.id === 'a9'), scheduledDate: '2026-11-16', time: '08:00', notes: '' },
          { ...activities.find(a => a.id === 'a10'), scheduledDate: '2026-11-18', time: '16:00', notes: 'Watch the sunset!' },
          { ...activities.find(a => a.id === 'a11'), scheduledDate: '2026-11-20', time: '09:00', notes: '' },
        ]
      }
    ],
    createdAt: '2026-08-10T14:00:00Z',
  }
]
