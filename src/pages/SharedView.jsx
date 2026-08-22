import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Share2, Copy, Calendar, MapPin, DollarSign, ArrowLeft, Check, ExternalLink } from 'lucide-react'
import QRCodeShare from '../components/QRCodeShare'
import { useState } from 'react'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })
}

export default function SharedView() {
  const { tripId } = useParams()
  const { trips, dispatch, user, showToast } = useApp()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const trip = trips.find(t => t.id === tripId)

  if (!trip) return (
    <div style={{ minHeight:'100vh',background:'var(--color-bg)',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div className="card empty-state">
        <p>Trip not found or not public.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    </div>
  )

  const shareUrl = window.location.href
  const copyUrl = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    showToast('Link copied!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const copyTrip = () => {
    if (!user) { navigate('/login'); return }
    const clone = {
      ...trip,
      id: `trip_${Date.now()}`,
      userId: user.id,
      name: `${trip.name} (Copy)`,
      isPublic: false,
      createdAt: new Date().toISOString(),
    }
    dispatch({ type:'ADD_TRIP', payload: clone })
    showToast('Trip copied to your account!', 'success')
    navigate(`/trips/${clone.id}/view`)
  }

  const totalCost = trip.stops?.reduce((total, s) => {
    const nights = Math.max(0, Math.ceil((new Date(s.endDate)-new Date(s.startDate))/(1000*60*60*24)))
    return total + (s.accommodationCost*nights) + (s.transportCost||0) + (s.activities?.reduce((a,act)=>a+(act.cost||0),0)||0)
  }, 0) || 0

  return (
    <div style={{ minHeight:'100vh',background:'var(--color-bg)',padding:'var(--space-6)' }}>
      <div style={{ maxWidth:780,margin:'0 auto' }}>
        {/* Back button */}
        {user && (
          <button className="btn btn-ghost btn-sm" style={{ marginBottom:'var(--space-6)' }} onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={14} /> Dashboard
          </button>
        )}

        {/* Hero */}
        <div style={{
          background: `linear-gradient(135deg, ${trip.coverColor||'#6C63FF'}33, rgba(255,101,132,0.15))`,
          border:`1px solid ${trip.coverColor||'#6C63FF'}44`,
          borderRadius:'var(--radius-xl)',padding:'var(--space-10) var(--space-8)',
          marginBottom:'var(--space-6)',textAlign:'center',position:'relative',overflow:'hidden',
        }}>
          <div style={{
            position:'absolute',inset:0,
            background:`radial-gradient(circle at 30% 50%, ${trip.coverColor||'#6C63FF'}22 0%, transparent 60%)`,
            pointerEvents:'none',
          }} />
          <div style={{ position:'relative',zIndex:1 }}>
            <div style={{ fontSize:'3rem',marginBottom:'var(--space-3)' }}>✈️</div>
            <h1 style={{ fontFamily:'var(--font-display)',fontSize:'var(--fs-3xl)',fontWeight:800,marginBottom:'var(--space-2)' }}>
              {trip.name}
            </h1>
            {trip.description && (
              <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-md)',maxWidth:500,margin:'0 auto var(--space-4)' }}>
                {trip.description}
              </p>
            )}
            <div style={{ display:'flex',gap:'var(--space-4)',justifyContent:'center',flexWrap:'wrap',marginBottom:'var(--space-6)' }}>
              <span style={{ display:'flex',alignItems:'center',gap:6,color:'var(--color-text-muted)',fontSize:'var(--fs-sm)' }}>
                <Calendar size={14}/> {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
              </span>
              <span style={{ display:'flex',alignItems:'center',gap:6,color:'var(--color-text-muted)',fontSize:'var(--fs-sm)' }}>
                <MapPin size={14}/> {trip.stops?.length||0} cities
              </span>
              <span style={{ display:'flex',alignItems:'center',gap:6,color:'var(--color-warning)',fontSize:'var(--fs-sm)',fontWeight:600 }}>
                <DollarSign size={14}/> Est. ${totalCost.toLocaleString()}
              </span>
            </div>
            <div style={{ display:'flex',gap:'var(--space-3)',justifyContent:'center',flexWrap:'wrap' }}>
              <button className="btn btn-primary" onClick={copyTrip}>
                <Copy size={15}/> Copy This Trip
              </button>
              <button className="btn btn-secondary" onClick={copyUrl}>
                {copied ? <><Check size={15}/> Copied!</> : <><Share2 size={15}/> Copy Link</>}
              </button>
            </div>
          </div>
        </div>

        {/* Share Panel */}
        <div className="card" style={{ marginBottom:'var(--space-6)',padding:'var(--space-5)',display:'flex',alignItems:'center',gap:'var(--space-4)',flexWrap:'wrap' }}>
          <span style={{ fontWeight:600,fontSize:'var(--fs-sm)' }}>Share:</span>
          <a
            href={`https://twitter.com/intent/tweet?text=Check out my trip: ${trip.name}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={14}/> Twitter / X
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={14}/> Facebook
          </a>
          <div style={{ marginLeft:'auto',display:'flex',alignItems:'center',gap:'var(--space-2)',background:'var(--color-surface2)',borderRadius:'var(--radius-md)',padding:'var(--space-2) var(--space-3)',flex:1,minWidth:0 }}>
            <span style={{ fontSize:'var(--fs-xs)',color:'var(--color-text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1 }}>
              {shareUrl}
            </span>
            <button className="btn btn-primary btn-sm" style={{ flexShrink:0 }} onClick={copyUrl}>
              {copied ? <Check size={13}/> : <Copy size={13}/>}
            </button>
          </div>
        </div>

        {/* Itinerary Read-only */}
        <h2 style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--fs-xl)',marginBottom:'var(--space-5)' }}>
          Full Itinerary
        </h2>
        <div style={{ display:'flex',flexDirection:'column',gap:'var(--space-5)' }}>
          {trip.stops?.map(stop => {
            const nights = Math.max(0, Math.ceil((new Date(stop.endDate)-new Date(stop.startDate))/(1000*60*60*24)))
            return (
              <div key={stop.id} className="card">
                <div style={{ display:'flex',alignItems:'center',gap:'var(--space-3)',marginBottom:'var(--space-4)' }}>
                  <span style={{ fontSize:'1.8rem' }}>{stop.emoji}</span>
                  <div>
                    <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--fs-lg)' }}>{stop.cityName}</h3>
                    <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)' }}>
                      {formatDate(stop.startDate)} · {nights} night{nights!==1?'s':''}
                      {stop.accommodation && ` · 🏨 ${stop.accommodation}`}
                    </div>
                  </div>
                </div>
                {stop.activities?.length > 0 && (
                  <div style={{ display:'flex',flexDirection:'column',gap:'var(--space-2)' }}>
                    {stop.activities.map(act => (
                      <div key={act.id} style={{
                        display:'flex',alignItems:'center',gap:'var(--space-3)',
                        padding:'var(--space-3)',background:'var(--color-surface2)',borderRadius:'var(--radius-md)',
                      }}>
                        <span>{act.emoji||'📌'}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:500,fontSize:'var(--fs-sm)' }}>{act.name}</div>
                          <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)' }}>
                            {act.scheduledDate} · {act.time} · {act.category}
                          </div>
                        </div>
                        <span style={{ fontWeight:600,color:'var(--color-warning)',fontSize:'var(--fs-sm)' }}>${act.cost||0}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        {/* Shareable QR Code */}
        <QRCodeShare tripId={trip.id} tripName={trip.name} />

        <div style={{ textAlign:'center',marginTop:'var(--space-10)',color:'var(--color-text-faint)',fontSize:'var(--fs-sm)' }}>
          Made with ✈️ <strong style={{ color:'var(--color-primary-light)' }}>GlobeTrotter</strong>
        </div>
      </div>
    </div>
  )
}
