// ============================================================
// SEED DATA – Cities, Activities, Demo Trips (Gujarat & Global)
// ============================================================

export const cities = [
  // ── Gujarat & Western India Cultural & Wildlife Circuit ──
  {
    id: 'c-ahmedabad',
    name: 'Ahmedabad',
    country: 'India',
    region: 'India',
    emoji: '🕌',
    costIndex: 'Low',
    popularity: 99,
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=800&auto=format&fit=crop&q=80',
    description: "India's first UNESCO World Heritage City, famous for historic wooden Pols, Gandhi Ashram, and the 5-story Adalaj Stepwell.",
    avgDailyCost: 40,
    tags: ['UNESCO Heritage', 'Food Capital', 'Architecture', 'Handicrafts'],
  },
  {
    id: 'c-kutch',
    name: 'Rann of Kutch',
    country: 'India',
    region: 'India',
    emoji: '🎪',
    costIndex: 'Medium',
    popularity: 98,
    image: 'https://images.unsplash.com/photo-1609137144822-79015c7e14d3?w=800&auto=format&fit=crop&q=80',
    description: "World-famous endless White Salt Desert glowing under starlit and full-moon skies, luxury tent cities, and Rogan art artisans.",
    avgDailyCost: 75,
    tags: ['White Desert', 'Rann Utsav', 'Stargazing', 'Artisan Villages'],
  },
  {
    id: 'c-sou',
    name: 'Statue of Unity',
    country: 'India',
    region: 'India',
    emoji: '🗿',
    costIndex: 'Medium',
    popularity: 97,
    image: 'https://images.unsplash.com/photo-1629813352774-722a49b6f849?w=800&auto=format&fit=crop&q=80',
    description: "The world's tallest monument standing at 182 meters in Ekta Nagar, overlooking Sardar Sarovar Dam and the scenic Narmada valley.",
    avgDailyCost: 65,
    tags: ['World Record', 'Scenic Valley', 'Laser Show', 'Eco-Tourism'],
  },
  {
    id: 'c-gir',
    name: 'Gir National Park',
    country: 'India',
    region: 'India',
    emoji: '🦁',
    costIndex: 'Medium',
    popularity: 96,
    image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800&auto=format&fit=crop&q=80',
    description: "The sole global sanctuary of the wild Asiatic Lion. Experience thrilling morning open Gypsy safaris in dry deciduous scrub forests.",
    avgDailyCost: 80,
    tags: ['Asiatic Lions', 'Wildlife Safari', 'Birdwatching', 'Nature Reserve'],
  },
  {
    id: 'c-somnath',
    name: 'Somnath',
    country: 'India',
    region: 'India',
    emoji: '🛕',
    costIndex: 'Low',
    popularity: 94,
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80',
    description: "The first among twelve sacred Jyotirlingas, perched dramatically on the rugged shores of the Arabian Sea with evening sea aartis.",
    avgDailyCost: 45,
    tags: ['Jyotirlinga Shrine', 'Ocean Temple', 'Spiritual', 'Light & Sound Show'],
  },
  {
    id: 'c-dwarka',
    name: 'Dwarka',
    country: 'India',
    region: 'India',
    emoji: '👑',
    costIndex: 'Low',
    popularity: 95,
    image: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?w=800&auto=format&fit=crop&q=80',
    description: "Ancient kingdom of Lord Krishna, Char Dham pilgrimage site, Gomti Ghat aartis, and the pristine blue waters of Shivrajpur Blue Flag Beach.",
    avgDailyCost: 50,
    tags: ['Char Dham', 'Blue Flag Beach', 'Krishna Kingdom', 'Marine Life'],
  },
  {
    id: 'c-vadodara',
    name: 'Vadodara',
    country: 'India',
    region: 'India',
    emoji: '🏰',
    costIndex: 'Low',
    popularity: 91,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    description: "The cultural capital of Gujarat, home to the magnificent 500-room Laxmi Vilas Palace (4x the size of Buckingham Palace) and art galleries.",
    avgDailyCost: 45,
    tags: ['Royal Palaces', 'Navratri Capital', 'Museums', 'Art Heritage'],
  },
  {
    id: 'c-surat',
    name: 'Surat',
    country: 'India',
    region: 'India',
    emoji: '💎',
    costIndex: 'Low',
    popularity: 92,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    description: "India's culinary and textile hub on the Tapi River, world-famous for Surati Locho, Ghari sweets, silk sarees, and diamond polishing.",
    avgDailyCost: 40,
    tags: ['Street Food Capital', 'Silk Markets', 'Diamond City', 'Tapi Riverfront'],
  },
  {
    id: 'c-patan',
    name: 'Patan & Modhera',
    country: 'India',
    region: 'India',
    emoji: '🏛️',
    costIndex: 'Low',
    popularity: 93,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
    description: "Home to the UNESCO Rani ki Vav 7-level inverted stepwell with 800+ intricate sculptures and the 1026 AD Solanki-era Sun Temple.",
    avgDailyCost: 40,
    tags: ['UNESCO Stepwell', 'Sun Temple', 'Double-Ikat Silk', 'Ancient History'],
  },

  // ── Iconic Global Metropolises ──
  {
    id: 'c1', name: 'Paris', country: 'France', region: 'Europe',
    emoji: '🗼', costIndex: 'High', popularity: 98,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop&q=80',
    description: 'The City of Light, renowned for art, fashion, gastronomy, and the Eiffel Tower.',
    avgDailyCost: 180,
    tags: ['Romance', 'Art', 'Food', 'History'],
  },
  {
    id: 'c2', name: 'Tokyo', country: 'Japan', region: 'Asia',
    emoji: '🗾', costIndex: 'Medium', popularity: 95,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80',
    description: 'A metropolis where centuries-old Shinto traditions meet neon skyscraper alleys.',
    avgDailyCost: 150,
    tags: ['Tech', 'Food', 'Culture', 'Shopping'],
  },
  {
    id: 'c3', name: 'Bali', country: 'Indonesia', region: 'Asia',
    emoji: '🌴', costIndex: 'Low', popularity: 90,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
    description: 'Island of Gods – breathtaking volcanic rice terraces, sea temples, and surf beaches.',
    avgDailyCost: 60,
    tags: ['Beach', 'Spiritual', 'Nature', 'Adventure'],
  },
  {
    id: 'c5', name: 'Rome', country: 'Italy', region: 'Europe',
    emoji: '🏛️', costIndex: 'Medium', popularity: 93,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80',
    description: 'The Eternal City with millennia of Roman ruins, Colosseum, and vibrant trattorias.',
    avgDailyCost: 130,
    tags: ['History', 'Food', 'Art', 'Architecture'],
  },
  {
    id: 'c6', name: 'Dubai', country: 'UAE', region: 'Middle East',
    emoji: '🏙️', costIndex: 'High', popularity: 88,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
    description: 'Futuristic desert oasis with the world-record Burj Khalifa, luxury souks, and safari dunes.',
    avgDailyCost: 200,
    tags: ['Luxury', 'Shopping', 'Adventure', 'Architecture'],
  },
  {
    id: 'c8', name: 'Santorini', country: 'Greece', region: 'Europe',
    emoji: '🏝️', costIndex: 'High', popularity: 89,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80',
    description: 'Iconic white-washed caldera cliffs, volcanic blue dome churches, and breathtaking Aegean sunsets.',
    avgDailyCost: 190,
    tags: ['Romance', 'Beach', 'Photography', 'Scenic'],
  },
  {
    id: 'c11', name: 'Kyoto', country: 'Japan', region: 'Asia',
    emoji: '⛩️', costIndex: 'Medium', popularity: 92,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    description: 'Ancient imperial temples, Fushimi Inari torii gates, geisha tea houses, and bamboo groves.',
    avgDailyCost: 130,
    tags: ['History', 'Culture', 'Nature', 'Spiritual'],
  }
]

