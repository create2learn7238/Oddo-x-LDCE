import { useState } from 'react'
import { Clock, Sun, Moon, Coffee, Droplets, Sparkles } from 'lucide-react'

export default function JetLagPlanner() {
  const [originTz, setOriginTz] = useState('IST (UTC+5:30) - India')
  const [destTz, setDestTz] = useState('CET (UTC+1:00) - Europe')

  const timeDiffs = {
    'IST (UTC+5:30) - India': {
      'CET (UTC+1:00) - Europe': -4.5,
      'JST (UTC+9:00) - Japan': 3.5,
      'GST (UTC+4:00) - Dubai': -1.5,
      'EST (UTC-5:00) - USA': -9.5
    }
  }

  const shift = (timeDiffs[originTz] && timeDiffs[originTz][destTz]) || -4.5
  const isEast = shift > 0

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={20} color="var(--color-warning)" />
            Jet Lag & Circadian Travel Optimizer
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Smart sleep adjustment schedules and caffeine timing for long-haul routes
          </p>
        </div>
        <span className="badge badge-warning">⚡ Rapid Adjustment</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
        background: 'var(--color-surface2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        border: '1px solid var(--color-border)',
        marginBottom: 'var(--space-4)'
      }}>
        <div className="form-group">
          <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Origin Timezone</label>
          <select className="form-input" value={originTz} onChange={e => setOriginTz(e.target.value)}>
            <option value="IST (UTC+5:30) - India" style={{ background: 'var(--color-surface)' }}>IST (UTC+5:30) - India</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Destination Timezone</label>
          <select className="form-input" value={destTz} onChange={e => setDestTz(e.target.value)}>
            {['CET (UTC+1:00) - Europe', 'JST (UTC+9:00) - Japan', 'GST (UTC+4:00) - Dubai', 'EST (UTC-5:00) - USA'].map(t => (
              <option key={t} value={t} style={{ background: 'var(--color-surface)' }}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Circadian Plan Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary-light)', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <Sun size={14} /> Sunlight Strategy
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
            {isEast ? 'Seek bright morning light immediately upon arrival to advance your clock.' : 'Get afternoon sunshine and stay awake until local 10 PM.'}
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-warning)', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <Coffee size={14} /> Caffeine Window
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
            Cut off coffee and energy drinks 6 hours before target destination bedtime.
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-info)', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <Droplets size={14} /> In-Flight Hydration
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
            Drink 250ml water for every hour in the air; avoid dehydration fatigue.
          </div>
        </div>
      </div>
    </div>
  )
}
