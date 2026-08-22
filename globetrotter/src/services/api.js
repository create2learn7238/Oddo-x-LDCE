// API Client interacting with GlobeTrotter PostgreSQL Neon DB backend

const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Health
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  },

  register: async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return await res.json();
  },

  updateProfile: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  },

  // Cities
  getCities: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.region && filters.region !== 'All') params.append('region', filters.region);
    if (filters.cost && filters.cost !== 'All') params.append('cost', filters.cost);

    const res = await fetch(`${API_BASE}/cities?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return await res.json();
  },

  // Activities
  getActivities: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.cityId) params.append('cityId', filters.cityId);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.maxCost) params.append('maxCost', filters.maxCost);

    const res = await fetch(`${API_BASE}/activities?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch activities');
    return await res.json();
  },

  // Trips
  getTrips: async (userId) => {
    const url = userId ? `${API_BASE}/trips?userId=${userId}` : `${API_BASE}/trips`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch trips');
    return await res.json();
  },

  getTripById: async (id) => {
    const res = await fetch(`${API_BASE}/trips/${id}`);
    if (!res.ok) throw new Error('Failed to fetch trip');
    return await res.json();
  },

  createTrip: async (tripData) => {
    const res = await fetch(`${API_BASE}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });
    if (!res.ok) throw new Error('Failed to create trip');
    return await res.json();
  },

  updateTrip: async (id, tripData) => {
    const res = await fetch(`${API_BASE}/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });
    if (!res.ok) throw new Error('Failed to update trip');
    return await res.json();
  },

  deleteTrip: async (id) => {
    const res = await fetch(`${API_BASE}/trips/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete trip');
    return await res.json();
  },

  // Admin Stats
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return await res.json();
  }
};