export const activities = [
  // ── Gujarat Experiences ──
  { id: 'act-amd-1', cityId: 'c-ahmedabad', name: 'Old City Pol Heritage Walk', category: 'Cultural', cost: 10, duration: '3h', emoji: '🚶', description: 'Explore carved wooden havelis, secret underground passages, and feeding towers (Chabutras).' },
  { id: 'act-amd-2', cityId: 'c-ahmedabad', name: 'Sabarmati Gandhi Ashram & Museum', category: 'History', cost: 0, duration: '2h', emoji: '🕊️', description: 'Visit the peaceful riverside retreat of Mahatma Gandhi and spin a traditional charkha wheel.' },
  { id: 'act-amd-3', cityId: 'c-ahmedabad', name: 'Adalaj Stepwell Architectural Tour', category: 'Architecture', cost: 5, duration: '2h', emoji: '🏛️', description: 'Descend 5 carved subterranean levels of intricate Indo-Islamic Solanki masonry.' },
  { id: 'act-amd-4', cityId: 'c-ahmedabad', name: 'Manek Chowk Midnight Street Feast', category: 'Food', cost: 15, duration: '2h', emoji: '🍱', description: 'Taste chocolate sandwiches, Surati ghari, pineapple pizzas, and kulfi at the famous jewelry-square-turned-food-hub.' },

  { id: 'act-kut-1', cityId: 'c-kutch', name: 'Full-Moon White Desert Starlight Walk', category: 'Nature', cost: 15, duration: '4h', emoji: '🌌', description: 'Walk across the infinite white salt plains illuminated under radiant full-moon light.' },
  { id: 'act-kut-2', cityId: 'c-kutch', name: 'Nirona Master Rogan Art Workshop', category: 'Art', cost: 20, duration: '2h', emoji: '🎨', description: 'Learn the ancient castor oil freehand painting technique directly from Padma Shri master artisans.' },
  { id: 'act-kut-3', cityId: 'c-kutch', name: 'Sunset Camel Safari on Salt Plains', category: 'Adventure', cost: 25, duration: '2h', emoji: '🐪', description: 'Ride across Dhordo horizon with sunset colors casting golden reflections.' },

  { id: 'act-sou-1', cityId: 'c-sou', name: 'Viewing Gallery at 153m (Chest Level)', category: 'Sightseeing', cost: 20, duration: '2h', emoji: '🗿', description: 'High-speed elevator ride to the interior viewing gallery for vistas of Sardar Sarovar Dam.' },
  { id: 'act-sou-2', cityId: 'c-sou', name: 'Valley of Flowers & Cactus Garden', category: 'Nature', cost: 8, duration: '2h', emoji: '🌺', description: 'Walk through 24 acres of vibrant exotic botanical blooms along Narmada banks.' },
  { id: 'act-sou-3', cityId: 'c-sou', name: 'Evening High-Tech Laser Projection Show', category: 'Entertainment', cost: 12, duration: '1h', emoji: '✨', description: 'World-class 3D mapping laser light projection detailing the story of India\'s Iron Man.' },

  { id: 'act-gir-1', cityId: 'c-gir', name: 'Open Gypsy Asiatic Lion Safari (Slot 1)', category: 'Wildlife', cost: 50, duration: '3.5h', emoji: '🦁', description: 'Early morning 6:00 AM jeep safari tracking wild lionesses, cubs, and leopards in core Gir forest.' },
  { id: 'act-gir-2', cityId: 'c-gir', name: 'Devalia Safari Park Interpretation Zone', category: 'Wildlife', cost: 20, duration: '2h', emoji: '🦌', description: 'Fenced conservation safari guaranteed to view spotted deer, blackbucks, and Asiatic lions.' },

  { id: 'act-som-1', cityId: 'c-somnath', name: 'Sunset Arabian Sea Shore Aarti', category: 'Spiritual', cost: 0, duration: '1.5h', emoji: '🛕', description: 'Experience the thunderous ocean waves crashing against ancient stone while sacred conch shells echo.' },
  { id: 'act-som-2', cityId: 'c-somnath', name: 'Sound & Light Historic Narrated Show', category: 'Cultural', cost: 6, duration: '1h', emoji: '🎭', description: 'Voice of Amitabh Bachchan narrating the eternal resilience of Somnath through the ages.' },

  { id: 'act-dwk-1', cityId: 'c-dwarka', name: 'Dwarkadhish 52-Yard Dhwaja Hoisting', category: 'Spiritual', cost: 0, duration: '2h', emoji: '👑', description: 'Witness the grand flag changing ceremony at the 5-story Jagat Mandir spire.' },
  { id: 'act-dwk-2', cityId: 'c-dwarka', name: 'Shivrajpur Blue Flag Beach & Scuba', category: 'Beach', cost: 30, duration: '3h', emoji: '🌊', description: 'Crystal-clear certified Blue Flag beach with dolphin spotting and coral reef scuba diving.' },

  // ── Global Experiences ──
  { id: 'a1', cityId: 'c1', name: 'Eiffel Tower Summit', category: 'Sightseeing', cost: 28, duration: '3h', emoji: '🗼', description: 'Ascend the iconic iron tower for panoramic views of Paris.' },
  { id: 'a2', cityId: 'c1', name: 'Louvre Museum Mona Lisa', category: 'Museum', cost: 20, duration: '4h', emoji: '🎨', description: 'Explore the world\'s largest art museum, home to the Mona Lisa.' },
  { id: 'a5', cityId: 'c2', name: 'Shibuya Crossing & Skytree', category: 'Sightseeing', cost: 20, duration: '2h', emoji: '🚦', description: 'Experience the world\'s busiest pedestrian intersection.' },
  { id: 'a15', cityId: 'c5', name: 'Colosseum Gladiators Arena', category: 'Sightseeing', cost: 18, duration: '3h', emoji: '🏛️', description: 'Step inside the ancient Roman amphitheater active 2,000 years ago.' }
]

