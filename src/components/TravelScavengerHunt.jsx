import { useState } from 'react'
import { Camera, CheckSquare, Square, Trophy, Sparkles, Award, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'

const QUESTS = [
  {
    id: 'q1',
    title: 'Full Moon on White Rann',
    desc: 'Walk barefoot on the white salt crystals under starlit skies in Dhordo, Kutch',
    location: 'Rann of Kutch',
    icon: '🌕',
    points: 100
  },
  {
    id: 'q2',
    title: 'Asiatic Lion Sighting in Gir',
    desc: 'Capture an authentic photo of a wild Asiatic Lion during a morning gypsy safari',
    location: 'Sasan Gir',
    icon: '🦁',
    points: 150
  },
  {
    id: 'q3',
    title: 'Heritage Pol Walk & Secret Passages',
    desc: 'Explore the carved wooden bird-feeders (Chabutras) and hidden pols of Old Ahmedabad',
    location: 'Ahmedabad',
    icon: '🕌',
    points: 80
  },
  {
    id: 'q4',
    title: 'Sunday Morning Fafda-Jalebi Ritual',
    desc: 'Eat crispy besan fafda with hot jalebi and spicy papaya chutney at an iconic food joint',
    location: 'Ahmedabad / Surat',
    icon: '🥨',
    points: 60
  },
  {
    id: 'q5',
    title: 'Evening Somnath Sea Aarti',
    desc: 'Listen to sacred conch shells and ocean waves during sunset Aarti at Somnath Temple',
    location: 'Somnath',
    icon: '🌅',
    points: 120
  },
  {
    id: 'q6',
    title: 'Blue Flag Beach Walk in Shivrajpur',
    desc: 'Dip your toes in the crystal blue waters of Shivrajpur Beach near Dwarka',
    location: 'Dwarka',
    icon: '🌊',
    points: 90
  }
]

export default function TravelScavengerHunt() {
  const { showToast } = useApp()
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('gt_scavenger')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const toggleQuest = (id) => {
    const willBeDone = !completed[id]
    const next = { ...completed, [id]: willBeDone }
    setCompleted(next)
    localStorage.setItem('gt_scavenger', JSON.stringify(next))
    if (willBeDone) {
      showToast('Quest milestone achieved! +Points added to Explorer Profile 🎉', 'success')
    }
  }

  const completedCount = Object.values(completed).filter(Boolean).length
  const totalScore = QUESTS.reduce((acc, q) => acc + (completed[q.id] ? q.points : 0), 0)

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Camera size={20} color="var(--color-primary)" />
            Gujarat Explorer Scavenger Hunt & Photo Quests
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Complete iconic travel milestones, discover hidden secrets, and earn explorer points
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="badge badge-warning" style={{ fontWeight: 800 }}>
            <Trophy size={13} /> {totalScore} Explorer Pts
          </span>
          <span className="badge badge-primary">
            {completedCount} / {QUESTS.length} Quests Completed
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
        {QUESTS.map(q => {
          const isDone = !!completed[q.id]
          return (
            <div
              key={q.id}
              onClick={() => toggleQuest(q.id)}
              style={{
                padding: 'var(--space-4)',
                background: isDone ? 'var(--color-success-bg)' : 'var(--color-surface2)',
                border: `1.5px solid ${isDone ? 'var(--color-success)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>{q.icon}</span>

              <div style={{ flex: 1 }}>
                <div className="flex-between" style={{ marginBottom: 2 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: isDone ? 'var(--color-success)' : 'var(--color-text)', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {q.title}
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--color-warning)', fontWeight: 700 }}>
                    +{q.points} pts
                  </span>
                </div>

                <div style={{ fontSize: '10px', color: 'var(--color-primary-light)', fontWeight: 600, marginBottom: 4 }}>
                  📍 {q.location}
                </div>

                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', lineHeight: 1.35 }}>
                  {q.desc}
                </p>
              </div>

              <div style={{ color: isDone ? 'var(--color-success)' : 'var(--color-text-faint)', marginTop: 2 }}>
                {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
