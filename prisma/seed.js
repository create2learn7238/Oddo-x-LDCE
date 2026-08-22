/* GlobeTrotter seed script — run with: npx prisma db push && node prisma/seed.js */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// [name, country, region, costIndex, popularity, description, emoji, color, lat, lng]
const CITIES = [
  ['Ahmedabad', 'India', 'South Asia', 2, 85, 'UNESCO Heritage city — Sabarmati ashram, pols, food & textiles.', '🦁', '#0d9488', 23.0225, 72.5714],
  ['Rann of Kutch', 'India', 'South Asia', 2, 80, 'White salt desert, handicrafts, moonlit nights & Rann Utsav.', '🐪', '#d97706', 23.7337, 69.8597],
  ['Statue of Unity', 'India', 'South Asia', 2, 86, 'World’s tallest statue, Kevadia valley & laser light show.', '🗿', '#b45309', 21.838, 73.7191],
  ['Delhi', 'India', 'South Asia', 2, 88, 'The capital — Mughal forts, bustling bazaars and legendary street food.', '🕌', '#f59e0b', 28.6139, 77.209],
  ['Jaipur', 'India', 'South Asia', 2, 82, 'The Pink City of palaces, forts and Rajasthani markets.', '🏰', '#ec4899', 26.9124, 75.7873],
  ['Udaipur', 'India', 'South Asia', 2, 74, 'Lake palaces and candlelit dinners on the lakes of Rajasthan.', '🛶', '#14b8a6', 24.5854, 73.7125],
  ['Goa', 'India', 'South Asia', 2, 80, 'Beaches, Portuguese charm, seafood and sunset shacks.', '🏖️', '#f97316', 15.2993, 74.124],
  ['Bangalore', 'India', 'South Asia', 2, 70, 'Gardens, hills and the tech capital of India.', '🌆', '#22c55e', 12.9716, 77.5946],
  ['Varanasi', 'India', 'South Asia', 1, 65, 'One of the oldest living cities on Earth — ghats, boats and gurus.', '🕉️', '#eab308', 25.3176, 82.9739],
  ['Mumbai', 'India', 'South Asia', 2, 85, 'Bollywood, the Gateway of India and endless energy.', '🎬', '#8b5cf6', 19.076, 72.8777],
  ['Bangkok', 'Thailand', 'Southeast Asia', 2, 90, 'Golden temples, floating markets and the world’s best street food.', '🛕', '#e11d48', 13.7563, 100.5018],
  ['Singapore', 'Singapore', 'Southeast Asia', 5, 85, 'A futuristic city-state — gardens, skylines and hawker centres.', '🦁', '#0ea5e9', 1.3521, 103.8198],
  ['Bali', 'Indonesia', 'Southeast Asia', 2, 88, 'Rice terraces, surf beaches, temples and jungle retreats.', '🌴', '#10b981', -8.3404, 115.092],
  ['Hanoi', 'Vietnam', 'Southeast Asia', 1, 68, 'Old Quarter cafés, street food and the Ha Long Bay gateway.', '🍜', '#84cc16', 21.0278, 105.8342],
  ['Kuala Lumpur', 'Malaysia', 'Southeast Asia', 2, 72, 'Twin towers, night markets and a melting pot of cultures.', '🗼', '#06b6d4', 3.139, 101.6869],
  ['Paris', 'France', 'Western Europe', 4, 98, 'The city of light — art, café culture and the Eiffel Tower.', '🗼', '#6366f1', 48.8566, 2.3522],
  ['Rome', 'Italy', 'Southern Europe', 4, 95, 'Ancient ruins, Renaissance art and pasta at every corner.', '🏛️', '#ef4444', 41.9028, 12.4964],
  ['Barcelona', 'Spain', 'Southern Europe', 4, 90, 'Gaudí masterpieces, beach days and tapas till late.', '⚽', '#f43f5e', 41.3874, 2.1686],
  ['Amsterdam', 'Netherlands', 'Western Europe', 5, 80, 'Canals, bikes, tulips and world-class museums.', '🚲', '#3b82f6', 52.3676, 4.9041],
  ['Prague', 'Czechia', 'Central Europe', 3, 78, 'Fairy-tale spires, castles and old-town squares.', '🏰', '#a855f7', 50.0755, 14.4378],
  ['Lisbon', 'Portugal', 'Southern Europe', 3, 82, 'Hillside trams, pastel tiles and Atlantic sunsets.', '🚋', '#f59e0b', 38.7223, -9.1393],
  ['Santorini', 'Greece', 'Southern Europe', 5, 84, 'Whitewashed cliffs and the Aegean’s most famous sunsets.', '🌅', '#0284c7', 36.3932, 25.4615],
  ['London', 'United Kingdom', 'Western Europe', 5, 96, 'Royalty, museums, theatre and a thousand neighbourhoods.', '🎡', '#475569', 51.5074, -0.1278],
  ['Dubai', 'UAE', 'Middle East', 5, 86, 'Superlatives — tallest tower, desert safaris and gold souks.', '🏙️', '#eab308', 25.2048, 55.2708],
  ['Istanbul', 'Türkiye', 'Middle East', 2, 88, 'Two continents, bazaars and Bosphorus ferries.', '🕌', '#0d9488', 41.0082, 28.9784],
  ['Cairo', 'Egypt', 'Africa', 1, 70, 'Pyramids, the Nile and 5,000 years of history.', '🐫', '#ca8a04', 30.0444, 31.2357],
  ['Cape Town', 'South Africa', 'Africa', 3, 76, 'Table Mountain, penguin beaches and wine estates.', '⛰️', '#059669', -33.9249, 18.4241],
  ['Marrakesh', 'Morocco', 'Africa', 2, 64, 'Souks, riads and the red city’s spice-scented medina.', '🎪', '#ea580c', 31.6295, -7.9811],
  ['New York', 'United States', 'North America', 5, 97, 'The city that never sleeps — skylines, Broadway and pizza.', '🗽', '#1d4ed8', 40.7128, -74.006],
  ['Cancun', 'Mexico', 'North America', 3, 75, 'Caribbean beaches, cenotes and Mayan ruins.', '🐠', '#06b6d4', 21.1619, -86.8515],
  ['Cusco', 'Peru', 'South America', 2, 72, 'Gateway to Machu Picchu — Inca streets and Andean markets.', '🦙', '#b45309', -13.532, -71.9675],
];