// ── Demo Users ──────────────────────────────────────────────
export const demoUsers = [
  { id: 'u1', name: 'Alex Rivera', email: 'alex@demo.com', password: 'demo123', avatar: null, role: 'admin', joinDate: '2025-01-15' },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@demo.com', password: 'demo123', avatar: null, role: 'user', joinDate: '2025-03-10' },
]

// ── Demo Trips ───────────────────────────────────────────────
export const seedTrips = [
  {
    id: 'trip-gujarat-grand',
    userId: 'u1',
    name: '🦁 Grand Gujarat Heritage & Wildlife Safari',
    description: 'An unforgettable 8-day expedition across UNESCO Ahmedabad, Sasan Gir Asiatic Lions, White Rann, and the 182m Statue of Unity.',
    startDate: '2026-11-10',
    endDate: '2026-11-18',
    coverColor: '#F59E0B',
    isPublic: true,
    totalBudget: 950,
    stops: [
      {
        id: 's-amd', cityId: 'c-ahmedabad', cityName: 'Ahmedabad', emoji: '🕌',
        startDate: '2026-11-10', endDate: '2026-11-12',
        accommodation: 'The House of MG Heritage Haveli', accommodationCost: 65,
        transportCost: 30,
        activities: [
          { ...activities.find(a => a.id === 'act-amd-1'), scheduledDate: '2026-11-10', time: '08:30', notes: 'Camera permitted' },
          { ...activities.find(a => a.id === 'act-amd-3'), scheduledDate: '2026-11-11', time: '10:00', notes: 'Incredible Solanki carving' },
          { ...activities.find(a => a.id === 'act-amd-4'), scheduledDate: '2026-11-11', time: '21:30', notes: 'Try Surati kulfi & pav bhaji' }
        ]
      },
      {
        id: 's-gir', cityId: 'c-gir', cityName: 'Gir National Park', emoji: '🦁',
        startDate: '2026-11-13', endDate: '2026-11-15',
        accommodation: 'The Fern Gir Forest Jungle Resort', accommodationCost: 95,
        transportCost: 45,
        activities: [
          { ...activities.find(a => a.id === 'act-gir-1'), scheduledDate: '2026-11-14', time: '06:00', notes: 'Carry binoculars & telephoto' }
        ]
      },
      {
        id: 's-kut', cityId: 'c-kutch', cityName: 'Rann of Kutch', emoji: '🎪',
        startDate: '2026-11-16', endDate: '2026-11-18',
        accommodation: 'Dhordo White Rann Luxury Tent City', accommodationCost: 110,
        transportCost: 50,
        activities: [
          { ...activities.find(a => a.id === 'act-kut-1'), scheduledDate: '2026-11-16', time: '19:00', notes: 'Full moon starlight walk' },
          { ...activities.find(a => a.id === 'act-kut-2'), scheduledDate: '2026-11-17', time: '11:00', notes: 'Khatri Rogan art demo' }
        ]
      }
    ]
  },
  {
    id: 'trip1',
    userId: 'u1',
    name: '🗼 European Classic Highlights',
    description: 'A scenic tour through Paris and Rome.',
    startDate: '2026-09-01',
    endDate: '2026-09-08',
    coverColor: '#6C63FF',
    isPublic: true,
    totalBudget: 1800,
    stops: [
      {
        id: 's1', cityId: 'c1', cityName: 'Paris', emoji: '🗼',
        startDate: '2026-09-01', endDate: '2026-09-04',
        accommodation: 'Hotel Le Marais Paris', accommodationCost: 160,
        transportCost: 150,
        activities: [
          { ...activities.find(a => a.id === 'a1'), scheduledDate: '2026-09-02', time: '10:00', notes: 'Pre-booked elevator' },
          { ...activities.find(a => a.id === 'a2'), scheduledDate: '2026-09-03', time: '09:00', notes: 'Mona Lisa wing' }
        ]
      }
    ]
  }
]
