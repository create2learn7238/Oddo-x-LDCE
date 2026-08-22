import { useState } from 'react'
import { QrCode, Share2, Copy, Check, ExternalLink, Send, Mail } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function QRCodeShare({ tripId, tripName = 'GlobeTrotter Itinerary' }) {
  const { showToast } = useApp()
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/share/${tripId}`

  // Standard QR code API generation
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}&bgcolor=101024&color=6C63FF&margin=10`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    showToast('Public link copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2200)
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Check out my trip itinerary for "${tripName}" on GlobeTrotter! ✈️\n${shareUrl}`)
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const shareMail = () => {
    const subject = encodeURIComponent(`Travel Itinerary: ${tripName}`)
    const body = encodeURIComponent(`Hey!\n\nHere is our planned travel itinerary on GlobeTrotter:\n${shareUrl}\n\nHave a look!`)
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <QrCode size={20} color="var(--color-primary)" />
            Shareable Mobile QR Code & Instant Invite
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)', marginTop: 2 }}>
            Scan with any smartphone camera to open the live itinerary instantly
          </p>
        </div>
        <span className="badge badge-primary">📱 Mobile Ready</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-6)',
        alignItems: 'center',
        background: 'var(--color-surface2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        border: '1px solid var(--color-border)'
      }}>
        {/* QR Image Box */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            padding: 'var(--space-3)',
            background: '#fff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <img
              src={qrApiUrl}
              alt="Trip QR Code"
              style={{ width: 160, height: 160, display: 'block', borderRadius: 'var(--radius-sm)' }}
            />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 6 }}>
            Scan to view live travel plan
          </div>
        </div>

        {/* Action Buttons & Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: 'var(--fs-xs)' }}>Public Itinerary Link</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                className="form-input"
                readOnly
                value={shareUrl}
                style={{ fontSize: 'var(--fs-xs)', background: 'var(--color-surface3)' }}
              />
              <button className="btn btn-primary btn-sm" onClick={handleCopy} style={{ flexShrink: 0 }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 4 }}>
            <button className="btn btn-secondary btn-sm" onClick={shareWhatsApp}>
              <Send size={13} color="#25D366" /> WhatsApp
            </button>
            <button className="btn btn-secondary btn-sm" onClick={shareMail}>
              <Mail size={13} color="var(--color-primary-light)" /> Email
            </button>
            <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              <ExternalLink size={13} /> Open Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
