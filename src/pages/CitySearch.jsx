import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, DollarSign, Globe, Filter, Plus, MapPin, Sparkles } from 'lucide-react'
import DestinationCard from '../components/DestinationCard'
import InteractiveMap from '../components/InteractiveMap'
import { useApp } from '../context/AppContext'

const REGIONS = ['All', 'India', 'Europe', 'Asia', 'Americas', 'Middle East']
const COSTS   = ['All', 'Low', 'Medium', 'High']

export default function CitySearch() {
  const { cities, trips, user } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')
  const [cost, setCost] = useState('All')
  const [gujaratOnly, setGujaratOnly] = useState(false)

  const cityList = cities || []

  const filtered = cityList.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.state && c.state.toLowerCase().includes(search.toLowerCase())) ||
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))

    const matchRegion = region === 'All' || c.region === region
    const matchCost = cost === 'All' || c.costIndex === cost
    const matchGujarat = !gujaratOnly || c.state === 'Gujarat'

    return matchSearch && matchRegion && matchCost && matchGujarat
  }).sort((a,b) => b.popularity - a.popularity)

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">Explore Cities 🌏</h1>
        <p className="page-subtitle">Discover {cityList.length} destinations with rich heritage across Gujarat, India & the World</p>
      </div>

      {/* Interactive Pinpoint Map */}
      <InteractiveMap onSelectCity={c => setSearch(c)} selectedCity={search} />

      {/* Gujarat Spotlight Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(247,151,30,0.15) 0%, rgba(255,101,132,0.1) 100%)',
        border: '1px solid rgba(247,151,30,0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4) var(--space-6)',
        marginBottom: 'var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: '1.8rem' }}>🦁</span>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-warning)' }}>
              Vibrant Gujarat Special Destinations
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
              Explore UNESCO Ahmedabad, Great Rann of Kutch, Statue of Unity, Asiatic Lions in Gir & more!
            </div>
          </div>
        </div>
        <button
          className={`btn btn-sm ${gujaratOnly ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setGujaratOnly(!gujaratOnly)
            if (!gujaratOnly) setRegion('All')
          }}
        >
          <Sparkles size={13} /> {gujaratOnly ? 'Showing All Places' : 'Show Gujarat Only 🦁'}
        </button>
      </div>

      {/* Search & Filters */}
      <div style={{ display:'flex',gap:'var(--space-3)',marginBottom:'var(--space-6)',flexWrap:'wrap' }}>
        <div style={{ position:'relative',flex:1,minWidth:220 }}>
          <Search size={16} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft:38 }}
            placeholder="Search Ahmedabad, Kutch, Paris, Heritage, Beach..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="city-search-input"
          />
        </div>
      </div>

      {/* Region Filter */}
      <div style={{ display:'flex',gap:'var(--space-2)',marginBottom:'var(--space-4)',flexWrap:'wrap',alignItems:'center' }}>
        <span style={{ display:'flex',alignItems:'center',gap:'var(--space-2)',color:'var(--color-text-muted)',fontSize:'var(--fs-sm)',fontWeight:500 }}>
          <Globe size={14}/> Region:
        </span>
        {REGIONS.map(r => (
          <button
            key={r}
            className={`chip ${region===r && !gujaratOnly ?'active':''}`}
            style={{ cursor:'pointer' }}
            onClick={() => {
              setRegion(r)
              setGujaratOnly(false)
            }}
          >
            {r === 'India' ? '🇮🇳 India' : r}
          </button>
        ))}
      </div>

      {/* Cost Filter */}
      <div style={{ display:'flex',gap:'var(--space-2)',marginBottom:'var(--space-8)',flexWrap:'wrap',alignItems:'center' }}>
        <span style={{ display:'flex',alignItems:'center',gap:'var(--space-2)',color:'var(--color-text-muted)',fontSize:'var(--fs-sm)',fontWeight:500 }}>
          <DollarSign size={14}/> Cost:
        </span>
        {COSTS.map(c => (
          <button key={c} className={`chip ${cost===c?'active':''}`} style={{ cursor:'pointer' }} onClick={() => setCost(c)}>{c}</button>
        ))}
      </div>

      <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-sm)',marginBottom:'var(--space-4)' }}>
        {filtered.length} destination{filtered.length!==1?'s':''} found
      </p>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon"><MapPin size={28} /></div>
          <h3>No cities found</h3>
          <p style={{ color:'var(--color-text-muted)' }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'var(--space-5)' }}>
          {filtered.map(city => <DestinationCard key={city.id} city={city} />)}
        </div>
      )}
    </div>
  )
}
