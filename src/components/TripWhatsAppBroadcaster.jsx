import { useState } from 'react'
import { MessageCircle, Send, Share2, Sparkles, Check, Globe } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function TripWhatsAppBroadcaster({ trip }) {
  const { showToast } = useApp()
  const [customMsg, setCustomMsg] = useState('')

  if (!trip) return null

  const firstCity = trip.stops?.[0]?.cityName || 'Gujarat'
  const stopCount = trip.stops?.length || 1

  const PRESETS = [
    `✈️ We are exploring ${firstCity} today on our "${trip.name}" trip! 🦁 Check out our live travel route:`,
    `🌕 Experiencing the magical White Desert & heritage circuits in Gujarat! 🛕 Follow our itinerary:`,
    `🚗 Highway road trip across ${stopCount} stops in Western India! Having an amazing journey:`,
    `🙏 Greetings from Gujarat! Enjoying incredible heritage, street food, and wildlife safaris:`
  ]

  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0])

  const handleShare = () => {
    const textToShare = customMsg.trim() || selectedPreset
    const fullUrl = `${window.location.origin}/share/${trip.id}`
    const finalMsg = `${textToShare}\n\n📍 Plan Link: ${fullUrl}`

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(finalMsg)}`
    window.open(waUrl, '_blank')
    showToast('WhatsApp broadcaster opened!', 'success')
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageCircle size={20} color="#25D366" />
            1-Click WhatsApp Live Status Broadcaster
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Broadcast real-time travel updates, hotel arrivals, and trip milestones to friends & family
          </p>
        </div>

        <span className="badge" style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)', fontWeight: 700 }}>
          💬 Instant Broadcast
        </span>
      </div>

      {/* Preset Chips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Choose Status Message Template:</label>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => { setSelectedPreset(p); setCustomMsg('') }}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              background: selectedPreset === p && !customMsg ? 'var(--color-surface3)' : 'var(--color-surface2)',
              border: `1.5px solid ${selectedPreset === p && !customMsg ? '#25D366' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
              fontSize: 'var(--fs-xs)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Custom Textarea */}
      <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
        <input
          className="form-input"
          placeholder="Or type a custom live status (e.g. Just checked into Sasan Jungle Lodge!)..."
          value={customMsg}
          onChange={e => setCustomMsg(e.target.value)}
        />
      </div>

      <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          🔗 Includes confirmed itinerary link & live stops
        </div>

        <button
          className="btn btn-sm"
          onClick={handleShare}
          style={{ background: '#25D366', color: '#fff', border: 'none', padding: '6px 16px', fontWeight: 700 }}
        >
          <MessageCircle size={15} /> Send WhatsApp Broadcast
        </button>
      </div>
    </div>
  )
}
