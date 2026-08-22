import { useState } from 'react'
import { Sparkles, MapPin, CheckCircle2, ShoppingBag, ShieldCheck, Heart } from 'lucide-react'

const HANDICRAFTS = [
  {
    name: 'Rogan Art Painting (Castor Oil Mastercraft)',
    village: 'Nirona Village, Kutch',
    artisan: 'Khatri Family (Padma Shri Awardees)',
    giTag: 'GI Tagged Heritage',
    desc: 'An ancient Persian freehand craft where boiled castor oil and natural stone pigments are spun into colored thread using a stylus and folded onto cloth in symmetrical poetry.',
    buyTips: 'Look for genuine castor-oil elasticity and signature yellow/red/green mineral pigments.',
    icon: '🎨',
    color: '#F59E0B'
  },
  {
    name: 'Patan Patola (Double-Ikat Silk Sarees)',
    village: 'Patan Old City, North Gujarat',
    artisan: 'Salvi Master Weavers',
    giTag: 'UNESCO Masterpiece / GI Tag',
    desc: 'Each double-ikat warp and weft thread is individually resist-dyed before weaving on traditional rosewood looms. Both sides are identical in color and luster, lasting for centuries.',
    buyTips: 'Visit Patan Patola Heritage Museum to inspect authentic silk weave certifications.',
    icon: '🧣',
    color: '#EC4899'
  },
  {
    name: 'Ajrakhpur Block Print & Rabari Mirrorwork',
    village: 'Ajrakhpur & Bhujodi, Kutch',
    artisan: 'Dr. Ismail Khatri & Rabari Artisans',
    giTag: '14-Stage Indigo Resist Dye',
    desc: 'Intricate 14-stage natural block printing using pomegranate rinds, wild indigo, tamarind paste, and iron rust, paired with hand-stitched shisha mirrorwork.',
    buyTips: 'Authentic Ajrakh smells earthy of natural indigo herbs and softens with every wash.',
    icon: '🧵',
    color: '#06B6D4'
  },
  {
    name: 'Sankheda Lacquered Wooden Furniture',
    village: 'Sankheda, near Vadodara',
    artisan: 'Kharadi Wood Artisans',
    giTag: 'GI Tagged Woodwork',
    desc: 'Turned teakwood polished on traditional lathes with kewda leaf and agate stone, coated in rich botanical tin lacquer and gold/maroon leaf patterns.',
    buyTips: 'Look for the golden sheen that reflects light without chipping.',
    icon: '🪵',
    color: '#10B981'
  }
]

export default function HandicraftGuide() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const activeCraft = HANDICRAFTS[selectedIdx]

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={20} color="var(--color-primary)" />
            Authentic Regional Handicrafts & Master Artisan Hubs
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Support local GI-tagged mastercrafts, ancient textile traditions, and artisan villages
          </p>
        </div>
        <span className="badge badge-warning">🏛️ GI Certified Crafts</span>
      </div>

      {/* Craft Chips */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-5)',
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none'
      }}>
        {HANDICRAFTS.map((c, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`chip ${selectedIdx === idx ? 'active' : ''}`}
            style={{ fontSize: '11px', whiteSpace: 'nowrap', padding: '6px 12px' }}
          >
            {c.icon} {c.name.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {/* Selected Craft Card */}
      <div style={{
        background: 'var(--color-surface2)',
        border: `1.5px solid ${activeCraft.color}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        animation: 'fadeIn 200ms both'
      }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Artisan Village Location</div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-lg)', fontWeight: 800, color: activeCraft.color }}>
              {activeCraft.name}
            </h4>
          </div>
          <span className="badge" style={{ background: `${activeCraft.color}22`, color: activeCraft.color, border: `1px solid ${activeCraft.color}44` }}>
            {activeCraft.giTag}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', fontSize: 'var(--fs-xs)', color: 'var(--color-primary-light)', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={13} /> {activeCraft.village}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ShieldCheck size={13} color="var(--color-success)" /> Legacy: {activeCraft.artisan}
          </div>
        </div>

        <p style={{ color: 'var(--color-text)', fontSize: 'var(--fs-xs)', lineHeight: 1.5 }}>
          {activeCraft.desc}
        </p>

        <div style={{ background: 'var(--color-surface3)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-xs)' }}>
          🛍️ <strong style={{ color: 'var(--color-warning)' }}>Authenticity Verification:</strong> {activeCraft.buyTips}
        </div>
      </div>
    </div>
  )
}
