import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Sparkles, Compass, Play, Pause, Headphones } from 'lucide-react'

const AUDIO_TOURS = {
  'Ahmedabad': "Welcome to Ahmedabad, India's first UNESCO World Heritage City! Founded in 1411 on the banks of the Sabarmati river, Ahmedabad is famous for its intricate wooden pol houses, the historic Sabarmati Gandhi Ashram where the Dandi March began, and the breathtaking 15th-century Adalaj Stepwell.",
  'Rann of Kutch': "Welcome to the Great Rann of Kutch, one of the largest salt deserts in the world! Under the full moon, this white endless expanse glows like silver. During Rann Utsav, experience traditional Kutchi music, Rogan art, embroidery by local artisans, and sunset camel rides.",
  'Statue of Unity': "Standing at a monumental height of 182 meters on the Narmada river, the Statue of Unity is the tallest statue on Earth, honoring India's Iron Man Sardar Vallabhbhai Patel. The viewing gallery at 153 meters offers panoramic vistas of the Vindhya and Satpura mountain ranges.",
  'Gir National Park': "Welcome to Sasan Gir, the last global refuge of the majestic Asiatic Lion! Spanning over 1,400 square kilometers of dry deciduous scrub forest, Gir is also home to leopards, golden jackals, sambar deer, and over 300 species of migratory birds.",
  'Somnath': "Somnath Temple stands majestically on the rugged coast of the Arabian Sea. As the first among the twelve sacred Jyotirlinga shrines of Lord Shiva, it has a timeless history of resilience and features a nightly sound and light show against crashing ocean waves.",
  'Dwarka': "Dwarka is the ancient golden kingdom of Lord Krishna and one of the four sacred Char Dham pilgrimage sites. Explore the magnificent 5-story Dwarkadhish temple, sunset aartis at Gomti Ghat, and the pristine blue waters of Shivrajpur Blue Flag Beach."
}

export default function AudioCityGuide({ cityName = 'Ahmedabad' }) {
  const [playing, setPlaying] = useState(false)
  const text = AUDIO_TOURS[cityName] || `Discover the captivating history, vibrant culture, and timeless monuments of ${cityName}.`

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [cityName])

  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) return

    if (playing) {
      window.speechSynthesis.cancel()
      setPlaying(false)
    } else {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 1.0
      utterance.onend = () => setPlaying(false)
      utterance.onerror = () => setPlaying(false)
      window.speechSynthesis.speak(utterance)
      setPlaying(true)
    }
  }

  return (
    <div style={{
      background: 'var(--color-surface3)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4) var(--space-5)',
      marginTop: 'var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-light)' }}>
          <Headphones size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 'var(--fs-xs)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={12} color="var(--color-warning)" />
            Narration Audio Tour: {cityName}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', maxWidth: 460 }}>
            {playing ? 'Playing live voiceover narration...' : 'Listen to 60-second guided audio history'}
          </div>
        </div>
      </div>

      <button
        className={`btn btn-sm ${playing ? 'btn-danger' : 'btn-primary'}`}
        onClick={toggleAudio}
        style={{ fontSize: '11px', padding: '4px 12px' }}
      >
        {playing ? <><Pause size={12} /> Pause Tour</> : <><Play size={12} /> Play Audio Tour</>}
      </button>
    </div>
  )
}
