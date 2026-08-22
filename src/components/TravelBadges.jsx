import { useState } from 'react'
import { Award, Star, Trophy, Sparkles, CheckCircle2, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'

const ALL_BADGES = [
  {
    id: 'badge-1',
    title: '🦁 Gir Lion Tracker',
    desc: 'Added Sasan Gir National Park or Asiatic Lion Safari to a trip',
    icon: '🦁',
    color: '#10B981',
    check: (trips) => trips.some(t => t.stops?.some(s => s.cityName?.includes('Gir')))
  },
  {
    id: 'badge-2',
    title: '🕌 UNESCO Heritage Scholar',
    desc: 'Planned a visit to Ahmedabad Heritage Pols or Modhera Sun Temple',
    icon: '🕌',
    color: '#F59E0B',
    check: (trips) => trips.some(t => t.stops?.some(s => s.cityName?.includes('Ahmedabad') || s.cityName?.includes('Patan')))
  },
  {
    id: 'badge-3',
    title: '🎪 White Desert Nomad',
    desc: 'Added Great Rann of Kutch stargazing or tent city stay',
    icon: '🎪',
    color: '#38BDF8',
    check: (trips) => trips.some(t => t.stops?.some(s => s.cityName?.includes('Kutch')))
  },
  {
    id: 'badge-4',
    title: '✈️ Master Globetrotter',
    desc: 'Created 3 or more multi-city travel itineraries',
    icon: '✈️',
    color: '#6C63FF',
    check: (trips) => trips.length >= 3
  },
  {
    id: 'badge-5',
    title: '🌿 Eco-Conscious Voyager',
    desc: 'Calculated and checked route carbon emission savings',
    icon: '🌿',
    color: '#84CC16',
    check: (trips) => trips.length >= 1
  },
  {
    id: 'badge-6',
    title: '🍱 Gourmet Street Foodie',
    desc: 'Explored regional delicacies in the Cuisine Guide',
    icon: '🍱',
    color: '#EC4899',
    check: (trips) => trips.some(t => t.stops?.some(s => s.cityName?.includes('Surat') || s.cityName?.includes('Ahmedabad')))
  }
]

export default function TravelBadges() {
  const { trips, user } = useApp()
  const userTrips = trips.filter(t => t.userId === user?.id || t.userId === 'user-1' || t.userId === 'user-2')

  const earnedCount = ALL_BADGES.filter(b => b.check(userTrips)).length
  const progressPct = Math.round((earnedCount / ALL_BADGES.length) * 100)

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trophy size={20} color="var(--color-warning)" />
            Explorer Badges & Travel Milestones
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Unlock achievements by exploring heritage, wildlife, and multi-city circuits
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="badge badge-warning" style={{ fontWeight: 800 }}>
            Level {Math.max(1, Math.floor(earnedCount * 1.5))}: {earnedCount >= 4 ? 'Master Voyager' : 'Active Explorer'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 'var(--space-5)', background: 'var(--color-surface2)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <div className="flex-between" style={{ marginBottom: 6, fontSize: 'var(--fs-xs)' }}>
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Milestone Progress:</span>
          <strong style={{ color: 'var(--color-primary-light)' }}>{earnedCount} of {ALL_BADGES.length} Unlocked ({progressPct}%)</strong>
        </div>
        <div style={{ height: 8, background: 'var(--color-surface3)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--grad-primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Badges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        {ALL_BADGES.map(badge => {
          const unlocked = badge.check(userTrips)
          return (
            <div
              key={badge.id}
              style={{
                padding: 'var(--space-4)',
                background: unlocked ? 'var(--color-surface2)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${unlocked ? badge.color : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-lg)',
                opacity: unlocked ? 1 : 0.6,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: unlocked ? `${badge.color}22` : 'var(--color-surface3)',
                border: `1px solid ${unlocked ? badge.color : 'var(--color-border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                flexShrink: 0
              }}>
                {badge.icon}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: unlocked ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                    {badge.title}
                  </div>
                  {unlocked ? <CheckCircle2 size={13} color="var(--color-success)" /> : <Lock size={12} color="var(--color-text-faint)" />}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.35 }}>
                  {badge.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
