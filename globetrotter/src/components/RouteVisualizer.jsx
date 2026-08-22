import { useState } from 'react'
import { MapPin, Navigation, ArrowRight, Plane, Train, Car, Compass } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function RouteVisualizer({ stops = [], tripColor = '#6C63FF' }) {
  const { formatPrice } = useApp()
  const [activeStop, setActiveStop] = useState(0)

  if (!stops || stops.length === 0) return null

  const getTransit = (idx) => {
    const modes = [
      { mode: 'Scenic Highway Drive', icon: Car, time: '3h 30m', dist: '210 km' },
      { mode: 'Vande Bharat Express Train', icon: Train, time: '2h 15m', dist: '180 km' },
      { mode: 'Connecting Flight', icon: Plane, time: '1h 10m', dist: '420 km' },
    ]
    return modes[idx % modes.length]
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)', overflow: 'hidden' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Compass size={20} color="var(--color-primary)" />
            Interactive Travel Route & Transit Journey
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Visual step-by-step route across {stops.length} destinations
          </p>
        </div>
        <span className="badge badge-primary">
          {stops.length} Stops Connected
        </span>
      </div>

      {/* Visual Timeline Bar */}
      <div style={{
        position: 'relative',
        padding: 'var(--space-4) var(--space-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowX: 'auto',
        gap: 'var(--space-4)',
        scrollbarWidth: 'none',
      }}>
        {stops.map((stop, idx) => {
          const isSelected = activeStop === idx
          const transit = idx < stops.length - 1 ? getTransit(idx) : null
          const TransitIcon = transit ? transit.icon : null

          return (
            <div key={stop.id || idx} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {/* Stop Node */}
              <div
                onClick={() => setActiveStop(idx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 'var(--radius-xl)',
                  background: isSelected
                    ? `linear-gradient(135deg, ${tripColor}, ${tripColor}cc)`
                    : 'var(--color-surface2)',
                  border: `2px solid ${isSelected ? '#fff' : 'var(--color-border)'}`,
                  boxShadow: isSelected ? `0 0 16px ${tripColor}88` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  marginBottom: 6,
                  transition: 'all var(--transition-fast)'
                }}>
                  {stop.emoji || '📍'}
                </div>

                <span style={{
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: 'var(--fs-xs)',
                  color: isSelected ? 'var(--color-text)' : 'var(--color-text-muted)',
                  textAlign: 'center',
                  maxWidth: 90,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {stop.cityName}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--color-primary-light)', fontWeight: 600 }}>
                  Stop {idx + 1}
                </span>
              </div>

              {/* Transit Connector */}
              {idx < stops.length - 1 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0 var(--space-4)',
                  position: 'relative',
                  minWidth: 100,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'var(--color-surface3)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '10px',
                    color: 'var(--color-text-muted)',
                    marginBottom: 4,
                    whiteSpace: 'nowrap'
                  }}>
                    {TransitIcon && <TransitIcon size={11} color="var(--color-warning)" />}
                    {transit.time}
                  </div>
                  <div style={{
                    width: '100%',
                    height: 2,
                    background: `repeating-linear-gradient(90deg, ${tripColor}88, ${tripColor}88 6px, transparent 6px, transparent 10px)`
                  }} />
                  <span style={{ fontSize: '9px', color: 'var(--color-text-faint)', marginTop: 3 }}>
                    {transit.dist}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Active Selected Stop Detail Panel */}
      {stops[activeStop] && (
        <div style={{
          marginTop: 'var(--space-5)',
          background: 'var(--color-surface2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4) var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          animation: 'fadeIn 250ms both'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: '2rem' }}>{stops[activeStop].emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--fs-md)' }}>
                {stops[activeStop].cityName} (Stop {activeStop + 1} of {stops.length})
              </div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
                Dates: {stops[activeStop].startDate} → {stops[activeStop].endDate} ·{' '}
                {stops[activeStop].accommodation ? `🏨 ${stops[activeStop].accommodation}` : 'No hotel set'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>Stop Est. Cost</div>
              <div style={{ fontWeight: 700, color: 'var(--color-warning)', fontSize: 'var(--fs-base)' }}>
                {formatPrice(
                  (stops[activeStop].accommodationCost || 0) +
                  (stops[activeStop].transportCost || 0) +
                  (stops[activeStop].activities?.reduce((s, a) => s + (a.cost || 0), 0) || 0)
                )}
              </div>
            </div>
            {activeStop < stops.length - 1 && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveStop(activeStop + 1)}
              >
                Next Stop <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
