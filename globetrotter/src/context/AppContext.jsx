import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { seedTrips, cities as seedCities, activities as seedActivities } from '../data/seed';
import { api } from '../services/api';

const AppContext = createContext(null);

export const THEMES = [
  { id: 'cyber',   name: 'Midnight Cyber',   emoji: '🌌', primary: '#6C63FF', accent: '#FF6584' },
  { id: 'gujarat', name: 'Vibrant Gujarat',  emoji: '🦁', primary: '#F59E0B', accent: '#EF4444' },
  { id: 'ocean',   name: 'Ocean Sapphire',   emoji: '🌊', primary: '#06B6D4', accent: '#3B82F6' },
  { id: 'emerald', name: 'Emerald Forest',   emoji: '🌿', primary: '#10B981', accent: '#84CC16' },
  { id: 'sunset',  name: 'Sunset Mirage',    emoji: '🌆', primary: '#EC4899', accent: '#F97316' },
  { id: 'light',   name: 'Luxe Porcelain',   emoji: '☀️', primary: '#5B50E6', accent: '#E11D48' },
];

export const CURRENCIES = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar' },
  INR: { symbol: '₹', rate: 86.5, name: 'Indian Rupee' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
  AED: { symbol: 'د.إ', rate: 3.67, name: 'UAE Dirham' },
  JPY: { symbol: '¥', rate: 154.0, name: 'Japanese Yen' },
};

