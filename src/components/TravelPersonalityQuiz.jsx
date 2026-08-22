import { useState } from 'react'
import { Sparkles, Compass, CheckCircle2, ArrowRight, RotateCcw, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const QUESTIONS = [
  {
    title: 'What is your primary travel vibe?',
    options: [
      { label: 'Royal Architecture & Historic Pols', score: 'heritage', icon: '🕌' },
      { label: 'Raw Wildlife Safaris & Nature Trails', score: 'wildlife', icon: '🦁' },
      { label: 'Street Food Markets & Culture', score: 'food', icon: '🍱' },
      { label: 'Peaceful Ocean Sunsets & Temples', score: 'coastal', icon: '🌊' }
    ]
  },
  {
    title: 'Who are you traveling with on this journey?',
    options: [
      { label: 'Solo Explorer', score: 'any', icon: '🎒' },
      { label: 'Romantic Couple Getaway', score: 'any', icon: '💑' },
      { label: 'Family & Kids', score: 'any', icon: '👨‍👩‍👧' },
      { label: 'Group of Friends', score: 'any', icon: '🎉' }
    ]
  }
]

const PERSONAS = {
  'heritage': {
    title: '👑 Royal Heritage Connoisseur',
    circuit: 'UNESCO Ahmedabad → Modhera Sun Temple → Rani ki Vav Patan',
    desc: 'You appreciate intricate stepwell architecture, Solanki dynasty carved temples, and centuries-old wooden pol lanes.',
    coverColor: '#F59E0B'
  },
  'wildlife': {
    title: '🦁 Wildlife & Safari Pioneer',
    circuit: 'Sasan Gir Lion Safari → Velavadar Blackbuck Park → Kutch Salt Desert',
    desc: 'You thrive on open jeep tracks, birdwatching in scrub forests, and capturing apex predators in their natural habitat.',
    coverColor: '#10B981'
  },
  'food': {
    title: '🍱 Culinary & Street Gourmet Explorer',
    circuit: 'Manek Chowk Night Market → Surat Locho Trails → Kathiyawadi Dhaba Tour',
    desc: 'Your travel revolves around legendary street recipes, fresh white butter with bajra rotlo, and grand royal thalis.',
    coverColor: '#EC4899'
  },
  'coastal': {
    title: '🌊 Coastal Shore & Spiritual Seeker',
    circuit: 'Somnath Shore Temple → Dwarkadhish Mandir → Shivrajpur Blue Flag Beach',
    desc: 'You seek spiritual tranquility, majestic evening seaside aartis, and serene blue flag beach sunsets.',
    coverColor: '#06B6D4'
  }
}

export default function TravelPersonalityQuiz() {
  const navigate = useNavigate()
  const { dispatch, showToast, user } = useApp()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedScores, setSelectedScores] = useState([])
  const [result, setResult] = useState(null)

  const handleSelect = (score) => {
    const nextScores = [...selectedScores, score]
    setSelectedScores(nextScores)

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Calculate persona based on first answer
      const primaryVibe = nextScores[0] || 'heritage'
      setResult(PERSONAS[primaryVibe] || PERSONAS['heritage'])
    }
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setSelectedScores([])
    setResult(null)
  }

  const handleCreateFromPersona = () => {
    if (!result) return

    const newTrip = {
      id: `trip-${Date.now()}`,
      userId: user?.id || 'demo-user',
      name: `${result.title} Expedition`,
      description: result.desc,
      startDate: '2026-11-15',
      endDate: '2026-11-22',
      totalBudget: 1100,
      coverColor: result.coverColor,
      isPublic: true,
      stops: [
        { cityId: 'city-1', cityName: 'Ahmedabad', emoji: '🕌', startDate: '2026-11-15', endDate: '2026-11-18', accommodation: 'Heritage Haveli Hotel', accommodationCost: 85, transportCost: 25, activities: [
          { id: 'q-act-1', name: 'Pol Heritage Architecture Walk', scheduledDate: '2026-11-16', time: '08:30', cost: 15, emoji: '🚶' }
        ]},
        { cityId: 'city-4', cityName: 'Gir National Park', emoji: '🦁', startDate: '2026-11-19', endDate: '2026-11-22', accommodation: 'Sasan Jungle Lodge', accommodationCost: 110, transportCost: 40, activities: [
          { id: 'q-act-2', name: 'Open Gypsy Asiatic Lion Safari', scheduledDate: '2026-11-20', time: '06:00', cost: 60, emoji: '🚙' }
        ]}
      ],
      createdAt: new Date().toISOString()
    }

    dispatch({ type: 'ADD_TRIP', payload: newTrip })
    showToast(`Generated "${newTrip.name}"!`, 'success')
    navigate(`/trips/${newTrip.id}/view`)
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Compass size={20} color="var(--color-primary)" />
            Travel Personality & Vibe Matcher
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Take a 10-second quiz to generate your tailored dream journey
          </p>
        </div>

        {result && (
          <button className="btn btn-ghost btn-sm" onClick={resetQuiz}>
            <RotateCcw size={13} /> Retake Quiz
          </button>
        )}
      </div>

      {!result ? (
        <div>
          <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-primary-light)' }}>
            Step {currentStep + 1} of {QUESTIONS.length}: {QUESTIONS[currentStep].title}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            {QUESTIONS[currentStep].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(opt.score)}
                style={{
                  padding: 'var(--space-4)',
                  background: 'var(--color-surface2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                <span style={{ fontSize: '1.8rem' }}>{opt.icon}</span>
                <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--color-text)' }}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          background: 'var(--color-surface2)',
          border: `1.5px solid ${result.coverColor}`,
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          animation: 'fadeIn 250ms both'
        }}>
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Your Travel Match</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-xl)', fontWeight: 800, color: result.coverColor }}>
                {result.title}
              </h4>
            </div>
            <span className="badge badge-success">✨ 98% Match Score</span>
          </div>

          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.5 }}>
            {result.desc}
          </div>

          <div style={{ background: 'var(--color-surface3)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-xs)' }}>
            📍 <strong style={{ color: 'var(--color-warning)' }}>Recommended Route:</strong> {result.circuit}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <button className="btn btn-primary btn-sm" onClick={handleCreateFromPersona}>
              Generate This Custom Trip <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
