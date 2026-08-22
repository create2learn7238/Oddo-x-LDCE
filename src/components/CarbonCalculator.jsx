import { Leaf, Award, Compass, Trees, CheckCircle2 } from 'lucide-react'

export default function CarbonCalculator({ stops = [] }) {
  if (!stops || stops.length === 0) return null

  // Estimated average emission per transit leg (in kg CO2)
  const stopCount = stops.length
  const estimatedDistKm = stopCount * 260
  const trainEmissions = Math.round(estimatedDistKm * 0.04) // ~40g CO2/km
  const flightEmissions = Math.round(estimatedDistKm * 0.24) // ~240g CO2/km
  const savedCo2 = flightEmissions - trainEmissions
  const treesNeeded = Math.max(1, Math.ceil(trainEmissions / 20))

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Leaf size={20} color="var(--color-success)" />
            Eco-Travel & Carbon Impact Analysis
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Estimated environmental footprint for this multi-city route
          </p>
        </div>
        <span className="badge badge-success">
          <Award size={12} /> Green Certified Route
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
        background: 'var(--color-surface2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        border: '1px solid var(--color-border)'
      }}>
        {/* Total Est CO2 */}
        <div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', marginBottom: 2 }}>
            Estimated Route Carbon Impact
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--color-success)' }}>
            ~{trainEmissions} kg CO₂
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 4 }}>
            Based on {estimatedDistKm} km multi-city transit
          </div>
        </div>

        {/* Train vs Air Savings */}
        <div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', marginBottom: 2 }}>
            Train / Ground Eco Savings
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--color-primary-light)' }}>
            -{savedCo2} kg CO₂
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 4 }}>
            Saved compared to regional air travel
          </div>
        </div>

        {/* Tree Offset Box */}
        <div style={{
          background: 'var(--color-surface3)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-success)', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <Trees size={14} /> Tree Neutralization
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4 }}>
            Planting <strong>{treesNeeded} native tree{treesNeeded > 1 ? 's' : ''}</strong> (such as Neem or Peepal) fully offsets this trip's lifetime emissions.
          </div>
        </div>
      </div>
    </div>
  )
}
