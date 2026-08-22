import { useState } from 'react'
import { Award, Stamp, CheckCircle2, Sparkles, Trophy, BookOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'

const PASSPORT_STAMPS = [
  {
    id: 'st-amd',
    city: 'Ahmedabad',
    code: 'AMD · UNESCO',
    shape: 'circle',
    color: '#EF4444',
    date: 'OCT 2026',
    motto: 'HERITAGE CITY · GUJARAT',
    icon: '🕌'
  },
  {
    id: 'st-kut',
    city: 'Rann of Kutch',
    code: 'KUT · DHORDO',
    shape: 'hex',
    color: '#F59E0B',
    date: 'NOV 2026',
    motto: 'WHITE DESERT EXPEDITION',
    icon: '🎪'
  },
  {
    id: 'st-gir',
    city: 'Gir National Park',
    code: 'GIR · SASAN',
    shape: 'circle',
    color: '#10B981',
    date: 'DEC 2026',
    motto: 'ASIATIC LION SANCTUARY',
    icon: '🦁'
  },
  {
    id: 'st-sou',
    city: 'Statue of Unity',
    code: 'EKNR · 182M',
    shape: 'rect',
    color: '#06B6D4',
    date: 'JAN 2027',
    motto: 'IRON MAN OF INDIA',
    icon: '🗿'
  },
  {
    id: 'st-som',
    city: 'Somnath Temple',
    code: 'SOM · COAST',
    shape: 'circle',
    color: '#8B5CF6',
    date: 'FEB 2027',
    motto: 'SACRED JYOTIRLINGA',
    icon: '🛕'
  },
  {
    id: 'st-dwk',
    city: 'Dwarka Kingdom',
    code: 'DWK · GOMTI',
    shape: 'hex',
    color: '#EC4899',
    date: 'MAR 2027',
    motto: 'CHAR DHAM PILGRIMAGE',
    icon: '👑'
  }
]

export default function PassportStampsVault() {
  const { showToast } = useApp()
  const [stampedList, setStampedList] = useState({
    'st-amd': true,
    'st-kut': true,
    'st-gir': true
  })
  const [animatingId, setAnimatingId] = useState(null)

  const playStampThud = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(140, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.12)

      gain.gain.setValueAtTime(0.6, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    } catch {}
  }

  const handleStamp = (id, city) => {
    playStampThud()
    setAnimatingId(id)
    setStampedList(prev => {
      const next = { ...prev, [id]: !prev[id] }
      showToast(next[id] ? `Physical stamp inked for ${city}!` : `Stamp removed for ${city}`, 'info')
      return next
    })
    setTimeout(() => setAnimatingId(null), 400)
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={20} color="var(--color-primary)" />
            Official Traveler Passport Book & Visa Stamp Vault
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Click any entry visa to stamp and collect rubber-inked checkpoint memorabilia
          </p>
        </div>

        <span className="badge badge-primary">🛂 Official Travel Visa</span>
      </div>

      {/* Realistic Physical Passport Page */}
      <div style={{
        background: 'linear-gradient(135deg, #FBF8F1 0%, #EFE7DA 100%)',
        border: '3px dashed #A68A68',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: 'inset 0 0 20px rgba(139, 107, 74, 0.3), 0 10px 30px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        {/* Passport Watermark */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '7rem',
          opacity: 0.05,
          color: '#000',
          fontWeight: 900,
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          PASSPORT
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          {PASSPORT_STAMPS.map(stamp => {
            const isStamped = !!stampedList[stamp.id]
            const isAnimating = animatingId === stamp.id

            return (
              <div
                key={stamp.id}
                onClick={() => handleStamp(stamp.id, stamp.city)}
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: stamp.shape === 'circle' ? '50%' : stamp.shape === 'hex' ? '14px' : '8px',
                  border: `3px double ${isStamped ? stamp.color : '#C4B5A2'}`,
                  color: isStamped ? stamp.color : '#A89985',
                  background: isStamped ? `${stamp.color}0D` : 'transparent',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transform: isStamped ? (stamp.shape === 'circle' ? 'rotate(-6deg)' : 'rotate(4deg)') : 'none',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  opacity: isStamped ? 1 : 0.45,
                  userSelect: 'none',
                  boxShadow: isStamped ? `0 0 14px ${stamp.color}33` : 'none',
                  scale: isAnimating ? 0.92 : 1
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {stamp.code}
                </div>

                <div style={{ fontSize: '2rem', margin: '4px 0' }}>
                  {stamp.icon}
                </div>

                <div style={{ fontWeight: 800, fontSize: 'var(--fs-sm)', textTransform: 'uppercase' }}>
                  {stamp.city}
                </div>

                <div style={{ fontSize: '9px', fontWeight: 700, opacity: 0.85, marginTop: 2 }}>
                  ★ {stamp.motto} ★
                </div>

                <div style={{ fontSize: '10px', fontWeight: 900, marginTop: 4, letterSpacing: '0.05em' }}>
                  {stamp.date}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
