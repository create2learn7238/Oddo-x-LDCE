import { useState } from 'react'
import { Plane, Train, Bus, MapPin, Navigation, Sparkles } from 'lucide-react'

const TRANSIT_HUBS = [
  {
    dest: 'Statue of Unity (Kevadia)',
    airport: 'Vadodara Airport (BDQ) - 85 km / Ahmedabad (AMD) - 195 km',
    train: 'Ekta Nagar Railway Station (EKNR) - Direct Jan Shatabdi & Vande Bharat Express',
    road: 'State Highway 11 & NE-1 Expressway from Vadodara / Ahmedabad',
    icon: '🗿'
  },
  {
    dest: 'Great Rann of Kutch (Dhordo)',
    airport: 'Bhuj Airport (BHJ) - 80 km / Ahmedabad (AMD) - 410 km',
    train: 'Bhuj Railway Station (BHUJ) - Connects Mumbai, Delhi, Ahmedabad (Ala Hazrat & Kutch Exp)',
    road: 'NH-947 and State Highway 45 via Viramgam & Bhuj',
    icon: '🎪'
  },
  {
    dest: 'Sasan Gir (Asiatic Lion Reserve)',
    airport: 'Keshod Airport (IXK) - 40 km / Rajkot International (HSR) - 160 km',
    train: 'Junagadh Junction (JND) - 55 km / Veraval Junction (VRL) - 45 km',
    road: 'NH-27 connecting Rajkot, Gondal, and Junagadh Forest Route',
    icon: '🦁'
  },
  {
    dest: 'Somnath Shore Temple',
    airport: 'Diu Airport (DIU) - 85 km / Rajkot International (HSR) - 195 km',
    train: 'Veraval Junction (VRL) - 6 km (Direct express trains from Ahmedabad, Mumbai, Pune)',
    road: 'Coastal National Highway 51 & 4-lane Rajkot-Somnath Corridor',
    icon: '🛕'
  },
  {
    dest: 'Dwarkadhish Kingdom',
    airport: 'Jamnagar Airport (JGA) - 130 km / Porbandar (PBD) - 100 km',
    train: 'Dwarka Railway Station (DWK) - Direct superfast trains across India',
    road: 'NH-51 coastal expressway and state highway from Jamnagar',
    icon: '👑'
  }
]

export default function TransitHubNavigator() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const hub = TRANSIT_HUBS[selectedIdx]

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Navigation size={20} color="var(--color-primary)" />
            Destination Transit Hubs & Connectivity Navigator
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Nearest international/domestic airports, Vande Bharat stations, and express routes
          </p>
        </div>

        <span className="badge badge-primary">🚆 Vande Bharat Connected</span>
      </div>

      {/* Selector Chips */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-4)',
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none'
      }}>
        {TRANSIT_HUBS.map((h, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`chip ${selectedIdx === idx ? 'active' : ''}`}
            style={{ fontSize: '11px', whiteSpace: 'nowrap', padding: '6px 12px' }}
          >
            {h.icon} {h.dest.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {/* Transit Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary-light)', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <Plane size={14} /> Nearest Flight Hubs
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
            {hub.airport}
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-warning)', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <Train size={14} /> Railway Junctions & High Speed
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
            {hub.train}
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-info)', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <Bus size={14} /> Express Highways & Roadways
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
            {hub.road}
          </div>
        </div>
      </div>
    </div>
  )
}
