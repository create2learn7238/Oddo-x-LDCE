import { useState } from 'react'
import { Users, DollarSign, Calculator, Split, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ExpenseSplitter({ grandTotal = 0 }) {
  const { formatPrice } = useApp()
  const [travelers, setTravelers] = useState(2)
  const [tipPercent, setTipPercent] = useState(5) // emergency / buffer buffer

  const bufferAmount = (grandTotal * tipPercent) / 100
  const adjustedTotal = grandTotal + bufferAmount
  const perPerson = travelers > 0 ? Math.round(adjustedTotal / travelers) : 0

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Split size={20} color="var(--color-primary)" />
            Group Travel Expense Splitter
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Calculate individual shares and buffer funds for group and couple journeys
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-5)',
        background: 'var(--color-surface2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        border: '1px solid var(--color-border)',
        alignItems: 'center'
      }}>
        {/* Travelers Count Control */}
        <div>
          <label className="form-label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={14} color="var(--color-primary-light)" />
            Number of Travelers: <strong style={{ color: 'var(--color-text)' }}>{travelers} {travelers === 1 ? 'Person' : 'People'}</strong>
          </label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5, 6, 8].map(num => (
              <button
                key={num}
                onClick={() => setTravelers(num)}
                className={`chip ${travelers === num ? 'active' : ''}`}
                style={{ padding: '4px 12px' }}
              >
                {num} {num === 1 ? 'Solo' : num === 2 ? 'Couple' : `${num} Group`}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Contingency Buffer */}
        <div>
          <label className="form-label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calculator size={14} color="var(--color-warning)" />
            Emergency / Contingency Buffer: <strong style={{ color: 'var(--color-warning)' }}>{tipPercent}%</strong>
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 5, 10, 15].map(pct => (
              <button
                key={pct}
                onClick={() => setTipPercent(pct)}
                className={`chip ${tipPercent === pct ? 'active' : ''}`}
              >
                {pct === 0 ? 'None' : `+${pct}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Output Calculation Result */}
        <div style={{
          background: 'var(--color-surface3)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          textAlign: 'center',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', marginBottom: 2 }}>
            Cost Per Person ({travelers} travelers)
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-2xl)',
            fontWeight: 800,
            color: 'var(--color-success)',
            lineHeight: 1.2
          }}>
            {formatPrice(perPerson)}
          </div>
          {tipPercent > 0 && (
            <div style={{ fontSize: '10px', color: 'var(--color-text-faint)', marginTop: 4 }}>
              Includes {formatPrice(bufferAmount)} total emergency buffer
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
