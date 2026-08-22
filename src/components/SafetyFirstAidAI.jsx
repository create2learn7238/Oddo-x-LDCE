import { useState } from 'react'
import { HeartPulse, ShieldAlert, Sparkles, Droplets, Sun, Wind, CheckCircle2 } from 'lucide-react'

const SAFETY_PROTOCOLS = [
  {
    category: '💧 Water & Food Safety in Desert & Coastal Zones',
    icon: '💧',
    color: '#06B6D4',
    advice: [
      'Drink bottled or filtered RO water; avoid unsealed tap water in remote desert villages.',
      'Carry Oral Rehydration Salts (ORS) or electrolyte powder during high-sun daytime sightseeing.',
      'When eating Kathiyawadi or Surati spicy street food, keep sweet lassi or cold chhas (buttermilk) handy to soothe digestion.'
    ]
  },
  {
    category: '🦁 Wildlife Safaris & Forest Precautions (Sasan Gir)',
    icon: '🦁',
    color: '#10B981',
    advice: [
      'Wear high-ankle closed shoes or boots when walking around jungle lodge perimeters after dark.',
      'Carry a high-beam flashlight and insect repellent for early morning 6 AM safari queues.',
      'Always stay seated inside the forest department Gypsy vehicle at all times.'
    ]
  },
  {
    category: '☀️ Sunstroke & Desert Dust Protection (Rann of Kutch)',
    icon: '☀️',
    color: '#F59E0B',
    advice: [
      'Wear SPF 50+ sunscreen, UV-blocking sunglasses, and a wide cotton scarf to filter fine white salt dust.',
      'Hydrate with at least 3 liters of fluids daily when exploring the salt plains.',
      'Schedule outdoor walking between 06:30 AM - 10:00 AM and 04:30 PM - 07:00 PM to avoid peak midday sun.'
    ]
  },
  {
    category: '💊 Essential First-Aid Kit Checklist',
    icon: '🩺',
    color: '#EC4899',
    advice: [
      'Antihistamines (for dust allergies in scrub forests / desert)',
      'Motion sickness tablets (for Saputara hill hairpin bends and sea ferry crossings)',
      'Antiseptic wipes, band-aids, burn relief gel, and personal prescription medications'
    ]
  }
]

export default function SafetyFirstAidAI() {
  const [activeIdx, setActiveIdx] = useState(0)
  const current = SAFETY_PROTOCOLS[activeIdx]

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <HeartPulse size={20} color="var(--color-danger)" />
            Travel Medical & Safety First-Aid Intelligence
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Regional health precautions, safari hygiene, and desert hydration strategies
          </p>
        </div>

        <span className="badge badge-danger">🩺 Traveler Health Safe</span>
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
        {SAFETY_PROTOCOLS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`chip ${activeIdx === idx ? 'active' : ''}`}
            style={{ fontSize: '11px', whiteSpace: 'nowrap', padding: '6px 12px' }}
          >
            {p.icon} {p.category.split(' ')[1]} {p.category.split(' ')[2]}
          </button>
        ))}
      </div>

      {/* Active Tips Box */}
      <div style={{
        background: 'var(--color-surface2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        border: `1.5px solid ${current.color}44`
      }}>
        <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: current.color, marginBottom: 'var(--space-3)' }}>
          {current.category}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
          {current.advice.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', background: 'var(--color-surface3)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <CheckCircle2 size={15} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.45 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
