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

// Activities per City index
const ACT = {
  0: [ // Ahmedabad
    ['Sabarmati Ashram Walk', 'culture', 2, 400, 'Walk the peaceful grounds of Gandhi’s historic residence & museum.', '🕊️'],
    ['Heritage Pols Walk', 'sightseeing', 3, 650, 'Explore centuries-old carved wooden houses in Old Ahmedabad.', '🏛️'],
    ['Manek Chowk Night Street Food', 'food', 2, 850, 'Midnight street market with butter maska bun, chocolate sandwiches & khavda.', '🥘'],
    ['Adalaj Stepwell Architecture', 'sightseeing', 2, 500, 'Intricate 5-story underground Indo-Islamic stepwell structure.', '🕌'],
    ['Kankaria Lakefront Evening Tour', 'outdoors', 3, 350, 'Toy train ride, illuminated lake promenades and balloon ride.', '🎡'],
  ],
  1: [ // Statue of Unity
    ['Statue Viewing Gallery Deck', 'sightseeing', 3, 1250, 'High-speed elevator ride to the chest-level viewing gallery 153m up.', '🗿'],
    ['Narmada River Laser & Sound Show', 'culture', 2, 500, 'High-tech laser projection show on the world’s tallest statue.', '✨'],
    ['Jungle Safari & Butterfly Park', 'outdoors', 4, 1500, 'State-of-the-art zoological park with exotic birds and animal habitats.', '🦋'],
    ['Valley of Flowers Promenade', 'outdoors', 2, 400, 'Vibrant botanical garden spanning over 24 acres along Narmada.', '🌸'],
  ],
  2: [ // Rann of Kutch
    ['White Desert Sunset Walk', 'outdoors', 3, 950, 'Watch the vast salt desert glow in shades of violet and amber at dusk.', '🌅'],
    ['Kutch Handicraft Village Tour', 'culture', 3, 1400, 'Ajrakhpur block printing, Bhujodi weaving and Rogan art workshops.', '🧵'],
    ['Full Moon Salt Desert Night Walk', 'adventure', 2, 1100, 'Ethereal silver salt desert under a glowing full moon.', '🌕'],
    ['Kala Dungar (Black Hill) Trek', 'adventure', 4, 800, 'Highest point in Kutch with panoramic views of the great salt desert.', '⛰️'],
  ],
  3: [ // Jaipur
    ['Amber Fort & Elephant Ramparts', 'sightseeing', 4, 900, 'Sheesh Mahal mirror palaces and hilltop battlements above Maota lake.', '🐘'],
    ['Hawa Mahal & City Palace Walk', 'culture', 3, 750, 'The iconic honeycomb wind palace and royal museum courtyards.', '👑'],
    ['Rajasthani Royal Thali Feast', 'food', 2, 1200, 'Authentic dal baati churma, gatte ki sabzi & royal sweets in heritage haveli.', '🍛'],
    ['Nahargarh Fort Sunset Viewpoint', 'sightseeing', 3, 500, 'Breathtaking panoramic sunset overlooking the pink city.', '🌇'],
  ],
  4: [ // Udaipur
    ['Lake Pichola Sunset Boat Cruise', 'sightseeing', 2, 800, 'Cruising past Jag Mandir, Lake Palace and ghats at golden hour.', '🛶'],
    ['City Palace Museum Walk', 'culture', 3, 600, 'Exploring royal peacock courtyards, mirror mosaics and vintage armory.', '🏰'],
    ['Bagore Ki Haveli Dharohar Dance', 'culture', 2, 450, 'Rajasthani folk dance, fire dance and puppet show on the lakefront.', '💃'],
  ],
  5: [ // Goa
    ['Old Goa Portuguese Churches Walk', 'culture', 3, 600, 'Basilica of Bom Jesus and Sé Cathedral UNESCO heritage architecture.', '⛪'],
    ['Palolem & Agonda Beach Hop', 'outdoors', 4, 750, 'Kayaking through calm lagoons and fresh seafood shacks on the sand.', '🏖️'],
    ['Dudhsagar Waterfalls Trek', 'adventure', 5, 2200, 'Jeep safari through Bhagwan Mahaveer Sanctuary to the 4-tiered falls.', '💦'],
  ],
  6: [ // Delhi
    ['Red Fort & Chandni Chowk Food Crawl', 'food', 3, 900, 'Paranthe Wali Gali, hot jalebis and Karim’s Mughlai delicacies.', '🥘'],
    ['Humayun’s Tomb & Sunder Nursery', 'culture', 3, 500, 'Mughal garden tomb architecture and lush heritage botanical gardens.', '🪷'],
    ['Qutub Minar Complex Sunset', 'sightseeing', 2, 600, 'Ancient victory tower, iron pillar and intricate terracotta carvings.', '🕌'],
  ],
  7: [ // Mumbai
    ['South Mumbai Art Deco & Marine Drive', 'sightseeing', 3, 700, 'Gateway of India, heritage architecture and sunset stroll at Queen’s Necklace.', '🌊'],
    ['Elephanta Caves Island Boat Trip', 'culture', 4, 1100, 'Ferry ride from Colaba to ancient 6th-century rock-cut Shiva cave temples.', '🗿'],
    ['Bandra Street Art & Cafe Hop', 'food', 3, 850, 'Bollywood murals, quaint Portuguese lanes and artisanal bakeries.', '☕'],
  ],
  8: [ // Varanasi
    ['Dawn Ganga Boat Ride & Subah-e-Banaras', 'culture', 2, 600, 'Sunrise boat ride along 84 ghats witnessing ancient morning rituals.', '🛶'],
    ['Dashashwamedh Ghat Evening Ganga Aarti', 'culture', 2, 350, 'Spectacular ritual with brass lamps, chants and river lamps at dusk.', '🪔'],
    ['Kashi Vishwanath Corridor & Sweet Trail', 'food', 3, 500, 'Golden temple visit, Banarasi paan, malaiyo and kachori jalebi.', '🍬'],
  ],
  9: [ // Bangalore
    ['Lalbagh Botanical Garden Glasshouse', 'outdoors', 3, 400, 'Famous 240-acre garden with centuries-old trees and floral shows.', '🌿'],
    ['Indiranagar Microbrewery & Dosa Trail', 'food', 3, 1100, 'Iconic filter coffee, CTR benne dosa and craft beers.', '🍺'],
  ],
};

