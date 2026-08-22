import { useState } from 'react'
import { BookOpen, Sparkles, Heart, Shield, HelpCircle, CheckCircle2 } from 'lucide-react'

const ETIQUETTE_TOPICS = [
  {
    category: '🛕 Temple Etiquette & Sacred Sites',
    tips: [
      'Always remove footwear before entering the temple courtyard or stepwell sanctum.',
      'Dress modestly with shoulders and knees covered (avoid sleeveless tops or short pants).',
      'Walk in a clockwise direction (Pradakshina) around the inner deity shrine.',
      'Photography is strictly prohibited inside the sanctum sanctorum of Somnath & Dwarkadhish.'
    ]
  },
  {
    category: '🍛 Dining & Gujarati Thali Traditions',
    tips: [
      'Traditional Gujarati Thalis are unlimited — servers will generously offer refills with a smile.',
      'Leaving excessive food on the plate is considered disrespectful to Annapurna (goddess of food).',
      'Wash hands before and after meals; eating with the right hand is traditional and customary.',
      'Gujarat is predominantly vegetarian with world-renowned pure vegetarian cuisine.'
    ]
  },
  {
    category: '🛍️ Shopping & Artisan Market Etiquette',
    tips: [
      'In street markets like Law Garden & Bhujodi, polite friendly bargaining (10-20%) is normal.',
      'When purchasing authentic GI-tagged Rogan art or Patan Patola, respect the artisan\'s fixed pricing as these are master crafts taking months to weave.',
      'Always greet shopkeepers with a friendly "Namaste" or "Kem cho?".'
    ]
  },
  {
    category: '🦁 Wildlife Safari Ethics (Gir Forest)',
    tips: [
      'Maintain strict silence inside the Gypsy vehicle to avoid startling Asiatic Lions.',
      'Wear neutral, muted tones (khaki, olive green, brown). Bright neon colors are discouraged.',
      'Flash photography is strictly prohibited. Keep phone ringers on silent.',
      'Do not throw plastic, water bottles, or food packets in the national park buffer zones.'
    ]
  }
]

export default function LocalEtiquetteAI() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={20} color="var(--color-primary)" />
            Local Culture, Customs & Travel Etiquette Guide
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Essential cultural respect guidelines for temples, Thali dining, markets, and wildlife safaris
          </p>
        </div>
        <span className="badge badge-primary">🤝 Respectful Travel</span>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-4)',
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none'
      }}>
        {ETIQUETTE_TOPICS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`chip ${activeTab === idx ? 'active' : ''}`}
            style={{ fontSize: '11px', whiteSpace: 'nowrap', padding: '6px 12px' }}
          >
            {item.category.split(' ')[0]} {item.category.split(' ').slice(1, 3).join(' ')}
          </button>
        ))}
      </div>

      {/* Active Category Tips Box */}
      <div style={{
        background: 'var(--color-surface2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--color-primary-light)', marginBottom: 'var(--space-3)' }}>
          {ETIQUETTE_TOPICS[activeTab].category}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
          {ETIQUETTE_TOPICS[activeTab].tips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', background: 'var(--color-surface3)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <CheckCircle2 size={15} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.45 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
