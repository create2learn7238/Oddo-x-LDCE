/* GlobeTrotter seed script — run with: npx prisma db push && node prisma/seed.js */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// [name, country, region, costIndex, popularity, description, emoji, color, lat, lng]
const CITIES = [
  ['Ahmedabad', 'India', 'Gujarat', 2, 98, 'UNESCO Heritage city — Sabarmati ashram, pols, food & textiles.', '🦁', '#0d9488', 23.0225, 72.5714],
  ['Statue of Unity', 'India', 'Gujarat', 2, 97, 'World’s tallest statue, Kevadia valley & laser light show.', '🗿', '#b45309', 21.838, 73.7191],
  ['Rann of Kutch', 'India', 'Gujarat', 2, 96, 'White salt desert, handicrafts, moonlit nights & Rann Utsav.', '🐪', '#d97706', 23.7337, 69.8597],
  ['Jaipur', 'India', 'Rajasthan', 2, 95, 'The Pink City of palaces, forts and Rajasthani markets.', '🏰', '#ec4899', 26.9124, 75.7873],
  ['Udaipur', 'India', 'Rajasthan', 2, 94, 'Lake palaces and candlelit dinners on the lakes of Rajasthan.', '🛶', '#14b8a6', 24.5854, 73.7125],
  ['Goa', 'India', 'South India', 2, 93, 'Beaches, Portuguese charm, seafood and sunset shacks.', '🏖️', '#f97316', 15.2993, 74.124],
  ['Delhi', 'India', 'North India', 2, 92, 'The capital — Mughal forts, bustling bazaars and legendary street food.', '🕌', '#f59e0b', 28.6139, 77.209],
  ['Mumbai', 'India', 'Maharashtra', 2, 91, 'Bollywood, Marine Drive, Gateway of India and endless energy.', '🎬', '#8b5cf6', 19.076, 72.8777],
  ['Varanasi', 'India', 'North India', 1, 90, 'One of the oldest living cities on Earth — ghats, Ganga Aarti & temples.', '🕉️', '#eab308', 25.3176, 82.9739],
  ['Bangalore', 'India', 'South India', 2, 89, 'Gardens, microbreweries and the tech capital of India.', '🌆', '#22c55e', 12.9716, 77.5946],
  ['Bangkok', 'Thailand', 'Southeast Asia', 2, 85, 'Golden temples, floating markets and street food.', '🛕', '#e11d48', 13.7563, 100.5018],
  ['Singapore', 'Singapore', 'Southeast Asia', 5, 84, 'A futuristic city-state — Gardens by the Bay & skylines.', '🦁', '#0ea5e9', 1.3521, 103.8198],
  ['Bali', 'Indonesia', 'Southeast Asia', 2, 83, 'Rice terraces, surf beaches, temples and retreats.', '🌴', '#10b981', -8.3404, 115.092],
  ['Hanoi', 'Vietnam', 'Southeast Asia', 1, 80, 'Old Quarter cafés, street food and Ha Long Bay gateway.', '🍜', '#84cc16', 21.0278, 105.8342],
  ['Paris', 'France', 'Western Europe', 4, 78, 'The city of light — art, café culture and Eiffel Tower.', '🗼', '#6366f1', 48.8566, 2.3522],
  ['Rome', 'Italy', 'Southern Europe', 4, 76, 'Ancient ruins, Renaissance art and culinary heritage.', '🏛️', '#ef4444', 41.9028, 12.4964],
  ['Barcelona', 'Spain', 'Southern Europe', 4, 75, 'Gaudí masterpieces, beach days and tapas till late.', '⚽', '#f43f5e', 41.3874, 2.1686],
  ['London', 'United Kingdom', 'Western Europe', 5, 74, 'Royalty, museums, theatre and iconic landmarks.', '🎡', '#475569', 51.5074, -0.1278],
  ['Dubai', 'UAE', 'Middle East', 5, 72, 'Tallest tower, desert safaris and gold souks.', '🏙️', '#eab308', 25.2048, 55.2708],
  ['Tokyo', 'Japan', 'East Asia', 5, 70, 'Neon skylines, shrines and culinary excellence.', '🗾', '#ec4899', 35.6762, 139.6503],
];

