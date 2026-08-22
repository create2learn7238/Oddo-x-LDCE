import { useState } from 'react'
import { Sun, Moon, Camera, Sparkles, MapPin, Clock } from 'lucide-react'

const PHOTO_SPOTS = [
  {
    spot: 'White Desert (Dhordo, Kutch)',
    goldenMorning: '06:30 AM – 07:15 AM',
    goldenEvening: '05:40 PM – 06:35 PM',
    blueHour: '06:40 PM – 07:15 PM',
    bestAngle: 'Low-angle ultra-wide shot facing the setting sun to capture salt crystal reflections.',
    nightAstro: 'Full moon astrophotography under cloudless desert skies.'
  },
  {
    spot: 'Sabarmati Riverfront (Ahmedabad)',
    goldenMorning: '06:15 AM – 07:00 AM',
    goldenEvening: '05:50 PM – 06:40 PM',
    blueHour: '06:45 PM – 07:20 PM',
    bestAngle: 'Atal Pedestrian Bridge glowing under sunset skyline reflections over Sabarmati.',
    nightAstro: 'Long-exposure light trails from Ellis Bridge & Riverfront Park.'
  },
  {
    spot: 'Sun Temple & Sabha Mandap (Modhera)',
    goldenMorning: '06:20 AM – 07:05 AM',
    goldenEvening: '05:30 PM – 06:25 PM',
    blueHour: '06:30 PM – 07:05 PM',
    bestAngle: 'Standing at Rama Kunda stepwell with 108 miniature shrines catching the rising sun rays.',
    nightAstro: 'Illuminated temple stone friezes during the Modhera Dance Festival.'
  },
  {
    spot: 'Somnath Shore Temple (Veraval Coast)',
    goldenMorning: '06:25 AM – 07:10 AM',
    goldenEvening: '06:00 PM – 06:50 PM',
    blueHour: '06:55 PM – 07:30 PM',
    bestAngle: 'Promenade stone walkway capturing high tide crashing waves against the temple spire.',
    nightAstro: 'Floodlit Jyotirlinga shikhara with the sound of the Arabian Sea.'
  },
  {
    spot: 'Statue of Unity (Kevadia / Narmada Valley)',
    goldenMorning: '06:10 AM – 06:55 AM',
    goldenEvening: '05:45 PM – 06:35 PM',
    blueHour: '06:40 PM – 07:15 PM',
    bestAngle: 'Valley of Flowers garden viewpoint with the 182m bronze colossus in the background.',
    nightAstro: 'Laser sound & projection mapping show across the statue facade.'
  }
]

export default function GoldenHourSpotter() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const activeSpot = PHOTO_SPOTS[selectedIdx]

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Camera size={20} color="var(--color-warning)" />
            Golden Hour & Astrophotography Spotter
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Optimal lighting windows, sunset timing, and angle compositions for iconic monuments
          </p>
        </div>

        <span className="badge badge-warning">📸 Pro Photography</span>
      </div>

      {/* Spot Selector Chips */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-5)',
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none'
      }}>
        {PHOTO_SPOTS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`chip ${selectedIdx === idx ? 'active' : ''}`}
            style={{ fontSize: '11px', whiteSpace: 'nowrap', padding: '6px 12px' }}
          >
            📍 {s.spot.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {/* Timing Windows Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#F59E0B', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <Sun size={14} /> Morning Golden Light
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-base)', color: 'var(--color-text)' }}>
            {activeSpot.goldenMorning}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Soft dawn warmth, minimal crowds
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#EC4899', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <Sun size={14} /> Evening Crimson Glow
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-base)', color: 'var(--color-text)' }}>
            {activeSpot.goldenEvening}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Vibrant sunset reflections
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38BDF8', fontWeight: 700, fontSize: 'var(--fs-xs)', marginBottom: 4 }}>
            <Moon size={14} /> Blue Hour & Astro
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-base)', color: 'var(--color-text)' }}>
            {activeSpot.blueHour}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Deep blue twilight skies & illumination
          </div>
        </div>
      </div>

      {/* Composition Tips */}
      <div style={{ background: 'var(--color-surface3)', padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', marginBottom: 4 }}>
          🎯 <strong style={{ color: 'var(--color-warning)' }}>Recommended Angle:</strong> {activeSpot.bestAngle}
        </div>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
          ✨ <strong style={{ color: 'var(--color-primary-light)' }}>Night Highlight:</strong> {activeSpot.nightAstro}
        </div>
      </div>
    </div>
  )
}