async function main() {
  console.log('Seeding GlobeTrotter database with 3 rich demo accounts & India/Gujarat content…');
  
  // Clean all existing records
  await prisma.stopActivity.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();
  await prisma.city.deleteMany();

  // 1. Insert Cities
  const cityMap = new Map();
  for (let i = 0; i < CITIES.length; i++) {
    const c = CITIES[i];
    const created = await prisma.city.create({
      data: {
        name: c[0], country: c[1], region: c[2], costIndex: c[3], popularity: c[4],
        description: c[5], emoji: c[6], color: c[7], lat: c[8], lng: c[9],
      },
    });
    cityMap.set(c[0], created);
  }
  console.log(`  ✓ ${cityMap.size} cities created`);

  // 2. Insert Activities
  const activityMap = new Map();
  let actCount = 0;
  for (const [idx, list] of Object.entries(ACT)) {
    const cityName = CITIES[Number(idx)][0];
    const city = cityMap.get(cityName);
    if (!city) continue;
    for (const a of list) {
      const act = await prisma.activity.create({
        data: { cityId: city.id, name: a[0], type: a[1], duration: a[2], cost: a[3], description: a[4], emoji: a[5] },
      });
      activityMap.set(a[0], act);
      actCount++;
    }
  }
  console.log(`  ✓ ${actCount} activities created`);

  // 3. Create Passwords
  const passwordHash = await bcrypt.hash('demo123', 10);
  const adminHash = await bcrypt.hash('admin123', 10);

  // 4. Create 3 Demo Accounts
  // ACCOUNT 1: Aarav Sharma (Gujarat & Heritage Explorer)
  const userAarav = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      email: 'demo@globetrotter.app',
      password: passwordHash,
      language: 'en',
      isAdmin: false,
      photo: null,
      savedCities: {
        connect: [
          { id: cityMap.get('Ahmedabad').id },
          { id: cityMap.get('Statue of Unity').id },
          { id: cityMap.get('Rann of Kutch').id },
          { id: cityMap.get('Udaipur').id },
          { id: cityMap.get('Jaipur').id },
          { id: cityMap.get('Goa').id },
        ],
      },
    },
  });

  // ACCOUNT 2: Priya Patel (Backpacker & Nature Nomad)
  const userPriya = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya@globetrotter.app',
      password: passwordHash,
      language: 'en',
      isAdmin: false,
      photo: null,
      savedCities: {
        connect: [
          { id: cityMap.get('Varanasi').id },
          { id: cityMap.get('Delhi').id },
          { id: cityMap.get('Jaipur').id },
          { id: cityMap.get('Ahmedabad').id },
          { id: cityMap.get('Bangalore').id },
        ],
      },
    },
  });

  // ACCOUNT 3: Globe Admin (Platform Administrator)
  const userAdmin = await prisma.user.create({
    data: {
      name: 'Globe Admin',
      email: 'admin@globetrotter.app',
      password: adminHash,
      language: 'en',
      isAdmin: true,
      photo: null,
      savedCities: {
        connect: [
          { id: cityMap.get('Ahmedabad').id },
          { id: cityMap.get('Mumbai').id },
          { id: cityMap.get('Delhi').id },
          { id: cityMap.get('Paris').id },
          { id: cityMap.get('Tokyo').id },
        ],
      },
    },
  });

  const now = new Date();
  const d = (offset) => new Date(now.getTime() + offset * 86400000);

  // Helper to create stops & activities
  const addStopWithActivities = async (tripId, cityName, arrOffset, depOffset, seq, notes, actNames = []) => {
    const city = cityMap.get(cityName);
    const stop = await prisma.stop.create({
      data: { tripId, cityId: city.id, arrivalDate: d(arrOffset), departureDate: d(depOffset), sequence: seq, notes },
    });
    for (let day = 0; day < actNames.length; day++) {
      const act = activityMap.get(actNames[day]);
      if (act) {
        await prisma.stopActivity.create({
          data: {
            stopId: stop.id,
            activityId: act.id,
            dayOffset: Math.min(day, depOffset - arrOffset - 1),
            startTime: day % 2 === 0 ? '09:30' : '16:00',
            cost: act.cost,
          },
        });
      }
    }
    return stop;
  };

  // --- TRIPS FOR AARAV SHARMA (3 Detailed Trips) ---
  const tripAarav1 = await prisma.trip.create({
    data: {
      name: 'Vibrant Gujarat Royal Circuit',
      description: 'UNESCO World Heritage Old Ahmedabad, the awe-inspiring Statue of Unity, White Rann of Kutch moonlit salt plains, and romantic Udaipur lake palaces.',
      startDate: d(7), endDate: d(17),
      coverEmoji: '🦁', coverColor: '#0d9488', budgetTotal: 32000,
      isPublic: true, shareToken: 'vibrant-gujarat-expedition', userId: userAarav.id,
    },
  });
  await addStopWithActivities(tripAarav1.id, 'Ahmedabad', 7, 9, 0, 'Heritage walk through old pols and evening feast at Manek Chowk.', ['Heritage Pols Walk', 'Sabarmati Ashram Walk', 'Manek Chowk Night Street Food']);
  await addStopWithActivities(tripAarav1.id, 'Statue of Unity', 9, 11, 1, 'Express train to Kevadia station, stay near riverfront.', ['Statue Viewing Gallery Deck', 'Narmada River Laser & Sound Show', 'Jungle Safari & Butterfly Park']);
  await addStopWithActivities(tripAarav1.id, 'Rann of Kutch', 11, 14, 2, 'Luxury tent stay in Dhordo, full moon desert walk.', ['White Desert Sunset Walk', 'Kutch Handicraft Village Tour', 'Full Moon Salt Desert Night Walk']);
  await addStopWithActivities(tripAarav1.id, 'Udaipur', 14, 17, 3, 'Lakeside palace tour and sunset boat cruise on Lake Pichola.', ['Lake Pichola Sunset Boat Cruise', 'City Palace Museum Walk', 'Bagore Ki Haveli Dharohar Dance']);

  const tripAarav2 = await prisma.trip.create({
    data: {
      name: 'Golden Triangle & Pink City Splendor',
      description: 'Grand Mughal fortresses in Old Delhi, iconic palaces of Jaipur, and regal dining in heritage havelis.',
      startDate: d(24), endDate: d(31),
      coverEmoji: '🏰', coverColor: '#d97706', budgetTotal: 26000,
      isPublic: true, shareToken: 'golden-triangle-splendor', userId: userAarav.id,
    },
  });
  await addStopWithActivities(tripAarav2.id, 'Delhi', 24, 27, 0, 'Historical walking tour and Old Delhi Mughlai food crawl.', ['Red Fort & Chandni Chowk Food Crawl', 'Humayun’s Tomb & Sunder Nursery']);
  await addStopWithActivities(tripAarav2.id, 'Jaipur', 27, 31, 1, 'Amber Fort hill ramparts, City Palace, and Nahargarh sunset.', ['Amber Fort & Elephant Ramparts', 'Hawa Mahal & City Palace Walk', 'Rajasthani Royal Thali Feast', 'Nahargarh Fort Sunset Viewpoint']);

  const tripAarav3 = await prisma.trip.create({
    data: {
      name: 'Goa Coastal Sunsets & Portuguese Heritage',
      description: 'Relaxing beachside retreat, scenic palm trails, Portuguese churches and fresh coastal seafood.',
      startDate: d(45), endDate: d(50),
      coverEmoji: '🏖️', coverColor: '#f97316', budgetTotal: 22000,
      isPublic: false, shareToken: 'goa-coastal-escape', userId: userAarav.id,
    },
  });
  await addStopWithActivities(tripAarav3.id, 'Goa', 45, 50, 0, 'Beach shack relaxation and Dudhsagar waterfall trek.', ['Palolem & Agonda Beach Hop', 'Old Goa Portuguese Churches Walk', 'Dudhsagar Waterfalls Trek']);

  // --- TRIPS FOR PRIYA PATEL (2 Detailed Trips) ---
  const tripPriya1 = await prisma.trip.create({
    data: {
      name: 'Spiritual Varanasi & Ganga Ghats Trail',
      description: 'Mesmerizing dawn boat rides on holy Ganga, thousands of lamps at Dashashwamedh evening Aarti, and Banarasi cuisine.',
      startDate: d(10), endDate: d(16),
      coverEmoji: '🕉️', coverColor: '#eab308', budgetTotal: 18500,
      isPublic: true, shareToken: 'spiritual-varanasi-trail', userId: userPriya.id,
    },
  });
  await addStopWithActivities(tripPriya1.id, 'Varanasi', 10, 13, 0, 'Ancient alleys, early morning boat rides and Ganga Aarti.', ['Dawn Ganga Boat Ride & Subah-e-Banaras', 'Dashashwamedh Ghat Evening Ganga Aarti', 'Kashi Vishwanath Corridor & Sweet Trail']);
  await addStopWithActivities(tripPriya1.id, 'Delhi', 13, 16, 1, 'Sunder Nursery garden walk and Qutub Minar sunset.', ['Humayun’s Tomb & Sunder Nursery', 'Qutub Minar Complex Sunset']);

  const tripPriya2 = await prisma.trip.create({
    data: {
      name: 'Rajasthan Backpacking & Fort Haveli Tour',
      description: 'Budget traveler trail through Jaipur pink bazaars, lake cruises in Udaipur, and Rajasthani folk performances.',
      startDate: d(30), endDate: d(38),
      coverEmoji: '🎒', coverColor: '#ec4899', budgetTotal: 21000,
      isPublic: true, shareToken: 'rajasthan-backpacking-route', userId: userPriya.id,
    },
  });
  await addStopWithActivities(tripPriya2.id, 'Jaipur', 30, 34, 0, 'Hostel stay near Hawa Mahal, street bazaar photography.', ['Hawa Mahal & City Palace Walk', 'Nahargarh Fort Sunset Viewpoint']);
  await addStopWithActivities(tripPriya2.id, 'Udaipur', 34, 38, 1, 'Dharohar folk dance show and Lake Pichola boat cruising.', ['Lake Pichola Sunset Boat Cruise', 'Bagore Ki Haveli Dharohar Dance']);

  // --- TRIPS FOR GLOBE ADMIN (1 Grand Pan-India Expedition) ---
  const tripAdmin1 = await prisma.trip.create({
    data: {
      name: 'Grand Pan-India Heritage & Megacity Circuit',
      description: 'Master curated itinerary connecting financial capital Mumbai, heritage Ahmedabad, royal Jaipur, and capital Delhi.',
      startDate: d(5), endDate: d(20),
      coverEmoji: '👑', coverColor: '#8b5cf6', budgetTotal: 55000,
      isPublic: true, shareToken: 'grand-pan-india-circuit', userId: userAdmin.id,
    },
  });
  await addStopWithActivities(tripAdmin1.id, 'Mumbai', 5, 8, 0, 'Marine Drive walk and Elephanta Caves island excursion.', ['South Mumbai Art Deco & Marine Drive', 'Elephanta Caves Island Boat Trip']);
  await addStopWithActivities(tripAdmin1.id, 'Ahmedabad', 8, 12, 1, 'Sabarmati ashram, ancient pols and night street food.', ['Heritage Pols Walk', 'Sabarmati Ashram Walk', 'Manek Chowk Night Street Food']);
  await addStopWithActivities(tripAdmin1.id, 'Jaipur', 12, 16, 2, 'Palaces, forts, and royal Rajasthani dining.', ['Amber Fort & Elephant Ramparts', 'Rajasthani Royal Thali Feast']);
  await addStopWithActivities(tripAdmin1.id, 'Delhi', 16, 20, 3, 'Red Fort, Mughal garden tombs and Chandni Chowk food walk.', ['Red Fort & Chandni Chowk Food Crawl', 'Humayun’s Tomb & Sunder Nursery']);

  console.log('  ✓ 3 Demo Users & 6 Rich Multi-City Itineraries created with full StopActivities!');
  console.log('-------------------------------------------------------------');
  console.log('1. Aarav Sharma (Explorer)     : demo@globetrotter.app  / demo123 (3 trips, 8 stops, 12 activities)');
  console.log('2. Priya Patel (Backpacker)    : priya@globetrotter.app / demo123 (2 trips, 4 stops, 6 activities)');
  console.log('3. Globe Admin (Administrator) : admin@globetrotter.app / admin123 (1 grand trip, 4 stops, 8 activities)');
  console.log('-------------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