const ACT = {
  0: [ // Ahmedabad
    ['Sabarmati Ashram Walk', 'culture', 2, 400, 'Walk the peaceful grounds of Gandhi’s historic residence.', '🕊️'],
    ['Heritage Pols Walk', 'sightseeing', 3, 650, 'Explore centuries-old carved wooden houses in Old Ahmedabad.', '🏛️'],
    ['Manek Chowk Night Street Food', 'food', 2, 850, 'Legendary midnight night market with butter maska & khavda sweets.', '🥘'],
    ['Adalaj Stepwell Architecture', 'sightseeing', 2, 500, 'Intricate 5-story underground stepwell structure.', '🕌'],
  ],
  1: [ // Statue of Unity
    ['Statue Viewing Gallery Deck', 'sightseeing', 3, 1250, 'Elevator ride to the chest-level viewing gallery 153m up.', '🗿'],
    ['Narmada River Laser & Sound Show', 'culture', 2, 500, 'Night light projection show on the world’s tallest statue.', '✨'],
    ['Jungle Safari & Butterfly Park', 'outdoors', 4, 1500, 'Eco-park with exotic birds, flora and animal habitats.', '🦋'],
  ],
  2: [ // Rann of Kutch
    ['White Desert Sunset Walk', 'outdoors', 3, 950, 'Watch the salt plains glow violet and amber at dusk.', '🌅'],
    ['Kutch Handicraft Village Tour', 'culture', 3, 1400, 'Ajrakh block printing, Rogan art & embroidery workshops.', '🧵'],
    ['Full Moon Salt Desert Night Walk', 'adventure', 2, 1100, 'Ethereal silver salt desert under a glowing full moon.', '🌕'],
  ],
  3: [ // Jaipur
    ['Amber Fort & elephant trail', 'sightseeing', 4, 900, 'Mirror palaces and ramparts above the city.', '🐘'],
    ['Hawa Mahal & City Palace', 'culture', 3, 750, 'The wind palace and royal museum complex.', '👑'],
    ['Rajasthani Thali Feast', 'food', 2, 1200, 'Authentic multi-course royal dining experience.', '🍛'],
  ],
  4: [ // Udaipur
    ['Lake Pichola Sunset Boat Ride', 'sightseeing', 2, 800, 'Cruising past Jag Mandir & Lake Palace at dusk.', '🛶'],
    ['City Palace Museum Walk', 'culture', 3, 600, 'Exploring royal courts, glass galleries and armor.', '🏰'],
  ],
};

async function main() {
  console.log('Seeding GlobeTrotter database with India & Gujarat priority…');
  await prisma.stopActivity.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();
  await prisma.city.deleteMany();

  const cities = [];
  for (const c of CITIES) {
    cities.push(
      await prisma.city.create({
        data: {
          name: c[0], country: c[1], region: c[2], costIndex: c[3], popularity: c[4],
          description: c[5], emoji: c[6], color: c[7], lat: c[8], lng: c[9],
        },
      })
    );
  }
  console.log(`  ${cities.length} cities created`);

  let actCount = 0;
  for (const [idx, list] of Object.entries(ACT)) {
    const city = cities[Number(idx)];
    if (!city) continue;
    for (const a of list) {
      await prisma.activity.create({
        data: { cityId: city.id, name: a[0], type: a[1], duration: a[2], cost: a[3], description: a[4], emoji: a[5] },
      });
      actCount++;
    }
  }
  console.log(`  ${actCount} activities created`);

  const passwordHash = await bcrypt.hash('demo123', 10);
  const adminHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: { name: 'Globe Admin', email: 'admin@globetrotter.app', password: passwordHash, isAdmin: true, language: 'en' },
  });

  const demo = await prisma.user.create({
    data: { name: 'Aarav Sharma', email: 'demo@globetrotter.app', password: passwordHash, language: 'en', photo: null },
  });

  const alex = await prisma.user.create({
    data: { name: 'Alex Johnson', email: 'alex@demo.com', password: passwordHash, language: 'en', photo: null },
  });

  const now = new Date();
  const d = (offset) => new Date(now.getTime() + offset * 86400000);

  // Demo trip: Vibrant Gujarat & Rajasthan Explorer
  const trip = await prisma.trip.create({
    data: {
      name: 'Vibrant Gujarat & Rajasthan Circuit',
      description: 'UNESCO Heritage Ahmedabad, Statue of Unity, White Rann of Kutch & Lake Palaces of Udaipur.',
      startDate: d(15), endDate: d(25),
      coverEmoji: '🦁', coverColor: '#0d9488', budgetTotal: 28500,
      isPublic: true, shareToken: 'india-explorer', userId: demo.id,
    },
  });

  const [ahm, sou, kutch, udaipur] = [cities[0], cities[1], cities[2], cities[4]];
  
  const stopAhm = await prisma.stop.create({
    data: { tripId: trip.id, cityId: ahm.id, arrivalDate: d(15), departureDate: d(17), sequence: 0, notes: 'Arrive at Sardar Vallabhbhai Patel International Airport.' },
  });
  const stopSou = await prisma.stop.create({
    data: { tripId: trip.id, cityId: sou.id, arrivalDate: d(17), departureDate: d(19), sequence: 1, notes: 'Express train to Kevadia station.' },
  });
  const stopKutch = await prisma.stop.create({
    data: { tripId: trip.id, cityId: kutch.id, arrivalDate: d(19), departureDate: d(22), sequence: 2, notes: 'Stay in tentative tent city at Dhordo.' },
  });
  const stopUdaipur = await prisma.stop.create({
    data: { tripId: trip.id, cityId: udaipur.id, arrivalDate: d(22), departureDate: d(25), sequence: 3 },
  });

  console.log('Seed completed successfully!');
  console.log('Users: demo@globetrotter.app / demo123 | alex@demo.com / demo123 | admin@globetrotter.app / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
