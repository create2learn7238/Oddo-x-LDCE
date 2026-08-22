import { useState, useEffect } from 'react'
import { Clock, Calendar, CheckCircle, Flame, Sparkles } from 'lucide-react'

export default function TripCountdown({ startDate, endDate, tripName }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'upcoming' })

  useEffect(() => {
    function calculateTime() {
      const now = new Date()
      const start = new Date(startDate + 'T00:00:00')
      const end = new Date(endDate + 'T23:59:59')

      if (now > end) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'past' })
        return
      }

      if (now >= start && now <= end) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'active' })
        return
      }

      const diffMs = start - now
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diffMs / 1000 / 60) % 60)
      const seconds = Math.floor((diffMs / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds, status: 'upcoming' })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [startDate, endDate])

  if (timeLeft.status === 'past') {
    return (
      <div className="card" style={{ padding: 'var(--space-4) var(--space-6)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <CheckCircle size={22} color="var(--color-success)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)' }}>Journey Completed</div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>Hope you created unforgettable memories!</div>
          </div>
        </div>
        <span className="badge badge-success">Archived</span>
      </div>
    )
  }

  if (timeLeft.status === 'active') {
    return (
      <div className="card" style={{
        padding: 'var(--space-4) var(--space-6)', marginBottom: 'var(--space-6)',
        background: 'linear-gradient(135deg, rgba(67,233,123,0.15) 0%, rgba(108,99,255,0.1) 100%)',
        border: '1px solid rgba(67,233,123,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Flame size={24} color="var(--color-warning)" />
          <div>
            <div style={{ fontWeight: 800, fontSize: 'var(--fs-md)', color: 'var(--color-success)' }}>Trip is Live Now! 🎉</div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)' }}>Enjoy every moment of your adventure.</div>
          </div>
        </div>
        <span className="badge badge-success">Currently Traveling</span>
      </div>
    )
  }

  return (
    <div className="card" style={{
      padding: 'var(--space-5) var(--space-6)',
      marginBottom: 'var(--space-6)',
      background: 'linear-gradient(135deg, var(--color-surface2) 0%, var(--color-surface) 100%)',
      border: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--space-4)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-light)' }}>
          <Clock size={22} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} color="var(--color-warning)" />
            Countdown to Departure
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
            Departing on {new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Countdown Digits */}
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        {[
          { label: 'Days', val: timeLeft.days },
          { label: 'Hours', val: timeLeft.hours },
          { label: 'Mins', val: timeLeft.minutes },
          { label: 'Secs', val: timeLeft.seconds }
        ].map((unit, i) => (
          <div key={i} style={{
            background: 'var(--color-surface3)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            textAlign: 'center',
            minWidth: 54,
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-lg)', color: 'var(--color-primary-light)', lineHeight: 1 }}>
              {String(unit.val).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginTop: 2 }}>
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
