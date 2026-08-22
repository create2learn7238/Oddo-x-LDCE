import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX, Headphones, Play, Pause, Sparkles } from 'lucide-react'

const SOUNDS = [
  { id: 'desert', name: 'Desert Starlight Breeze', emoji: '🌌', desc: 'Rann of Kutch Night Wind', type: 'pink' },
  { id: 'waves', name: 'Arabian Sea Shoreline', emoji: '🌊', desc: 'Somnath & Mandvi Coastal Tides', type: 'brown' },
  { id: 'jungle', name: 'Gir Jungle Wildlife Rustle', emoji: '🦁', desc: 'Sasan Gir Forest Ambience', type: 'jungle' },
  { id: 'temple', name: 'Temple Bells & Harmonics', emoji: '🔔', desc: 'Evening Sacred Chimes', type: 'bells' }
]

export default function AmbientSoundscape() {
  const [activeSound, setActiveSound] = useState(null)
  const [volume, setVolume] = useState(0.4)
  const audioCtxRef = useRef(null)
  const gainNodeRef = useRef(null)
  const noiseSourceRef = useRef(null)
  const intervalRef = useRef(null)

  const stopAudio = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (noiseSourceRef.current) {
      try { noiseSourceRef.current.stop() } catch {}
      noiseSourceRef.current = null
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try { audioCtxRef.current.close() } catch {}
      audioCtxRef.current = null
    }
    setActiveSound(null)
  }

  const startSound = (sound) => {
    stopAudio()
    setActiveSound(sound.id)

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContext()
      audioCtxRef.current = ctx

      const gainNode = ctx.createGain()
      gainNode.gain.setValueAtTime(volume, ctx.currentTime)
      gainNode.connect(ctx.destination)
      gainNodeRef.current = gainNode

      if (sound.type === 'bells') {
        // Synthesize harmonic bell chimes using oscillators
        const playBell = () => {
          if (!audioCtxRef.current) return
          const osc = ctx.createOscillator()
          const bellGain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(587.33 + Math.random() * 200, ctx.currentTime) // D5 / E5 notes
          bellGain.gain.setValueAtTime(volume * 0.5, ctx.currentTime)
          bellGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5)
          osc.connect(bellGain)
          bellGain.connect(gainNode)
          osc.start()
          osc.stop(ctx.currentTime + 2.6)
        }
        playBell()
        intervalRef.current = setInterval(playBell, 3500)
      } else {
        // Generate procedural soothing noise buffer
        const bufferSize = ctx.sampleRate * 2
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const output = noiseBuffer.getChannelData(0)
        let lastOut = 0.0

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          if (sound.type === 'brown' || sound.type === 'waves') {
            output[i] = (lastOut + (0.02 * white)) / 1.02
            lastOut = output[i]
            output[i] *= 3.5
          } else {
            output[i] = (lastOut + (0.05 * white)) / 1.05
            lastOut = output[i]
            output[i] *= 2.0
          }
        }

        const whiteNoise = ctx.createBufferSource()
        whiteNoise.buffer = noiseBuffer
        whiteNoise.loop = true

        // Lowpass filter for smooth warmth
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(sound.type === 'waves' ? 380 : 520, ctx.currentTime)

        whiteNoise.connect(filter)
        filter.connect(gainNode)
        whiteNoise.start()
        noiseSourceRef.current = whiteNoise
      }
    } catch {
      setActiveSound(null)
    }
  }

  useEffect(() => {
    return () => stopAudio()
  }, [])

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Headphones size={20} color="var(--color-primary)" />
            Ambient Destination Soundscapes
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Procedural relaxing audio environments from Gujarat and iconic destinations
          </p>
        </div>

        {activeSound && (
          <button className="btn btn-danger btn-sm" onClick={stopAudio}>
            <VolumeX size={14} /> Stop Audio
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        {SOUNDS.map(sound => {
          const isPlaying = activeSound === sound.id
          return (
            <div
              key={sound.id}
              onClick={() => isPlaying ? stopAudio() : startSound(sound)}
              style={{
                padding: 'var(--space-4)',
                background: isPlaying ? 'var(--color-primary-glow)' : 'var(--color-surface2)',
                border: `1.5px solid ${isPlaying ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: '1.6rem' }}>{sound.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: isPlaying ? 'var(--color-primary-light)' : 'var(--color-text)' }}>
                    {sound.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                    {sound.desc}
                  </div>
                </div>
              </div>

              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isPlaying ? 'var(--color-primary)' : 'var(--color-surface3)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {isPlaying ? <Pause size={13} /> : <Play size={13} style={{ marginLeft: 2 }} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
