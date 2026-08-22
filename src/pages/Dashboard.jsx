import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import TripCard from '../components/TripCard'
import DestinationCard from '../components/DestinationCard'
import TravelerReviews from '../components/TravelerReviews'
import CurrencyTicker from '../components/CurrencyTicker'
import AmbientSoundscape from '../components/AmbientSoundscape'
import {
  Plus, Compass, MapPin, Sparkles, TrendingUp,
  Calendar, CheckCircle, ArrowRight, Heart, Plane, Shield
} from 'lucide-react'

export default function Dashboard() {
  const { user, trips, cities, dispatch, showToast, formatPrice, favorites } = useApp()
  const navigate = useNavigate()
  const [showGenModal, setShowGenModal] = useState(false)
  const [generating, setGenerating] = useState(false)

  const userTrips = trips.filter(t => t.userId === user?.id || t.userId === 'user-1' || t.userId === 'user-2')
  const upcomingTrips = userTrips.filter(t => new Date(t.startDate) >= new Date())
  const activeTrip = userTrips.find(t => {
    const now = new Date()
    return new Date(t.startDate) <= now && new Date(t.endDate) >= now
  }) || userTrips[0]

  const favCities = cities.filter(c => favorites[c.id])
  const gujaratCities = cities.filter(c => c.country === 'India' && (c.region?.includes('Gujarat') || ['Ahmedabad','Rann of Kutch','Statue of Unity','Gir National Park','Somnath','Dwarka','Vadodara','Surat'].some(k => c.name.includes(k))))

  // Quick 1-Click Smart Generator Presets
  const PRESET_TRIPS = [
    {
      name: '🦁 Grand Gujarat Heritage & Wildlife',
      description: 'UNESCO Ahmedabad, White Rann of Kutch, Asiatic Lion Safari in Gir, and Statue of Unity',
      stops: [
        { cityId: 'city-1', cityName: 'Ahmedabad', emoji: '🕌', startDate: '2026-11-10', endDate: '2026-11-12', accommodation: 'House of MG Heritage Hotel', accommodationCost: 90, transportCost: 30, activities: [
          { id: 'act-101', name: 'Old Ahmedabad Heritage Pol Walk', scheduledDate: '2026-11-11', time: '08:00', cost: 15, emoji: '🚶' },
          { id: 'act-102', name: 'Sabarmati Gandhi Ashram & Riverfront', scheduledDate: '2026-11-11', time: '16:00', cost: 5, emoji: '🕊️' }
        ]},
        { cityId: 'city-2', cityName: 'Rann of Kutch', emoji: '🎪', startDate: '2026-11-13', endDate: '2026-11-15', accommodation: 'Tent City Dhordo Premium', accommodationCost: 140, transportCost: 50, activities: [
          { id: 'act-104', name: 'White Desert Sunset Camel Safari', scheduledDate: '2026-11-14', time: '17:00', cost: 35, emoji: '🐪' }
        ]},
        { cityId: 'city-4', cityName: 'Gir National Park', emoji: '🦁', startDate: '2026-11-16', endDate: '2026-11-18', accommodation: 'Woods at Sasan Jungle Resort', accommodationCost: 120, transportCost: 40, activities: [
          { id: 'act-107', name: 'Open Gypsy Asiatic Lion Safari', scheduledDate: '2026-11-17', time: '06:00', cost: 65, emoji: '🚙' }
        ]}
      ],
      startDate: '2026-11-10',
      endDate: '2026-11-18',
      totalBudget: 1200,
      coverColor: '#F59E0B'
    },
    {
      name: '🗼 European Romance & Art Capitals',
      description: 'Parisian museums, historic Louvre, Rome Colosseum, and timeless Vatican treasures',
      stops: [
        { cityId: 'city-7', cityName: 'Paris', emoji: '🥐', startDate: '2026-09-05', endDate: '2026-09-08', accommodation: 'Boutique Hotel Saint-Germain', accommodationCost: 180, transportCost: 70, activities: [
          { id: 'act-113', name: 'Eiffel Tower Summit Access', scheduledDate: '2026-09-06', time: '10:00', cost: 40, emoji: '🗼' }
        ]},
        { cityId: 'city-9', cityName: 'Rome', emoji: '🏛️', startDate: '2026-09-09', endDate: '2026-09-12', accommodation: 'Residenza Navona', accommodationCost: 160, transportCost: 90, activities: [
          { id: 'act-117', name: 'Colosseum & Roman Forum Guided Tour', scheduledDate: '2026-09-10', time: '09:00', cost: 55, emoji: '⚔️' }
        ]}
      ],
      startDate: '2026-09-05',
      endDate: '2026-09-12',
      totalBudget: 2400,
      coverColor: '#6C63FF'
    }
  ]

  const handleCreatePreset = (preset) => {
    setGenerating(true)
    setTimeout(() => {
      const newTrip = {
        id: 'trip-' + Date.now(),
        userId: user?.id || 'demo-user',
        name: preset.name,
        description: preset.description,
        startDate: preset.startDate,
        endDate: preset.endDate,
        totalBudget: preset.totalBudget,
        isPublic: true,
        coverColor: preset.coverColor,
        stops: preset.stops,
        createdAt: new Date().toISOString()
      }

      dispatch({ type: 'ADD_TRIP', payload: newTrip })
      showToast(`Generated "${preset.name}"!`, 'success')
      setGenerating(false)
      setShowGenModal(false)
      navigate(`/trips/${newTrip.id}/view`)
    }, 600)
  }

  return (
    <div className="page-container animate-fadeIn">
      {/* Live FX Rates Ticker */}
      <CurrencyTicker />

      {/* Top Welcome Hero Banner */}
      <div style={{
        background: 'var(--grad-hero)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8) var(--space-10)',
        marginBottom: 'var(--space-8)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Ambient Glow */}
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 300, height: 300,
          background: 'var(--color-primary-glow)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none'
        }} />

        <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--space-6)', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--color-primary-glow)', padding: '4px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-3)' }}>
              <Sparkles size={14} color="var(--color-warning)" />
              <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--color-primary-light)' }}>
                Intelligent Travel Planner & Multi-City Engine
              </span>
            </div>
            <h1 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)', lineHeight: 1.2 }}>
              Welcome Back, {user?.name?.split(' ')[0] || 'Traveler'}! ✈️
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-base)', lineHeight: 1.5 }}>
              Dream, customize, and budget your next world tour or Gujarat heritage expedition with seamless itinerary building.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate('/trips/create')}>
                <Plus size={16} /> Plan New Trip
              </button>
              <button className="btn btn-secondary" onClick={() => setShowGenModal(true)}>
                <Sparkles size={15} color="var(--color-warning)" /> 1-Click Trip Generator
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/explore')}>
                <Compass size={15} /> Explore Destinations
              </button>
            </div>
          </div>

          {/* Quick Stat Pill Widget */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', minWidth: 260 }}>
            {[
              { label: 'Planned Trips', val: userTrips.length, icon: '🗺️' },
              { label: 'Wishlist Places', val: Object.keys(favorites).length, icon: '❤️' },
              { label: 'Curated Cities', val: cities.length, icon: '🏙️' },
              { label: 'Verified Spots', val: '29+', icon: '🎯' }
            ].map(s => (
              <div key={s.label} style={{
                background: 'var(--color-surface2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3) var(--space-4)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.2rem', marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-xl)', color: 'var(--color-primary-light)' }}>{s.val}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)' }}>
        
        {/* Left Column: Your Trips & Recent Routes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="flex-between">
            <div>
              <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700 }}>Your Travel Plans</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)' }}>Active & upcoming itineraries</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/trips')}>
              View All ({userTrips.length}) <ArrowRight size={13} />
            </button>
          </div>

          {userTrips.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>No trips created yet. Start by generating your first route!</p>
              <button className="btn btn-primary btn-sm" onClick={() => setShowGenModal(true)}>
                <Sparkles size={14} /> 1-Click Generate Trip
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {userTrips.slice(0, 3).map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Featured Gujarat & Wishlist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Wishlist Section */}
          {favCities.length > 0 && (
            <div>
              <div className="flex-between" style={{ marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Heart size={18} color="var(--color-accent)" fill="var(--color-accent)" />
                  Your Wishlist ({favCities.length})
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                {favCities.slice(0, 2).map(c => (
                  <DestinationCard key={c.id} city={c} />
                ))}
              </div>
            </div>
          )}

          {/* Highlights of Gujarat */}
          <div>
            <div className="flex-between" style={{ marginBottom: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700 }}>🦁 Explore Vibrant Gujarat</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)' }}>Top heritage and wildlife destinations</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/explore')}>
                All Cities <ArrowRight size={13} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
              {gujaratCities.slice(0, 2).map(c => (
                <DestinationCard key={c.id} city={c} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Verified Traveler Reviews & Feed */}
      <div style={{ marginTop: 'var(--space-10)' }}>
        <TravelerReviews />
      </div>

      {/* Ambient Destination Soundscapes */}
      <div style={{ marginTop: 'var(--space-8)' }}>
        <AmbientSoundscape />
      </div>

      {/* 1-Click Generator Modal */}
      {showGenModal && (
        <div className="modal-overlay" onClick={() => !generating && setShowGenModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">🪄 1-Click Smart Itinerary Generator</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)' }}>
                  Select a pre-designed multi-stop tour with balanced schedules & costs
                </p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => !generating && setShowGenModal(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', margin: 'var(--space-4) 0' }}>
              {PRESET_TRIPS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => !generating && handleCreatePreset(preset)}
                  style={{
                    padding: 'var(--space-5)',
                    background: 'var(--color-surface2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: generating ? 'not-allowed' : 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <div className="flex-between" style={{ marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--fs-base)' }}>{preset.name}</div>
                    <span className="badge badge-warning">{formatPrice(preset.totalBudget)}</span>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginBottom: 'var(--space-3)' }}>
                    {preset.description}
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {preset.stops.map(s => (
                      <span key={s.cityName} style={{ fontSize: '10px', background: 'var(--color-surface3)', padding: '2px 8px', borderRadius: 'var(--radius-full)', color: 'var(--color-text)' }}>
                        {s.emoji} {s.cityName}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {generating && (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <div className="spinner" style={{ width: 24, height: 24, margin: '0 auto var(--space-2)' }} />
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-primary-light)', fontWeight: 600 }}>
                  Building multi-stop itinerary and calculating rates...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
