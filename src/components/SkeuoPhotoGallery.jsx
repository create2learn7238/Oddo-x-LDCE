import { useState, useEffect } from 'react'
import { Sparkles, ChevronLeft, ChevronRight, MapPin, Camera, Star } from 'lucide-react'

const GALLERY_ITEMS = [
  {
    title: 'Great Rann of Kutch',
    location: 'Dhordo, Kutch, Gujarat',
    image: 'https://images.unsplash.com/photo-1609137144822-79015c7e14d3?w=1000&auto=format&fit=crop&q=80',
    caption: 'Full-moon starlight reflecting off the boundless white salt crystals.',
    stamp: 'KUTCH · DESERT SAFARI',
    stampColor: '#F59E0B',
    tag: 'White Desert'
  },
  {
    title: 'Asiatic Lions in Sasan Gir',
    location: 'Gir Forest National Park, Gujarat',
    image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=1000&auto=format&fit=crop&q=80',
    caption: 'Majestic Asiatic Lioness patrolling her sanctuary in the golden morning light.',
    stamp: 'GIR FOREST · WILD RESERVE',
    stampColor: '#10B981',
    tag: 'Wildlife Safari'
  },
  {
    title: 'Statue of Unity & Narmada',
    location: 'Ekta Nagar, Kevadia, Gujarat',
    image: 'https://images.unsplash.com/photo-1629813352774-722a49b6f849?w=1000&auto=format&fit=crop&q=80',
    caption: '182-meter monumental colossus overlooking the Sardar Sarovar reservoir.',
    stamp: 'UNITY · 182 METERS',
    stampColor: '#06B6D4',
    tag: 'World Record'
  },
  {
    title: 'Adalaj Stepwell (Vav)',
    location: 'Adalaj, Gandhinagar, Gujarat',
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=1000&auto=format&fit=crop&q=80',
    caption: '5-story carved subterranean Solanki-era Indo-Islamic stone masterwork.',
    stamp: 'UNESCO · SOLANKI HERITAGE',
    stampColor: '#EC4899',
    tag: 'Ancient Architecture'
  },
  {
    title: 'Somnath Shore Temple',
    location: 'Prabhas Patan, Veraval, Gujarat',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1000&auto=format&fit=crop&q=80',
    caption: 'Sacred Jyotirlinga shrine standing resilient against crashing Arabian Sea waves.',
    stamp: 'SOMNATH · JYOTIRLINGA',
    stampColor: '#8B5CF6',
    tag: 'Ocean Temple'
  }
]

export default function SkeuoPhotoGallery() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const nextSlide = () => setCurrentIdx((prev) => (prev + 1) % GALLERY_ITEMS.length)
  const prevSlide = () => setCurrentIdx((prev) => (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)

  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [isHovered])

  const item = GALLERY_ITEMS[currentIdx]

  return (
    <div
      className="card"
      style={{
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-8)',
        background: 'linear-gradient(180deg, rgba(28, 24, 18, 0.95) 0%, rgba(16, 13, 10, 0.98) 100%)',
        border: '2px solid rgba(245, 158, 11, 0.25)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 0 20px rgba(0,0,0,0.8), 0 16px 48px -12px rgba(0,0,0,0.8)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-xl)', display: 'flex', alignItems: 'center', gap: 8, color: '#FBBF24', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
            <Camera size={22} color="#FBBF24" />
            Tactile Polaroid Travel Gallery & Highlights
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Realistic physical Polaroid film slides with vintage travel passport stamps
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={prevSlide} title="Previous Photo">
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', padding: '0 4px' }}>
            {currentIdx + 1} / {GALLERY_ITEMS.length}
          </span>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={nextSlide} title="Next Photo">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Physical Polaroid Frame */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 8,
        padding: '16px 16px 28px 16px',
        boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 12px 36px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        transform: 'rotate(-0.6deg)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative'
      }}>
        {/* Realistic Tape Accent */}
        <div style={{
          position: 'absolute',
          top: -12,
          left: '50%',
          transform: 'translateX(-50%) rotate(2deg)',
          width: 110,
          height: 26,
          background: 'rgba(255, 245, 205, 0.55)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          zIndex: 10
        }} />

        {/* Photo Canvas */}
        <div style={{
          position: 'relative',
          height: 380,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.2)'
        }}>
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease'
            }}
          />

          {/* Photo Gloss Highlight */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)',
            pointerEvents: 'none'
          }} />

          {/* Tag Overlay */}
          <div style={{
            position: 'absolute',
            top: 14,
            left: 14,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            color: '#FFF',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 700,
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
          }}>
            📍 {item.tag}
          </div>

          {/* Inked Passport Stamp Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            border: `2.5px solid ${item.stampColor}`,
            color: item.stampColor,
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            transform: 'rotate(-12deg)',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            boxShadow: `0 0 12px ${item.stampColor}44`,
            userSelect: 'none'
          }}>
            ✈️ {item.stamp}
          </div>
        </div>

        {/* Polaroid Handwritten Caption Area */}
        <div style={{ marginTop: 14, padding: '0 6px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h4 style={{ color: '#1A1D20', fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
              {item.title}
            </h4>
            <div style={{ fontSize: '12px', color: '#656D76', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <MapPin size={12} color="#D97706" /> {item.location}
            </div>
            <p style={{ color: '#4B5563', fontSize: '13px', fontStyle: 'italic', marginTop: 4 }}>
              "{item.caption}"
            </p>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {GALLERY_ITEMS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: currentIdx === i ? '#D97706' : '#D1D5DB',
                  boxShadow: currentIdx === i ? '0 0 6px #D97706' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
