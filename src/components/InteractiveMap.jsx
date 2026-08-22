import { useState } from 'react'
import { MapPin, Navigation, Compass, Layers, Globe, Sparkles } from 'lucide-react'

// Curated geographic coordinates for visual map plotting
const CITY_COORDS = {
  'Ahmedabad': { x: 38, y: 48, state: 'Gujarat', desc: 'UNESCO Heritage City & Sabarmati Riverfront' },
  'Rann of Kutch': { x: 22, y: 32, state: 'Gujarat', desc: 'White Salt Desert & Stargazing' },
  'Statue of Unity': { x: 50, y: 62, state: 'Gujarat', desc: "World's Tallest Monument (182m)" },
  'Gir National Park': { x: 28, y: 74, state: 'Gujarat', desc: 'Asiatic Lion Safari & Sasan Gir Forest' },
  'Somnath': { x: 22, y: 80, state: 'Gujarat', desc: 'Sacred Shore Temple on Arabian Sea' },
  'Dwarka': { x: 12, y: 56, state: 'Gujarat', desc: 'Ancient Krishna Kingdom & Shivrajpur Beach' },
  'Vadodara (Baroda)': { x: 46, y: 55, state: 'Gujarat', desc: 'Laxmi Vilas Palace & Art Heritage' },
  'Surat': { x: 44, y: 70, state: 'Gujarat', desc: 'Diamond City & Street Food Capital' },
  'Jaipur': { x: 52, y: 30, state: 'Rajasthan', desc: 'Pink City, Hawa Mahal & Amber Fort' },
  'Udaipur': { x: 42, y: 38, state: 'Rajasthan', desc: 'City of Lakes & Pichola Palace' },
  'Mumbai': { x: 42, y: 86, state: 'Maharashtra', desc: 'Gateway of India & Marine Drive' }
}

export default function InteractiveMap({ onSelectCity, selectedCity }) {
  const [hovered, setHovered] = useState(null)
  const [viewMode, setViewMode] = useState('gujarat') // gujarat | all

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)', position: 'relative' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Compass size={20} color="var(--color-primary)" />
            Interactive Geographic Pinpoint Map
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Click pins to explore destinations and plot seamless travel circuits
          </p>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setViewMode('gujarat')}
            className={`chip ${viewMode === 'gujarat' ? 'active' : ''}`}
          >
            🦁 Gujarat Circuit
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`chip ${viewMode === 'all' ? 'active' : ''}`}
          >
            🇮🇳 Western India
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 340,
        background: 'radial-gradient(ellipse at center, var(--color-surface2) 0%, var(--color-surface) 100%)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        {/* Animated Grid Background */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--color-primary)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
        </svg>

        {/* Dynamic Route Connecting Lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <path
            d="M 38% 48% L 22% 32% L 28% 74% L 50% 62% Z"
            fill="none"
            stroke="var(--color-primary-light)"
            strokeWidth="2"
            strokeDasharray="6,6"
            style={{ opacity: 0.6 }}
          />
        </svg>

        {/* City Pins */}
        {Object.entries(CITY_COORDS).map(([name, pos]) => {
          const isSelected = selectedCity === name
          const isHovered = hovered === name

          return (
            <div
              key={name}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelectCity && onSelectCity(name)}
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: isSelected || isHovered ? 20 : 10,
                transition: 'all var(--transition-fast)'
              }}
            >
              {/* Pulse Ring */}
              {(isSelected || isHovered) && (
                <div style={{
                  position: 'absolute',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--color-primary-glow)',
                  transform: 'translate(-30%, -30%)',
                  animation: 'pulse 1.5s infinite',
                  pointerEvents: 'none'
                }} />
              )}

              {/* Pin Icon Badge */}
              <div style={{
                background: isSelected ? 'var(--color-warning)' : isHovered ? 'var(--color-primary)' : 'var(--color-surface3)',
                color: isSelected ? '#000' : '#fff',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                border: `1.5px solid ${isSelected ? '#fff' : 'var(--color-border)'}`,
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '11px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                transform: isSelected || isHovered ? 'scale(1.12)' : 'scale(1)',
                transition: 'all var(--transition-fast)'
              }}>
                <MapPin size={11} />
                {name}
              </div>
            </div>
          )
        })}

        {/* Hover Inspect Card */}
        {hovered && CITY_COORDS[hovered] && (
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            right: 12,
            background: 'rgba(16, 16, 36, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            animation: 'fadeIn 150ms both',
            zIndex: 30
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--color-primary-light)' }}>
                📍 {hovered}, {CITY_COORDS[hovered].state}
              </div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
                {CITY_COORDS[hovered].desc}
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onSelectCity && onSelectCity(hovered)}
            >
              Select
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
