import { useState } from 'react'
import { Shirt, Sun, Wind, CloudRain, Sparkles, CheckCircle2 } from 'lucide-react'

const OUTFIT_RECOMMENDATIONS = {
  'Rann of Kutch': {
    day: 'Light breathable cottons, wide-brim sunhat, UV sunglasses',
    night: 'Warm windproof jacket / Kutchi embroidered shawl (desert nights drop to 12°C)',
    footwear: 'Closed-toe comfortable walking sneakers / sand slip-ons',
    icon: '🌌'
  },
  'Gir National Park': {
    day: 'Earth-toned camouflage (khaki, olive green, brown) to avoid startling wildlife',
    night: 'Morning safari windbreaker & muffler (open gypsy breeze is very chilly at 6 AM)',
    footwear: 'Sturdy safari shoes / trail trainers',
    icon: '🦁'
  },
  'Ahmedabad': {
    day: 'Comfortable cotton kurtas / t-shirts for heritage stepwell and pol walks',
    night: 'Casual evening wear for Manek Chowk night street food exploration',
    footwear: 'Slip-off sandals (convenient for stepwells & mosques)',
    icon: '🕌'
  },
  'Somnath & Dwarka': {
    day: 'Modest traditional Indian attire (Kurta-Pyjama / Salwar Kameez / Sarees)',
    night: 'Light sea-breeze cardigan for evening aarti on the coastal promenade',
    footwear: 'Easy-to-remove temple slippers (barefoot required inside inner sanctum)',
    icon: '🛕'
  }
}

export default function PackingWeatherAI() {
  const [dest, setDest] = useState('Rann of Kutch')
  const rec = OUTFIT_RECOMMENDATIONS[dest] || OUTFIT_RECOMMENDATIONS['Rann of Kutch']

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shirt size={20} color="var(--color-primary)" />
            Weather-Smart Outfit & Packing Intelligence
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Climate-adapted day & night clothing recommendations for Western India circuits
          </p>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {Object.keys(OUTFIT_RECOMMENDATIONS).map(d => (
            <button
              key={d}
              onClick={() => setDest(d)}
              className={`chip ${dest === d ? 'active' : ''}`}
              style={{ fontSize: '10px', padding: '3px 8px' }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-warning)', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <Sun size={14} /> Daytime Outfits
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
            {rec.day}
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-info)', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <Wind size={14} /> Evening / Early Morning
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
            {rec.night}
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-success)', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <CheckCircle2 size={14} /> Recommended Footwear
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
            {rec.footwear}
          </div>
        </div>
      </div>
    </div>
  )
}
