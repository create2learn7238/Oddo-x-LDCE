import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import TripCard from '../components/TripCard'
import { Plus, Search, Filter, Map } from 'lucide-react'

export default function MyTrips() {
  const { user, trips } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all, upcoming, past

  const userTrips = trips.filter(t => t.userId === user?.id)

  const filtered = userTrips.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.stops?.some(s => s.cityName.toLowerCase().includes(search.toLowerCase()))
    if (!matchSearch) return false
    if (filter === 'upcoming') return new Date(t.startDate) >= new Date()
    if (filter === 'past') return new Date(t.endDate) < new Date()
    return true
  })

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1 className="page-title">My Trips</h1>
            <p className="page-subtitle">{userTrips.length} trip{userTrips.length !== 1 ? 's' : ''} planned</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/trips/new')} id="mytrips-new">
            <Plus size={16} /> Plan New Trip
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div style={{ display:'flex',gap:'var(--space-3)',marginBottom:'var(--space-6)',flexWrap:'wrap' }}>
        <div style={{ position:'relative',flex:1,minWidth:200 }}>
          <Search size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft:38 }}
            placeholder="Search trips or cities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="mytrips-search"
          />
        </div>
        <div style={{ display:'flex',gap:'var(--space-2)' }}>
          {['all','upcoming','past'].map(f => (
            <button
              key={f}
              className={`chip ${filter === f ? 'active' : ''}`}
              style={{ cursor:'pointer' }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon"><Map size={28} /></div>
          <h3>{search ? 'No trips match your search' : 'No trips yet'}</h3>
          <p style={{ color:'var(--color-text-muted)',maxWidth:300 }}>
            {search ? 'Try a different search term.' : 'Start by planning your first trip!'}
          </p>
          {!search && (
            <button className="btn btn-primary" onClick={() => navigate('/trips/new')}>
              <Plus size={16} /> Plan New Trip
            </button>
          )}
        </div>
      ) : (
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'var(--space-5)' }}>
          {filtered.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}
