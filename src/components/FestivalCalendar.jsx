import { useState } from 'react'
import { Calendar, Sparkles, MapPin, Music, Sun, Star } from 'lucide-react'

const FESTIVALS = [
  {
    name: 'Rann Utsav (White Desert Festival)',
    period: 'November – February',
    location: 'Dhordo, Great Rann of Kutch',
    emoji: '🎪',
    color: '#F59E0B',
    desc: "Grand desert carnival under starlit and full-moon skies featuring luxury tent cities, Kutchi embroidery artisans, camel safaris, and midnight folk concerts.",
    highlights: 'Full moon desert walks, Paramotoring, Artisan shopping'
  },
  {
    name: 'Navratri – The 9-Night Garba Extravaganza',
    period: 'September / October',
    location: 'Ahmedabad, Vadodara, Surat (Statewide)',
    emoji: '💃',
    color: '#EC4899',
    desc: "UNESCO-recognized world's largest open-air dance festival where millions dance in synchronized circles wearing traditional Chaniya Cholis and Kediyus until dawn.",
    highlights: 'United Way Vadodara, GMDC Grounds Ahmedabad, Live Raas'
  },
  {
    name: 'Uttarayan (International Kite Festival)',
    period: 'January 14 – 15',
    location: 'Sabarmati Riverfront, Ahmedabad & Surat',
    emoji: '🪁',
    color: '#06B6D4',
    desc: "Rooftops across Gujarat echo with cheers of 'Kai Po Che!' as vibrant kites fill the sky by day and glowing paper lanterns (Tukkals) illuminate the night.",
    highlights: 'Patang Bazaar all-night shopping, Undhiyu & Jalebi feasts'
  },
  {
    name: 'Modhera Dance Festival (Uttarardh Mahotsav)',
    period: 'Third Week of January',
    location: '11th-Century Sun Temple, Modhera',
    emoji: '🏛️',
    color: '#10B981',
    desc: "Classical dance troupes from across India perform against the illuminated backdrop of the thousand-year-old Solanki-era Sun Temple and sacred stepwell.",
    highlights: 'Classical Bharatnatyam & Kathak, Ancient stone acoustics'
  },
  {
    name: 'Dwarkadhish Janmashtami Celebration',
    period: 'August / September',
    location: 'Dwarkadhish Temple, Dwarka',
    emoji: '👑',
    color: '#6C63FF',
    desc: "Grand spiritual birthday celebrations of Lord Krishna with elaborate temple aartis, midnight celebrations, and holy dip at Gomti Ghat.",
    highlights: 'Midnight Mangla Aarti, 52-yard temple flag hoisting'
  }
]

export default function FestivalCalendar() {
  const [activeFest, setActiveFest] = useState(0)

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={20} color="var(--color-primary)" />
            Gujarat Cultural Festivals & Events Calendar
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Plan your journeys around world-famous celebrations and cultural events
          </p>
        </div>
        <span className="badge badge-primary">✨ UNESCO Intangible Heritage</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        {FESTIVALS.map((fest, idx) => (
          <div
            key={fest.name}
            onClick={() => setActiveFest(idx)}
            style={{
              padding: 'var(--space-4) var(--space-5)',
              background: activeFest === idx ? 'var(--color-surface3)' : 'var(--color-surface2)',
              border: `1.5px solid ${activeFest === idx ? fest.color : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div className="flex-between" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: '1.8rem' }}>{fest.emoji}</span>
              <span className="badge" style={{ background: `${fest.color}22`, color: fest.color, border: `1px solid ${fest.color}44`, fontSize: '10px' }}>
                {fest.period}
              </span>
            </div>

            <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', marginBottom: 2, color: 'var(--color-text)' }}>
              {fest.name}
            </div>

            <div style={{ fontSize: '10px', color: 'var(--color-primary-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <MapPin size={11} /> {fest.location}
            </div>

            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', lineHeight: 1.4, marginBottom: 'var(--space-3)' }}>
              {fest.desc}
            </p>

            <div style={{ fontSize: '11px', color: 'var(--color-text)', background: 'var(--color-surface)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
              🎯 <strong style={{ color: fest.color }}>Key Highlights:</strong> {fest.highlights}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
