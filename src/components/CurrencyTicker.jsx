import { DollarSign, ArrowRightLeft, TrendingUp } from 'lucide-react'
import { useApp, CURRENCIES } from '../context/AppContext'

export default function CurrencyTicker() {
  const { currency, setCurrency, formatPrice } = useApp()

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-3) var(--space-5)',
      marginBottom: 'var(--space-6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--space-3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
        <TrendingUp size={14} color="var(--color-success)" />
        <span style={{ color: 'var(--color-text)' }}>Live FX Rates (Base $1 USD):</span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(CURRENCIES).map(([code, data]) => {
          const isActive = currency === code
          return (
            <button
              key={code}
              onClick={() => setCurrency(code)}
              style={{
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: isActive ? 'var(--color-primary-glow)' : 'var(--color-surface2)',
                border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                color: isActive ? 'var(--color-primary-light)' : 'var(--color-text)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              title={`Switch to ${data.name}`}
            >
              <strong>{data.symbol} 1 =</strong> {data.rate} {code}
            </button>
          )
        })}
      </div>
    </div>
  )
}
