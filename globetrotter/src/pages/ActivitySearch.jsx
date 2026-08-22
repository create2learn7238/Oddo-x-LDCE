import { useState } from 'react'
import { activities, cities } from '../data/seed'
import { Search, Clock, DollarSign, Filter, Activity } from 'lucide-react'
import { useApp } from '../context/AppContext'

const CATEGORIES = ['All', 'Sightseeing', 'Food', 'Museum', 'Adventure', 'Cultural', 'Beach', 'Shopping', 'Entertainment', 'Nature', 'Art', 'Tour']

const categoryEmoji = {
  Sightseeing:'🏛️',Food:'🍽️',Museum:'🖼️',Adventure:'🧗',Cultural:'🎭',
  Beach:'🏖️',Shopping:'🛍️',Entertainment:'🎪',Nature:'🌿',Art:'🎨',Tour:'🚌',Other:'📌',
}

export default function ActivitySearch() {
  const { activities: dbActivities, cities: dbCities, trips, user, showToast } = useApp()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [maxCost, setMaxCost] = useState('')

  const actList = dbActivities || []
  const cityList = dbCities || []

  const filtered = actList.filter(a => {
    const city = cityList.find(c => c.id === a.cityId)
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(search.toLowerCase())) ||
      (city && city.name.toLowerCase().includes(search.toLowerCase())) ||
      (city && city.state && city.state.toLowerCase().includes(search.toLowerCase()))
    const matchCat = category === 'All' || a.category === category
    const matchCost = !maxCost || a.cost <= Number(maxCost)
    return matchSearch && matchCat && matchCost
  })

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">Activities 🎯</h1>
        <p className="page-subtitle">Browse {activities.length} experiences across the world</p>
      </div>

      {/* Filters */}
      <div style={{ display:'flex',gap:'var(--space-3)',marginBottom:'var(--space-4)',flexWrap:'wrap' }}>
        <div style={{ position:'relative',flex:1,minWidth:200 }}>
          <Search size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft:38 }}
            placeholder="Search activities or cities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="activity-search-input"
          />
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:'var(--space-2)' }}>
          <DollarSign size={14} color="var(--color-text-muted)" />
          <input
            type="number"
            className="form-input"
            style={{ width:100 }}
            placeholder="Max $"
            value={maxCost}
            onChange={e => setMaxCost(e.target.value)}
            min={0}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display:'flex',gap:'var(--space-2)',marginBottom:'var(--space-6)',flexWrap:'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`chip ${category===cat?'active':''}`} style={{ cursor:'pointer' }} onClick={() => setCategory(cat)}>
            {categoryEmoji[cat]||''} {cat}
          </button>
        ))}
      </div>

      <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-sm)',marginBottom:'var(--space-4)' }}>
        {filtered.length} activit{filtered.length!==1?'ies':'y'} found
      </p>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon"><Activity size={28} /></div>
          <h3>No activities found</h3>
          <p style={{ color:'var(--color-text-muted)' }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'var(--space-4)' }}>
          {filtered.map(act => {
            const city = cities.find(c => c.id === act.cityId)
            return (
              <div key={act.id} className="card" style={{ padding:'var(--space-5)' }}>
                <div style={{ display:'flex',alignItems:'flex-start',gap:'var(--space-3)',marginBottom:'var(--space-3)' }}>
                  <div style={{
                    width:44,height:44,borderRadius:'var(--radius-md)',
                    background:'var(--color-surface2)',display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:'1.5rem',flexShrink:0,
                  }}>
                    {act.emoji}
                  </div>
                  <div style={{ flex:1 }}>
                    <h3 style={{ fontWeight:600,fontSize:'var(--fs-base)',marginBottom:2 }}>{act.name}</h3>
                    <div style={{ display:'flex',alignItems:'center',gap:'var(--space-2)',flexWrap:'wrap' }}>
                      <span className="badge badge-primary" style={{ fontSize:10 }}>{act.category}</span>
                      {city && (
                        <span style={{ fontSize:'var(--fs-xs)',color:'var(--color-text-muted)' }}>
                          {city.emoji} {city.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {act.description && (
                  <p style={{
                    color:'var(--color-text-muted)',fontSize:'var(--fs-xs)',
                    lineHeight:'var(--lh-relaxed)',marginBottom:'var(--space-3)',
                    display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',
                  }}>
                    {act.description}
                  </p>
                )}

                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'auto' }}>
                  <div style={{ display:'flex',gap:'var(--space-3)' }}>
                    <span style={{ display:'flex',alignItems:'center',gap:4,fontSize:'var(--fs-xs)',color:'var(--color-warning)',fontWeight:600 }}>
                      <DollarSign size={12}/>${act.cost}
                    </span>
                    {act.duration && (
                      <span style={{ display:'flex',alignItems:'center',gap:4,fontSize:'var(--fs-xs)',color:'var(--color-text-muted)' }}>
                        <Clock size={12}/>{act.duration}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ fontSize:'11px',padding:'4px 10px' }}
                    onClick={() => showToast(`Add "${act.name}" via the Itinerary Builder`, 'info')}
                  >
                    Add to Trip
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
