import { useState, useEffect } from 'react'
import { Sparkles, ChevronLeft, ChevronRight, MapPin, Camera, Star } from 'lucide-react'

const GALLERY_ITEMS = [
  {
    title: 'Great Rann of Kutch',
    location: 'Dhordo, Kutch, Gujarat',
    image: '/destinations/rann_of_kutch.jpg',
    fallbackGrad: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
    caption: 'Sunset camel caravan across the infinite white salt plains of Dhordo.',
    stamp: 'KUTCH · DESERT SAFARI',
    stampColor: '#F59E0B',
    tag: 'White Desert'
  },
  {
    title: 'Asiatic Lions in Sasan Gir',
    location: 'Gir Forest National Park, Gujarat',
    image: '/destinations/gir_lions.jpg',
    fallbackGrad: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #059669 100%)',
    caption: 'Majestic Asiatic Lion resting proudly in the golden teak forest sanctuary.',
    stamp: 'GIR FOREST · WILD RESERVE',
    stampColor: '#10B981',
    tag: 'Wildlife Safari'
  },
  {
    title: 'Statue of Unity & Narmada',
    location: 'Ekta Nagar, Kevadia, Gujarat',
    image: '/destinations/statue_of_unity.jpg',
    fallbackGrad: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #3B82F6 100%)',
    caption: '182-meter monumental colossus overlooking the Sardar Sarovar reservoir.',
    stamp: 'UNITY · 182 METERS',
    stampColor: '#06B6D4',
    tag: 'World Record'
  },
  {
    title: 'Somnath Shore Temple',
    location: 'Prabhas Patan, Veraval, Gujarat',
    image: '/destinations/somnath_temple.jpg',
    fallbackGrad: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 50%, #7C3AED 100%)',
    caption: 'Ancient Jyotirlinga shrine standing resilient against crashing Arabian Sea waves.',
    stamp: 'SOMNATH · JYOTIRLINGA',
    stampColor: '#8B5CF6',
    tag: 'Ocean Temple'
  },
  {
    title: 'Dwarkadhish Jagat Mandir',
    location: 'Dwarka Coast, Gujarat',
    image: '/destinations/dwarka_temple.jpg',
    fallbackGrad: 'linear-gradient(135deg, #831843 0%, #BE185D 50%, #DB2777 100%)',
    caption: '5-story ancient temple spire on Gomti Ghat with 52-yard sacred flag.',
    stamp: 'DWARKA · CHAR DHAM',
    stampColor: '#EC4899',
    tag: 'Sacred Kingdom'
  }
]

export default function SkeuoPhotoGallery() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [imgError, setImgError] = useState({})

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
        background: 'var(--grad-card)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--skeuo-shadow-card)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-xl)', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary-light)' }}>
            <Camera size={22} color="var(--color-primary-light)" />
            Authentic Gujarat Travel Gallery & Highlights
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Real photographic memories & highlights with vintage traveler passport stamps
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
        transform: 'rotate(-0.5deg)',
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
          background: 'rgba(255, 245, 205, 0.75)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          zIndex: 10
        }} />

        {/* Photo Canvas */}
        <div style={{
          position: 'relative',
          height: 380,
          borderRadius: 4,
          overflow: 'hidden',
          background: item.fallbackGrad,
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.2)'
        }}>
          {!imgError[item.title] ? (
            <img
              src={item.image}
              alt={item.title}
              onError={() => setImgError(prev => ({ ...prev, [item.title]: true }))}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s ease'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              padding: 20,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '4rem', marginBottom: 12 }}>🌅</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{item.title}</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>{item.location}</p>
            </div>
          )}

          {/* Photo Gloss Highlight */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)',
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
            background: 'rgba(0,0,0,0.7)',
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
              <MapPin size={12} color="var(--color-primary)" /> {item.location}
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
