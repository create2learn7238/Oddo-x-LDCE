import { useState } from 'react'
import { Sliders, TrendingUp, Sparkles, DollarSign, Hotel, Car, Calendar, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function BudgetSimulator({ trip }) {
  const { formatPrice } = useApp()
  const [extraDays, setExtraDays] = useState(0)
  const [stayTier, setStayTier] = useState('boutique') // budget (0.7x), boutique (1.0x), luxury (1.8x)
  const [transitType, setTransitType] = useState('train') // train (0.8x), cab (1.3x), flight (2.0x)

  if (!trip) return null

  const baseCost = trip.stops?.reduce((total, s) => {
    const nights = Math.max(0, Math.ceil((new Date(s.endDate)-new Date(s.startDate))/(1000*60*60*24)))
    return total + (s.accommodationCost*nights) + (s.transportCost||0) + (s.activities?.reduce((a,act)=>a+(act.cost||0),0)||0)
  }, 0) || 0

  const stayMultiplier = stayTier === 'budget' ? 0.7 : stayTier === 'luxury' ? 1.8 : 1.0
  const transitMultiplier = transitType === 'train' ? 0.8 : transitType === 'cab' ? 1.3 : 2.0
  const extraCostPerDay = 65 * stayMultiplier

  const simulatedTotal = Math.round((baseCost * stayMultiplier * transitMultiplier * 0.5) + (baseCost * 0.5) + (extraDays * extraCostPerDay))
  const difference = simulatedTotal - baseCost

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={20} color="var(--color-primary)" />
            Interactive Trip Cost & What-If Simulator
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Simulate itinerary extensions, luxury hotel upgrades, and transit choices in real-time
          </p>
        </div>
        <span className="badge badge-primary">🔮 Real-Time Projection</span>
      </div>

      {/* Simulator Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-4)',
        background: 'var(--color-surface2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        border: '1px solid var(--color-border)',
        marginBottom: 'var(--space-5)'
      }}>
        {/* Extra Days Slider */}
        <div>
          <div className="flex-between" style={{ marginBottom: 6, fontSize: 'var(--fs-xs)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={13} color="var(--color-primary-light)" />
              Extend Trip Days:
            </span>
            <strong>+{extraDays} Day{extraDays !== 1 ? 's' : ''}</strong>
          </div>
          <input
            type="range"
            min="0"
            max="7"
            value={extraDays}
            onChange={e => setExtraDays(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
          />
        </div>

        {/* Accommodation Tier */}
        <div>
          <div style={{ fontSize: 'var(--fs-xs)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Hotel size={13} color="var(--color-warning)" />
            Stay Tier Upgrade:
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'budget', label: 'Budget (-30%)' },
              { id: 'boutique', label: 'Standard' },
              { id: 'luxury', label: '5-Star (+80%)' }
            ].map(tier => (
              <button
                key={tier.id}
                onClick={() => setStayTier(tier.id)}
                className={`chip ${stayTier === tier.id ? 'active' : ''}`}
                style={{ fontSize: '10px', padding: '3px 8px' }}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transit Mode */}
        <div>
          <div style={{ fontSize: 'var(--fs-xs)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Car size={13} color="var(--color-info)" />
            Transit Mode:
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'train', label: 'Train / Rail' },
              { id: 'cab', label: 'Private Cab' },
              { id: 'flight', label: 'Flight' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTransitType(t.id)}
                className={`chip ${transitType === t.id ? 'active' : ''}`}
                style={{ fontSize: '10px', padding: '3px 8px' }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projected Comparison Box */}
      <div style={{
        background: 'var(--color-surface3)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4) var(--space-5)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-3)'
      }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Simulated Projected Total</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--color-warning)', lineHeight: 1.1 }}>
            {formatPrice(simulatedTotal)}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: difference >= 0 ? 'var(--color-danger)' : 'var(--color-success)', marginTop: 4 }}>
            {difference === 0 ? 'Exact matches current itinerary plan' : difference > 0 ? `+${formatPrice(difference)} estimated increase` : `${formatPrice(difference)} estimated savings`}
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
          <div>Base Itinerary: <strong>{formatPrice(baseCost)}</strong></div>
          <div>Avg Per Day: <strong>{formatPrice(Math.round(simulatedTotal / Math.max(1, (trip.stops?.length || 1) + extraDays)))}</strong></div>
        </div>
      </div>
    </div>
  )
}
