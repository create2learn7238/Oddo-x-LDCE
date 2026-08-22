import { useState } from 'react'
import { Luggage, Scale, AlertTriangle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'

export default function BaggageEstimator() {
  const [weights, setWeights] = useState({
    clothes: 4.5,
    electronics: 2.2,
    toiletries: 1.2,
    footwear: 1.8,
    souvenirs: 1.0
  })
  const [allowance, setAllowance] = useState(15) // 15kg domestic | 23kg international | 7kg cabin

  const totalWeight = Object.values(weights).reduce((a, b) => a + Number(b), 0).toFixed(1)
  const isOverweight = Number(totalWeight) > allowance
  const remaining = (allowance - Number(totalWeight)).toFixed(1)

  const updateWeight = (category, val) => {
    setWeights(prev => ({ ...prev, [category]: Math.max(0, parseFloat(val) || 0) }))
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Scale size={20} color="var(--color-warning)" />
            Smart Luggage & Baggage Weight Estimator
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Estimate total bag weight and avoid excess airport check-in fees
          </p>
        </div>

        {/* Airline Allowance Presets */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { label: 'Cabin (7 kg)', val: 7 },
            { label: 'Domestic (15 kg)', val: 15 },
            { label: 'International (23 kg)', val: 23 }
          ].map(p => (
            <button
              key={p.val}
              onClick={() => setAllowance(p.val)}
              className={`chip ${allowance === p.val ? 'active' : ''}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Box */}
      <div style={{
        padding: 'var(--space-4) var(--space-5)',
        background: isOverweight ? 'var(--color-danger-bg)' : 'var(--color-surface2)',
        border: `1px solid ${isOverweight ? 'var(--color-danger)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--radius-md)',
            background: isOverweight ? 'var(--color-danger)' : 'var(--color-primary-glow)',
            color: isOverweight ? '#fff' : 'var(--color-primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Luggage size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 'var(--fs-xl)', color: isOverweight ? 'var(--color-danger)' : 'var(--color-text)' }}>
              {totalWeight} kg / {allowance} kg
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: isOverweight ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
              {isOverweight ? `⚠️ Over limit by ${(totalWeight - allowance).toFixed(1)} kg` : `✅ ${remaining} kg available for gifts & souvenirs`}
            </div>
          </div>
        </div>

        <span className={`badge ${isOverweight ? 'badge-danger' : 'badge-success'}`}>
          {isOverweight ? 'Excess Baggage Alert' : 'Within Airline Limits'}
        </span>
      </div>

      {/* Weight Controls Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
        {[
          { key: 'clothes', label: '👕 Clothes & Outfits', max: 12 },
          { key: 'footwear', label: '👟 Shoes & Sandals', max: 6 },
          { key: 'electronics', label: '💻 Laptop & Powerbanks', max: 6 },
          { key: 'toiletries', label: '🧴 Toiletries & Meds', max: 4 },
          { key: 'souvenirs', label: '🎁 Gifts & Snacks', max: 8 }
        ].map(item => (
          <div key={item.key} style={{ background: 'var(--color-surface3)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div className="flex-between" style={{ marginBottom: 4, fontSize: 'var(--fs-xs)' }}>
              <span>{item.label}</span>
              <strong>{weights[item.key]} kg</strong>
            </div>
            <input
              type="range"
              min="0"
              max={item.max}
              step="0.2"
              value={weights[item.key]}
              onChange={e => updateWeight(item.key, e.target.value)}
              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
