import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  Plus, Trash2, ChevronUp, ChevronDown, MapPin,
  Calendar, Clock, DollarSign, X, Check, Search, ArrowRight
} from 'lucide-react'

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday:'short',month:'short',day:'numeric' })
}

// ── Add Stop Modal ────────────────────────────────────────────
function AddStopModal({ trip, onAdd, onClose }) {
  const { cities: dbCities } = useApp()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [dates, setDates] = useState({ start: trip.startDate, end: trip.endDate })
  const [accommodation, setAccommodation] = useState({ name: '', cost: '' })
  const [transportCost, setTransportCost] = useState('')

  const cityList = dbCities || []
  const filtered = cityList.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.state && c.state.toLowerCase().includes(search.toLowerCase())) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    if (!selected || !dates.start || !dates.end) return
    onAdd({
      id: `stop_${Date.now()}`,
      cityId: selected.id,
      cityName: selected.name,
      emoji: selected.emoji,
      startDate: dates.start,
      endDate: dates.end,
      accommodation: accommodation.name,
      accommodationCost: Number(accommodation.cost) || 0,
      transportCost: Number(transportCost) || 0,
      activities: [],
    })
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Add Stop">
      <div className="modal" style={{ maxWidth:560 }}>
        <div className="modal-header">
          <h2 className="modal-title">Add a Stop</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* City Search */}
        <div className="form-group" style={{ marginBottom:'var(--space-4)' }}>
          <label className="form-label">Search City</label>
          <div style={{ position:'relative' }}>
            <Search size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
            <input className="form-input" style={{ paddingLeft:36 }} placeholder="Paris, Tokyo..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
          </div>
        </div>

        <div style={{ maxHeight:200,overflowY:'auto',marginBottom:'var(--space-4)',display:'flex',flexDirection:'column',gap:'var(--space-2)' }}>
          {filtered.map(city => (
            <div
              key={city.id}
              onClick={() => setSelected(city)}
              style={{
                display:'flex',alignItems:'center',gap:'var(--space-3)',padding:'var(--space-3)',
                borderRadius:'var(--radius-md)',cursor:'pointer',
                background: selected?.id===city.id ? 'var(--color-primary-glow)' : 'var(--color-surface2)',
                border:`1px solid ${selected?.id===city.id ? 'var(--color-primary)' : 'transparent'}`,
                transition:'all var(--transition-fast)',
              }}
            >
              <span style={{ fontSize:'1.4rem' }}>{city.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600,fontSize:'var(--fs-sm)' }}>{city.name}</div>
                <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)' }}>{city.country} · ${city.avgDailyCost}/day</div>
              </div>
              {selected?.id===city.id && <Check size={16} color="var(--color-primary)" />}
            </div>
          ))}
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-3)',marginBottom:'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Arrival Date</label>
            <input type="date" className="form-input" style={{ colorScheme:'dark' }} value={dates.start} onChange={e => setDates(d=>({...d,start:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Departure Date</label>
            <input type="date" className="form-input" style={{ colorScheme:'dark' }} value={dates.end} onChange={e => setDates(d=>({...d,end:e.target.value}))} />
          </div>
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'var(--space-3)',marginBottom:'var(--space-6)' }}>
          <div className="form-group" style={{ gridColumn:'span 2' }}>
            <label className="form-label">Accommodation Name</label>
            <input className="form-input" placeholder="Hotel / Airbnb" value={accommodation.name} onChange={e => setAccommodation(a=>({...a,name:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Cost/night ($)</label>
            <input type="number" className="form-input" placeholder="0" value={accommodation.cost} onChange={e => setAccommodation(a=>({...a,cost:e.target.value}))} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Transport Cost ($)</label>
            <input type="number" className="form-input" placeholder="0" value={transportCost} onChange={e => setTransportCost(e.target.value)} min={0} />
          </div>
        </div>

        <div style={{ display:'flex',gap:'var(--space-3)',justifyContent:'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd} disabled={!selected}>
            <Plus size={15} /> Add Stop
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Add Activity Modal ────────────────────────────────────────
function AddActivityModal({ stop, trip, onAdd, onClose }) {
  const { activities: dbActivities } = useApp()
  const [tab, setTab] = useState('browse') // browse | custom
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [date, setDate] = useState(stop.startDate)
  const [time, setTime] = useState('10:00')
  const [notes, setNotes] = useState('')
  const [custom, setCustom] = useState({ name:'',category:'Sightseeing',cost:'',duration:'',description:'' })

  const actList = dbActivities || []
  const cityActivities = actList.filter(a =>
    a.cityId === stop.cityId &&
    (a.name.toLowerCase().includes(search.toLowerCase()) ||
     (a.category && a.category.toLowerCase().includes(search.toLowerCase())))
  )

  const handleAdd = () => {
    const base = tab === 'browse' && selected
      ? { ...selected }
      : { id:`act_${Date.now()}`,name:custom.name,category:custom.category,cost:Number(custom.cost)||0,duration:custom.duration,description:custom.description,emoji:'📌' }
    onAdd({ ...base, scheduledDate:date, time, notes, id:`act_${Date.now()}` })
    onClose()
  }

  const canAdd = tab==='browse' ? !!selected : !!custom.name

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Add Activity">
      <div className="modal" style={{ maxWidth:560 }}>
        <div className="modal-header">
          <h2 className="modal-title">Add Activity to {stop.emoji}{stop.cityName}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex',gap:'var(--space-2)',marginBottom:'var(--space-4)',background:'var(--color-surface2)',borderRadius:'var(--radius-md)',padding:4 }}>
          {['browse','custom'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1,padding:'var(--space-2)',borderRadius:'var(--radius-sm)',
              background: tab===t ? 'var(--color-surface3)':'transparent',
              color: tab===t ? 'var(--color-text)' : 'var(--color-text-muted)',
              fontWeight: tab===t ? 600 : 400,fontSize:'var(--fs-sm)',cursor:'pointer',border:'none',transition:'all var(--transition-fast)',
            }}>
              {t==='browse' ? 'Browse Activities' : '+ Custom Activity'}
            </button>
          ))}
        </div>

        {tab === 'browse' ? (
          <>
            <div style={{ position:'relative',marginBottom:'var(--space-3)' }}>
              <Search size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-faint)',pointerEvents:'none' }} />
              <input className="form-input" style={{ paddingLeft:36 }} placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ maxHeight:220,overflowY:'auto',marginBottom:'var(--space-4)',display:'flex',flexDirection:'column',gap:'var(--space-2)' }}>
              {cityActivities.length === 0 && (
                <div style={{ color:'var(--color-text-muted)',textAlign:'center',padding:'var(--space-8)',fontSize:'var(--fs-sm)' }}>
                  No activities found. Try custom.
                </div>
              )}
              {cityActivities.map(act => (
                <div key={act.id} onClick={() => setSelected(act)} style={{
                  display:'flex',alignItems:'center',gap:'var(--space-3)',padding:'var(--space-3)',
                  borderRadius:'var(--radius-md)',cursor:'pointer',
                  background: selected?.id===act.id ? 'var(--color-primary-glow)' : 'var(--color-surface2)',
                  border:`1px solid ${selected?.id===act.id ? 'var(--color-primary)':'transparent'}`,
                  transition:'all var(--transition-fast)',
                }}>
                  <span style={{ fontSize:'1.3rem' }}>{act.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600,fontSize:'var(--fs-sm)' }}>{act.name}</div>
                    <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)' }}>
                      {act.category} · ${act.cost} · {act.duration}
                    </div>
                  </div>
                  {selected?.id===act.id && <Check size={16} color="var(--color-primary)" />}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:'var(--space-3)',marginBottom:'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Activity Name *</label>
              <input className="form-input" placeholder="Visit the local market" value={custom.name} onChange={e => setCustom(c=>({...c,name:e.target.value}))} />
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={custom.category} onChange={e => setCustom(c=>({...c,category:e.target.value}))}>
                  {['Sightseeing','Food','Museum','Adventure','Cultural','Beach','Shopping','Entertainment','Nature','Other'].map(cat => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Cost ($)</label>
                <input type="number" className="form-input" placeholder="0" value={custom.cost} onChange={e => setCustom(c=>({...c,cost:e.target.value}))} min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input className="form-input" placeholder="2h" value={custom.duration} onChange={e => setCustom(c=>({...c,duration:e.target.value}))} />
              </div>
            </div>
          </div>
        )}

        {/* Date & Time */}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-3)',marginBottom:'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" style={{ colorScheme:'dark' }} value={date}
              min={stop.startDate} max={stop.endDate}
              onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input type="time" className="form-input" style={{ colorScheme:'dark' }} value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom:'var(--space-6)' }}>
          <label className="form-label">Notes (optional)</label>
          <input className="form-input" placeholder="Book in advance, bring sunscreen..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <div style={{ display:'flex',gap:'var(--space-3)',justifyContent:'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd} disabled={!canAdd}>
            <Plus size={15} /> Add Activity
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Stop Card ─────────────────────────────────────────────────
function StopCard({ stop, index, total, onMoveUp, onMoveDown, onDelete, onAddActivity, onDeleteActivity, trip }) {
  const nights = Math.max(0, Math.ceil((new Date(stop.endDate)-new Date(stop.startDate))/(1000*60*60*24)))
  const actCost = stop.activities?.reduce((s,a) => s+(a.cost||0), 0) || 0
  const accomCost = stop.accommodationCost * nights
  const totalCost = actCost + accomCost + (stop.transportCost || 0)

  return (
    <div className="card" style={{ position:'relative' }}>
      {/* Header */}
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'var(--space-4)' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'var(--space-3)' }}>
          <div style={{
            width:40,height:40,borderRadius:'var(--radius-md)',
            background:'var(--grad-primary)',display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'1.3rem',flexShrink:0,
          }}>
            {stop.emoji}
          </div>
          <div>
            <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--fs-lg)' }}>
              {stop.cityName}
            </h3>
            <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)',display:'flex',gap:'var(--space-3)' }}>
              <span><Calendar size={11} style={{ display:'inline',marginRight:4 }} />{formatDate(stop.startDate)} → {formatDate(stop.endDate)}</span>
              <span>·</span>
              <span>{nights} night{nights!==1?'s':''}</span>
            </div>
          </div>
        </div>
        <div style={{ display:'flex',gap:'var(--space-1)' }}>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onMoveUp} disabled={index===0} title="Move up"><ChevronUp size={15} /></button>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onMoveDown} disabled={index===total-1} title="Move down"><ChevronDown size={15} /></button>
          <button className="btn btn-danger btn-icon btn-sm" onClick={onDelete} title="Delete stop"><Trash2 size={15} /></button>
        </div>
      </div>

      {/* Stop meta */}
      <div style={{ display:'flex',gap:'var(--space-4)',marginBottom:'var(--space-4)',flexWrap:'wrap' }}>
        {stop.accommodation && (
          <div style={{ display:'flex',alignItems:'center',gap:6,fontSize:'var(--fs-xs)',color:'var(--color-text-muted)' }}>
            🏨 {stop.accommodation}
          </div>
        )}
        <div style={{ display:'flex',alignItems:'center',gap:6,fontSize:'var(--fs-xs)',color:'var(--color-warning)' }}>
          <DollarSign size={11} /> Est. ${totalCost}
        </div>
      </div>

      {/* Activities */}
      <div style={{ borderTop:'1px solid var(--color-border)',paddingTop:'var(--space-4)' }}>
        <div className="flex-between" style={{ marginBottom:'var(--space-3)' }}>
          <span style={{ fontSize:'var(--fs-sm)',fontWeight:600,color:'var(--color-text-muted)' }}>
            Activities ({stop.activities?.length||0})
          </span>
          <button className="btn btn-secondary btn-sm" onClick={onAddActivity}>
            <Plus size={13} /> Add Activity
          </button>
        </div>

        {stop.activities?.length === 0 && (
          <p style={{ color:'var(--color-text-faint)',fontSize:'var(--fs-xs)',textAlign:'center',padding:'var(--space-4)' }}>
            No activities yet – add some!
          </p>
        )}

        <div style={{ display:'flex',flexDirection:'column',gap:'var(--space-2)' }}>
          {stop.activities?.map(act => (
            <div key={act.id} style={{
              display:'flex',alignItems:'center',gap:'var(--space-3)',
              padding:'var(--space-3)',background:'var(--color-surface2)',
              borderRadius:'var(--radius-md)',
            }}>
              <span style={{ fontSize:'1.1rem',flexShrink:0 }}>{act.emoji||'📌'}</span>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontWeight:500,fontSize:'var(--fs-sm)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{act.name}</div>
                <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)',display:'flex',gap:'var(--space-3)' }}>
                  <span><Clock size={10} style={{ display:'inline',marginRight:3 }} />{act.time||'--'}</span>
                  <span>${act.cost||0}</span>
                  <span style={{ color:'var(--color-text-faint)' }}>{act.category}</span>
                </div>
              </div>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onDeleteActivity(act.id)} style={{ color:'var(--color-danger)',opacity:0.7 }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Builder ──────────────────────────────────────────────
export default function ItineraryBuilder() {
  const { tripId } = useParams()
  const { trips, dispatch, showToast } = useApp()
  const navigate = useNavigate()
  const [showAddStop, setShowAddStop] = useState(false)
  const [addActivityForStop, setAddActivityForStop] = useState(null) // stop object

  const trip = trips.find(t => t.id === tripId)

  if (!trip) return (
    <div className="page-container">
      <div className="card empty-state">
        <p>Trip not found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/trips')}>Back to Trips</button>
      </div>
    </div>
  )

  const updateTrip = (updatedStops) => {
    dispatch({ type:'UPDATE_TRIP', payload: { ...trip, stops: updatedStops } })
  }

  const addStop = (stop) => {
    const stops = [...(trip.stops||[]), stop]
    updateTrip(stops)
    showToast(`${stop.emoji}${stop.cityName} added!`, 'success')
  }

  const deleteStop = (stopId) => {
    const stops = trip.stops.filter(s => s.id !== stopId)
    updateTrip(stops)
    showToast('Stop removed.', 'error')
  }

  const moveStop = (idx, dir) => {
    const stops = [...trip.stops]
    const target = idx + dir
    if (target < 0 || target >= stops.length) return
    ;[stops[idx], stops[target]] = [stops[target], stops[idx]]
    updateTrip(stops)
  }

  const addActivity = (stopId, activity) => {
    const stops = trip.stops.map(s => s.id===stopId ? { ...s, activities:[...(s.activities||[]),activity] } : s)
    updateTrip(stops)
    showToast(`Activity added!`, 'success')
  }

  const deleteActivity = (stopId, actId) => {
    const stops = trip.stops.map(s => s.id===stopId ? { ...s, activities:s.activities.filter(a=>a.id!==actId) } : s)
    updateTrip(stops)
  }

  const totalCost = trip.stops?.reduce((total, s) => {
    const nights = Math.max(0, Math.ceil((new Date(s.endDate)-new Date(s.startDate))/(1000*60*60*24)))
    return total + (s.accommodationCost*nights) + (s.transportCost||0) + (s.activities?.reduce((a,act)=>a+(act.cost||0),0)||0)
  }, 0) || 0

  return (
    <div className="page-container animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1 className="page-title" style={{ fontSize:'var(--fs-2xl)' }}>
              <span style={{ marginRight:'var(--space-2)' }}>🗺️</span>
              {trip.name}
            </h1>
            <p className="page-subtitle">
              {trip.stops?.length||0} stops · Est. total: <strong style={{ color:'var(--color-warning)' }}>${totalCost.toLocaleString()}</strong>
            </p>
          </div>
          <div style={{ display:'flex',gap:'var(--space-3)' }}>
            <button className="btn btn-secondary" onClick={() => navigate(`/trips/${trip.id}/budget`)}>
              <DollarSign size={15} /> Budget
            </button>
            <button className="btn btn-primary" onClick={() => navigate(`/trips/${trip.id}/view`)}>
              View Itinerary <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress */}
      {trip.totalBudget > 0 && (
        <div className="card" style={{ marginBottom:'var(--space-6)',padding:'var(--space-4) var(--space-6)' }}>
          <div className="flex-between" style={{ marginBottom:'var(--space-2)' }}>
            <span style={{ fontSize:'var(--fs-sm)',color:'var(--color-text-muted)' }}>Budget used</span>
            <span style={{ fontSize:'var(--fs-sm)',fontWeight:600 }}>
              ${totalCost.toLocaleString()} / ${trip.totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{
              width:`${Math.min(100,(totalCost/trip.totalBudget)*100)}%`,
              background: totalCost > trip.totalBudget ? 'var(--color-danger)' : undefined
            }} />
          </div>
          {totalCost > trip.totalBudget && (
            <p style={{ color:'var(--color-danger)',fontSize:'var(--fs-xs)',marginTop:'var(--space-1)' }}>
              ⚠️ Over budget by ${(totalCost - trip.totalBudget).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Stops */}
      {trip.stops?.length === 0 && (
        <div className="card empty-state" style={{ marginBottom:'var(--space-6)' }}>
          <div className="empty-state-icon"><MapPin size={28} /></div>
          <h3>No stops yet</h3>
          <p style={{ color:'var(--color-text-muted)' }}>Add cities to build your itinerary</p>
        </div>
      )}

      <div style={{ display:'flex',flexDirection:'column',gap:'var(--space-4)',marginBottom:'var(--space-6)' }}>
        {trip.stops?.map((stop, idx) => (
          <StopCard
            key={stop.id}
            stop={stop}
            index={idx}
            total={trip.stops.length}
            trip={trip}
            onMoveUp={() => moveStop(idx,-1)}
            onMoveDown={() => moveStop(idx,1)}
            onDelete={() => deleteStop(stop.id)}
            onAddActivity={() => setAddActivityForStop(stop)}
            onDeleteActivity={(actId) => deleteActivity(stop.id, actId)}
          />
        ))}
      </div>

      <button className="btn btn-secondary btn-lg" style={{ width:'100%' }} onClick={() => setShowAddStop(true)} id="add-stop-btn">
        <Plus size={18} /> Add Stop
      </button>

      {showAddStop && (
        <AddStopModal trip={trip} onAdd={addStop} onClose={() => setShowAddStop(false)} />
      )}
      {addActivityForStop && (
        <AddActivityModal
          stop={addActivityForStop}
          trip={trip}
          onAdd={(act) => addActivity(addActivityForStop.id, act)}
          onClose={() => setAddActivityForStop(null)}
        />
      )}
    </div>
  )
}