const initialState = {
  user: null,
  trips: [],
  cities: seedCities,
  activities: seedActivities,
  toast: null,
  dbStatus: 'connecting',
  theme: localStorage.getItem('gt_theme') || 'cyber',
  currency: localStorage.getItem('gt_currency') || 'USD',
  favorites: JSON.parse(localStorage.getItem('gt_favorites') || '[]'),
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'LOGOUT':
      return { ...state, user: null };

    case 'SET_TRIPS':
      return { ...state, trips: action.payload };

    case 'SET_CITIES':
      return { ...state, cities: action.payload };

    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };

    case 'SET_DB_STATUS':
      return { ...state, dbStatus: action.payload };

    case 'SET_THEME': {
      localStorage.setItem('gt_theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
      return { ...state, theme: action.payload };
    }

    case 'SET_CURRENCY': {
      localStorage.setItem('gt_currency', action.payload);
      return { ...state, currency: action.payload };
    }

    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.includes(action.payload);
      const favorites = exists
        ? state.favorites.filter(id => id !== action.payload)
        : [...state.favorites, action.payload];
      localStorage.setItem('gt_favorites', JSON.stringify(favorites));
      return { ...state, favorites };
    }

    case 'ADD_TRIP': {
      const trips = [action.payload, ...state.trips];
      localStorage.setItem('gt_trips', JSON.stringify(trips));
      return { ...state, trips };
    }

    case 'UPDATE_TRIP': {
      const trips = state.trips.map(t =>
        t.id === action.payload.id ? action.payload : t
      );
      localStorage.setItem('gt_trips', JSON.stringify(trips));
      return { ...state, trips };
    }

    case 'DELETE_TRIP': {
      const trips = state.trips.filter(t => t.id !== action.payload);
      localStorage.setItem('gt_trips', JSON.stringify(trips));
      return { ...state, trips };
    }

    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };

    case 'HIDE_TOAST':
      return { ...state, toast: null };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Initialize and load data from PostgreSQL DB
  useEffect(() => {
    const savedUser = localStorage.getItem('gt_user');
    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }

    async function loadDataFromDb() {
      try {
        const health = await api.checkHealth();
        if (health.status === 'healthy') {
          dispatch({ type: 'SET_DB_STATUS', payload: 'connected' });

          const citiesData = await api.getCities();
          if (citiesData && citiesData.length > 0) {
            dispatch({ type: 'SET_CITIES', payload: citiesData });
          }

          const activitiesData = await api.getActivities();
          if (activitiesData && activitiesData.length > 0) {
            dispatch({ type: 'SET_ACTIVITIES', payload: activitiesData });
          }

          const tripsData = await api.getTrips();
          if (tripsData && tripsData.length > 0) {
            dispatch({ type: 'SET_TRIPS', payload: tripsData });
            localStorage.setItem('gt_trips', JSON.stringify(tripsData));
          } else {
            const savedTrips = localStorage.getItem('gt_trips');
            dispatch({ type: 'SET_TRIPS', payload: savedTrips ? JSON.parse(savedTrips) : seedTrips });
          }
        } else {
          dispatch({ type: 'SET_DB_STATUS', payload: 'offline' });
          const savedTrips = localStorage.getItem('gt_trips');
          dispatch({ type: 'SET_TRIPS', payload: savedTrips ? JSON.parse(savedTrips) : seedTrips });
        }
      } catch (err) {
        console.warn('Backend offline, using fallback:', err);
        dispatch({ type: 'SET_DB_STATUS', payload: 'offline' });
        const savedTrips = localStorage.getItem('gt_trips');
        dispatch({ type: 'SET_TRIPS', payload: savedTrips ? JSON.parse(savedTrips) : seedTrips });
      }
    }

    loadDataFromDb();
  }, []);

  // Toast auto-hide
  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3500);
      return () => clearTimeout(t);
    }
  }, [state.toast]);

  const showToast = (message, type = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
  };

  const login = (user) => {
    localStorage.setItem('gt_user', JSON.stringify(user));
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    localStorage.removeItem('gt_user');
    dispatch({ type: 'LOGOUT' });
  };

  const setTheme = (themeId) => {
    dispatch({ type: 'SET_THEME', payload: themeId });
    showToast(`Switched theme to ${THEMES.find(t=>t.id===themeId)?.name || themeId}`, 'info');
  };

  const setCurrency = (cur) => {
    dispatch({ type: 'SET_CURRENCY', payload: cur });
    showToast(`Currency updated to ${cur} (${CURRENCIES[cur]?.symbol})`, 'info');
  };

  const toggleFavorite = (cityId) => {
    const isFav = state.favorites.includes(cityId);
    dispatch({ type: 'TOGGLE_FAVORITE', payload: cityId });
    showToast(isFav ? 'Removed from favorites' : 'Added to favorites ❤️', 'success');
  };

  const formatPrice = (usdAmount) => {
    const num = Number(usdAmount) || 0;
    const curObj = CURRENCIES[state.currency] || CURRENCIES.USD;
    const converted = Math.round(num * curObj.rate);
    return `${curObj.symbol}${converted.toLocaleString()}`;
  };

  const createTrip = async (tripData) => {
    try {
      await api.createTrip(tripData);
    } catch (e) {
      console.warn('Could not sync trip to server:', e);
    }
    dispatch({ type: 'ADD_TRIP', payload: tripData });
  };

  const updateTrip = async (tripData) => {
    try {
      await api.updateTrip(tripData.id, tripData);
    } catch (e) {
      console.warn('Could not sync trip update to server:', e);
    }
    dispatch({ type: 'UPDATE_TRIP', payload: tripData });
  };

  const deleteTrip = async (tripId) => {
    try {
      await api.deleteTrip(tripId);
    } catch (e) {
      console.warn('Could not sync trip deletion to server:', e);
    }
    dispatch({ type: 'DELETE_TRIP', payload: tripId });
  };

  return (
    <AppContext.Provider value={{
      ...state,
      dispatch,
      showToast,
      login,
      logout,
      setTheme,
      setCurrency,
      toggleFavorite,
      formatPrice,
      createTrip,
      updateTrip,
      deleteTrip
    }}>
      {children}
      {state.toast && (
        <div className={`toast toast-${state.toast.type}`}>
          <span>{state.toast.message}</span>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
