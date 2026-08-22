import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Trash2, Edit3, Eye, Share2, DollarSign, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

const COVER_COLORS = ['#6C63FF','#FF6584','#43E97B','#F7971E','#38BDF8','#a855f7','#f43f5e','#10b981']

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
}
function daysBetween(a, b) {
  return Math.max(0, Math.ceil((new Date(b) - new Date(a)) / (1000*60*60*24)))
}

export default function TripCard({ trip, onDelete }) {
  const navigate = useNavigate()
  const { dispatch, showToast, formatPrice } = useApp()
  const days = daysBetween(trip.startDate, trip.endDate)
  const isPast = new Date(trip.endDate) < new Date()
  const isUpcoming = new Date(trip.startDate) >= new Date()

  const handleDelete = (e) => {
    e.stopPropagation()
    if (confirm(`Delete "${trip.name}"? This cannot be undone.`)) {
      dispatch({ type: 'DELETE_TRIP', payload: trip.id })
      showToast(`"${trip.name}" deleted.`, 'error')
    }
  }

  const statusBadge = isPast ? 'Completed' : isUpcoming ? 'Upcoming' : 'In Progress'
  const statusClass = isPast ? 'badge-success' : isUpcoming ? 'badge-primary' : 'badge-warning'

  return (
    <div
      className="card"
      style={{ cursor:'pointer', overflow:'hidden', padding:0 }}
      onClick={() => navigate(`/trips/${trip.id}/view`)}
      role="article"
      aria-label={`Trip: ${trip.name}`}
    >
      {/* Cover Banner */}
      <div style={{
        height: 8,
        background: `linear-gradient(90deg, ${trip.coverColor || '#6C63FF'}, ${trip.coverColor ? trip.coverColor + '99' : '#FF6584'})`,
      }} />

      <div style={{ padding:'var(--space-5)' }}>
        {/* Header */}
        <div className="flex-between" style={{ marginBottom:'var(--space-3)' }}>
          <span className={`badge ${statusClass}`}>{statusBadge}</span>
          {trip.isPublic && (
            <span className="badge badge-info"><Share2 size={10} /> Public</span>
          )}
        </div>

        <h3 style={{
          fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--fs-lg)',
          marginBottom:'var(--space-2)',
          whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
        }}>
          {trip.name}
        </h3>

        {trip.description && (
          <p style={{
            color:'var(--color-text-muted)',fontSize:'var(--fs-sm)',
            marginBottom:'var(--space-4)',lineHeight:'var(--lh-relaxed)',
            display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',
          }}>
            {trip.description}
          </p>
        )}

        {/* Meta */}
        <div style={{ display:'flex',flexDirection:'column',gap:'var(--space-2)',marginBottom:'var(--space-4)' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'var(--space-2)',color:'var(--color-text-muted)',fontSize:'var(--fs-xs)' }}>
            <Calendar size={13} />
            {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
            <span style={{ marginLeft:'auto',color:'var(--color-primary-light)',fontWeight:600 }}>{days}d</span>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:'var(--space-2)',color:'var(--color-text-muted)',fontSize:'var(--fs-xs)' }}>
            <MapPin size={13} />
            {trip.stops?.length || 0} {trip.stops?.length === 1 ? 'city' : 'cities'}:
            {' '}{trip.stops?.slice(0,3).map(s=>s.emoji+s.cityName).join(', ')}
            {trip.stops?.length > 3 && `...`}
          </div>
          {trip.totalBudget > 0 && (
            <div style={{ display:'flex',alignItems:'center',gap:'var(--space-2)',color:'var(--color-text-muted)',fontSize:'var(--fs-xs)' }}>
              <DollarSign size={13} />
              Budget: <strong style={{ color:'var(--color-warning)' }}>{formatPrice(trip.totalBudget)}</strong>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display:'flex',gap:'var(--space-2)',borderTop:'1px solid var(--color-border)',paddingTop:'var(--space-4)' }}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ flex:1 }}
            onClick={e => { e.stopPropagation(); navigate(`/trips/${trip.id}/build`) }}
            id={`trip-edit-${trip.id}`}
          >
            <Edit3 size={13} /> Build
          </button>
          <button
            className="btn btn-secondary btn-sm"
            style={{ flex:1 }}
            onClick={e => { e.stopPropagation(); navigate(`/trips/${trip.id}/budget`) }}
          >
            <DollarSign size={13} /> Budget
          </button>
          <button
            className="btn btn-danger btn-sm btn-icon"
            onClick={handleDelete}
            title="Delete trip"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