const ACT = {
  0: [ // Ahmedabad
    ['Sabarmati Ashram Walk', 'culture', 2, 5, 'Walk the peaceful grounds of Gandhi’s historic residence.', '🕊️'],
    ['Heritage Pols Walk', 'sightseeing', 3, 10, 'Explore centuries-old carved wooden houses in Old Ahmedabad.', '🏛️'],
    ['Manek Chowk Night Street Food', 'food', 2, 15, 'Legendary midnight night market with butter maska & khavda sweets.', '🥘'],
    ['Adalaj Stepwell Architecture', 'sightseeing', 2, 8, 'Intricate 5-story underground stepwell structure.', '🕌'],
  ],
  1: [ // Rann of Kutch
    ['White Desert Sunset Walk', 'outdoors', 3, 12, 'Watch the salt plains glow violet and amber at dusk.', '🌅'],
    ['Kutch Handicraft Village Tour', 'culture', 3, 20, 'Ajrakh block printing, Rogan art & embroidery workshops.', '🧵'],
    ['Full Moon Salt Desert Night Walk', 'adventure', 2, 15, 'Ethereal silver salt desert under a glowing full moon.', '🌕'],
  ],
  2: [ // Statue of Unity
    ['Statue Viewing Gallery Deck', 'sightseeing', 3, 25, 'Elevator ride to the chest-level viewing gallery 153m up.', '🗿'],
    ['Narmada River Laser & Sound Show', 'culture', 2, 10, 'Night light projection show on the world’s tallest statue.', '✨'],
    ['Jungle Safari & Butterfly Park', 'outdoors', 4, 30, 'Eco-park with exotic birds, flora and animal habitats.', '🦋'],
  ],
  3: [ // Delhi
    ['Red Fort & Old Delhi walk', 'sightseeing', 3, 15, 'Walk the Mughal fort walls and the lanes of Chandni Chowk.', '🏯'],
    ['Street food tour in Old Delhi', 'food', 2, 20, 'Parathas, chaat and jalebis straight off the grill.', '🥘'],
    ['Lotus Temple & Lodi Gardens', 'culture', 2, 8, 'A serene architecture walk through Delhi’s greenest corner.', '🪷'],
    ['Qutub Minar at sunset', 'sightseeing', 2, 10, 'India’s tallest minaret, glowing amber at dusk.', '🌇'],
  ],
  4: [ // Jaipur
    ['Amber Fort & elephant trail', 'sightseeing', 4, 12, 'Mirror palaces and ramparts above the city.', '🐘'],
    ['Hawa Mahal & City Palace', 'culture', 3, 10, 'The wind- palace and the royal museum complex.', '👑'],
    ['Rajasthani thali dinner', 'food', 2, 18, 'Forty small dishes on one great brass plate.', '🍛'],
  ],
  15: [ // Paris
    ['Eiffel Tower & Seine cruise', 'sightseeing', 4, 45, 'The Iron Lady plus a riverside stroll under the bridges.', '🗼'],
    ['Louvre masterpieces tour', 'culture', 4, 30, 'Mona Lisa, Winged Victory and three floors of genius.', '🖼️'],
    ['Montmartre & Sacré-Cœur', 'sightseeing', 3, 15, 'Cobblestones, artists and the city’s best viewpoint.', '⛪'],
  ],
};

async function main() {
  console.log('Seeding GlobeTrotter database…');
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
    data: { name: 'Globe Admin', email: 'admin@globetrotter.app', password: adminHash, isAdmin: true, language: 'en' },
  });

  const demo = await prisma.user.create({
    data: { name: 'Aarav Sharma', email: 'demo@globetrotter.app', password: passwordHash, language: 'en', photo: 'AS' },
  });

  const alex = await prisma.user.create({
    data: { name: 'Alex Johnson', email: 'alex@demo.com', password: passwordHash, language: 'en', photo: 'AJ' },
  });

  const now = new Date();
  const d = (offset) => new Date(now.getTime() + offset * 86400000);

  // Demo trip: Vibrant Gujarat & Rajasthan Explorer
  const trip = await prisma.trip.create({
    data: {
      name: 'Vibrant Gujarat & Rajasthan Circuit',
      description: 'UNESCO Heritage Ahmedabad, Statue of Unity, White Rann of Kutch & Lake Palaces of Udaipur.',
      startDate: d(15), endDate: d(25),
      coverEmoji: '🦁', coverColor: '#0d9488', budgetTotal: 2500,
      isPublic: true, shareToken: 'india-explorer', userId: demo.id,
    },
  });

  const [ahm, kutch, sou, udaipur] = [cities[0], cities[1], cities[2], cities[5]];
  
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
