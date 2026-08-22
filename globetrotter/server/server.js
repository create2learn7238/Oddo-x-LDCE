import express from 'express';
import cors from 'cors';
import { pool, query } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    const result = await query('SELECT NOW() as db_time');
    res.json({ status: 'healthy', database: 'PostgreSQL (Neon)', time: result.rows[0].db_time });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ── Auth Routes ───────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'User not found.' });
    }
    const user = result.rows[0];
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid password.' });
    }
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email already registered.' });
    }
    const id = `u_${Date.now()}`;
    const result = await query(`
      INSERT INTO users (id, name, email, password, role)
      VALUES ($1, $2, $3, $4, 'user')
      RETURNING id, name, email, role, avatar, bio, join_date
    `, [id, name, email, password]);

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/auth/profile', async (req, res) => {
  const { id, name, email, avatar, bio } = req.body;
  try {
    const result = await query(`
      UPDATE users
      SET name = COALESCE($2, name),
          email = COALESCE($3, email),
          avatar = COALESCE($4, avatar),
          bio = COALESCE($5, bio)
      WHERE id = $1
      RETURNING id, name, email, role, avatar, bio, join_date
    `, [id, name, email, avatar, bio]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Cities Routes ─────────────────────────────────────────────
app.get('/api/cities', async (req, res) => {
  const { search, region, cost } = req.query;
  try {
    let sql = 'SELECT * FROM cities WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (LOWER(name) LIKE LOWER($${params.length}) OR LOWER(state) LIKE LOWER($${params.length}) OR LOWER(country) LIKE LOWER($${params.length}))`;
    }
    if (region && region !== 'All') {
      params.push(region);
      sql += ` AND region = $${params.length}`;
    }
    if (cost && cost !== 'All') {
      params.push(cost);
      sql += ` AND cost_index = $${params.length}`;
    }

    sql += ' ORDER BY popularity DESC';
    const result = await query(sql, params);

    // Format for frontend
    const formatted = result.rows.map(c => ({
      id: c.id,
      name: c.name,
      state: c.state,
      country: c.country,
      region: c.region,
      emoji: c.emoji,
      costIndex: c.cost_index,
      popularity: c.popularity,
      image: c.image,
      description: c.description,
      avgDailyCost: Number(c.avg_daily_cost),
      tags: c.tags || [],
      bestSeason: c.best_season
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Activities Routes ─────────────────────────────────────────
app.get('/api/activities', async (req, res) => {
  const { cityId, category, maxCost } = req.query;
  try {
    let sql = `
      SELECT a.*, c.name as city_name, c.emoji as city_emoji, c.country as city_country
      FROM activities a
      LEFT JOIN cities c ON a.city_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (cityId) {
      params.push(cityId);
      sql += ` AND a.city_id = $${params.length}`;
    }
    if (category && category !== 'All') {
      params.push(category);
      sql += ` AND a.category = $${params.length}`;
    }
    if (maxCost) {
      params.push(Number(maxCost));
      sql += ` AND a.cost <= $${params.length}`;
    }

    sql += ' ORDER BY a.cost ASC';
    const result = await query(sql, params);

    const formatted = result.rows.map(a => ({
      id: a.id,
      cityId: a.city_id,
      cityName: a.city_name,
      cityEmoji: a.city_emoji,
      cityCountry: a.city_country,
      name: a.name,
      category: a.category,
      cost: Number(a.cost),
      duration: a.duration,
      emoji: a.emoji,
      description: a.description,
      rating: Number(a.rating)
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Trips Routes ──────────────────────────────────────────────
app.get('/api/trips', async (req, res) => {
  const { userId } = req.query;
  try {
    let sql = 'SELECT * FROM trips';
    const params = [];
    if (userId) {
      params.push(userId);
      sql += ' WHERE user_id = $1';
    }
    sql += ' ORDER BY created_at DESC';

    const tripsRes = await query(sql, params);
    const trips = tripsRes.rows;

    if (trips.length === 0) return res.json([]);

    const tripIds = trips.map(t => t.id);
    const stopsRes = await query(`
      SELECT * FROM trip_stops WHERE trip_id = ANY($1) ORDER BY order_index ASC, start_date ASC
    `, [tripIds]);

    const stopIds = stopsRes.rows.map(s => s.id);
    let actsRes = { rows: [] };
    if (stopIds.length > 0) {
      actsRes = await query(`
        SELECT * FROM trip_activities WHERE stop_id = ANY($1) ORDER BY scheduled_date ASC, time ASC
      `, [stopIds]);
    }

    const stopsByTrip = {};
    const actsByStop = {};

    actsRes.rows.forEach(a => {
      if (!actsByStop[a.stop_id]) actsByStop[a.stop_id] = [];
      actsByStop[a.stop_id].push({
        id: a.id,
        name: a.name,
        category: a.category,
        cost: Number(a.cost),
        duration: a.duration,
        emoji: a.emoji,
        scheduledDate: a.scheduled_date ? a.scheduled_date.toISOString().split('T')[0] : null,
        time: a.time,
        notes: a.notes
      });
    });

    stopsRes.rows.forEach(s => {
      if (!stopsByTrip[s.trip_id]) stopsByTrip[s.trip_id] = [];
      stopsByTrip[s.trip_id].push({
        id: s.id,
        cityId: s.city_id,
        cityName: s.city_name,
        emoji: s.emoji,
        startDate: s.start_date.toISOString().split('T')[0],
        endDate: s.end_date.toISOString().split('T')[0],
        accommodation: s.accommodation,
        accommodationCost: Number(s.accommodation_cost),
        transportCost: Number(s.transport_cost),
        orderIndex: s.order_index,
        activities: actsByStop[s.id] || []
      });
    });

    const fullTrips = trips.map(t => ({
      id: t.id,
      userId: t.user_id,
      name: t.name,
      description: t.description,
      startDate: t.start_date.toISOString().split('T')[0],
      endDate: t.end_date.toISOString().split('T')[0],
      coverColor: t.cover_color,
      isPublic: t.is_public,
      totalBudget: Number(t.total_budget),
      createdAt: t.created_at,
      stops: stopsByTrip[t.id] || []
    }));

    res.json(fullTrips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/trips/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tripRes = await query('SELECT * FROM trips WHERE id = $1', [id]);
    if (tripRes.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    const t = tripRes.rows[0];

    const stopsRes = await query(`
      SELECT * FROM trip_stops WHERE trip_id = $1 ORDER BY order_index ASC, start_date ASC
    `, [id]);

    const stopIds = stopsRes.rows.map(s => s.id);
    let actsRes = { rows: [] };
    if (stopIds.length > 0) {
      actsRes = await query(`
        SELECT * FROM trip_activities WHERE stop_id = ANY($1) ORDER BY scheduled_date ASC, time ASC
      `, [stopIds]);
    }

    const actsByStop = {};
    actsRes.rows.forEach(a => {
      if (!actsByStop[a.stop_id]) actsByStop[a.stop_id] = [];
      actsByStop[a.stop_id].push({
        id: a.id,
        name: a.name,
        category: a.category,
        cost: Number(a.cost),
        duration: a.duration,
        emoji: a.emoji,
        scheduledDate: a.scheduled_date ? a.scheduled_date.toISOString().split('T')[0] : null,
        time: a.time,
        notes: a.notes
      });
    });

    const stops = stopsRes.rows.map(s => ({
      id: s.id,
      cityId: s.city_id,
      cityName: s.city_name,
      emoji: s.emoji,
      startDate: s.start_date.toISOString().split('T')[0],
      endDate: s.end_date.toISOString().split('T')[0],
      accommodation: s.accommodation,
      accommodationCost: Number(s.accommodation_cost),
      transportCost: Number(s.transport_cost),
      orderIndex: s.order_index,
      activities: actsByStop[s.id] || []
    }));

    res.json({
      id: t.id,
      userId: t.user_id,
      name: t.name,
      description: t.description,
      startDate: t.start_date.toISOString().split('T')[0],
      endDate: t.end_date.toISOString().split('T')[0],
      coverColor: t.cover_color,
      isPublic: t.is_public,
      totalBudget: Number(t.total_budget),
      createdAt: t.created_at,
      stops
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id, userId, name, description, startDate, endDate, coverColor, isPublic, totalBudget, stops } = req.body;
    const tripId = id || `trip_${Date.now()}`;

    await client.query(`
      INSERT INTO trips (id, user_id, name, description, start_date, end_date, cover_color, is_public, total_budget)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [tripId, userId, name, description, startDate, endDate, coverColor || '#6C63FF', isPublic || false, totalBudget || 0]);

    if (stops && stops.length > 0) {
      for (let i = 0; i < stops.length; i++) {
        const s = stops[i];
        const stopId = s.id || `stop_${Date.now()}_${i}`;
        await client.query(`
          INSERT INTO trip_stops (id, trip_id, city_id, city_name, emoji, start_date, end_date, accommodation, accommodation_cost, transport_cost, order_index)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [stopId, tripId, s.cityId, s.cityName, s.emoji || '📍', s.startDate, s.endDate, s.accommodation, s.accommodationCost || 0, s.transportCost || 0, i]);

        if (s.activities && s.activities.length > 0) {
          for (let j = 0; j < s.activities.length; j++) {
            const a = s.activities[j];
            const actId = a.id || `tact_${Date.now()}_${j}`;
            await client.query(`
              INSERT INTO trip_activities (id, stop_id, name, category, cost, duration, emoji, scheduled_date, time, notes)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `, [actId, stopId, a.name, a.category, a.cost || 0, a.duration, a.emoji || '📌', a.scheduledDate, a.time, a.notes]);
          }
        }
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, tripId });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.put('/api/trips/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { name, description, startDate, endDate, coverColor, isPublic, totalBudget, stops } = req.body;

    await client.query(`
      UPDATE trips
      SET name = COALESCE($2, name),
          description = COALESCE($3, description),
          start_date = COALESCE($4, start_date),
          end_date = COALESCE($5, end_date),
          cover_color = COALESCE($6, cover_color),
          is_public = COALESCE($7, is_public),
          total_budget = COALESCE($8, total_budget),
          updated_at = NOW()
      WHERE id = $1
    `, [id, name, description, startDate, endDate, coverColor, isPublic, totalBudget]);

    if (stops !== undefined) {
      await client.query('DELETE FROM trip_stops WHERE trip_id = $1', [id]);

      for (let i = 0; i < stops.length; i++) {
        const s = stops[i];
        const stopId = s.id || `stop_${Date.now()}_${i}`;
        await client.query(`
          INSERT INTO trip_stops (id, trip_id, city_id, city_name, emoji, start_date, end_date, accommodation, accommodation_cost, transport_cost, order_index)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [stopId, id, s.cityId, s.cityName, s.emoji || '📍', s.startDate, s.endDate, s.accommodation, s.accommodationCost || 0, s.transportCost || 0, i]);

        if (s.activities && s.activities.length > 0) {
          for (let j = 0; j < s.activities.length; j++) {
            const a = s.activities[j];
            const actId = a.id || `tact_${Date.now()}_${j}`;
            await client.query(`
              INSERT INTO trip_activities (id, stop_id, name, category, cost, duration, emoji, scheduled_date, time, notes)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `, [actId, stopId, a.name, a.category, a.cost || 0, a.duration, a.emoji || '📌', a.scheduledDate, a.time, a.notes]);
          }
        }
      }
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/trips/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM trips WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin Analytics Route ─────────────────────────────────────
app.get('/api/admin/stats', async (req, res) => {
  try {
    const userCount = await query('SELECT COUNT(*) FROM users');
    const tripCount = await query('SELECT COUNT(*) FROM trips');
    const cityCount = await query('SELECT COUNT(*) FROM cities');
    const actCount = await query('SELECT COUNT(*) FROM trip_activities');
    const allUsers = await query('SELECT id, name, email, role, join_date FROM users ORDER BY join_date DESC');
    const allTrips = await query('SELECT * FROM trips ORDER BY created_at DESC');

    const topCities = await query(`
      SELECT city_name as name, COUNT(*) as count 
      FROM trip_stops 
      GROUP BY city_name 
      ORDER BY count DESC 
      LIMIT 6
    `);

    res.json({
      totalUsers: parseInt(userCount.rows[0].count),
      totalTrips: parseInt(tripCount.rows[0].count),
      totalCities: parseInt(cityCount.rows[0].count),
      totalActivities: parseInt(actCount.rows[0].count),
      users: allUsers.rows,
      trips: allTrips.rows,
      topCities: topCities.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 GlobeTrotter Backend API running on http://localhost:${PORT}`);
});
