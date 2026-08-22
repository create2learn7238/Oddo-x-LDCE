import { pool } from './db.js';

async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('🚀 Connected to Neon PostgreSQL! Initializing schema...');

    await client.query('BEGIN');

    // 1. Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar TEXT,
        role VARCHAR(50) DEFAULT 'user',
        bio TEXT,
        join_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cities (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        state VARCHAR(255),
        country VARCHAR(255) NOT NULL,
        region VARCHAR(100) NOT NULL,
        emoji VARCHAR(20),
        cost_index VARCHAR(50) DEFAULT 'Medium',
        popularity INT DEFAULT 80,
        image TEXT,
        description TEXT,
        avg_daily_cost NUMERIC(10, 2) DEFAULT 100,
        tags TEXT[],
        best_season VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS activities (
        id VARCHAR(100) PRIMARY KEY,
        city_id VARCHAR(100) REFERENCES cities(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        cost NUMERIC(10, 2) DEFAULT 0,
        duration VARCHAR(50),
        emoji VARCHAR(20) DEFAULT '📌',
        description TEXT,
        rating NUMERIC(3, 2) DEFAULT 4.5,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS trips (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        cover_color VARCHAR(50) DEFAULT '#6C63FF',
        is_public BOOLEAN DEFAULT false,
        total_budget NUMERIC(12, 2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS trip_stops (
        id VARCHAR(100) PRIMARY KEY,
        trip_id VARCHAR(100) REFERENCES trips(id) ON DELETE CASCADE,
        city_id VARCHAR(100) REFERENCES cities(id) ON DELETE SET NULL,
        city_name VARCHAR(255) NOT NULL,
        emoji VARCHAR(20) DEFAULT '📍',
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        accommodation VARCHAR(255),
        accommodation_cost NUMERIC(10, 2) DEFAULT 0,
        transport_cost NUMERIC(10, 2) DEFAULT 0,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS trip_activities (
        id VARCHAR(100) PRIMARY KEY,
        stop_id VARCHAR(100) REFERENCES trip_stops(id) ON DELETE CASCADE,
        activity_id VARCHAR(100) REFERENCES activities(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        cost NUMERIC(10, 2) DEFAULT 0,
        duration VARCHAR(50),
        emoji VARCHAR(20) DEFAULT '📌',
        scheduled_date DATE,
        time VARCHAR(20),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS user_saved_destinations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
        city_id VARCHAR(100) REFERENCES cities(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, city_id)
      );
    `);

    console.log('✅ Tables created successfully!');

    // 2. Insert Seed Users
    const users = [
      { id: 'u1', name: 'Alex Rivera', email: 'alex@demo.com', password: 'demo123', role: 'admin', bio: 'Passionate globetrotter & cultural explorer.' },
      { id: 'u2', name: 'Priya Sharma', email: 'priya@demo.com', password: 'demo123', role: 'user', bio: 'Gujarat heritage enthusiast and foodie.' },
      { id: 'u3', name: 'Parth Patel', email: 'parth@demo.com', password: 'demo123', role: 'user', bio: 'Adventurer exploring vibrant Gujarat and beyond.' }
    ];

    for (const u of users) {
      await client.query(`
        INSERT INTO users (id, name, email, password, role, bio)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE 
        SET name = EXCLUDED.name, email = EXCLUDED.email, password = EXCLUDED.password, role = EXCLUDED.role, bio = EXCLUDED.bio;
      `, [u.id, u.name, u.email, u.password, u.role, u.bio]);
    }

    // 3. Insert Cities (Deep focus on Gujarat, India & World)
    const citiesList = [
      // --- GUJARAT, INDIA ---
      {
        id: 'c_ahmedabad', name: 'Ahmedabad', state: 'Gujarat', country: 'India', region: 'India',
        emoji: '🕌', costIndex: 'Low', popularity: 96,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
        description: "India's first UNESCO World Heritage City, famous for Sabarmati Ashram, intricately carved pols, vibrant Manek Chowk night food market, and world-class heritage architecture.",
        avgDailyCost: 35,
        tags: ['Heritage', 'Food', 'Culture', 'Textiles', 'Architecture'],
        bestSeason: 'Oct - Mar'
      },
      {
        id: 'c_kutch', name: 'Rann of Kutch', state: 'Gujarat', country: 'India', region: 'India',
        emoji: '🏜️', costIndex: 'Medium', popularity: 98,
        image: 'https://images.unsplash.com/photo-1609137144820-22c6684e27f0?w=600&q=80',
        description: 'The world-famous Great Rann of Kutch with its endless white salt desert, Rann Utsav cultural tent city, stargazing, Bhuj palaces, and exquisite Rogan art.',
        avgDailyCost: 65,
        tags: ['Desert', 'Festival', 'Stargazing', 'Handicrafts', 'Photography'],
        bestSeason: 'Nov - Feb (Rann Utsav)'
      },
      {
        id: 'c_statue_of_unity', name: 'Statue of Unity (Kevadia)', state: 'Gujarat', country: 'India', region: 'India',
        emoji: '🗽', costIndex: 'Medium', popularity: 97,
        image: 'https://images.unsplash.com/photo-1620023812480-c11d61993435?w=600&q=80',
        description: "The world's tallest statue (182m) honoring Sardar Vallabhbhai Patel, surrounded by the Narmada River, Valley of Flowers, Jungle Safari, and Laser Light Show.",
        avgDailyCost: 55,
        tags: ['Monument', 'Family', 'Nature', 'River Cruise', 'Modern Marvel'],
        bestSeason: 'Oct - Mar'
      },
      {
        id: 'c_gir', name: 'Gir National Park', state: 'Gujarat', country: 'India', region: 'India',
        emoji: '🦁', costIndex: 'Medium', popularity: 95,
        image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&q=80',
        description: 'The only natural habitat in the world of the majestic Asiatic Lion. Thrilling open-jeep wildlife safaris, birdwatching, and Malkangiri tribal culture.',
        avgDailyCost: 60,
        tags: ['Wildlife', 'Safari', 'Lions', 'Nature', 'Ecotourism'],
        bestSeason: 'Dec - Mar'
      },
      {
        id: 'c_somnath', name: 'Somnath', state: 'Gujarat', country: 'India', region: 'India',
        emoji: '🕉️', costIndex: 'Low', popularity: 94,
        image: 'https://images.unsplash.com/photo-1609137144820-22c6684e27f0?w=600&q=80',
        description: 'The first among the twelve holy Jyotirlinga shrines of Lord Shiva, perched right on the Arabian Sea shore with breathtaking evening sound-and-light shows.',
        avgDailyCost: 30,
        tags: ['Spiritual', 'Pilgrimage', 'Sea Beach', 'History', 'Sacred'],
        bestSeason: 'Oct - Mar'
      },
      {
        id: 'c_dwarka', name: 'Dwarka', state: 'Gujarat', country: 'India', region: 'India',
        emoji: '🛕', costIndex: 'Low', popularity: 93,
        image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=600&q=80',
        description: 'The ancient kingdom of Lord Krishna, one of the sacred Char Dham pilgrimage sites, featuring Dwarkadhish Temple, Bet Dwarka island, and Shivrajpur Blue Flag Beach.',
        avgDailyCost: 32,
        tags: ['Spiritual', 'Char Dham', 'Scuba Diving', 'Beaches', 'History'],
        bestSeason: 'Oct - Mar'
      },
      {
        id: 'c_surat', name: 'Surat', state: 'Gujarat', country: 'India', region: 'India',
        emoji: '💎', costIndex: 'Low', popularity: 89,
        image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&q=80',
        description: 'The Diamond & Textile Hub of the world, celebrated for unmatched street food delicacies (Locho, Ghari, Ponk), Dumas Beach, and Surat Castle.',
        avgDailyCost: 35,
        tags: ['Foodie Paradise', 'Shopping', 'Diamonds', 'Textiles', 'City Life'],
        bestSeason: 'Oct - Mar'
      },
      {
        id: 'c_vadodara', name: 'Vadodara (Baroda)', state: 'Gujarat', country: 'India', region: 'India',
        emoji: '🏰', costIndex: 'Low', popularity: 91,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80',
        description: 'The Cultural Capital of Gujarat, home to the magnificent Laxmi Vilas Palace (4x the size of Buckingham Palace), art galleries, and grand Navratri Garba.',
        avgDailyCost: 38,
        tags: ['Palaces', 'Art', 'Navratri Garba', 'History', 'Culture'],
        bestSeason: 'Sep - Mar'
      },
      {
        id: 'c_saputara', name: 'Saputara', state: 'Gujarat', country: 'India', region: 'India',
        emoji: '⛰️', costIndex: 'Low', popularity: 86,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
        description: "Gujarat's picturesque hill station nestled in the Sahyadri ranges. Offers lush green waterfalls, boating in Saputara Lake, cable cars, and sunset points.",
        avgDailyCost: 40,
        tags: ['Hill Station', 'Nature', 'Waterfalls', 'Trekking', 'Boating'],
        bestSeason: 'Jul - Feb'
      },
      {
        id: 'c_modhera_patan', name: 'Modhera & Patan', state: 'Gujarat', country: 'India', region: 'India',
        emoji: '☀️', costIndex: 'Low', popularity: 92,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
        description: 'Step into architectural wonders: the thousand-year-old Sun Temple of Modhera and the subterranean UNESCO stepwell Rani Ki Vav in Patan, home of Patola silk.',
        avgDailyCost: 30,
        tags: ['UNESCO Stepwell', 'Sun Temple', 'Patola Silk', 'Ancient Architecture'],
        bestSeason: 'Oct - Mar'
      },

      // --- REST OF INDIA ---
      {
        id: 'c_jaipur', name: 'Jaipur', state: 'Rajasthan', country: 'India', region: 'India',
        emoji: '👑', costIndex: 'Medium', popularity: 96,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
        description: 'The Pink City filled with royal forts like Amber Fort, Hawa Mahal, bustling bazaars, and rich Rajput culinary heritage.',
        avgDailyCost: 45,
        tags: ['Royal Forts', 'Palaces', 'Culture', 'Shopping', 'Heritage'],
        bestSeason: 'Oct - Mar'
      },
      {
        id: 'c_udaipur', name: 'Udaipur', state: 'Rajasthan', country: 'India', region: 'India',
        emoji: '🛶', costIndex: 'Medium', popularity: 95,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80',
        description: 'The City of Lakes and Romance, featuring City Palace on Lake Pichola, stunning sunset boat rides, and grand rooftop dining.',
        avgDailyCost: 50,
        tags: ['Lakes', 'Romance', 'Palaces', 'Heritage', 'Sunset'],
        bestSeason: 'Sep - Mar'
      },
      {
        id: 'c_goa', name: 'Goa', state: 'Goa', country: 'India', region: 'India',
        emoji: '🏖️', costIndex: 'Medium', popularity: 97,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
        description: 'Sun-kissed beaches, Portuguese-heritage churches, water sports, vibrant beach shacks, and exhilarating nightlife.',
        avgDailyCost: 55,
        tags: ['Beach', 'Nightlife', 'Water Sports', 'Seafood', 'Relaxation'],
        bestSeason: 'Nov - Feb'
      },
      {
        id: 'c_varanasi', name: 'Varanasi', state: 'Uttar Pradesh', country: 'India', region: 'India',
        emoji: '🪔', costIndex: 'Low', popularity: 93,
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80',
        description: "The spiritual heart of India and world's oldest living city. Experience magical evening Ganga Aarti at Dashashwamedh Ghat and sunrise boat journeys.",
        avgDailyCost: 30,
        tags: ['Ganga Aarti', 'Spiritual', 'Ancient City', 'Culture', 'Boat Rides'],
        bestSeason: 'Oct - Mar'
      },
      {
        id: 'c_ladakh', name: 'Leh Ladakh', state: 'Ladakh', country: 'India', region: 'India',
        emoji: '🏔️', costIndex: 'Medium', popularity: 94,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
        description: 'Pangong Tso high-altitude lake, Nubra Valley sand dunes, thrilling mountain passes like Khardung La, and serene Buddhist monasteries.',
        avgDailyCost: 70,
        tags: ['High Altitude', 'Biking', 'Lakes', 'Adventure', 'Monasteries'],
        bestSeason: 'May - Sep'
      },
      {
        id: 'c_kerala', name: 'Munnar & Alleppey', state: 'Kerala', country: 'India', region: 'India',
        emoji: '🌴', costIndex: 'Medium', popularity: 94,
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
        description: "God's Own Country: tea plantation-covered hills in Munnar and luxury houseboat cruises through serene Alleppey backwaters.",
        avgDailyCost: 55,
        tags: ['Tea Gardens', 'Backwaters', 'Houseboat', 'Ayurveda', 'Nature'],
        bestSeason: 'Sep - Mar'
      },

      // --- WORLD DESTINATIONS ---
      {
        id: 'c1', name: 'Paris', state: 'Île-de-France', country: 'France', region: 'Europe',
        emoji: '🗼', costIndex: 'High', popularity: 98,
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
        description: 'The City of Light, renowned for the Eiffel Tower, Louvre art museum, Seine cruises, and Parisian cafes.',
        avgDailyCost: 180,
        tags: ['Romance', 'Art', 'Food', 'History'],
        bestSeason: 'Apr - Oct'
      },
      {
        id: 'c2', name: 'Tokyo', state: 'Kanto', country: 'Japan', region: 'Asia',
        emoji: '🗾', costIndex: 'Medium', popularity: 95,
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
        description: 'A city where ancient shrines harmonize with neon skyscrapers, cutting-edge tech, sushi, and anime culture.',
        avgDailyCost: 150,
        tags: ['Tech', 'Food', 'Culture', 'Shopping'],
        bestSeason: 'Mar - May / Sep - Nov'
      },
      {
        id: 'c3', name: 'Bali', state: 'Bali', country: 'Indonesia', region: 'Asia',
        emoji: '🌴', costIndex: 'Low', popularity: 90,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
        description: 'Island of the Gods – breathtaking emerald rice terraces, cliffside temples, pristine beaches, and yoga retreats.',
        avgDailyCost: 60,
        tags: ['Beach', 'Spiritual', 'Nature', 'Adventure'],
        bestSeason: 'Apr - Oct'
      },
      {
        id: 'c4', name: 'New York', state: 'New York', country: 'USA', region: 'Americas',
        emoji: '🗽', costIndex: 'High', popularity: 97,
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
        description: 'The city that never sleeps – iconic skyline, Central Park, Broadway musicals, and world-class museums.',
        avgDailyCost: 220,
        tags: ['Shopping', 'Art', 'Food', 'Nightlife'],
        bestSeason: 'All Year'
      },
      {
        id: 'c5', name: 'Rome', state: 'Lazio', country: 'Italy', region: 'Europe',
        emoji: '🏛️', costIndex: 'Medium', popularity: 93,
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
        description: 'The Eternal City with the ancient Colosseum, Vatican City, Trevi Fountain, and delicious Italian gelato.',
        avgDailyCost: 130,
        tags: ['History', 'Food', 'Art', 'Architecture'],
        bestSeason: 'Apr - Jun / Sep - Oct'
      },
      {
        id: 'c6', name: 'Dubai', state: 'Dubai', country: 'UAE', region: 'Middle East',
        emoji: '🏙️', costIndex: 'High', popularity: 88,
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
        description: 'Ultra-modern luxury with Burj Khalifa, desert safari dune bashing, palm islands, and extravagant shopping malls.',
        avgDailyCost: 200,
        tags: ['Luxury', 'Shopping', 'Adventure', 'Architecture'],
        bestSeason: 'Nov - Mar'
      }
    ];

    for (const c of citiesList) {
      await client.query(`
        INSERT INTO cities (id, name, state, country, region, emoji, cost_index, popularity, image, description, avg_daily_cost, tags, best_season)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name, state = EXCLUDED.state, country = EXCLUDED.country, region = EXCLUDED.region,
            emoji = EXCLUDED.emoji, cost_index = EXCLUDED.cost_index, popularity = EXCLUDED.popularity,
            image = EXCLUDED.image, description = EXCLUDED.description, avg_daily_cost = EXCLUDED.avg_daily_cost,
            tags = EXCLUDED.tags, best_season = EXCLUDED.best_season;
      `, [c.id, c.name, c.state, c.country, c.region, c.emoji, c.costIndex, c.popularity, c.image, c.description, c.avgDailyCost, c.tags, c.bestSeason]);
    }

    console.log(`✅ ${citiesList.length} cities seeded successfully!`);

    // 4. Insert Activities
    const activitiesList = [
      // --- AHMEDABAD ---
      { id: 'act_ahm_1', cityId: 'c_ahmedabad', name: 'Sabarmati Ashram & Riverfront Walk', category: 'Heritage', cost: 0, duration: '2h', emoji: '🕊️', description: "Visit Mahatma Gandhi's historic abode and walk along the scenic Sabarmati Riverfront." },
      { id: 'act_ahm_2', cityId: 'c_ahmedabad', name: 'Manek Chowk Midnight Street Food Safari', category: 'Food', cost: 12, duration: '2.5h', emoji: '🥪', description: 'Experience night market magic with chocolate sandwiches, Gwalior dosa, and Kulfi.' },
      { id: 'act_ahm_3', cityId: 'c_ahmedabad', name: 'Adalaj Stepwell (Vav) Architecture Tour', category: 'Sightseeing', cost: 5, duration: '2h', emoji: '🏛️', description: 'Marvel at 5-story deep subterranean intricate Solanki-style stone carvings.' },
      { id: 'act_ahm_4', cityId: 'c_ahmedabad', name: 'Sidi Saiyyed Mosque (Tree of Life Jali)', category: 'Heritage', cost: 0, duration: '1h', emoji: '🌿', description: 'Famous stone lattice window artwork that is the official symbol of IIM Ahmedabad.' },
      { id: 'act_ahm_5', cityId: 'c_ahmedabad', name: 'Science City & Robotics Gallery', category: 'Entertainment', cost: 10, duration: '4h', emoji: '🤖', description: 'Futuristic robotics gallery, IMAX 3D theater, and underwater aquatic gallery.' },

      // --- KUTCH ---
      { id: 'act_kutch_1', cityId: 'c_kutch', name: 'Sunset & Full Moon at White Rann', category: 'Nature', cost: 15, duration: '3h', emoji: '🌕', description: 'Witness the surreal glow of the white salt desert changing colors during twilight.' },
      { id: 'act_kutch_2', cityId: 'c_kutch', name: 'Rann Utsav Cultural Folk Dance & Music', category: 'Cultural', cost: 20, duration: '3h', emoji: '💃', description: 'Live Kutchi folk performances, garba, and local crafts exhibition in Dhordo.' },
      { id: 'act_kutch_3', cityId: 'c_kutch', name: 'Nirona Village Rogan Art Workshop', category: 'Art', cost: 8, duration: '2h', emoji: '🎨', description: 'Meet National Award-winning artisans practicing rare castor-oil Rogan painting.' },
      { id: 'act_kutch_4', cityId: 'c_kutch', name: 'Kalo Dungar (Black Hill) Panoramic View', category: 'Sightseeing', cost: 5, duration: '2.5h', emoji: '⛰️', description: 'Highest point in Kutch overlooking the majestic Indo-Pak border and salt flats.' },

      // --- STATUE OF UNITY ---
      { id: 'act_sou_1', cityId: 'c_statue_of_unity', name: 'Statue Viewing Gallery at 153m', category: 'Sightseeing', cost: 18, duration: '2h', emoji: '🔭', description: 'High-speed elevator ride to the chest of the statue for a bird’s-eye view of Sardar Sarovar Dam.' },
      { id: 'act_sou_2', cityId: 'c_statue_of_unity', name: 'Narmada River Laser Light & Sound Show', category: 'Entertainment', cost: 10, duration: '1.5h', emoji: '✨', description: 'Spectacular 3D projection mapping laser show detailing India’s freedom movement.' },
      { id: 'act_sou_3', cityId: 'c_statue_of_unity', name: 'Kevadia Jungle Safari & Valley of Flowers', category: 'Adventure', cost: 12, duration: '3h', emoji: '🐅', description: 'Walk through exotic wildlife habitats, bird aviaries, and acres of blooming flower beds.' },

      // --- GIR ---
      { id: 'act_gir_1', cityId: 'c_gir', name: 'Early Morning Asiatic Lion Jeep Safari', category: 'Safari', cost: 45, duration: '3.5h', emoji: '🦁', description: 'Guided open 4x4 safari deep into the dry deciduous forest to spot wild Asiatic lions.' },
      { id: 'act_gir_2', cityId: 'c_gir', name: 'Devalia Safari Park Interpretative Tour', category: 'Wildlife', cost: 15, duration: '1.5h', emoji: '🦌', description: 'Guaranteed sighting zone for leopards, spotted deer, and wild boars.' },

      // --- SOMNATH ---
      { id: 'act_som_1', cityId: 'c_somnath', name: 'Somnath Temple Darshan & Sea Aarti', category: 'Spiritual', cost: 0, duration: '2h', emoji: '🕉️', description: 'Attend divine ocean-facing evening prayers at the revered first Jyotirlinga.' },
      { id: 'act_som_2', cityId: 'c_somnath', name: 'Sound & Light Show (Jay Somnath)', category: 'Cultural', cost: 4, duration: '1h', emoji: '🎆', description: 'Narrated in the deep voice of Amitabh Bachchan recounting Somnath’s resilience.' },

      // --- DWARKA ---
      { id: 'act_dwa_1', cityId: 'c_dwarka', name: 'Dwarkadhish Temple Morning Dhwaja Arohan', category: 'Spiritual', cost: 0, duration: '2h', emoji: '🛕', description: 'Observe the sacred ritual of changing the massive temple flag atop the 5-story spire.' },
      { id: 'act_dwa_2', cityId: 'c_dwarka', name: 'Bet Dwarka Island Boat Trip & Scuba', category: 'Adventure', cost: 35, duration: '4h', emoji: '🤿', description: 'Ferry ride to Bet Dwarka and underwater scuba diving exploring submerged ancient Dwarka ruins.' },
      { id: 'act_dwa_3', cityId: 'c_dwarka', name: 'Shivrajpur Blue Flag Beach Water Sports', category: 'Beach', cost: 20, duration: '3h', emoji: '🏖️', description: 'Crystal-clear certified Blue Flag beach with jet ski, banana rides, and sunset strolls.' },

      // --- VADODARA ---
      { id: 'act_vad_1', cityId: 'c_vadodara', name: 'Laxmi Vilas Palace Audio Tour', category: 'Heritage', cost: 12, duration: '3h', emoji: '🏰', description: 'Tour the royal Gaekwad palace featuring Venetian mosaics, armor collection, and sprawling gardens.' },
      { id: 'act_vad_2', cityId: 'c_vadodara', name: 'Sayaji Baug & Baroda Museum Art Gallery', category: 'Museum', cost: 4, duration: '2.5h', emoji: '🖼️', description: 'Historic botanical garden with an operational toy train and original paintings by Raja Ravi Varma.' },

      // --- SURAT ---
      { id: 'act_sur_1', cityId: 'c_surat', name: 'Surat Diamond Bourse & Textile Market Walk', category: 'Shopping', cost: 0, duration: '3h', emoji: '💎', description: "Explore the world's largest office building and bustling textile lanes." },
      { id: 'act_sur_2', cityId: 'c_surat', name: 'Authentic Surati Locho & Ponk Tasting', category: 'Food', cost: 8, duration: '1.5h', emoji: '🥘', description: 'Taste steaming hot buttery Locho with spicy chutneys and seasonal tender roasted sorghum.' },

      // --- MODHERA & PATAN ---
      { id: 'act_mod_1', cityId: 'c_modhera_patan', name: 'Sun Temple Modhera Geometry & Reflection', category: 'Heritage', cost: 6, duration: '2.5h', emoji: '☀️', description: 'Ancient astronomical marvel designed so the rising sun illuminates the deity on equinoxes.' },
      { id: 'act_pat_2', cityId: 'c_modhera_patan', name: 'Rani Ki Vav Stepwell & Patola Museum', category: 'UNESCO', cost: 8, duration: '3h', emoji: '🏛️', description: 'Subterranean 7-level UNESCO masterpiece and double-ikat weaving demonstration.' },

      // --- WORLD ACTIVITIES (Paris, Tokyo, etc.) ---
      { id: 'a1', cityId: 'c1', name: 'Eiffel Tower Summit & Champagne', category: 'Sightseeing', cost: 35, duration: '3h', emoji: '🗼', description: 'Ascend the summit for panoramic Parisian views.' },
      { id: 'a2', cityId: 'c1', name: 'Louvre Museum Guided Masterpieces', category: 'Museum', cost: 25, duration: '4h', emoji: '🎨', description: 'See the Mona Lisa, Venus de Milo, and winged victory.' },
      { id: 'a5', cityId: 'c2', name: 'Shibuya Crossing & Hachiko Statue', category: 'Sightseeing', cost: 0, duration: '1.5h', emoji: '🚦', description: 'Walk the world’s busiest pedestrian junction in Tokyo.' },
      { id: 'a9', cityId: 'c3', name: 'Tegallalang Rice Terrace Trek & Swing', category: 'Adventure', cost: 20, duration: '3h', emoji: '🌾', description: 'Giant swing over verdant green Indonesian rice fields.' }
    ];

    for (const a of activitiesList) {
      await client.query(`
        INSERT INTO activities (id, city_id, name, category, cost, duration, emoji, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE
        SET city_id = EXCLUDED.city_id, name = EXCLUDED.name, category = EXCLUDED.category,
            cost = EXCLUDED.cost, duration = EXCLUDED.duration, emoji = EXCLUDED.emoji, description = EXCLUDED.description;
      `, [a.id, a.cityId, a.name, a.category, a.cost, a.duration, a.emoji, a.description]);
    }

    console.log(`✅ ${activitiesList.length} activities seeded successfully!`);

    // 5. Insert Sample Curated Trips
    const sampleTrips = [
      {
        id: 'trip_gujarat_grand',
        userId: 'u1',
        name: 'Vibrant Gujarat: Heritage, Desert & Lions',
        description: 'An unforgettable 10-day expedition across Gujarat exploring UNESCO Ahmedabad, the White Rann of Kutch, Asiatic lions in Gir, and sacred Somnath & Dwarka.',
        startDate: '2026-10-15',
        endDate: '2026-10-25',
        coverColor: '#F7971E',
        isPublic: true,
        totalBudget: 1200,
        stops: [
          {
            id: 'stop_g1', cityId: 'c_ahmedabad', cityName: 'Ahmedabad', emoji: '🕌',
            startDate: '2026-10-15', endDate: '2026-10-17',
            accommodation: 'House of MG Heritage Hotel', accommodationCost: 90, transportCost: 50, orderIndex: 0,
            activities: [
              { id: 'tact_1', name: 'Sabarmati Ashram & Riverfront Walk', category: 'Heritage', cost: 0, duration: '2h', emoji: '🕊️', scheduledDate: '2026-10-15', time: '16:00', notes: 'Enjoy the evening breeze' },
              { id: 'tact_2', name: 'Manek Chowk Midnight Street Food Safari', category: 'Food', cost: 12, duration: '2h', emoji: '🥪', scheduledDate: '2026-10-15', time: '21:30', notes: 'Must try Gwalior dosa & chocolate sandwich' },
              { id: 'tact_3', name: 'Adalaj Stepwell (Vav) Architecture Tour', category: 'Sightseeing', cost: 5, duration: '2h', emoji: '🏛️', scheduledDate: '2026-10-16', time: '10:00', notes: 'Great photo spot' }
            ]
          },
          {
            id: 'stop_g2', cityId: 'c_kutch', cityName: 'Rann of Kutch', emoji: '🏜️',
            startDate: '2026-10-17', endDate: '2026-10-20',
            accommodation: 'White Rann Tent City Resort', accommodationCost: 110, transportCost: 80, orderIndex: 1,
            activities: [
              { id: 'tact_4', name: 'Sunset & Full Moon at White Rann', category: 'Nature', cost: 15, duration: '3h', emoji: '🌕', scheduledDate: '2026-10-18', time: '17:00', notes: 'Walk on the endless white salt desert' },
              { id: 'tact_5', name: 'Rann Utsav Cultural Folk Dance & Music', category: 'Cultural', cost: 20, duration: '3h', emoji: '💃', scheduledDate: '2026-10-18', time: '20:00', notes: 'Live garba and Kutchi artists' }
            ]
          },
          {
            id: 'stop_g3', cityId: 'c_gir', cityName: 'Gir National Park', emoji: '🦁',
            startDate: '2026-10-20', endDate: '2026-10-22',
            accommodation: 'Fern Gir Forest Resort', accommodationCost: 85, transportCost: 60, orderIndex: 2,
            activities: [
              { id: 'tact_6', name: 'Early Morning Asiatic Lion Jeep Safari', category: 'Safari', cost: 45, duration: '3.5h', emoji: '🦁', scheduledDate: '2026-10-21', time: '06:00', notes: 'Pre-booked safari slot 1' }
            ]
          },
          {
            id: 'stop_g4', cityId: 'c_statue_of_unity', cityName: 'Statue of Unity (Kevadia)', emoji: '🗽',
            startDate: '2026-10-22', endDate: '2026-10-25',
            accommodation: 'Narmada Tent City 1', accommodationCost: 95, transportCost: 45, orderIndex: 3,
            activities: [
              { id: 'tact_7', name: 'Statue Viewing Gallery at 153m', category: 'Sightseeing', cost: 18, duration: '2h', emoji: '🔭', scheduledDate: '2026-10-23', time: '10:30', notes: 'Express elevator entry' },
              { id: 'tact_8', name: 'Narmada River Laser Light & Sound Show', category: 'Entertainment', cost: 10, duration: '1.5h', emoji: '✨', scheduledDate: '2026-10-23', time: '19:00', notes: 'Grand laser projection' }
            ]
          }
        ]
      },
      {
        id: 'trip_european_dream',
        userId: 'u1',
        name: 'European Romance & Art Capitals',
        description: 'Classic grand tour of Paris and Rome experiencing world wonders and culinary delights.',
        startDate: '2026-11-05',
        endDate: '2026-11-15',
        coverColor: '#6C63FF',
        isPublic: true,
        totalBudget: 3000,
        stops: [
          {
            id: 'stop_e1', cityId: 'c1', cityName: 'Paris', emoji: '🗼',
            startDate: '2026-11-05', endDate: '2026-11-10',
            accommodation: 'Hotel Le Marais', accommodationCost: 160, transportCost: 200, orderIndex: 0,
            activities: [
              { id: 'tact_e1', name: 'Eiffel Tower Summit & Champagne', category: 'Sightseeing', cost: 35, duration: '3h', emoji: '🗼', scheduledDate: '2026-11-06', time: '10:00', notes: 'Sunset summit' },
              { id: 'tact_e2', name: 'Louvre Museum Guided Masterpieces', category: 'Museum', cost: 25, duration: '4h', emoji: '🎨', scheduledDate: '2026-11-07', time: '09:30', notes: 'Mona Lisa viewing' }
            ]
          }
        ]
      }
    ];

    for (const t of sampleTrips) {
      await client.query(`
        INSERT INTO trips (id, user_id, name, description, start_date, end_date, cover_color, is_public, total_budget)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name, description = EXCLUDED.description, start_date = EXCLUDED.start_date,
            end_date = EXCLUDED.end_date, cover_color = EXCLUDED.cover_color, is_public = EXCLUDED.is_public,
            total_budget = EXCLUDED.total_budget, updated_at = NOW();
      `, [t.id, t.userId, t.name, t.description, t.startDate, t.endDate, t.coverColor, t.isPublic, t.totalBudget]);

      // Delete existing stops to prevent duplicates upon re-seed
      await client.query('DELETE FROM trip_stops WHERE trip_id = $1', [t.id]);

      for (const s of t.stops) {
        await client.query(`
          INSERT INTO trip_stops (id, trip_id, city_id, city_name, emoji, start_date, end_date, accommodation, accommodation_cost, transport_cost, order_index)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [s.id, t.id, s.cityId, s.cityName, s.emoji, s.startDate, s.endDate, s.accommodation, s.accommodationCost, s.transportCost, s.orderIndex]);

        for (const a of s.activities) {
          await client.query(`
            INSERT INTO trip_activities (id, stop_id, name, category, cost, duration, emoji, scheduled_date, time, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `, [a.id, s.id, a.name, a.category, a.cost, a.duration, a.emoji, a.scheduledDate, a.time, a.notes]);
        }
      }
    }

    console.log(`✅ Sample trips, stops, and activities seeded successfully!`);

    await client.query('COMMIT');
    console.log('🎉 Database initialization complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Database initialization error:', err);
    throw err;
  } finally {
    client.release();
    pool.end();
  }
}

initDatabase().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
