import { FileText, Printer, MapPin, Phone, Shield, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function PocketCheatSheet({ trip, user }) {
  if (!trip) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={20} color="var(--color-primary)" />
            Pocket Travel Cheat-Sheet (Printable Wallet Card)
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Ultra-compact offline travel card with addresses, emergency numbers, and key phrases
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
          <Printer size={14} /> Print Pocket Card
        </button>
      </div>

      {/* Foldable Pocket Card Grid */}
      <div style={{
        background: 'var(--color-surface2)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-5) var(--space-6)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--space-5)'
      }}>
        {/* Itinerary & Hotels */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 'var(--fs-xs)', color: 'var(--color-primary-light)', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={13} /> Stops & Accommodations
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {trip.stops?.map((s, i) => (
              <div key={i} style={{ fontSize: '11px', background: 'var(--color-surface3)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
                <strong>{s.emoji} {s.cityName}:</strong> {s.startDate} → {s.endDate}
                <div style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>🏨 {s.accommodation || 'City Center Stay'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency & PNR */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 'var(--fs-xs)', color: 'var(--color-danger)', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Shield size={13} /> Emergency Helplines
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '11px' }}>
            <div style={{ background: 'var(--color-surface3)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
              🚨 <strong>All-India Emergency:</strong> 112
            </div>
            <div style={{ background: 'var(--color-surface3)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
              🦁 <strong>Gujarat Tourism:</strong> 1800 200 5080
            </div>
            <div style={{ background: 'var(--color-surface3)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
              🚑 <strong>Ambulance:</strong> 108 · 🚔 <strong>Police:</strong> 100
            </div>
          </div>
        </div>

        {/* Essential Phrases */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 'var(--fs-xs)', color: 'var(--color-warning)', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkles size={13} /> Handy Local Phrases
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '11px' }}>
            <div style={{ background: 'var(--color-surface3)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
              "Kem cho?" = <em>How are you?</em>
            </div>
            <div style={{ background: 'var(--color-surface3)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
              "Majama!" = <em>All good / Fine!</em>
            </div>
            <div style={{ background: 'var(--color-surface3)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
              "Aabhar" = <em>Thank you very much</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
