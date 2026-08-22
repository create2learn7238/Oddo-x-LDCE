import { useNavigate } from 'react-router-dom'
import { Star, DollarSign, Plus, Heart, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'

const costColor = { Low: 'var(--color-success)', Medium: 'var(--color-warning)', High: 'var(--color-danger)' }

export default function DestinationCard({ city }) {
  const navigate = useNavigate()
  const { favorites, toggleFavorite, formatPrice } = useApp()
  const isFav = favorites.includes(city.id)

  return (
    <div
      className="card"
      style={{ cursor:'pointer',overflow:'hidden',padding:0,position:'relative' }}
      onClick={() => navigate(`/cities?highlight=${city.id}`)}
      role="article"
      aria-label={`Destination: ${city.name}, ${city.country}`}
    >
      {/* Image */}
      <div style={{ position:'relative',height:170,overflow:'hidden' }}>
        <img
          src={city.image}
          alt={city.name}
          style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.4s ease' }}
          onMouseOver={e => e.currentTarget.style.transform='scale(1.06)'}
          onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
          loading="lazy"
        />
        <div style={{
          position:'absolute',inset:0,
          background:'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
        }} />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(city.id);
          }}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: isFav ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            color: '#fff'
          }}
          title={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isFav ? '#fff' : 'none'} color="#fff" />
        </button>

        {/* Best Season Badge if available */}
        {city.bestSeason && (
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-full)',
            padding: '3px 8px',
            fontSize: '10px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <Calendar size={10} color="var(--color-primary-light)" />
            {city.bestSeason}
          </div>
        )}

        {/* Overlay info */}
        <div style={{ position:'absolute',bottom:12,left:12,right:12 }}>
          <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between' }}>
            <div>
              <span style={{ fontSize:'1.4rem' }}>{city.emoji}</span>
              <h3 style={{ fontFamily:'var(--font-display)',fontSize:'var(--fs-lg)',fontWeight:700,color:'#fff',lineHeight:1.2 }}>
                {city.name}
              </h3>
              <p style={{ fontSize:'var(--fs-xs)',color:'rgba(255,255,255,0.75)' }}>
                {city.state ? `${city.state}, ` : ''}{city.country}
              </p>
            </div>
            <div style={{
              background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)',
              borderRadius:'var(--radius-md)',padding:'4px 8px',
              display:'flex',alignItems:'center',gap:4,
              color:'var(--color-warning)',fontSize:'var(--fs-xs)',fontWeight:600,
            }}>
              <Star size={11} fill="currentColor" />
              {city.popularity}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:'var(--space-4)' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--space-3)' }}>
          <div style={{ display:'flex',gap:'var(--space-2)',flexWrap:'wrap' }}>
            {city.tags?.slice(0,3).map(tag => (
              <span key={tag} className="chip" style={{ fontSize:'10px', padding: '2px 8px' }}>{tag}</span>
            ))}
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:2,fontSize:'var(--fs-xs)',color:costColor[city.costIndex] || 'var(--color-warning)' }}>
            <span style={{ fontWeight:700 }}>{city.costIndex}</span>
          </div>
        </div>

        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <span style={{ fontSize:'var(--fs-xs)',color:'var(--color-text-muted)' }}>
            ~{formatPrice(city.avgDailyCost)}/day
          </span>
          <button
            className="btn btn-primary btn-sm"
            onClick={e => { e.stopPropagation(); navigate('/trips/new') }}
            style={{ padding:'4px 12px',fontSize:'11px' }}
          >
            <Plus size={11} /> Plan Trip
          </button>
        </div>
      </div>
    </div>
  )
}
