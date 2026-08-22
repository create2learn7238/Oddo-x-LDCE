import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  Plus, Map, Globe, Calendar, DollarSign,
  ArrowRight, Sparkles, Wand2, Heart, Check, X
} from 'lucide-react'
import TripCard from '../components/TripCard'
import DestinationCard from '../components/DestinationCard'

export default function Dashboard() {
  const { user, trips, cities, favorites, formatPrice, createTrip, showToast } = useApp()
  const navigate = useNavigate()
  const [showAiModal, setShowAiModal] = useState(false)

  const cityList = cities || []
  const userTrips = trips.filter(t => t.userId === user?.id)
  const upcomingTrips = userTrips.filter(t => new Date(t.startDate) >= new Date()).sort((a,b) => new Date(a.startDate)-new Date(b.startDate))
  const recentTrips = [...userTrips].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,4)
  const popularCities = [...cityList].sort((a,b) => b.popularity - a.popularity).slice(0,4)
  const favoritedCities = cityList.filter(c => favorites.includes(c.id))

  const totalCities = userTrips.reduce((acc, t) => acc + (t.stops?.length||0), 0)
  const totalDays = userTrips.reduce((acc, t) => {
    const days = Math.ceil((new Date(t.endDate)-new Date(t.startDate))/(1000*60*60*24))
    return acc + Math.max(0, days)
  }, 0)
  const totalBudget = userTrips.reduce((acc, t) => acc + (t.totalBudget||0), 0)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Smart Templates
  const SMART_TEMPLATES = [
    {
      id: 'template_gujarat',
      title: 'Grand Gujarat Heritage & Wildlife',
      duration: '7 Days',
      emoji: '🦁',
      color: '#F59E0B',
      budget: 800,
      description: 'UNESCO Ahmedabad, White Rann of Kutch & Asiatic Lions of Gir',
      stops: [
        {
          id: `s_g_${Date.now()}_1`, cityId: 'c_ahmedabad', cityName: 'Ahmedabad', emoji: '🕌',
          startDate: '2026-10-10', endDate: '2026-10-12', accommodation: 'Heritage Haveli Hotel',
          accommodationCost: 80, transportCost: 40,
          activities: [
            { id: `a_${Date.now()}_1`, name: 'Sabarmati Riverfront Walk', category: 'Heritage', cost: 0, duration: '2h', emoji: '🕊️', scheduledDate: '2026-10-10', time: '17:00' },
            { id: `a_${Date.now()}_2`, name: 'Manek Chowk Night Food Tour', category: 'Food', cost: 15, duration: '2h', emoji: '🥪', scheduledDate: '2026-10-10', time: '21:00' }
          ]
        },
        {
          id: `s_g_${Date.now()}_2`, cityId: 'c_kutch', cityName: 'Rann of Kutch', emoji: '🏜️',
          startDate: '2026-10-12', endDate: '2026-10-15', accommodation: 'Rann Utsav Tent City',
          accommodationCost: 120, transportCost: 70,
          activities: [
            { id: `a_${Date.now()}_3`, name: 'Sunset at White Rann Desert', category: 'Nature', cost: 15, duration: '3h', emoji: '🌕', scheduledDate: '2026-10-13', time: '17:30' }
          ]
        },
        {
          id: `s_g_${Date.now()}_3`, cityId: 'c_gir', cityName: 'Gir National Park', emoji: '🦁',
          startDate: '2026-10-15', endDate: '2026-10-17', accommodation: 'Gir Jungle Lodge',
          accommodationCost: 95, transportCost: 50,
          activities: [
            { id: `a_${Date.now()}_4`, name: 'Lion Safari in Gir Forest', category: 'Safari', cost: 45, duration: '3.5h', emoji: '🦁', scheduledDate: '2026-10-16', time: '06:30' }
          ]
        }
      ]
    },
    {
      id: 'template_rajasthan',
      title: 'Royal Rajasthan Forts & Lakes',
      duration: '6 Days',
      emoji: '👑',
      color: '#EC4899',
      budget: 950,
      description: 'Pink City Jaipur & Romance of Udaipur Lake Pichola',
      stops: [
        {
          id: `s_r_${Date.now()}_1`, cityId: 'c_jaipur', cityName: 'Jaipur', emoji: '👑',
          startDate: '2026-11-01', endDate: '2026-11-04', accommodation: 'Heritage Palace Hotel',
          accommodationCost: 90, transportCost: 60, activities: []
        },
        {
          id: `s_r_${Date.now()}_2`, cityId: 'c_udaipur', cityName: 'Udaipur', emoji: '🛶',
          startDate: '2026-11-04', endDate: '2026-11-07', accommodation: 'Lake View Boutique Stay',
          accommodationCost: 110, transportCost: 50, activities: []
        }
      ]
    },
    {
      id: 'template_europe',
      title: 'European Romance & Art Capitals',
      duration: '8 Days',
      emoji: '🗼',
      color: '#6C63FF',
      budget: 2400,
      description: 'Parisian museums and ancient Roman amphitheaters',
      stops: [
        {
          id: `s_e_${Date.now()}_1`, cityId: 'c1', cityName: 'Paris', emoji: '🗼',
          startDate: '2026-09-01', endDate: '2026-09-05', accommodation: 'Boutique Hotel Montmartre',
          accommodationCost: 160, transportCost: 200, activities: []
        },
        {
          id: `s_e_${Date.now()}_2`, cityId: 'c5', cityName: 'Rome', emoji: '🏛️',
          startDate: '2026-09-05', endDate: '2026-09-09', accommodation: 'Hotel Trastevere',
          accommodationCost: 140, transportCost: 150, activities: []
        }
      ]
    }
  ]

  const applyTemplate = (tpl) => {
    const newTrip = {
      id: `trip_${Date.now()}`,
      userId: user?.id || 'u1',
      name: tpl.title,
      description: tpl.description,
      startDate: tpl.stops[0].startDate,
      endDate: tpl.stops[tpl.stops.length - 1].endDate,
      totalBudget: tpl.budget,
      coverColor: tpl.color,
      isPublic: true,
      stops: tpl.stops,
      createdAt: new Date().toISOString(),
    }
    createTrip(newTrip)
    setShowAiModal(false)
    showToast(`"${tpl.title}" generated successfully!`, 'success')
    navigate(`/trips/${newTrip.id}/view`)
  }

  return (
    <div className="page-container animate-fadeIn">
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary-glow) 0%, var(--color-accent-glow) 100%)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-10) var(--space-8)',
        marginBottom: 'var(--space-8)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display:'flex',alignItems:'center',gap:'var(--space-2)',marginBottom:'var(--space-3)' }}>
            <Sparkles size={16} color="var(--color-warning)" />
            <span style={{ fontSize:'var(--fs-xs)',fontWeight:600,color:'var(--color-warning)',letterSpacing:'0.08em',textTransform:'uppercase' }}>
              Your Travel Command Center
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 800,
            marginBottom: 'var(--space-2)',
          }}>
            {greeting},{' '}
            <span className="text-gradient">{user?.name?.split(' ')[0] || 'Traveler'}! 👋</span>
          </h1>
          <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-md)',marginBottom:'var(--space-6)' }}>
            {upcomingTrips.length > 0
              ? `You have ${upcomingTrips.length} upcoming trip${upcomingTrips.length > 1 ? 's' : ''}. Where will your next story unfold?`
              : 'Ready to plan your next journey? The world is waiting for you.'}
          </p>
          <div style={{ display:'flex',gap:'var(--space-3)',flexWrap:'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/trips/new')} id="dash-new-trip">
              <Plus size={18} /> Plan New Trip
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => setShowAiModal(true)}>
              <Wand2 size={18} color="var(--color-accent)" /> 1-Click Trip Generator
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/cities')}>
              <Globe size={18} /> Explore Cities
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'var(--space-4)',marginBottom:'var(--space-8)' }}>
        {[
          { label:'Trips Planned',  value: userTrips.length, icon: Map,         color:'var(--color-primary)' },
          { label:'Cities Visited', value: totalCities,       icon: Globe,       color:'var(--color-accent)' },
          { label:'Days Traveled',  value: totalDays,         icon: Calendar,    color:'var(--color-success)' },
          { label:'Total Budget',   value: formatPrice(totalBudget), icon: DollarSign, color:'var(--color-warning)' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card" style={{ display:'flex',alignItems:'center',gap:'var(--space-4)',padding:'var(--space-5)' }}>
            <div style={{
              width:44,height:44,borderRadius:'var(--radius-md)',
              background:`${color}20`,display:'flex',alignItems:'center',justifyContent:'center',
              color, flexShrink:0,
            }}>
              <Icon size={20} />
            </div>
            <div>
              <div style={{ fontSize:'var(--fs-xl)',fontWeight:800,fontFamily:'var(--font-display)',color }}>{value}</div>
              <div style={{ fontSize:'var(--fs-xs)',color:'var(--color-text-muted)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Wishlist / Favorited Cities (if any) */}
      {favoritedCities.length > 0 && (
        <section style={{ marginBottom:'var(--space-10)' }}>
          <div className="flex-between" style={{ marginBottom:'var(--space-5)' }}>
            <div>
              <h2 style={{ fontFamily:'var(--font-display)',fontSize:'var(--fs-xl)',fontWeight:700,display:'flex',alignItems:'center',gap:8 }}>
                <Heart size={20} fill="var(--color-accent)" color="var(--color-accent)" />
                Your Wishlist ({favoritedCities.length})
              </h2>
              <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-sm)',marginTop:4 }}>
                Destinations you have bookmarked
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cities')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:'var(--space-4)' }}>
            {favoritedCities.map(city => (
              <DestinationCard key={city.id} city={city} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Trips */}
      <section style={{ marginBottom:'var(--space-10)' }}>
        <div className="flex-between" style={{ marginBottom:'var(--space-5)' }}>
          <div>
            <h2 style={{ fontFamily:'var(--font-display)',fontSize:'var(--fs-xl)',fontWeight:700 }}>Your Trips</h2>
            <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-sm)',marginTop:4 }}>
              {userTrips.length === 0 ? "No trips yet – start planning!" : `${userTrips.length} trip${userTrips.length!==1?'s':''} in database`}
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/trips')}>
            View All <ArrowRight size={14} />
          </button>
        </div>

        {recentTrips.length === 0 ? (
          <div className="card" style={{ textAlign:'center',padding:'var(--space-12)' }}>
            <div style={{ fontSize:'3rem',marginBottom:'var(--space-4)' }}>✈️</div>
            <h3 style={{ marginBottom:'var(--space-2)' }}>No trips yet</h3>
            <p style={{ color:'var(--color-text-muted)',marginBottom:'var(--space-6)' }}>
              Start planning your first journey or generate one instantly
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/trips/new')}>
                <Plus size={16} /> Plan New Trip
              </button>
              <button className="btn btn-secondary" onClick={() => setShowAiModal(true)}>
                <Wand2 size={16} /> 1-Click Generator
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'var(--space-4)' }}>
            {recentTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Destinations */}
      <section>
        <div className="flex-between" style={{ marginBottom:'var(--space-5)' }}>
          <div>
            <h2 style={{ fontFamily:'var(--font-display)',fontSize:'var(--fs-xl)',fontWeight:700 }}>Trending Destinations</h2>
            <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-sm)',marginTop:4 }}>
              Top rated cities and cultural wonders
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cities')}>
            Explore All <ArrowRight size={14} />
          </button>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'var(--space-4)' }}>
          {popularCities.map(city => (
            <DestinationCard key={city.id} city={city} />
          ))}
        </div>
      </section>

      {/* 1-Click Trip Generator Modal */}
      {showAiModal && (
        <div className="modal-overlay" onClick={() => setShowAiModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Wand2 size={22} color="var(--color-primary)" />
                  Smart Itinerary Generator
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
                  Pick a curated travel route to auto-generate day-by-day stops and activities
                </p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAiModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              {SMART_TEMPLATES.map(tpl => (
                <div
                  key={tpl.id}
                  className="card"
                  style={{ padding: 'var(--space-5)', cursor: 'pointer' }}
                  onClick={() => applyTemplate(tpl)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <span style={{ fontSize: '1.8rem' }}>{tpl.emoji}</span>
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: 'var(--fs-base)' }}>{tpl.title}</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)' }}>{tpl.description}</p>
                      </div>
                    </div>
                    <span className="badge badge-primary">{tpl.duration}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
                      Est. Budget: <strong style={{ color: 'var(--color-warning)' }}>{formatPrice(tpl.budget)}</strong> · {tpl.stops.length} Stops
                    </div>
                    <button className="btn btn-primary btn-sm">
                      Generate Trip <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowAiModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
