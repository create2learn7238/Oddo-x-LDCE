import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  Edit3, DollarSign, Share2, Calendar, List, MapPin,
  Clock, ChevronDown, ChevronRight, Printer, Copy, Check, CheckSquare, Square
} from 'lucide-react'
import RouteVisualizer from '../components/RouteVisualizer'
import WeatherWidget from '../components/WeatherWidget'
import TripCountdown from '../components/TripCountdown'
import LanguagePhrasebook from '../components/LanguagePhrasebook'
import CarbonCalculator from '../components/CarbonCalculator'
import TravelJournal from '../components/TravelJournal'
import TravelVoucher from '../components/TravelVoucher'
import BaggageEstimator from '../components/BaggageEstimator'
import PocketCheatSheet from '../components/PocketCheatSheet'

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })
}
function formatShortDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' })
}
function getDatesInRange(start, end) {
  const dates = []
  let cur = new Date(start + 'T00:00:00')
  const endD = new Date(end + 'T00:00:00')
  while (cur <= endD) {
    dates.push(cur.toISOString().split('T')[0])
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

const DEFAULT_PACKING_ITEMS = [
  'Passport / Govt ID & Travel Insurance',
  'Phone Chargers, Universal Adapter & Power Bank',
  'Comfortable Walking Shoes & Flip-flops',
  'Sunscreen, Sunglasses & Hat',
  'Prescription Medicines & First Aid Kit',
  'Local Cash & International Travel Cards',
  'Weather-appropriate Clothing & Jacket',
  'Camera & Memory Cards'
]

export default function ItineraryView() {
  const { tripId } = useParams()
  const { trips, formatPrice, showToast } = useApp()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('list') // list | calendar | packing
  const [expandedDays, setExpandedDays] = useState({})
  const [copied, setCopied] = useState(false)
  const [packedItems, setPackedItems] = useState({})

  const trip = trips.find(t => t.id === tripId)

  if (!trip) return (
    <div className="page-container">
      <div className="card empty-state">
        <p>Trip not found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/trips')}>Back to Trips</button>
      </div>
    </div>
  )

  const allDates = trip.startDate && trip.endDate ? getDatesInRange(trip.startDate, trip.endDate) : []
  const toggleDay = (date) => setExpandedDays(d => ({ ...d, [date]: !d[date] }))

  // Map activities by date across all stops
  const actsByDate = {}
  trip.stops?.forEach(stop => {
    stop.activities?.forEach(act => {
      if (!actsByDate[act.scheduledDate]) actsByDate[act.scheduledDate] = []
      actsByDate[act.scheduledDate].push({ ...act, stopName: stop.cityName, stopEmoji: stop.emoji })
    })
  })

  const getCityForDate = (date) => {
    return trip.stops?.find(s => date >= s.startDate && date <= s.endDate)
  }

  const totalCost = trip.stops?.reduce((total, s) => {
    const nights = Math.max(0, Math.ceil((new Date(s.endDate)-new Date(s.startDate))/(1000*60*60*24)))
    return total + (s.accommodationCost*nights) + (s.transportCost||0) + (s.activities?.reduce((a,act)=>a+(act.cost||0),0)||0)
  }, 0) || 0

  const handlePrint = () => {
    window.print()
  }

  const handleCopySummary = async () => {
    let text = `# ${trip.name}\n`
    text += `Dates: ${trip.startDate} to ${trip.endDate}\n`
    text += `Estimated Total: ${formatPrice(totalCost)}\n\n`
    text += `## Stops & Itinerary:\n`
    trip.stops?.forEach((s, idx) => {
      text += `\n### Stop ${idx+1}: ${s.emoji} ${s.cityName} (${s.startDate} to ${s.endDate})\n`
      if (s.accommodation) text += `- Accommodation: ${s.accommodation} (${formatPrice(s.accommodationCost)}/night)\n`
      s.activities?.forEach(a => {
        text += `  - ${a.emoji || '📌'} ${a.name} (${a.time || '--'}) - ${formatPrice(a.cost)}\n`
      })
    })

    await navigator.clipboard.writeText(text)
    setCopied(true)
    showToast('Itinerary copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2500)
  }

  const togglePacked = (item) => {
    setPackedItems(prev => ({ ...prev, [item]: !prev[item] }))
  }

  return (
    <div className="page-container animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div className="flex-between" style={{ flexWrap:'wrap',gap:'var(--space-4)' }}>
          <div>
            <div style={{ display:'flex',alignItems:'center',gap:'var(--space-2)',marginBottom:'var(--space-1)' }}>
              <div style={{ width:10,height:10,borderRadius:'var(--radius-full)',background:trip.coverColor||'var(--color-primary)' }} />
              <span style={{ fontSize:'var(--fs-xs)',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600 }}>
                {trip.stops?.length} stops · {allDates.length} days
              </span>
            </div>
            <h1 className="page-title" style={{ fontSize:'var(--fs-2xl)' }}>{trip.name}</h1>
            <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-sm)' }}>
              {new Date(trip.startDate).toLocaleDateString('en-US',{month:'long',day:'numeric'})} →{' '}
              {new Date(trip.endDate).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
            </p>
          </div>
          <div style={{ display:'flex',gap:'var(--space-2)',flexWrap:'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print or Save as PDF">
              <Printer size={14} /> Print / PDF
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleCopySummary}>
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Plan</>}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/trips/${trip.id}/build`)}>
              <Edit3 size={14} /> Edit
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/trips/${trip.id}/budget`)}>
              <DollarSign size={14} /> Budget
            </button>
            {trip.isPublic && (
              <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/share/${trip.id}`)}>
                <Share2 size={14} /> Share
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Trip Departure Countdown */}
      <TripCountdown startDate={trip.startDate} endDate={trip.endDate} tripName={trip.name} />

      {/* Stats Row */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'var(--space-4)',marginBottom:'var(--space-6)' }}>
        {[
          { label:'Cities', value: trip.stops?.length||0, icon:'🏙️' },
          { label:'Days', value: allDates.length, icon:'📅' },
          { label:'Activities', value: trip.stops?.reduce((s,st)=>s+(st.activities?.length||0),0)||0, icon:'🎯' },
          { label:'Est. Cost', value: formatPrice(totalCost), icon:'💰' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="card" style={{ textAlign:'center',padding:'var(--space-4)' }}>
            <div style={{ fontSize:'1.5rem',marginBottom:'var(--space-1)' }}>{icon}</div>
            <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--fs-xl)' }}>{value}</div>
            <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Interactive Travel Route */}
      <RouteVisualizer stops={trip.stops} tripColor={trip.coverColor} />

      {/* Weather Forecast & Climate */}
      <WeatherWidget stops={trip.stops} />

      {/* View Mode Switcher */}
      <div style={{ display:'flex',gap:'var(--space-2)',marginBottom:'var(--space-6)',background:'var(--color-surface)',borderRadius:'var(--radius-md)',padding:4,width:'fit-content',border:'1px solid var(--color-border)',flexWrap:'wrap' }}>
        {[
          { id:'list',        icon:<List size={15}/>,        label:'Day Itinerary' },
          { id:'calendar',    icon:<Calendar size={15}/>,    label:'Calendar View' },
          { id:'packing',     icon:<CheckSquare size={15}/>, label:'Packing Checklist' },
          { id:'phrasebook',  icon:<span>🗣️</span>,          label:'Language Phrasebook' },
          { id:'carbon',      icon:<span>🌿</span>,          label:'Eco Footprint' },
          { id:'journal',     icon:<span>📖</span>,          label:'Travel Journal' },
          { id:'voucher',     icon:<span>🎫</span>,          label:'Travel Voucher' },
          { id:'cheatsheet',  icon:<span>📄</span>,          label:'Pocket Cheat-Sheet' },
        ].map(({id,icon,label}) => (
          <button
            key={id}
            onClick={() => setViewMode(id)}
            style={{
              display:'flex',alignItems:'center',gap:'var(--space-2)',
              padding:'var(--space-2) var(--space-4)',borderRadius:'var(--radius-sm)',
              background: viewMode===id ? 'var(--color-primary)' : 'transparent',
              color: viewMode===id ? '#fff' : 'var(--color-text-muted)',
              fontWeight: viewMode===id ? 600 : 400,
              fontSize:'var(--fs-sm)',cursor:'pointer',border:'none',
              transition:'all var(--transition-fast)',
            }}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {viewMode === 'list' && (
        /* ── List View ── */
        <div style={{ display:'flex',flexDirection:'column',gap:'var(--space-8)' }}>
          {trip.stops?.map((stop, idx) => {
            const nights = Math.max(0, Math.ceil((new Date(stop.endDate)-new Date(stop.startDate))/(1000*60*60*24)))
            const stopDates = getDatesInRange(stop.startDate, stop.endDate)
            const stopCost = (stop.accommodationCost*nights) + (stop.transportCost||0) + (stop.activities?.reduce((s,a)=>s+(a.cost||0),0)||0)

            return (
              <div key={stop.id}>
                {/* City Header */}
                <div style={{
                  display:'flex',alignItems:'center',gap:'var(--space-4)',
                  padding:'var(--space-4) var(--space-6)',
                  background:`linear-gradient(135deg, ${trip.coverColor||'var(--color-primary)'}25, transparent)`,
                  border:`1px solid ${trip.coverColor||'var(--color-primary)'}40`,
                  borderRadius:'var(--radius-lg)',marginBottom:'var(--space-4)',
                }}>
                  <div style={{
                    width:48,height:48,borderRadius:'var(--radius-lg)',
                    background:`linear-gradient(135deg, ${trip.coverColor||'var(--color-primary)'}, ${trip.coverColor||'var(--color-primary)'}99)`,
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',
                  }}>
                    {stop.emoji}
                  </div>
                  <div style={{ flex:1 }}>
                    <h2 style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--fs-xl)' }}>
                      {stop.cityName}
                    </h2>
                    <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)',display:'flex',gap:'var(--space-3)',flexWrap:'wrap' }}>
                      <span><Calendar size={11} style={{display:'inline',marginRight:3}}/>{formatShortDate(stop.startDate)} → {formatShortDate(stop.endDate)}</span>
                      <span>·</span>
                      <span>{nights} night{nights!==1?'s':''}</span>
                      {stop.accommodation && <><span>·</span><span>🏨 {stop.accommodation} ({formatPrice(stop.accommodationCost)}/n)</span></>}
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'var(--color-warning)',fontSize:'var(--fs-lg)' }}>
                      {formatPrice(stopCost)}
                    </div>
                    <div style={{ fontSize:'var(--fs-xs)',color:'var(--color-text-muted)' }}>est. cost</div>
                  </div>
                </div>

                {/* Days */}
                <div style={{ display:'flex',flexDirection:'column',gap:'var(--space-3)' }}>
                  {stopDates.map((date, dayIdx) => {
                    const dayActs = (actsByDate[date]||[]).filter(a=>a.stopName===stop.cityName)
                    const isExpanded = expandedDays[date] !== false
                    const dayLabel = dayIdx === 0 ? 'Arrival Day' : dayIdx === stopDates.length-1 ? 'Departure Day' : `Day ${dayIdx+1}`

                    return (
                      <div key={date} className="card" style={{ padding:0,overflow:'hidden' }}>
                        <button
                          onClick={() => toggleDay(date)}
                          style={{
                            display:'flex',alignItems:'center',gap:'var(--space-4)',
                            padding:'var(--space-4) var(--space-5)',width:'100%',
                            background:'none',border:'none',cursor:'pointer',textAlign:'left',
                          }}
                        >
                          <div style={{
                            width:36,height:36,borderRadius:'var(--radius-md)',
                            background:'var(--color-surface2)',display:'flex',alignItems:'center',
                            justifyContent:'center',fontWeight:700,fontSize:'var(--fs-sm)',color:'var(--color-primary)',
                            flexShrink:0,
                          }}>
                            {new Date(date+'T00:00:00').getDate()}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:600,fontSize:'var(--fs-sm)' }}>{formatDate(date)}</div>
                            <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)' }}>
                              {dayLabel} · {dayActs.length} activit{dayActs.length!==1?'ies':'y'}
                            </div>
                          </div>
                          {isExpanded ? <ChevronDown size={16} color="var(--color-text-muted)"/> : <ChevronRight size={16} color="var(--color-text-muted)"/>}
                        </button>

                        {isExpanded && (
                          <div style={{ padding:'0 var(--space-5) var(--space-4)',display:'flex',flexDirection:'column',gap:'var(--space-2)' }}>
                            {dayActs.length === 0 ? (
                              <p style={{ color:'var(--color-text-faint)',fontSize:'var(--fs-xs)',padding:'var(--space-4)' }}>
                                No activities scheduled for this day.
                              </p>
                            ) : (
                              dayActs.sort((a,b) => (a.time||'').localeCompare(b.time||'')).map(act => (
                                <div key={act.id} style={{
                                  display:'flex',alignItems:'center',gap:'var(--space-3)',
                                  padding:'var(--space-3)',background:'var(--color-surface2)',
                                  borderRadius:'var(--radius-md)',
                                }}>
                                  <span style={{ fontSize:'1.2rem',flexShrink:0 }}>{act.emoji||'📌'}</span>
                                  <div style={{ flex:1 }}>
                                    <div style={{ fontWeight:500,fontSize:'var(--fs-sm)' }}>{act.name}</div>
                                    <div style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-xs)',display:'flex',gap:'var(--space-3)' }}>
                                      <span><Clock size={10} style={{display:'inline',marginRight:3}}/>{act.time||'--:--'}</span>
                                      <span className="badge badge-primary" style={{padding:'1px 6px',fontSize:10}}>{act.category}</span>
                                    </div>
                                    {act.notes && <div style={{ color:'var(--color-text-faint)',fontSize:'var(--fs-xs)',marginTop:2 }}>📝 {act.notes}</div>}
                                  </div>
                                  <div style={{ textAlign:'right',flexShrink:0 }}>
                                    <div style={{ fontWeight:600,fontSize:'var(--fs-sm)',color:'var(--color-warning)' }}>
                                      {formatPrice(act.cost||0)}
                                    </div>
                                    {act.duration && <div style={{ fontSize:'var(--fs-xs)',color:'var(--color-text-faint)' }}>{act.duration}</div>}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {viewMode === 'calendar' && (
        /* ── Calendar View ── */
        <div className="card" style={{ padding:'var(--space-6)' }}>
          <h3 style={{ marginBottom:'var(--space-6)',fontFamily:'var(--font-display)',fontWeight:700 }}>Trip Calendar</h3>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'var(--space-1)',textAlign:'center',marginBottom:'var(--space-2)' }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} style={{ fontSize:'var(--fs-xs)',fontWeight:600,color:'var(--color-text-muted)',padding:'var(--space-2)' }}>{d}</div>
            ))}
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4 }}>
            {(() => {
              if (!trip.startDate) return null
              const startDate = new Date(trip.startDate + 'T00:00:00')
              const endDate = new Date(trip.endDate + 'T00:00:00')
              const firstDay = startDate.getDay()
              const cells = []
              for (let i = 0; i < firstDay; i++) {
                cells.push(<div key={`pad-${i}`} />)
              }
              let cur = new Date(startDate)
              while (cur <= endDate) {
                const dateStr = cur.toISOString().split('T')[0]
                const city = getCityForDate(dateStr)
                const dayActs = actsByDate[dateStr] || []
                cells.push(
                  <div key={dateStr} style={{
                    padding:'var(--space-2)',borderRadius:'var(--radius-md)',
                    background: city ? `${trip.coverColor||'var(--color-primary)'}22` : 'var(--color-surface2)',
                    border:`1px solid ${city ? `${trip.coverColor||'var(--color-primary)'}44` : 'var(--color-border)'}`,
                    minHeight:75,
                  }}>
                    <div style={{ fontWeight:600,fontSize:'var(--fs-sm)',marginBottom:2,color: city ? 'var(--color-primary-light)' : 'var(--color-text-muted)' }}>
                      {cur.getDate()}
                    </div>
                    {city && <div style={{ fontSize:10,color:'var(--color-text-muted)' }}>{city.emoji}{city.cityName}</div>}
                    {dayActs.slice(0,2).map(a => (
                      <div key={a.id} style={{
                        fontSize:9,padding:'1px 4px',borderRadius:3,marginTop:2,
                        background:'var(--color-primary-glow)',color:'var(--color-primary-light)',
                        whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
                      }}>{a.emoji} {a.name}</div>
                    ))}
                    {dayActs.length > 2 && <div style={{ fontSize:9,color:'var(--color-text-faint)',marginTop:2 }}>+{dayActs.length-2} more</div>}
                  </div>
                )
                cur.setDate(cur.getDate() + 1)
              }
              return cells
            })()}
          </div>
        </div>
      )}

      {viewMode === 'packing' && (
        /* ── Packing Checklist Tab ── */
        <div className="card" style={{ padding:'var(--space-6)' }}>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--fs-lg)',marginBottom:4 }}>
              🎒 Travel Packing Checklist
            </h3>
            <p style={{ color:'var(--color-text-muted)',fontSize:'var(--fs-sm)' }}>
              Check off essentials before embarking on {trip.name}
            </p>
          </div>

          <div style={{ display:'flex',flexDirection:'column',gap:'var(--space-3)' }}>
            {DEFAULT_PACKING_ITEMS.map((item) => {
              const isChecked = !!packedItems[item]
              return (
                <div
                  key={item}
                  onClick={() => togglePacked(item)}
                  style={{
                    display:'flex',alignItems:'center',gap:'var(--space-3)',
                    padding:'var(--space-4)',background:'var(--color-surface2)',
                    borderRadius:'var(--radius-md)',cursor:'pointer',
                    border:`1px solid ${isChecked ? 'var(--color-success)' : 'var(--color-border)'}`,
                    transition:'all var(--transition-fast)'
                  }}
                >
                  <div style={{ color: isChecked ? 'var(--color-success)' : 'var(--color-text-faint)' }}>
                    {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                  <span style={{
                    fontSize:'var(--fs-sm)',
                    fontWeight: isChecked ? 600 : 400,
                    textDecoration: isChecked ? 'line-through' : 'none',
                    color: isChecked ? 'var(--color-text-muted)' : 'var(--color-text)'
                  }}>
                    {item}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Smart Baggage Weight Estimator */}
          <BaggageEstimator />
        </div>
      )}

      {viewMode === 'phrasebook' && (
        <LanguagePhrasebook />
      )}

      {viewMode === 'carbon' && (
        <CarbonCalculator stops={trip.stops} />
      )}

      {viewMode === 'journal' && (
        <TravelJournal tripId={trip.id} />
      )}

      {viewMode === 'voucher' && (
        <TravelVoucher trip={trip} user={user} />
      )}

      {viewMode === 'cheatsheet' && (
        <PocketCheatSheet trip={trip} user={user} />
      )}
    </div>
  )
}
