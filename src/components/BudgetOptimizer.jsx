import { useState } from 'react'
import { Sparkles, DollarSign, ArrowDownRight, CheckCircle2, TrendingDown, Zap, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function BudgetOptimizer({ trip, onApplySavings }) {
  const { formatPrice, showToast } = useApp()
  const [applied, setApplied] = useState({})

  const totalCost = trip?.stops?.reduce((total, s) => {
    const nights = Math.max(0, Math.ceil((new Date(s.endDate)-new Date(s.startDate))/(1000*60*60*24)))
    return total + (s.accommodationCost*nights) + (s.transportCost||0) + (s.activities?.reduce((a,act)=>a+(act.cost||0),0)||0)
  }, 0) || 0

  const SUGGESTIONS = [
    {
      id: 'opt-1',
      title: 'Boutique Heritage Stay Saver',
      description: 'Switch to vetted boutique heritage homestays across Gujarat stops',
      saving: 85,
      icon: '🏨',
      category: 'Accommodation'
    },
    {
      id: 'opt-2',
      title: 'Vande Bharat High-Speed Rail Pass',
      description: 'Replace private cab rental with fast executive train transit between cities',
      saving: 60,
      icon: '🚆',
      category: 'Transit'
    },
    {
      id: 'opt-3',
      title: 'Early Bird Combined Monument Pass',
      description: 'Bundle ASI heritage monuments (Adalaj, Modhera Sun Temple, Rani ki Vav)',
      saving: 25,
      icon: '🎟️',
      category: 'Activities'
    }
  ]

  const totalPotentialSavings = SUGGESTIONS.reduce((acc, s) => acc + s.saving, 0)

  const handleApply = (s) => {
    setApplied(prev => ({ ...prev, [s.id]: true }))
    showToast(`Applied ${s.title}! Saved ${formatPrice(s.saving)}.`, 'success')
  }

  const handleApplyAll = () => {
    const all = {}
    SUGGESTIONS.forEach(s => { all[s.id] = true })
    setApplied(all)
    showToast(`Optimized trip! Total savings: ${formatPrice(totalPotentialSavings)}`, 'success')
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)', position: 'relative' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} color="var(--color-warning)" />
            AI Smart Budget Optimizer
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Intelligent recommendations to maximize value without compromising travel comfort
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={handleApplyAll}>
          <Zap size={13} /> Optimize All ({formatPrice(totalPotentialSavings)} Off)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        {SUGGESTIONS.map(s => {
          const isDone = !!applied[s.id]
          return (
            <div
              key={s.id}
              style={{
                padding: 'var(--space-4)',
                background: isDone ? 'var(--color-success-bg)' : 'var(--color-surface2)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${isDone ? 'var(--color-success)' : 'var(--color-border)'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div>
                <div className="flex-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                  <span className="badge badge-success" style={{ fontWeight: 700 }}>
                    Save {formatPrice(s.saving)}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', marginBottom: 2 }}>
                  {s.title}
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', lineHeight: 1.4 }}>
                  {s.description}
                </p>
              </div>

              <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-faint)', textTransform: 'uppercase' }}>
                  {s.category}
                </span>
                <button
                  className={`btn btn-sm ${isDone ? 'btn-ghost' : 'btn-secondary'}`}
                  style={{ fontSize: '11px', padding: '3px 10px' }}
                  onClick={() => handleApply(s)}
                  disabled={isDone}
                >
                  {isDone ? <><CheckCircle2 size={12} color="var(--color-success)" /> Applied</> : 'Apply Saver'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
